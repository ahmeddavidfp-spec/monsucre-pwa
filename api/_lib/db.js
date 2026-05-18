import { Redis } from '@upstash/redis';

// Client Redis (Upstash). On supporte les deux conventions de noms :
//   - KV_REST_API_URL / KV_REST_API_TOKEN     (intégration "Vercel KV / Upstash" historique)
//   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN  (intégration Marketplace récente)
export const redis = new Redis({
  url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
});

// ── Schéma d'un utilisateur ─────────────────────────────
// Clé KV : user:<telephone>   (téléphone en format E.164, ex : +32470000000)
// Valeur : objet JSON ci-dessous
//
// {
//   telephone:        "+32470000000",
//   prenom:           "Marie",                  // optionnel
//   medicaments:      [...],                    // tableau
//   proche:           { prenom, telephone },    // ou null
//   historique_repas: [...],                    // max 30 entrées
//   cree_le:          1747579200000,            // timestamp ms
//   modifie_le:       1747579200000             // timestamp ms
// }

export async function getUser(telephone) {
  const data = await redis.get(`user:${telephone}`);
  return data || null;
}

export async function setUser(telephone, user) {
  const now = Date.now();
  const payload = {
    telephone,
    prenom: user.prenom || null,
    medicaments: Array.isArray(user.medicaments) ? user.medicaments : [],
    proche: user.proche || null,
    proche2: user.proche2 || null,
    historique_repas: Array.isArray(user.historique_repas) ? user.historique_repas.slice(0, 60) : [],
    cree_le: user.cree_le || now,
    modifie_le: now
  };
  await redis.set(`user:${telephone}`, payload);
  return payload;
}

export async function userExiste(telephone) {
  const r = await redis.exists(`user:${telephone}`);
  return r > 0;
}

// Met à jour un user existant en mergant les champs fournis.
// Renvoie le user mis à jour, ou null si l'utilisateur n'existe pas.
export async function mettreAJourUser(telephone, patch) {
  const existant = await getUser(telephone);
  if (!existant) return null;

  const fusion = { ...existant };
  if (patch.prenom !== undefined)           fusion.prenom = patch.prenom;
  if (patch.medicaments !== undefined)      fusion.medicaments = patch.medicaments;
  if (patch.proche !== undefined)           fusion.proche = patch.proche;
  if (patch.proche2 !== undefined)          fusion.proche2 = patch.proche2;
  if (patch.historique_repas !== undefined) fusion.historique_repas = patch.historique_repas;

  return await setUser(telephone, fusion);
}
