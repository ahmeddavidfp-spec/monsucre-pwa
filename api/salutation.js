// POST /api/salutation
// Body : { texte: "...", provider?: "elevenlabs" | "openai" }
// Par défaut : ElevenLabs (Matilda)
// provider:"openai" → OpenAI TTS (nova) — pour tests DEV quand quota ElevenLabs épuisé
// ⬆️ Après upgrade ElevenLabs : remplacer ELEVEN_VOICE_ID par 'tMyQcCxfGDdIt7wJ2RQw' (Marie-Alice)

import { lireSessionDepuisRequete } from './_lib/session.js';

const ELEVEN_VOICE_ID = 'XrExE9yKIg1WjnnlVkGX'; // Matilda — gratuit
// const ELEVEN_VOICE_ID = 'tMyQcCxfGDdIt7wJ2RQw'; // Marie-Alice — après upgrade
const ELEVEN_MODEL_ID = 'eleven_multilingual_v2';

const OPENAI_VOICE    = 'nova';   // nova = voix féminine, douce, bon français
const OPENAI_MODEL    = 'tts-1';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });

  const { texte, provider = 'elevenlabs' } = req.body || {};
  if (!texte || typeof texte !== 'string' || texte.length > 500) {
    return res.status(400).json({ erreur: 'Texte invalide.' });
  }

  // ── OpenAI TTS ───────────────────────────────────────────
  if (provider === 'openai') {
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
      res.setHeader('Content-Type', 'audio/mpeg');
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).send(Buffer.from(audio));
    } catch (e) {
      console.error('OpenAI TTS exception:', e);
      return res.status(500).json({ erreur: 'Erreur serveur OpenAI.' });
    }
  }

  // ── ElevenLabs TTS (défaut) ──────────────────────────────
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ erreur: 'Clé ElevenLabs manquante.' });
  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`, {
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
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).send(Buffer.from(audio));
  } catch (e) {
    console.error('ElevenLabs exception:', e);
    return res.status(500).json({ erreur: 'Erreur serveur ElevenLabs.' });
  }
}
