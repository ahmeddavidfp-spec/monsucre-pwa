// POST /api/salutation
// Body : { texte: "...", provider?: "elevenlabs" | "openai" }
// Par défaut : ElevenLabs (Léa)
// provider:"openai" → OpenAI TTS (nova) — pour tests DEV quand quota ElevenLabs épuisé
//
// ── Cache TTS (Redis Upstash) ────────────────────────────────────────────────
// Clé : tts:<provider>:<voiceOrModel>:<md5(texte)>
// Valeur : audio MP3 encodé en base64
// TTL : 30 jours (2 592 000 s) — partagé entre tous les utilisateurs
// Économie estimée : ~60 % des appels ElevenLabs évités
// ────────────────────────────────────────────────────────────────────────────

import crypto from 'crypto';
import { lireSessionDepuisRequete } from './_lib/session.js';
import { redis } from './_lib/db.js';

const ELEVEN_VOICE_ID = 'ICk609TItINMseDpChFt'; // Léa
// const ELEVEN_VOICE_ID = 'XrExE9yKIg1WjnnlVkGX'; // Matilda (ancienne voix)
const ELEVEN_MODEL_ID = 'eleven_multilingual_v2';

const OPENAI_VOICE    = 'nova';   // nova = voix féminine, douce, bon français
const OPENAI_MODEL    = 'tts-1';

const TTL_CACHE = 60 * 60 * 24 * 30; // 30 jours en secondes

// ── Helpers cache ────────────────────────────────────────────────────────────
function cleTTS(provider, voiceId, texte) {
  const hash = crypto.createHash('md5').update(texte).digest('hex');
  return `tts:${provider}:${voiceId}:${hash}`;
}

async function lireCache(cle) {
  try {
    const val = await redis.get(cle);
    if (val && typeof val === 'string') return Buffer.from(val, 'base64');
    return null;
  } catch (e) {
    console.error('TTS cache lecture erreur:', e.message);
    return null; // erreur cache → on continue sans cache
  }
}

async function ecrireCache(cle, buffer) {
  try {
    await redis.set(cle, buffer.toString('base64'), { ex: TTL_CACHE });
  } catch (e) {
    console.error('TTS cache écriture erreur:', e.message);
    // erreur non bloquante : l'audio a déjà été envoyé
  }
}

// ── Handler principal ────────────────────────────────────────────────────────
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });

  const { texte, provider = 'elevenlabs', voiceId } = req.body || {};
  if (!texte || typeof texte !== 'string' || texte.length > 500) {
    return res.status(400).json({ erreur: 'Texte invalide.' });
  }
  // voiceId optionnel : doit être un ID ElevenLabs valide (20 chars alphanum)
  const effectiveVoiceId = (voiceId && /^[a-zA-Z0-9]{20}$/.test(voiceId))
    ? voiceId
    : ELEVEN_VOICE_ID;

  // ── OpenAI TTS ───────────────────────────────────────────
  if (provider === 'openai') {
    const cle = cleTTS('openai', OPENAI_VOICE, texte);

    // Vérification du cache
    const cached = await lireCache(cle);
    if (cached) {
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'private, max-age=86400');
      res.setHeader('X-TTS-Cache', 'HIT');
      return res.status(200).send(cached);
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ erreur: 'Clé OpenAI manquante.' });
    try {
      const r = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: OPENAI_MODEL,
          voice: OPENAI_VOICE,
          input: texte,
          response_format: 'mp3'
        })
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({}));
        console.error('OpenAI TTS erreur:', err);
        return res.status(500).json({ erreur: 'Erreur OpenAI TTS.' });
      }
      const audio = await r.arrayBuffer();
      const buf = Buffer.from(audio);
      // Mise en cache en arrière-plan (non bloquant)
      ecrireCache(cle, buf);
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'private, max-age=86400');
      res.setHeader('X-TTS-Cache', 'MISS');
      return res.status(200).send(buf);
    } catch (e) {
      console.error('OpenAI TTS exception:', e);
      return res.status(500).json({ erreur: 'Erreur serveur OpenAI.' });
    }
  }

  // ── ElevenLabs TTS (défaut) ──────────────────────────────
  const cle = cleTTS('elevenlabs', effectiveVoiceId, texte);

  // Vérification du cache
  const cached = await lireCache(cle);
  if (cached) {
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.setHeader('X-TTS-Cache', 'HIT');
    return res.status(200).send(cached);
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ erreur: 'Clé ElevenLabs manquante.' });
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${effectiveVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: texte,
        model_id: ELEVEN_MODEL_ID,
        voice_settings: {
          stability:        0.55,
          similarity_boost: 0.80,
          style:            0.35,
          use_speaker_boost: true
        }
      })
    });
    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      console.error('ElevenLabs erreur:', err);
      return res.status(500).json({ erreur: 'Erreur ElevenLabs TTS.' });
    }
    const audio = await r.arrayBuffer();
    const buf = Buffer.from(audio);
    // Mise en cache en arrière-plan (non bloquant)
    ecrireCache(cle, buf);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'private, max-age=86400');
    res.setHeader('X-TTS-Cache', 'MISS');
    return res.status(200).send(buf);
  } catch (e) {
    console.error('ElevenLabs exception:', e);
    return res.status(500).json({ erreur: 'Erreur serveur ElevenLabs.' });
  }
}
