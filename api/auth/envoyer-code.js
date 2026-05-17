import crypto from 'crypto';

function genererCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

function signerToken(telephone, code) {
  const fenetre = Math.floor(Date.now() / 600000);
  const secret = process.env.SESSION_SECRET || 'monsucre-dev-secret';
  return crypto
    .createHmac('sha256', secret)
    .update(`${telephone}:${code}:${fenetre}`)
    .digest('hex');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom, telephone } = req.body;
  if (!prenom || !telephone) {
    return res.status(400).json({ erreur: 'Prénom et téléphone requis.' });
  }

  const tel = telephone.replace(/\s/g, '');
  if (!/^\+?[0-9]{8,15}$/.test(tel)) {
    return res.status(400).json({ erreur: 'Numéro de téléphone invalide.' });
  }

  const code = genererCode();
  const token = signerToken(tel, code);

  const devMode = ['true', '1', 'yes'].includes((process.env.DEV_MODE || '').toLowerCase().trim());
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_FROM;

  // DEV_MODE ou Twilio non configuré : code affiché directement
  if (devMode || !accountSid || !authToken || !from) {
    return res.status(200).json({ token, dev_code: code });
  }

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const r = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: from,
          To: tel,
          Body: `Mon Sucre — Bonjour ${prenom} ! Votre code de connexion est : ${code}`
        })
      }
    );
    const data = await r.json();
    if (!r.ok) {
      console.error('Twilio erreur:', data.message);
      return res.status(500).json({ erreur: 'Impossible d\'envoyer le SMS. Réessayez.' });
    }
  } catch {
    return res.status(500).json({ erreur: 'Impossible d\'envoyer le SMS. Réessayez.' });
  }

  res.status(200).json({ token });
}
