// POST /api/salutation
// Body : { texte: "..." }
// Appelle OpenAI TTS (voix Nova) et renvoie l'audio MP3.

import { lireSessionDepuisRequete } from './_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });

  const { texte } = req.body || {};
  if (!texte || typeof texte !== 'string' || texte.length > 500) {
    return res.status(400).json({ erreur: 'Texte invalide.' });
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
        model: 'tts-1',
        voice: 'nova',
        input: texte,
        speed: 0.92
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
    res.status(200).send(Buffer.from(audio));

  } catch (e) {
    console.error('salutation erreur:', e);
    return res.status(500).json({ erreur: 'Erreur serveur.' });
  }
}
