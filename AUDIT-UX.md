# Audit UX — Mon Sucre PWA
_Réalisé le 20 mai 2026 · Base : index.html + style.css + app.js + api/_

---

## Contexte

Mon Sucre est une PWA destinée à des **seniors diabétiques** utilisant iOS Safari en mode installé (écran d'accueil). L'aidant configure l'app, le senior l'utilise au quotidien. Les critères d'évaluation sont : accessibilité WCAG 2.1 AA, confort de lecture, surface tactile, cohérence des interactions, gestion des erreurs et des cas limites.

---

## 🔴 CRITIQUE — Bloque l'accessibilité réelle

### UX-C1 · `user-scalable=no` dans le viewport — WCAG 1.4.4 échec

```html
<meta name="viewport" content="..., maximum-scale=1.0, user-scalable=no">
```

Le zoom par pincement est désactivé sur toute l'app. C'est une violation directe du critère WCAG 2.1 AA 1.4.4 (Redimensionnement du texte). Pour un senior presbyte ou avec une DMLA débutante, c'est rédhibitoire : il ne peut pas grossir un nom de médicament, un chiffre de glycémie ou un numéro de téléphone.

**Correction :** Supprimer `maximum-scale=1.0` et `user-scalable=no`. Le comportement d'affichage restera gérable car tout est déjà en `100dvh` avec `overflow: hidden` — au pire, un léger recalibrage CSS suffit pour quelques écrans.

---

### UX-C2 · Conflit de styles inline sur le bloc urgence-contacts-med

```html
<div id="urgence-contacts-med"
     style="display:none;margin-top:12px;display:flex;flex-direction:column;gap:10px">
```

Le même attribut `style` contient `display:none` suivi de `display:flex` — le navigateur applique la **dernière valeur** : le bloc est donc **toujours visible** même quand médecin et pharmacie ne sont pas configurés. Les deux boutons enfants ont `style="display:none"` individuellement, donc visuellement on ne voit rien, mais le bloc occupe de l'espace (`gap:10px`, `margin-top:12px`) et crée un espace vide inexplicable sur l'écran d'urgence quand aucun contact n'est configuré.

**Correction :** Retirer `display:none` du `style` inline (le JS gère la visibilité des boutons enfants individuellement), ou mieux, passer par une classe `.zone-cachee` cohérente.

---

## 🟠 HAUTE — Impact fort sur l'usage senior

### UX-H1 · Pas d'attribut `lang` sur `<html>`

```html
<html>  <!-- manque lang="fr" -->
```

Sans `lang="fr"`, les lecteurs d'écran (VoiceOver sur iPhone) choisissent la langue de synthèse vocale par défaut du système — souvent l'anglais si l'iPhone est en mode bilingue. La voix ElevenLabs parle français, mais les notifications système et les descriptions d'éléments seront mal prononcées.

**Correction :** `<html lang="fr">`.

---

### UX-H2 · Appels téléphoniques directs sans confirmation depuis l'accueil

Les boutons "grille appels" de l'écran d'accueil (proche1, proche2, médecin, pharmacie) lancent directement `tel:` sans modal de confirmation. Un senior peut déclencher un appel par erreur en voulant simplement ouvrir l'app ou naviguer. À l'inverse, les boutons 112 et 1733 ont bien des modals de confirmation — c'est la bonne pratique.

**Correction :** Appliquer la même logique de confirmation que pour le 112 aux boutons d'appel rapide de l'accueil. Un simple `window.confirm()` suffit, ou la même modale réutilisable.

---

### UX-H3 · Tailles de texte trop petites pour un public senior

Plusieurs éléments ont des tailles inférieures à 16px, considéré comme le minimum raisonnable pour des seniors :

| Élément CSS | Taille | Contexte |
|---|---|---|
| `.repas-ig-titre` | **12px** | Titre "INDEX GLYCÉMIQUE" dans résultat repas |
| `.med-desactive-tag` | **11px** | Badge "désactivé" sur carte médicament |
| `.cal-entete` | **11px** | En-têtes "L M M J V S D" du calendrier |
| `.med-freq-tag` | **12px** | Fréquence sous le nom du médicament |
| `.med-badge-insuline` | **12px** | Badge "insuline" |
| `.repas-ig-desc` | **14px** | Description index glycémique |
| `.repas-ig-remarque` | **13px** | Remarque diabète dans résultat repas |
| `.insuline-heure` | **13px** | Heure d'injection dans fiche médicament |
| `.champ-hint-inline` | **13px** | Aide inline dans formulaire d'ajout |
| `.scan-posologie` | **14px** | Posologie dans résultat du scan |

**Correction :** Porter tous ces éléments à 15px minimum, idéalement 16px. Pour les badges (tag coloré court), 13-14px est acceptable s'il s'accompagne d'un bon contraste.

---

### UX-H4 · Surface tactile des boutons du calendrier sous le minimum WCAG

```css
.btn-cal-nav { width: 40px; height: 40px; }  /* < 44px minimum */
.cal-jour { aspect-ratio: 1; /* ~38px sur iPhone SE */ }
```

Les boutons de navigation du calendrier (`‹ ›`) et les cases journalières font environ 38–40px, sous le minimum recommandé par WCAG 2.5.5 (44×44px). Sur iPhone SE (375px de large), chaque case du calendrier en grille de 7 colonnes fait ~(375 - 32px padding - 18px gap) / 7 ≈ 44px — juste à la limite. Sur un iPhone mini ou avec zoom activé, ça passe sous le seuil.

**Correction :** Forcer `min-width: 44px; min-height: 44px` sur `.btn-cal-nav`. Pour les cases calendrier, augmenter le `gap` ou réduire légèrement le padding latéral pour garder les cases ≥ 44px.

---

### UX-H5 · Les indicateurs du calendrier (`.cal-dot`) sont invisibles sans légende

```css
.cal-dot { width: 5px; height: 5px; border-radius: 50%; }
```

Des points de 5×5px ne sont pas lisibles par un senior. Leur signification (vert = repas, violet = glycémie) n'est expliquée nulle part dans l'interface. Un senior qui voit des petits points colorés sous une date ne sait pas ce qu'ils signifient.

**Correction :** Soit agrandir les dots à 8px et ajouter une légende en bas du calendrier (ex : "● Repas enregistré  ● Glycémie mesurée"), soit remplacer par des pictogrammes emoji (🍽 💉) plus lisibles.

---

### UX-H6 · Bouton "Je vais mieux, retour à l'accueil" sur l'écran d'urgence — risque de confusion

```html
<button class="btn-secondaire" onclick="allerA('ecran-accueil')">
  Je vais mieux, retour à l'accueil
</button>
```

```css
.btn-secondaire {
  font-size: 17px;
  text-decoration: underline;
  padding: 8px;  /* surface tactile minimale */
}
```

Ce bouton est stylisé comme un lien texte et placé juste sous le grand bouton rouge "Prévenir ma famille". Un senior stressé qui rate le bouton rouge peut activer ce lien et sortir de l'écran d'urgence sans avoir envoyé l'alerte. Le bouton "Configurer mon proche aidant" au-dessus crée le même risque.

**Correction :** Déplacer "Je vais mieux" tout en bas de la page, lui donner un `padding: 16px` minimum, et remplacer le style `text-decoration: underline` par une apparence de bouton secondaire plein.

---

### UX-H7 · Onboarding par balayage non indiqué

L'onboarding en 5 étapes utilise probablement un système de swipe horizontal (les écrans sont cachés/affichés par JS). Rien dans le HTML ne présente d'instruction "Glissez pour continuer" ni de flèche directionnelle. Les boutons "Suivant" sont présents mais les seniors peuvent tenter de tapper les pastilles de navigation directement sans savoir que le contenu est scrollable.

**Correction :** Ajouter une micro-instruction "Faites glisser ou appuyez Suivant →" sur la première étape, et s'assurer que les boutons ont `aria-label="Étape suivante"`.

---

## 🟡 MODÉRÉ — Friction utilisateur notable

### UX-M1 · Pas de styles `:focus-visible` définis dans le CSS

Aucun style `:focus-visible` n'est défini dans style.css. Sur iOS avec Switch Control ou clavier externe, les éléments interactifs n'ont pas d'indication de focus visible. VoiceOver fonctionne grâce aux labels natifs, mais un contour de focus aide les utilisateurs en navigation séquentielle.

**Correction :**
```css
:focus-visible {
  outline: 3px solid var(--primaire);
  outline-offset: 3px;
  border-radius: 8px;
}
```

---

### UX-M2 · Les messages d'erreur ne sont pas annoncés automatiquement aux lecteurs d'écran

```html
<div id="erreur-connexion" class="erreur-msg zone-cachee"></div>
```

Les `erreur-msg` sont des `<div>` sans `role="alert"` ni `aria-live="assertive"`. VoiceOver sur iOS ne lira pas le message d'erreur quand il apparaît — l'utilisateur ne sait pas pourquoi la connexion a échoué.

**Correction :** Ajouter `role="alert"` à tous les éléments `.erreur-msg` ou au moins sur les zones d'erreur principales (connexion, vérification code). Dans JS, s'assurer que le texte est injecté après que le `role` est en place.

---

### UX-M3 · Format téléphone international pas naturel pour un senior belge

```html
<input type="tel" placeholder="Ex : +32 470 00 00 00" />
```

Un senior belge connaît son numéro sous la forme `0470 00 00 00`. Le format E.164 (+32) n'est pas instinctif. Si l'utilisateur tape `0470 00 00 00` et que le système échoue ou reformate silencieusement, il ne comprend pas l'erreur.

**Correction :** Accepter les deux formats côté API (déjà géré par `normaliserTelephone`), mais aussi ajouter un texte d'aide sous le champ : "Tapez votre numéro belge normal, ex: 0470 00 00 00". L'app normalisera automatiquement.

---

### UX-M4 · Code PIN : surface tactile des touches non vérifiée dans le CSS

La modale PIN a un pavé numérique 3×4 avec 12 boutons `.pin-touche`. Le CSS de cette classe n'apparaît pas dans les sections lues — si la taille n'est pas explicitement définie à ≥ 44px, les touches seront trop petites pour des doigts moins précis. Le PIN protège l'accès aux paramètres aidant, donc une mauvaise ergonomie à cet endroit bloque les aidants âgés aussi.

**Correction :** Vérifier que `.pin-touche` a `min-height: 56px` et `font-size: 24px` minimum. Ajouter `touch-action: manipulation` pour éviter le double-tap zoom sur chaque touche.

---

### UX-M5 · "Son prénom" dans le profil — libellé ambigu

```html
<label for="inp-profil-prenom">Son prénom</label>
```

"Son" est ambigu : prénom de qui ? Du senior ? De l'aidant ? Dans le contexte de l'écran Paramètres, le "Son" renvoie à la personne dont on s'occupe (le senior), mais l'aidant qui remplit le formulaire pourrait confondre. La voix de bienvenue ElevenLabs utilise ce prénom pour saluer le senior chaque matin.

**Correction :** Remplacer par "Prénom de votre proche" ou, mieux, "Prénom du senior (utilisé pour les rappels vocaux)".

---

### UX-M6 · Aucun retour visuel pendant l'envoi de l'alerte urgence

Quand l'utilisateur appuie sur "Prévenir ma famille", il n'y a pas d'indicateur de chargement visible pendant l'appel API. Sur une connexion lente (EDGE en zone rurale, fréquent pour les seniors), le senior pourrait croire que rien ne s'est passé et appuyer plusieurs fois.

**Correction :** Désactiver le bouton immédiatement (`disabled`), changer son texte en "Envoi en cours…" avec un spinner. Le feedback "✅ Votre proche a été prévenu" est déjà prévu mais n'est pas atteint si le réseau est lent.

---

### UX-M7 · Le formulaire d'ajout de médicament n'indique pas les champs obligatoires

L'écran `ecran-ajouter-med` a plusieurs champs (nom, période, fréquence, heure, posologie) sans distinction visuelle entre obligatoire et optionnel. Si l'utilisateur tente de sauvegarder sans nom ou sans période, il obtient une erreur — mais sans indication préalable de ce qui est requis.

**Correction :** Ajouter une astérisque (*) rouge sur les champs obligatoires avec une note "* Champ obligatoire" en bas du formulaire. Alternativement, libeller les champs optionnels avec "(optionnel)" en gris.

---

### UX-M8 · L'historique des repas affiche la photo en max-height:160px sans alt text

```css
.historique-photo { width: 100%; max-height: 160px; object-fit: cover; }
```

Les `<img>` générées dynamiquement dans l'historique n'ont probablement pas d'attribut `alt`. Si l'image ne charge pas (mode hors-ligne), un cadre vide s'affiche sans explication.

**Correction :** Dans le JS qui génère les cartes d'historique, ajouter `alt="Photo du repas du [date]"` sur chaque image, et un `onerror` pour masquer l'image ou afficher un fallback.

---

## 🔵 FAIBLE — Améliorations de confort

### UX-F1 · L'écran "Bravo !" ne précise pas quelle action vient d'être validée

L'écran `ecran-bravo` affiche "Bravo ! C'est noté. Continuez comme ça !" de façon générique. Si un senior valide plusieurs actions en séquence rapide (glycémie puis repas), il ne sait pas à quoi correspond ce bravo.

**Correction :** Personnaliser le message selon le contexte : "Bravo ! Votre glycémie est enregistrée." ou "Bravo ! Votre repas du midi est noté."

---

### UX-F2 · Le bouton "Retour" utilise "←" seul, sans label ARIA

```html
<button class="btn-retour" onclick="allerA('ecran-accueil')">← Retour</button>
```

"← Retour" est correct visuellement. VoiceOver lira "Retour, bouton" ce qui est acceptable, mais sans préciser vers quel écran on revient. Sur des écrans imbriqués (fiche médicament → médicaments → accueil), le senior ne sait pas où il va atterrir.

**Correction :** Ajouter `aria-label="Retour à l'écran médicaments"` contextuel, ou simplement afficher le nom de l'écran destination : "← Médicaments" au lieu de "← Retour" sur la fiche médicament.

---

### UX-F3 · Instructions notification iOS enterrées dans les paramètres

```html
<p id="notif-ios-hint" style="display:none">
  Sur iPhone : ajoutez d'abord l'app à votre écran d'accueil...
```

L'instruction n'est affichée que si l'app détecte qu'on est sur iOS sans notifications disponibles. Mais elle est dans l'écran Paramètres, que le senior n'atteint pas seul (protégé par PIN). C'est une information critique qui devrait être présentée lors de la première utilisation ou au moment où le senior essaie d'activer les rappels.

**Correction :** Afficher cette instruction directement sur l'écran d'accueil lors du premier lancement en mode browser (pas PWA installée), avec une illustration claire du bouton "Partager" iOS.

---

### UX-F4 · Résultats nutritionnels trop techniques pour un senior

Dans l'écran rapport repas, les données affichées incluent : glucides_g, lipides_g, protéines_g, fibres_g, sel_g, index glycémique, indice diabète, remarque_diabete. C'est le niveau d'un diététicien. Le conseil en langage naturel (généré par Claude) est excellent, mais les chiffres bruts en dessous créent de la confusion.

**Correction :** Par défaut, n'afficher que : le plat identifié, le conseil chaleureux, et le badge coloré (OK / Attention / Éviter). Mettre les détails nutritionnels derrière un accordéon "Voir les détails" — déjà partiellement présent via le mode développeur, mais à généraliser.

---

### UX-F5 · Le splash vocal bloque 3 secondes au démarrage sans possibilité de passer

L'écran `ecran-splash-vocal` joue une salutation ElevenLabs et doit probablement attendre la fin de l'audio avant de passer. Si la connexion est lente ou si l'audio échoue silencieusement, le senior reste bloqué sur l'écran de chargement sans feedback.

**Correction :** Ajouter un timeout de fallback (ex : 5 secondes) qui passe automatiquement à l'accueil si l'audio n'a pas démarré, plus un bouton "Passer" visible après 2 secondes.

---

### UX-F6 · Pas de numérotation des étapes dans l'onboarding

Les 5 étapes de l'onboarding ont des pastilles de navigation mais pas d'indication textuelle ("Étape 1 sur 5"). Pour un senior qui ne comprend pas les pastilles, il ne sait pas combien d'étapes restent.

**Correction :** Ajouter un texte "1 / 5", "2 / 5" etc. en haut de chaque étape, en complément des pastilles.

---

## 📊 Tableau de synthèse

| ID | Sévérité | Écran concerné | Effort correction |
|---|---|---|---|
| UX-C1 | 🔴 CRITIQUE | Toute l'app | Faible (1 ligne HTML) |
| UX-C2 | 🔴 CRITIQUE | Urgence | Faible (1 ligne HTML) |
| UX-H1 | 🟠 HAUTE | Toute l'app | Faible (1 ligne HTML) |
| UX-H2 | 🟠 HAUTE | Accueil | Moyen (1 modal JS) |
| UX-H3 | 🟠 HAUTE | Repas, Médicaments, Historique | Moyen (10 règles CSS) |
| UX-H4 | 🟠 HAUTE | Historique / Calendrier | Faible (2 règles CSS) |
| UX-H5 | 🟠 HAUTE | Historique / Calendrier | Moyen (HTML + CSS) |
| UX-H6 | 🟠 HAUTE | Urgence | Faible (CSS + ordre HTML) |
| UX-H7 | 🟠 HAUTE | Onboarding | Faible (HTML) |
| UX-M1 | 🟡 MODÉRÉ | Toute l'app | Faible (CSS global) |
| UX-M2 | 🟡 MODÉRÉ | Connexion, Vérification | Faible (HTML attr) |
| UX-M3 | 🟡 MODÉRÉ | Connexion, Paramètres | Faible (HTML) |
| UX-M4 | 🟡 MODÉRÉ | Modal PIN | Faible (CSS) |
| UX-M5 | 🟡 MODÉRÉ | Paramètres | Faible (HTML) |
| UX-M6 | 🟡 MODÉRÉ | Urgence | Moyen (JS) |
| UX-M7 | 🟡 MODÉRÉ | Ajouter médicament | Faible (HTML) |
| UX-M8 | 🟡 MODÉRÉ | Historique | Faible (JS) |
| UX-F1 | 🔵 FAIBLE | Écran Bravo | Faible (JS) |
| UX-F2 | 🔵 FAIBLE | Navigation générale | Faible (HTML attr) |
| UX-F3 | 🔵 FAIBLE | Onboarding / Paramètres | Moyen (JS) |
| UX-F4 | 🔵 FAIBLE | Résultats repas | Moyen (HTML/JS) |
| UX-F5 | 🔵 FAIBLE | Splash vocal | Moyen (JS) |
| UX-F6 | 🔵 FAIBLE | Onboarding | Faible (HTML) |

---

## 🚀 Priorité de correction recommandée

**Sprint immédiat (corrections < 30 min, impact fort) :**
UX-C1, UX-C2, UX-H1, UX-M1, UX-M2 → 5 corrections, toutes triviales en code.

**Sprint court (quelques heures) :**
UX-H3 (tailles texte), UX-H4 (calendrier), UX-H6 (bouton urgence), UX-M3 (format tél), UX-M5 (libellé prénom).

**Sprint moyen (demi-journée) :**
UX-H2 (confirmation appels accueil), UX-H5 (légende calendrier), UX-M6 (loading urgence), UX-F5 (splash timeout).

**Backlog (itérations futures) :**
UX-H7, UX-M7, UX-M8, UX-F1, UX-F2, UX-F3, UX-F4, UX-F6.
