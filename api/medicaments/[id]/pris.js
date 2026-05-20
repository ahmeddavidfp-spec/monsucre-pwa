// Route héritée — non utilisée (les prises sont gérées côté client via localStorage + /api/user).
// Répond 410 Gone pour éviter toute confusion.

export default async function handler(req, res) {
  return res.status(410).json({ erreur: 'Route dépréciée. Utilisez /api/user pour les prises.' });
}
