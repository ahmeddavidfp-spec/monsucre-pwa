// Normalisation d'un numéro de téléphone vers le format E.164 (+CCxxxxxxxxx).
//
// Règles :
//   "+32 470 00 00 00"  → "+32470000000"
//   "0470 00 00 00"     → "+32470000000"   (préfixe 0 belge sans indicatif → +32)
//   "32 470 00 00 00"   → "+3247000000"    (sans + au début → on l'ajoute)
//   "0033 6 12 34..."   → "+33612345678"   (préfixe international 00xx → +xx)
//
// Renvoie null si le format est invalide.

export function normaliserTelephone(input) {
  if (!input || typeof input !== 'string') return null;

  let tel = input.replace(/[\s.\-()]/g, '');

  if (!tel) return null;

  if (tel.startsWith('00')) {
    tel = '+' + tel.slice(2);
  } else if (tel.startsWith('0')) {
    // Présomption belge : 04xx → +324xx, 02xx → +322xx, etc.
    tel = '+32' + tel.slice(1);
  } else if (!tel.startsWith('+')) {
    tel = '+' + tel;
  }

  // Validation E.164 : + suivi de 8 à 15 chiffres
  if (!/^\+[1-9][0-9]{7,14}$/.test(tel)) return null;

  return tel;
}
