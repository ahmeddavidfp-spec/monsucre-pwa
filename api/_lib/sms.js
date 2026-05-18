// ── Envoi SMS via smsgateway.be (Smstools) ────────────────
//
// Variables d'environnement requises :
//   SMSGATEWAY_CLIENT_ID      → votre API key
//   SMSGATEWAY_CLIENT_SECRET  → votre API secret
//   SMSGATEWAY_SENDER         → nom d'expéditeur affiché (ex: "MonSucre", max 11 car.)
//
// En DEV_MODE ou si les vars ne sont pas configurées, envoyerSMS() lève une erreur
// et l'appelant doit retourner le code en clair (dev_code).

const API_URL = 'https://api.smsgatewayapi.com/v1/message/send';

/**
 * Envoie un SMS via smsgateway.be.
 * @param {string} telephone  - Numéro E.164 ex: +32496123456
 * @param {string} message    - Texte du SMS
 * @returns {Promise<object>} - Réponse JSON de l'API
 * @throws {Error}            - Si l'envoi échoue ou les credentials sont absents
 */
export async function envoyerSMS(telephone, message) {
  const clientId     = process.env.SMSGATEWAY_CLIENT_ID;
  const clientSecret = process.env.SMSGATEWAY_CLIENT_SECRET;
  const sender       = process.env.SMSGATEWAY_SENDER || 'MonSucre';

  if (!clientId || !clientSecret) {
    throw new Error('SMSGATEWAY non configuré (CLIENT_ID / CLIENT_SECRET manquants).');
  }

  // smsgateway.be attend le numéro sans le "+" (ex: 32496123456)
  const to = telephone.replace(/^\+/, '');

  const r = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'X-Client-Id':     clientId,
      'X-Client-Secret': clientSecret,
      'Content-Type':    'application/json',
    },
    body: JSON.stringify({ message, to, sender }),
  });

  const data = await r.json().catch(() => ({}));

  if (!r.ok) {
    const detail = data?.message || data?.error || `HTTP ${r.status}`;
    throw new Error(`smsgateway.be erreur : ${detail}`);
  }

  return data;
}

/**
 * Renvoie true si les credentials smsgateway.be sont bien définis.
 */
export function smsConfigured() {
  return !!(process.env.SMSGATEWAY_CLIENT_ID && process.env.SMSGATEWAY_CLIENT_SECRET);
}
