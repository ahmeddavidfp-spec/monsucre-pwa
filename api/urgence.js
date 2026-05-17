export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom_utilisateur, telephone_proche, timestamp } = req.body;

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_FROM;

  if (!accountSid || !authToken || !from || !telephone_proche) {
    console.log(`[DEV] Urgence pour ${prenom_utilisateur} → ${telephone_proche}`);
    return res.status(200).json({ ok: true });
  }

  try {
    const heure = new Date(timestamp).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: from,
        To: telephone_proche,
        Body: `⚠️ Mon Sucre — ${prenom_utilisateur} ne se sent pas bien. Il a appuyé sur le bouton d'urgence à ${heure}. Contactez-le rapidement.`
      })
    });
  } catch (e) {
    console.error('Twilio error:', e);
  }

  res.status(200).json({ ok: true });
}
