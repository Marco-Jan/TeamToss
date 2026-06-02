// Zentrale Übersetzungstabelle für die App-Oberfläche (DE/EN).
// Rechtstexte liegen separat in legalContent.ts.

export type Lang = 'de' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
  de: {
    // Header / Footer
    'header.subtitle': 'Squad Generator',
    'nav.admin': 'Admin',
    'footer.impressum': 'Impressum',
    'footer.agb': 'AGB',
    'footer.datenschutz': 'Datenschutz',

    // Auth
    'auth.signIn': 'Anmelden',
    'auth.signOut': 'Abmelden',
    'auth.guest': 'Als Gast',

    // Gast-Dialog
    'guest.title': 'Als Gast fortfahren',
    'guest.bullet1': 'Dein Gast-Zugang und die zugehörigen Daten werden spätestens nach 30 Tagen automatisch gelöscht.',
    'guest.bullet2': 'Deine Eingaben (z. B. Spielerliste) werden lokal in deinem Browser gespeichert – nicht in deinem Konto.',
    'guest.bullet3': 'Beim Wechsel des Geräts oder Löschen der Browserdaten gehen diese Eingaben verloren.',
    'guest.bullet4': 'Gespeicherte Kader stehen nur mit Google-Anmeldung zur Verfügung.',
    'guest.confirm': 'Verstanden & fortfahren',

    // Navigation / Tabs
    'tab.teamBuilder': 'Team Builder',
    'tab.roster': 'Kader',
    'tab.coinFlip': 'Münzwurf',

    // Team Builder
    'builder.addOperator': 'Spieler hinzufügen',
    'builder.numSquads': 'Anzahl Squads',
    'builder.generate': 'Squads erstellen',
    'builder.clear': 'Liste leeren',
    'builder.queuedOne': '{n} Spieler in der Warteschlange',
    'builder.queuedOther': '{n} Spieler in der Warteschlange',
    'builder.noQueued': 'Keine Spieler in der Warteschlange',
    'builder.squad': 'Squad {n}',
    'builder.captainTooltip': 'Als Captain markieren (wird auf eigenes Squad verteilt)',

    // Coin Flip
    'coin.flip': 'WURF',
    'coin.heads': 'KOPF',
    'coin.tails': 'ZAHL',
    'coin.flipping': 'Wirft…',
    'coin.tap': 'Tippe auf die Münze',

    // Roster / Nicknames
    'roster.savedOperators': 'Gespeicherte Spieler',
    'roster.saveOperator': 'Spieler speichern',
    'roster.confirmDelete': 'Löschen bestätigen',
    'roster.removePrompt': 'Diesen Spieler aus dem gespeicherten Kader entfernen?',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',

    // Info-Modal
    'info.whatIsThis': 'WAS IST DAS HIER?',
    'info.intro': 'TeamToss ist ein kostenloser Squad Generator — perfekt wenn ihr schnell faire Teams aus eurer Gruppe braucht, ohne lange zu diskutieren.',
    'info.feat1.title': 'Squad Generator',
    'info.feat1.desc': 'Trag deine Spieler ein, wähle die Anzahl der Squads — und TeamToss verteilt alle fair per Zufall.',
    'info.feat2.title': 'Kader speichern',
    'info.feat2.desc': 'Mit Google-Login kannst du dein Team vorab im Kader speichern. Beim nächsten Mal einfach laden — kein Eintippen mehr.',
    'info.feat3.title': 'Coin Flip',
    'info.feat3.desc': 'Wer darf zuerst wählen? Wirf eine Münze und lass das Schicksal entscheiden.',

    // Admin
    'admin.title': 'Admin Terminal',
    'admin.loading': 'Lädt…',
    'admin.loadingStats': 'Lade Statistik…',
    'admin.noAccess': 'Kein Zugriff. Dieses Terminal ist nur für den Betreiber sichtbar.',
    'admin.error': 'Statistik konnte nicht geladen werden. Sind die Firestore-Rules korrekt deployt?',
    'admin.totalUsers': 'Nutzer gesamt',
    'admin.active7': 'Aktiv (7 Tage)',
    'admin.googleAccounts': 'Google-Konten',
    'admin.guests': 'Gäste',

    // Legal page shell
    'legal.backToApp': 'Zurück zur App',
    'legal.title.impressum': 'Impressum',
    'legal.title.agb': 'AGB',
    'legal.title.datenschutz': 'Datenschutz',
    'legal.bindingNote': '',
  },

  en: {
    // Header / Footer
    'header.subtitle': 'Squad Generator',
    'nav.admin': 'Admin',
    'footer.impressum': 'Imprint',
    'footer.agb': 'Terms',
    'footer.datenschutz': 'Privacy',

    // Auth
    'auth.signIn': 'Sign In',
    'auth.signOut': 'Sign Out',
    'auth.guest': 'Guest',

    // Guest dialog
    'guest.title': 'Continue as guest',
    'guest.bullet1': 'Your guest access and the associated data are automatically deleted after at most 30 days.',
    'guest.bullet2': 'Your input (e.g. the player list) is stored locally in your browser – not in your account.',
    'guest.bullet3': 'Switching devices or clearing your browser data will cause this input to be lost.',
    'guest.bullet4': 'Saved rosters are only available when signed in with Google.',
    'guest.confirm': 'Understood & continue',

    // Navigation / Tabs
    'tab.teamBuilder': 'Team Builder',
    'tab.roster': 'Roster',
    'tab.coinFlip': 'Coin Flip',

    // Team Builder
    'builder.addOperator': 'Add Operator',
    'builder.numSquads': 'Number of Squads',
    'builder.generate': 'Generate Squads',
    'builder.clear': 'Clear Roster',
    'builder.queuedOne': '{n} Operator Queued',
    'builder.queuedOther': '{n} Operators Queued',
    'builder.noQueued': 'No operators queued',
    'builder.squad': 'Squad {n}',
    'builder.captainTooltip': 'Mark as captain (placed in their own squad)',

    // Coin Flip
    'coin.flip': 'FLIP',
    'coin.heads': 'HEADS',
    'coin.tails': 'TAILS',
    'coin.flipping': 'Flipping…',
    'coin.tap': 'Tap the coin to flip',

    // Roster / Nicknames
    'roster.savedOperators': 'Saved Operators',
    'roster.saveOperator': 'Save Operator',
    'roster.confirmDelete': 'Confirm Delete',
    'roster.removePrompt': 'Remove this operator from the saved roster?',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',

    // Info modal
    'info.whatIsThis': 'WHAT IS THIS?',
    'info.intro': 'TeamToss is a free squad generator — perfect when you quickly need fair teams from your group without long discussions.',
    'info.feat1.title': 'Squad Generator',
    'info.feat1.desc': 'Enter your players, pick the number of squads — and TeamToss splits everyone up fairly at random.',
    'info.feat2.title': 'Save Roster',
    'info.feat2.desc': 'With a Google login you can save your team in the roster in advance. Next time just load it — no more typing.',
    'info.feat3.title': 'Coin Flip',
    'info.feat3.desc': 'Who gets to pick first? Flip a coin and let fate decide.',

    // Admin
    'admin.title': 'Admin Terminal',
    'admin.loading': 'Loading…',
    'admin.loadingStats': 'Loading stats…',
    'admin.noAccess': 'No access. This terminal is only visible to the operator.',
    'admin.error': 'Could not load the stats. Are the Firestore rules deployed correctly?',
    'admin.totalUsers': 'Total users',
    'admin.active7': 'Active (7 days)',
    'admin.googleAccounts': 'Google accounts',
    'admin.guests': 'Guests',

    // Legal page shell
    'legal.backToApp': 'Back to app',
    'legal.title.impressum': 'Imprint',
    'legal.title.agb': 'Terms of Use',
    'legal.title.datenschutz': 'Privacy Policy',
    'legal.bindingNote': 'This English text is a convenience translation. In case of doubt, the German version is legally binding.',
  },
};
