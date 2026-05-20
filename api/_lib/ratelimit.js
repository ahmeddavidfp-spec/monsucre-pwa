// Rate limiting léger via Upstash Redis (TTL-based, sans dépendance externe).
//
// Utilisation :
//   const ok = await rateLimitSMS(telephone);  // true = autorisé, false = bloqué
//
// Stratégie :
//   Clé Redis : ratelimit:sms:<tel>
//   TTL        : 60 secondes
//   Limite     : 1 SMS par minute par numéro
//   Si Redis indisponible → on laisse passer (fail-open pour ne pas bloquer les vrais utilisateurs)

import { redis } from './db.js';

const TTL_SECONDES = 60; // 1 tentative max par minute par numéro

export async function rateLimitSMS(telephone) {
  if (!telephone) return false;
  const cle = `ratelimit:sms:${telephone}`;
  try {
    // SETNX : pose la clé seulement si elle n'existe pas encore
    const nouveau = await redis.set(cle, '1', { nx: true, ex: TTL_SECONDES });
    // nouveau = 'OK' si la clé a été créée (premier appel dans la fenêtre)
    // nouveau = null si elle existait déjà (déjà un envoi récent → bloquer)
    return nouveau === 'OK';
  } catch (e) {
    console.error('ratelimit erreur (fail-open):', e.message);
    return true; // fail-open : on laisse passer si Redis est indisponible
  }
}
