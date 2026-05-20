// POST /api/salutation
// Body : { texte: "..." }
// Appelle ElevenLabs TTS (voix française chaleureuse) et renvoie l'audio MP3.

import { lireSessionDepuisRequete } from './_lib/session.js';

// Voix ElevenLabs — "Marie-Alice" : voix choisie par l'utilisateur
const VOICE_ID  = 'tMyQcCxfGDdIt7wJ2RQw';
const MODEL_ID  = 'eleven_multilingual_v2';

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
          stability:        0.55,  // légère variation = plus naturel
          similarity_boost: 0.80,  // fidèle à la voix d'origine
          style:            0.35,  // chaleureux, expressif
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
