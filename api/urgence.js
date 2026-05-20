import { envoyerSMS, smsConfigured } from './_lib/sms.js';
import { normaliserTelephone } from './_lib/phone.js';
import { lireSessionDepuisRequete } from './_lib/session.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const session = lireSessionDepuisRequete(req);
  if (!session?.telephone) return res.status(401).json({ ok: false, erreur: 'Non authentifié.' });

  const { prenom_utilisateur, telephone_proche, timestamp } = req.body;

  if (!telephone_proche) {
    return res.status(400).json({ ok: false, erreur: 'Aucun proche configuré.' });
  }

  const { telephone_utilisateur } = req.body;
  const tel   = normaliserTelephone(telephone_proche);
  // Sanitisation anti-injection SMS : tronque + supprime les retours à la ligne
  const prenomSafe = String(prenom_utilisateur || 'Votre proche').slice(0, 50).replace(/[\r\n]/g, ' ');
  const heure = new Date(timestamp).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  const telSenior = telephone_utilisateur ? ` (${telephone_utilisateur})` : '';
  const msg   = `URGENT : ${prenomSafe} ne se sent pas bien. Bouton urgence appuyé à ${heure}. Contactez-le rapidement.${telSenior}`;

  if (!smsConfigured()) {
    console.log(`[DEV] SMS urgence pour ${prenomSafe} → ${tel} : ${msg}`);
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
