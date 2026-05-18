'use strict';

// ── Session ───────────────────────────────────────────
function getSession() {
  try { return JSON.parse(localStorage.getItem('ms_session') || 'null'); } catch { return null; }
}
function sauverSession(data) {
  localStorage.setItem('ms_session', JSON.stringify(data));
}
function deconnecterSession() {
  localStorage.removeItem('ms_session');
  localStorage.removeItem('ms_token');
  localStorage.removeItem('ms_prenom');
  localStorage.removeItem('ms_telephone');
}

// ── Navigation ────────────────────────────────────────
function allerA(ecranId) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const cible = document.getElementById(ecranId);
  if (cible) cible.classList.add('actif');
  window.scrollTo(0, 0);

  if (ecranId === 'ecran-urgence') chargerEcranUrgence();
  if (ecranId === 'ecran-proche') chargerFormulaireProche();
  if (ecranId === 'ecran-historique') chargerHistorique();
}

function chargerFormulaireProche() {
  const proche = getProcheContact();
  if (proche) {
    document.getElementById('inp-proche-prenom').value = proche.prenom || '';
    document.getElementById('inp-proche-tel').value = proche.telephone || '';
  }
  masquerZone('proche-sauve');
}

// ── Inscription — Étape 1 : envoyer le code ───────────
async function envoyerCode() {
  const prenom    = document.getElementById('inp-prenom').value.trim();
  const telephone = document.getElementById('inp-tel').value.trim();
  const erreur    = document.getElementById('inscription-erreur');
  const btn       = document.getElementById('btn-envoyer-code');

  erreur.classList.remove('visible');

  if (!prenom) return afficherErreur(erreur, 'Veuillez entrer votre prénom.');
  if (!telephone) return afficherErreur(erreur, 'Veuillez entrer votre numéro de téléphone.');

  // Inscription directe sans SMS (mode développement)
  sauverSession({ prenom, telephone });
  document.getElementById('message-bonjour').textContent = `Bonjour ${prenom} !`;
  allerA('ecran-accueil');
  chargerMedicaments();
}

// ── Inscription — Étape 2 : vérifier le code ─────────
async function verifierCode() {
  const code     = document.getElementById('inp-code').value.trim();
  const erreur   = document.getElementById('verification-erreur');
  const prenom   = localStorage.getItem('ms_prenom') || '';
  const tel      = localStorage.getItem('ms_telephone') || '';
  const token    = localStorage.getItem('ms_token') || '';

  erreur.classList.remove('visible');

  if (code.length !== 4) return afficherErreur(erreur, 'Le code fait 4 chiffres.');

  try {
    const res = await fetch('/api/auth/verifier-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, telephone: tel, code, token })
    });
    const data = await res.json();

    if (!res.ok) {
      afficherErreur(erreur, data.erreur || 'Code incorrect.');
      return;
    }

    sauverSession({ prenom: data.prenom, telephone: tel, session: data.session });
    document.getElementById('message-bonjour').textContent = `Bonjour ${data.prenom} !`;
    allerA('ecran-accueil');
  } catch {
    afficherErreur(erreur, 'Impossible de vérifier le code. Réessayez.');
  }
}

function afficherErreur(el, msg) {
  el.textContent = msg;
  el.classList.add('visible');
}

// ── Bonjour selon l'heure ─────────────────────────────
function messageBonjour() {
  const h = new Date().getHours();
  let msg = 'Bonjour !';
  if (h >= 12 && h < 18) msg = 'Bon après-midi !';
  else if (h >= 18) msg = 'Bonsoir !';
  const el = document.getElementById('message-bonjour');
  if (el) el.textContent = msg;
}

// ── Photo ─────────────────────────────────────────────
function ouvrirPhoto() {
  document.getElementById('input-photo').click();
}

async function analyserPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const fichier = input.files[0];
  const base64 = await lireEnBase64(fichier);

  afficherZone('zone-analyse');
  masquerZone('zone-voix');
  masquerZone('zone-conseil');

  try {
    const res = await fetch('/api/analyser-repas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64, type: fichier.type })
    });
    const data = await res.json();
    afficherConseil(data.conseil, '', 'photo');
  } catch {
    afficherConseil("Je n'arrive pas à analyser la photo pour le moment. Essayez de décrire votre repas à voix haute.", '', 'photo');
  }
}

function lireEnBase64(fichier) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(fichier);
  });
}

// ── Voix ──────────────────────────────────────────────
let reconnaissance = null;

function commencerVoix() {
  afficherZone('zone-voix');
  masquerZone('zone-analyse');
  masquerZone('zone-conseil');
  document.getElementById('texte-reconnu').textContent = '';
  document.getElementById('btn-envoyer-repas').style.display = 'none';

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('texte-reconnu').textContent = 'La reconnaissance vocale n\'est pas disponible sur ce navigateur.';
    return;
  }

  reconnaissance = new SpeechRecognition();
  reconnaissance.lang = 'fr-FR';
  reconnaissance.interimResults = true;
  reconnaissance.continuous = false;

  reconnaissance.onresult = (event) => {
    let texte = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      texte += event.results[i][0].transcript;
    }
    document.getElementById('texte-reconnu').textContent = texte;
    if (event.results[event.results.length - 1].isFinal) {
      document.getElementById('btn-envoyer-repas').style.display = 'block';
    }
  };

  reconnaissance.onerror = () => {
    document.getElementById('texte-reconnu').textContent = 'Je n\'ai pas entendu. Appuyez à nouveau et parlez clairement.';
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
    const res = await fetch('/api/analyser-repas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ texte })
    });
    const data = await res.json();
    const texteRepas = document.getElementById('texte-reconnu').textContent;
    afficherConseil(data.conseil, texteRepas, 'vocal');
  } catch {
    afficherConseil('Votre repas a bien été noté. Continuez à bien manger !', '', 'vocal');
  }
}

function afficherConseil(texte, description, type) {
  masquerZone('zone-analyse');
  document.getElementById('texte-conseil').textContent = texte;
  afficherZone('zone-conseil');
  sauverRepas(description, texte, type);
}

// ── Historique des repas ──────────────────────────────
function sauverRepas(description, conseil, type) {
  const historique = getHistorique();
  historique.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    type: type || 'vocal',
    description: description || '',
    conseil
  });
  // Garder max 30 repas
  localStorage.setItem('ms_historique', JSON.stringify(historique.slice(0, 30)));
}

function getHistorique() {
  try { return JSON.parse(localStorage.getItem('ms_historique') || '[]'); } catch { return []; }
}

function chargerHistorique() {
  const liste = document.getElementById('liste-historique');
  const historique = getHistorique();

  if (historique.length === 0) {
    liste.innerHTML = '<p class="chargement-meds">Aucun repas enregistré pour l\'instant.</p>';
    return;
  }

  liste.innerHTML = historique.map(repas => {
    const date = new Date(repas.date);
    const jour = date.toLocaleDateString('fr-BE', { weekday: 'long', day: 'numeric', month: 'long' });
    const heure = date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
    const icone = repas.type === 'photo' ? '📷' : '🎤';
    return `
      <div class="historique-carte">
        <div class="historique-entete">
          <span class="historique-icone">${icone}</span>
          <div class="historique-date">
            <span class="historique-jour">${jour}</span>
            <span class="historique-heure">${heure}</span>
          </div>
        </div>
        ${repas.description ? `<p class="historique-description">"${repas.description}"</p>` : ''}
        <p class="historique-conseil">${repas.conseil}</p>
      </div>
    `;
  }).join('');
}

// ── Proche aidant ─────────────────────────────────────
function getProcheContact() {
  try { return JSON.parse(localStorage.getItem('ms_proche') || 'null'); } catch { return null; }
}

function sauverProche() {
  const prenom = document.getElementById('inp-proche-prenom').value.trim();
  const tel    = document.getElementById('inp-proche-tel').value.trim();
  if (!prenom || !tel) return;

  localStorage.setItem('ms_proche', JSON.stringify({ prenom, telephone: tel }));
  afficherZone('proche-sauve');
  setTimeout(() => {
    masquerZone('proche-sauve');
    allerA('ecran-accueil');
  }, 1500);
}

function chargerEcranUrgence() {
  const proche = getProcheContact();
  const infoEl = document.getElementById('urgence-proche-info');
  const pasDeProche = document.getElementById('urgence-pas-de-proche');
  const btn = document.getElementById('btn-alerter-proche');
  const btnTexte = document.getElementById('btn-alerter-texte');

  // Réinitialiser
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

// ── Urgence ───────────────────────────────────────────
async function envoyerAlerteUrgence() {
  const proche = getProcheContact();
  const btn = document.getElementById('btn-alerter-proche');
  const session = getSession();

  btn.disabled = true;
  document.getElementById('btn-alerter-texte').textContent = 'Envoi en cours…';

  try {
    const r = await fetch('/api/urgence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        prenom_utilisateur: session?.prenom || 'Votre proche',
        telephone_proche: proche?.telephone || ''
      })
    });
    const data = await r.json();
    if (!data.ok) {
      document.getElementById('btn-alerter-texte').textContent = '⚠️ Échec — vérifier la configuration';
      btn.disabled = false;
      console.error('Urgence erreur:', data.erreur, data.detail);
      return;
    }
  } catch {
    // réseau indisponible — on affiche quand même la confirmation
  }

  afficherZone('urgence-confirmation');
  btn.style.display = 'none';
}

// ── Médicaments — stockage localStorage ──────────────
function getMedicaments() {
  try { return JSON.parse(localStorage.getItem('ms_medicaments') || '[]'); } catch { return []; }
}
function sauverMedicaments(liste) {
  localStorage.setItem('ms_medicaments', JSON.stringify(liste));
}

function reinitialiserPrisSiNouveauJour() {
  const aujourd = new Date().toDateString();
  const dernierJour = localStorage.getItem('ms_dernier_reset');
  if (dernierJour !== aujourd) {
    const meds = getMedicaments().map(m => ({ ...m, pris: false }));
    sauverMedicaments(meds);
    localStorage.setItem('ms_dernier_reset', aujourd);
  }
}

// ── Période — sélection visuelle ──────────────────────
let periodeCourante = null;

function selectionnerPeriode(btn) {
  document.querySelectorAll('.btn-periode').forEach(b => b.classList.remove('selectionne'));
  btn.classList.add('selectionne');
  periodeCourante = btn.dataset.periode;
}

// ── Ajouter un médicament ─────────────────────────────
function ajouterMedicament() {
  const nom = document.getElementById('inp-med-nom').value.trim();
  const heure = document.getElementById('inp-med-heure').value;
  const erreur = document.getElementById('med-erreur');

  erreur.classList.remove('visible');

  if (!nom) return afficherErreur(erreur, 'Entrez le nom du médicament.');
  if (!periodeCourante) return afficherErreur(erreur, 'Choisissez quand le prendre.');

  const icones = { matin: '🌅', midi: '☀️', soir: '🌆', nuit: '🌙' };
  const labels = { matin: 'Matin', midi: 'Midi', soir: 'Soir', nuit: 'Nuit' };

  const med = {
    id: Date.now(),
    nom,
    periode: periodeCourante,
    heure: heure || labels[periodeCourante],
    icone: icones[periodeCourante],
    pris: false
  };

  const meds = getMedicaments();
  meds.push(med);
  sauverMedicaments(meds);

  planifierNotification(med);

  // Reset formulaire
  document.getElementById('inp-med-nom').value = '';
  document.getElementById('inp-med-heure').value = '';
  document.querySelectorAll('.btn-periode').forEach(b => b.classList.remove('selectionne'));
  periodeCourante = null;

  allerA('ecran-medicaments');
  chargerMedicaments();
}

// ── Charger la liste des médicaments ─────────────────
function chargerMedicaments() {
  reinitialiserPrisSiNouveauJour();
  const liste = document.getElementById('liste-medicaments');
  const meds = getMedicaments();

  if (meds.length === 0) {
    liste.innerHTML = '<p class="chargement-meds">Aucun médicament enregistré.</p>';
    return;
  }

  const ordre = ['matin', 'midi', 'soir', 'nuit'];
  const tries = [...meds].sort((a, b) => ordre.indexOf(a.periode) - ordre.indexOf(b.periode));

  liste.innerHTML = tries.map(med => `
    <div class="med-carte ${med.periode} ${med.pris ? 'pris' : ''}">
      <div>
        <div class="med-nom">${med.icone} ${med.nom}</div>
        <div class="med-heure">${med.heure}</div>
      </div>
      <button class="med-pris ${med.pris ? 'deja-pris' : ''}"
              onclick="marquerPris(${med.id}, this)"
              ${med.pris ? 'disabled' : ''}>
        ${med.pris ? '✅ Pris' : 'Pris'}
      </button>
    </div>
  `).join('');
}

function marquerPris(id, btn) {
  btn.textContent = '✅ Pris';
  btn.classList.add('deja-pris');
  btn.disabled = true;

  const carte = btn.closest('.med-carte');
  if (carte) carte.classList.add('pris');

  const meds = getMedicaments().map(m => m.id === id ? { ...m, pris: true } : m);
  sauverMedicaments(meds);
}

// ── Notifications de rappel ───────────────────────────
function demanderPermissionNotifications() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

function planifierNotification(med) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const heuresParPeriode = { matin: 8, midi: 12, soir: 19, nuit: 22 };
  let heure = heuresParPeriode[med.periode];
  let minutes = 0;

  if (med.heure && med.heure.includes(':')) {
    const parts = med.heure.split(':');
    heure = parseInt(parts[0], 10);
    minutes = parseInt(parts[1], 10);
  }

  const maintenant = new Date();
  const cible = new Date();
  cible.setHours(heure, minutes, 0, 0);
  if (cible <= maintenant) cible.setDate(cible.getDate() + 1);

  const delai = cible.getTime() - maintenant.getTime();
  setTimeout(() => {
    const meds = getMedicaments();
    const m = meds.find(x => x.id === med.id);
    if (m && !m.pris) {
      new Notification('Mon Sucre 💊', {
        body: `N'oubliez pas de prendre : ${m.nom}`,
        icon: '/public/icons/icon-192.png'
      });
    }
  }, delai);
}

// ── Helpers ───────────────────────────────────────────
function afficherZone(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('visible');
}
function masquerZone(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('visible');
}

// ── Vider le cache (debug) ────────────────────────────
async function viderCache() {
  const btn = document.querySelector('.btn-debug');
  btn.textContent = '⏳';
  btn.disabled = true;

  try {
    // Vider tous les caches du service worker
    const cles = await caches.keys();
    await Promise.all(cles.map(k => caches.delete(k)));

    // Désenregistrer le service worker
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(r => r.unregister()));
    }

    btn.textContent = '✅';
    // Cache-busting : force le navigateur à aller chercher sur le serveur
    setTimeout(() => {
      window.location.href = '/?v=' + Date.now();
    }, 400);
  } catch (e) {
    btn.textContent = '❌';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = '🔄'; }, 2000);
  }
}

// ── Service Worker ────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ── Init ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const session = getSession();
  if (session) {
    document.getElementById('message-bonjour').textContent = `Bonjour ${session.prenom} !`;
    allerA('ecran-accueil');
    chargerMedicaments();
    demanderPermissionNotifications();
  } else {
    allerA('ecran-inscription');
  }
});
