// Zentrale Übersetzungstabelle für die App-Oberfläche (DE/EN).
// Rechtstexte liegen separat in legalContent.ts.

export type Lang = 'de' | 'en';

export const translations: Record<Lang, Record<string, string>> = {
  de: {
    // Header / Footer
    'header.subtitle': 'Faire Teams in Sekunden',
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
    'tab.randomizer': 'Gear Roll',

    // Randomizer / Gear-Generator
    'rng.pickGame': 'Spiel wählen',
    'rng.source.live': 'Live',
    'rng.mode.loadout': 'Loadout',
    'rng.mode.players': 'Pro Spieler',
    'rng.mode.challenge': 'Challenge',
    'rng.mode.task': 'Aufgabe',
    'rng.roll.loadout': 'Loadout würfeln',
    'rng.roll.players': 'Loadouts würfeln',
    'rng.roll.challenge': 'Challenge würfeln',
    'rng.roll.task': 'Aufgaben ziehen',
    'rng.task.teams': 'Wie viele Teams?',
    'rng.task.hint': 'Jedes Team bekommt eine zufällige Aufgabe.',
    'rng.task.customTitle': 'Eigene Aufgaben',
    'rng.task.customPlaceholder': 'Eigene Aufgabe hinzufügen',
    'rng.again': 'Nochmal',
    'rng.rolling': 'Würfelt…',
    'rng.loadingGear': 'Lade aktuelle Gear-Liste…',
    'rng.players.empty': 'Füge oben Spieler hinzu, um Loadouts zu würfeln. (Geteilt mit dem Team Builder.)',
    'rng.players.count': '{n} Spieler aus dem Team Builder',
    'rng.players.shared': 'Für alle gleich',
    'rng.challenge.hint': 'Eine zufällige Beschränkung für mehr Spaß.',

    // Team Builder
    'builder.addOperator': 'Spieler hinzufügen',
    'builder.numSquads': 'Wie viele Teams?',
    'builder.generate': 'Teams erstellen',
    'builder.generateAgain': 'Neu mischen',
    'builder.clear': 'Alle löschen',
    'builder.queuedOne': '{n} Spieler',
    'builder.queuedOther': '{n} Spieler',
    'builder.noQueued': 'Noch keine Spieler',
    'builder.emptyHint': 'Tippe oben Namen ein, um zu starten.',
    'builder.captainHint': 'Tipp: Stern antippen macht jemanden zum Captain (eigenes Team).',
    'builder.leaderHint': 'Tippe einen Namen an, um den Captain zu setzen.',
    'builder.squad': 'Team {n}',
    'builder.captainTooltip': 'Als Captain markieren – kommt in ein eigenes Team',
    'builder.duplicate': '„{name}" ist schon dabei',
    'builder.loadRoster': 'Gespeicherte Spieler',
    'builder.saveAll': 'Im Kader speichern',
    'builder.savedAll': '{n} im Kader gespeichert',

    // Coin Flip
    'coin.flip': 'WURF',
    'coin.heads': 'KOPF',
    'coin.tails': 'ZAHL',
    'coin.flipping': 'Wirft…',
    'coin.tap': 'Tippe auf die Münze',

    // Roster / Nicknames
    'roster.savedOperators': 'Gespeicherte Spieler',
    'roster.saveOperator': 'Spieler speichern',
    'roster.empty': 'Noch keine gespeicherten Spieler. Tippe oben jemanden ein und speichere ihn mit dem Lesezeichen-Symbol.',
    'roster.selectAll': 'Alle auswählen',
    'roster.deselectAll': 'Alle abwählen',
    'roster.duplicate': '„{name}" ist bereits gespeichert',
    'roster.confirmDelete': 'Löschen bestätigen',
    'roster.removePrompt': 'Diesen Spieler aus dem gespeicherten Kader entfernen?',
    'common.cancel': 'Abbrechen',
    'common.delete': 'Löschen',

    // Info-Modal
    'info.whatIsThis': 'WAS IST DAS HIER?',
    'info.intro': 'TeamToss ist ein kostenloser Team-Generator — perfekt wenn ihr schnell faire Teams aus eurer Gruppe braucht, ohne lange zu diskutieren.',
    'info.feat1.title': 'Teams erstellen',
    'info.feat1.desc': 'Trag deine Spieler ein, wähle die Anzahl der Teams — und TeamToss verteilt alle fair per Zufall.',
    'info.feat2.title': 'Kader speichern',
    'info.feat2.desc': 'Mit Google-Login speicherst du dein Team und lädst es im Team Builder per Klick — kein Eintippen mehr.',
    'info.feat3.title': 'Coin Flip',
    'info.feat3.desc': 'Wer darf zuerst wählen? Wirf eine Münze und lass das Schicksal entscheiden.',
    'info.feat4.title': 'Gear Roll',
    'info.feat4.desc': 'Würfle ein zufälliges Loadout pro Spiel, Loadouts fürs ganze Team oder eine Spaß-Challenge — Valorant & LoL mit Live-Daten.',

    // Admin
    'admin.title': 'Admin-Übersicht',
    'admin.loading': 'Lädt…',
    'admin.loadingStats': 'Lade Statistik…',
    'admin.noAccess': 'Kein Zugriff. Diese Seite ist nur für den Betreiber sichtbar.',
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
    'header.subtitle': 'Fair teams in seconds',
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
    'tab.randomizer': 'Gear Roll',

    // Randomizer / gear generator
    'rng.pickGame': 'Pick a game',
    'rng.source.live': 'Live',
    'rng.mode.loadout': 'Loadout',
    'rng.mode.players': 'Per player',
    'rng.mode.challenge': 'Challenge',
    'rng.mode.task': 'Task',
    'rng.roll.loadout': 'Roll loadout',
    'rng.roll.players': 'Roll loadouts',
    'rng.roll.challenge': 'Roll challenge',
    'rng.roll.task': 'Draw tasks',
    'rng.task.teams': 'How many teams?',
    'rng.task.hint': 'Each team gets a random task.',
    'rng.task.customTitle': 'Custom tasks',
    'rng.task.customPlaceholder': 'Add your own task',
    'rng.again': 'Again',
    'rng.rolling': 'Rolling…',
    'rng.loadingGear': 'Loading current gear list…',
    'rng.players.empty': 'Add players above to roll loadouts. (Shared with the Team Builder.)',
    'rng.players.count': '{n} players from the Team Builder',
    'rng.players.shared': 'Same for everyone',
    'rng.challenge.hint': 'A random restriction for extra spice.',

    // Team Builder
    'builder.addOperator': 'Add player',
    'builder.numSquads': 'How many teams?',
    'builder.generate': 'Make teams',
    'builder.generateAgain': 'Shuffle again',
    'builder.clear': 'Clear all',
    'builder.queuedOne': '{n} player',
    'builder.queuedOther': '{n} players',
    'builder.noQueued': 'No players yet',
    'builder.emptyHint': 'Type names above to get started.',
    'builder.captainHint': 'Tip: tap the star to make someone a captain (own team).',
    'builder.leaderHint': 'Tap a name to set the captain.',
    'builder.squad': 'Team {n}',
    'builder.captainTooltip': 'Mark as captain – goes into its own team',
    'builder.duplicate': '"{name}" is already added',
    'builder.loadRoster': 'Saved players',
    'builder.saveAll': 'Save to roster',
    'builder.savedAll': '{n} saved to roster',

    // Coin Flip
    'coin.flip': 'FLIP',
    'coin.heads': 'HEADS',
    'coin.tails': 'TAILS',
    'coin.flipping': 'Flipping…',
    'coin.tap': 'Tap the coin to flip',

    // Roster / Nicknames
    'roster.savedOperators': 'Saved players',
    'roster.saveOperator': 'Save player',
    'roster.empty': 'No saved players yet. Add someone above and save them with the bookmark icon.',
    'roster.selectAll': 'Select all',
    'roster.deselectAll': 'Deselect all',
    'roster.duplicate': '"{name}" is already saved',
    'roster.confirmDelete': 'Confirm Delete',
    'roster.removePrompt': 'Remove this player from the saved roster?',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',

    // Info modal
    'info.whatIsThis': 'WHAT IS THIS?',
    'info.intro': 'TeamToss is a free team generator — perfect when you quickly need fair teams from your group without long discussions.',
    'info.feat1.title': 'Make teams',
    'info.feat1.desc': 'Enter your players, pick the number of teams — and TeamToss splits everyone up fairly at random.',
    'info.feat2.title': 'Save Roster',
    'info.feat2.desc': 'With a Google login you save your team and load it in the Team Builder with one click — no more typing.',
    'info.feat3.title': 'Coin Flip',
    'info.feat3.desc': 'Who gets to pick first? Flip a coin and let fate decide.',
    'info.feat4.title': 'Gear Roll',
    'info.feat4.desc': 'Roll a random loadout per game, loadouts for the whole team, or a fun challenge — Valorant & LoL with live data.',

    // Admin
    'admin.title': 'Admin overview',
    'admin.loading': 'Loading…',
    'admin.loadingStats': 'Loading stats…',
    'admin.noAccess': 'No access. This page is only visible to the operator.',
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
