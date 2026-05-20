import { redis } from '../_lib/db.js';
import { lireSessionDepuisRequete } from '../_lib/session.js';
import { normaliserTelephone } from '../_lib/phone.js';

// GET    /api/admin/users          → liste tous les utilisateurs
// DELETE /api/admin/users?tel=+32… → supprime un utilisateur
// DELETE /api/admin/users?all=true → vide toute la DB
//
// Double protection :
//   1. Session valide (Bearer token)
//   2. Numéro de téléphone dans la liste ADMIN_PHONES (variable d'env)
//      Format : "0493507475,0493507476" ou "+32493507475,+32493507476" (virgule-séparé)
//      Les numéros sont normalisés en E.164 avant comparaison.
//   Fallback dev : si ADMIN_PHONES n'est pas défini ET DEV_MODE=true,
//   toute session valide est acceptée (pour ne pas bloquer le dev local).

function getAdmins() {
  const raw = process.env.ADMIN_PHONES || '';
  return raw.split(',')
    .map(s => normaliserTelephone(s.trim()))
    .filter(Boolean);
}

function isDev() {
  return ['true', '1', 'yes'].includes((process.env.DEV_MODE || '').toLowerCase().trim());
}

function estAutorise(telephone) {
  const admins = getAdmins();
  if (admins.length > 0) return admins.includes(telephone);
  // Pas de liste définie → fallback DEV_MODE uniquement
  return isDev();
}

export default async function handler(req, res) {
  // ── Authentification ────────────────────────────────────
  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) {
    return res.status(401).json({ erreur: 'Non authentifié.' });
  }
  if (!estAutorise(session.telephone)) {
    return res.status(403).json({ erreur: 'Accès refusé.' });
  }

  // ── GET : liste tous les users ──────────────────────────
  if (req.method === 'GET') {
    try {
      const keys = await redis.keys('user:*');
      if (!keys.length) return res.status(200).json({ users: [] });

      const values = await redis.mget(...keys);
      const users  = values
        .filter(Boolean)
        .map(v => (typeof v === 'string' ? JSON.parse(v) : v))
        .sort((a, b) => (b.cree_le || 0) - (a.cree_le || 0));

      return res.status(200).json({ users });
    } catch (e) {
      console.error('admin/users GET:', e);
      return res.status(500).json({ erreur: 'Erreur serveur.' });
    }
  }

  // ── DELETE : supprime un user ou toute la DB ───────────
  if (req.method === 'DELETE') {
    // ?all=true → vide toutes les clés user:*
    if (req.query?.all === 'true') {
      try {
        const keys = await redis.keys('user:*');
        if (keys.length) await Promise.all(keys.map(k => redis.del(k)));
        return res.status(200).json({ ok: true, supprimés: keys.length });
      } catch (e) {
        console.error('admin/users DELETE all:', e);
        return res.status(500).json({ erreur: 'Erreur serveur.' });
      }
    }
    // ?tel=+32… → supprime un user précis
    const tel = req.query?.tel;
    if (!tel) return res.status(400).json({ erreur: 'Paramètre ?tel ou ?all=true manquant.' });
    try {
      await redis.del(`user:${tel}`);
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error('admin/users DELETE:', e);
      return res.status(500).json({ erreur: 'Erreur serveur.' });
    }
  }

  return res.status(405).end();
}
