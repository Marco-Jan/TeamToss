// Zweisprachige Inhalte für Impressum / AGB / Datenschutz.
// Inline-Fettung mit **doppelten Sternen** (wird in LegalPage gerendert).

import { Lang } from './translations';

export type LegalType = 'impressum' | 'agb' | 'datenschutz';

export type Block =
  | { type: 'p'; text: string }              // Absatz (darf **fett** enthalten)
  | { type: 'lead'; text: string }           // fette Zwischenüberschrift
  | { type: 'lines'; lines: string[] }       // mehrzeilig (z. B. Adresse)
  | { type: 'bullets'; items: string[] };    // Aufzählung

export interface Section {
  title: string;
  blocks: Block[];
}

type LegalData = Record<Lang, Record<LegalType, Section[]>>;

export const legalContent: LegalData = {
  de: {
    impressum: [
      {
        title: 'Angaben gemäß § 5 ECG und § 25 Mediengesetz',
        blocks: [
          { type: 'lead', text: 'Medieninhaber und Betreiber' },
          { type: 'lines', lines: ['Marco Jan', 'Körösistraße 196', '8010 Graz', 'Österreich'] },
        ],
      },
      {
        title: 'Kontakt',
        blocks: [{ type: 'p', text: 'E-Mail: **contact@walk-buddy.app**' }],
      },
      {
        title: 'Art des Mediums',
        blocks: [{ type: 'p', text: 'TeamToss ist ein privates, nicht-kommerzielles Online-Tool ohne Gewinnabsicht. Gegenstand: Zufällige Zuteilung von Teilnehmern in Teams sowie digitaler Münzwurf.' }],
      },
      {
        title: 'Urheberrecht',
        blocks: [{ type: 'p', text: 'Alle Inhalte dieser Website sind urheberrechtlich geschützt. Vervielfältigung, Bearbeitung oder Verbreitung sind ohne vorherige schriftliche Zustimmung des Inhabers untersagt.' }],
      },
      {
        title: 'Haftungshinweis',
        blocks: [{ type: 'p', text: 'Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich.' }],
      },
    ],

    agb: [
      { title: '§ 1 – Geltungsbereich', blocks: [{ type: 'p', text: 'Diese Nutzungsbedingungen gelten für die Nutzung des Online-Tools **TeamToss**, betrieben von Marco Jan, Körösistraße 196, 8010 Graz, Österreich.' }] },
      { title: '§ 2 – Beschreibung des Dienstes', blocks: [{ type: 'p', text: 'TeamToss ist ein kostenloses, nicht-kommerzielles Online-Tool zur zufälligen Zuteilung von Teilnehmern in Teams sowie für einen digitalen Münzwurf. Der Dienst wird ohne Garantie für dauerhaften Betrieb oder Fehlerfreiheit angeboten.' }] },
      { title: '§ 3 – Nutzungsbedingungen', blocks: [{ type: 'bullets', items: [
        'Die Nutzung von TeamToss ist kostenlos. Eine Anmeldung ist optional und wahlweise über Google Sign-In oder als anonymer Gast-Zugang möglich.',
        'Nutzerinnen und Nutzer sind für alle von ihnen eingegebenen Inhalte (z. B. Spielernamen) selbst verantwortlich.',
        'Die Nutzung zu rechtswidrigen, belästigenden oder diskriminierenden Zwecken ist untersagt.',
        'Es besteht kein Anspruch auf einen bestimmten Funktionsumfang oder auf ununterbrochene Verfügbarkeit.',
      ] }] },
      { title: '§ 4 – Gast-Zugänge', blocks: [{ type: 'bullets', items: [
        'Gast-Zugänge sind anonym und temporär. Sie werden mitsamt den zugehörigen Daten spätestens 30 Tage nach Erstellung automatisch und unwiderruflich gelöscht.',
        'Eingaben im Gast-Modus (z. B. Spielerlisten) werden ausschließlich lokal im Browser des Nutzers gespeichert und sind nicht geräteübergreifend verfügbar.',
        'Die Funktion zum dauerhaften Speichern von Kadern steht ausschließlich angemeldeten Google-Nutzern zur Verfügung.',
        'Es besteht kein Anspruch auf Wiederherstellung gelöschter Gast-Daten.',
      ] }] },
      { title: '§ 5 – Nutzungsstatistik', blocks: [{ type: 'p', text: 'Der Betreiber erhebt zur Überwachung des laufenden Betriebs aggregierte, nicht zu Werbezwecken verwendete Nutzungszahlen (z. B. Anzahl der angemeldeten Konten und der aktiven Nutzer). Näheres regelt die Datenschutzerklärung.' }] },
      { title: '§ 6 – Haftungsausschluss', blocks: [{ type: 'p', text: 'Der Betreiber übernimmt keine Haftung für Schäden, die durch die Nutzung oder Nichtverfügbarkeit des Dienstes entstehen. Dies gilt insbesondere für direkte, indirekte oder Folgeschäden.' }] },
      { title: '§ 7 – Änderungen', blocks: [{ type: 'p', text: 'Der Betreiber behält sich vor, den Dienst und diese Nutzungsbedingungen jederzeit ohne Vorankündigung zu ändern oder den Betrieb einzustellen.' }] },
      { title: '§ 8 – Anwendbares Recht', blocks: [{ type: 'p', text: 'Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Graz, Österreich.' }] },
    ],

    datenschutz: [
      { title: 'Verantwortlicher (Art. 4 Abs. 7 DSGVO)', blocks: [{ type: 'lines', lines: ['Marco Jan', 'Körösistraße 196, 8010 Graz, Österreich', 'E-Mail: **contact@walk-buddy.app**'] }] },
      { title: '1 – Erhobene Daten', blocks: [
        { type: 'lead', text: 'Ohne Anmeldung' },
        { type: 'p', text: 'Es werden keine personenbezogenen Daten erhoben. Lokal eingegebene Spielernamen werden ausschließlich im Browser verarbeitet und nicht gespeichert.' },
        { type: 'lead', text: 'Bei Google-Anmeldung (optional)' },
        { type: 'p', text: 'Bei Anmeldung via Google Sign-In werden folgende Daten von Google übermittelt und in unserer Datenbank gespeichert:' },
        { type: 'bullets', items: ['Anzeigename', 'E-Mail-Adresse', 'Profilbild-URL', 'Eindeutige Google-User-ID', 'Manuell gespeicherte Spielernamen (Nicknames)'] },
        { type: 'lead', text: 'Bei Gast-Nutzung (anonym, optional)' },
        { type: 'p', text: 'Wählst du den anonymen Gast-Zugang, wird kein Name und keine E-Mail-Adresse erhoben. Gespeichert wird lediglich eine zufällig erzeugte, anonyme Kennung sowie Zeitstempel (Erstellung, letzte Aktivität) und ein Ablaufdatum. Spielerlisten und sonstige Eingaben im Gast-Modus verbleiben ausschließlich lokal in deinem Browser (localStorage) und werden nicht an unsere Datenbank übertragen.' },
      ] },
      { title: '2 – Zweck und Rechtsgrundlage', blocks: [{ type: 'p', text: 'Die Verarbeitung erfolgt ausschließlich zur Bereitstellung des personalisierten Dienstes (gespeicherte Spielernamen über Sitzungen hinweg). Rechtsgrundlage: **Art. 6 Abs. 1 lit. a DSGVO** (Einwilligung durch aktive Anmeldung).' }] },
      { title: '3 – Drittanbieter & Datentransfer', blocks: [
        { type: 'lead', text: 'Firebase Authentication & Cloud Firestore (Google LLC)' },
        { type: 'p', text: 'Zur Authentifizierung und Datenspeicherung nutzen wir Firebase von Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Daten werden auf Google-Servern gespeichert. Die Übertragung in die USA erfolgt auf Basis der EU-Standardvertragsklauseln (Art. 46 DSGVO).' },
        { type: 'p', text: 'Datenschutzerklärung Google: policies.google.com/privacy' },
      ] },
      { title: '4 – Speicherdauer', blocks: [
        { type: 'p', text: '**Google-Konten:** Gespeicherte Daten verbleiben, bis du dein Konto löschst oder aktiv die Löschung anforderst. Gespeicherte Spielernamen kannst du jederzeit selbst in der App löschen.' },
        { type: 'p', text: '**Gast-Zugänge:** Der anonyme Zähl-Datensatz wird spätestens 30 Tage nach Erstellung automatisch und unwiderruflich gelöscht (technische Umsetzung über eine Firestore-TTL-Richtlinie). Lokal im Browser gespeicherte Eingaben kannst du jederzeit selbst durch Löschen der Browserdaten entfernen.' },
      ] },
      { title: '5 – Nutzungsstatistik', blocks: [{ type: 'p', text: 'Zur Sicherstellung des laufenden Betriebs kann der Betreiber aggregierte Kennzahlen einsehen, etwa die Gesamtzahl der angemeldeten Konten, die Anzahl aktiver Nutzer sowie das Verhältnis von Gast- zu Google-Zugängen. Es erfolgt keine Auswertung des individuellen Nutzungsverhaltens und keine Weitergabe zu Werbezwecken. Rechtsgrundlage: **Art. 6 Abs. 1 lit. f DSGVO** (berechtigtes Interesse am sicheren und stabilen Betrieb des Dienstes).' }] },
      { title: '6 – Deine Rechte (Art. 15–22 DSGVO)', blocks: [
        { type: 'bullets', items: [
          'Auskunft über gespeicherte Daten (Art. 15)',
          'Berichtigung unrichtiger Daten (Art. 16)',
          'Löschung deiner Daten – „Recht auf Vergessenwerden" (Art. 17)',
          'Einschränkung der Verarbeitung (Art. 18)',
          'Datenübertragbarkeit (Art. 20)',
          'Widerspruch gegen die Verarbeitung (Art. 21)',
        ] },
        { type: 'p', text: 'Zur Ausübung deiner Rechte: **contact@walk-buddy.app**' },
      ] },
      { title: '7 – Beschwerderecht', blocks: [
        { type: 'p', text: 'Du hast das Recht, dich bei der österreichischen Datenschutzbehörde zu beschweren:' },
        { type: 'lines', lines: ['**Österreichische Datenschutzbehörde**', 'Barichgasse 40–42, 1030 Wien', 'dsb@dsb.gv.at'] },
      ] },
      { title: '8 – Cookies und Tracking', blocks: [{ type: 'p', text: 'TeamToss verwendet keine Tracking-Cookies und kein Web-Analytics. Firebase kann technisch notwendige Sitzungsdaten (Session-Token) verwenden.' }] },
      { title: 'Stand', blocks: [{ type: 'p', text: 'Juni 2026' }] },
    ],
  },

  en: {
    impressum: [
      {
        title: 'Information pursuant to § 5 ECG and § 25 Austrian Media Act',
        blocks: [
          { type: 'lead', text: 'Media owner and operator' },
          { type: 'lines', lines: ['Marco Jan', 'Körösistraße 196', '8010 Graz', 'Austria'] },
        ],
      },
      {
        title: 'Contact',
        blocks: [{ type: 'p', text: 'Email: **contact@walk-buddy.app**' }],
      },
      {
        title: 'Type of medium',
        blocks: [{ type: 'p', text: 'TeamToss is a private, non-commercial online tool with no profit intent. Purpose: random assignment of participants into teams as well as a digital coin flip.' }],
      },
      {
        title: 'Copyright',
        blocks: [{ type: 'p', text: 'All content on this website is protected by copyright. Reproduction, modification or distribution is prohibited without the prior written consent of the owner.' }],
      },
      {
        title: 'Liability notice',
        blocks: [{ type: 'p', text: 'Despite careful review of content, we assume no liability for the content of external links. The operators of the linked pages are solely responsible for their content.' }],
      },
    ],

    agb: [
      { title: '§ 1 – Scope', blocks: [{ type: 'p', text: 'These terms of use apply to the use of the online tool **TeamToss**, operated by Marco Jan, Körösistraße 196, 8010 Graz, Austria.' }] },
      { title: '§ 2 – Description of the service', blocks: [{ type: 'p', text: 'TeamToss is a free, non-commercial online tool for the random assignment of participants into teams as well as for a digital coin flip. The service is provided without any guarantee of permanent operation or freedom from errors.' }] },
      { title: '§ 3 – Conditions of use', blocks: [{ type: 'bullets', items: [
        'Using TeamToss is free of charge. Signing in is optional and possible either via Google Sign-In or as an anonymous guest.',
        'Users are themselves responsible for all content they enter (e.g. player names).',
        'Use for unlawful, harassing or discriminatory purposes is prohibited.',
        'There is no entitlement to any particular set of features or to uninterrupted availability.',
      ] }] },
      { title: '§ 4 – Guest access', blocks: [{ type: 'bullets', items: [
        'Guest access is anonymous and temporary. It is automatically and irrevocably deleted, together with the associated data, at most 30 days after creation.',
        'Input in guest mode (e.g. player lists) is stored exclusively locally in the user’s browser and is not available across devices.',
        'The feature for permanently saving rosters is available exclusively to signed-in Google users.',
        'There is no entitlement to the recovery of deleted guest data.',
      ] }] },
      { title: '§ 5 – Usage statistics', blocks: [{ type: 'p', text: 'To monitor ongoing operation, the operator collects aggregated usage figures that are not used for advertising purposes (e.g. number of registered accounts and of active users). Further details are set out in the privacy policy.' }] },
      { title: '§ 6 – Disclaimer of liability', blocks: [{ type: 'p', text: 'The operator assumes no liability for damages arising from the use or unavailability of the service. This applies in particular to direct, indirect or consequential damages.' }] },
      { title: '§ 7 – Changes', blocks: [{ type: 'p', text: 'The operator reserves the right to change the service and these terms of use at any time without prior notice, or to discontinue operation.' }] },
      { title: '§ 8 – Applicable law', blocks: [{ type: 'p', text: 'Austrian law applies, excluding the UN Convention on Contracts for the International Sale of Goods. The place of jurisdiction is Graz, Austria.' }] },
    ],

    datenschutz: [
      { title: 'Controller (Art. 4(7) GDPR)', blocks: [{ type: 'lines', lines: ['Marco Jan', 'Körösistraße 196, 8010 Graz, Austria', 'Email: **contact@walk-buddy.app**'] }] },
      { title: '1 – Data collected', blocks: [
        { type: 'lead', text: 'Without signing in' },
        { type: 'p', text: 'No personal data is collected. Player names entered locally are processed exclusively in the browser and are not stored.' },
        { type: 'lead', text: 'With Google sign-in (optional)' },
        { type: 'p', text: 'When signing in via Google Sign-In, the following data is transmitted by Google and stored in our database:' },
        { type: 'bullets', items: ['Display name', 'Email address', 'Profile picture URL', 'Unique Google user ID', 'Manually saved player names (nicknames)'] },
        { type: 'lead', text: 'With guest use (anonymous, optional)' },
        { type: 'p', text: 'If you choose anonymous guest access, no name and no email address is collected. We store only a randomly generated, anonymous identifier as well as timestamps (creation, last activity) and an expiry date. Player lists and other input in guest mode remain exclusively local in your browser (localStorage) and are not transmitted to our database.' },
      ] },
      { title: '2 – Purpose and legal basis', blocks: [{ type: 'p', text: 'Processing is carried out exclusively to provide the personalized service (saved player names across sessions). Legal basis: **Art. 6(1)(a) GDPR** (consent through active sign-in).' }] },
      { title: '3 – Third parties & data transfer', blocks: [
        { type: 'lead', text: 'Firebase Authentication & Cloud Firestore (Google LLC)' },
        { type: 'p', text: 'For authentication and data storage we use Firebase by Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Data is stored on Google servers. The transfer to the USA is based on the EU Standard Contractual Clauses (Art. 46 GDPR).' },
        { type: 'p', text: 'Google privacy policy: policies.google.com/privacy' },
      ] },
      { title: '4 – Retention period', blocks: [
        { type: 'p', text: '**Google accounts:** Stored data remains until you delete your account or actively request deletion. You can delete saved player names yourself in the app at any time.' },
        { type: 'p', text: '**Guest access:** The anonymous tracking record is automatically and irrevocably deleted at most 30 days after creation (technically implemented via a Firestore TTL policy). You can remove input stored locally in the browser yourself at any time by clearing your browser data.' },
      ] },
      { title: '5 – Usage statistics', blocks: [{ type: 'p', text: 'To ensure ongoing operation, the operator can view aggregated metrics, such as the total number of registered accounts, the number of active users and the ratio of guest to Google access. There is no analysis of individual usage behaviour and no disclosure for advertising purposes. Legal basis: **Art. 6(1)(f) GDPR** (legitimate interest in the secure and stable operation of the service).' }] },
      { title: '6 – Your rights (Art. 15–22 GDPR)', blocks: [
        { type: 'bullets', items: [
          'Access to stored data (Art. 15)',
          'Rectification of inaccurate data (Art. 16)',
          'Erasure of your data – the “right to be forgotten” (Art. 17)',
          'Restriction of processing (Art. 18)',
          'Data portability (Art. 20)',
          'Objection to processing (Art. 21)',
        ] },
        { type: 'p', text: 'To exercise your rights: **contact@walk-buddy.app**' },
      ] },
      { title: '7 – Right to lodge a complaint', blocks: [
        { type: 'p', text: 'You have the right to lodge a complaint with the Austrian Data Protection Authority:' },
        { type: 'lines', lines: ['**Austrian Data Protection Authority**', 'Barichgasse 40–42, 1030 Vienna', 'dsb@dsb.gv.at'] },
      ] },
      { title: '8 – Cookies and tracking', blocks: [{ type: 'p', text: 'TeamToss uses no tracking cookies and no web analytics. Firebase may use technically necessary session data (session tokens).' }] },
      { title: 'Last updated', blocks: [{ type: 'p', text: 'June 2026' }] },
    ],
  },
};
