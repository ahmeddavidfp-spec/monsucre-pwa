import { envoyerSMS, smsConfigured } from './_lib/sms.js';
import { normaliserTelephone } from './_lib/phone.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prenom_utilisateur, telephone_proche, timestamp } = req.body;

  if (!telephone_proche) {
    return res.status(400).json({ ok: false, erreur: 'Aucun proche configuré.' });
  }

  const tel   = normaliserTelephone(telephone_proche);
  const heure = new Date(timestamp).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  const msg   = `URGENT - Mon Sucre : ${prenom_utilisateur} ne se sent pas bien. Bouton urgence appuyé à ${heure}. Contactez-le rapidement.`;

  if (!smsConfigured()) {
    console.log(`[DEV] SMS urgence pour ${prenom_utilisateur} → ${tel} : ${msg}`);
    return res.status(200).json({ ok: true, dev: true });
  }

  try {
    await envoyerSMS(tel, msg);
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('SMS urgence erreur:', e.message);
    return res.status(200).json({ ok: false, erreur: e.message });
  }
}
