export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { texte, image, type } = req.body;

  const contenu = image
    ? [
        { type: 'image', source: { type: 'base64', media_type: type, data: image } },
        { type: 'text', text: 'Regarde ce repas. Donne un conseil bienveillant et simple (2 phrases maximum) pour une personne âgée diabétique. Pas de chiffres, pas de jargon médical. Encourage-la.' }
      ]
    : [{ type: 'text', text: `Mon repas : "${texte}". Donne un conseil bienveillant et simple (2 phrases maximum) pour une personne âgée diabétique. Pas de chiffres, pas de jargon médical. Encourage-la.` }];

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
        max_tokens: 150,
        messages: [{ role: 'user', content: contenu }]
      })
    });
    const data = await r.json();
    const conseil = data.content?.[0]?.text || 'Bien mangé ! Continuez comme ça.';
    res.status(200).json({ conseil });
  } catch {
    res.status(200).json({ conseil: 'Votre repas est noté. Continuez à bien manger !' });
  }
}
