import { normaliserTelephone } from '../_lib/phone.js';
import { getUser } from '../_lib/db.js';
import { creerSession, genererCode, signerCode } from '../_lib/session.js';

// POST /api/auth/connexion
// Body : { telephone }
//
// Logique :
//   - Si l'utilisateur existe en KV → on renvoie directement la session + le user.
//   - Sinon → on génère un code de vérification + token HMAC.
//     En DEV_MODE (ou si Twilio non configuré), le code est renvoyé dans la réponse.
//     Sinon, on l'envoie par SMS via Twilio (route /api/auth/envoyer-code).
//
// Réponse :
//   - Utilisateur connu :     { existe: true,  session, user }
//   - Nouvel utilisateur :    { existe: false, token, dev_code? }
//
// Note : aucun stockage de code côté serveur (le HMAC sert de "souvenir").

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { telephone: brut } = req.body || {};
  const tel = normaliserTelephone(brut);
  if (!tel) {
    return res.status(400).json({ erreur: 'Numéro de téléphone invalide.' });
  }

  // 1) L'utilisateur existe-t-il déjà ?
  let user;
  try {
    user = await getUser(tel);
  } catch (e) {
    console.error('KV erreur (connexion):', e);
    return res.status(500).json({ erreur: 'Service indisponible. Réessayez dans un instant.' });
  }

  if (user) {
    // Utilisateur connu → session immédiate, pas de vérif
    const session = creerSession(tel);
    return res.status(200).json({ existe: true, session, user });
  }

  // 2) Nouvel utilisateur → génère un code de vérification
  const code = genererCode();
  const token = signerCode(tel, code);

  const devMode = ['true', '1', 'yes'].includes(
    (process.env.DEV_MODE || '').toLowerCase().trim()
  );
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_FROM;
  const twilioConfigure = accountSid && authToken && from;

  // DEV_MODE ou Twilio non configuré : on renvoie le code à afficher
  if (devMode || !twilioConfigure) {
    return res.status(200).json({ existe: false, token, dev_code: code });
  }

  // SMS Twilio
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
          Body: `Mon Sucre — Votre code de connexion est : ${code}`
        })
      }
    );
    const data = await r.json();
    if (!r.ok) {
      console.error('Twilio erreur:', data.message);
      return res.status(500).json({ erreur: 'Impossible d\'envoyer le SMS. Réessayez.' });
    }
  } catch (e) {
    console.error('Twilio exception:', e);
    return res.status(500).json({ erreur: 'Impossible d\'envoyer le SMS. Réessayez.' });
  }

  return res.status(200).json({ existe: false, token });
}
