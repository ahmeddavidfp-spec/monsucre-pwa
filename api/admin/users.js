import { redis } from '../_lib/db.js';

// GET    /api/admin/users          → liste tous les utilisateurs
// DELETE /api/admin/users?tel=+32… → supprime un utilisateur
//
// Accessible uniquement en DEV_MODE.

function isDev() {
  return ['true', '1', 'yes'].includes((process.env.DEV_MODE || '').toLowerCase().trim());
}

export default async function handler(req, res) {
  if (!isDev()) {
    return res.status(403).json({ erreur: 'Accès refusé (DEV_MODE uniquement).' });
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

  // ── DELETE : supprime un user par téléphone ─────────────
  if (req.method === 'DELETE') {
    const tel = req.query?.tel;
    if (!tel) return res.status(400).json({ erreur: 'Paramètre ?tel manquant.' });
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
