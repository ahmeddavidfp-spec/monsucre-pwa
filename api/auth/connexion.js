import { normaliserTelephone } from '../_lib/phone.js';
import { genererCode, signerCode } from '../_lib/session.js';
import { envoyerSMS, smsConfigured } from '../_lib/sms.js';
import { rateLimitSMS } from '../_lib/ratelimit.js';

// POST /api/auth/connexion
// Body : { telephone }
//
// Génère toujours un code de vérification SMS, qu'il s'agisse d'un nouvel
// utilisateur ou d'un utilisateur existant.
//
// ⚠️  Ne jamais renvoyer de session sans vérification SMS :
//     quiconque connaît un numéro de téléphone pourrait sinon accéder au compte.
//
// La création du compte (si nouveau) est gérée par /api/auth/verifier-code
// après confirmation du code.
//
// Réponse :  { token, dev_code? }
//   - En prod (SMS configuré) : { token }
//   - En DEV_MODE ou sans SMS  : { token, dev_code }

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

  // Rate limit : 1 SMS par minute par numéro
  const autorise = await rateLimitSMS(tel);
  if (!autorise) {
    return res.status(429).json({ erreur: 'Trop de tentatives. Attendez une minute avant de réessayer.' });
  }

  // Envoi SMS via smsgateway.be
  try {
    await envoyerSMS(tel, `Mon Sucre — Votre code de connexion est : ${code}`);
  } catch (e) {
    console.error('SMS erreur (connexion):', e.message);
    return res.status(500).json({ erreur: 'Impossible d\'envoyer le SMS. Réessayez.' });
  }

  return res.status(200).json({ token });
}
