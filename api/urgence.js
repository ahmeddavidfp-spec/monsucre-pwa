export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom_utilisateur, telephone_proche, timestamp } = req.body;

  if (!telephone_proche) {
    return res.status(400).json({ ok: false, erreur: 'Aucun proche configuré.' });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_FROM;

  if (!accountSid || !authToken || !from) {
    console.log(`[DEV] SMS urgence pour ${prenom_utilisateur} → ${telephone_proche}`);
    return res.status(200).json({ ok: true, dev: true });
  }

  const heure = new Date(timestamp).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });

  // Format E.164 : +32470000000
  let tel = telephone_proche.replace(/[\s\-\.\(\)]/g, '');
  if (!tel.startsWith('+')) {
    if (tel.startsWith('00')) tel = '+' + tel.slice(2);
    else if (tel.startsWith('0')) tel = '+32' + tel.slice(1);
    else tel = '+' + tel;
  }

  try {
    const credentials = Buffer.from(`${accountSid}:${authToken}`).toString('base64');
    const r = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          From: from,
          To: tel,
          Body: `URGENT - Mon Sucre : ${prenom_utilisateur} ne se sent pas bien. Bouton urgence appuyé à ${heure}. Contactez-le rapidement.`
        })
      }
    );

    const data = await r.json();
    if (!r.ok) {
      console.error('Twilio erreur:', JSON.stringify(data));
      return res.status(200).json({ ok: false, erreur: data.message });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Twilio fetch error:', e.message);
    return res.status(200).json({ ok: false, erreur: e.message });
  }
}
