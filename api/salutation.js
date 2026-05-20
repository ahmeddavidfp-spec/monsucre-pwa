// POST /api/salutation
// Body : { texte: "..." }
// ElevenLabs TTS — voix Matilda (gratuit)
// ⬆️ Après upgrade : remplacer VOICE_ID par 'tMyQcCxfGDdIt7wJ2RQw' (Marie-Alice)

import { lireSessionDepuisRequete } from './_lib/session.js';

const VOICE_ID = 'XrExE9yKIg1WjnnlVkGX'; // Matilda — gratuit
// const VOICE_ID = 'tMyQcCxfGDdIt7wJ2RQw'; // Marie-Alice — après upgrade
const MODEL_ID = 'eleven_multilingual_v2';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });

  const { texte } = req.body || {};
  if (!texte || typeof texte !== 'string' || texte.length > 500) {
    return res.status(400).json({ erreur: 'Texte invalide.' });
  }

  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) return res.status(500).json({ erreur: 'Clé ElevenLabs manquante.' });

  try {
    const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: texte,
        model_id: MODEL_ID,
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
    res.status(200).send(Buffer.from(audio));

  } catch (e) {
    console.error('salutation erreur:', e);
    return res.status(500).json({ erreur: 'Erreur serveur.' });
  }
}
