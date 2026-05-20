// POST /api/analyser-medicament
// Body : { image, type }
// Auth : Bearer token requis
//
// Identifie un médicament sur une photo.
// Renvoie : { nom, dosage, instructions, indication }
// Si non reconnu : { nom: null, dosage: null, instructions: null, indication: null }

import { lireSessionDepuisRequete } from './_lib/session.js';

const INSTRUCTION = `Tu es un assistant médical. Identifie le médicament visible sur cette photo (boîte, blister, flacon ou comprimé).
Renvoie UNIQUEMENT un objet JSON valide, sans markdown, sans texte avant ou après.

Si tu identifies un médicament :
{
  "nom": "Nom complet du médicament avec dosage si visible (ex: Metformine 500mg, Aspirine 100mg)",
  "dosage": "Dosage seul si visible (ex: 500mg, 100mcg) ou null",
  "instructions": "Posologie visible sur l'emballage (ex: 1 comprimé le matin) ou null",
  "indication": "Explication simple et courte de l'utilité du médicament pour un patient senior (max 2 phrases, langage simple, ex: 'Ce médicament aide à contrôler le taux de sucre dans le sang. Il est utilisé pour traiter le diabète de type 2.')"
}

Si ce n'est pas un médicament ou si tu ne peux pas identifier :
{ "nom": null, "dosage": null, "instructions": null, "indication": null }

N'écris RIEN d'autre que le JSON.`;

function extraireJson(texte) {
  if (!texte) return null;
  let t = texte.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  const debut = t.indexOf('{');
  const fin = t.lastIndexOf('}');
  if (debut === -1 || fin === -1 || fin <= debut) return null;
  try { return JSON.parse(t.slice(debut, fin + 1)); } catch { return null; }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });

  const { image, type } = req.body || {};
  if (!image) return res.status(400).json({ erreur: 'Image manquante.' });

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        temperature: 0,
        messages: [{
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: type || 'image/jpeg', data: image } },
            { type: 'text', text: INSTRUCTION }
          ]
        }]
      })
    });
    const data = await r.json();
    const brut = data.content?.[0]?.text || '';
    const parsed = extraireJson(brut);

    return res.status(200).json({
      nom:          parsed?.nom          || null,
      dosage:       parsed?.dosage       || null,
      instructions: parsed?.instructions || null,
      indication:   parsed?.indication   || null
    });
  } catch (e) {
    console.error('analyser-medicament erreur:', e);
    return res.status(200).json({ nom: null, dosage: null, instructions: null });
  }
}
