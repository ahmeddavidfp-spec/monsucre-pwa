export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  // TODO: marquer le médicament comme pris en base Neon
  res.status(200).json({ ok: true });
}
