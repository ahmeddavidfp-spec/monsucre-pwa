// Données de démonstration — à remplacer par Neon PostgreSQL
const MEDS_DEMO = [
  { id: 1, nom: 'Metformine', heure: 'Matin — 8h00', pris: false },
  { id: 2, nom: 'Insuline', heure: 'Midi — 12h30', pris: false }
];

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ medicaments: MEDS_DEMO });
  }
  res.status(405).end();
}
