export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const de = process.env.TWILIO_FROM;
  const vers = process.env.URGENCE_TELEPHONE; // numéro de la famille

  if (!accountSid || !vers) {
    return res.status(200).json({ ok: true }); // en dev, on simule
  }

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        From: de,
        To: vers,
        Body: `⚠️ Mon Sucre : votre proche ne se sent pas bien. Il a appuyé sur le bouton d'urgence à ${new Date().toLocaleTimeString('fr-BE')}. Contactez-le rapidement.`
      })
    });
  } catch { /* on continue même si Twilio échoue */ }

  res.status(200).json({ ok: true });
}
