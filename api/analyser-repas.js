// POST /api/analyser-repas
// Body : { image, type } OU { texte }
// Auth : Bearer token requis
//
// Renvoie :
//   {
//     est_nourriture: true | false,
//     conseil: "Phrase chaleureuse 2 phrases max",
//     analyse: { plat, portion, calories, glucides_g, sucres_g, lipides_g,
//                proteines_g, fibres_g, sel_g, index_glycemique, indice_diabete,
//                remarque_diabete } | null
//   }

import { lireSessionDepuisRequete } from './_lib/session.js';

const INSTRUCTION = `Tu es un assistant nutritionniste bienveillant pour une personne âgée diabétique.

Analyse ce qui est présenté et renvoie UNIQUEMENT un objet JSON valide, sans markdown, sans texte avant ou après.

RÈGLE PRIORITAIRE : si l'image ou la description ne montre pas un repas, une boisson, un aliment ou une nourriture quelconque, renvoie exactement ce JSON (sans rien d'autre) :
{"est_nourriture":false,"conseil":"Je ne vois pas de repas sur cette image. Essayez de photographier votre assiette ou votre verre.","analyse":null}

Si c'est bien un aliment ou une boisson, renvoie :
{
  "est_nourriture": true,
  "conseil": "Phrase chaleureuse, simple, encourageante (2 phrases maximum, sans chiffres, sans jargon médical). Si le repas est bon : félicite chaleureusement. Si trop sucré ou gras : suggère doucement une amélioration pour la prochaine fois.",
  "analyse": {
    "plat": "Nom court du plat identifié (ex: Spaghetti bolognaise)",
    "portion": "Estimation visible de la portion (ex: 1 assiette moyenne, environ 300g)",
    "calories": entier en kcal,
    "glucides_g": nombre décimal,
    "sucres_g": nombre décimal,
    "lipides_g": nombre décimal,
    "proteines_g": nombre décimal,
    "fibres_g": nombre décimal,
    "sel_g": nombre décimal avec 1 décimale,
    "index_glycemique": "bas" ou "modere" ou "eleve",
    "indice_diabete": "ok" ou "attention" ou "eviter",
    "remarque_diabete": "1 phrase technique courte expliquant l'impact glycémique pour un diabétique"
  }
}

Sois précis, cohérent et reproductible dans tes estimations nutritionnelles. Si tu ne peux pas estimer un champ numérique, utilise null. N'écris RIEN d'autre que le JSON.`;

function extraireJson(texte) {
  if (!texte) return null;
  let t = texte.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  const debut = t.indexOf('{');
  const fin = t.lastIndexOf('}');
  if (debut === -1 || fin === -1 || fin <= debut) return null;
  try {
    return JSON.parse(t.slice(debut, fin + 1));
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ erreur: 'Non authentifié.' });

  const { texte, image, type } = req.body || {};

  const contenu = image
    ? [
        { type: 'image', source: { type: 'base64', media_type: type, data: image } },
        { type: 'text', text: INSTRUCTION }
      ]
    : [{ type: 'text', text: `Voici la description orale du repas : "${texte}".\n\n${INSTRUCTION}` }];

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
        max_tokens: 700,
        temperature: 0,
        messages: [{ role: 'user', content: contenu }]
      })
    });
    const data = await r.json();
    const brut = data.content?.[0]?.text || '';

    const parsed = extraireJson(brut);
    if (parsed && parsed.conseil) {
      return res.status(200).json({
        est_nourriture: parsed.est_nourriture !== false,
        conseil: parsed.conseil,
        analyse: parsed.analyse || null
      });
    }

    // Fallback graceful
    return res.status(200).json({
      est_nourriture: true,
      conseil: brut.trim() || 'Bien mangé ! Continuez comme ça.',
      analyse: null
    });
  } catch (e) {
    console.error('analyser-repas erreur:', e);
    return res.status(200).json({
      est_nourriture: true,
      conseil: 'Votre repas est noté. Continuez à bien manger !',
      analyse: null
    });
  }
}
