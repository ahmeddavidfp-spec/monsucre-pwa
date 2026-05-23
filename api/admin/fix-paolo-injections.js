// TEMPORAIRE — endpoint one-shot pour vider les prises d'insuline de Paolo
// Protégé par la même vérification admin que /api/admin/users
// À supprimer après utilisation.
import { redis } from '../_lib/db.js';
import { lireSessionDepuisRequete } from '../_lib/session.js';
import { normaliserTelephone } from '../_lib/phone.js';

function getAdmins() {
  const raw = process.env.ADMIN_PHONES || '';
  return raw.split(',').map(s => normaliserTelephone(s.trim())).filter(Boolean);
}
function isDev() {
  return ['true', '1', 'yes'].includes((process.env.DEV_MODE || '').toLowerCase().trim());
}
function estAutorise(telephone) {
  const admins = getAdmins();
  if (admins.length > 0) return admins.includes(telephone);
  return isDev();
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });
  if (!estAutorise(session.telephone)) return res.status(403).json({ erreur: 'Accès refusé.' });

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
