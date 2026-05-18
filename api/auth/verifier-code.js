import { normaliserTelephone } from '../_lib/phone.js';
import { verifierCode, creerSession } from '../_lib/session.js';
import { getUser, setUser } from '../_lib/db.js';

// POST /api/auth/verifier-code
// Body : { telephone, code, token }
//
// Vérifie le code via HMAC.
// Si OK et que l'utilisateur n'existe pas encore en KV, on le crée (vide).
// Renvoie : { ok: true, session, user }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { telephone: brut, code, token } = req.body || {};

  const tel = normaliserTelephone(brut);
  if (!tel) {
    return res.status(400).json({ erreur: 'Numéro de téléphone invalide.' });
  }
  if (!code || !token) {
    return res.status(400).json({ erreur: 'Données manquantes.' });
  }

  if (!verifierCode(tel, code, token)) {
    return res.status(400).json({ erreur: 'Code incorrect ou expiré. Réessayez.' });
  }

  // Création de l'utilisateur si nouveau
  let user;
  try {
    user = await getUser(tel);
    if (!user) {
      user = await setUser(tel, {
        prenom: null,
        medicaments: [],
        proche: null,
        historique_repas: []
      });
    }
  } catch (e) {
    console.error('KV erreur (verifier-code):', e);
    return res.status(500).json({ erreur: 'Service indisponible. Réessayez.' });
  }

  const session = creerSession(tel);
  return res.status(200).json({ ok: true, session, user });
}
