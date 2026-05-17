import crypto from 'crypto';

function verifierToken(telephone, code, token) {
  const secret = process.env.SESSION_SECRET || 'monsucre-dev-secret';
  const fenetre = Math.floor(Date.now() / 600000);

  // On accepte la fenêtre actuelle et la précédente (évite les expiration en bord de fenêtre)
  for (const f of [fenetre, fenetre - 1]) {
    const attendu = crypto
      .createHmac('sha256', secret)
      .update(`${telephone}:${code}:${f}`)
      .digest('hex');
    if (crypto.timingSafeEqual(Buffer.from(attendu), Buffer.from(token))) return true;
  }
  return false;
}

function creerSession(prenom, telephone) {
  const secret = process.env.SESSION_SECRET || 'monsucre-dev-secret';
  const payload = Buffer.from(JSON.stringify({ prenom, telephone, ts: Date.now() })).toString('base64');
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom, telephone, code, token } = req.body;
  if (!telephone || !code || !token) {
    return res.status(400).json({ erreur: 'Données manquantes.' });
  }

  const tel = telephone.replace(/\s/g, '');

  if (token.length !== 64 || !verifierToken(tel, code, token)) {
    return res.status(400).json({ erreur: 'Code incorrect ou expiré. Réessayez.' });
  }

  const session = creerSession(prenom, tel);
  res.status(200).json({ ok: true, session, prenom });
}
