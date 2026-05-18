import { lireSessionDepuisRequete } from './_lib/session.js';
import { getUser, mettreAJourUser } from './_lib/db.js';

// GET  /api/user        → renvoie le document utilisateur
// PUT  /api/user        → met à jour partiellement le document
//
// Auth : header  Authorization: Bearer <session>
//
// Body PUT (tous champs optionnels) :
//   {
//     prenom:           "Marie" | null,
//     medicaments:      [...],
//     proche:           { prenom, telephone } | null,
//     historique_repas: [...]   // max 30, tronqué côté serveur
//   }

export default async function handler(req, res) {
  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) {
    return res.status(401).json({ erreur: 'Session invalide ou expirée.' });
  }

  const tel = session.telephone;

  if (req.method === 'GET') {
    try {
      const user = await getUser(tel);
      if (!user) {
        return res.status(404).json({ erreur: 'Utilisateur introuvable.' });
      }
      return res.status(200).json({ user });
    } catch (e) {
      console.error('KV erreur (GET /api/user):', e);
      return res.status(500).json({ erreur: 'Service indisponible.' });
    }
  }

  if (req.method === 'PUT') {
    const patch = req.body || {};
    // Validation légère : on n'accepte que les champs connus
    const champsAutorises = {};
    if ('prenom' in patch) {
      const p = patch.prenom;
      if (p !== null && (typeof p !== 'string' || p.length > 60)) {
        return res.status(400).json({ erreur: 'Prénom invalide.' });
      }
      champsAutorises.prenom = p ? p.trim() : null;
    }
    if ('medicaments' in patch) {
      if (!Array.isArray(patch.medicaments)) {
        return res.status(400).json({ erreur: 'medicaments doit être un tableau.' });
      }
      champsAutorises.medicaments = patch.medicaments;
    }
    if ('proche' in patch) {
      const pr = patch.proche;
      if (pr !== null && (typeof pr !== 'object' || !pr.telephone)) {
        return res.status(400).json({ erreur: 'Proche invalide.' });
      }
      champsAutorises.proche = pr;
    }
    if ('proche2' in patch) {
      const pr2 = patch.proche2;
      if (pr2 !== null && (typeof pr2 !== 'object' || !pr2.telephone)) {
        return res.status(400).json({ erreur: 'Proche 2 invalide.' });
      }
      champsAutorises.proche2 = pr2;
    }
    if ('historique_repas' in patch) {
      if (!Array.isArray(patch.historique_repas)) {
        return res.status(400).json({ erreur: 'historique_repas doit être un tableau.' });
      }
      champsAutorises.historique_repas = patch.historique_repas;
    }

    try {
      const user = await mettreAJourUser(tel, champsAutorises);
      if (!user) {
        return res.status(404).json({ erreur: 'Utilisateur introuvable.' });
      }
      return res.status(200).json({ user });
    } catch (e) {
      console.error('KV erreur (PUT /api/user):', e);
      return res.status(500).json({ erreur: 'Service indisponible.' });
    }
  }

  return res.status(405).end();
}
