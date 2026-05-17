export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom_utilisateur, telephone_proche, callmebot_apikey, timestamp } = req.body;

  if (!telephone_proche || !callmebot_apikey) {
    return res.status(400).json({ ok: false, erreur: 'Proche non configuré (numéro ou clé manquant).' });
  }

  // Format : supprimer espaces et +, garder chiffres uniquement
  const tel = telephone_proche.replace(/[\s\-\(\)]/g, '').replace(/^\+/, '');

  const heure = new Date(timestamp).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  const message = `Mon Sucre - ${prenom_utilisateur} ne se sent pas bien. Urgence declenchee a ${heure}. Contactez-le rapidement.`;
  const texte = encodeURIComponent(message);

  const url = `https://api.callmebot.com/whatsapp.php?phone=${tel}&text=${texte}&apikey=${callmebot_apikey}`;

  try {
    const r = await fetch(url);
    const body = await r.text();

    if (!r.ok || body.toLowerCase().includes('error')) {
      console.error('CallMeBot erreur:', body);
      return res.status(200).json({ ok: false, erreur: 'CallMeBot a refusé le message.', detail: body });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('CallMeBot fetch error:', e.message);
    return res.status(200).json({ ok: false, erreur: 'Impossible de contacter CallMeBot.', detail: e.message });
  }
}
