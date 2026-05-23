// TEMPORAIRE — endpoint one-shot pour vider les prises d'insuline de Paolo
// Protégé par un token secret one-shot.
// À supprimer après utilisation.
import { redis } from '../_lib/db.js';

const ONE_SHOT_TOKEN = 'monsucre-fix-paolo-2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { token } = req.body || {};
  if (token !== ONE_SHOT_TOKEN) return res.status(403).json({ erreur: 'Token invalide.' });

  try {
    const keys = await redis.keys('user:*');
    if (!keys.length) return res.status(200).json({ ok: true, message: 'Aucun utilisateur trouvé.', modifiés: 0 });

    const values = await redis.mget(...keys);
    const resultats = [];

    for (let i = 0; i < keys.length; i++) {
      const user = typeof values[i] === 'string' ? JSON.parse(values[i]) : values[i];
      if (!user) continue;

      const prenom = (user.prenom || '').toLowerCase().trim();
      if (prenom !== 'paolo') continue;

      // Compter les entrées avec unités insuline
      const prisesBefore = Array.isArray(user.prises_medicaments) ? user.prises_medicaments : [];
      const nAvant = prisesBefore.filter(p => p.unites != null).length;

      // Supprimer le champ unites de chaque prise (garder les prises, juste effacer les unités)
      // OU vider completement les prises d'insuline ?
      // → On vide uniquement les entrées qui ont unites != null (= les mesures d'injection).
      const prisesSans = prisesBefore.filter(p => p.unites == null);

      // Mettre à jour le user
      user.prises_medicaments = prisesSans;
      user.modifie_le = Date.now();
      await redis.set(keys[i], user);

      resultats.push({
        telephone: user.telephone,
        prenom: user.prenom,
        injections_supprimees: nAvant,
        prises_restantes: prisesSans.length
      });
    }

    if (!resultats.length) {
      return res.status(200).json({ ok: true, message: "Aucun utilisateur nommé 'Paolo' trouvé.", modifiés: 0 });
    }

    return res.status(200).json({ ok: true, résultats: resultats });
  } catch (e) {
    console.error('fix-paolo-injections:', e);
    return res.status(500).json({ erreur: 'Erreur serveur.' });
  }
}
