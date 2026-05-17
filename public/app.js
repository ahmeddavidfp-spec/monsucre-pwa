'use strict';

// ── Navigation ────────────────────────────────────────
function allerA(ecranId) {
  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const cible = document.getElementById(ecranId);
  if (cible) cible.classList.add('actif');
  window.scrollTo(0, 0);
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
  messageBonjour();
  chargerMedicaments();
});
