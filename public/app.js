'use strict';

// ════════════════════════════════════════════════════════
// ── Session ─────────────────────────────────────────────
// ════════════════════════════════════════════════════════
function getSession() {
  try { return JSON.parse(localStorage.getItem('ms_session') || 'null'); } catch { return null; }
}
function sauverSession(data) {
  localStorage.setItem('ms_session', JSON.stringify(data));
}
function deconnecterSession() {
  localStorage.removeItem('ms_session');
  localStorage.removeItem('ms_verif_token');
  localStorage.removeItem('ms_verif_tel');
}
function authHeader() {
  const s = getSession();
  return s?.token ? { 'Authorization': `Bearer ${s.token}` } : {};
}

// ════════════════════════════════════════════════════════
// ── Données utilisateur (cache local) ──────────────────
// ════════════════════════════════════════════════════════
function getUserLocal() {
  try { return JSON.parse(localStorage.getItem('ms_user') || 'null'); } catch { return null; }
}
function sauverUserLocal(user) {
  localStorage.setItem('ms_user', JSON.stringify(user));
}

// Fusionne les thumbnails du localStorage dans un user venant du serveur
// (le serveur ne stocke jamais les thumbnails pour limiter la taille Redis)
function restaurerThumbnails(userServeur) {
  const local = getUserLocal();
  if (!local?.historique_repas || !userServeur?.historique_repas) return userServeur;
  const indexThumbs = {};
  local.historique_repas.forEach(e => { if (e.thumbnail) indexThumbs[e.id] = e.thumbnail; });
  return {
    ...userServeur,
    historique_repas: userServeur.historique_repas.map(e => ({
      ...e,
      thumbnail: indexThumbs[e.id] || e.thumbnail || null
    }))
  };
}
function getPrenom()       { return getUserLocal()?.prenom || ''; }
function getMedicaments()  { return getUserLocal()?.medicaments || []; }
function getProcheContact()  { return getUserLocal()?.proche  || null; }
function getProcheContact2() { return getUserLocal()?.proche2 || null; }
function getHistorique()   { return getUserLocal()?.historique_repas || []; }

function patchUserLocal(patch) {
  const u      = getUserLocal() || { medicaments: [], historique_repas: [] };
  const fusion = { ...u, ...patch };
  sauverUserLocal(fusion);
  planifierSync(patch);
  return fusion;
}

// ════════════════════════════════════════════════════════
// ── Sync serveur (PUT /api/user, debouncé) ─────────────
// ════════════════════════════════════════════════════════
let syncTimer = null;
let syncPatchAccumule = {};

function planifierSync(patch) {
  if (!getSession()) return;
  Object.assign(syncPatchAccumule, patch);
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(envoyerSync, 800);
}

async function envoyerSync() {
  const patch = syncPatchAccumule;
  syncPatchAccumule = {};
  syncTimer = null;
  if (Object.keys(patch).length === 0) return;
  if (!getSession()) return;
  try {
    const r = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(patch)
    });
    if (r.status === 401) {
      deconnecterSession();
      localStorage.removeItem('ms_user');
      allerA('ecran-inscription');
      return;
    }
    if (!r.ok) return;
    const data = await r.json();
    if (data.user) sauverUserLocal(restaurerThumbnails(data.user));
  } catch { /* offline */ }
}

async function hydraterDepuisServeur() {
  if (!getSession()) return null;
  if (syncTimer || Object.keys(syncPatchAccumule).length > 0) return null;
  try {
    const r = await fetch('/api/user', { headers: authHeader() });
    if (r.status === 401) {
      deconnecterSession();
      localStorage.removeItem('ms_user');
      return null;
    }
    if (!r.ok) return null;
    const data = await r.json();
    if (data.user) sauverUserLocal(restaurerThumbnails(data.user));
    return data.user;
  } catch { return null; }
}

// ════════════════════════════════════════════════════════
// ── Navigation ─────────────────────────────────────────
// ════════════════════════════════════════════════════════
function allerA(ecranId) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const cible = document.getElementById(ecranId);
  if (cible) cible.classList.add('actif');
  window.scrollTo(0, 0);

  if (ecranId === 'ecran-urgence')    chargerEcranUrgence();
  if (ecranId === 'ecran-proche')     chargerFormulaireProche();
  if (ecranId === 'ecran-historique') chargerHistorique();
  if (ecranId === 'ecran-glycemie')   reinitGlyc();
}

function chargerFormulaireProche() {
  const session = getSession();
  document.getElementById('inp-profil-prenom').value = getPrenom();
  document.getElementById('inp-profil-tel').value    = session?.telephone || '';

  const proche  = getProcheContact();
  document.getElementById('inp-proche-prenom').value = proche?.prenom    || '';
  document.getElementById('inp-proche-tel').value    = proche?.telephone || '';

  const proche2 = getProcheContact2();
  document.getElementById('inp-proche2-prenom').value = proche2?.prenom    || '';
  document.getElementById('inp-proche2-tel').value    = proche2?.telephone || '';

  masquerZone('profil-sauve');
  masquerZone('proche-sauve');
  masquerZone('proche2-sauve');
  afficherStatutNotifications();

  const toggle = document.getElementById('toggle-mode-dev');
  if (toggle) toggle.checked = estModeDevActif();

  const toggleSenior = document.getElementById('toggle-senior-only');
  const labelSenior  = document.getElementById('label-senior-only');
  if (toggleSenior) toggleSenior.checked = estSeniorOnly();
  if (labelSenior)  labelSenior.textContent = estSeniorOnly() ? '✅ Activé — médicaments verrouillés' : 'Désactivé';
}

// ════════════════════════════════════════════════════════
// ── Déconnexion ────────────────────────────────────────
// ════════════════════════════════════════════════════════
function seDeconnecter() {
  if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return;
  deconnecterSession();
  localStorage.removeItem('ms_user');
  allerA('ecran-inscription');
}

// ════════════════════════════════════════════════════════
// ── Admin : liste & suppression d'utilisateurs (DEV) ───
// ════════════════════════════════════════════════════════
async function chargerListeUtilisateurs() {
  const conteneur = document.getElementById('liste-admin-users');
  if (!conteneur) return;
  conteneur.innerHTML = '<p style="color:#6B7280;font-size:15px">Chargement…</p>';

  try {
    const r    = await fetch('/api/admin/users', { headers: authHeader() });
    const data = await r.json();

    if (!r.ok) {
      conteneur.innerHTML = `<p style="color:var(--sos);font-size:15px">Erreur : ${data.erreur}</p>`;
      return;
    }

    if (!data.users.length) {
      conteneur.innerHTML = '<p style="color:#6B7280;font-size:15px">Aucun utilisateur enregistré.</p>';
      return;
    }

    _usersAdmin = data.users;  // cache pour le rapport
    conteneur.innerHTML = data.users.map(u => {
      const date   = u.cree_le ? new Date(u.cree_le).toLocaleDateString('fr-BE') : '—';
      const prenom = u.prenom || '(sans prénom)';
      const nbMeds = (u.medicaments || []).length;
      const nbRepas= (u.historique_repas || []).length;
      const tel    = u.telephone.replace(/'/g, '');
      return `
        <div style="background:white;border-radius:16px;padding:14px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.07)">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="flex:1;min-width:0">
              <div style="font-size:17px;font-weight:800;color:var(--texte)">${prenom}</div>
              <div style="font-size:13px;color:var(--texte-doux);margin-top:2px">${u.telephone}</div>
              <div style="font-size:12px;color:var(--texte-doux);margin-top:2px">
                Inscrit le ${date} · ${nbMeds} méd. · ${nbRepas} repas
              </div>
            </div>
            <button onclick="supprimerUtilisateur('${tel}')"
              style="background:var(--sos-clair);border:none;border-radius:12px;padding:10px 14px;font-size:14px;font-weight:700;color:var(--sos);cursor:pointer;flex-shrink:0">
              🗑️
            </button>
          </div>
          <button onclick="ouvrirRapportAdmin('${tel}')"
            style="width:100%;margin-top:10px;background:#F0F7F4;border:none;border-radius:12px;padding:10px 14px;font-size:14px;font-weight:700;color:var(--accent);cursor:pointer;text-align:left">
            📊 Voir le rapport de suivi
          </button>
        </div>`;
    }).join('');

  } catch (e) {
    conteneur.innerHTML = `<p style="color:var(--sos);font-size:15px">Erreur réseau.</p>`;
  }
}

async function supprimerUtilisateur(telephone) {
  if (!confirm(`Supprimer définitivement l'utilisateur ${telephone} ?`)) return;
  try {
    const r = await fetch(`/api/admin/users?tel=${encodeURIComponent(telephone)}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    if (r.ok) {
      chargerListeUtilisateurs(); // rafraîchir la liste
    } else {
      const d = await r.json();
      alert('Erreur : ' + (d.erreur || 'inconnue'));
    }
  } catch {
    alert('Erreur réseau.');
  }
}

// ════════════════════════════════════════════════════════
// ── Rapport admin ──────────────────────────────────────
// ════════════════════════════════════════════════════════
let _usersAdmin = [];

function ouvrirRapportAdmin(tel) {
  const u = _usersAdmin.find(x => x.telephone === tel);
  if (!u) return;

  const prenom = u.prenom || u.telephone;
  document.getElementById('rapport-titre').textContent = `📊 ${prenom}`;

  // ── Onglet actif par défaut : repas
  afficherOngletRapport('repas', u);

  // Boutons onglets
  document.querySelectorAll('.rapport-tab').forEach(btn => {
    btn.onclick = () => { afficherOngletRapport(btn.dataset.tab, u); };
  });

  allerA('ecran-admin-rapport');
}

function afficherOngletRapport(tab, u) {
  document.querySelectorAll('.rapport-tab').forEach(b => b.classList.toggle('actif', b.dataset.tab === tab));
  const corps = document.getElementById('rapport-corps');

  const fmt = ts => {
    const d = new Date(ts);
    return d.toLocaleDateString('fr-BE', { day:'2-digit', month:'2-digit' }) + ' ' +
           d.toLocaleTimeString('fr-BE', { hour:'2-digit', minute:'2-digit' });
  };

  if (tab === 'repas') {
    const repas = [...(u.historique_repas || [])].reverse();
    if (!repas.length) { corps.innerHTML = '<p class="rapport-vide">Aucun repas enregistré.</p>'; return; }
    corps.innerHTML = `
      <table class="rapport-table">
        <thead><tr><th>Date</th><th>Type</th><th>Plat / Conseil</th><th>IG</th><th>Indice</th></tr></thead>
        <tbody>${repas.map(r => {
          const ig = r.analyse?.index_glycemique ? ({ bas:'🟢 Bas', modere:'🟡 Modéré', eleve:'🔴 Élevé' })[r.analyse.index_glycemique] || '—' : '—';
          const id = r.analyse?.indice_diabete   ? ({ ok:'✅ OK', attention:'⚠️', eviter:'🚫' })[r.analyse.indice_diabete] || '—' : '—';
          const plat = r.analyse?.plat || r.conseil?.slice(0, 40) || '—';
          return `<tr>
            <td>${fmt(r.ts || r.id)}</td>
            <td>${r.type === 'photo' ? '📷' : '🎤'}</td>
            <td class="rapport-td-long">${plat}</td>
            <td>${ig}</td>
            <td>${id}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>`;

  } else if (tab === 'humeurs') {
    const humeurs = [...(u.bien_etre || [])].reverse();
    if (!humeurs.length) { corps.innerHTML = '<p class="rapport-vide">Aucune humeur enregistrée.</p>'; return; }
    corps.innerHTML = `
      <table class="rapport-table">
        <thead><tr><th>Date</th><th>Réponse</th><th>Question</th></tr></thead>
        <tbody>${humeurs.map(h => `<tr>
          <td>${fmt(h.ts)}</td>
          <td style="text-align:center;font-size:22px">${h.reponse === 'ok' ? '👍' : '👎'}</td>
          <td class="rapport-td-long">${h.question || '—'}</td>
        </tr>`).join('')}</tbody>
      </table>`;

  } else if (tab === 'medicaments') {
    const prises = [...(u.prises_medicaments || [])].reverse();
    if (!prises.length) { corps.innerHTML = '<p class="rapport-vide">Aucune prise enregistrée.</p>'; return; }
    const hasInsuline = prises.some(p => p.unites != null);
    corps.innerHTML = `
      <table class="rapport-table">
        <thead><tr><th>Date</th><th>Médicament</th><th>Période</th>${hasInsuline ? '<th>Unités</th>' : ''}</tr></thead>
        <tbody>${prises.map(p => {
          const d = new Date(p.ts);
          const dateHeure = d.toLocaleDateString('fr-BE', { day:'numeric', month:'short' }) + ' ' + d.toLocaleTimeString('fr-BE', { hour:'2-digit', minute:'2-digit' });
          return `<tr>
            <td>${dateHeure}</td>
            <td>${p.icone || '💊'} ${p.nom}</td>
            <td>${p.periode || '—'}</td>
            ${hasInsuline ? `<td>${p.unites != null ? `<strong>${p.unites} U</strong>` : '—'}</td>` : ''}
          </tr>`;
        }).join('')}</tbody>
      </table>`;
  }
}

// ════════════════════════════════════════════════════════
// ── Mode développeur ──────────────────────────────────
// ════════════════════════════════════════════════════════
function estModeDevActif() {
  return localStorage.getItem('ms_mode_dev') === 'true';
}

// ── Senior Only : verrouillage médicaments ────────────
function estSeniorOnly() {
  return localStorage.getItem('ms_senior_only') === 'true';
}
function basculerSeniorOnly(checkbox) {
  localStorage.setItem('ms_senior_only', checkbox.checked ? 'true' : 'false');
  const label = document.getElementById('label-senior-only');
  if (label) label.textContent = checkbox.checked ? '✅ Activé — médicaments verrouillés' : 'Désactivé';
  // Recharge l'écran médicaments si actif pour cacher/montrer les boutons
  if (document.getElementById('ecran-medicaments').classList.contains('actif')) chargerMedicaments();
}

function basculerModeDev(checkbox) {
  if (checkbox.checked) {
    localStorage.setItem('ms_mode_dev', 'true');
  } else {
    localStorage.removeItem('ms_mode_dev');
  }
  if (document.getElementById('ecran-historique').classList.contains('actif')) {
    chargerHistorique();
  }
}

function sauverProfil() {
  const prenom = document.getElementById('inp-profil-prenom').value.trim();
  patchUserLocal({ prenom: prenom || null });
  const el = document.getElementById('message-bonjour');
  if (el) el.textContent = messageBonjourComplet();
  afficherZone('profil-sauve');
  setTimeout(() => masquerZone('profil-sauve'), 2000);
}

// ════════════════════════════════════════════════════════
// ── Connexion (téléphone seul) ─────────────────────────
// ════════════════════════════════════════════════════════
async function seConnecter() {
  const telephone = document.getElementById('inp-tel').value.trim();
  const erreur    = document.getElementById('inscription-erreur');
  const btn       = document.getElementById('btn-continuer');
  erreur.classList.remove('visible');
  if (!telephone) return afficherErreur(erreur, 'Veuillez entrer votre numéro de téléphone.');
  btn.disabled = true;
  const texteOrig = btn.textContent;
  btn.textContent = '⏳ Connexion…';
  try {
    const r = await fetch('/api/auth/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone })
    });
    const data = await r.json();
    if (!r.ok) { afficherErreur(erreur, data.erreur || 'Erreur de connexion.'); return; }
    if (data.existe) {
      sauverSession({ telephone: data.user.telephone, token: data.session });
      sauverUserLocal(data.user);
      entrerDansAccueil();
    } else {
      localStorage.setItem('ms_verif_token', data.token);
      localStorage.setItem('ms_verif_tel', telephone);
      afficherEcranVerification(data.dev_code);
    }
  } catch {
    afficherErreur(erreur, 'Impossible de se connecter. Vérifiez votre connexion.');
  } finally {
    btn.disabled = false;
    btn.textContent = texteOrig;
  }
}

function afficherEcranVerification(devCode) {
  const banniere    = document.getElementById('dev-code-affiche');
  const instruction = document.getElementById('instruction-code');
  if (devCode) {
    banniere.innerHTML = `Mode test — votre code est :<strong>${devCode}</strong>`;
    banniere.classList.add('visible');
    instruction.innerHTML = 'Entrez le code à 4 chiffres<br>affiché ci-dessous';
  } else {
    banniere.classList.remove('visible');
    instruction.innerHTML = 'Entrez le code à 4 chiffres<br>reçu par SMS';
  }
  document.getElementById('inp-code').value = '';
  allerA('ecran-verification');
}

async function verifierCode() {
  const code   = document.getElementById('inp-code').value.trim();
  const erreur = document.getElementById('verification-erreur');
  const tel    = localStorage.getItem('ms_verif_tel') || '';
  const token  = localStorage.getItem('ms_verif_token') || '';
  erreur.classList.remove('visible');
  if (code.length !== 4) return afficherErreur(erreur, 'Le code fait 4 chiffres.');
  try {
    const r = await fetch('/api/auth/verifier-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone: tel, code, token })
    });
    const data = await r.json();
    if (!r.ok) { afficherErreur(erreur, data.erreur || 'Code incorrect.'); return; }
    sauverSession({ telephone: data.user.telephone, token: data.session });
    sauverUserLocal(data.user);
    localStorage.removeItem('ms_verif_token');
    localStorage.removeItem('ms_verif_tel');
    entrerDansAccueil();
  } catch {
    afficherErreur(erreur, 'Impossible de vérifier le code. Réessayez.');
  }
}

async function renvoyerCode() {
  const tel = localStorage.getItem('ms_verif_tel') || '';
  if (!tel) return allerA('ecran-inscription');
  try {
    const r = await fetch('/api/auth/envoyer-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone: tel })
    });
    const data = await r.json();
    if (r.ok && data.token) {
      localStorage.setItem('ms_verif_token', data.token);
      afficherEcranVerification(data.dev_code);
    }
  } catch { /* silencieux */ }
}

function entrerDansAccueil() {
  appliquerModeHeure();
  const el = document.getElementById('message-bonjour');
  if (el) el.textContent = messageBonjourComplet();
  allerA('ecran-accueil');
  chargerMedicaments();
  mettreAJourBoutonsAppel();
  afficherQuestionBienEtre();
}

function afficherErreur(el, msg) {
  el.textContent = msg;
  el.classList.add('visible');
}

// ════════════════════════════════════════════════════════
// ── Messages contextuels selon l'heure ────────────────
// ════════════════════════════════════════════════════════
function messageBonjourComplet() {
  const h      = new Date().getHours();
  const prenom = getPrenom();
  const nom    = prenom ? `, ${prenom}` : '';

  if (h >= 5  && h < 8)  return `Bonjour${nom} 🌅`;
  if (h >= 8  && h < 12) return `Bonjour${nom} ☀️`;
  if (h >= 12 && h < 14) return `Bon appétit${nom} 🍽️`;
  if (h >= 14 && h < 17) return `Bonne après-midi${nom} 🌤️`;
  if (h >= 17 && h < 20) return `Bonsoir${nom} 🌆`;
  if (h >= 20)           return `Bonsoir${nom} 🌙`;
  return `Bonne nuit${nom} 🌜`;
}

// ════════════════════════════════════════════════════════
// ── Couleur du header selon l'heure ───────────────────
// ════════════════════════════════════════════════════════
const PERIODES_HEURE = ['heure-nuit','heure-aube','heure-matin','heure-midi','heure-aprem','heure-soir','heure-crepuscule'];

function appliquerModeHeure() {
  const h = new Date().getHours();
  document.body.classList.toggle('mode-nuit-heure', h < 6 || h >= 21);

  // Classe colorée selon la plage horaire
  let periode;
  if      (h >= 21 || h <  5)  periode = 'heure-nuit';
  else if (h >= 5  && h <  8)  periode = 'heure-aube';
  else if (h >= 8  && h < 12)  periode = 'heure-matin';
  else if (h >= 12 && h < 14)  periode = 'heure-midi';
  else if (h >= 14 && h < 18)  periode = 'heure-aprem';
  else if (h >= 18 && h < 20)  periode = 'heure-soir';
  else                          periode = 'heure-crepuscule';

  PERIODES_HEURE.forEach(p => document.body.classList.remove(p));
  document.body.classList.add(periode);
}

// ════════════════════════════════════════════════════════
// ── Question bien-être quotidienne ────────────────────
// ════════════════════════════════════════════════════════
const QUESTIONS_BIENETRE = [
  { q: 'Comment vous sentez-vous en ce moment ?', e: '💛' },
  { q: 'Avez-vous bien dormi cette nuit ?',        e: '🌙' },
  { q: 'Êtes-vous de bonne humeur aujourd\'hui ?', e: '😊' },
  { q: 'Vous sentez-vous en forme ce matin ?',     e: '🌅' },
  { q: 'Avez-vous mangé quelque chose de bon ?',   e: '🍳' },
  { q: 'Êtes-vous au chaud et confortable ?',      e: '🏠' },
  { q: 'Avez-vous bu assez d\'eau aujourd\'hui ?', e: '💧' },
  { q: 'Avez-vous eu de bonnes nouvelles aujourd\'hui ?', e: '📬' },
  { q: 'Faites-vous quelque chose d\'agréable ?',  e: '🌸' },
  { q: 'Avez-vous parlé à quelqu\'un de cher ?',   e: '💬' },
  { q: 'Vous sentez-vous calme et serein(e) ?',    e: '🍃' },
  { q: 'Avez-vous pris le temps de vous reposer ?',e: '☕' },
  { q: 'La journée se passe bien pour vous ?',     e: '🌈' },
  { q: 'Avez-vous souri aujourd\'hui ?',           e: '😄' },
  { q: 'Êtes-vous bien entouré(e) ?',              e: '🤗' },
  { q: 'Vous sentez-vous d\'attaque pour la journée ?', e: '⚡' },
  { q: 'Avez-vous fait une petite promenade ?',    e: '🌿' },
  { q: 'La météo est agréable pour vous aujourd\'hui ?', e: '☀️' },
  { q: 'Avez-vous quelque chose de sympa prévu ?', e: '🎉' },
  { q: 'Prenez-vous bien soin de vous ?',          e: '💖' },
];

const REPONSES_OUI = [
  'Quelle belle nouvelle, ça me réjouit ! 🌟',
  'Super ! Profitez bien de cette belle journée 🌈',
  'Fantastique ! Continuez comme ça 💪',
  'Voilà qui fait chaud au cœur ! ☀️',
  'Merveilleux ! Vous méritez ça 🌸',
];
const REPONSES_NON = [
  'Merci de me le dire… Prenez bien soin de vous 💙',
  'Je suis là avec vous. N\'hésitez pas à appeler un proche 🤗',
  'Ça ira mieux bientôt. Courage ! 💛',
  'Soyez doux(ce) avec vous-même aujourd\'hui 🍃',
  'Pensez à vous reposer. Je veille sur vous 💜',
];

function questionDuJour() {
  const d   = new Date();
  const idx = (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % QUESTIONS_BIENETRE.length;
  return QUESTIONS_BIENETRE[idx];
}

function afficherQuestionBienEtre() {
  const carte = document.getElementById('carte-bienetre');
  if (!carte) return;

  // Vérifie si déjà répondu aujourd'hui
  const today    = new Date().toDateString();
  const dejaDone = localStorage.getItem('ms_bienetre_date') === today;
  if (dejaDone) { carte.style.display = 'none'; return; }

  const { q, e } = questionDuJour();
  const el = document.getElementById('bienetre-question');
  if (el) el.innerHTML = `<span class="bienetre-emoji">${e}</span>${q}`;

  carte.style.display = 'block';
  // Animation d'entrée
  carte.classList.remove('bienetre-visible');
  requestAnimationFrame(() => requestAnimationFrame(() => carte.classList.add('bienetre-visible')));
}

async function repondreBienEtre(reponse) {
  const today = new Date().toDateString();
  localStorage.setItem('ms_bienetre_date', today);

  // Affiche la réponse chaleureuse
  const btns   = document.getElementById('bienetre-btns');
  const merci  = document.getElementById('bienetre-merci');
  if (btns)  btns.style.display  = 'none';
  if (merci) {
    const pool   = reponse === 'ok' ? REPONSES_OUI : REPONSES_NON;
    merci.textContent = pool[Math.floor(Math.random() * pool.length)];
    merci.style.display = 'block';
  }

  // Envoie au serveur (silencieux en cas d'erreur)
  try {
    const { q } = questionDuJour();
    await fetch('/api/bien-etre', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ reponse, question: q })
    });
  } catch { /* silencieux */ }

  // Ferme la carte après 2,5s
  setTimeout(() => {
    const carte = document.getElementById('carte-bienetre');
    if (carte) carte.classList.remove('bienetre-visible');
    setTimeout(() => { if (carte) carte.style.display = 'none'; }, 350);
  }, 2500);
}

// ════════════════════════════════════════════════════════
// ── Boutons appel urgence (accueil) ───────────────────
// ════════════════════════════════════════════════════════
function mettreAJourBoutonsAppel() {
  const user    = getUserLocal();
  const proche  = user?.proche;
  const proche2 = user?.proche2;
  const label1    = document.getElementById('label-proche1');
  const label2    = document.getElementById('label-proche2');
  const sublabel1 = document.getElementById('sublabel-proche1');
  const sublabel2 = document.getElementById('sublabel-proche2');
  const btn1 = document.getElementById('btn-appel-proche1');
  const btn2 = document.getElementById('btn-appel-proche2');

  if (label1) label1.textContent    = proche?.prenom || '—';
  if (sublabel1) sublabel1.textContent = proche ? (proche.telephone || 'Proche 1') : 'Non configuré';
  if (btn1) btn1.classList.toggle('non-configure', !proche?.telephone);

  if (label2) label2.textContent    = proche2?.prenom || '—';
  if (sublabel2) sublabel2.textContent = proche2 ? (proche2.telephone || 'Proche 2') : 'Non configuré';
  if (btn2) btn2.classList.toggle('non-configure', !proche2?.telephone);
}

function appelerProche(numero) {
  const user   = getUserLocal();
  const proche = numero === 1 ? user?.proche : user?.proche2;
  if (!proche?.telephone) {
    alert(`Proche ${numero} non configuré.\nAllez dans ⚙️ Paramètres pour l'ajouter.`);
    return;
  }
  window.location.href = `tel:${proche.telephone}`;
}

// ════════════════════════════════════════════════════════
// ── Photo repas ────────────────────────────────────────
// ════════════════════════════════════════════════════════
function ouvrirPhoto() { document.getElementById('input-photo').click(); }

async function analyserPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const fichier   = input.files[0];
  const base64    = await lireEnBase64(fichier);
  afficherZone('zone-analyse');
  masquerZone('zone-voix');
  masquerZone('zone-conseil');
  const thumbnail = await genererThumbnail(base64, fichier.type);
  try {
    const res  = await fetch('/api/analyser-repas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, type: fichier.type })
    });
    const data = await res.json();
    if (data.est_nourriture === false) {
      masquerZone('zone-analyse');
      document.getElementById('texte-conseil').textContent = data.conseil;
      afficherZone('zone-conseil');
      input.value = '';
      return; // pas d'enregistrement
    }
    afficherConseil(data.conseil, '', 'photo', data.analyse, thumbnail);
  } catch {
    afficherConseil("Je n'arrive pas à analyser la photo. Essayez de décrire votre repas à voix haute.", '', 'photo', null, null);
  }
  input.value = '';
}

// Thumbnail : max 240px, JPEG 65%
function genererThumbnail(base64, mimeType) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAX   = 240;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const w = Math.round(img.width  * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.65));
    };
    img.onerror = () => resolve(null);
    img.src = `data:${mimeType || 'image/jpeg'};base64,${base64}`;
  });
}

function lireEnBase64(fichier) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(fichier);
  });
}

// ════════════════════════════════════════════════════════
// ── Voix ───────────────────────────────────────────────
// ════════════════════════════════════════════════════════
let reconnaissance = null;

function commencerVoix() {
  afficherZone('zone-voix');
  masquerZone('zone-analyse');
  masquerZone('zone-conseil');
  document.getElementById('texte-reconnu').textContent = '';
  document.getElementById('btn-envoyer-repas').style.display = 'none';
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('texte-reconnu').textContent = "La reconnaissance vocale n'est pas disponible sur ce navigateur.";
    return;
  }
  reconnaissance = new SpeechRecognition();
  reconnaissance.lang = 'fr-FR';
  reconnaissance.interimResults = true;
  reconnaissance.continuous = false;
  reconnaissance.onresult = (event) => {
    let texte = '';
    for (let i = event.resultIndex; i < event.results.length; i++) texte += event.results[i][0].transcript;
    document.getElementById('texte-reconnu').textContent = texte;
    if (event.results[event.results.length - 1].isFinal) document.getElementById('btn-envoyer-repas').style.display = 'block';
  };
  reconnaissance.onerror = () => {
    document.getElementById('texte-reconnu').textContent = "Je n'ai pas entendu. Appuyez à nouveau et parlez clairement.";
  };
  reconnaissance.start();
}

async function envoyerRepas() {
  const texte = document.getElementById('texte-reconnu').textContent;
  if (!texte) return;
  afficherZone('zone-analyse');
  masquerZone('zone-voix');
  masquerZone('zone-conseil');
  try {
    const res  = await fetch('/api/analyser-repas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texte })
    });
    const data = await res.json();
    afficherConseil(data.conseil, texte, 'vocal', data.analyse, null);
  } catch {
    afficherConseil('Votre repas a bien été noté. Continuez à bien manger !', '', 'vocal', null, null);
  }
}

function fermerConseil() {
  masquerZone('zone-conseil');
  masquerZone('zone-analyse');
  const igZone = document.getElementById('repas-ig-zone');
  if (igZone) igZone.style.display = 'none';
}

function afficherConseil(texte, description, type, analyse, thumbnail) {
  masquerZone('zone-analyse');
  document.getElementById('texte-conseil').textContent = texte;

  // ── Index glycémique du repas ─────────────────────────
  const igZone = document.getElementById('repas-ig-zone');
  if (igZone) {
    const igMap = {
      bas:    { label: 'Bas',    emoji: '🟢', cls: 'ig-bas',    desc: 'Bonne tolérance glycémique' },
      modere: { label: 'Modéré', emoji: '🟡', cls: 'ig-modere', desc: 'À consommer avec modération' },
      eleve:  { label: 'Élevé',  emoji: '🔴', cls: 'ig-eleve',  desc: 'Impact glycémique important' }
    };
    const idMap = {
      ok:        '✅ OK pour les diabétiques',
      attention: '⚠️ Attention, à doser',
      eviter:    '🚫 À éviter si possible'
    };
    const ig = analyse?.index_glycemique ? igMap[analyse.index_glycemique] : null;
    const id = analyse?.indice_diabete   ? idMap[analyse.indice_diabete]   : null;

    if (ig) {
      igZone.style.display = '';
      igZone.innerHTML = `
        <div class="repas-ig-carte">
          <div class="repas-ig-titre">Index glycémique</div>
          <div class="repas-ig-ligne">
            <span class="ig-badge ${ig.cls}" style="font-size:16px;padding:6px 16px">${ig.emoji} ${ig.label}</span>
            <span class="repas-ig-desc">${ig.desc}</span>
          </div>
          ${id ? `<div class="repas-ig-diabete">${id}</div>` : ''}
          ${analyse.remarque_diabete ? `<div class="repas-ig-remarque">💡 ${analyse.remarque_diabete}</div>` : ''}
        </div>`;
    } else {
      igZone.style.display = 'none';
    }
  }

  afficherZone('zone-conseil');
  sauverRepas(description, texte, type, analyse, thumbnail);
}

// ════════════════════════════════════════════════════════
// ── Glycémie saisie directe (carte dans écran repas) ───
// ════════════════════════════════════════════════════════
function indicateurGlycTexte(val) {
  if (isNaN(val))   return { texte: '', cls: '' };
  if (val < 70)     return { texte: '🔴 Hypoglycémie — Mangez quelque chose de sucré !', cls: 'glyc-ind-bas' };
  if (val <= 126)   return { texte: '🟢 Normal — Bonne glycémie !', cls: 'glyc-ind-ok' };
  if (val <= 180)   return { texte: '🟡 Élevé — Attention à ce que vous mangez.', cls: 'glyc-ind-elevee' };
  return { texte: '🔴 Très élevé — Consultez votre médecin.', cls: 'glyc-ind-tres-elevee' };
}

function mettreAJourIndicateurGlycRepas() {
  const val = parseFloat(document.getElementById('inp-glycemie-repas')?.value);
  const ind = document.getElementById('glyc-repas-indicateur');
  if (!ind) return;
  const { texte, cls } = indicateurGlycTexte(val);
  ind.textContent = texte;
  ind.className   = 'glycemie-indicateur' + (cls ? ' ' + cls : '');
  ind.style.minHeight = texte ? '' : '0';
  ind.style.padding   = texte ? '' : '0';
}

function sauverGlycemieRepas() {
  const valeur = parseInt(document.getElementById('inp-glycemie-repas')?.value, 10);
  if (isNaN(valeur) || valeur < 20 || valeur > 600) {
    alert('Valeur invalide. Entrez une valeur entre 20 et 600 mg/dL.');
    return;
  }
  const historique = getHistorique();
  historique.unshift({
    id:     Date.now(),
    date:   new Date().toISOString(),
    type:   'glycemie',
    valeur: valeur,
    unite:  'mg/dL'
  });
  patchUserLocal({ historique_repas: historique.slice(0, 60) });
  syncUserServeur();

  // Feedback visuel
  const conf = document.getElementById('glyc-repas-confirm');
  if (conf) { conf.classList.add('visible'); setTimeout(() => conf.classList.remove('visible'), 2500); }
  document.getElementById('inp-glycemie-repas').value = '';
  mettreAJourIndicateurGlycRepas();
}

// ════════════════════════════════════════════════════════
// ── Glycémie ───────────────────────────────────────────
// ════════════════════════════════════════════════════════
function reinitGlyc() {
  const inp = document.getElementById('inp-glycemie');
  if (inp) inp.value = '';
  const ind = document.getElementById('glycemie-indicateur');
  if (ind) { ind.textContent = ''; ind.className = 'glycemie-indicateur'; }
  const err = document.getElementById('glycemie-erreur');
  if (err) err.classList.remove('visible');
}

function mettreAJourIndicateurGlyc() {
  const val = parseInt(document.getElementById('inp-glycemie').value, 10);
  const ind = document.getElementById('glycemie-indicateur');
  if (!ind) return;
  if (isNaN(val)) { ind.textContent = ''; ind.className = 'glycemie-indicateur'; return; }
  if (val < 70) {
    ind.textContent = '🔴 Hypoglycémie — Consultez rapidement !';
    ind.className = 'glycemie-indicateur glyc-ind-bas';
  } else if (val <= 126) {
    ind.textContent = '🟢 Normal — Très bien !';
    ind.className = 'glycemie-indicateur glyc-ind-ok';
  } else if (val <= 180) {
    ind.textContent = '🟡 Élevé — Soyez attentif.';
    ind.className = 'glycemie-indicateur glyc-ind-elevee';
  } else {
    ind.textContent = '🔴 Très élevé — Consultez votre médecin.';
    ind.className = 'glycemie-indicateur glyc-ind-tres-elevee';
  }
}

function sauverGlychemie() {
  const valeur = parseInt(document.getElementById('inp-glycemie').value, 10);
  const erreur = document.getElementById('glycemie-erreur');
  erreur.classList.remove('visible');
  if (isNaN(valeur) || valeur < 20 || valeur > 600) {
    afficherErreur(erreur, 'Valeur invalide. Entrez une valeur entre 20 et 600 mg/dL.');
    return;
  }
  const historique = getHistorique();
  historique.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    type: 'glycemie',
    valeur: valeur,
    unite: 'mg/dL'
  });
  patchUserLocal({ historique_repas: historique.slice(0, 60) });
  allerA('ecran-bravo');
}

// ════════════════════════════════════════════════════════
// ── Historique — Calendrier ─────────────────────────────
// ════════════════════════════════════════════════════════
const calendrierEtat = {
  annee: new Date().getFullYear(),
  mois:  new Date().getMonth(),
  jourSelectionne: null
};

function chargerHistorique() {
  const conteneur  = document.getElementById('liste-historique');
  const historique = getHistorique();
  if (historique.length === 0) {
    conteneur.innerHTML = '<p class="chargement-meds">Aucune entrée enregistrée pour le moment.</p>';
    return;
  }
  conteneur.innerHTML = rendreCalendrier(historique);
}

function rendreCalendrier(historique) {
  const { annee, mois, jourSelectionne } = calendrierEtat;
  const moisNoms = ['Janvier','Février','Mars','Avril','Mai','Juin',
                    'Juillet','Août','Septembre','Octobre','Novembre','Décembre'];

  const parJour = {};
  historique.forEach(e => {
    const d   = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!parJour[key]) parJour[key] = [];
    parJour[key].push(e);
  });

  const premierJour = new Date(annee, mois, 1).getDay();
  const debutLundi  = (premierJour + 6) % 7;
  const nbJours     = new Date(annee, mois + 1, 0).getDate();
  const aujourd     = new Date();

  const estAujourd = j => annee === aujourd.getFullYear() && mois === aujourd.getMonth() && j === aujourd.getDate();
  const estFutur   = j => new Date(annee, mois, j) > aujourd;

  let html = `
  <div class="calendrier">
    <div class="calendrier-nav">
      <button class="btn-cal-nav" onclick="naviguerMois(-1)">◀</button>
      <span class="calendrier-titre">${moisNoms[mois]} ${annee}</span>
      <button class="btn-cal-nav" onclick="naviguerMois(1)">▶</button>
    </div>
    <div class="calendrier-grille">
      <div class="cal-entete">Lu</div><div class="cal-entete">Ma</div>
      <div class="cal-entete">Me</div><div class="cal-entete">Je</div>
      <div class="cal-entete">Ve</div><div class="cal-entete">Sa</div>
      <div class="cal-entete">Di</div>`;

  for (let i = 0; i < debutLundi; i++) html += `<div class="cal-jour vide"></div>`;

  for (let j = 1; j <= nbJours; j++) {
    const key     = `${annee}-${String(mois+1).padStart(2,'0')}-${String(j).padStart(2,'0')}`;
    const entrees = parJour[key] || [];
    const hasRepas = entrees.some(e => e.type === 'photo' || e.type === 'vocal');
    const hasGlyc  = entrees.some(e => e.type === 'glycemie');
    const futur    = estFutur(j);
    const cls = ['cal-jour',
      estAujourd(j)         ? 'cal-aujourdhui' : '',
      jourSelectionne === j ? 'cal-selectionne' : '',
      futur                 ? 'cal-futur'       : '',
    ].filter(Boolean).join(' ');

    html += `<div class="${cls}" ${!futur ? `onclick="selectionnerJour(${j})"` : ''}>
      <span class="cal-numero">${j}</span>
      <div class="cal-dots">
        ${hasRepas ? '<span class="cal-dot dot-repas"></span>' : ''}
        ${hasGlyc  ? '<span class="cal-dot dot-glyc"></span>'  : ''}
      </div>
    </div>`;
  }
  html += `</div></div>`;

  if (jourSelectionne) {
    const key     = `${annee}-${String(mois+1).padStart(2,'0')}-${String(jourSelectionne).padStart(2,'0')}`;
    const entrees = (parJour[key] || []).sort((a, b) => new Date(a.date) - new Date(b.date));
    html += `<div class="cal-detail"><div class="cal-detail-titre">📅 ${jourSelectionne} ${moisNoms[mois]} ${annee}</div>`;
    if (entrees.length === 0) {
      html += `<p class="cal-vide">Aucune entrée ce jour-là.</p>`;
    } else {
      entrees.forEach(e => { html += rendreEntreeHistorique(e); });
    }
    html += `</div>`;
  }
  return html;
}

function naviguerMois(delta) {
  calendrierEtat.mois += delta;
  if (calendrierEtat.mois > 11) { calendrierEtat.mois = 0;  calendrierEtat.annee++; }
  if (calendrierEtat.mois < 0)  { calendrierEtat.mois = 11; calendrierEtat.annee--; }
  calendrierEtat.jourSelectionne = null;
  chargerHistorique();
}

function selectionnerJour(jour) {
  calendrierEtat.jourSelectionne = (calendrierEtat.jourSelectionne === jour) ? null : jour;
  chargerHistorique();
}

function rendreEntreeHistorique(repas) {
  const date  = new Date(repas.date);
  const heure = date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });

  if (repas.type === 'glycemie') {
    const v   = repas.valeur;
    // Support ancien format mmol/L (valeurs < 40) + nouveau mg/dL
    const estMgDL = (repas.unite === 'mg/dL' || v > 40);
    const vRef    = estMgDL ? v : v * 18; // normalise en mg/dL pour la comparaison
    const cls = vRef < 70 ? 'glyc-bas' : vRef <= 126 ? 'glyc-ok' : vRef <= 180 ? 'glyc-haut' : 'glyc-tres-haut';
    const ico = vRef < 70 ? '🔴' : vRef <= 126 ? '🟢' : vRef <= 180 ? '🟡' : '🔴';
    return `<div class="historique-carte glycemie-carte ${cls}">
      <div class="historique-entete">
        <span class="historique-icone">📊</span>
        <div class="historique-date">
          <span class="historique-jour">Glycémie</span>
          <span class="historique-heure">${heure}</span>
        </div>
      </div>
      <div class="glycemie-valeur">${v} ${repas.unite} ${ico}</div>
    </div>`;
  }

  const modeDev  = estModeDevActif();
  const icone    = repas.type === 'photo' ? '📷' : '🎤';
  const tableau  = (modeDev && repas.analyse) ? rendreTableauNutritionnel(repas.analyse) : '';
  const photoHtml = repas.thumbnail ? `<img class="historique-photo" src="${repas.thumbnail}" alt="Photo du repas" />` : '';

  return `<div class="historique-carte">
    <div class="historique-entete">
      <span class="historique-icone">${icone}</span>
      <div class="historique-date"><span class="historique-heure">${heure}</span></div>
    </div>
    ${repas.description ? `<p class="historique-description">"${repas.description}"</p>` : ''}
    <p class="historique-conseil">${repas.conseil}</p>
    ${tableau}
    ${photoHtml}
  </div>`;
}

function rendreTableauNutritionnel(a) {
  if (!a) return '';
  const num = (v, u) => (v === null || v === undefined) ? '—' : `${v} ${u}`;
  const indices  = { bas: { label: 'Bas', cls: 'ig-bas' }, modere: { label: 'Modéré', cls: 'ig-modere' }, eleve: { label: 'Élevé', cls: 'ig-eleve' } };
  const diabetes = { ok: { label: '✅ OK', cls: 'ind-ok' }, attention: { label: '⚠️ Attention', cls: 'ind-attention' }, eviter: { label: '🚫 À éviter', cls: 'ind-eviter' } };
  const ig = indices[a.index_glycemique]  || null;
  const id = diabetes[a.indice_diabete]   || null;
  return `<div class="analyse-dev">
    <div class="analyse-dev-titre">🛠️ Analyse détaillée (Mode DEV)</div>
    ${a.plat ? `<div class="analyse-dev-plat"><strong>${a.plat}</strong>${a.portion ? ` <span class="analyse-dev-portion">· ${a.portion}</span>` : ''}</div>` : ''}
    <table class="analyse-dev-table">
      <tr><td>Calories</td><td>${num(a.calories,'kcal')}</td></tr>
      <tr><td>Glucides</td><td>${num(a.glucides_g,'g')}</td></tr>
      <tr class="souligne-sucres"><td>dont sucres</td><td>${num(a.sucres_g,'g')}</td></tr>
      <tr><td>Lipides</td><td>${num(a.lipides_g,'g')}</td></tr>
      <tr><td>Protéines</td><td>${num(a.proteines_g,'g')}</td></tr>
      <tr><td>Fibres</td><td>${num(a.fibres_g,'g')}</td></tr>
      <tr><td>Sel</td><td>${num(a.sel_g,'g')}</td></tr>
      ${ig ? `<tr><td>Index glycémique</td><td><span class="ig-badge ${ig.cls}">${ig.label}</span></td></tr>` : ''}
      ${id ? `<tr><td>Indice diabète</td><td><span class="ind-badge ${id.cls}">${id.label}</span></td></tr>` : ''}
    </table>
    ${a.remarque_diabete ? `<div class="analyse-dev-remarque">💡 ${a.remarque_diabete}</div>` : ''}
  </div>`;
}

// ════════════════════════════════════════════════════════
// ── Sauvegarde repas ───────────────────────────────────
// ════════════════════════════════════════════════════════
function sauverRepas(description, conseil, type, analyse, thumbnail) {
  const historique = getHistorique();
  const entree = {
    id: Date.now(),
    date: new Date().toISOString(),
    type: type || 'vocal',
    description: description || '',
    conseil,
    analyse:   analyse   || null,
    thumbnail: thumbnail || null   // stocké localement uniquement
  };
  historique.unshift(entree);
  const tranche = historique.slice(0, 60);

  // Sauvegarde locale complète (avec thumbnails)
  const userLocal = getUserLocal() || {};
  sauverUserLocal({ ...userLocal, historique_repas: tranche });

  // Sync serveur sans thumbnails (Redis ne doit pas stocker des images)
  const sansThumbs = tranche.map(({ thumbnail: _t, ...rest }) => rest);
  planifierSync({ historique_repas: sansThumbs });
}

// ════════════════════════════════════════════════════════
// ── Proche aidant ──────────────────────────────────────
// ════════════════════════════════════════════════════════
function sauverProche() {
  const prenom = document.getElementById('inp-proche-prenom').value.trim();
  const tel    = document.getElementById('inp-proche-tel').value.trim();
  if (!prenom || !tel) return;
  patchUserLocal({ proche: { prenom, telephone: tel } });
  afficherZone('proche-sauve');
  mettreAJourBoutonsAppel();
  setTimeout(() => { masquerZone('proche-sauve'); allerA('ecran-accueil'); }, 1500);
}

function sauverProche2() {
  const prenom = document.getElementById('inp-proche2-prenom').value.trim();
  const tel    = document.getElementById('inp-proche2-tel').value.trim();
  if (!prenom || !tel) return;
  patchUserLocal({ proche2: { prenom, telephone: tel } });
  afficherZone('proche2-sauve');
  mettreAJourBoutonsAppel();
  setTimeout(() => masquerZone('proche2-sauve'), 2000);
}

function chargerEcranUrgence() {
  const proche   = getProcheContact();
  const infoEl   = document.getElementById('urgence-proche-info');
  const pasEl    = document.getElementById('urgence-pas-de-proche');
  const btn      = document.getElementById('btn-alerter-proche');
  const btnTexte = document.getElementById('btn-alerter-texte');

  btn.disabled = false;
  btnTexte.textContent = 'Prévenir ma famille';
  masquerZone('urgence-confirmation');
  btn.style.display = '';

  if (proche) {
    infoEl.innerHTML = `Votre proche aidant : <strong>${proche.prenom}</strong><br>${proche.telephone}`;
    afficherZone('urgence-proche-info');
    masquerZone('urgence-pas-de-proche');
    btnTexte.textContent = `Prévenir ${proche.prenom}`;
  } else {
    masquerZone('urgence-proche-info');
    afficherZone('urgence-pas-de-proche');
    btn.disabled = true;
  }
}

async function envoyerAlerteUrgence() {
  const proche = getProcheContact();
  const btn    = document.getElementById('btn-alerter-proche');
  const prenom = getPrenom() || 'Votre proche';
  btn.disabled = true;
  document.getElementById('btn-alerter-texte').textContent = 'Envoi en cours…';
  try {
    const r = await fetch('/api/urgence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toISOString(), prenom_utilisateur: prenom, telephone_proche: proche?.telephone || '', telephone_utilisateur: getSession()?.telephone || '' })
    });
    const data = await r.json();
    if (!data.ok) {
      document.getElementById('btn-alerter-texte').textContent = '⚠️ Échec — vérifier la configuration';
      btn.disabled = false;
      return;
    }
  } catch { /* réseau, on affiche quand même */ }
  afficherZone('urgence-confirmation');
  btn.style.display = 'none';
}

// ════════════════════════════════════════════════════════
// ── Scan médicament par photo ──────────────────────────
// ════════════════════════════════════════════════════════
function ouvrirScanMedicament() { document.getElementById('input-scan-med').click(); }

async function analyserMedicamentPhoto(input) {
  if (!input.files?.[0]) return;
  const fichier   = input.files[0];
  const base64    = await lireEnBase64(fichier);
  const resultat  = document.getElementById('scan-med-resultat');
  resultat.classList.add('visible');
  resultat.innerHTML = '<span>⏳ Analyse du médicament en cours…</span>';
  try {
    const r    = await fetch('/api/analyser-medicament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, type: fichier.type })
    });
    const data = await r.json();
    if (data.nom) {
      document.getElementById('inp-med-nom').value = data.nom;
      if (data.instructions && document.getElementById('inp-med-posologie')) {
        document.getElementById('inp-med-posologie').value = data.instructions;
      }
      resultat.innerHTML = `
        <div class="scan-ok">
          <div class="scan-ok-nom">✅ ${data.nom}</div>
          ${data.indication ? `<div class="scan-indication">💡 ${data.indication}</div>` : ''}
          ${data.instructions ? `<div class="scan-posologie">📋 ${data.instructions}</div>` : ''}
        </div>`;
    } else {
      resultat.innerHTML = '<span class="scan-err">❌ Médicament non reconnu. Entrez le nom manuellement.</span>';
    }
  } catch {
    resultat.innerHTML = "<span class='scan-err'>❌ Erreur lors de l'analyse. Entrez le nom manuellement.</span>";
  }
  input.value = '';
}

// ════════════════════════════════════════════════════════
// ── Médicaments ────────────────────────────────────────
// ════════════════════════════════════════════════════════
function sauverMedicaments(liste) { patchUserLocal({ medicaments: liste }); }

function estDuAujourdhui(med) {
  const f = med.frequence || 'quotidien';
  if (f === 'quotidien') return true;
  const d = new Date();
  if (f === 'hebdomadaire') return d.getDay() === med.jourSemaine;
  if (f === 'mensuel')      return d.getDate() === med.jourMois;
  return true;
}

function reinitialiserPrisSiNouveauJour() {
  const aujourd = new Date().toDateString();
  const meds    = getMedicaments();
  let modifie   = false;
  const nouveau = meds.map(m => {
    if (m.dernierReset === aujourd) return m;
    if (!estDuAujourdhui(m)) return m;
    modifie = true;
    return { ...m, pris: false, dernierReset: aujourd };
  });
  if (modifie) sauverMedicaments(nouveau);
}

let frequenceCourante  = 'quotidien';
let jourSemaineCourant = null;

function selectionnerFrequence(btn) {
  document.querySelectorAll('.btn-frequence').forEach(b => b.classList.remove('selectionne'));
  btn.classList.add('selectionne');
  frequenceCourante = btn.dataset.freq;
  const zoneS = document.getElementById('zone-jour-semaine');
  const zoneM = document.getElementById('zone-jour-mois');
  if (zoneS) zoneS.style.display = frequenceCourante === 'hebdomadaire' ? 'block' : 'none';
  if (zoneM) zoneM.style.display = frequenceCourante === 'mensuel'      ? 'block' : 'none';
}

function toggleOptionsAvancees(btn) {
  const zone = document.getElementById('zone-options-avancees');
  const chevron = btn.querySelector('.chevron-options');
  const ouvert = zone.style.display !== 'none';
  zone.style.display = ouvert ? 'none' : 'block';
  if (chevron) chevron.style.transform = ouvert ? '' : 'rotate(90deg)';
}

function toggleListeMedsEnregistres(btn) {
  const zone = document.getElementById('liste-meds-enregistres');
  const chevron = btn.querySelector('.chevron-options');
  const ouvert = zone.style.display !== 'none';
  if (ouvert) {
    zone.style.display = 'none';
    if (chevron) chevron.style.transform = '';
    return;
  }
  // Construire la liste
  const meds = getMedicaments();
  const iconesPeriode = { matin:'🌅', midi:'☀️', soir:'🌆', nuit:'🌙' };
  const labelsPeriode = { matin:'Matin', midi:'Midi', soir:'Soir', nuit:'Nuit' };
  if (!meds.length) {
    zone.innerHTML = '<div style="text-align:center;color:#999;padding:12px;font-size:15px;">Aucun médicament enregistré</div>';
  } else {
    zone.innerHTML = meds.map(m => `
      <div class="liste-med-item ${m.desactive ? 'desactive' : ''}" onclick="ouvrirFicheMed(${m.id})">
        <span class="liste-med-periode" style="background:${{'matin':'#E08C00','midi':'#1450C4','soir':'#7B10BB','nuit':'#3949AB'}[m.periode]||'#888'}">
          ${iconesPeriode[m.periode]||'💊'} ${labelsPeriode[m.periode]||m.periode}
        </span>
        <span class="liste-med-nom">${m.nom}${m.insuline?' 💉':''}</span>
        ${m.desactive ? '<span class="liste-med-statut">⏸ désactivé</span>' : ''}
      </div>`).join('');
  }
  zone.style.display = 'block';
  if (chevron) chevron.style.transform = 'rotate(90deg)';
}

function toggleCarteInsuline(checkbox) {
  const check = document.getElementById('carte-insuline-check');
  if (check) check.textContent = checkbox.checked ? '✅' : '○';
  const label = document.getElementById('carte-insuline-label');
  if (label) label.classList.toggle('active', checkbox.checked);
}

function selectionnerJourSemaine(btn) {
  document.querySelectorAll('.btn-jour').forEach(b => b.classList.remove('selectionne'));
  btn.classList.add('selectionne');
  jourSemaineCourant = parseInt(btn.dataset.jour, 10);
}

let periodesCourantes = [];
function selectionnerPeriode(btn) {
  const p = btn.dataset.periode;
  if (periodesCourantes.includes(p)) {
    periodesCourantes = periodesCourantes.filter(x => x !== p);
    btn.classList.remove('selectionne');
  } else {
    periodesCourantes.push(p);
    btn.classList.add('selectionne');
  }
}

function ajouterMedicament() {
  if (estSeniorOnly()) return; // verrouillé
  const nom      = document.getElementById('inp-med-nom').value.trim();
  const heure    = document.getElementById('inp-med-heure').value;
  const posologie = document.getElementById('inp-med-posologie')?.value.trim() || '';
  const insuline  = document.getElementById('inp-med-insuline')?.checked || false;
  const erreur   = document.getElementById('med-erreur');
  erreur.classList.remove('visible');
  if (!nom)                       return afficherErreur(erreur, 'Entrez le nom du médicament.');
  if (periodesCourantes.length === 0) return afficherErreur(erreur, 'Choisissez quand le prendre (matin, midi…).');
  if (frequenceCourante === 'hebdomadaire' && jourSemaineCourant === null)
    return afficherErreur(erreur, 'Choisissez le jour de la semaine.');
  if (frequenceCourante === 'mensuel') {
    const j = parseInt(document.getElementById('inp-jour-mois').value, 10);
    if (!j || j < 1 || j > 31) return afficherErreur(erreur, 'Entrez un jour du mois (1 à 31).');
  }
  const icones = { matin:'🌅', midi:'☀️', soir:'🌆', nuit:'🌙' };
  const labels = { matin:'Matin', midi:'Midi', soir:'Soir', nuit:'Nuit' };
  const meds = getMedicaments();
  // Crée une entrée par période sélectionnée
  periodesCourantes.forEach((periode, idx) => {
    const med = {
      id: Date.now() + idx, nom, periode,
      heure: heure || labels[periode], icone: insuline ? '💉' : icones[periode],
      frequence: frequenceCourante,
      jourSemaine: frequenceCourante === 'hebdomadaire' ? jourSemaineCourant : null,
      jourMois: frequenceCourante === 'mensuel' ? parseInt(document.getElementById('inp-jour-mois').value, 10) : null,
      posologie: posologie || null,
      insuline: insuline || false,
      pris: false, dernierReset: null
    };
    meds.push(med);
    planifierNotification(med);
  });
  sauverMedicaments(meds);

  // Reset formulaire
  document.getElementById('inp-med-nom').value  = '';
  document.getElementById('inp-med-heure').value = '';
  document.getElementById('inp-jour-mois').value = '';
  if (document.getElementById('inp-med-posologie')) document.getElementById('inp-med-posologie').value = '';
  if (document.getElementById('inp-med-insuline'))  document.getElementById('inp-med-insuline').checked = false;
  const res = document.getElementById('scan-med-resultat');
  if (res) { res.classList.remove('visible'); res.innerHTML = ''; }
  document.querySelectorAll('.btn-periode, .btn-frequence, .btn-jour').forEach(b => b.classList.remove('selectionne'));
  document.querySelector('.btn-frequence[data-freq="quotidien"]')?.classList.add('selectionne');
  const zS = document.getElementById('zone-jour-semaine'); if (zS) zS.style.display = 'none';
  const zM = document.getElementById('zone-jour-mois');    if (zM) zM.style.display = 'none';
  const zO = document.getElementById('zone-options-avancees'); if (zO) zO.style.display = 'none';
  const optBtn = document.querySelector('.btn-options-avancees .chevron-options'); if (optBtn) optBtn.style.transform = '';
  const insCheck = document.getElementById('carte-insuline-check'); if (insCheck) insCheck.textContent = '○';
  const insLabel = document.getElementById('carte-insuline-label'); if (insLabel) insLabel.classList.remove('active');
  periodesCourantes = []; frequenceCourante = 'quotidien'; jourSemaineCourant = null;

  allerA('ecran-medicaments');
  chargerMedicaments();
}

function heureEnMinutes(med) {
  if (med.heure && med.heure.includes(':')) {
    const [h, m] = med.heure.split(':').map(Number);
    return h * 60 + m;
  }
  return { matin: 480, midi: 720, soir: 1140, nuit: 1320 }[med.periode] ?? 480;
}
function minutesMaintenant() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }

function chargerMedicaments() {
  reinitialiserPrisSiNouveauJour();
  const liste = document.getElementById('liste-medicaments');
  const meds  = getMedicaments();
  const medsNonDesactives = meds.filter(m => !m.desactive);
  if (medsNonDesactives.length === 0) {
    liste.innerHTML = '<p class="chargement-meds">Aucun médicament actif. Utilisez le bouton + pour en ajouter.</p>';
    mettreAJourBadge(0);
    return;
  }

  const now   = minutesMaintenant();
  const ordre = ['matin','midi','soir','nuit'];
  const jours = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

  const labelFrequence = med => {
    const f = med.frequence || 'quotidien';
    if (f === 'hebdomadaire') return ` · chaque ${jours[med.jourSemaine]}`;
    if (f === 'mensuel')      return ` · le ${med.jourMois} du mois`;
    return '';
  };

  const medsActifs = meds.filter(m => !m.desactive);
  const duJour     = medsActifs.filter(m =>  estDuAujourdhui(m));
  const pasAujourd = medsActifs.filter(m => !estDuAujourdhui(m));
  const tries = [
    ...[...duJour    ].sort((a,b) => ordre.indexOf(a.periode) - ordre.indexOf(b.periode)),
    ...[...pasAujourd].sort((a,b) => ordre.indexOf(a.periode) - ordre.indexOf(b.periode))
  ];

  let html = '';
  if (duJour.length > 0) html += `<div class="med-section-titre">🗓️ Aujourd'hui</div>`;

  tries.forEach((med, idx) => {
    if (!estDuAujourdhui(med) && (idx === 0 || estDuAujourdhui(tries[idx - 1]))) {
      html += `<div class="med-section-titre" style="margin-top:8px">📆 Autres jours</div>`;
    }
    const dj       = estDuAujourdhui(med);
    const enRetard = dj && !med.pris && heureEnMinutes(med) + 30 <= now;
    const iconesPeriode = { matin:'🌅', midi:'☀️', soir:'🌆', nuit:'🌙' };
    const labelsPeriode = { matin:'Matin', midi:'Midi', soir:'Soir', nuit:'Nuit' };
    const heureAffichee = (med.heure && med.heure !== labelsPeriode[med.periode]) ? med.heure : '';
    html += `
    <div class="med-carte ${med.periode} ${med.pris ? 'pris' : ''} ${enRetard ? 'en-retard' : ''} ${!dj ? 'pas-aujourd' : ''} ${med.desactive ? 'desactive' : ''}"
         onclick="ouvrirFicheMed(${med.id})">
      <div class="med-carte-header">
        <span class="med-carte-periode-label">${iconesPeriode[med.periode] || '💊'} ${labelsPeriode[med.periode] || med.periode}</span>
        ${heureAffichee ? `<span class="med-carte-heure-tag">${heureAffichee}</span>` : ''}
        ${enRetard ? '<span class="med-retard">⚠️ Oublié !</span>' : ''}
      </div>
      <div class="med-carte-corps">
        <div class="med-nom">${med.nom}${med.insuline ? ' <span class="med-badge-insuline">💉</span>' : ''}${med.desactive ? ' <span class="med-desactive-tag">désactivé</span>' : ''}</div>
        ${med.posologie ? `<div class="med-posologie">${med.posologie}</div>` : ''}
        ${labelFrequence(med) ? `<div class="med-freq-tag">${labelFrequence(med).trim()}</div>` : ''}
        <button class="btn-med-pris ${med.pris ? 'deja-pris' : ''}"
                onclick="event.stopPropagation(); marquerPris(${med.id}, this)"
                ${med.pris || !dj || med.desactive ? 'disabled' : ''}>
          ${med.pris ? '✅ Pris — bien joué !' : med.desactive ? '⏸ Désactivé' : dj ? '✔ Marquer comme pris' : '—'}
        </button>
      </div>
    </div>`;
  });

  liste.innerHTML = html;

  // Masquer/afficher le bouton Ajouter selon le mode Senior Only
  const btnAjouter = document.querySelector('#ecran-medicaments .btn-action');
  if (btnAjouter) btnAjouter.style.display = estSeniorOnly() ? 'none' : '';

  const oublies = meds.filter(m => estDuAujourdhui(m) && !m.pris && !m.desactive && heureEnMinutes(m) + 30 <= now).length;
  mettreAJourBadge(oublies);
}

// ── Modal unités insuline ─────────────────────────────
let _insulinePrisId  = null;
let _insulinePrisBtn = null;

function _modalInsuline(visible) {
  const el = document.getElementById('modal-insuline');
  if (el) el.style.display = visible ? 'flex' : 'none';
}

function demanderUnites(id, btn) {
  _insulinePrisId  = id;
  _insulinePrisBtn = btn;
  document.getElementById('inp-unites-insuline').value = '';
  _modalInsuline(true);
  setTimeout(() => document.getElementById('inp-unites-insuline').focus(), 150);
}
function confirmerUnites() {
  const unites = parseInt(document.getElementById('inp-unites-insuline').value, 10) || null;
  _modalInsuline(false);
  _marquerPrisAvecUnites(_insulinePrisId, _insulinePrisBtn, unites);
  _insulinePrisId = null; _insulinePrisBtn = null;
}
function annulerUnites() {
  _modalInsuline(false);
  _marquerPrisAvecUnites(_insulinePrisId, _insulinePrisBtn, null);
  _insulinePrisId = null; _insulinePrisBtn = null;
}

function marquerPris(id, btn) {
  const medCheck = getMedicaments().find(m => m.id === id);
  if (medCheck?.insuline) { demanderUnites(id, btn); return; }
  _marquerPrisAvecUnites(id, btn, null);
}

function _marquerPrisAvecUnites(id, btn, unites) {
  btn.textContent = '✅ Pris — bien joué !';
  btn.classList.add('deja-pris');
  btn.disabled = true;
  const carte = btn.closest('.med-carte');
  if (carte) { carte.classList.add('pris'); carte.classList.remove('en-retard'); }

  const meds = getMedicaments().map(m => m.id === id ? { ...m, pris: true } : m);
  sauverMedicaments(meds);

  // Annule les notifications en attente dans le SW pour ce médicament
  swController().then(sw => { if (sw) sw.postMessage({ type: 'ANNULER_NOTIF', medId: id }); });

  // Enregistre la prise dans l'historique
  const med    = meds.find(m => m.id === id);
  if (med) {
    const prises  = getUserLocal()?.prises_medicaments || [];
    const prise = { ts: Date.now(), id: med.id, nom: med.nom, icone: med.icone || '💊', periode: med.periode, heure: med.heure || '' };
    if (unites) prise.unites = unites;
    prises.push(prise);
    patchUserLocal({ prises_medicaments: prises.slice(-200) });
  }

  const oublies = meds.filter(m => estDuAujourdhui(m) && !m.pris && !m.desactive && heureEnMinutes(m) + 30 <= minutesMaintenant()).length;
  mettreAJourBadge(oublies);
}

// ════════════════════════════════════════════════════════
// ── Fiche médicament : désactiver / supprimer ──────────
// ════════════════════════════════════════════════════════
let _ficheMedId = null;

function ouvrirFicheMed(id) {
  if (estSeniorOnly()) return; // verrouillé — lecture seule interdite aussi
  const med = getMedicaments().find(m => m.id === id);
  if (!med) return;
  _ficheMedId = id;

  const jours   = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  let detail    = med.periode.charAt(0).toUpperCase() + med.periode.slice(1);
  if (med.heure) detail += ` · ${med.heure}`;
  const f = med.frequence || 'quotidien';
  if (f === 'hebdomadaire') detail += ` · chaque ${jours[med.jourSemaine]}`;
  if (f === 'mensuel')      detail += ` · le ${med.jourMois} du mois`;

  document.getElementById('fiche-med-icone').textContent   = med.icone || '💊';
  document.getElementById('fiche-med-nom').textContent     = med.nom;
  document.getElementById('fiche-med-detail').textContent  = detail;
  const posEl = document.getElementById('fiche-med-posologie');
  if (posEl) {
    if (med.posologie) { posEl.textContent = '💊 ' + med.posologie; posEl.style.display = ''; }
    else posEl.style.display = 'none';
  }

  const badge = document.getElementById('fiche-med-statut-badge');
  const btnD  = document.getElementById('btn-fiche-desactiver');
  const hint  = document.getElementById('fiche-med-hint-desactiver');
  if (med.desactive) {
    badge.textContent = '⏸ Désactivé';
    badge.className   = 'fiche-med-statut-badge desactive';
    btnD.textContent  = '▶ Réactiver ce médicament';
    btnD.classList.add('reactiver');
    hint.textContent  = 'Ce médicament est actuellement désactivé. Réactivez-le pour recevoir des rappels.';
  } else {
    badge.textContent = '✅ Actif';
    badge.className   = 'fiche-med-statut-badge';
    btnD.textContent  = '⏸ Désactiver ce médicament';
    btnD.classList.remove('reactiver');
    hint.textContent  = 'Le médicament sera conservé mais n\'apparaîtra plus dans vos rappels du jour.';
  }

  // Réinitialise la zone de suppression
  document.getElementById('fiche-suppr-confirm').style.display = 'none';
  const btnSuppr = document.querySelector('.btn-fiche-supprimer');
  if (btnSuppr) btnSuppr.style.display = '';

  // Historique injections insuline
  const histZone = document.getElementById('fiche-insuline-historique');
  const histListe = document.getElementById('fiche-insuline-liste');
  if (histZone && histListe) {
    if (med.insuline) {
      // Regroupe toutes les injections du même médicament (par nom)
      // car un med multi-périodes génère plusieurs entrées avec des IDs différents
      const nomMed = med.nom.toLowerCase();
      const prises = (getUserLocal()?.prises_medicaments || [])
        .filter(p => p.nom?.toLowerCase() === nomMed)
        .reverse()
        .slice(0, 60);

      if (prises.length === 0) {
        histListe.innerHTML = '<p class="fiche-insuline-vide">Aucune injection enregistrée.</p>';
      } else {
        const iconesPeriode = { matin:'🌅', midi:'☀️', soir:'🌆', nuit:'🌙' };
        histListe.innerHTML = prises.map(p => {
          const d = new Date(p.ts);
          const date = d.toLocaleDateString('fr-BE', { weekday:'short', day:'numeric', month:'short' });
          const heure = d.toLocaleTimeString('fr-BE', { hour:'2-digit', minute:'2-digit' });
          const icone = iconesPeriode[p.periode] || '💉';
          const periodeLabel = p.periode ? `<span class="insuline-periode">${icone} ${p.periode}</span>` : '';
          const unites = p.unites ? `<span class="insuline-unites">${p.unites} U</span>` : '<span class="insuline-unites-nc">— U</span>';
          return `<div class="insuline-ligne">
            <div class="insuline-dt">
              <div class="insuline-date">${date} ${periodeLabel}</div>
              <div class="insuline-heure">${heure}</div>
            </div>
            ${unites}
          </div>`;
        }).join('');
      }
      histZone.style.display = 'block';
    } else {
      histZone.style.display = 'none';
    }
  }

  allerA('ecran-fiche-med');
}

function toggleDesactiverMed() {
  if (_ficheMedId === null) return;
  const meds = getMedicaments().map(m =>
    m.id === _ficheMedId ? { ...m, desactive: !m.desactive } : m
  );
  sauverMedicaments(meds);
  // Rouvre la fiche pour refléter le nouveau statut
  ouvrirFicheMed(_ficheMedId);
}

function demanderConfirmationSuppression() {
  document.getElementById('fiche-suppr-confirm').style.display = 'block';
  document.querySelector('.btn-fiche-supprimer').style.display = 'none';
}

function annulerSuppression() {
  document.getElementById('fiche-suppr-confirm').style.display = 'none';
  document.querySelector('.btn-fiche-supprimer').style.display = 'block';
}

function confirmerSuppression() {
  if (_ficheMedId === null) return;
  const meds = getMedicaments().filter(m => m.id !== _ficheMedId);
  sauverMedicaments(meds);
  _ficheMedId = null;
  allerA('ecran-medicaments');
  chargerMedicaments();
}

// ════════════════════════════════════════════════════════
// ── Badge accueil ──────────────────────────────────────
// ════════════════════════════════════════════════════════
function mettreAJourBadge(nb) {
  const badge = document.getElementById('badge-meds');
  if (badge) { badge.style.display = nb > 0 ? 'flex' : 'none'; badge.textContent = nb; }
  if ('setAppBadge' in navigator) {
    nb > 0 ? navigator.setAppBadge(nb).catch(() => {}) : navigator.clearAppBadge().catch(() => {});
  }
}

// ════════════════════════════════════════════════════════
// ── Notifications de rappel ────────────────────────────
// ════════════════════════════════════════════════════════
function afficherStatutNotifications() {
  const statut = document.getElementById('notif-statut');
  const btn    = document.getElementById('btn-notif');
  const hint   = document.getElementById('notif-ios-hint');
  if (!statut) return;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (!('Notification' in window)) {
    if (isIOS && !isPWA) {
      statut.textContent = "⚠️ Installez l'app sur l'écran d'accueil pour activer les notifications.";
      statut.className   = 'notif-statut notif-warn';
      if (hint) hint.style.display = 'block';
      if (btn)  btn.style.display  = 'none';
    } else {
      statut.textContent = '❌ Votre navigateur ne supporte pas les notifications.';
      statut.className   = 'notif-statut notif-off';
      if (btn) btn.style.display = 'none';
    }
    return;
  }
  const p = Notification.permission;
  if (p === 'granted') {
    statut.textContent = '✅ Notifications activées — vous recevrez les rappels.';
    statut.className   = 'notif-statut notif-on';
    if (btn) btn.style.display = 'none';
  } else if (p === 'denied') {
    statut.textContent = '🚫 Notifications bloquées. Allez dans les réglages pour les autoriser.';
    statut.className   = 'notif-statut notif-off';
    if (btn) btn.style.display = 'none';
  } else {
    statut.textContent = '💤 Notifications non activées.';
    statut.className   = 'notif-statut notif-warn';
    if (btn) btn.style.display = 'block';
  }
}

async function activerNotifications() {
  if (!('Notification' in window)) return;
  const permission = await Notification.requestPermission();
  afficherStatutNotifications();
  if (permission === 'granted') getMedicaments().forEach(planifierNotification);
}
function demanderPermissionNotifications() { afficherStatutNotifications(); }

async function swController() {
  if (!('serviceWorker' in navigator)) return null;
  if (navigator.serviceWorker.controller) return navigator.serviceWorker.controller;
  // Attend l'activation si le SW vient d'être installé
  const reg = await navigator.serviceWorker.ready.catch(() => null);
  return reg?.active || null;
}

async function envoyerNotification(titre, corps, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const sw = await swController();
  if (sw) {
    sw.postMessage({ type: 'SHOW_NOTIF', titre, corps, tag: tag || 'monsucre-notif' });
  } else {
    new Notification(titre, { body: corps, icon: '/public/icons/icon.svg' });
  }
}

function verifierMedsOublies() {
  const now     = minutesMaintenant();
  const meds    = getMedicaments();
  const oublies = meds.filter(m => estDuAujourdhui(m) && !m.pris && !m.desactive && heureEnMinutes(m) + 30 <= now);
  mettreAJourBadge(oublies.length);
  if (oublies.length === 0) return;
  const noms  = oublies.map(m => m.nom).join(', ');
  const corps = oublies.length === 1
    ? `Vous n'avez pas encore pris : ${noms}`
    : `${oublies.length} médicaments oubliés : ${noms}`;
  envoyerNotification('Mon Sucre 💊 — Rappel', corps);
}

async function planifierNotification(med) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (med.desactive) return;

  const cible = new Date();
  const mins  = heureEnMinutes(med);
  cible.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  if (cible <= new Date()) cible.setDate(cible.getDate() + 1);
  const delai = cible.getTime() - Date.now();

  const sw = await swController();

  if (sw) {
    // Planifie via le Service Worker (résiste au background iOS/Android)
    sw.postMessage({
      type: 'PLANIFIER_NOTIF',
      medId: med.id,
      slot:  'rappel',
      titre: 'Mon Sucre 💊',
      corps: `N'oubliez pas de prendre : ${med.nom}`,
      delai
    });
    sw.postMessage({
      type: 'PLANIFIER_NOTIF',
      medId: med.id,
      slot:  'oubli',
      titre: 'Mon Sucre ⚠️ Rappel',
      corps: `Vous n'avez toujours pas pris : ${med.nom} !`,
      delai: delai + 30 * 60 * 1000
    });
  } else {
    // Fallback : setTimeout dans la page (marche uniquement si l'app est ouverte)
    setTimeout(() => {
      const m = getMedicaments().find(x => x.id === med.id);
      if (m && !m.pris && !m.desactive) envoyerNotification('Mon Sucre 💊', `N'oubliez pas de prendre : ${m.nom}`);
    }, delai);
    setTimeout(() => {
      const m = getMedicaments().find(x => x.id === med.id);
      if (m && !m.pris && !m.desactive) envoyerNotification('Mon Sucre ⚠️ Rappel', `Vous n'avez toujours pas pris : ${m.nom} !`);
    }, delai + 30 * 60 * 1000);
  }
}

// ════════════════════════════════════════════════════════
// ── Helpers ────────────────────────────────────────────
// ════════════════════════════════════════════════════════
function afficherZone(id) { const el = document.getElementById(id); if (el) el.classList.add('visible'); }
function masquerZone(id)  { const el = document.getElementById(id); if (el) el.classList.remove('visible'); }

async function viderCache() {
  const btn = document.querySelector('.btn-renew-session');
  if (btn) { btn.textContent = '⏳ En cours…'; btn.disabled = true; }
  try {
    const cles = await caches.keys();
    await Promise.all(cles.map(k => caches.delete(k)));
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if (btn) btn.textContent = '✅ Session renouvelée !';
    setTimeout(() => { window.location.href = '/?v=' + Date.now(); }, 600);
  } catch {
    if (btn) { btn.textContent = '❌ Erreur'; btn.disabled = false; }
    setTimeout(() => { if (btn) { btn.textContent = '🔄 Renouveler la session'; btn.disabled = false; } }, 2000);
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ════════════════════════════════════════════════════════
// ── Migration ancien format ────────────────────────────
// ════════════════════════════════════════════════════════
function migrerAncienFormat() {
  const session = getSession();
  if (!session) return;
  if (getUserLocal()) return;
  const oldMeds   = (() => { try { return JSON.parse(localStorage.getItem('ms_medicaments') || '[]');  } catch { return []; }   })();
  const oldProche = (() => { try { return JSON.parse(localStorage.getItem('ms_proche') || 'null');     } catch { return null; } })();
  const oldHisto  = (() => { try { return JSON.parse(localStorage.getItem('ms_historique') || '[]');   } catch { return []; }   })();
  const prenomAncien = session.prenom || null;
  if (oldMeds.length || oldProche || oldHisto.length || prenomAncien) {
    sauverUserLocal({ telephone: session.telephone || '', prenom: prenomAncien, medicaments: oldMeds, proche: oldProche, historique_repas: oldHisto.slice(0, 60) });
  }
  ['ms_medicaments','ms_proche','ms_historique','ms_prenom','ms_telephone','ms_token'].forEach(k => localStorage.removeItem(k));
  if (session && !session.token) deconnecterSession();
}

// ════════════════════════════════════════════════════════
// ── Init ───────────────────────────────────────────────
// ════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', async () => {
  // Verrouille l'orientation en portrait (PWA + navigateurs compatibles)
  try {
    if (screen?.orientation?.lock) await screen.orientation.lock('portrait');
  } catch (_) { /* ignoré si non supporté (iOS Safari) */ }

  migrerAncienFormat();
  const session = getSession();
  if (!session) { allerA('ecran-inscription'); return; }

  entrerDansAccueil();
  demanderPermissionNotifications();
  verifierMedsOublies();
  setInterval(verifierMedsOublies, 15 * 60 * 1000);
  getMedicaments().forEach(planifierNotification);

  const userServeur = await hydraterDepuisServeur();
  if (userServeur) {
    const el = document.getElementById('message-bonjour');
    if (el) el.textContent = messageBonjourComplet();
    mettreAJourBoutonsAppel();
    if (document.getElementById('ecran-accueil').classList.contains('actif')) chargerMedicaments();
  }
});
