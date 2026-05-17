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

  btn.disabled = true;
  btn.textContent = 'Envoi en cours…';

  try {
    const res = await fetch('/api/auth/envoyer-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom, telephone })
    });
    const data = await res.json();

    if (!res.ok) {
      afficherErreur(erreur, data.erreur || 'Une erreur est survenue.');
      btn.disabled = false;
      btn.textContent = 'Recevoir mon code par SMS →';
      return;
    }

    localStorage.setItem('ms_token', data.token);
    localStorage.setItem('ms_prenom', prenom);
    localStorage.setItem('ms_telephone', telephone);

    // En mode dev, Vercel renvoie le code directement
    if (data.dev_code) {
      document.getElementById('inp-code').value = data.dev_code;
    }

    allerA('ecran-verification');
  } catch {
    afficherErreur(erreur, 'Impossible de se connecter. Vérifiez votre connexion.');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Recevoir mon code par SMS →';
  }
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
    afficherConseil(data.conseil);
  } catch {
    afficherConseil("Je n'arrive pas à analyser la photo pour le moment. Essayez de décrire votre repas à voix haute.");
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
    afficherConseil(data.conseil);
  } catch {
    afficherConseil('Votre repas a bien été noté. Continuez à bien manger !');
  }
}

function afficherConseil(texte) {
  masquerZone('zone-analyse');
  document.getElementById('texte-conseil').textContent = texte;
  afficherZone('zone-conseil');
}

// ── Urgence ───────────────────────────────────────────
async function envoyerAlerteUrgence() {
  const btn = document.querySelector('.btn-urgence-gros');
  btn.disabled = true;
  btn.querySelector('.btn-texte').textContent = 'Envoi en cours…';

  try {
    await fetch('/api/urgence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: new Date().toISOString() })
    });
  } catch {
    // on affiche la confirmation même si l'envoi échoue côté réseau
  }

  afficherZone('urgence-confirmation');
  btn.style.display = 'none';
}

// ── Médicaments ───────────────────────────────────────
async function chargerMedicaments() {
  const liste = document.getElementById('liste-medicaments');
  try {
    const res = await fetch('/api/medicaments');
    const data = await res.json();
    if (!data.medicaments || data.medicaments.length === 0) {
      liste.innerHTML = '<p class="chargement-meds">Aucun médicament enregistré.</p>';
      return;
    }
    liste.innerHTML = data.medicaments.map(med => `
      <div class="med-carte">
        <div>
          <div class="med-nom">${med.nom}</div>
          <div class="med-heure">${med.heure}</div>
        </div>
        <button class="med-pris ${med.pris ? 'deja-pris' : ''}" onclick="marquerPris(${med.id}, this)">
          ${med.pris ? '✅ Pris' : 'Pris'}
        </button>
      </div>
    `).join('');
  } catch {
    liste.innerHTML = '<p class="chargement-meds">Impossible de charger les médicaments.</p>';
  }
}

async function marquerPris(id, btn) {
  btn.textContent = '✅ Pris';
  btn.classList.add('deja-pris');
  btn.disabled = true;
  try {
    await fetch(`/api/medicaments/${id}/pris`, { method: 'POST' });
  } catch { /* on ignore */ }
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
  } else {
    allerA('ecran-inscription');
  }
});
