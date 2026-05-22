'use strict';

// ════════════════════════════════════════════════════════
// ── Internationalisation (FR / EN / IT) ─────────────────
// ════════════════════════════════════════════════════════
const _TRANSLATIONS = {
  fr: {
    retour: '← Retour',
    splash_tap: 'Appuyez pour commencer',
    zone_quotidien: 'Mon quotidien',
    ma_glycemie: 'Ma glycémie',
    glycemie_sous_defaut: 'Enregistrer ma valeur du jour',
    glycemie_derniere: (v, q) => `Dernière : ${v} mg/dL — ${q}`,
    mes_medicaments: 'Mes médicaments',
    meds_tous_pris: 'Tous les médicaments pris aujourd\'hui',
    meds_restants: (n) => `${n} médicament${n > 1 ? 's' : ''} restant${n > 1 ? 's' : ''} aujourd\'hui`,
    meds_sous_defaut: 'Voir mes prises du jour',
    mon_repas: 'Mon repas',
    repas_sous: 'Ajouter ce que j\'ai mangé',
    zone_urgence: 'En cas de problème',
    je_sens_pas_bien: 'Je ne me sens pas bien',
    appeler_proche: 'Appeler un proche',
    urgences: 'Urgences',
    medecin_garde: 'Médecin de garde',
    glycemie_titre: 'Ma glycémie',
    glycemie_du_jour: 'Votre glycémie du jour',
    glyc_hint: 'Appuyez sur le champ pour saisir votre valeur',
    hypoglycemie: 'Hypoglycémie',
    normal: 'Normal',
    eleve: 'Élevé',
    tres_eleve: 'Très élevé',
    glycemie_enregistree: 'Glycémie enregistrée !',
    enregistrer: 'Enregistrer',
    voir_historique: 'Voir mon historique',
    ind_hypo: '🔴 Hypoglycémie — Mangez quelque chose de sucré !',
    ind_normal: '🟢 Normal — Bonne glycémie !',
    ind_eleve: '🟡 Élevé — Attention à ce que vous mangez.',
    ind_tres_eleve: '🔴 Très élevé — Consultez votre médecin.',
    ind_hypo_c: 'Hypoglycémie — Consultez rapidement !',
    ind_normal_c: 'Normal — Très bien !',
    ind_eleve_c: 'Élevé — Soyez attentif.',
    ind_tres_eleve_c: 'Très élevé — Consultez votre médecin.',
    meds_titre: 'Mes médicaments',
    ajouter_med: 'Ajouter un médicament',
    matin: 'Matin',
    midi: 'Midi',
    soir: 'Soir',
    nuit: 'Nuit',
    aucun_med: 'Aucun médicament actif. Utilisez le bouton + pour en ajouter.',
    med_aujourd_hui: 'Aujourd\'hui',
    med_autres_jours: 'Autres jours',
    med_tout_pris: 'Tout pris',
    med_oublie: 'Oublié',
    med_oublies: (n) => `${n} oubliés`,
    med_pris: '✓ Pris',
    marquer_pris: 'Marquer comme pris',
    med_freq_hebdo: (jour) => `chaque ${jour}`,
    med_freq_mensuel: (j) => `le ${j} du mois`,
    urgence_titre: 'Besoin d\'aide',
    pas_seul: 'Vous n\'êtes pas seul.\nJe suis là avec vous.',
    aucun_proche_configure: 'Aucun proche configuré.\nAjoutez un proche d\'abord.',
    configurer_proche_btn: '⚙️ Configurer mon proche aidant',
    prevenir_famille: 'Prévenir ma famille',
    proche_prevenu: '✅ Votre proche a été prévenu.',
    restez_calme: 'Restez calme, ils arrivent.',
    retour_accueil: 'Retour à l\'accueil',
    je_vais_mieux: '✅ Je vais mieux — retour à l\'accueil',
    modal_112_titre: 'Appeler le 112 ?',
    modal_112_texte: 'Le 112 est le numéro des secours d\'urgence.\nNe l\'appelez qu\'en cas de danger réel.',
    modal_112_oui: 'Oui, appeler le 112',
    modal_1733_titre: 'Appeler le 1733 ?',
    modal_1733_texte: 'Le 1733 vous met en contact avec le médecin ou la pharmacie de garde.\nPour toute question médicale non urgente.',
    modal_1733_oui: 'Oui, appeler le 1733',
    modal_annuler: 'Non, annuler',
    proche_aidant_label: 'Votre proche aidant :',
    appeler_prenom: (p) => `Appeler ${p}`,
    appeler_confirm: (nom) => `Appeler ${nom} ?`,
    envoi_en_cours: 'Envoi en cours…',
    envoi_echec: '⚠️ Échec — vérifier la configuration',
    votre_proche_defaut: 'votre proche',
    repas_titre: 'Mon repas',
    quavez_mange: 'Qu\'avez-vous mangé ?',
    prendre_photo: 'Prendre une photo',
    photo_sous: 'Photographiez votre assiette',
    decrire_voix: 'Décrire à voix haute',
    voix_sous: 'Dites ce que vous avez mangé',
    voir_repas: 'Voir mes repas précédents',
    bravo_titre: 'Bravo !',
    bravo_texte: 'C\'est noté. Continuez comme ça !',
    bienetre_q_defaut: 'Comment vous sentez-vous aujourd\'hui ?',
    g_matin:   (n) => `Bonjour${n}`,
    g_appetit: (n) => `Bon appétit${n}`,
    g_aprem:   (n) => `Bonne après-midi${n}`,
    g_soir:    (n) => `Bonsoir${n}`,
    g_nuit:    (n) => `Bonne nuit${n}`,
    a_instant:  'à l\'instant',
    il_y_a_min: (n) => `il y a ${n} min`,
    il_y_a_h:   (n) => `il y a ${n}h`,
    locale_date: 'fr-BE',
    parametres: '⚙️ Paramètres',
    langue_titre: '🌐 Langue',
    langue_sous: 'Choisissez la langue de l\'application.',
    mode_nuit_titre: '🌙 Mode nuit',
    mode_nuit_sous: 'Activez le mode nuit automatique (21h–6h) ou désactivez-le pour garder l\'affichage normal.',
    mode_nuit_label_auto: 'Automatique (21h–6h)',
    mode_nuit_label_off: 'Désactivé',
    partager: 'Partager',
    mes_glycemies_titre: 'Mes glycémies',
    cal_legende_hypo: 'Hypo',
    nouveau_med: 'Nouveau médicament',
    scanner_boite: '📷 Scanner la boîte',
    champs_obligatoires: 'Les champs * sont obligatoires.',
    nom_medicament_label: 'Nom du médicament',
    placeholder_med: 'Ex : Metformine',
    quand_prendre: 'Quand le prendre ?',
    quand_prendre_hint: '(plusieurs choix possibles)',
    insuline_titre: 'Piqûre d\'insuline',
    insuline_sous: 'Cochez si c\'est une injection',
    options_avancees_btn: '⚙️ Options avancées',
    frequence_label: 'Fréquence',
    freq_quotidien: '📅 Chaque jour',
    freq_hebdo: '📆 Semaine',
    freq_mensuel_btn: '🗓️ Mois',
    quel_jour: 'Quel jour ?',
    quel_jour_mois: 'Quel jour du mois ?',
    heure_exacte: 'Heure exacte',
    posologie_label: 'Posologie',
    placeholder_posologie: 'Ex : 1 comprimé · 500 mg',
    enregistrer_med: '✅ Enregistrer le médicament',
    mes_meds_enregistres: '📋 Mes médicaments enregistrés',
    aucun_med_enregistre: 'Aucun médicament enregistré',
    jour_lun: 'Lun', jour_mar: 'Mar', jour_mer: 'Mer', jour_jeu: 'Jeu',
    jour_ven: 'Ven', jour_sam: 'Sam', jour_dim: 'Dim',
    // ── Repas / nutrition ─────────────────────────────
    ig_bas: 'IG Bas', ig_modere: 'IG Modéré', ig_eleve: 'IG Élevé',
    ok_diabete: '✅ OK diabète', attention_diabete: '⚠️ Attention', eviter_diabete: '🚫 À éviter',
    glucides: 'Glucides', dont_sucres: 'dont sucres', proteines: 'Protéines', lipides: 'Lipides',
    fibres: 'Fibres', sel: 'Sel', index_glycemique: 'Index glycémique',
    aucune_glycemie_jour: 'Aucune glycémie ce jour-là.',
    // ── Fiche médicament ──────────────────────────────
    fiche_med_titre: 'Fiche médicament',
    statut_desactive: '⏸ Désactivé',
    statut_actif: '✅ Actif',
    reactiver_med: '▶ Réactiver ce médicament',
    desactiver_med: '⏸ Désactiver ce médicament',
    hint_med_desactive: 'Ce médicament est actuellement désactivé. Réactivez-le pour recevoir des rappels.',
    hint_med_actif: 'Le médicament sera conservé mais n\'apparaîtra plus dans vos rappels du jour.',
    desactive_badge: '⏸ désactivé',
    pris_bravo: '✅ Pris — bien joué !',
    // ── Notifications ─────────────────────────────────
    notif_installer_ios: '⚠️ Installez l\'app sur l\'écran d\'accueil pour activer les notifications.',
    notif_non_supporte: '❌ Votre navigateur ne supporte pas les notifications.',
    notif_active: '✅ Notifications activées — vous recevrez les rappels.',
    notif_bloquee: '🚫 Notifications bloquées. Allez dans les réglages pour les autoriser.',
    notif_inactive: '💤 Notifications non activées.',
    // ── Session ───────────────────────────────────────
    vider_cache_en_cours: '⏳ En cours…',
    session_renouvelee: '✅ Session renouvelée !',
    erreur_simple: '❌ Erreur',
    renouveler_session: '🔄 Renouveler la session',
    // ── Scanner médicament ────────────────────────────
    scan_analyse: '⏳ Analyse du médicament en cours…',
    scan_non_reconnu: '❌ Médicament non reconnu. Entrez le nom manuellement.',
    scan_erreur: '❌ Erreur lors de l\'analyse. Entrez le nom manuellement.',
    // ── Historique ────────────────────────────────────
    aucune_glycemie: 'Aucune glycémie enregistrée pour le moment.',
    aucun_repas_hist: 'Aucun repas enregistré pour le moment.',
    aucune_injection: 'Aucune injection enregistrée.',
    // ── Connexion ─────────────────────────────────────
    connexion_en_cours: '⏳ Connexion…',
    instruction_sms: 'Entrez le code à 4 chiffres\nreçu par SMS',
    instruction_dev: 'Entrez le code à 4 chiffres\naffiché ci-dessous',
    code_sms_titre: 'Code reçu par SMS',
    // ── Écrans ────────────────────────────────────────
    mes_repas_titre: 'Mes repas',
    // ── Vocal ──────────────────────────────────────────
    salut_matin: (nom, voix) => `Bonjour, je suis ${voix}. ${nom ? 'Bonjour ' + nom + ' ! ' : ''}Nous sommes heureux de vous retrouver ce matin. Passez une excellente journée.`,
    salut_midi:  (nom, voix) => `Bonjour, je suis ${voix}. ${nom ? 'Bonjour ' + nom + ' ! ' : ''}Nous espérons que votre journée se passe bien.`,
    salut_soir:  (nom, voix) => `Bonsoir, je suis ${voix}. ${nom ? 'Bonsoir ' + nom + ' ! ' : ''}Nous espérons que vous avez passé une belle journée.`,
    urgence_vocal_112:    (p) => `${p ? 'Ne vous inquiétez pas, ' + p + '.' : 'Ne vous inquiétez pas.'} Vous êtes sur le point d'appeler le 1-1-2, le numéro des secours d'urgence. Si vous avez vraiment besoin d'aide immédiate, appuyez sur le bouton rouge pour confirmer. Sinon, appuyez sur Annuler. Je suis là avec vous.`,
    urgence_vocal_1733:   (p) => `${p ? 'Ne vous inquiétez pas, ' + p + '.' : 'Ne vous inquiétez pas.'} Le 1733 est le numéro du médecin et de la pharmacie de garde. C'est le bon numéro quand vous avez besoin d'un avis médical, mais que ce n'est pas une urgence vitale. Souhaitez-vous appeler maintenant ? Appuyez sur le bouton vert pour confirmer, ou sur Annuler.`,
    urgence_vocal_proche: (p, proche) => `${p ? 'Ne vous inquiétez pas, ' + p + '. Vous n\'êtes pas seul.' : 'Ne vous inquiétez pas. Vous n\'êtes pas seul.'} Je suis là avec vous. ${proche} peut venir vous aider. Appuyez sur le bouton pour que j'appelle ${proche} maintenant.`,
    urgence_vocal_seul:   (p) => `${p ? 'Ne vous inquiétez pas, ' + p + '. Vous n\'êtes pas seul.' : 'Ne vous inquiétez pas. Vous n\'êtes pas seul.'} Je suis là avec vous. Restez calme. Vous pouvez configurer un proche aidant pour qu'il soit prévenu rapidement.`,
    glyc_vocal_hypo:       (p, v) => `${p}votre glycémie est de ${v} milligrammes par décilitre. C'est en dessous de la normale — on appelle ça une hypoglycémie. Prenez un peu de sucre maintenant, un verre de jus de fruit ou quelques bonbons, et reposez-vous. Si vous ne vous sentez pas mieux dans quelques minutes, appelez votre médecin.`,
    glyc_vocal_ok:         (p, v) => `${p}votre glycémie est de ${v} milligrammes par décilitre. C'est une très bonne valeur, dans la zone normale. Bravo, continuez comme ça !`,
    glyc_vocal_eleve:      (p, v) => `${p}votre glycémie est de ${v} milligrammes par décilitre. C'est un peu élevé. Essayez d'éviter les sucreries lors de votre prochain repas et pensez à boire de l'eau. Votre médecin suit cela avec vous.`,
    glyc_vocal_tres_eleve: (p, v) => `${p}votre glycémie est de ${v} milligrammes par décilitre. C'est assez élevé. Essayez de vous reposer, buvez de l'eau, et signalez cette valeur à votre médecin lors de votre prochaine consultation. N'hésitez pas à utiliser le bouton Besoin d'aide si vous ne vous sentez pas bien.`,
    notif_med_titre:    'Mon Sucre — Médicament',
    notif_med_corps:    (nom) => `N'oubliez pas de prendre : ${nom}`,
    notif_rappel_titre: 'Mon Sucre — Rappel urgent',
    notif_rappel_corps: (nom) => `Vous n'avez toujours pas pris : ${nom}`,
    questions_bienetre: [
      { q: 'Comment vous sentez-vous en ce moment ?', e: '💛' },
      { q: 'Avez-vous bien dormi cette nuit ?',        e: '🌙' },
      { q: 'Êtes-vous de bonne humeur aujourd\'hui ?', e: '😊' },
      { q: 'Vous sentez-vous en forme ce matin ?',     e: '🌅' },
      { q: 'Avez-vous mangé quelque chose de bon ?',   e: '🍳' },
      { q: 'Êtes-vous au chaud et confortable ?',      e: '🏠' },
      { q: 'Avez-vous bu assez d\'eau aujourd\'hui ?', e: '💧' },
      { q: 'Avez-vous eu de bonnes nouvelles aujourd\'hui ?', e: '📬' },
      { q: 'Faites-vous quelque chose d\'agréable ?',  e: '🌸' },
      { q: 'Avez-vous parlé à quelqu\'un de cher ?',   e: '💬' },
      { q: 'Vous sentez-vous calme et serein(e) ?',    e: '🍃' },
      { q: 'Avez-vous pris le temps de vous reposer ?',e: '☕' },
      { q: 'La journée se passe bien pour vous ?',     e: '🌈' },
      { q: 'Avez-vous souri aujourd\'hui ?',           e: '😄' },
      { q: 'Êtes-vous bien entouré(e) ?',              e: '🤗' },
      { q: 'Vous sentez-vous d\'attaque pour la journée ?', e: '⚡' },
      { q: 'Avez-vous fait une petite promenade ?',    e: '🌿' },
      { q: 'La météo est agréable pour vous aujourd\'hui ?', e: '☀️' },
      { q: 'Avez-vous quelque chose de sympa prévu ?', e: '🎉' },
      { q: 'Prenez-vous bien soin de vous ?',          e: '💖' },
    ],
    reponses_oui: [
      'Quelle belle nouvelle, ça me réjouit ! 🌟',
      'Super ! Profitez bien de cette belle journée 🌈',
      'Fantastique ! Continuez comme ça 💪',
      'Voilà qui fait chaud au cœur ! ☀️',
      'Merveilleux ! Vous méritez ça 🌸',
    ],
    reponses_non: [
      'Merci de me le dire… Prenez bien soin de vous 💙',
      'Je suis là avec vous. N\'hésitez pas à appeler un proche 🤗',
      'Ça ira mieux bientôt. Courage ! 💛',
      'Soyez doux(ce) avec vous-même aujourd\'hui 🍃',
      'Pensez à vous reposer. Je veille sur vous 💜',
    ],
  },
  en: {
    retour: '← Back',
    splash_tap: 'Tap to start',
    zone_quotidien: 'My daily care',
    ma_glycemie: 'My blood sugar',
    glycemie_sous_defaut: 'Record today\'s value',
    glycemie_derniere: (v, q) => `Last: ${v} mg/dL — ${q}`,
    mes_medicaments: 'My medications',
    meds_tous_pris: 'All medications taken today',
    meds_restants: (n) => `${n} medication${n > 1 ? 's' : ''} remaining today`,
    meds_sous_defaut: 'View today\'s doses',
    mon_repas: 'My meal',
    repas_sous: 'Add what I ate',
    zone_urgence: 'If there\'s a problem',
    je_sens_pas_bien: 'I don\'t feel well',
    appeler_proche: 'Call a relative',
    urgences: 'Emergency',
    medecin_garde: 'On-call doctor',
    glycemie_titre: 'My blood sugar',
    glycemie_du_jour: 'Your blood sugar today',
    glyc_hint: 'Tap the field to enter your value',
    hypoglycemie: 'Low blood sugar',
    normal: 'Normal',
    eleve: 'High',
    tres_eleve: 'Very high',
    glycemie_enregistree: 'Blood sugar recorded!',
    enregistrer: 'Save',
    voir_historique: 'View my history',
    ind_hypo: '🔴 Low blood sugar — Eat something sweet!',
    ind_normal: '🟢 Normal — Good blood sugar!',
    ind_eleve: '🟡 High — Watch what you eat.',
    ind_tres_eleve: '🔴 Very high — Consult your doctor.',
    ind_hypo_c: 'Low blood sugar — Consult quickly!',
    ind_normal_c: 'Normal — Very good!',
    ind_eleve_c: 'High — Be careful.',
    ind_tres_eleve_c: 'Very high — Consult your doctor.',
    meds_titre: 'My medications',
    ajouter_med: 'Add a medication',
    matin: 'Morning',
    midi: 'Noon',
    soir: 'Evening',
    nuit: 'Night',
    aucun_med: 'No active medication. Use the + button to add one.',
    med_aujourd_hui: 'Today',
    med_autres_jours: 'Other days',
    med_tout_pris: 'All taken',
    med_oublie: 'Missed',
    med_oublies: (n) => `${n} missed`,
    med_pris: '✓ Taken',
    marquer_pris: 'Mark as taken',
    med_freq_hebdo: (jour) => `every ${jour}`,
    med_freq_mensuel: (j) => `on the ${j}th`,
    urgence_titre: 'I need help',
    pas_seul: 'You are not alone.\nI am here with you.',
    aucun_proche_configure: 'No contact configured.\nPlease add a contact first.',
    configurer_proche_btn: '⚙️ Configure my contact',
    prevenir_famille: 'Alert my family',
    proche_prevenu: '✅ Your relative has been notified.',
    restez_calme: 'Stay calm, they\'re on their way.',
    retour_accueil: 'Back to home',
    je_vais_mieux: '✅ I feel better — back to home',
    modal_112_titre: 'Call 112?',
    modal_112_texte: '112 is the emergency services number.\nOnly call in case of real danger.',
    modal_112_oui: 'Yes, call 112',
    modal_1733_titre: 'Call 1733?',
    modal_1733_texte: '1733 connects you to the on-call doctor or pharmacy.\nFor any non-urgent medical question.',
    modal_1733_oui: 'Yes, call 1733',
    modal_annuler: 'No, cancel',
    proche_aidant_label: 'Your contact:',
    appeler_prenom: (p) => `Call ${p}`,
    appeler_confirm: (nom) => `Call ${nom}?`,
    envoi_en_cours: 'Sending…',
    envoi_echec: '⚠️ Failed — check configuration',
    votre_proche_defaut: 'your contact',
    repas_titre: 'My meal',
    quavez_mange: 'What did you eat?',
    prendre_photo: 'Take a photo',
    photo_sous: 'Photograph your plate',
    decrire_voix: 'Describe out loud',
    voix_sous: 'Say what you ate',
    voir_repas: 'View previous meals',
    bravo_titre: 'Well done!',
    bravo_texte: 'Noted. Keep it up!',
    bienetre_q_defaut: 'How are you feeling today?',
    g_matin:   (n) => `Good morning${n}`,
    g_appetit: (n) => `Bon appétit${n}`,
    g_aprem:   (n) => `Good afternoon${n}`,
    g_soir:    (n) => `Good evening${n}`,
    g_nuit:    (n) => `Good night${n}`,
    a_instant:  'just now',
    il_y_a_min: (n) => `${n} min ago`,
    il_y_a_h:   (n) => `${n}h ago`,
    locale_date: 'en-GB',
    parametres: '⚙️ Settings',
    langue_titre: '🌐 Language',
    langue_sous: 'Choose the application language.',
    mode_nuit_titre: '🌙 Night mode',
    mode_nuit_sous: 'Enable automatic night mode (9pm–6am) or disable it to keep the normal display.',
    mode_nuit_label_auto: 'Automatic (9pm–6am)',
    mode_nuit_label_off: 'Disabled',
    partager: 'Share',
    mes_glycemies_titre: 'My blood sugars',
    cal_legende_hypo: 'Hypo',
    nouveau_med: 'New medication',
    scanner_boite: '📷 Scan the box',
    champs_obligatoires: 'Fields marked * are required.',
    nom_medicament_label: 'Medication name',
    placeholder_med: 'E.g.: Metformin',
    quand_prendre: 'When to take it?',
    quand_prendre_hint: '(multiple choices)',
    insuline_titre: 'Insulin injection',
    insuline_sous: 'Check if it is an injection',
    options_avancees_btn: '⚙️ Advanced options',
    frequence_label: 'Frequency',
    freq_quotidien: '📅 Every day',
    freq_hebdo: '📆 Weekly',
    freq_mensuel_btn: '🗓️ Monthly',
    quel_jour: 'Which day?',
    quel_jour_mois: 'Which day of the month?',
    heure_exacte: 'Exact time',
    posologie_label: 'Dosage',
    placeholder_posologie: 'E.g.: 1 tablet · 500 mg',
    enregistrer_med: '✅ Save medication',
    mes_meds_enregistres: '📋 My saved medications',
    aucun_med_enregistre: 'No medications saved',
    jour_lun: 'Mon', jour_mar: 'Tue', jour_mer: 'Wed', jour_jeu: 'Thu',
    jour_ven: 'Fri', jour_sam: 'Sat', jour_dim: 'Sun',
    // ── Meals / nutrition ─────────────────────────────
    ig_bas: 'Low GI', ig_modere: 'Moderate GI', ig_eleve: 'High GI',
    ok_diabete: '✅ OK diabetes', attention_diabete: '⚠️ Attention', eviter_diabete: '🚫 Avoid',
    glucides: 'Carbs', dont_sucres: 'of which sugars', proteines: 'Protein', lipides: 'Fat',
    fibres: 'Fibre', sel: 'Salt', index_glycemique: 'Glycaemic index',
    aucune_glycemie_jour: 'No blood sugar for this day.',
    // ── Medication card ───────────────────────────────
    fiche_med_titre: 'Medication card',
    statut_desactive: '⏸ Deactivated',
    statut_actif: '✅ Active',
    reactiver_med: '▶ Reactivate this medication',
    desactiver_med: '⏸ Deactivate this medication',
    hint_med_desactive: 'This medication is currently deactivated. Reactivate it to receive reminders.',
    hint_med_actif: 'The medication will be kept but will no longer appear in your daily reminders.',
    desactive_badge: '⏸ deactivated',
    pris_bravo: '✅ Taken — well done!',
    // ── Notifications ─────────────────────────────────
    notif_installer_ios: '⚠️ Install the app on your home screen to enable notifications.',
    notif_non_supporte: '❌ Your browser does not support notifications.',
    notif_active: '✅ Notifications enabled — you will receive reminders.',
    notif_bloquee: '🚫 Notifications blocked. Go to settings to enable them.',
    notif_inactive: '💤 Notifications not enabled.',
    // ── Session ───────────────────────────────────────
    vider_cache_en_cours: '⏳ In progress…',
    session_renouvelee: '✅ Session renewed!',
    erreur_simple: '❌ Error',
    renouveler_session: '🔄 Renew session',
    // ── Scanner ───────────────────────────────────────
    scan_analyse: '⏳ Analysing medication…',
    scan_non_reconnu: '❌ Medication not recognised. Enter the name manually.',
    scan_erreur: '❌ Error during analysis. Enter the name manually.',
    // ── History ───────────────────────────────────────
    aucune_glycemie: 'No blood sugar recorded yet.',
    aucun_repas_hist: 'No meals recorded yet.',
    aucune_injection: 'No injection recorded.',
    // ── Login ─────────────────────────────────────────
    connexion_en_cours: '⏳ Connecting…',
    instruction_sms: 'Enter the 4-digit code\nreceived by SMS',
    instruction_dev: 'Enter the 4-digit code\nshown below',
    code_sms_titre: 'SMS Code',
    // ── Screens ───────────────────────────────────────
    mes_repas_titre: 'My meals',
    // ── Vocal ──────────────────────────────────────────
    salut_matin: (nom, voix) => `Hello, I'm ${voix}. ${nom ? 'Good morning ' + nom + '! ' : ''}We're happy to see you this morning. Have a wonderful day.`,
    salut_midi:  (nom, voix) => `Hello, I'm ${voix}. ${nom ? 'Good afternoon ' + nom + '! ' : ''}We hope your day is going well.`,
    salut_soir:  (nom, voix) => `Good evening, I'm ${voix}. ${nom ? 'Good evening ' + nom + '! ' : ''}We hope you've had a lovely day.`,
    urgence_vocal_112:    (p) => `${p ? 'Don\'t worry, ' + p + '.' : 'Don\'t worry.'} You are about to call 1-1-2, the emergency services number. If you really need immediate help, press the red button to confirm. Otherwise, press Cancel. I am here with you.`,
    urgence_vocal_1733:   (p) => `${p ? 'Don\'t worry, ' + p + '.' : 'Don\'t worry.'} 1733 is the number for on-call doctors and pharmacies. It is the right number when you need medical advice, but it is not a life-threatening emergency. Would you like to call now? Press the green button to confirm, or press Cancel.`,
    urgence_vocal_proche: (p, proche) => `${p ? 'Don\'t worry, ' + p + '. You are not alone.' : 'Don\'t worry. You are not alone.'} I am here with you. ${proche} can come and help you. Press the button for me to call ${proche} now.`,
    urgence_vocal_seul:   (p) => `${p ? 'Don\'t worry, ' + p + '. You are not alone.' : 'Don\'t worry. You are not alone.'} I am here with you. Stay calm. You can set up a family contact so they can be notified quickly.`,
    glyc_vocal_hypo:       (p, v) => `${p}your blood sugar is ${v} milligrams per deciliter. That's below normal — this is called hypoglycemia. Have something sweet now, a glass of fruit juice or a few candies, and rest. If you don't feel better in a few minutes, call your doctor.`,
    glyc_vocal_ok:         (p, v) => `${p}your blood sugar is ${v} milligrams per deciliter. That's a great value, in the normal range. Well done, keep it up!`,
    glyc_vocal_eleve:      (p, v) => `${p}your blood sugar is ${v} milligrams per deciliter. That's a bit high. Try to avoid sugary foods at your next meal and remember to drink water. Your doctor is monitoring this with you.`,
    glyc_vocal_tres_eleve: (p, v) => `${p}your blood sugar is ${v} milligrams per deciliter. That's quite high. Try to rest, drink water, and let your doctor know at your next appointment. Don't hesitate to use the help button if you don't feel well.`,
    notif_med_titre:    'Mon Sucre — Medication',
    notif_med_corps:    (nom) => `Don't forget to take: ${nom}`,
    notif_rappel_titre: 'Mon Sucre — Urgent reminder',
    notif_rappel_corps: (nom) => `You still haven't taken: ${nom}`,
    questions_bienetre: [
      { q: 'How are you feeling right now?',         e: '💛' },
      { q: 'Did you sleep well last night?',         e: '🌙' },
      { q: 'Are you in a good mood today?',          e: '😊' },
      { q: 'Do you feel well this morning?',         e: '🌅' },
      { q: 'Have you eaten something good today?',   e: '🍳' },
      { q: 'Are you warm and comfortable?',          e: '🏠' },
      { q: 'Have you had enough water today?',       e: '💧' },
      { q: 'Have you had any good news today?',      e: '📬' },
      { q: 'Are you doing something enjoyable?',     e: '🌸' },
      { q: 'Have you spoken to someone dear today?', e: '💬' },
      { q: 'Do you feel calm and peaceful?',         e: '🍃' },
      { q: 'Have you taken time to rest today?',     e: '☕' },
      { q: 'Is the day going well for you?',         e: '🌈' },
      { q: 'Have you smiled today?',                 e: '😄' },
      { q: 'Do you feel well surrounded?',           e: '🤗' },
      { q: 'Do you feel ready for the day?',         e: '⚡' },
      { q: 'Have you taken a little walk?',          e: '🌿' },
      { q: 'Is the weather nice for you today?',     e: '☀️' },
      { q: 'Do you have something fun planned?',     e: '🎉' },
      { q: 'Are you taking good care of yourself?',  e: '💖' },
    ],
    reponses_oui: [
      'What great news, I\'m so happy to hear it! 🌟',
      'Wonderful! Enjoy this beautiful day 🌈',
      'Fantastic! Keep it up 💪',
      'That warms my heart! ☀️',
      'Marvellous! You deserve it 🌸',
    ],
    reponses_non: [
      'Thank you for telling me… Take good care of yourself 💙',
      'I\'m here with you. Don\'t hesitate to call a loved one 🤗',
      'It will get better soon. Courage! 💛',
      'Be gentle with yourself today 🍃',
      'Remember to rest. I\'m watching over you 💜',
    ],
  },
  it: {
    retour: '← Indietro',
    splash_tap: 'Tocca per iniziare',
    zone_quotidien: 'La mia routine',
    ma_glycemie: 'La mia glicemia',
    glycemie_sous_defaut: 'Registra il valore di oggi',
    glycemie_derniere: (v, q) => `Ultima: ${v} mg/dL — ${q}`,
    mes_medicaments: 'I miei farmaci',
    meds_tous_pris: 'Tutti i farmaci presi oggi',
    meds_restants: (n) => `${n} farmac${n > 1 ? 'i' : 'o'} rimanent${n > 1 ? 'i' : 'e'} oggi`,
    meds_sous_defaut: 'Vedi le dosi di oggi',
    mon_repas: 'Il mio pasto',
    repas_sous: 'Aggiungi cosa ho mangiato',
    zone_urgence: 'In caso di problema',
    je_sens_pas_bien: 'Non mi sento bene',
    appeler_proche: 'Chiamare un familiare',
    urgences: 'Emergenza',
    medecin_garde: 'Medico di guardia',
    glycemie_titre: 'La mia glicemia',
    glycemie_du_jour: 'La tua glicemia di oggi',
    glyc_hint: 'Tocca il campo per inserire il valore',
    hypoglycemie: 'Ipoglicemia',
    normal: 'Normale',
    eleve: 'Alto',
    tres_eleve: 'Molto alto',
    glycemie_enregistree: 'Glicemia registrata!',
    enregistrer: 'Salva',
    voir_historique: 'Vedi la mia cronologia',
    ind_hypo: '🔴 Ipoglicemia — Mangia qualcosa di dolce!',
    ind_normal: '🟢 Normale — Buona glicemia!',
    ind_eleve: '🟡 Alto — Attenzione a cosa mangi.',
    ind_tres_eleve: '🔴 Molto alto — Consulta il tuo medico.',
    ind_hypo_c: 'Ipoglicemia — Consulta rapidamente!',
    ind_normal_c: 'Normale — Molto bene!',
    ind_eleve_c: 'Alto — Fai attenzione.',
    ind_tres_eleve_c: 'Molto alto — Consulta il tuo medico.',
    meds_titre: 'I miei farmaci',
    ajouter_med: 'Aggiungi un farmaco',
    matin: 'Mattina',
    midi: 'Mezzogiorno',
    soir: 'Sera',
    nuit: 'Notte',
    aucun_med: 'Nessun farmaco attivo. Usa il pulsante + per aggiungerne uno.',
    med_aujourd_hui: 'Oggi',
    med_autres_jours: 'Altri giorni',
    med_tout_pris: 'Tutto preso',
    med_oublie: 'Dimenticato',
    med_oublies: (n) => `${n} dimenticati`,
    med_pris: '✓ Preso',
    marquer_pris: 'Segna come preso',
    med_freq_hebdo: (jour) => `ogni ${jour}`,
    med_freq_mensuel: (j) => `il ${j} del mese`,
    urgence_titre: 'Ho bisogno di aiuto',
    pas_seul: 'Non sei solo.\nSono qui con te.',
    aucun_proche_configure: 'Nessun contatto configurato.\nAggiungi prima un contatto.',
    configurer_proche_btn: '⚙️ Configura il mio contatto',
    prevenir_famille: 'Avvisare la mia famiglia',
    proche_prevenu: '✅ Il tuo familiare è stato avvisato.',
    restez_calme: 'Stai calmo, stanno arrivando.',
    retour_accueil: 'Torna alla home',
    je_vais_mieux: '✅ Sto meglio — torna alla home',
    modal_112_titre: 'Chiamare il 112?',
    modal_112_texte: 'Il 112 è il numero dei soccorsi d\'emergenza.\nChiamare solo in caso di pericolo reale.',
    modal_112_oui: 'Sì, chiama il 112',
    modal_1733_titre: 'Chiamare il 1733?',
    modal_1733_texte: 'Il 1733 ti mette in contatto con il medico o la farmacia di guardia.\nPer qualsiasi domanda medica non urgente.',
    modal_1733_oui: 'Sì, chiama il 1733',
    modal_annuler: 'No, annulla',
    proche_aidant_label: 'Il tuo contatto:',
    appeler_prenom: (p) => `Chiama ${p}`,
    appeler_confirm: (nom) => `Chiamare ${nom}?`,
    envoi_en_cours: 'Invio in corso…',
    envoi_echec: '⚠️ Errore — verificare la configurazione',
    votre_proche_defaut: 'il tuo familiare',
    repas_titre: 'Il mio pasto',
    quavez_mange: 'Cosa hai mangiato?',
    prendre_photo: 'Scatta una foto',
    photo_sous: 'Fotografa il tuo piatto',
    decrire_voix: 'Descrivere ad alta voce',
    voix_sous: 'Di\' cosa hai mangiato',
    voir_repas: 'Vedi i miei pasti precedenti',
    bravo_titre: 'Bravo!',
    bravo_texte: 'Annotato. Continua così!',
    bienetre_q_defaut: 'Come ti senti oggi?',
    g_matin:   (n) => `Buongiorno${n}`,
    g_appetit: (n) => `Buon appetito${n}`,
    g_aprem:   (n) => `Buon pomeriggio${n}`,
    g_soir:    (n) => `Buona sera${n}`,
    g_nuit:    (n) => `Buona notte${n}`,
    a_instant:  'un momento fa',
    il_y_a_min: (n) => `${n} min fa`,
    il_y_a_h:   (n) => `${n}h fa`,
    locale_date: 'it-IT',
    parametres: '⚙️ Impostazioni',
    langue_titre: '🌐 Lingua',
    langue_sous: 'Scegli la lingua dell\'applicazione.',
    mode_nuit_titre: '🌙 Modalità notte',
    mode_nuit_sous: 'Attiva la modalità notte automatica (21h–6h) o disattivala per mantenere la visualizzazione normale.',
    mode_nuit_label_auto: 'Automatico (21h–6h)',
    mode_nuit_label_off: 'Disattivato',
    partager: 'Condividi',
    mes_glycemies_titre: 'Le mie glicemie',
    cal_legende_hypo: 'Ipo',
    nouveau_med: 'Nuovo farmaco',
    scanner_boite: '📷 Scansiona la scatola',
    champs_obligatoires: 'I campi * sono obbligatori.',
    nom_medicament_label: 'Nome del farmaco',
    placeholder_med: 'Es.: Metformina',
    quand_prendre: 'Quando prenderlo?',
    quand_prendre_hint: '(più scelte possibili)',
    insuline_titre: 'Iniezione di insulina',
    insuline_sous: 'Spunta se è un\'iniezione',
    options_avancees_btn: '⚙️ Opzioni avanzate',
    frequence_label: 'Frequenza',
    freq_quotidien: '📅 Ogni giorno',
    freq_hebdo: '📆 Settimanale',
    freq_mensuel_btn: '🗓️ Mensile',
    quel_jour: 'Quale giorno?',
    quel_jour_mois: 'Quale giorno del mese?',
    heure_exacte: 'Orario esatto',
    posologie_label: 'Posologia',
    placeholder_posologie: 'Es.: 1 compressa · 500 mg',
    enregistrer_med: '✅ Salva farmaco',
    mes_meds_enregistres: '📋 I miei farmaci salvati',
    aucun_med_enregistre: 'Nessun farmaco salvato',
    jour_lun: 'Lun', jour_mar: 'Mar', jour_mer: 'Mer', jour_jeu: 'Gio',
    jour_ven: 'Ven', jour_sam: 'Sab', jour_dim: 'Dom',
    // ── Pasti / nutrizione ────────────────────────────
    ig_bas: 'IG Basso', ig_modere: 'IG Moderato', ig_eleve: 'IG Alto',
    ok_diabete: '✅ OK diabete', attention_diabete: '⚠️ Attenzione', eviter_diabete: '🚫 Da evitare',
    glucides: 'Carboidrati', dont_sucres: 'di cui zuccheri', proteines: 'Proteine', lipides: 'Grassi',
    fibres: 'Fibre', sel: 'Sale', index_glycemique: 'Indice glicemico',
    aucune_glycemie_jour: 'Nessuna glicemia per questo giorno.',
    // ── Scheda farmaco ────────────────────────────────
    fiche_med_titre: 'Scheda farmaco',
    statut_desactive: '⏸ Disattivato',
    statut_actif: '✅ Attivo',
    reactiver_med: '▶ Riattiva questo farmaco',
    desactiver_med: '⏸ Disattiva questo farmaco',
    hint_med_desactive: 'Questo farmaco è attualmente disattivato. Riattivalo per ricevere i promemoria.',
    hint_med_actif: 'Il farmaco verrà conservato ma non apparirà più nei tuoi promemoria quotidiani.',
    desactive_badge: '⏸ disattivato',
    pris_bravo: '✅ Preso — bravo!',
    // ── Notifiche ─────────────────────────────────────
    notif_installer_ios: '⚠️ Installa l\'app sulla schermata principale per attivare le notifiche.',
    notif_non_supporte: '❌ Il tuo browser non supporta le notifiche.',
    notif_active: '✅ Notifiche attivate — riceverai i promemoria.',
    notif_bloquee: '🚫 Notifiche bloccate. Vai nelle impostazioni per autorizzarle.',
    notif_inactive: '💤 Notifiche non attivate.',
    // ── Sessione ──────────────────────────────────────
    vider_cache_en_cours: '⏳ In corso…',
    session_renouvelee: '✅ Sessione rinnovata!',
    erreur_simple: '❌ Errore',
    renouveler_session: '🔄 Rinnova la sessione',
    // ── Scanner ───────────────────────────────────────
    scan_analyse: '⏳ Analisi del farmaco in corso…',
    scan_non_reconnu: '❌ Farmaco non riconosciuto. Inserisci il nome manualmente.',
    scan_erreur: '❌ Errore durante l\'analisi. Inserisci il nome manualmente.',
    // ── Cronologia ────────────────────────────────────
    aucune_glycemie: 'Nessuna glicemia registrata per il momento.',
    aucun_repas_hist: 'Nessun pasto registrato per il momento.',
    aucune_injection: 'Nessuna iniezione registrata.',
    // ── Accesso ───────────────────────────────────────
    connexion_en_cours: '⏳ Connessione…',
    instruction_sms: 'Inserisci il codice a 4 cifre\nricevuto via SMS',
    instruction_dev: 'Inserisci il codice a 4 cifre\nvisualizzato qui sotto',
    code_sms_titre: 'Codice SMS',
    // ── Schermate ─────────────────────────────────────
    mes_repas_titre: 'I miei pasti',
    // ── Vocal ──────────────────────────────────────────
    salut_matin: (nom, voix) => `Buongiorno, sono ${voix}. ${nom ? 'Buongiorno ' + nom + '! ' : ''}Siamo felici di ritrovarti stamattina. Passa una giornata meravigliosa.`,
    salut_midi:  (nom, voix) => `Buongiorno, sono ${voix}. ${nom ? 'Buongiorno ' + nom + '! ' : ''}Speriamo che la tua giornata stia andando bene.`,
    salut_soir:  (nom, voix) => `Buona sera, sono ${voix}. ${nom ? 'Buona sera ' + nom + '! ' : ''}Speriamo che tu abbia trascorso una bella giornata.`,
    urgence_vocal_112:    (p) => `${p ? 'Non si preoccupi, ' + p + '.' : 'Non si preoccupi.'} Sta per chiamare il 1-1-2, il numero dei soccorsi d'emergenza. Se ha davvero bisogno di aiuto immediato, prema il pulsante rosso per confermare. Altrimenti, prema Annulla. Sono qui con lei.`,
    urgence_vocal_1733:   (p) => `${p ? 'Non si preoccupi, ' + p + '.' : 'Non si preoccupi.'} Il 1733 è il numero del medico e della farmacia di guardia. È il numero giusto quando ha bisogno di un parere medico, ma non si tratta di un'emergenza vitale. Vuole chiamare adesso? Prema il pulsante verde per confermare, oppure prema Annulla.`,
    urgence_vocal_proche: (p, proche) => `${p ? 'Non si preoccupi, ' + p + '. Non è solo.' : 'Non si preoccupi. Non è solo.'} Sono qui con lei. ${proche} può venire ad aiutarla. Prema il pulsante perché io chiami ${proche} adesso.`,
    urgence_vocal_seul:   (p) => `${p ? 'Non si preoccupi, ' + p + '. Non è solo.' : 'Non si preoccupi. Non è solo.'} Sono qui con lei. Resti calmo. Può configurare un familiare di riferimento in modo che venga avvisato rapidamente.`,
    glyc_vocal_hypo:       (p, v) => `${p}la tua glicemia è di ${v} milligrammi per decilitro. È al di sotto della norma — si chiama ipoglicemia. Prendi qualcosa di dolce adesso, un bicchiere di succo di frutta o qualche caramella, e riposati. Se non ti senti meglio in pochi minuti, chiama il tuo medico.`,
    glyc_vocal_ok:         (p, v) => `${p}la tua glicemia è di ${v} milligrammi per decilitro. È un ottimo valore, nella zona normale. Bravo, continua così!`,
    glyc_vocal_eleve:      (p, v) => `${p}la tua glicemia è di ${v} milligrammi per decilitro. È un po' elevata. Cerca di evitare i dolci al prossimo pasto e ricordati di bere acqua. Il tuo medico sta monitorando questo con te.`,
    glyc_vocal_tres_eleve: (p, v) => `${p}la tua glicemia è di ${v} milligrammi per decilitro. È piuttosto elevata. Cerca di riposare, bevi acqua e segnala questo valore al tuo medico alla prossima visita. Non esitare a usare il pulsante di aiuto se non ti senti bene.`,
    notif_med_titre:    'Mon Sucre — Farmaco',
    notif_med_corps:    (nom) => `Non dimenticare di prendere: ${nom}`,
    notif_rappel_titre: 'Mon Sucre — Promemoria urgente',
    notif_rappel_corps: (nom) => `Non hai ancora preso: ${nom}`,
    questions_bienetre: [
      { q: 'Come ti senti in questo momento?',          e: '💛' },
      { q: 'Hai dormito bene stanotte?',                e: '🌙' },
      { q: 'Sei di buon umore oggi?',                   e: '😊' },
      { q: 'Ti senti in forma stamattina?',             e: '🌅' },
      { q: 'Hai mangiato qualcosa di buono?',           e: '🍳' },
      { q: 'Sei al caldo e a tuo agio?',                e: '🏠' },
      { q: 'Hai bevuto abbastanza acqua oggi?',         e: '💧' },
      { q: 'Hai avuto buone notizie oggi?',             e: '📬' },
      { q: 'Stai facendo qualcosa di piacevole?',       e: '🌸' },
      { q: 'Hai parlato con qualcuno di caro oggi?',    e: '💬' },
      { q: 'Ti senti calmo e sereno?',                  e: '🍃' },
      { q: 'Hai avuto il tempo di riposare oggi?',      e: '☕' },
      { q: 'La giornata sta andando bene?',             e: '🌈' },
      { q: 'Hai sorriso oggi?',                         e: '😄' },
      { q: 'Ti senti ben circondato?',                  e: '🤗' },
      { q: 'Ti senti pronto per la giornata?',          e: '⚡' },
      { q: 'Hai fatto una piccola passeggiata?',        e: '🌿' },
      { q: 'Il tempo è bello per te oggi?',             e: '☀️' },
      { q: 'Hai qualcosa di bello in programma?',       e: '🎉' },
      { q: 'Ti stai prendendo cura di te?',             e: '💖' },
    ],
    reponses_oui: [
      'Che bella notizia, mi fa molto piacere! 🌟',
      'Meraviglioso! Goditi questa bella giornata 🌈',
      'Fantastico! Continua così 💪',
      'Mi scalda il cuore! ☀️',
      'Magnifico! Te lo meriti 🌸',
    ],
    reponses_non: [
      'Grazie per dirmelo… Prenditi cura di te 💙',
      'Sono qui con te. Non esitare a chiamare un familiare 🤗',
      'Andrà meglio presto. Coraggio! 💛',
      'Sii gentile con te stesso oggi 🍃',
      'Ricordati di riposare. Vegli su di te 💜',
    ],
  }
};

function getLang()     { return localStorage.getItem('ms_langue') || 'fr'; }
function setLang(lang) { localStorage.setItem('ms_langue', lang); }

function t(key) {
  const T = _TRANSLATIONS[getLang()] || _TRANSLATIONS.fr;
  return T[key] !== undefined ? T[key] : (_TRANSLATIONS.fr[key] !== undefined ? _TRANSLATIONS.fr[key] : key);
}

function appliquerTraductions() {
  // Éléments avec data-i18n → textContent simple
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = t(el.dataset.i18n);
    if (typeof val === 'string') el.textContent = val;
  });
  // Éléments avec data-i18n-br → innerHTML avec <br> sur \n
  document.querySelectorAll('[data-i18n-br]').forEach(el => {
    const val = t(el.dataset.i18nBr);
    if (typeof val === 'string') el.innerHTML = val.replace(/\n/g, '<br>');
  });
  // Éléments avec data-i18n-placeholder → placeholder des inputs
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const val = t(el.dataset.i18nPlaceholder);
    if (typeof val === 'string') el.placeholder = val;
  });
  // Tous les boutons "← Retour"
  document.querySelectorAll('.btn-retour').forEach(el => {
    el.textContent = t('retour');
  });
  // Boutons langue — marquer l'actif
  const lang = getLang();
  document.querySelectorAll('.btn-langue').forEach(el => {
    el.classList.toggle('btn-langue-actif', el.dataset.lang === lang);
  });
}

function changerLangue(lang) {
  setLang(lang);
  appliquerTraductions();
  // Rafraîchit les textes dynamiques
  const el = document.getElementById('message-bonjour');
  if (el) el.textContent = messageBonjourComplet();
  mettreAJourResume();
  const ind = document.getElementById('glycemie-indicateur');
  if (ind && document.getElementById('inp-glycemie')?.value) mettreAJourIndicateurGlyc();
  // Invalide le cache audio urgence (textes changés de langue)
  if (typeof _invaliderEtRechargerCacheUrgence === 'function') _invaliderEtRechargerCacheUrgence();
  // Recharge la liste médicaments si l'écran est actif
  if (document.getElementById('ecran-medicaments')?.classList.contains('actif')) chargerMedicaments();
}

// ════════════════════════════════════════════════════════
// ── Session ─────────────────────────────────────────────
// ════════════════════════════════════════════════════════
function getSession() {
  try { return JSON.parse(localStorage.getItem('ms_session') || 'null'); } catch { return null; }
}
function sauverSession(data) {
  localStorage.setItem('ms_session', JSON.stringify(data));
}
function deconnecterSession() {
  localStorage.removeItem('ms_session');
  localStorage.removeItem('ms_verif_token');
  localStorage.removeItem('ms_verif_tel');
}
function authHeader() {
  const s = getSession();
  return s?.token ? { 'Authorization': `Bearer ${s.token}` } : {};
}

// ════════════════════════════════════════════════════════
// ── Données utilisateur (cache local) ──────────────────
// ════════════════════════════════════════════════════════
function getUserLocal() {
  try { return JSON.parse(localStorage.getItem('ms_user') || 'null'); } catch { return null; }
}
function sauverUserLocal(user) {
  localStorage.setItem('ms_user', JSON.stringify(user));
}

// Fusionne les thumbnails du localStorage dans un user venant du serveur
// (le serveur ne stocke jamais les thumbnails pour limiter la taille Redis)
function restaurerThumbnails(userServeur) {
  const local = getUserLocal();
  if (!local?.historique_repas || !userServeur?.historique_repas) return userServeur;
  const indexThumbs = {};
  local.historique_repas.forEach(e => { if (e.thumbnail) indexThumbs[e.id] = e.thumbnail; });
  return {
    ...userServeur,
    historique_repas: userServeur.historique_repas.map(e => ({
      ...e,
      thumbnail: indexThumbs[e.id] || e.thumbnail || null
    }))
  };
}
function getPrenom()       { return getUserLocal()?.prenom || ''; }
function getMedicaments()  { return getUserLocal()?.medicaments || []; }
function getProcheContact()  { return getUserLocal()?.proche    || null; }
function getProcheContact2() { return getUserLocal()?.proche2   || null; }
function getMedecin()        { return getUserLocal()?.medecin   || null; }
function getPharmacie()      { return getUserLocal()?.pharmacie || null; }
function getHistorique()   { return getUserLocal()?.historique_repas || []; }

function patchUserLocal(patch) {
  const u      = getUserLocal() || { medicaments: [], historique_repas: [] };
  const fusion = { ...u, ...patch };
  sauverUserLocal(fusion);
  planifierSync(patch);
  return fusion;
}

// ════════════════════════════════════════════════════════
// ── Sync serveur (PUT /api/user, debouncé) ─────────────
// ════════════════════════════════════════════════════════
let syncTimer = null;
let syncPatchAccumule = {};

function planifierSync(patch) {
  if (!getSession()) return;
  Object.assign(syncPatchAccumule, patch);
  if (syncTimer) clearTimeout(syncTimer);
  syncTimer = setTimeout(envoyerSync, 800);
}

async function envoyerSync() {
  const patch = { ...syncPatchAccumule };
  syncPatchAccumule = {};
  syncTimer = null;
  if (Object.keys(patch).length === 0) return;
  if (!getSession()) return;
  try {
    const r = await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify(patch)
    });
    if (r.status === 401) {
      deconnecterSession();
      localStorage.removeItem('ms_user');
      allerA('ecran-inscription');
      return;
    }
    if (!r.ok) throw new Error('http-' + r.status);
    const data = await r.json();
    if (data.user) sauverUserLocal(restaurerThumbnails(data.user));
    localStorage.removeItem(cleUser('ms_sync_en_attente')); // sync réussie
  } catch {
    // Hors ligne ou erreur serveur : mémoriser pour réessai automatique
    localStorage.setItem(cleUser('ms_sync_en_attente'), JSON.stringify(patch));
  }
}

// Réessaie la sync en attente (appelé au retour en ligne ou focus app)
function reessayerSyncEnAttente() {
  try {
    const raw = localStorage.getItem(cleUser('ms_sync_en_attente'));
    if (!raw) return;
    const pending = JSON.parse(raw);
    if (Object.keys(pending).length > 0) planifierSync(pending);
  } catch {}
}

// Retour en ligne → sync immédiate
window.addEventListener('online', reessayerSyncEnAttente);

async function hydraterDepuisServeur() {
  if (!getSession()) return null;
  if (syncTimer || Object.keys(syncPatchAccumule).length > 0) return null;
  try {
    const r = await fetch('/api/user', { headers: authHeader() });
    if (r.status === 401) {
      deconnecterSession();
      localStorage.removeItem('ms_user');
      return null;
    }
    if (!r.ok) return null;
    const data = await r.json();
    if (data.user) sauverUserLocal(restaurerThumbnails(data.user));
    return data.user;
  } catch { return null; }
}

// ════════════════════════════════════════════════════════
// ── PIN aidant ─────────────────────────────────────────
// ════════════════════════════════════════════════════════
let _pinSaisi = '';
let _pinModeCreation = false;  // true = premier PIN à créer, false = vérification
let _pinModeDev = false;       // true = accès zone développeur

// ── Zone Développeur (PIN en dur) ──────────────────────
const _DEV_PIN = '2327';

function ouvrirZoneDev() {
  _pinModeDev = true;
  _pinModeCreation = false;
  _pinSaisi = '';
  _majAffichagePin();
  document.getElementById('modal-pin').style.display = 'flex';
  const titre = document.querySelector('.pin-titre');
  if (titre) titre.textContent = '🛠️ Accès développeur';
  const sousTitre = document.querySelector('.pin-sous');
  if (sousTitre) sousTitre.textContent = 'Entrez le code développeur à 4 chiffres.';
}

function ouvrirParametres() {
  const pin = localStorage.getItem(cleUser('ms_pin'));
  if (!pin) {
    // Pas de PIN sur cet appareil (nouvel appareil ou premier lancement) →
    // montrer le modal en mode "création" plutôt que d'ouvrir directement les paramètres
    document.getElementById('modal-pin').style.display = 'flex';
    const titre = document.querySelector('.pin-titre');
    if (titre) titre.textContent = '🔑 Créer votre code aidant';
    const sousTitre = document.querySelector('.pin-sous');
    if (sousTitre) sousTitre.textContent = 'Choisissez un code à 4 chiffres pour protéger les paramètres.';
    _pinSaisi = '';
    _majAffichagePin();
    // Mode création : le premier code saisi devient le PIN
    _pinModeCreation = true;
    return;
  }
  _pinModeCreation = false;
  _pinSaisi = '';
  _majAffichagePin();
  document.getElementById('modal-pin').style.display = 'flex';
  const titre = document.querySelector('.pin-titre');
  if (titre) titre.textContent = '🔑 Accès aidant';
  const sousTitre = document.querySelector('.pin-sous');
  if (sousTitre) sousTitre.textContent = 'Entrez votre code à 4 chiffres.';
}

function _pinTouche(chiffre) {
  if (_pinSaisi.length >= 4) return;
  _pinSaisi += chiffre;
  _majAffichagePin();
  if (_pinSaisi.length === 4) setTimeout(_verifierPin, 180);
}

function _pinEffacer() {
  _pinSaisi = _pinSaisi.slice(0, -1);
  _majAffichagePin();
}

function _majAffichagePin() {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById(`pin-p${i}`);
    if (el) el.classList.toggle('rempli', i <= _pinSaisi.length);
  }
}

function _verifierPin() {
  // ── Mode Zone Développeur ──────────────────────────────
  if (_pinModeDev) {
    if (_pinSaisi === _DEV_PIN) {
      document.getElementById('modal-pin').style.display = 'none';
      _pinModeDev = false;
      allerA('ecran-dev');
    } else {
      const boite = document.querySelector('.pin-boite');
      if (boite) { boite.classList.add('pin-erreur'); setTimeout(() => boite.classList.remove('pin-erreur'), 600); }
      _pinSaisi = '';
      setTimeout(_majAffichagePin, 100);
    }
    return;
  }
  // ── Mode Création ──────────────────────────────────────
  if (_pinModeCreation) {
    // Mode création : on enregistre le PIN saisi et on ouvre les paramètres
    localStorage.setItem(cleUser('ms_pin'), _pinSaisi);
    document.getElementById('modal-pin').style.display = 'none';
    _pinModeCreation = false;
    allerA('ecran-proche');
    return;
  }
  // ── Mode Vérification ──────────────────────────────────
  const pinSauve = localStorage.getItem(cleUser('ms_pin'));
  if (_pinSaisi === pinSauve) {
    document.getElementById('modal-pin').style.display = 'none';
    allerA('ecran-proche');
  } else {
    // Mauvais code — animation erreur
    const boite = document.querySelector('.pin-boite');
    if (boite) { boite.classList.add('pin-erreur'); setTimeout(() => boite.classList.remove('pin-erreur'), 600); }
    _pinSaisi = '';
    setTimeout(_majAffichagePin, 100);
  }
}

function fermerModalPin() {
  _pinSaisi = '';
  _pinModeCreation = false;
  _pinModeDev = false;
  _majAffichagePin();
  document.getElementById('modal-pin').style.display = 'none';
}

function sauverPin() {
  const val = document.getElementById('inp-pin')?.value?.trim();
  if (!val || !/^\d{4}$/.test(val)) {
    alert('Le code PIN doit être composé exactement de 4 chiffres.');
    return;
  }
  localStorage.setItem(cleUser('ms_pin'), val);
  afficherZone('pin-sauve');
  setTimeout(() => masquerZone('pin-sauve'), 2500);
  document.getElementById('inp-pin').value = '';
}

// ── Écran DEV ──────────────────────────────────────────
function chargerEcranDev() {
  const devEl     = document.getElementById('toggle-mode-dev');
  const seniorEl  = document.getElementById('toggle-senior-only');
  const labelEl   = document.getElementById('label-senior-only');
  if (devEl)    devEl.checked    = estModeDevActif();
  if (seniorEl) seniorEl.checked = estSeniorOnly();
  if (labelEl)  labelEl.textContent = estSeniorOnly() ? 'Activé' : 'Désactivé';
  _majBoutonsTTS();
}

function _majBoutonsTTS() {
  const p     = getTTSProvider();
  const btnE  = document.getElementById('btn-tts-eleven');
  const btnO  = document.getElementById('btn-tts-openai');
  const label = document.getElementById('tts-provider-label');
  const _styleBtn = (btn, actif) => {
    if (!btn) return;
    btn.style.background  = actif ? '#2e7d32' : '#fff';
    btn.style.color       = actif ? '#fff'    : '#333';
    btn.style.borderColor = actif ? '#2e7d32' : '#ccc';
  };
  _styleBtn(btnE, p === 'elevenlabs');
  _styleBtn(btnO, p === 'openai');
  if (label) label.textContent = p === 'openai'
    ? '🤖 OpenAI TTS actif (nova) — pour tests quota ElevenLabs épuisé'
    : '🎙️ ElevenLabs actif (Matilda)';
}

function basculerTTS(provider) {
  setTTSProvider(provider);
  _majBoutonsTTS();
}

// ════════════════════════════════════════════════════════
// ── Navigation ─────────────────────────────────────────
// ════════════════════════════════════════════════════════
// UX-F1 : message Bravo contextualisé selon l'action
// messageVocal (optionnel) est joué après la navigation (allerA coupe l'audio, d'où le setTimeout)
function afficherBravo(message, messageVocal) {
  const el = document.getElementById('bravo-texte');
  if (el) el.textContent = message || "C'est noté. Continuez comme ça !";
  allerA('ecran-bravo');
  if (messageVocal) setTimeout(() => _jouerTexteVocal(messageVocal), 150);
}

// Génère un commentaire vocal adapté à la valeur de glycémie (mg/dL)
function _texteCommentaireGlycemie(valeur) {
  const p = getPrenom() ? `${getPrenom()}, ` : '';
  if (valeur < 70)    return t('glyc_vocal_hypo')(p, valeur);
  if (valeur <= 126)  return t('glyc_vocal_ok')(p, valeur);
  if (valeur <= 180)  return t('glyc_vocal_eleve')(p, valeur);
  return t('glyc_vocal_tres_eleve')(p, valeur);
}

function allerA(ecranId) {
  // Stoppe toute voix en cours — sauf si on va sur urgence (elle joue sa propre voix)
  if (ecranId !== 'ecran-urgence') _stopperAudioGlobal();

  document.querySelectorAll('.ecran').forEach(e => e.classList.remove('actif'));
  const cible = document.getElementById(ecranId);
  if (cible) cible.classList.add('actif');
  window.scrollTo(0, 0);

  if (ecranId === 'ecran-accueil')      appliquerModeHeure();
  if (ecranId === 'ecran-urgence')      chargerEcranUrgence();
  if (ecranId === 'ecran-proche')       chargerFormulaireProche();
  if (ecranId === 'ecran-dev')          chargerEcranDev();
  if (ecranId === 'ecran-historique')        chargerHistorique();
  if (ecranId === 'ecran-historique-repas') chargerHistoriqueRepas();
  if (ecranId === 'ecran-glycemie')          reinitGlyc();
  if (ecranId === 'ecran-medicaments')  chargerMedicaments();
  if (ecranId === 'ecran-repas')        verifierRappelGlyc();
}

function chargerFormulaireProche() {
  const session = getSession();
  document.getElementById('inp-profil-prenom').value = getPrenom();
  document.getElementById('inp-profil-tel').value    = session?.telephone || '';

  const proche  = getProcheContact();
  document.getElementById('inp-proche-prenom').value = proche?.prenom    || '';
  document.getElementById('inp-proche-tel').value    = proche?.telephone || '';

  const proche2 = getProcheContact2();
  document.getElementById('inp-proche2-prenom').value = proche2?.prenom    || '';
  document.getElementById('inp-proche2-tel').value    = proche2?.telephone || '';

  const medecin = getMedecin();
  document.getElementById('inp-medecin-nom').value = medecin?.nom       || '';
  document.getElementById('inp-medecin-tel').value = medecin?.telephone || '';

  const pharmacie = getPharmacie();
  document.getElementById('inp-pharmacie-nom').value = pharmacie?.nom       || '';
  document.getElementById('inp-pharmacie-tel').value = pharmacie?.telephone || '';

  masquerZone('profil-sauve');
  masquerZone('proche-sauve');
  masquerZone('proche2-sauve');
  masquerZone('medecin-sauve');
  masquerZone('pharmacie-sauve');
  afficherStatutNotifications();

  // Toggle mode nuit
  const modeNuitActif = localStorage.getItem('ms_mode_nuit') !== 'off';
  const toggleNuit = document.getElementById('toggle-mode-nuit');
  if (toggleNuit) toggleNuit.checked = modeNuitActif;
  const labelNuit = document.getElementById('mode-nuit-label');
  if (labelNuit) {
    labelNuit.setAttribute('data-i18n', modeNuitActif ? 'mode_nuit_label_auto' : 'mode_nuit_label_off');
  }
  appliquerTraductions();

  // Note : les toggles DEV et SeniorOnly sont initialisés par chargerEcranDev()
  // qui est appelé automatiquement quand on navigue vers ecran-dev.
}

// ════════════════════════════════════════════════════════
// ── Réinitialisation compte ────────────────────────────
// ════════════════════════════════════════════════════════
async function reinitialiserCompte() {
  if (!confirm('⚠️ Réinitialiser le compte ?\n\nTout sera supprimé : médicaments, repas, contacts proches, historique.\nVous devrez vous reconnecter.\n\nCette action est irréversible.')) return;

  // 1. Réinitialiser côté serveur (Redis) — avec authHeader
  try {
    await fetch('/api/user', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({
        prenom: null,
        medicaments: [],
        proche: null,
        proche2: null,
        medecin: null,
        pharmacie: null,
        historique_repas: [],
        prises_medicaments: [],
        bien_etre: []
      })
    });
  } catch (e) {
    console.error('Erreur reset serveur:', e);
  }

  // 2. Tout vider côté localStorage (session + user + clés perso)
  localStorage.clear();

  alert('✅ Compte réinitialisé.');
  allerA('ecran-inscription');
}

// ════════════════════════════════════════════════════════
// ── Déconnexion ────────────────────────────────────────
// ════════════════════════════════════════════════════════
function seDeconnecter() {
  if (!confirm('Voulez-vous vraiment vous déconnecter ?')) return;
  deconnecterSession();
  localStorage.removeItem('ms_user');
  allerA('ecran-inscription');
}

// ════════════════════════════════════════════════════════
// ── Admin : liste & suppression d'utilisateurs (DEV) ───
// ════════════════════════════════════════════════════════
async function chargerListeUtilisateurs() {
  const conteneur = document.getElementById('liste-admin-users');
  if (!conteneur) return;
  conteneur.innerHTML = '<p style="color:#6B7280;font-size:15px">Chargement…</p>';

  try {
    const r    = await fetch('/api/admin/users', { headers: authHeader() });
    const data = await r.json();

    if (!r.ok) {
      conteneur.innerHTML = `<p style="color:var(--sos);font-size:15px">Erreur : ${esc(data.erreur)}</p>`;
      return;
    }

    if (!data.users.length) {
      conteneur.innerHTML = '<p style="color:#6B7280;font-size:15px">Aucun utilisateur enregistré.</p>';
      return;
    }

    _usersAdmin = data.users;  // cache pour le rapport
    conteneur.innerHTML = data.users.map(u => {
      const date   = u.cree_le ? new Date(u.cree_le).toLocaleDateString('fr-BE') : '—';
      const prenom = esc(u.prenom || '(sans prénom)');
      const nbMeds = (u.medicaments || []).length;
      const nbRepas= (u.historique_repas || []).length;
      const tel    = esc(u.telephone.replace(/'/g, ''));
      return `
        <div style="background:white;border-radius:16px;padding:14px 16px;box-shadow:0 2px 8px rgba(0,0,0,0.07)">
          <div style="display:flex;align-items:center;gap:12px">
            <div style="flex:1;min-width:0">
              <div style="font-size:17px;font-weight:800;color:var(--texte)">${prenom}</div>
              <div style="font-size:13px;color:var(--texte-doux);margin-top:2px">${esc(u.telephone)}</div>
              <div style="font-size:12px;color:var(--texte-doux);margin-top:2px">
                Inscrit le ${date} · ${nbMeds} méd. · ${nbRepas} repas
              </div>
            </div>
            <button onclick="supprimerUtilisateur('${tel}')"
              style="background:var(--sos-clair);border:none;border-radius:12px;padding:10px 14px;font-size:14px;font-weight:700;color:var(--sos);cursor:pointer;flex-shrink:0">
              🗑️
            </button>
          </div>
          <button onclick="ouvrirRapportAdmin('${tel}')"
            style="width:100%;margin-top:10px;background:#F0F7F4;border:none;border-radius:12px;padding:10px 14px;font-size:14px;font-weight:700;color:var(--accent);cursor:pointer;text-align:left">
            📊 Voir le rapport de suivi
          </button>
        </div>`;
    }).join('');

  } catch (e) {
    conteneur.innerHTML = `<p style="color:var(--sos);font-size:15px">Erreur réseau.</p>`;
  }
}

async function viderTouteDB() {
  if (!confirm('⚠️ VIDER TOUTE LA BASE DE DONNÉES ?\n\nTous les comptes utilisateurs seront supprimés définitivement.\nVous serez déconnecté.\n\nContinuer ?')) return;
  try {
    const r = await fetch('/api/admin/users?all=true', {
      method: 'DELETE',
      headers: authHeader()
    });
    const d = await r.json();
    if (r.ok) {
      alert(`✅ Base vidée — ${d.supprimés} compte(s) supprimé(s).\nVous allez être redirigé vers l'inscription.`);
      localStorage.clear();
      allerA('ecran-inscription');
    } else {
      alert('Erreur : ' + (d.erreur || 'inconnue'));
    }
  } catch {
    alert('Erreur réseau.');
  }
}

async function supprimerUtilisateur(telephone) {
  if (!confirm(`Supprimer définitivement l'utilisateur ${telephone} ?`)) return;
  try {
    const r = await fetch(`/api/admin/users?tel=${encodeURIComponent(telephone)}`, {
      method: 'DELETE',
      headers: authHeader()
    });
    if (r.ok) {
      // Si c'est le compte actuellement connecté → déconnexion + onboarding
      const sessionTel = getSession()?.telephone;
      if (telephone === sessionTel) {
        // Clés préfixées par cleUser (incluent le numéro de téléphone)
        const clesPurger = ['ms_onboarding_done','ms_pin','ms_mode_dev','ms_senior_only',
                            'ms_voix_date','ms_bienetre_date'];
        clesPurger.forEach(c => localStorage.removeItem(cleUser(c)));
        // Clé globale (sans préfixe cleUser)
        localStorage.removeItem('ms_tts_provider');
        deconnecterSession();
        localStorage.removeItem('ms_user');
        allerA('ecran-inscription');
      } else {
        chargerListeUtilisateurs();
      }
    } else {
      const d = await r.json();
      alert('Erreur : ' + (d.erreur || 'inconnue'));
    }
  } catch {
    alert('Erreur réseau.');
  }
}

// ════════════════════════════════════════════════════════
// ── Rapport admin ──────────────────────────────────────
// ════════════════════════════════════════════════════════
let _usersAdmin = [];

function ouvrirRapportAdmin(tel) {
  const u = _usersAdmin.find(x => x.telephone === tel);
  if (!u) return;

  const prenom = u.prenom || u.telephone;
  document.getElementById('rapport-titre').textContent = `📊 ${prenom}`;

  // ── Onglet actif par défaut : repas
  afficherOngletRapport('repas', u);

  // Boutons onglets
  document.querySelectorAll('.rapport-tab').forEach(btn => {
    btn.onclick = () => { afficherOngletRapport(btn.dataset.tab, u); };
  });

  allerA('ecran-admin-rapport');
}

function afficherOngletRapport(tab, u) {
  document.querySelectorAll('.rapport-tab').forEach(b => b.classList.toggle('actif', b.dataset.tab === tab));
  const corps = document.getElementById('rapport-corps');

  const fmt = ts => {
    const d = new Date(ts);
    return d.toLocaleDateString('fr-BE', { day:'2-digit', month:'2-digit' }) + ' ' +
           d.toLocaleTimeString('fr-BE', { hour:'2-digit', minute:'2-digit' });
  };

  if (tab === 'repas') {
    const repas = [...(u.historique_repas || [])].reverse();
    if (!repas.length) { corps.innerHTML = '<p class="rapport-vide">Aucun repas enregistré.</p>'; return; }
    corps.innerHTML = `
      <table class="rapport-table">
        <thead><tr><th>Date</th><th>Type</th><th>Plat / Conseil</th><th>IG</th><th>Indice</th></tr></thead>
        <tbody>${repas.map(r => {
          const ig = r.analyse?.index_glycemique ? ({ bas:'🟢 Bas', modere:'🟡 Modéré', eleve:'🔴 Élevé' })[r.analyse.index_glycemique] || '—' : '—';
          const id = r.analyse?.indice_diabete   ? ({ ok:'✅ OK', attention:'⚠️', eviter:'🚫' })[r.analyse.indice_diabete] || '—' : '—';
          const plat = r.analyse?.plat || r.conseil?.slice(0, 40) || '—';
          return `<tr>
            <td>${fmt(r.ts || r.id)}</td>
            <td>${r.type === 'photo' ? '📷' : '🎤'}</td>
            <td class="rapport-td-long">${esc(plat)}</td>
            <td>${ig}</td>
            <td>${id}</td>
          </tr>`;
        }).join('')}</tbody>
      </table>`;

  } else if (tab === 'humeurs') {
    const humeurs = [...(u.bien_etre || [])].reverse();
    if (!humeurs.length) { corps.innerHTML = '<p class="rapport-vide">Aucune humeur enregistrée.</p>'; return; }
    corps.innerHTML = `
      <table class="rapport-table">
        <thead><tr><th>Date</th><th>Réponse</th><th>Question</th></tr></thead>
        <tbody>${humeurs.map(h => `<tr>
          <td>${fmt(h.ts)}</td>
          <td style="text-align:center;font-size:22px">${h.reponse === 'ok' ? '👍' : '👎'}</td>
          <td class="rapport-td-long">${esc(h.question || '—')}</td>
        </tr>`).join('')}</tbody>
      </table>`;

  } else if (tab === 'medicaments') {
    const prises = [...(u.prises_medicaments || [])].reverse();
    if (!prises.length) { corps.innerHTML = '<p class="rapport-vide">Aucune prise enregistrée.</p>'; return; }
    const hasInsuline = prises.some(p => p.unites != null);
    corps.innerHTML = `
      <table class="rapport-table">
        <thead><tr><th>Date</th><th>Médicament</th><th>Période</th>${hasInsuline ? '<th>Unités</th>' : ''}</tr></thead>
        <tbody>${prises.map(p => {
          const d = new Date(p.ts);
          const dateHeure = d.toLocaleDateString('fr-BE', { day:'numeric', month:'short' }) + ' ' + d.toLocaleTimeString('fr-BE', { hour:'2-digit', minute:'2-digit' });
          return `<tr>
            <td>${dateHeure}</td>
            <td>${p.icone || '💊'} ${esc(p.nom)}</td>
            <td>${esc(p.periode || '—')}</td>
            ${hasInsuline ? `<td>${p.unites != null ? `<strong>${p.unites} U</strong>` : '—'}</td>` : ''}
          </tr>`;
        }).join('')}</tbody>
      </table>`;
  }
}

// ════════════════════════════════════════════════════════
// ── Clés localStorage par utilisateur ─────────────────
function cleUser(suffixe) {
  const tel = getSession()?.telephone || 'anonyme';
  return `${suffixe}_${tel}`;
}

// ── Mode développeur ───────────────────────────────────
function estModeDevActif() {
  return localStorage.getItem(cleUser('ms_mode_dev')) === 'true';
}

// ── Senior Only : verrouillage médicaments ─────────────
function estSeniorOnly() {
  return localStorage.getItem(cleUser('ms_senior_only')) === 'true';
}
function basculerSeniorOnly(checkbox) {
  localStorage.setItem(cleUser('ms_senior_only'), checkbox.checked ? 'true' : 'false');
  const label = document.getElementById('label-senior-only');
  if (label) label.textContent = checkbox.checked ? '✅ Activé — médicaments verrouillés' : 'Désactivé';
  if (document.getElementById('ecran-medicaments').classList.contains('actif')) chargerMedicaments();
}

function basculerModeDev(checkbox) {
  if (checkbox.checked) {
    localStorage.setItem(cleUser('ms_mode_dev'), 'true');
  } else {
    localStorage.removeItem(cleUser('ms_mode_dev'));
  }
  if (document.getElementById('ecran-historique').classList.contains('actif')) {
    chargerHistorique();
  }
}

function sauverProfil() {
  const prenom = document.getElementById('inp-profil-prenom').value.trim();
  patchUserLocal({ prenom: prenom || null });
  const el = document.getElementById('message-bonjour');
  if (el) el.textContent = messageBonjourComplet();
  afficherZone('profil-sauve');
  setTimeout(() => masquerZone('profil-sauve'), 2000);
  _invaliderEtRechargerCacheUrgence(); // le prénom a changé → les textes TTS aussi
}

// ════════════════════════════════════════════════════════
// ── Connexion (téléphone seul) ─────────────────────────
// ════════════════════════════════════════════════════════
async function seConnecter() {
  const telephone = document.getElementById('inp-tel').value.trim();
  const erreur    = document.getElementById('inscription-erreur');
  const btn       = document.getElementById('btn-continuer');
  erreur.classList.remove('visible');
  if (!telephone) return afficherErreur(erreur, 'Veuillez entrer votre numéro de téléphone.');
  btn.disabled = true;
  const texteOrig = btn.textContent;
  btn.textContent = t('connexion_en_cours');
  try {
    const r = await fetch('/api/auth/connexion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone })
    });
    const data = await r.json();
    if (r.status === 429) { afficherErreur(erreur, data.erreur || 'Trop de tentatives. Attendez une minute.'); return; }
    if (!r.ok) { afficherErreur(erreur, data.erreur || 'Erreur de connexion.'); return; }
    // Le serveur envoie toujours un code SMS (même pour les utilisateurs existants).
    // Cela empêche tout accès au compte par simple connaissance du numéro de téléphone.
    localStorage.setItem('ms_verif_token', data.token);
    localStorage.setItem('ms_verif_tel', telephone);
    afficherEcranVerification(data.dev_code);
  } catch {
    afficherErreur(erreur, 'Impossible de se connecter. Vérifiez votre connexion.');
  } finally {
    btn.disabled = false;
    btn.textContent = texteOrig;
  }
}

function afficherEcranVerification(devCode) {
  const banniere    = document.getElementById('dev-code-affiche');
  const instruction = document.getElementById('instruction-code');
  if (devCode) {
    banniere.innerHTML = `Mode test — votre code est :<strong>${devCode}</strong>`;
    banniere.classList.add('visible');
    instruction.innerHTML = t('instruction_dev').replace(/\n/g, '<br>');
  } else {
    banniere.classList.remove('visible');
    instruction.innerHTML = t('instruction_sms').replace(/\n/g, '<br>');
  }
  document.getElementById('inp-code').value = '';
  allerA('ecran-verification');
}

async function verifierCode() {
  const code   = document.getElementById('inp-code').value.trim();
  const erreur = document.getElementById('verification-erreur');
  const tel    = localStorage.getItem('ms_verif_tel') || '';
  const token  = localStorage.getItem('ms_verif_token') || '';
  erreur.classList.remove('visible');
  if (code.length !== 4) return afficherErreur(erreur, 'Le code fait 4 chiffres.');
  try {
    const r = await fetch('/api/auth/verifier-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone: tel, code, token })
    });
    const data = await r.json();
    if (!r.ok) { afficherErreur(erreur, data.erreur || 'Code incorrect.'); return; }
    sauverSession({ telephone: data.user.telephone, token: data.session });
    sauverUserLocal(data.user);
    localStorage.removeItem('ms_verif_token');
    localStorage.removeItem('ms_verif_tel');
    demarrerApp();
  } catch {
    afficherErreur(erreur, 'Impossible de vérifier le code. Réessayez.');
  }
}

async function renvoyerCode() {
  const tel = localStorage.getItem('ms_verif_tel') || '';
  if (!tel) return allerA('ecran-inscription');
  try {
    const r = await fetch('/api/auth/envoyer-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telephone: tel })
    });
    const data = await r.json();
    if (r.status === 429) {
      const errEl = document.getElementById('verification-erreur');
      if (errEl) afficherErreur(errEl, data.erreur || 'Trop de tentatives. Attendez une minute.');
      return;
    }
    if (r.ok && data.token) {
      localStorage.setItem('ms_verif_token', data.token);
      afficherEcranVerification(data.dev_code);
    }
  } catch { /* silencieux */ }
}

// ── Sous-titres dynamiques accueil ────────────────────────────────────────
function mettreAJourResume() {
  // ── Sous-titre bouton Ma glycémie ──────────────────
  const sousGlyc  = document.getElementById('sous-glycemie');
  const histoGlyc = getHistorique().filter(e => e.type === 'glycemie');
  if (sousGlyc) {
    if (histoGlyc.length > 0) {
      const derniere = histoGlyc[0];
      const d        = new Date(derniere.date);
      const diffMs   = Date.now() - d;
      const diffMin  = Math.floor(diffMs / 60000);
      const diffH    = Math.floor(diffMs / 3600000);
      let quand;
      if (diffMin < 2)       quand = t('a_instant');
      else if (diffMin < 60) quand = t('il_y_a_min')(diffMin);
      else if (diffH < 24)   quand = t('il_y_a_h')(diffH);
      else                   quand = d.toLocaleDateString(t('locale_date'), { day: 'numeric', month: 'long' });
      sousGlyc.textContent = t('glycemie_derniere')(derniere.valeur, quand);
    } else {
      sousGlyc.textContent = t('glycemie_sous_defaut');
    }
  }

  // ── Sous-titre bouton Mes médicaments ──────────────
  const sousMeds = document.getElementById('sous-meds');
  if (sousMeds) {
    const meds     = getMedicaments().filter(m => !m.desactive);
    const restants = meds.filter(m => estDuAujourdhui(m) && !m.pris).length;
    const total    = meds.filter(m => estDuAujourdhui(m)).length;
    if (total === 0) {
      sousMeds.textContent = t('meds_sous_defaut');
    } else if (restants === 0) {
      sousMeds.textContent = t('meds_tous_pris');
    } else {
      sousMeds.textContent = t('meds_restants')(restants);
    }
  }
}

function entrerDansAccueil() {
  appliquerModeHeure();
  appliquerTraductions();
  const el = document.getElementById('message-bonjour');
  if (el) el.textContent = messageBonjourComplet();
  allerA('ecran-accueil');
  chargerMedicaments();
  mettreAJourBoutonsAppel();
  afficherQuestionBienEtre();
  mettreAJourResume();
  _preparerSalutationVocale();
  // Pré-fetche les clips urgence en arrière-plan (lecture instantanée quand besoin)
  setTimeout(() => _prefetcherAudiosUrgence(), 3000); // laisse 3s pour que la salutation vocale parte en premier
}

// Vérifie si l'onboarding a été complété avant d'entrer dans l'accueil.
// Lance la session normale (accueil + notifs + meds).
// Utilisé par demarrerApp() (après onboarding) ET par obTerminer().
function _lancerSession() {
  entrerDansAccueil();
  demanderPermissionNotifications();
  verifierMedsOublies();
  if (!_intervalMeds) _intervalMeds = setInterval(verifierMedsOublies, 15 * 60 * 1000);
  getMedicaments().forEach(planifierNotification);
  hydraterDepuisServeur().then(u => {
    if (u) { mettreAJourBoutonsAppel(); chargerMedicaments(); mettreAJourResume(); }
  });
}

// À utiliser après chaque connexion / vérification de code.
function demarrerApp() {
  // 1. Flag local présent → déjà fait sur cet appareil
  if (localStorage.getItem(cleUser('ms_onboarding_done')) === 'true') {
    _lancerSession();
    return;
  }
  // 2. Utilisateur existant (données sur le serveur) → skip onboarding et marquer fait
  const user = getUserLocal();
  const estExistant = user && (
    user.prenom ||
    (user.medicaments  && user.medicaments.length  > 0) ||
    (user.historique_repas && user.historique_repas.length > 0) ||
    user.proche
  );
  if (estExistant) {
    localStorage.setItem(cleUser('ms_onboarding_done'), 'true');
    _lancerSession();
    return;
  }
  // 3. Vraiment nouvel utilisateur → onboarding aidant
  obAfficherEtape(1);
  allerA('ecran-onboarding');
}

// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
// ── Gestionnaire audio global (une seule voix à la fois) ─
// ════════════════════════════════════════════════════════
let _audioGlobal = null; // { src, ctx }
let _intervalMeds = null; // setInterval unique pour verifierMedsOublies

function _stopperAudioGlobal() {
  _cacherLoadingTTS(); // annule l'indicateur si la voix est interrompue
  if (_audioGlobal) {
    try { _audioGlobal.src.stop(); } catch(_) {}
    try { _audioGlobal.ctx.close(); } catch(_) {}
    _audioGlobal = null;
  }
  // Stoppe aussi le fallback Web Speech si actif
  try { window.speechSynthesis?.cancel(); } catch(_) {}
}

// ── Indicateur de chargement TTS (rassure les seniors pendant le fetch) ──
function _afficherLoadingTTS() {
  const el = document.getElementById('tts-loading');
  if (!el) return;
  el.style.display = 'flex';
  el.offsetHeight; // force reflow pour déclencher la transition CSS
  el.style.opacity = '1';
}
function _cacherLoadingTTS() {
  const el = document.getElementById('tts-loading');
  if (!el || el.style.display === 'none') return;
  el.style.opacity = '0';
  setTimeout(() => { if (el.style.opacity !== '1') el.style.display = 'none'; }, 300);
}

function getTTSProvider() {
  return localStorage.getItem('ms_tts_provider') || 'elevenlabs';
}
function setTTSProvider(p) {
  localStorage.setItem('ms_tts_provider', p);
}

async function _jouerTexteVocal(texte, onFin) {
  _stopperAudioGlobal(); // coupe tout audio en cours
  _afficherLoadingTTS(); // rassure les seniors pendant le fetch ElevenLabs

  let audioCtx;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
  } catch(e) {
    console.error('[audio] AudioContext échec:', e);
    _cacherLoadingTTS();
    _parlerSalutationFallback(texte); onFin?.(); return;
  }

  try {
    const resp = await fetch('/api/salutation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ texte, provider: getTTSProvider() })
    });
    if (!resp.ok) {
      const errBody = await resp.json().catch(() => ({}));
      console.error('[audio] API salutation erreur', resp.status, errBody);
      throw new Error('api-' + resp.status);
    }
    const ab  = await resp.arrayBuffer();
    const buf = await audioCtx.decodeAudioData(ab);
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const gain = audioCtx.createGain();
    gain.gain.value = 1.8;
    src.connect(gain);
    gain.connect(audioCtx.destination);
    src.onended = () => {
      try { audioCtx.close(); } catch(_) {}
      _audioGlobal = null;
      onFin?.();
    };
    _audioGlobal = { src, ctx: audioCtx };
    _cacherLoadingTTS(); // la voix est prête — on masque l'indicateur
    src.start(0);
  } catch(e) {
    console.error('[audio] Échec TTS, fallback Web Speech:', e.message);
    _cacherLoadingTTS();
    try { audioCtx.close(); } catch(_) {}
    _parlerSalutationFallback(texte);
    onFin?.();
  }
}

// ── Salutation vocale ─────────────────────────────────
// ════════════════════════════════════════════════════════
let _salutationDeclenchee = false;
let _salutationEnAttente  = false;
let _callbackApresVoix    = null;

// UX-F5 : timeout automatique si le senior ne tape pas dans les 25s
let _splashTimeoutId = null;
function _armerTimeoutSplash() {
  _splashTimeoutId = setTimeout(() => {
    // Passe directement à l'accueil sans audio
    const splash = document.getElementById('splash-vocal');
    if (splash && splash.style.display !== 'none') {
      splash.style.opacity = '0';
      setTimeout(() => { splash.style.display = 'none'; }, 200);
      _finSalutation();
    }
  }, 25000);
}
function _annulerTimeoutSplash() {
  if (_splashTimeoutId) { clearTimeout(_splashTimeoutId); _splashTimeoutId = null; }
}

function _preparerSalutationVocale() {
  const today = new Date().toDateString();
  const voixNecessaire = estModeDevActif() || localStorage.getItem(cleUser('ms_voix_date')) !== today;

  if (!voixNecessaire) {
    _salutationEnAttente = false;
    return;
  }

  _salutationEnAttente  = true;
  _salutationDeclenchee = false;

  // Affiche le splash plein écran avec "Appuyez pour commencer"
  const splash = document.getElementById('splash-vocal');
  const sousEl = document.getElementById('splash-bonjour');
  if (sousEl) sousEl.textContent = messageBonjourComplet();
  if (splash) {
    splash.style.display = 'flex';
    _armerTimeoutSplash(); // UX-F5 : passe automatiquement à l'accueil après 25s
  }
}

function demarrerDepuisSplash() {
  if (_salutationDeclenchee) return;
  _salutationDeclenchee = true;
  _annulerTimeoutSplash(); // UX-F5 : annule le timeout automatique puisque le senior a tapé

  // Pré-fetch l'audio PENDANT que le splash disparaît (gain ~400ms)
  const texte = _texteeSalutation();
  const audioPromise = _prefetchAudio(texte);

  // Ferme le splash (animation 200ms réduite)
  const splash = document.getElementById('splash-vocal');
  if (splash) {
    splash.style.transition = 'opacity 0.15s ease';
    splash.style.opacity = '0';
    setTimeout(() => { splash.style.display = 'none'; }, 150);
  }

  // Joue dès que le fetch est prêt (sans re-fetcher)
  audioPromise.then(ab => _jouerDepuisBuffer(ab, texte, _finSalutation));
}

// Pré-télécharge l'audio et retourne l'ArrayBuffer (ou null en cas d'erreur)
async function _prefetchAudio(texte) {
  try {
    const resp = await fetch('/api/salutation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ texte, provider: getTTSProvider() })
    });
    if (!resp.ok) throw new Error('api-' + resp.status);
    return await resp.arrayBuffer();
  } catch(e) {
    console.error('[audio] prefetch erreur:', e.message);
    return null;
  }
}

// Joue un ArrayBuffer déjà téléchargé (évite le double fetch)
async function _jouerDepuisBuffer(ab, texteFallback, onFin) {
  if (!ab) {
    // Fallback Web Speech si le fetch a échoué
    _cacherLoadingTTS();
    _parlerSalutationFallback(texteFallback);
    onFin?.();
    return;
  }
  _stopperAudioGlobal();
  let audioCtx;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
  } catch(e) {
    _parlerSalutationFallback(texteFallback); onFin?.(); return;
  }
  try {
    const buf = await audioCtx.decodeAudioData(ab);
    const src = audioCtx.createBufferSource();
    src.buffer = buf;
    const gain = audioCtx.createGain();
    gain.gain.value = 1.8;
    src.connect(gain);
    gain.connect(audioCtx.destination);
    src.onended = () => {
      try { audioCtx.close(); } catch(_) {}
      _audioGlobal = null;
      onFin?.();
    };
    _audioGlobal = { src, ctx: audioCtx };
    src.start(0);
  } catch(e) {
    try { audioCtx.close(); } catch(_) {}
    _parlerSalutationFallback(texteFallback);
    onFin?.();
  }
}

// Nom de la voix annoncé dans le message TTS.
// ⚠️  À synchroniser avec ELEVEN_VOICE_ID dans api/salutation.js :
//   Matilda (gratuit)  → VOIX_NOM = 'Matilda'
//   Marie-Alice (payant) → VOIX_NOM = 'Marie-Alice'
const VOIX_NOM = 'Matilda';

function _texteeSalutation() {
  const prenom = getPrenom() || '';
  const h = new Date().getHours();
  if (h >= 5 && h < 12) return t('salut_matin')(prenom, VOIX_NOM);
  if (h >= 12 && h < 18) return t('salut_midi')(prenom, VOIX_NOM);
  return t('salut_soir')(prenom, VOIX_NOM);
}

async function _parlerSalutation(texteOverride) {
  const texte = texteOverride || _texteeSalutation();
  await _jouerTexteVocal(texte, () => {
    // onFin : marquer le jour + déclencher bien-être
    _finSalutation();
  });
}

function _finSalutation() {
  localStorage.setItem(cleUser('ms_voix_date'), new Date().toDateString());
  _salutationEnAttente = false;
  if (_callbackApresVoix) { _callbackApresVoix(); _callbackApresVoix = null; }
}

function _parlerSalutationFallback(texte) {
  const synth = window.speechSynthesis;
  if (!synth) { _finSalutation(); return; }
  synth.cancel();
  const u = new SpeechSynthesisUtterance(texte);
  u.lang = 'fr-FR'; u.rate = 0.88; u.pitch = 1.1; u.volume = 1;
  const voix = synth.getVoices().filter(v => v.lang.startsWith('fr'));
  const choisie = voix.find(v => !/thomas|nicolas|pierre/i.test(v.name)) || voix[0];
  if (choisie) u.voice = choisie;
  u.onend  = () => _finSalutation();
  u.onerror = () => _finSalutation();
  synth.speak(u);
}

// Bouton test DEV
function testerVoix() {
  _parlerSalutation('Test voix. Bonjour ! Je suis Mon Sucre, votre assistant santé.');
}

function afficherErreur(el, msg) {
  el.textContent = msg;
  el.classList.add('visible');
}

// ════════════════════════════════════════════════════════
// ── Messages contextuels selon l'heure ────────────────
// ════════════════════════════════════════════════════════
function messageBonjourComplet() {
  const h   = new Date().getHours();
  const nom = getPrenom() ? `, ${getPrenom()}` : '';

  if (h >= 5  && h < 12) return t('g_matin')(nom);
  if (h >= 12 && h < 14) return t('g_appetit')(nom);
  if (h >= 14 && h < 17) return t('g_aprem')(nom);
  if (h >= 17 && h < 20) return t('g_soir')(nom);
  if (h >= 20)           return t('g_soir')(nom);
  return t('g_nuit')(nom);
}

// ════════════════════════════════════════════════════════
// ── Couleur du header selon l'heure ───────────────────
// ════════════════════════════════════════════════════════
const PERIODES_HEURE = ['heure-nuit','heure-aube','heure-matin','heure-midi','heure-aprem','heure-soir','heure-crepuscule'];

function appliquerModeHeure() {
  const h = new Date().getHours();
  const modeNuit = localStorage.getItem('ms_mode_nuit') !== 'off';

  // force-light sur <html> : annule le dark mode système quand nuit désactivée
  if (modeNuit) {
    document.documentElement.classList.remove('force-light');
  } else {
    document.documentElement.classList.add('force-light');
  }

  // Applique / retire la classe mode-nuit explicitement (évite les bugs iOS avec toggle+force)
  if (modeNuit && (h < 6 || h >= 21)) {
    document.body.classList.add('mode-nuit-heure');
  } else {
    document.body.classList.remove('mode-nuit-heure');
  }

  // Classe colorée selon la plage horaire
  // Si mode nuit désactivé, on force 'heure-matin' (bleu clair) la nuit pour
  // que le header soit clairement différent du mode nuit
  let periode;
  if      (h >= 21 || h <  5)  periode = modeNuit ? 'heure-nuit' : 'heure-matin';
  else if (h >= 5  && h <  8)  periode = 'heure-aube';
  else if (h >= 8  && h < 12)  periode = 'heure-matin';
  else if (h >= 12 && h < 14)  periode = 'heure-midi';
  else if (h >= 14 && h < 18)  periode = 'heure-aprem';
  else if (h >= 18 && h < 20)  periode = 'heure-soir';
  else                          periode = modeNuit ? 'heure-crepuscule' : 'heure-soir';

  PERIODES_HEURE.forEach(p => document.body.classList.remove(p));
  document.body.classList.add(periode);
}

function basculerModeNuit(event) {
  // Empêche le label de toggler le checkbox nativement (on le fait manuellement)
  if (event) event.preventDefault();
  // Lit l'état ACTUEL depuis localStorage (source de vérité, pas le DOM)
  const estActif = localStorage.getItem('ms_mode_nuit') !== 'off';
  const nouveau   = !estActif;  // on inverse
  localStorage.setItem('ms_mode_nuit', nouveau ? 'auto' : 'off');
  // Met à jour visuellement le checkbox
  const checkbox = document.getElementById('toggle-mode-nuit');
  if (checkbox) checkbox.checked = nouveau;
  appliquerModeHeure();
  const label = document.getElementById('mode-nuit-label');
  if (label) label.setAttribute('data-i18n', nouveau ? 'mode_nuit_label_auto' : 'mode_nuit_label_off');
  appliquerTraductions();
}

// ════════════════════════════════════════════════════════
// ── Question bien-être quotidienne ────────────────────
// ════════════════════════════════════════════════════════
const QUESTIONS_BIENETRE = [
  { q: 'Comment vous sentez-vous en ce moment ?', e: '💛' },
  { q: 'Avez-vous bien dormi cette nuit ?',        e: '🌙' },
  { q: 'Êtes-vous de bonne humeur aujourd\'hui ?', e: '😊' },
  { q: 'Vous sentez-vous en forme ce matin ?',     e: '🌅' },
  { q: 'Avez-vous mangé quelque chose de bon ?',   e: '🍳' },
  { q: 'Êtes-vous au chaud et confortable ?',      e: '🏠' },
  { q: 'Avez-vous bu assez d\'eau aujourd\'hui ?', e: '💧' },
  { q: 'Avez-vous eu de bonnes nouvelles aujourd\'hui ?', e: '📬' },
  { q: 'Faites-vous quelque chose d\'agréable ?',  e: '🌸' },
  { q: 'Avez-vous parlé à quelqu\'un de cher ?',   e: '💬' },
  { q: 'Vous sentez-vous calme et serein(e) ?',    e: '🍃' },
  { q: 'Avez-vous pris le temps de vous reposer ?',e: '☕' },
  { q: 'La journée se passe bien pour vous ?',     e: '🌈' },
  { q: 'Avez-vous souri aujourd\'hui ?',           e: '😄' },
  { q: 'Êtes-vous bien entouré(e) ?',              e: '🤗' },
  { q: 'Vous sentez-vous d\'attaque pour la journée ?', e: '⚡' },
  { q: 'Avez-vous fait une petite promenade ?',    e: '🌿' },
  { q: 'La météo est agréable pour vous aujourd\'hui ?', e: '☀️' },
  { q: 'Avez-vous quelque chose de sympa prévu ?', e: '🎉' },
  { q: 'Prenez-vous bien soin de vous ?',          e: '💖' },
];

const REPONSES_OUI = [
  'Quelle belle nouvelle, ça me réjouit ! 🌟',
  'Super ! Profitez bien de cette belle journée 🌈',
  'Fantastique ! Continuez comme ça 💪',
  'Voilà qui fait chaud au cœur ! ☀️',
  'Merveilleux ! Vous méritez ça 🌸',
];
const REPONSES_NON = [
  'Merci de me le dire… Prenez bien soin de vous 💙',
  'Je suis là avec vous. N\'hésitez pas à appeler un proche 🤗',
  'Ça ira mieux bientôt. Courage ! 💛',
  'Soyez doux(ce) avec vous-même aujourd\'hui 🍃',
  'Pensez à vous reposer. Je veille sur vous 💜',
];

function questionDuJour() {
  const questions = t('questions_bienetre') || QUESTIONS_BIENETRE;
  const d   = new Date();
  const idx = (d.getFullYear() * 366 + d.getMonth() * 31 + d.getDate()) % questions.length;
  return questions[idx];
}

function afficherQuestionBienEtre() {
  const carte = document.getElementById('carte-bienetre');
  if (!carte) return;

  // Vérifie si déjà répondu aujourd'hui
  const today    = new Date().toDateString();
  const dejaDone = localStorage.getItem(cleUser('ms_bienetre_date')) === today;
  if (dejaDone && !estModeDevActif()) { carte.style.display = 'none'; return; }

  // Si la salutation vocale est prévue, on attend qu'elle finisse
  if (_salutationEnAttente) {
    _callbackApresVoix = () => afficherQuestionBienEtre();
    carte.style.display = 'none';
    return;
  }

  const { q, e } = questionDuJour();
  const el = document.getElementById('bienetre-question');
  if (el) el.innerHTML = `<span class="bienetre-emoji">${e}</span>${q}`;

  carte.style.display = 'block';
  carte.classList.remove('bienetre-visible');
  requestAnimationFrame(() => requestAnimationFrame(() => carte.classList.add('bienetre-visible')));
}

async function repondreBienEtre(reponse) {
  const today = new Date().toDateString();
  localStorage.setItem(cleUser('ms_bienetre_date'), today);

  // Affiche la réponse chaleureuse + la dit à voix haute
  const btns   = document.getElementById('bienetre-btns');
  const merci  = document.getElementById('bienetre-merci');
  if (btns)  btns.style.display  = 'none';
  const pool = reponse === 'ok'
    ? (t('reponses_oui') || REPONSES_OUI)
    : (t('reponses_non') || REPONSES_NON);
  const texteReponse = pool[Math.floor(Math.random() * pool.length)];
  if (merci) {
    merci.textContent = texteReponse;
    merci.style.display = 'block';
  }
  // Voix — on retire les emojis pour un rendu plus naturel
  _jouerTexteVocal(texteReponse.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim());

  // Envoie au serveur (silencieux en cas d'erreur)
  try {
    const { q } = questionDuJour();
    await fetch('/api/bien-etre', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ reponse, question: q })
    });
  } catch { /* silencieux */ }

  // Ferme la carte après 2,5s
  setTimeout(() => {
    const carte = document.getElementById('carte-bienetre');
    if (carte) carte.classList.remove('bienetre-visible');
    setTimeout(() => { if (carte) carte.style.display = 'none'; }, 350);
  }, 2500);
}

// ════════════════════════════════════════════════════════
// ── Boutons appel urgence (accueil) ───────────────────
// ════════════════════════════════════════════════════════
function mettreAJourBoutonsAppel() {
  const user    = getUserLocal();
  const proche  = user?.proche;
  const proche2 = user?.proche2;
  const label1    = document.getElementById('label-proche1');
  const label2    = document.getElementById('label-proche2');
  const sublabel1 = document.getElementById('sublabel-proche1');
  const sublabel2 = document.getElementById('sublabel-proche2');
  const btn1 = document.getElementById('btn-appel-proche1');
  const btn2 = document.getElementById('btn-appel-proche2');

  if (label1) label1.textContent    = proche?.prenom || '—';
  if (sublabel1) sublabel1.textContent = proche ? (proche.telephone || 'Proche 1') : 'Non configuré';
  if (btn1) btn1.classList.toggle('non-configure', !proche?.telephone);

  if (label2) label2.textContent    = proche2?.prenom || '—';
  if (sublabel2) sublabel2.textContent = proche2 ? (proche2.telephone || 'Proche 2') : 'Non configuré';
  if (btn2) btn2.classList.toggle('non-configure', !proche2?.telephone);
}

// ════════════════════════════════════════════════════════
// ── Cache audio urgences (pré-fetchés en arrière-plan) ─
// Évite la latence ElevenLabs au moment critique d'une urgence.
// ════════════════════════════════════════════════════════
const _cacheAudioUrgence = { '112': null, '1733': null, 'urgence': null };

function _texte112() {
  return t('urgence_vocal_112')(getPrenom());
}

function _texte1733() {
  return t('urgence_vocal_1733')(getPrenom());
}

// Pré-fetche les 3 clips en parallèle en arrière-plan.
// Appelé à l'entrée de l'accueil et après chaque changement de profil/proche.
async function _prefetcherAudiosUrgence() {
  const clefs = [
    { key: '112',     texte: _texte112()     },
    { key: '1733',    texte: _texte1733()    },
    { key: 'urgence', texte: _texteUrgence() },
  ];
  // Lance les 3 fetches en parallèle (sans bloquer l'UI)
  await Promise.allSettled(clefs.map(async ({ key, texte }) => {
    // Ne re-fetche que si le texte a changé (prenom ou proche mis à jour)
    if (_cacheAudioUrgence[key]?.texte === texte) return;
    _cacheAudioUrgence[key] = null; // invalide pendant le fetch
    const ab = await _prefetchAudio(texte);
    if (ab) _cacheAudioUrgence[key] = { ab, texte };
  }));
}

// Invalide le cache (ex: après changement prenom / proche)
// et relance le pré-fetch en arrière-plan.
function _invaliderEtRechargerCacheUrgence() {
  _cacheAudioUrgence['112']     = null;
  _cacheAudioUrgence['1733']    = null;
  _cacheAudioUrgence['urgence'] = null;
  _prefetcherAudiosUrgence(); // recharge sans await (arrière-plan)
}

// Joue un clip urgence depuis le cache si disponible, sinon fetch à la volée.
async function _jouerAudioUrgence(key, texteFn) {
  _stopperAudioGlobal();
  const entree = _cacheAudioUrgence[key];
  if (entree?.ab) {
    // Lecture instantanée depuis le cache mémoire
    await _jouerDepuisBuffer(entree.ab, entree.texte, null);
  } else {
    // Pas encore en cache : fetch à la volée — on montre l'indicateur
    _afficherLoadingTTS();
    const texte = texteFn();
    const ab    = await _prefetchAudio(texte);
    // Stocke pour la prochaine fois
    if (ab) _cacheAudioUrgence[key] = { ab, texte };
    await _jouerDepuisBuffer(ab, texte, null);
  }
}

// ── Confirmation vocale 112 ───────────────────────────
async function confirmerAppel112() {
  const modal = document.getElementById('modal-112');
  if (modal) { modal.style.display = 'flex'; }
  await _jouerAudioUrgence('112', _texte112);
}

function lancerAppel112() {
  _stopperAudioGlobal();
  fermerModal112();
  window.location.href = 'tel:112';
}

function fermerModal112(evt) {
  if (evt && evt.target !== document.getElementById('modal-112')) return;
  _stopperAudioGlobal();
  const modal = document.getElementById('modal-112');
  if (modal) modal.style.display = 'none';
}

// ── Confirmation vocale 1733 ──────────────────────────
async function confirmerAppel1733() {
  const modal = document.getElementById('modal-1733');
  if (modal) modal.style.display = 'flex';
  await _jouerAudioUrgence('1733', _texte1733);
}

function lancerAppel1733() {
  _stopperAudioGlobal();
  fermerModal1733();
  window.location.href = 'tel:1733';
}

function fermerModal1733(evt) {
  if (evt && evt.target !== document.getElementById('modal-1733')) return;
  _stopperAudioGlobal();
  const modal = document.getElementById('modal-1733');
  if (modal) modal.style.display = 'none';
}

// ── Appel proches ─────────────────────────────────────
function appelerProche(numero) {
  const user   = getUserLocal();
  const proche = numero === 1 ? user?.proche : user?.proche2;
  if (!proche?.telephone) {
    alert(`Proche ${numero} non configuré.\nAllez dans ⚙️ Paramètres pour l'ajouter.`);
    return;
  }
  const nom = proche.prenom ? `${proche.prenom} (${proche.telephone})` : proche.telephone;
  if (!confirm(`Appeler ${nom} ?`)) return;
  window.location.href = `tel:${proche.telephone}`;
}

// ════════════════════════════════════════════════════════
// ── Photo repas ────────────────────────────────────────
// ════════════════════════════════════════════════════════
function ouvrirPhoto() { document.getElementById('input-photo').click(); }

async function analyserPhoto(input) {
  if (!input.files || !input.files[0]) return;
  const fichier   = input.files[0];
  const base64    = await lireEnBase64(fichier);
  afficherZone('zone-analyse');
  masquerZone('zone-voix');
  masquerZone('zone-conseil');
  const thumbnail = await genererThumbnail(base64, fichier.type);
  try {
    const res  = await fetch('/api/analyser-repas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ image: base64, type: fichier.type })
    });
    const data = await res.json();
    if (data.est_nourriture === false) {
      masquerZone('zone-analyse');
      document.getElementById('texte-conseil').textContent = data.conseil;
      afficherZone('zone-conseil');
      input.value = '';
      return; // pas d'enregistrement
    }
    afficherConseil(data.conseil, '', 'photo', data.analyse, thumbnail);
  } catch {
    afficherConseil("Je n'arrive pas à analyser la photo. Essayez de décrire votre repas à voix haute.", '', 'photo', null, null);
  }
  input.value = '';
}

// Thumbnail : max 240px, JPEG 65%
function genererThumbnail(base64, mimeType) {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const MAX   = 240;
      const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
      const w = Math.round(img.width  * ratio);
      const h = Math.round(img.height * ratio);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.65));
    };
    img.onerror = () => resolve(null);
    img.src = `data:${mimeType || 'image/jpeg'};base64,${base64}`;
  });
}

function lireEnBase64(fichier) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(fichier);
  });
}

// ════════════════════════════════════════════════════════
// ── Voix ───────────────────────────────────────────────
// ════════════════════════════════════════════════════════
let reconnaissance = null;

function commencerVoix() {
  afficherZone('zone-voix');
  masquerZone('zone-analyse');
  masquerZone('zone-conseil');
  document.getElementById('texte-reconnu').textContent = '';
  document.getElementById('btn-envoyer-repas').style.display = 'none';
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    document.getElementById('texte-reconnu').textContent = "La reconnaissance vocale n'est pas disponible sur ce navigateur.";
    return;
  }
  reconnaissance = new SpeechRecognition();
  reconnaissance.lang = 'fr-FR';
  reconnaissance.interimResults = true;
  reconnaissance.continuous = false;
  reconnaissance.onresult = (event) => {
    let texte = '';
    for (let i = event.resultIndex; i < event.results.length; i++) texte += event.results[i][0].transcript;
    document.getElementById('texte-reconnu').textContent = texte;
    if (event.results[event.results.length - 1].isFinal) document.getElementById('btn-envoyer-repas').style.display = 'block';
  };
  reconnaissance.onerror = () => {
    document.getElementById('texte-reconnu').textContent = "Je n'ai pas entendu. Appuyez à nouveau et parlez clairement.";
  };
  reconnaissance.start();
}

async function envoyerRepas() {
  const texte = document.getElementById('texte-reconnu').textContent;
  if (!texte) return;
  afficherZone('zone-analyse');
  masquerZone('zone-voix');
  masquerZone('zone-conseil');
  try {
    const res  = await fetch('/api/analyser-repas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ texte })
    });
    const data = await res.json();
    afficherConseil(data.conseil, texte, 'vocal', data.analyse, null);
  } catch {
    afficherConseil('Votre repas a bien été noté. Continuez à bien manger !', '', 'vocal', null, null);
  }
}

function fermerConseil() {
  masquerZone('zone-conseil');
  masquerZone('zone-analyse');
  const igZone = document.getElementById('repas-ig-zone');
  if (igZone) igZone.style.display = 'none';
}

function afficherConseil(texte, description, type, analyse, thumbnail) {
  masquerZone('zone-analyse');
  document.getElementById('texte-conseil').textContent = texte;

  // ── Index glycémique du repas ─────────────────────────
  const igZone = document.getElementById('repas-ig-zone');
  if (igZone) {
    const igMap = {
      bas:    { label: 'Bas',    emoji: '🟢', cls: 'ig-bas',    desc: 'Bonne tolérance glycémique' },
      modere: { label: 'Modéré', emoji: '🟡', cls: 'ig-modere', desc: 'À consommer avec modération' },
      eleve:  { label: 'Élevé',  emoji: '🔴', cls: 'ig-eleve',  desc: 'Impact glycémique important' }
    };
    const idMap = {
      ok:        '✅ OK pour les diabétiques',
      attention: '⚠️ Attention, à doser',
      eviter:    '🚫 À éviter si possible'
    };
    const ig = analyse?.index_glycemique ? igMap[analyse.index_glycemique] : null;
    const id = analyse?.indice_diabete   ? idMap[analyse.indice_diabete]   : null;

    if (ig) {
      igZone.style.display = '';
      igZone.innerHTML = `
        <div class="repas-ig-carte">
          <div class="repas-ig-titre">Index glycémique</div>
          <div class="repas-ig-ligne">
            <span class="ig-badge ${ig.cls}" style="font-size:16px;padding:6px 16px">${ig.emoji} ${ig.label}</span>
            <span class="repas-ig-desc">${ig.desc}</span>
          </div>
          ${id ? `<div class="repas-ig-diabete">${id}</div>` : ''}
          ${analyse.remarque_diabete ? `<div class="repas-ig-remarque">💡 ${esc(analyse.remarque_diabete)}</div>` : ''}
        </div>`;
    } else {
      igZone.style.display = 'none';
    }
  }

  afficherZone('zone-conseil');
  sauverRepas(description, texte, type, analyse, thumbnail);
}

// ════════════════════════════════════════════════════════
// ── Glycémie saisie directe (carte dans écran repas) ───
// ════════════════════════════════════════════════════════
function indicateurGlycTexte(val) {
  if (isNaN(val))  return { texte: '', cls: '' };
  if (val < 70)    return { texte: t('ind_hypo'),       cls: 'glyc-ind-bas' };
  if (val <= 126)  return { texte: t('ind_normal'),     cls: 'glyc-ind-ok' };
  if (val <= 180)  return { texte: t('ind_eleve'),      cls: 'glyc-ind-elevee' };
  return               { texte: t('ind_tres_eleve'), cls: 'glyc-ind-tres-elevee' };
}

function mettreAJourIndicateurGlycRepas() {
  const val = parseFloat(document.getElementById('inp-glycemie-repas')?.value);
  const ind = document.getElementById('glyc-repas-indicateur');
  if (!ind) return;
  const { texte, cls } = indicateurGlycTexte(val);
  ind.textContent = texte;
  ind.className   = 'glycemie-indicateur' + (cls ? ' ' + cls : '');
  ind.style.minHeight = texte ? '' : '0';
  ind.style.padding   = texte ? '' : '0';
}

// ════════════════════════════════════════════════════════
// ── Rappel glycémie avant repas ────────────────────────
// ════════════════════════════════════════════════════════
function _slotRepas() {
  const h = new Date().getHours();
  if (h >= 5  && h < 12) return 'matin';
  if (h >= 12 && h < 17) return 'midi';
  if (h >= 17 && h < 23) return 'soir';
  return null; // nuit : pas de rappel
}

function _glycEnregistreeAujourdhui(slot) {
  const aujourd = new Date().toDateString();
  return getHistorique().some(e => {
    if (e.type !== 'glycemie') return false;
    const d = new Date(e.date);
    if (d.toDateString() !== aujourd) return false;
    const h = d.getHours();
    if (slot === 'matin') return h >= 5  && h < 12;
    if (slot === 'midi')  return h >= 12 && h < 17;
    if (slot === 'soir')  return h >= 17 && h < 23;
    return false;
  });
}

function verifierRappelGlyc() {
  const slot = _slotRepas();
  if (!slot) return; // nuit → pas de rappel

  if (_glycEnregistreeAujourdhui(slot)) return; // déjà mesurée → silence

  // Labels pour le moment
  const labels = { matin: 'ce matin', midi: 'ce midi', soir: 'ce soir' };
  const label  = labels[slot];

  // Notification push (via Service Worker) si les notifs sont autorisées
  if (navigator.serviceWorker?.controller && Notification.permission === 'granted') {
    navigator.serviceWorker.controller.postMessage({
      type:  'SHOW_NOTIF',
      titre: '🩸 Glycémie non mesurée',
      corps: `Pensez à mesurer votre glycémie ${label} avant le repas.`,
      tag:   `glyc-rappel-${slot}`
    });
  }
}

function sauverGlycemieRepas() {
  const valeur = parseInt(document.getElementById('inp-glycemie-repas')?.value, 10);
  if (isNaN(valeur) || valeur < 20 || valeur > 600) {
    alert('Valeur invalide. Entrez une valeur entre 20 et 600 mg/dL.');
    return;
  }
  const historique = getHistorique();
  historique.unshift({
    id:     Date.now(),
    date:   new Date().toISOString(),
    type:   'glycemie',
    valeur: valeur,
    unite:  'mg/dL'
  });
  patchUserLocal({ historique_repas: historique.slice(0, 60) }); // planifierSync() déclenché en interne

  // Feedback visuel
  const conf = document.getElementById('glyc-repas-confirm');
  if (conf) { conf.classList.add('visible'); setTimeout(() => conf.classList.remove('visible'), 2500); }
  document.getElementById('inp-glycemie-repas').value = '';
  mettreAJourIndicateurGlycRepas();

  // Feedback vocal
  _jouerTexteVocal(_texteCommentaireGlycemie(valeur));
}

// ════════════════════════════════════════════════════════
// ── Glycémie ───────────────────────────────────────────
// ════════════════════════════════════════════════════════
function _getHintGlyc() {
  // Retourne l'élément hint, ou le crée si le HTML est en vieux cache
  let aide = document.getElementById('glyc-aide-saisie');
  if (!aide) {
    const zone = document.querySelector('#ecran-glycemie .glycemie-input-zone');
    if (zone) {
      aide = document.createElement('p');
      aide.id = 'glyc-aide-saisie';
      aide.className = 'glyc-aide-saisie';
      aide.textContent = t('glyc_hint');
      zone.insertAdjacentElement('afterend', aide);
    }
  }
  return aide;
}

function reinitGlyc() {
  const inp = document.getElementById('inp-glycemie');
  if (inp) inp.value = '';
  const ind = document.getElementById('glycemie-indicateur');
  if (ind) { ind.textContent = ''; ind.className = 'glycemie-indicateur'; }
  const err = document.getElementById('glycemie-erreur');
  if (err) err.classList.remove('visible');
  // Réinitialise la ligne active dans le tableau de référence
  document.querySelectorAll('.glyc-ref-ligne').forEach(l => l.classList.remove('glyc-ref-active'));
  // Affiche le hint (création dynamique si HTML en vieux cache)
  const aide = _getHintGlyc();
  if (aide) { aide.style.display = 'block'; aide.style.opacity = '1'; }
}

function mettreAJourIndicateurGlyc() {
  const val = parseInt(document.getElementById('inp-glycemie').value, 10);
  const ind = document.getElementById('glycemie-indicateur');
  if (!ind) return;

  // Masque le texte d'aide dès qu'une valeur est saisie
  const aide = _getHintGlyc();

  // Réinitialise les lignes actives
  document.querySelectorAll('.glyc-ref-ligne').forEach(l => l.classList.remove('glyc-ref-active'));

  if (isNaN(val)) {
    ind.textContent = '';
    ind.className = 'glycemie-indicateur';
    if (aide) aide.style.opacity = '1';
    return;
  }

  if (aide) aide.style.opacity = '0';

  if (val < 70) {
    ind.textContent = t('ind_hypo_c');
    ind.className = 'glycemie-indicateur glyc-ind-bas';
    const ligne = document.querySelector('.glyc-ref-hypo');
    if (ligne) ligne.classList.add('glyc-ref-active');
  } else if (val <= 126) {
    ind.textContent = t('ind_normal_c');
    ind.className = 'glycemie-indicateur glyc-ind-ok';
    const ligne = document.querySelector('.glyc-ref-ok');
    if (ligne) ligne.classList.add('glyc-ref-active');
  } else if (val <= 180) {
    ind.textContent = t('ind_eleve_c');
    ind.className = 'glycemie-indicateur glyc-ind-elevee';
    const ligne = document.querySelector('.glyc-ref-eleve');
    if (ligne) ligne.classList.add('glyc-ref-active');
  } else {
    ind.textContent = t('ind_tres_eleve_c');
    ind.className = 'glycemie-indicateur glyc-ind-tres-elevee';
    const ligne = document.querySelector('.glyc-ref-tres');
    if (ligne) ligne.classList.add('glyc-ref-active');
  }
}

function sauverGlycemie() {
  const valeur = parseInt(document.getElementById('inp-glycemie').value, 10);
  const erreur = document.getElementById('glycemie-erreur');
  erreur.classList.remove('visible');
  if (isNaN(valeur) || valeur < 20 || valeur > 600) {
    afficherErreur(erreur, 'Valeur invalide. Entrez une valeur entre 20 et 600 mg/dL.');
    return;
  }
  const historique = getHistorique();
  historique.unshift({
    id: Date.now(),
    date: new Date().toISOString(),
    type: 'glycemie',
    valeur: valeur,
    unite: 'mg/dL'
  });
  patchUserLocal({ historique_repas: historique.slice(0, 60) });

  // Confirmation inline — on reste sur l'écran glycémie
  const conf = document.getElementById('glyc-confirm');
  if (conf) {
    conf.classList.add('visible');
    setTimeout(() => conf.classList.remove('visible'), 3000);
  }
  _jouerTexteVocal(_texteCommentaireGlycemie(valeur));
  mettreAJourResume();
  reinitGlyc();
}

// ════════════════════════════════════════════════════════
// ── Historique Glycémies — Calendrier + Liste ───────────
// ════════════════════════════════════════════════════════
const calendrierEtat = {
  annee: new Date().getFullYear(),
  mois:  new Date().getMonth(),
  jourSelectionne: null
};

function chargerHistorique() {
  const conteneur  = document.getElementById('liste-historique');
  const historique = getHistorique().filter(e => e.type === 'glycemie');
  if (historique.length === 0) {
    conteneur.innerHTML = `<p class="cal-vide" style="margin-top:32px">${t('aucune_glycemie')}</p>`;
    return;
  }
  conteneur.innerHTML = rendreCalendrier(historique);
}

function _glycStatut(vRef) {
  if (vRef < 70)   return { label: t('hypoglycemie'), cls: 'glych-bas'  };
  if (vRef <= 126) return { label: t('normal'),        cls: 'glych-ok'   };
  if (vRef <= 180) return { label: t('eleve'),          cls: 'glych-haut' };
  return                  { label: t('tres_eleve'),    cls: 'glych-tres' };
}

function rendreCarteGlycHist(e) {
  const d    = new Date(e.date);
  const heure = d.toLocaleTimeString(t('locale_date'), { hour: '2-digit', minute: '2-digit' });
  const v     = e.valeur;
  const vRef  = (e.unite === 'mg/dL' || v > 40) ? v : v * 18;
  const st    = _glycStatut(vRef);
  return `<div class="glych-carte ${st.cls}">
    <div class="glych-heure">${heure}</div>
    <div class="glych-valeur">${v} <span class="glych-unite">mg/dL</span></div>
    <div class="glych-statut">${st.label}</div>
  </div>`;
}

function rendreCalendrier(historique) {
  const { annee, mois, jourSelectionne } = calendrierEtat;
  const loc = t('locale_date');
  const moisNoms = Array.from({length:12}, (_,i) => {
    const s = new Date(2024,i,1).toLocaleDateString(loc,{month:'long'});
    return s.charAt(0).toUpperCase()+s.slice(1);
  });
  // En-têtes jours (Lun 1er jan 2024 = lundi)
  const joursEntetes = Array.from({length:7}, (_,i) =>
    new Date(2024,0,1+i).toLocaleDateString(loc,{weekday:'short'}).slice(0,2).toUpperCase()
  );

  const parJour = {};
  historique.forEach(e => {
    const d   = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!parJour[key]) parJour[key] = [];
    parJour[key].push(e);
  });

  const premierJour = new Date(annee, mois, 1).getDay();
  const debutLundi  = (premierJour + 6) % 7;
  const nbJours     = new Date(annee, mois + 1, 0).getDate();
  const aujourd     = new Date();

  const estAujourd = j => annee === aujourd.getFullYear() && mois === aujourd.getMonth() && j === aujourd.getDate();
  const estFutur   = j => new Date(annee, mois, j) > aujourd;

  let html = `
  <div class="calendrier">
    <div class="calendrier-nav">
      <button class="btn-cal-nav" onclick="naviguerMois(-1)">◀</button>
      <span class="calendrier-titre">${moisNoms[mois]} ${annee}</span>
      <button class="btn-cal-nav" onclick="naviguerMois(1)">▶</button>
    </div>
    <div class="calendrier-grille">
      ${joursEntetes.map(j=>`<div class="cal-entete">${j}</div>`).join('')}`;

  for (let i = 0; i < debutLundi; i++) html += `<div class="cal-jour vide"></div>`;

  for (let j = 1; j <= nbJours; j++) {
    const key    = `${annee}-${String(mois+1).padStart(2,'0')}-${String(j).padStart(2,'0')}`;
    const entrees = parJour[key] || [];
    const hasGlyc = entrees.length > 0;
    const futur   = estFutur(j);

    // Couleur dominante du point selon la pire valeur du jour
    let dotCls = 'dot-glyc';
    if (hasGlyc) {
      const pire = Math.max(...entrees.map(e => {
        const v = e.valeur; return (e.unite === 'mg/dL' || v > 40) ? v : v * 18;
      }));
      dotCls = pire < 70 ? 'dot-glyc-bas' : pire <= 126 ? 'dot-glyc' : pire <= 180 ? 'dot-glyc-haut' : 'dot-glyc-tres';
    }

    const cls = ['cal-jour',
      estAujourd(j)         ? 'cal-aujourdhui' : '',
      jourSelectionne === j ? 'cal-selectionne' : '',
      futur                 ? 'cal-futur'       : '',
    ].filter(Boolean).join(' ');

    html += `<div class="${cls}" ${!futur ? `onclick="selectionnerJour(${j})"` : ''}>
      <span class="cal-numero">${j}</span>
      <div class="cal-dots">${hasGlyc ? `<span class="cal-dot ${dotCls}"></span>` : ''}</div>
    </div>`;
  }

  html += `</div>
    <div class="cal-legende">
      <span class="cal-legende-item"><span class="cal-dot dot-glyc cal-legende-dot"></span> ${t('normal')}</span>
      <span class="cal-legende-item"><span class="cal-dot dot-glyc-haut cal-legende-dot"></span> ${t('eleve')}</span>
      <span class="cal-legende-item"><span class="cal-dot dot-glyc-bas cal-legende-dot"></span> ${t('cal_legende_hypo')}</span>
    </div>
  </div>`;

  // Détail du jour sélectionné
  if (jourSelectionne) {
    const key     = `${annee}-${String(mois+1).padStart(2,'0')}-${String(jourSelectionne).padStart(2,'0')}`;
    const entrees = (parJour[key] || []).sort((a, b) => new Date(a.date) - new Date(b.date));
    const jourLabel = new Date(annee, mois, jourSelectionne)
      .toLocaleDateString(loc, { weekday:'long', day:'numeric', month:'long' });
    html += `<div class="glych-groupe">
      <div class="glych-jour-titre">${jourLabel.charAt(0).toUpperCase() + jourLabel.slice(1)}</div>`;
    if (entrees.length === 0) {
      html += `<p class="cal-vide">${t('aucune_glycemie_jour')}</p>`;
    } else {
      entrees.forEach(e => { html += rendreCarteGlycHist(e); });
    }
    html += `</div>`;
  } else {
    // Pas de jour sélectionné : regrouper par date (30 dernières mesures)
    const recentes = historique.slice(0, 30);
    if (recentes.length > 0) {
      // Grouper par clé de date YYYY-MM-DD
      const groupes = {};
      const ordre   = [];
      recentes.forEach(e => {
        const d   = new Date(e.date);
        const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        if (!groupes[key]) { groupes[key] = []; ordre.push(key); }
        groupes[key].push(e);
      });
      html += `<div class="glych-groupe">`;
      ordre.forEach(key => {
        const d      = new Date(key);
        const label  = d.toLocaleDateString(loc, { weekday:'long', day:'numeric', month:'long' });
        html += `<div class="glych-jour-titre">${label.charAt(0).toUpperCase() + label.slice(1)}</div>`;
        groupes[key]
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .forEach(e => { html += rendreCarteGlycHist(e); });
      });
      html += `</div>`;
    }
  }

  return html;
}

// ════════════════════════════════════════════════════════
// ── Historique Repas ────────────────────────────────────
// ════════════════════════════════════════════════════════
function chargerHistoriqueRepas() {
  const conteneur = document.getElementById('liste-historique-repas');
  const repas = getHistorique().filter(e => e.type === 'photo' || e.type === 'vocal');

  if (repas.length === 0) {
    conteneur.innerHTML = `<p class="cal-vide" style="margin-top:32px">${t('aucun_repas_hist')}</p>`;
    return;
  }

  // Grouper par date
  const groupes = {};
  const ordre   = [];
  repas.forEach(e => {
    const d   = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    if (!groupes[key]) { groupes[key] = []; ordre.push(key); }
    groupes[key].push(e);
  });

  const igMap = {
    bas:    { label: t('ig_bas'),    cls: 'rh-ig-bas',    emoji: '🟢' },
    modere: { label: t('ig_modere'), cls: 'rh-ig-modere', emoji: '🟡' },
    eleve:  { label: t('ig_eleve'),  cls: 'rh-ig-eleve',  emoji: '🔴' }
  };
  const idMap = {
    ok:        { label: t('ok_diabete'),        cls: 'rh-id-ok' },
    attention: { label: t('attention_diabete'), cls: 'rh-id-attention' },
    eviter:    { label: t('eviter_diabete'),    cls: 'rh-id-eviter' }
  };

  let html = '';
  ordre.forEach(key => {
    const d     = new Date(key);
    const label = d.toLocaleDateString(t('locale_date'), { weekday: 'long', day: 'numeric', month: 'long' });
    html += `<div class="glych-jour-titre">${label.charAt(0).toUpperCase() + label.slice(1)}</div>`;

    groupes[key]
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .forEach(e => {
        const heure   = new Date(e.date).toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
        const a       = e.analyse || null;
        const icone   = e.type === 'photo' ? '📷' : '🎤';

        // Photo
        const photo = e.thumbnail
          ? `<img class="repas-hist-photo" src="${e.thumbnail}" alt="Photo du repas" onerror="this.style.display='none'" />`
          : '';

        // Nom du plat
        const platNom = a?.plat
          ? `<div class="rh-plat-nom">${esc(a.plat)}${a.portion ? ` <span class="rh-portion">· ${esc(a.portion)}</span>` : ''}</div>`
          : (e.description ? `<div class="rh-plat-nom">${esc(e.description)}</div>` : '');

        // Calories
        const calories = (a?.calories != null)
          ? `<div class="rh-calories"><span class="rh-cal-valeur">${a.calories}</span><span class="rh-cal-unite">kcal</span></div>`
          : '';

        // Badges IG + indice diabète
        const ig = a?.index_glycemique ? igMap[a.index_glycemique] : null;
        const id = a?.indice_diabete   ? idMap[a.indice_diabete]   : null;
        const badges = (ig || id) ? `<div class="rh-badges">
          ${ig ? `<span class="rh-badge ${ig.cls}">${ig.emoji} ${ig.label}</span>` : ''}
          ${id ? `<span class="rh-badge ${id.cls}">${id.label}</span>` : ''}
        </div>` : '';

        // Remarque diabète
        const remarque = a?.remarque_diabete
          ? `<p class="rh-remarque">💡 ${esc(a.remarque_diabete)}</p>`
          : '';

        // Conseil
        const conseil = e.conseil ? `<p class="rh-conseil">${esc(e.conseil)}</p>` : '';

        // Macros (glucides + sucres + protéines + lipides)
        const macros = a ? (() => {
          const items = [];
          if (a.glucides_g  != null) items.push(`<div class="rh-macro"><span class="rh-macro-val">${a.glucides_g}g</span><span class="rh-macro-lab">${t('glucides')}</span></div>`);
          if (a.sucres_g    != null) items.push(`<div class="rh-macro rh-macro-sucres"><span class="rh-macro-val">${a.sucres_g}g</span><span class="rh-macro-lab">${t('dont_sucres')}</span></div>`);
          if (a.proteines_g != null) items.push(`<div class="rh-macro"><span class="rh-macro-val">${a.proteines_g}g</span><span class="rh-macro-lab">${t('proteines')}</span></div>`);
          if (a.lipides_g   != null) items.push(`<div class="rh-macro"><span class="rh-macro-val">${a.lipides_g}g</span><span class="rh-macro-lab">${t('lipides')}</span></div>`);
          return items.length ? `<div class="rh-macros">${items.join('')}</div>` : '';
        })() : '';

        html += `<div class="repas-hist-carte">
          ${photo}
          <div class="rh-corps">
            <div class="rh-entete">
              <span class="repas-hist-icone">${icone}</span>
              <span class="repas-hist-heure">${heure}</span>
            </div>
            ${platNom}
            ${calories}
            ${badges}
            ${macros}
            ${remarque}
            ${conseil}
          </div>
        </div>`;
      });
  });

  conteneur.innerHTML = `<div class="glych-groupe">${html}</div>`;
}

function naviguerMois(delta) {
  calendrierEtat.mois += delta;
  if (calendrierEtat.mois > 11) { calendrierEtat.mois = 0;  calendrierEtat.annee++; }
  if (calendrierEtat.mois < 0)  { calendrierEtat.mois = 11; calendrierEtat.annee--; }
  calendrierEtat.jourSelectionne = null;
  chargerHistorique();
}

function selectionnerJour(jour) {
  calendrierEtat.jourSelectionne = (calendrierEtat.jourSelectionne === jour) ? null : jour;
  chargerHistorique();
}

async function exporterGlycemies() {
  const glycemies = getHistorique().filter(e => e.type === 'glycemie');
  if (glycemies.length === 0) {
    alert('Aucune glycémie à exporter.');
    return;
  }
  const prenom = getPrenom() || 'patient';
  const dateStr = new Date().toISOString().slice(0, 10);
  const lignes = ['Date,Heure,Valeur (mg/dL),Statut'].concat(glycemies.map(e => {
    const d = new Date(e.date);
    const date  = d.toLocaleDateString('fr-BE');
    const heure = d.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
    const v     = e.valeur;
    const vRef  = (e.unite === 'mg/dL' || v > 40) ? v : v * 18;
    const st    = _glycStatut(vRef).label;
    return `${date},${heure},${v},${st}`;
  }));
  const csv = lignes.join('\n');
  const filename = `glycemies_${prenom}_${dateStr}.csv`;
  const file = new File(['﻿' + csv], filename, { type: 'text/csv;charset=utf-8' });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Mes glycémies', text: `Historique de glycémie — ${prenom}` });
    } catch (err) {
      if (err.name !== 'AbortError') console.error('Share error', err);
    }
  } else {
    // Fallback téléchargement
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    a.download = filename;
    a.click();
  }
}

function rendreEntreeHistorique(repas) {
  // Utilisé uniquement pour les repas (depuis admin/dev)
  const date  = new Date(repas.date);
  const heure = date.toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' });
  const modeDev   = estModeDevActif();
  const icone     = repas.type === 'photo' ? '📷' : '🎤';
  const tableau   = (modeDev && repas.analyse) ? rendreTableauNutritionnel(repas.analyse) : '';
  const dateLabel = repas.date ? new Date(repas.date).toLocaleDateString('fr-BE', { day: 'numeric', month: 'long' }) : '';
  const photoHtml = repas.thumbnail
    ? `<img class="historique-photo" src="${repas.thumbnail}" alt="Photo du repas du ${dateLabel}" onerror="this.style.display='none'" />`
    : '';
  return `<div class="historique-carte">
    <div class="historique-entete">
      <span class="historique-icone">${icone}</span>
      <div class="historique-date"><span class="historique-heure">${heure}</span></div>
    </div>
    ${repas.description ? `<p class="historique-description">"${esc(repas.description)}"</p>` : ''}
    <p class="historique-conseil">${esc(repas.conseil)}</p>
    ${tableau}
    ${photoHtml}
  </div>`;
}

function rendreTableauNutritionnel(a) {
  if (!a) return '';
  const num = (v, u) => (v === null || v === undefined) ? '—' : `${v} ${u}`;
  const indices  = { bas: { label: 'Bas', cls: 'ig-bas' }, modere: { label: 'Modéré', cls: 'ig-modere' }, eleve: { label: 'Élevé', cls: 'ig-eleve' } };
  const diabetes = { ok: { label: '✅ OK', cls: 'ind-ok' }, attention: { label: '⚠️ Attention', cls: 'ind-attention' }, eviter: { label: '🚫 À éviter', cls: 'ind-eviter' } };
  const ig = indices[a.index_glycemique]  || null;
  const id = diabetes[a.indice_diabete]   || null;
  return `<div class="analyse-dev">
    <div class="analyse-dev-titre">🛠️ Analyse détaillée (Mode DEV)</div>
    ${a.plat ? `<div class="analyse-dev-plat"><strong>${esc(a.plat)}</strong>${a.portion ? ` <span class="analyse-dev-portion">· ${esc(a.portion)}</span>` : ''}</div>` : ''}
    <table class="analyse-dev-table">
      <tr><td>Calories</td><td>${num(a.calories,'kcal')}</td></tr>
      <tr><td>Glucides</td><td>${num(a.glucides_g,'g')}</td></tr>
      <tr class="souligne-sucres"><td>dont sucres</td><td>${num(a.sucres_g,'g')}</td></tr>
      <tr><td>Lipides</td><td>${num(a.lipides_g,'g')}</td></tr>
      <tr><td>Protéines</td><td>${num(a.proteines_g,'g')}</td></tr>
      <tr><td>Fibres</td><td>${num(a.fibres_g,'g')}</td></tr>
      <tr><td>Sel</td><td>${num(a.sel_g,'g')}</td></tr>
      ${ig ? `<tr><td>Index glycémique</td><td><span class="ig-badge ${ig.cls}">${ig.label}</span></td></tr>` : ''}
      ${id ? `<tr><td>Indice diabète</td><td><span class="ind-badge ${id.cls}">${id.label}</span></td></tr>` : ''}
    </table>
    ${a.remarque_diabete ? `<div class="analyse-dev-remarque">💡 ${esc(a.remarque_diabete)}</div>` : ''}
  </div>`;
}

// ════════════════════════════════════════════════════════
// ── Sauvegarde repas ───────────────────────────────────
// ════════════════════════════════════════════════════════
function sauverRepas(description, conseil, type, analyse, thumbnail) {
  const historique = getHistorique();
  const entree = {
    id: Date.now(),
    date: new Date().toISOString(),
    type: type || 'vocal',
    description: description || '',
    conseil,
    analyse:   analyse   || null,
    thumbnail: thumbnail || null   // stocké localement uniquement
  };
  historique.unshift(entree);
  const tranche = historique.slice(0, 60);

  // Sauvegarde locale complète (avec thumbnails)
  const userLocal = getUserLocal() || {};
  sauverUserLocal({ ...userLocal, historique_repas: tranche });

  // Sync serveur sans thumbnails (Redis ne doit pas stocker des images)
  const sansThumbs = tranche.map(({ thumbnail: _t, ...rest }) => rest);
  planifierSync({ historique_repas: sansThumbs });
}

// ════════════════════════════════════════════════════════
// ── Proche aidant ──────────────────────────────────────
// ════════════════════════════════════════════════════════
function sauverProche() {
  const prenom = document.getElementById('inp-proche-prenom').value.trim();
  const tel    = document.getElementById('inp-proche-tel').value.trim();
  if (!prenom || !tel) return;
  patchUserLocal({ proche: { prenom, telephone: tel } });
  _invaliderEtRechargerCacheUrgence(); // le nom du proche a changé → texte urgence aussi
  afficherZone('proche-sauve');
  mettreAJourBoutonsAppel();
  setTimeout(() => masquerZone('proche-sauve'), 2000);
}

function sauverProche2() {
  const prenom = document.getElementById('inp-proche2-prenom').value.trim();
  const tel    = document.getElementById('inp-proche2-tel').value.trim();
  if (!prenom || !tel) return;
  patchUserLocal({ proche2: { prenom, telephone: tel } });
  _invaliderEtRechargerCacheUrgence(); // proche2 peut être proche principal plus tard
  afficherZone('proche2-sauve');
  mettreAJourBoutonsAppel();
  setTimeout(() => masquerZone('proche2-sauve'), 2000);
}

function sauverMedecin() {
  const nom = document.getElementById('inp-medecin-nom').value.trim();
  const tel = document.getElementById('inp-medecin-tel').value.trim();
  patchUserLocal({ medecin: (nom || tel) ? { nom, telephone: tel } : null });
  afficherZone('medecin-sauve');
  setTimeout(() => masquerZone('medecin-sauve'), 2000);
}

function sauverPharmacie() {
  const nom = document.getElementById('inp-pharmacie-nom').value.trim();
  const tel = document.getElementById('inp-pharmacie-tel').value.trim();
  patchUserLocal({ pharmacie: (nom || tel) ? { nom, telephone: tel } : null });
  afficherZone('pharmacie-sauve');
  setTimeout(() => masquerZone('pharmacie-sauve'), 2000);
}

function chargerEcranUrgence() {
  const proche   = getProcheContact();
  const infoEl   = document.getElementById('urgence-proche-info');
  const pasEl    = document.getElementById('urgence-pas-de-proche');
  const btn      = document.getElementById('btn-alerter-proche');
  const btnTexte = document.getElementById('btn-alerter-texte');

  btn.disabled = false;
  btnTexte.textContent = t('prevenir_famille');
  masquerZone('urgence-confirmation');
  btn.style.display = '';

  if (proche) {
    infoEl.innerHTML = `${t('proche_aidant_label')} <strong>${esc(proche.prenom)}</strong><br>${esc(proche.telephone)}`;
    afficherZone('urgence-proche-info');
    masquerZone('urgence-pas-de-proche');
    btnTexte.textContent = t('appeler_prenom')(proche.prenom);
  } else {
    masquerZone('urgence-proche-info');
    afficherZone('urgence-pas-de-proche');
    btn.disabled = true;
  }

  // Médecin + Pharmacie
  const medecin   = getMedecin();
  const pharmacie = getPharmacie();
  const btnMed    = document.getElementById('btn-appel-medecin');
  const btnPha    = document.getElementById('btn-appel-pharmacie');
  const lblMed    = document.getElementById('label-medecin');
  const lblPha    = document.getElementById('label-pharmacie');
  if (btnMed) {
    if (medecin?.telephone) {
      lblMed.textContent = medecin.nom ? `Dr ${medecin.nom}` : 'Mon médecin';
      btnMed.style.display = 'flex';
    } else {
      btnMed.style.display = 'none';
    }
  }
  if (btnPha) {
    if (pharmacie?.telephone) {
      lblPha.textContent = pharmacie.nom || 'Ma pharmacie';
      btnPha.style.display = 'flex';
    } else {
      btnPha.style.display = 'none';
    }
  }

  // Message vocal rassurant automatique (le tap "Besoin d'aide" = geste iOS valide)
  _parlerUrgence();
}

function appelerMedecin() {
  const m = getMedecin();
  if (!m?.telephone) return;
  const nom = m.nom ? `${m.nom} (${m.telephone})` : m.telephone;
  if (!confirm(t('appeler_confirm')(nom))) return;
  window.location.href = `tel:${m.telephone}`;
}
function appelerPharmacie() {
  const p = getPharmacie();
  if (!p?.telephone) return;
  const nom = p.nom ? `${p.nom} (${p.telephone})` : p.telephone;
  if (!confirm(t('appeler_confirm')(nom))) return;
  window.location.href = `tel:${p.telephone}`;
}

function _texteUrgence() {
  const prenomUser = getPrenom();
  const proche     = getProcheContact();
  if (proche) {
    const nomProche = proche.prenom || t('votre_proche_defaut');
    return t('urgence_vocal_proche')(prenomUser, nomProche);
  }
  return t('urgence_vocal_seul')(prenomUser);
}

async function _parlerUrgence() {
  await _jouerAudioUrgence('urgence', _texteUrgence);
}

async function envoyerAlerteUrgence() {
  const proche = getProcheContact();
  const btn    = document.getElementById('btn-alerter-proche');
  const prenom = getPrenom() || 'Votre proche';
  btn.disabled = true;
  document.getElementById('btn-alerter-texte').textContent = t('envoi_en_cours');
  try {
    const r = await fetch('/api/urgence', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ timestamp: new Date().toISOString(), prenom_utilisateur: prenom, telephone_proche: proche?.telephone || '', telephone_utilisateur: getSession()?.telephone || '' })
    });
    const data = await r.json();
    if (!data.ok) {
      document.getElementById('btn-alerter-texte').textContent = t('envoi_echec');
      btn.disabled = false;
      return;
    }
  } catch { /* réseau, on affiche quand même */ }
  afficherZone('urgence-confirmation');
  btn.style.display = 'none';
}

// ════════════════════════════════════════════════════════
// ── Scan médicament par photo ──────────────────────────
// ════════════════════════════════════════════════════════
function ouvrirScanMedicament() { document.getElementById('input-scan-med').click(); }

async function analyserMedicamentPhoto(input) {
  if (!input.files?.[0]) return;
  const fichier   = input.files[0];
  const base64    = await lireEnBase64(fichier);
  const resultat  = document.getElementById('scan-med-resultat');
  resultat.classList.add('visible');
  resultat.innerHTML = `<span>${t('scan_analyse')}</span>`;
  try {
    const r    = await fetch('/api/analyser-medicament', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeader() },
      body: JSON.stringify({ image: base64, type: fichier.type })
    });
    const data = await r.json();
    if (data.nom) {
      document.getElementById('inp-med-nom').value = data.nom;
      if (data.instructions && document.getElementById('inp-med-posologie')) {
        document.getElementById('inp-med-posologie').value = data.instructions;
      }
      resultat.innerHTML = `
        <div class="scan-ok">
          <div class="scan-ok-nom">✅ ${data.nom}</div>
          ${data.indication ? `<div class="scan-indication">💡 ${data.indication}</div>` : ''}
          ${data.instructions ? `<div class="scan-posologie">📋 ${data.instructions}</div>` : ''}
        </div>`;
    } else {
      resultat.innerHTML = `<span class="scan-err">${t('scan_non_reconnu')}</span>`;
    }
  } catch {
    resultat.innerHTML = `<span class='scan-err'>${t('scan_erreur')}</span>`;
  }
  input.value = '';
}

// ════════════════════════════════════════════════════════
// ── Médicaments ────────────────────────────────────────
// ════════════════════════════════════════════════════════
function sauverMedicaments(liste) { patchUserLocal({ medicaments: liste }); }

function estDuAujourdhui(med) {
  const f = med.frequence || 'quotidien';
  if (f === 'quotidien') return true;
  const d = new Date();
  if (f === 'hebdomadaire') return d.getDay() === med.jourSemaine;
  if (f === 'mensuel')      return d.getDate() === med.jourMois;
  return true;
}

function reinitialiserPrisSiNouveauJour() {
  const aujourd = new Date().toDateString();
  const meds    = getMedicaments();
  let modifie   = false;
  const nouveau = meds.map(m => {
    if (m.dernierReset === aujourd) return m;
    if (!estDuAujourdhui(m)) return m;
    modifie = true;
    return { ...m, pris: false, dernierReset: aujourd };
  });
  if (modifie) sauverMedicaments(nouveau);
}

let frequenceCourante  = 'quotidien';
let jourSemaineCourant = null;

function selectionnerFrequence(btn) {
  document.querySelectorAll('.btn-frequence').forEach(b => b.classList.remove('selectionne'));
  btn.classList.add('selectionne');
  frequenceCourante = btn.dataset.freq;
  const zoneS = document.getElementById('zone-jour-semaine');
  const zoneM = document.getElementById('zone-jour-mois');
  if (zoneS) zoneS.style.display = frequenceCourante === 'hebdomadaire' ? 'block' : 'none';
  if (zoneM) zoneM.style.display = frequenceCourante === 'mensuel'      ? 'block' : 'none';
}

function toggleOptionsAvancees(btn) {
  const zone = document.getElementById('zone-options-avancees');
  const chevron = btn.querySelector('.chevron-options');
  const ouvert = zone.style.display !== 'none';
  zone.style.display = ouvert ? 'none' : 'block';
  if (chevron) chevron.style.transform = ouvert ? '' : 'rotate(90deg)';
}

function toggleListeMedsEnregistres(btn) {
  const zone = document.getElementById('liste-meds-enregistres');
  const chevron = btn.querySelector('.chevron-options');
  const ouvert = zone.style.display !== 'none';
  if (ouvert) {
    zone.style.display = 'none';
    if (chevron) chevron.style.transform = '';
    return;
  }
  // Construire la liste
  const meds = getMedicaments();
  const iconesPeriode = { matin:'🌅', midi:'☀️', soir:'🌆', nuit:'🌙' };
  const labelsPeriode = { matin:t('matin'), midi:t('midi'), soir:t('soir'), nuit:t('nuit') };
  if (!meds.length) {
    zone.innerHTML = `<div style="text-align:center;color:#999;padding:12px;font-size:15px;">${t('aucun_med_enregistre')}</div>`;
  } else {
    zone.innerHTML = meds.map(m => `
      <div class="liste-med-item ${m.desactive ? 'desactive' : ''}" onclick="ouvrirFicheMed(${m.id})">
        <span class="liste-med-periode" style="background:${{'matin':'#E08C00','midi':'#1450C4','soir':'#7B10BB','nuit':'#3949AB'}[m.periode]||'#888'}">
          ${iconesPeriode[m.periode]||'💊'} ${labelsPeriode[m.periode]||m.periode}
        </span>
        <span class="liste-med-nom">${esc(m.nom)}${m.insuline?' 💉':''}</span>
        ${m.desactive ? `<span class="liste-med-statut">${t('desactive_badge')}</span>` : ''}
      </div>`).join('');
  }
  zone.style.display = 'block';
  if (chevron) chevron.style.transform = 'rotate(90deg)';
}

function toggleCarteInsuline(checkbox) {
  const check = document.getElementById('carte-insuline-check');
  if (check) check.textContent = checkbox.checked ? '✅' : '○';
  const label = document.getElementById('carte-insuline-label');
  if (label) label.classList.toggle('active', checkbox.checked);
}

function selectionnerJourSemaine(btn) {
  document.querySelectorAll('.btn-jour').forEach(b => b.classList.remove('selectionne'));
  btn.classList.add('selectionne');
  jourSemaineCourant = parseInt(btn.dataset.jour, 10);
}

let periodesCourantes = [];
function selectionnerPeriode(btn) {
  const p = btn.dataset.periode;
  if (periodesCourantes.includes(p)) {
    periodesCourantes = periodesCourantes.filter(x => x !== p);
    btn.classList.remove('selectionne');
  } else {
    periodesCourantes.push(p);
    btn.classList.add('selectionne');
  }
}

// ════════════════════════════════════════════════════════
// ── Autocomplete médicaments belges ────────────────────
// ════════════════════════════════════════════════════════
let _listeMedsBE = null;

async function _chargerListeMedsBE() {
  if (_listeMedsBE) return _listeMedsBE;
  try {
    const r = await fetch('/public/medicaments-be.json');
    _listeMedsBE = await r.json();
  } catch { _listeMedsBE = []; }
  return _listeMedsBE;
}

async function autocompleteNomMed(valeur) {
  const liste = document.getElementById('med-autocomplete-liste');
  if (!liste) return;
  const q = valeur.trim().toLowerCase();
  if (q.length < 2) { liste.style.display = 'none'; return; }
  const meds = await _chargerListeMedsBE();
  const resultats = meds
    .filter(m => m.toLowerCase().includes(q))
    .sort((a, b) => {
      // Priorité : commence par la saisie > contient ailleurs
      const aStart = a.toLowerCase().startsWith(q);
      const bStart = b.toLowerCase().startsWith(q);
      if (aStart && !bStart) return -1;
      if (!aStart && bStart) return 1;
      return a.localeCompare(b, 'fr');
    })
    .slice(0, 8);
  if (resultats.length === 0) { liste.style.display = 'none'; return; }
  liste.innerHTML = resultats.map(m =>
    `<li class="med-autocomplete-item" onmousedown="choisirMedBE('${m.replace(/'/g, "\\'")}')">${m.replace(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi'), '<strong>$1</strong>')}</li>`
  ).join('');
  liste.style.display = 'block';
}

function choisirMedBE(nom) {
  const inp = document.getElementById('inp-med-nom');
  if (inp) inp.value = nom;
  fermerAutocompleteMed();
}

function fermerAutocompleteMed() {
  const liste = document.getElementById('med-autocomplete-liste');
  if (liste) liste.style.display = 'none';
}

function ajouterMedicament() {
  if (estSeniorOnly()) return; // verrouillé
  const nom      = document.getElementById('inp-med-nom').value.trim();
  const heure    = document.getElementById('inp-med-heure').value;
  const posologie = document.getElementById('inp-med-posologie')?.value.trim() || '';
  const insuline  = document.getElementById('inp-med-insuline')?.checked || false;
  const erreur   = document.getElementById('med-erreur');
  erreur.classList.remove('visible');
  if (!nom)                       return afficherErreur(erreur, 'Entrez le nom du médicament.');
  if (periodesCourantes.length === 0) return afficherErreur(erreur, 'Choisissez quand le prendre (matin, midi…).');
  if (frequenceCourante === 'hebdomadaire' && jourSemaineCourant === null)
    return afficherErreur(erreur, 'Choisissez le jour de la semaine.');
  if (frequenceCourante === 'mensuel') {
    const j = parseInt(document.getElementById('inp-jour-mois').value, 10);
    if (!j || j < 1 || j > 31) return afficherErreur(erreur, 'Entrez un jour du mois (1 à 31).');
  }
  const icones = { matin:'🌅', midi:'☀️', soir:'🌆', nuit:'🌙' };
  const meds = getMedicaments();
  // Crée une entrée par période sélectionnée
  periodesCourantes.forEach((periode, idx) => {
    const med = {
      id: Date.now() + idx, nom, periode,
      heure: heure || '', icone: insuline ? '💉' : icones[periode],
      frequence: frequenceCourante,
      jourSemaine: frequenceCourante === 'hebdomadaire' ? jourSemaineCourant : null,
      jourMois: frequenceCourante === 'mensuel' ? parseInt(document.getElementById('inp-jour-mois').value, 10) : null,
      posologie: posologie || null,
      insuline: insuline || false,
      pris: false, dernierReset: null
    };
    meds.push(med);
    planifierNotification(med);
  });
  sauverMedicaments(meds);

  // Reset formulaire
  document.getElementById('inp-med-nom').value  = '';
  document.getElementById('inp-med-heure').value = '';
  document.getElementById('inp-jour-mois').value = '';
  if (document.getElementById('inp-med-posologie')) document.getElementById('inp-med-posologie').value = '';
  if (document.getElementById('inp-med-insuline'))  document.getElementById('inp-med-insuline').checked = false;
  const res = document.getElementById('scan-med-resultat');
  if (res) { res.classList.remove('visible'); res.innerHTML = ''; }
  document.querySelectorAll('.btn-periode, .btn-frequence, .btn-jour').forEach(b => b.classList.remove('selectionne'));
  document.querySelector('.btn-frequence[data-freq="quotidien"]')?.classList.add('selectionne');
  const zS = document.getElementById('zone-jour-semaine'); if (zS) zS.style.display = 'none';
  const zM = document.getElementById('zone-jour-mois');    if (zM) zM.style.display = 'none';
  const zO = document.getElementById('zone-options-avancees'); if (zO) zO.style.display = 'none';
  const optBtn = document.querySelector('.btn-options-avancees .chevron-options'); if (optBtn) optBtn.style.transform = '';
  const insCheck = document.getElementById('carte-insuline-check'); if (insCheck) insCheck.textContent = '○';
  const insLabel = document.getElementById('carte-insuline-label'); if (insLabel) insLabel.classList.remove('active');
  periodesCourantes = []; frequenceCourante = 'quotidien'; jourSemaineCourant = null;

  allerA('ecran-medicaments');
  chargerMedicaments();
}

function heureEnMinutes(med) {
  if (med.heure && med.heure.includes(':')) {
    const [h, m] = med.heure.split(':').map(Number);
    return h * 60 + m;
  }
  return { matin: 480, midi: 720, soir: 1140, nuit: 1320 }[med.periode] ?? 480;
}
function minutesMaintenant() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }

function chargerMedicaments() {
  reinitialiserPrisSiNouveauJour();
  const liste = document.getElementById('liste-medicaments');
  const meds  = getMedicaments();
  const medsActifs = meds.filter(m => !m.desactive);

  if (medsActifs.length === 0) {
    liste.innerHTML = `<p class="chargement-meds">${t('aucun_med')}</p>`;
    mettreAJourBadge(0);
    return;
  }

  const now   = minutesMaintenant();
  const ordre = ['matin','midi','soir','nuit'];
  // Jours abrégés localisés
  const joursDate = [0,1,2,3,4,5,6].map(i => {
    const d = new Date(2024, 0, 7 + i); // 7 jan 2024 = dimanche
    return d.toLocaleDateString(t('locale_date'), { weekday: 'short' });
  });

  const periodeConf = {
    matin: { label: t('matin'), couleur: '#C47D0A', fond: '#FFF8ED', bord: '#F59E0B' },
    midi:  { label: t('midi'),  couleur: '#0B6650', fond: '#EDFAF5', bord: '#0B9E78' },
    soir:  { label: t('soir'),  couleur: '#6D28D9', fond: '#F5F3FF', bord: '#8B5CF6' },
    nuit:  { label: t('nuit'),  couleur: '#1D4ED8', fond: '#EFF6FF', bord: '#3B82F6' },
  };

  const labelFrequence = med => {
    const f = med.frequence || 'quotidien';
    if (f === 'hebdomadaire') return t('med_freq_hebdo')(joursDate[med.jourSemaine] ?? med.jourSemaine);
    if (f === 'mensuel')      return t('med_freq_mensuel')(med.jourMois);
    return '';
  };

  const duJour     = medsActifs.filter(m =>  estDuAujourdhui(m));
  const pasAujourd = medsActifs.filter(m => !estDuAujourdhui(m));

  const rendreBloc = (group, periode, dj) => {
    const conf       = periodeConf[periode] || { label: periode, couleur: '#555', fond: '#F5F5F5', bord: '#999' };
    const toutPris   = dj && group.every(m => m.pris);
    const nbOublies  = dj ? group.filter(m => !m.pris && heureEnMinutes(m) + 30 <= now).length : 0;
    const heureRef   = group[0]?.heure || '';
    const heureLabel = (heureRef && heureRef.includes(':')) ? heureRef : '';

    let h = `<div class="med-bloc ${periode} ${toutPris ? 'bloc-tout-pris' : ''} ${!dj ? 'bloc-autre-jour' : ''}" id="med-bloc-${periode}">
      <div class="med-bloc-header" style="background:${conf.fond};border-left:5px solid ${conf.bord}">
        <div class="med-bloc-header-left">
          <span class="med-bloc-periode" style="color:${conf.couleur}">${conf.label}</span>
          ${heureLabel ? `<span class="med-bloc-heure-ref">${heureLabel}</span>` : ''}
        </div>
        ${toutPris    ? `<span class="med-bloc-badge-pris">${t('med_tout_pris')}</span>`
          : nbOublies > 0 ? `<span class="med-bloc-badge-oubli">${nbOublies > 1 ? t('med_oublies')(nbOublies) : t('med_oublie')}</span>`
          : ''}
      </div>`;

    group.forEach((med, i) => {
      const enRetard = dj && !med.pris && heureEnMinutes(med) + 30 <= now;
      const posologiePropre = med.posologie
        ? esc(med.posologie).replace(/\s*\([^)]*\)/g, '').trim()
        : '';
      const freq = labelFrequence(med);
      h += `<div class="med-bloc-item ${med.pris ? 'item-pris' : ''} ${enRetard ? 'item-retard' : ''} ${i > 0 ? 'item-sep' : ''}"
                 onclick="ouvrirFicheMed(${med.id})">
        <div class="med-bloc-info">
          <div class="med-bloc-nom">${esc(med.nom)}${med.insuline ? ' <span class="med-badge-insuline">Insuline</span>' : ''}</div>
          ${posologiePropre ? `<div class="med-bloc-posologie">${posologiePropre}</div>` : ''}
          ${freq ? `<div class="med-bloc-freq">${freq}</div>` : ''}
        </div>
        <button class="btn-med-pris ${med.pris ? 'deja-pris' : ''}"
                onclick="event.stopPropagation(); marquerPris(${med.id}, this)"
                ${med.pris || !dj ? 'disabled' : ''}>
          ${med.pris ? t('med_pris') : dj ? t('marquer_pris') : '—'}
        </button>
      </div>`;
    });

    h += `</div>`;
    return h;
  };

  let html = '';

  if (duJour.length > 0) {
    html += `<div class="med-section-titre">${t('med_aujourd_hui')}</div>`;
    ordre.forEach(p => {
      const g = duJour.filter(m => m.periode === p);
      if (g.length) html += rendreBloc(g, p, true);
    });
  }

  if (pasAujourd.length > 0) {
    html += `<div class="med-section-titre" style="margin-top:16px">${t('med_autres_jours')}</div>`;
    ordre.forEach(p => {
      const g = pasAujourd.filter(m => m.periode === p);
      if (g.length) html += rendreBloc(g, p, false);
    });
  }

  liste.innerHTML = html;

  const btnAjouter = document.querySelector('#ecran-medicaments .btn-action');
  if (btnAjouter) btnAjouter.style.display = estSeniorOnly() ? 'none' : '';

  const oublies = meds.filter(m => estDuAujourdhui(m) && !m.pris && !m.desactive && heureEnMinutes(m) + 30 <= now).length;
  mettreAJourBadge(oublies);

  // ── Auto-scroll vers la période courante ──────────────
  const h = new Date().getHours();
  const periodeActive = h < 10 ? 'matin' : h < 14 ? 'midi' : h < 20 ? 'soir' : 'nuit';
  const cible = document.getElementById('med-bloc-' + periodeActive)
             || document.querySelector('.med-bloc');
  if (cible) {
    setTimeout(() => {
      const conteneur = document.getElementById('ecran-medicaments'); // c'est lui qui scroll (overflow-y: auto)
      if (!conteneur) return;
      let top = 0;
      let el  = cible;
      while (el && el !== conteneur) {
        top += el.offsetTop;
        el   = el.offsetParent;
      }
      conteneur.scrollTop = Math.max(0, top - 12);
    }, 200);
  }
}

// ── Modal unités insuline ─────────────────────────────
let _insulinePrisId  = null;
let _insulinePrisBtn = null;

function _modalInsuline(visible) {
  const el = document.getElementById('modal-insuline');
  if (el) el.style.display = visible ? 'flex' : 'none';
}

function demanderUnites(id, btn) {
  _insulinePrisId  = id;
  _insulinePrisBtn = btn;
  document.getElementById('inp-unites-insuline').value = '';
  _modalInsuline(true);
  setTimeout(() => document.getElementById('inp-unites-insuline').focus(), 150);
}
function confirmerUnites() {
  const unites = parseInt(document.getElementById('inp-unites-insuline').value, 10) || null;
  _modalInsuline(false);
  _marquerPrisAvecUnites(_insulinePrisId, _insulinePrisBtn, unites);
  _insulinePrisId = null; _insulinePrisBtn = null;
}
function annulerUnites() {
  _modalInsuline(false);
  _marquerPrisAvecUnites(_insulinePrisId, _insulinePrisBtn, null);
  _insulinePrisId = null; _insulinePrisBtn = null;
}

function marquerPris(id, btn) {
  const medCheck = getMedicaments().find(m => m.id === id);
  if (medCheck?.insuline) { demanderUnites(id, btn); return; }
  _marquerPrisAvecUnites(id, btn, null);
}

function _marquerPrisAvecUnites(id, btn, unites) {
  btn.textContent = t('pris_bravo');
  btn.classList.add('deja-pris');
  btn.disabled = true;
  const carte = btn.closest('.med-carte, .med-bloc-item');
  if (carte) { carte.classList.add('pris'); carte.classList.remove('en-retard', 'item-retard'); }
  // Si tous les items du bloc sont pris, marquer le bloc
  const bloc = btn.closest('.med-bloc');
  if (bloc) {
    const items = bloc.querySelectorAll('.med-bloc-item:not(.item-pris)');
    // Compte les restants hors celui qu'on vient de cocher
    const restants = [...items].filter(it => !it.querySelector('.btn-med-pris.deja-pris'));
    if (restants.length === 0) {
      bloc.classList.add('bloc-tout-pris');
      const badge = bloc.querySelector('.med-bloc-badge-oubli');
      if (badge) { badge.className = 'med-bloc-badge-pris'; badge.textContent = t('med_tout_pris'); }
    }
  }

  const meds = getMedicaments().map(m => m.id === id ? { ...m, pris: true } : m);
  sauverMedicaments(meds);

  // Annule les notifications en attente dans le SW pour ce médicament
  swController().then(sw => { if (sw) sw.postMessage({ type: 'ANNULER_NOTIF', medId: id }); });

  // Enregistre la prise dans l'historique
  const med    = meds.find(m => m.id === id);
  if (med) {
    const prises  = getUserLocal()?.prises_medicaments || [];
    const prise = { ts: Date.now(), id: med.id, nom: med.nom, icone: med.icone || '💊', periode: med.periode, heure: med.heure || '' };
    if (unites) prise.unites = unites;
    prises.push(prise);
    patchUserLocal({ prises_medicaments: prises.slice(-200) });
  }

  const oublies = meds.filter(m => estDuAujourdhui(m) && !m.pris && !m.desactive && heureEnMinutes(m) + 30 <= minutesMaintenant()).length;
  mettreAJourBadge(oublies);
  mettreAJourResume();
}

// ════════════════════════════════════════════════════════
// ── Fiche médicament : désactiver / supprimer ──────────
// ════════════════════════════════════════════════════════
let _ficheMedId = null;

function ouvrirFicheMed(id) {
  if (estSeniorOnly()) return; // verrouillé — lecture seule interdite aussi
  const med = getMedicaments().find(m => m.id === id);
  if (!med) return;
  _ficheMedId = id;

  const jours   = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];
  let detail    = med.periode.charAt(0).toUpperCase() + med.periode.slice(1);
  if (med.heure) detail += ` · ${med.heure}`;
  const f = med.frequence || 'quotidien';
  if (f === 'hebdomadaire') detail += ` · chaque ${jours[med.jourSemaine]}`;
  if (f === 'mensuel')      detail += ` · le ${med.jourMois} du mois`;

  document.getElementById('fiche-med-icone').textContent   = med.icone || '💊';
  document.getElementById('fiche-med-nom').textContent     = med.nom;
  document.getElementById('fiche-med-detail').textContent  = detail;
  const posEl = document.getElementById('fiche-med-posologie');
  if (posEl) {
    if (med.posologie) { posEl.textContent = '💊 ' + med.posologie; posEl.style.display = ''; }
    else posEl.style.display = 'none';
  }

  const badge = document.getElementById('fiche-med-statut-badge');
  const btnD  = document.getElementById('btn-fiche-desactiver');
  const hint  = document.getElementById('fiche-med-hint-desactiver');
  if (med.desactive) {
    badge.textContent = t('statut_desactive');
    badge.className   = 'fiche-med-statut-badge desactive';
    btnD.textContent  = t('reactiver_med');
    btnD.classList.add('reactiver');
    hint.textContent  = t('hint_med_desactive');
  } else {
    badge.textContent = t('statut_actif');
    badge.className   = 'fiche-med-statut-badge';
    btnD.textContent  = t('desactiver_med');
    btnD.classList.remove('reactiver');
    hint.textContent  = t('hint_med_actif');
  }

  // Réinitialise la zone de suppression
  document.getElementById('fiche-suppr-confirm').style.display = 'none';
  const btnSuppr = document.querySelector('.btn-fiche-supprimer');
  if (btnSuppr) btnSuppr.style.display = '';

  // Historique injections insuline
  const histZone = document.getElementById('fiche-insuline-historique');
  const histListe = document.getElementById('fiche-insuline-liste');
  if (histZone && histListe) {
    if (med.insuline) {
      // Regroupe toutes les injections du même médicament (par nom)
      // car un med multi-périodes génère plusieurs entrées avec des IDs différents
      const nomMed = med.nom.toLowerCase();
      const prises = (getUserLocal()?.prises_medicaments || [])
        .filter(p => p.nom?.toLowerCase() === nomMed)
        .reverse()
        .slice(0, 60);

      if (prises.length === 0) {
        histListe.innerHTML = `<p class="fiche-insuline-vide">${t('aucune_injection')}</p>`;
      } else {
        const iconesPeriode = { matin:'🌅', midi:'☀️', soir:'🌆', nuit:'🌙' };
        histListe.innerHTML = prises.map(p => {
          const d = new Date(p.ts);
          const date = d.toLocaleDateString('fr-BE', { weekday:'short', day:'numeric', month:'short' });
          const heure = d.toLocaleTimeString('fr-BE', { hour:'2-digit', minute:'2-digit' });
          const icone = iconesPeriode[p.periode] || '💉';
          const periodeLabel = p.periode ? `<span class="insuline-periode">${icone} ${p.periode}</span>` : '';
          const unites = p.unites ? `<span class="insuline-unites">${p.unites} U</span>` : '<span class="insuline-unites-nc">— U</span>';
          return `<div class="insuline-ligne">
            <div class="insuline-dt">
              <div class="insuline-date">${date} ${periodeLabel}</div>
              <div class="insuline-heure">${heure}</div>
            </div>
            ${unites}
          </div>`;
        }).join('');
      }
      histZone.style.display = 'block';
    } else {
      histZone.style.display = 'none';
    }
  }

  allerA('ecran-fiche-med');
}

function toggleDesactiverMed() {
  if (_ficheMedId === null) return;
  const meds = getMedicaments().map(m =>
    m.id === _ficheMedId ? { ...m, desactive: !m.desactive } : m
  );
  sauverMedicaments(meds);
  chargerMedicaments();
  // Rouvre la fiche pour refléter le nouveau statut
  ouvrirFicheMed(_ficheMedId);
}

function demanderConfirmationSuppression() {
  document.getElementById('fiche-suppr-confirm').style.display = 'block';
  document.querySelector('.btn-fiche-supprimer').style.display = 'none';
}

function annulerSuppression() {
  document.getElementById('fiche-suppr-confirm').style.display = 'none';
  document.querySelector('.btn-fiche-supprimer').style.display = 'block';
}

function confirmerSuppression() {
  if (_ficheMedId === null) return;
  const meds = getMedicaments().filter(m => m.id !== _ficheMedId);
  sauverMedicaments(meds);
  _ficheMedId = null;
  allerA('ecran-medicaments');
  chargerMedicaments();
}

// ════════════════════════════════════════════════════════
// ── Badge accueil ──────────────────────────────────────
// ════════════════════════════════════════════════════════
function mettreAJourBadge(nb) {
  const badge = document.getElementById('badge-meds');
  if (badge) { badge.style.display = nb > 0 ? 'flex' : 'none'; badge.textContent = nb; }
  if ('setAppBadge' in navigator) {
    nb > 0 ? navigator.setAppBadge(nb).catch(() => {}) : navigator.clearAppBadge().catch(() => {});
  }
}

// ════════════════════════════════════════════════════════
// ── Notifications de rappel ────────────────────────────
// ════════════════════════════════════════════════════════
function afficherStatutNotifications() {
  const statut = document.getElementById('notif-statut');
  const btn    = document.getElementById('btn-notif');
  const hint   = document.getElementById('notif-ios-hint');
  if (!statut) return;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  if (!('Notification' in window)) {
    if (isIOS && !isPWA) {
      statut.textContent = t('notif_installer_ios');
      statut.className   = 'notif-statut notif-warn';
      if (hint) hint.style.display = 'block';
      if (btn)  btn.style.display  = 'none';
    } else {
      statut.textContent = t('notif_non_supporte');
      statut.className   = 'notif-statut notif-off';
      if (btn) btn.style.display = 'none';
    }
    return;
  }
  const p = Notification.permission;
  if (p === 'granted') {
    statut.textContent = t('notif_active');
    statut.className   = 'notif-statut notif-on';
    if (btn) btn.style.display = 'none';
  } else if (p === 'denied') {
    statut.textContent = t('notif_bloquee');
    statut.className   = 'notif-statut notif-off';
    if (btn) btn.style.display = 'none';
  } else {
    statut.textContent = t('notif_inactive');
    statut.className   = 'notif-statut notif-warn';
    if (btn) btn.style.display = 'block';
  }
}

async function activerNotifications() {
  if (!('Notification' in window)) return;
  const permission = await Notification.requestPermission();
  afficherStatutNotifications();
  if (permission === 'granted') getMedicaments().forEach(planifierNotification);
}
async function demanderPermissionNotifications() {
  afficherStatutNotifications();
  if (!('Notification' in window)) return;
  // Demande la permission si pas encore décidé
  if (Notification.permission === 'default') {
    await Notification.requestPermission();
    afficherStatutNotifications();
  }
  if (Notification.permission === 'granted') {
    getMedicaments().forEach(planifierNotification);
    verifierMedsOublies();
  }
}

async function swController() {
  if (!('serviceWorker' in navigator)) return null;
  if (navigator.serviceWorker.controller) return navigator.serviceWorker.controller;
  // Attend l'activation si le SW vient d'être installé
  const reg = await navigator.serviceWorker.ready.catch(() => null);
  return reg?.active || null;
}

async function envoyerNotification(titre, corps, tag) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  const sw = await swController();
  if (sw) {
    sw.postMessage({ type: 'SHOW_NOTIF', titre, corps, tag: tag || 'monsucre-notif' });
  } else {
    new Notification(titre, { body: corps, icon: '/public/icons/icon.svg' });
  }
}

function verifierMedsOublies() {
  const now     = minutesMaintenant();
  const meds    = getMedicaments();
  const oublies = meds.filter(m => estDuAujourdhui(m) && !m.pris && !m.desactive && heureEnMinutes(m) + 30 <= now);
  mettreAJourBadge(oublies.length);
  if (oublies.length === 0) return;

  // Déduplication : max 1 notif par heure par jour (évite le spam toutes les 15 min)
  const cle = `notif_oubli_${new Date().toDateString()}_${Math.floor(now / 60)}`;
  if (sessionStorage.getItem(cle)) return;
  sessionStorage.setItem(cle, '1');

  const noms  = oublies.map(m => m.nom).join(', ');
  const corps = oublies.length === 1
    ? `Vous n'avez pas encore pris : ${noms}`
    : `${oublies.length} médicaments à prendre : ${noms}`;
  envoyerNotification('Mon Sucre — Rappel médicament', corps);
}

async function planifierNotification(med) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (med.desactive) return;

  const cible = new Date();
  const mins  = heureEnMinutes(med);
  cible.setHours(Math.floor(mins / 60), mins % 60, 0, 0);
  if (cible <= new Date()) cible.setDate(cible.getDate() + 1);
  const delai = cible.getTime() - Date.now();

  const sw = await swController();

  if (sw) {
    // Planifie via le Service Worker (résiste au background iOS/Android)
    sw.postMessage({
      type: 'PLANIFIER_NOTIF',
      medId: med.id,
      slot:  'rappel',
      titre: t('notif_med_titre'),
      corps: t('notif_med_corps')(med.nom),
      delai
    });
    sw.postMessage({
      type: 'PLANIFIER_NOTIF',
      medId: med.id,
      slot:  'oubli',
      titre: t('notif_rappel_titre'),
      corps: t('notif_rappel_corps')(med.nom),
      delai: delai + 30 * 60 * 1000
    });
  } else {
    // Fallback : setTimeout dans la page (marche uniquement si l'app est ouverte)
    setTimeout(() => {
      const m = getMedicaments().find(x => x.id === med.id);
      if (m && !m.pris && !m.desactive) envoyerNotification(t('notif_med_titre'), t('notif_med_corps')(m.nom));
    }, delai);
    setTimeout(() => {
      const m = getMedicaments().find(x => x.id === med.id);
      if (m && !m.pris && !m.desactive) envoyerNotification(t('notif_rappel_titre'), t('notif_rappel_corps')(m.nom));
    }, delai + 30 * 60 * 1000);
  }
}

// ════════════════════════════════════════════════════════
// ── Helpers ────────────────────────────────────────────
// ════════════════════════════════════════════════════════
function afficherZone(id) { const el = document.getElementById(id); if (el) el.classList.add('visible'); }
function masquerZone(id)  { const el = document.getElementById(id); if (el) el.classList.remove('visible'); }

// Échappement HTML (anti-XSS) — utilisé partout où du contenu externe est injecté dans innerHTML
function esc(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

async function viderCache() {
  const btn = document.getElementById('btn-vider-cache');
  if (btn) { btn.textContent = t('vider_cache_en_cours'); btn.disabled = true; }
  try {
    const cles = await caches.keys();
    await Promise.all(cles.map(k => caches.delete(k)));
    if ('serviceWorker' in navigator) {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map(r => r.unregister()));
    }
    if (btn) btn.textContent = t('session_renouvelee');
    setTimeout(() => { window.location.href = '/?v=' + Date.now(); }, 600);
  } catch {
    if (btn) { btn.textContent = t('erreur_simple'); btn.disabled = false; }
    setTimeout(() => { if (btn) { btn.textContent = t('renouveler_session'); btn.disabled = false; } }, 2000);
  }
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {});
}

// ════════════════════════════════════════════════════════
// ── Migration ancien format ────────────────────────────
// ════════════════════════════════════════════════════════
function migrerAncienFormat() {
  const session = getSession();
  if (!session) return;
  if (getUserLocal()) return;
  const oldMeds   = (() => { try { return JSON.parse(localStorage.getItem('ms_medicaments') || '[]');  } catch { return []; }   })();
  const oldProche = (() => { try { return JSON.parse(localStorage.getItem('ms_proche') || 'null');     } catch { return null; } })();
  const oldHisto  = (() => { try { return JSON.parse(localStorage.getItem('ms_historique') || '[]');   } catch { return []; }   })();
  const prenomAncien = session.prenom || null;
  if (oldMeds.length || oldProche || oldHisto.length || prenomAncien) {
    sauverUserLocal({ telephone: session.telephone || '', prenom: prenomAncien, medicaments: oldMeds, proche: oldProche, historique_repas: oldHisto.slice(0, 60) });
  }
  ['ms_medicaments','ms_proche','ms_historique','ms_prenom','ms_telephone','ms_token'].forEach(k => localStorage.removeItem(k));
  if (session && !session.token) deconnecterSession();
}

// ════════════════════════════════════════════════════════
// ── Init ───────────────────────────────────────────────
// ════════════════════════════════════════════════════════
// ════════════════════════════════════════════════════════
// ── Onboarding aidant ──────────────────────────────────
// ════════════════════════════════════════════════════════
const OB_TOTAL = 5;
let _obEtape = 1;

function obAfficherEtape(n) {
  _obEtape = n;
  // Masque toutes les étapes
  document.querySelectorAll('.ob-etape').forEach(el => el.classList.remove('actif'));
  // Affiche l'étape courante (step-fin si n > OB_TOTAL)
  const id = n > OB_TOTAL ? 'ob-step-fin' : `ob-step-${n}`;
  const el = document.getElementById(id);
  if (el) el.classList.add('actif');
  // Barre de progression
  const pct = Math.min((n - 1) / OB_TOTAL * 100, 100);
  const fill = document.getElementById('ob-progress-fill');
  if (fill) fill.style.width = pct + '%';
  // Label étape
  const label = document.getElementById('ob-etape-label');
  if (label) label.textContent = n > OB_TOTAL ? 'Configuration terminée !' : `Étape ${n} sur ${OB_TOTAL}`;
  // Bouton retour : visible dès l'étape 2, caché à l'étape 1 et à la fin
  const btnRetour = document.getElementById('ob-btn-retour');
  if (btnRetour) btnRetour.style.display = (n > 1 && n <= OB_TOTAL) ? 'flex' : 'none';
}

function obSuivant() {
  obAfficherEtape(_obEtape + 1);
}

function obPrecedent() {
  if (_obEtape > 1) obAfficherEtape(_obEtape - 1);
}

function obSauverProfil() {
  const prenom = document.getElementById('ob-prenom')?.value?.trim();
  if (prenom) {
    patchUserLocal({ prenom }); // planifierSync déclenché en interne
    _invaliderEtRechargerCacheUrgence();
  }
  obSuivant();
}

function obSauverProche() {
  const prenom = document.getElementById('ob-proche-prenom')?.value?.trim();
  const tel    = document.getElementById('ob-proche-tel')?.value?.trim();
  if (prenom && tel) {
    patchUserLocal({ proche: { prenom, telephone: tel } }); // planifierSync déclenché en interne
    _invaliderEtRechargerCacheUrgence();
  }
  obSuivant();
}

function obSauverPin() {
  const pin = document.getElementById('ob-pin')?.value?.trim();
  if (pin && /^\d{4}$/.test(pin)) {
    localStorage.setItem(cleUser('ms_pin'), pin);
  } else if (pin) {
    alert('Le code PIN doit être exactement 4 chiffres.');
    return;
  }
  obSuivant();
}

async function obActiverNotifs() {
  const statut = document.getElementById('ob-notif-statut');
  try {
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      if (statut) statut.textContent = '✅ Notifications activées !';
      setTimeout(obSuivant, 1000);
    } else {
      if (statut) statut.textContent = '⚠️ Notifications refusées — vous pourrez les activer plus tard dans les paramètres.';
      setTimeout(obSuivant, 2000);
    }
  } catch {
    obSuivant();
  }
}

function obTerminer() {
  localStorage.setItem(cleUser('ms_onboarding_done'), 'true');
  _lancerSession();
}

document.addEventListener('DOMContentLoaded', async () => {
  // Verrouille l'orientation en portrait (PWA + navigateurs compatibles)
  try {
    if (screen?.orientation?.lock) await screen.orientation.lock('portrait');
  } catch (_) { /* ignoré si non supporté (iOS Safari) */ }

  migrerAncienFormat();
  appliquerTraductions();   // applique la langue sauvegardée dès le premier rendu
  const session = getSession();
  if (!session) { allerA('ecran-inscription'); return; }

  // Premier lancement ou onboarding non terminé → onboarding aidant
  demarrerApp();
});

// Vérifie les médicaments oubliés et met à jour la pastille dès que
// l'utilisateur revient dans l'app (depuis l'arrière-plan)
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) {
    appliquerModeHeure();            // rafraîchit le mode nuit (respect de la préférence)
    reessayerSyncEnAttente();        // pousse les données hors-ligne en attente
    verifierMedsOublies();
    getMedicaments().forEach(planifierNotification);
  }
});
