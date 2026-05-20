// POST /api/bien-etre
// Body : { reponse: 'ok' | 'ko', question: "..." }
// Ajoute une entrée bien-être dans l'historique de l'utilisateur.

import { getUser, setUser } from './_lib/db.js';
import { lireSessionDepuisRequete } from './_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });

  const { reponse, question } = req.body || {};
  if (!['ok', 'ko'].includes(reponse)) {
    return res.status(400).json({ erreur: 'reponse doit être "ok" ou "ko".' });
  }

  try {
    const user = await getUser(session.telephone);
    if (!user) return res.status(404).json({ erreur: 'Utilisateur introuvable.' });

    const entree = {
      ts:       Date.now(),
      date:     new Date().toISOString(),
      question: question || '',
      reponse
    };

    const bienEtre = Array.isArray(user.bien_etre) ? user.bien_etre : [];
    bienEtre.push(entree);

    await setUser(session.telephone, { ...user, bien_etre: bienEtre });

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('bien-etre erreur:', e);
    return res.status(500).json({ erreur: 'Erreur serveur.' });
  }
}
