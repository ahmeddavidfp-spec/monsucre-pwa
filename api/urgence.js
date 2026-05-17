export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom_utilisateur, telephone_proche, timestamp } = req.body;

  if (!telephone_proche) {
    return res.status(400).json({ ok: false, erreur: 'Aucun proche configuré.' });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.log(`[DEV] SMS urgence pour ${prenom_utilisateur} → ${telephone_proche}`);
    return res.status(200).json({ ok: true, dev: true });
  }

  const heure = new Date(timestamp).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });

  try {
    const r = await fetch('https://api.brevo.com/v3/transactionalSMS/sms', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sender: 'MonSucre',
        recipient: telephone_proche.replace(/\s/g, ''),
        content: `URGENT - ${prenom_utilisateur} ne se sent pas bien. Bouton urgence appuye a ${heure}. Contactez-le rapidement. (Mon Sucre)`
      })
    });

    const data = await r.json();

    if (!r.ok) {
      console.error('Brevo erreur:', JSON.stringify(data));
      return res.status(200).json({ ok: false, erreur: 'Échec envoi SMS.', detail: data.message });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Brevo fetch error:', e.message);
    return res.status(200).json({ ok: false, erreur: 'Impossible de contacter Brevo.', detail: e.message });
  }
}
