import crypto from 'crypto';

const SECRET = process.env.SESSION_SECRET || 'monsucre-dev-secret';

// ── Code de vérification (HMAC, sans état serveur) ──────
// Le code à 4 chiffres est généré côté serveur, mais on ne le stocke pas.
// On renvoie au client un token HMAC = HMAC(telephone:code:fenetre).
// Le client renvoie code + token ; on recalcule et compare.
// Fenêtre de 10 min pour gérer les retards d'entrée + une fenêtre de tolérance.

const FENETRE_MS = 10 * 60 * 1000;

export function genererCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

export function signerCode(telephone, code) {
  const fenetre = Math.floor(Date.now() / FENETRE_MS);
  return crypto
    .createHmac('sha256', SECRET)
    .update(`${telephone}:${code}:${fenetre}`)
    .digest('hex');
}

export function verifierCode(telephone, code, token) {
  if (!token || token.length !== 64) return false;
  if (!/^[0-9]{4}$/.test(code || '')) return false;

  const fenetre = Math.floor(Date.now() / FENETRE_MS);
  for (const f of [fenetre, fenetre - 1]) {
    const attendu = crypto
      .createHmac('sha256', SECRET)
      .update(`${telephone}:${code}:${f}`)
      .digest('hex');
    try {
      if (crypto.timingSafeEqual(Buffer.from(attendu, 'hex'), Buffer.from(token, 'hex'))) {
        return true;
      }
    } catch {
      // longueur différente — pas un match
    }
  }
  return false;
}

// ── Session (HMAC, sans état serveur) ───────────────────
// Format : <payload-base64url>.<signature-hex>
// Payload = { telephone, ts, exp }
// exp = ts + SESSION_DUREE_MS (90 jours par défaut)
// Rétrocompatibilité : les anciens tokens sans exp sont toujours acceptés.

const SESSION_DUREE_MS = 90 * 24 * 60 * 60 * 1000; // 90 jours

export function creerSession(telephone) {
  const ts  = Date.now();
  const exp = ts + SESSION_DUREE_MS;
  const payload = Buffer
    .from(JSON.stringify({ telephone, ts, exp }))
    .toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function lireSession(token) {
  if (!token || typeof token !== 'string' || !token.includes('.')) return null;

  const [payload, sig] = token.split('.');
  if (!payload || !sig || sig.length !== 64) return null;

  const attendu = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  try {
    if (!crypto.timingSafeEqual(Buffer.from(sig, 'hex'), Buffer.from(attendu, 'hex'))) {
      return null;
    }
  } catch {
    return null;
  }

  let data;
  try {
    data = JSON.parse(Buffer.from(payload, 'base64url').toString());
  } catch {
    return null;
  }

  // Vérifie l'expiration — les anciens tokens sans exp sont toujours acceptés
  if (data.exp && Date.now() > data.exp) return null;

  return data;
}

// Lit la session depuis l'en-tête Authorization: Bearer <token>
// Renvoie le payload { telephone, ts, exp } ou null.
export function lireSessionDepuisRequete(req) {
  const auth = req.headers?.authorization || req.headers?.Authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  return lireSession(auth.slice(7));
}
