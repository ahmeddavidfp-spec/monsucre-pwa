import { normaliserTelephone } from '../_lib/phone.js';
import { genererCode, signerCode } from '../_lib/session.js';
import { envoyerSMS, smsConfigured } from '../_lib/sms.js';

// POST /api/auth/envoyer-code
// Body : { telephone }
//
// Route utilisée pour le bouton "Renvoyer le code".
// Renvoie : { token, dev_code? }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { telephone: brut } = req.body || {};
  const tel = normaliserTelephone(brut);
  if (!tel) {
    return res.status(400).json({ erreur: 'Numéro de téléphone invalide.' });
  }

  const code  = genererCode();
  const token = signerCode(tel, code);

  const devMode = ['true', '1', 'yes'].includes(
    (process.env.DEV_MODE || '').toLowerCase().trim()
  );

  if (devMode || !smsConfigured()) {
    return res.status(200).json({ token, dev_code: code });
  }

  try {
    await envoyerSMS(tel, `Mon Sucre — Votre code de connexion est : ${code}`);
  } catch (e) {
    console.error('SMS erreur (envoyer-code):', e.message);
    return res.status(500).json({ erreur: 'Impossible d\'envoyer le SMS. Réessayez.' });
  }

  return res.status(200).json({ token });
}
