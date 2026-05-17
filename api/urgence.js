export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom_utilisateur, telephone_proche, callmebot_apikey, timestamp } = req.body;

  if (!telephone_proche || !callmebot_apikey) {
    console.log(`[DEV] Urgence pour ${prenom_utilisateur} — proche non configuré`);
    return res.status(200).json({ ok: true });
  }

  const heure = new Date(timestamp).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  const texte = encodeURIComponent(
    `⚠️ Mon Sucre — ${prenom_utilisateur} ne se sent pas bien. Bouton d'urgence appuyé à ${heure}. Contactez-le rapidement.`
  );
  const tel = telephone_proche.replace(/\s/g, '').replace(/^\+/, '');

  try {
    const url = `https://api.callmebot.com/whatsapp.php?phone=${tel}&text=${texte}&apikey=${callmebot_apikey}`;
    const r = await fetch(url);
    if (!r.ok) console.error('CallMeBot error:', await r.text());
  } catch (e) {
    console.error('CallMeBot fetch error:', e);
  }

  res.status(200).json({ ok: true });
}
