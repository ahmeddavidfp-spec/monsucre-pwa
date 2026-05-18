// POST /api/analyser-repas
// Body : { image, type } OU { texte }
//
// Renvoie :
//   {
//     conseil: "Phrase chaleureuse 2 phrases max",
//     analyse: {
//       plat, portion, calories, glucides_g, sucres_g, lipides_g,
//       proteines_g, fibres_g, sel_g, index_glycemique, indice_diabete,
//       remarque_diabete
//     }
//   }
//
// Si Claude ne renvoie pas un JSON parsable, on dégrade gracefully :
// le conseil est utilisé tel quel et `analyse` est null.

const INSTRUCTION = `Tu es un assistant nutritionniste bienveillant pour une personne âgée diabétique.

Analyse ce repas et renvoie UNIQUEMENT un objet JSON valide, sans markdown, sans texte avant ou après.

Structure exacte attendue :
{
  "conseil": "Phrase chaleureuse, simple, encourageante (2 phrases maximum, sans chiffres, sans jargon médical). Si le repas est bon : félicite. Si trop sucré/gras : suggère doucement une amélioration pour la prochaine fois.",
  "analyse": {
    "plat": "Nom court du plat (ex: Spaghetti bolognaise)",
    "portion": "Estimation visible de la portion (ex: 1 assiette moyenne, 200g)",
    "calories": entier en kcal,
    "glucides_g": nombre,
    "sucres_g": nombre,
    "lipides_g": nombre,
    "proteines_g": nombre,
    "fibres_g": nombre,
    "sel_g": nombre avec 1 décimale,
    "index_glycemique": "bas" | "modere" | "eleve",
    "indice_diabete": "ok" | "attention" | "eviter",
    "remarque_diabete": "1 phrase technique courte expliquant l'impact glycémique"
  }
}

Si tu ne peux pas estimer un champ numérique, utilise null. N'écris RIEN d'autre que le JSON.`;

function extraireJson(texte) {
  if (!texte) return null;
  // Retire les éventuels blocs markdown ```json ... ```
  let t = texte.trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/```$/, '').trim();
  // Trouve le premier { et le dernier }
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
        max_tokens: 600,
        messages: [{ role: 'user', content: contenu }]
      })
    });
    const data = await r.json();
    const brut = data.content?.[0]?.text || '';

    const parsed = extraireJson(brut);
    if (parsed && parsed.conseil) {
      return res.status(200).json({
        conseil: parsed.conseil,
        analyse: parsed.analyse || null
      });
    }

    // Fallback : Claude n'a pas renvoyé de JSON exploitable → on prend le texte tel quel
    return res.status(200).json({
      conseil: brut.trim() || 'Bien mangé ! Continuez comme ça.',
      analyse: null
    });
  } catch (e) {
    console.error('analyser-repas erreur:', e);
    return res.status(200).json({
      conseil: 'Votre repas est noté. Continuez à bien manger !',
      analyse: null
    });
  }
}
