import { normaliserTelephone } from '../_lib/phone.js';
import { getUser } from '../_lib/db.js';
import { creerSession, genererCode, signerCode } from '../_lib/session.js';
import { envoyerSMS, smsConfigured } from '../_lib/sms.js';

// POST /api/auth/connexion
// Body : { telephone }
//
// Logique :
//   - Si l'utilisateur existe en KV → session immédiate (pas de code).
//   - Sinon → code HMAC généré.
//     En DEV_MODE (ou si smsgateway.be non configuré) → dev_code renvoyé.
//     Sinon → SMS envoyé via smsgateway.be.
//
// Réponse :
//   - Utilisateur connu :     { existe: true,  session, user }
//   - Nouvel utilisateur :    { existe: false, token, dev_code? }

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { telephone: brut } = req.body || {};
  const tel = normaliserTelephone(brut);
  if (!tel) {
    return res.status(400).json({ erreur: 'Numéro de téléphone invalide.' });
  }

  // 1) Utilisateur déjà connu → session directe
  let user;
  try {
    user = await getUser(tel);
  } catch (e) {
    console.error('KV erreur (connexion):', e);
    return res.status(500).json({ erreur: 'Service indisponible. Réessayez dans un instant.' });
  }

  if (user) {
    const session = creerSession(tel);
    return res.status(200).json({ existe: true, session, user });
  }

  // 2) Nouvel utilisateur → code de vérification
  const code  = genererCode();
  const token = signerCode(tel, code);

  const devMode = ['true', '1', 'yes'].includes(
    (process.env.DEV_MODE || '').toLowerCase().trim()
  );

  if (devMode || !smsConfigured()) {
    return res.status(200).json({ existe: false, token, dev_code: code });
  }

  // Envoi SMS via smsgateway.be
  try {
    await envoyerSMS(tel, `Mon Sucre — Votre code de connexion est : ${code}`);
  } catch (e) {
    console.error('SMS erreur (connexion):', e.message);
    return res.status(500).json({ erreur: 'Impossible d\'envoyer le SMS. Réessayez.' });
  }

  return res.status(200).json({ existe: false, token });
}
