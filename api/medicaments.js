// Route héritée — non utilisée dans l'app (les médicaments sont gérés côté client via localStorage + /api/user).
// Conservée pour ne pas casser d'éventuels anciens clients, mais répond 410 Gone.

export default async function handler(req, res) {
  return res.status(410).json({ erreur: 'Route dépréciée. Utilisez /api/user pour accéder aux médicaments.' });
}
