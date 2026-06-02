import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

type LegalType = 'impressum' | 'agb' | 'datenschutz';

const TITLES: Record<LegalType, string> = {
  impressum:   'Impressum',
  agb:         'AGB',
  datenschutz: 'Datenschutz',
};

// ── Shared sub-components ──────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ width: 3, height: 16, backgroundColor: '#e8670a', flexShrink: 0 }} />
        <Typography sx={{
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#e8670a',
        }}>
          {title}
        </Typography>
      </Box>
      <Box sx={{ pl: 0 }}>
        {children}
      </Box>
    </Box>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '0.95rem',
      color: '#8b949e',
      lineHeight: 1.7,
      letterSpacing: '0.02em',
      mb: 1,
    }}>
      {children}
    </Typography>
  );
}

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <Typography component="span" sx={{
      fontFamily: '"Rajdhani", sans-serif',
      fontWeight: 700,
      color: '#c9d1d9',
      fontSize: 'inherit',
    }}>
      {children}
    </Typography>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
      {items.map((item, i) => (
        <Box component="li" key={i} sx={{ mb: 0.5 }}>
          <Typography sx={{
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: '0.95rem',
            color: '#8b949e',
            lineHeight: 1.7,
          }}>
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

// ── Legal content ──────────────────────────────────────────────────────────

function ImpressumContent() {
  return (
    <>
      <Section title="Angaben gemäß § 5 ECG und § 25 Mediengesetz">
        <Para><Strong>Medieninhaber und Betreiber</Strong></Para>
        <Para>
          Marco Jan<br />
          Körösistraße 196<br />
          8010 Graz<br />
          Österreich
        </Para>
      </Section>

      <Section title="Kontakt">
        <Para>
          E-Mail: <Strong>contact@walk-buddy.app</Strong>
        </Para>
      </Section>

      <Section title="Art des Mediums">
        <Para>
          TeamToss ist ein privates, nicht-kommerzielles Online-Tool ohne Gewinnabsicht.
          Gegenstand: Zufällige Zuteilung von Teilnehmern in Teams sowie digitaler Münzwurf.
        </Para>
      </Section>

      <Section title="Urheberrecht">
        <Para>
          Alle Inhalte dieser Website sind urheberrechtlich geschützt. Vervielfältigung, Bearbeitung
          oder Verbreitung sind ohne vorherige schriftliche Zustimmung des Inhabers untersagt.
        </Para>
      </Section>

      <Section title="Haftungshinweis">
        <Para>
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
          externer Links. Für den Inhalt verlinkter Seiten sind ausschließlich deren Betreiber verantwortlich.
        </Para>
      </Section>
    </>
  );
}

function AgbContent() {
  return (
    <>
      <Section title="§ 1 – Geltungsbereich">
        <Para>
          Diese Nutzungsbedingungen gelten für die Nutzung des Online-Tools <Strong>TeamToss</Strong>,
          betrieben von Marco Jan, Körösistraße 196, 8010 Graz, Österreich.
        </Para>
      </Section>

      <Section title="§ 2 – Beschreibung des Dienstes">
        <Para>
          TeamToss ist ein kostenloses, nicht-kommerzielles Online-Tool zur zufälligen Zuteilung
          von Teilnehmern in Teams sowie für einen digitalen Münzwurf. Der Dienst wird ohne Garantie
          für dauerhaften Betrieb oder Fehlerfreiheit angeboten.
        </Para>
      </Section>

      <Section title="§ 3 – Nutzungsbedingungen">
        <BulletList items={[
          'Die Nutzung von TeamToss ist kostenlos. Eine Anmeldung ist optional und wahlweise über Google Sign-In oder als anonymer Gast-Zugang möglich.',
          'Nutzerinnen und Nutzer sind für alle von ihnen eingegebenen Inhalte (z. B. Spielernamen) selbst verantwortlich.',
          'Die Nutzung zu rechtswidrigen, belästigenden oder diskriminierenden Zwecken ist untersagt.',
          'Es besteht kein Anspruch auf einen bestimmten Funktionsumfang oder auf ununterbrochene Verfügbarkeit.',
        ]} />
      </Section>

      <Section title="§ 4 – Gast-Zugänge">
        <BulletList items={[
          'Gast-Zugänge sind anonym und temporär. Sie werden mitsamt den zugehörigen Daten spätestens 30 Tage nach Erstellung automatisch und unwiderruflich gelöscht.',
          'Eingaben im Gast-Modus (z. B. Spielerlisten) werden ausschließlich lokal im Browser des Nutzers gespeichert und sind nicht geräteübergreifend verfügbar.',
          'Die Funktion zum dauerhaften Speichern von Rostern steht ausschließlich angemeldeten Google-Nutzern zur Verfügung.',
          'Es besteht kein Anspruch auf Wiederherstellung gelöschter Gast-Daten.',
        ]} />
      </Section>

      <Section title="§ 5 – Nutzungsstatistik">
        <Para>
          Der Betreiber erhebt zur Überwachung des laufenden Betriebs aggregierte, nicht zu
          Werbezwecken verwendete Nutzungszahlen (z. B. Anzahl der angemeldeten Konten und der
          aktiven Nutzer). Näheres regelt die Datenschutzerklärung.
        </Para>
      </Section>

      <Section title="§ 6 – Haftungsausschluss">
        <Para>
          Der Betreiber übernimmt keine Haftung für Schäden, die durch die Nutzung oder
          Nichtverfügbarkeit des Dienstes entstehen. Dies gilt insbesondere für direkte, indirekte
          oder Folgeschäden.
        </Para>
      </Section>

      <Section title="§ 7 – Änderungen">
        <Para>
          Der Betreiber behält sich vor, den Dienst und diese Nutzungsbedingungen jederzeit
          ohne Vorankündigung zu ändern oder den Betrieb einzustellen.
        </Para>
      </Section>

      <Section title="§ 8 – Anwendbares Recht">
        <Para>
          Es gilt österreichisches Recht unter Ausschluss des UN-Kaufrechts.
          Gerichtsstand ist Graz, Österreich.
        </Para>
      </Section>
    </>
  );
}

function DatenschutzContent() {
  return (
    <>
      <Section title="Verantwortlicher (Art. 4 Abs. 7 DSGVO)">
        <Para>
          Marco Jan<br />
          Körösistraße 196, 8010 Graz, Österreich<br />
          E-Mail: <Strong>contact@walk-buddy.app</Strong>
        </Para>
      </Section>

      <Section title="1 – Erhobene Daten">
        <Para><Strong>Ohne Anmeldung</Strong></Para>
        <Para>
          Es werden keine personenbezogenen Daten erhoben. Lokal eingegebene Spielernamen
          werden ausschließlich im Browser verarbeitet und nicht gespeichert.
        </Para>
        <Para><Strong>Bei Google-Anmeldung (optional)</Strong></Para>
        <Para>
          Bei Anmeldung via Google Sign-In werden folgende Daten von Google übermittelt und
          in unserer Datenbank gespeichert:
        </Para>
        <BulletList items={[
          'Anzeigename',
          'E-Mail-Adresse',
          'Profilbild-URL',
          'Eindeutige Google-User-ID',
          'Manuell gespeicherte Spielernamen (Nicknames)',
        ]} />
        <Para><Strong>Bei Gast-Nutzung (anonym, optional)</Strong></Para>
        <Para>
          Wählst du den anonymen Gast-Zugang, wird kein Name und keine E-Mail-Adresse erhoben.
          Gespeichert wird lediglich eine zufällig erzeugte, anonyme Kennung sowie Zeitstempel
          (Erstellung, letzte Aktivität) und ein Ablaufdatum. Spielerlisten und sonstige Eingaben
          im Gast-Modus verbleiben ausschließlich lokal in deinem Browser (localStorage) und werden
          nicht an unsere Datenbank übertragen.
        </Para>
      </Section>

      <Section title="2 – Zweck und Rechtsgrundlage">
        <Para>
          Die Verarbeitung erfolgt ausschließlich zur Bereitstellung des personalisierten
          Dienstes (gespeicherte Spielernamen über Sitzungen hinweg).
          Rechtsgrundlage: <Strong>Art. 6 Abs. 1 lit. a DSGVO</Strong> (Einwilligung durch
          aktive Anmeldung).
        </Para>
      </Section>

      <Section title="3 – Drittanbieter & Datentransfer">
        <Para>
          <Strong>Firebase Authentication & Cloud Firestore (Google LLC)</Strong>
        </Para>
        <Para>
          Zur Authentifizierung und Datenspeicherung nutzen wir Firebase von Google LLC,
          1600 Amphitheatre Parkway, Mountain View, CA 94043, USA. Daten werden auf
          Google-Servern gespeichert. Die Übertragung in die USA erfolgt auf Basis der
          EU-Standardvertragsklauseln (Art. 46 DSGVO).
        </Para>
        <Para>
          Datenschutzerklärung Google: policies.google.com/privacy
        </Para>
      </Section>

      <Section title="4 – Speicherdauer">
        <Para>
          <Strong>Google-Konten:</Strong> Gespeicherte Daten verbleiben, bis du dein Konto löschst
          oder aktiv die Löschung anforderst. Gespeicherte Spielernamen kannst du jederzeit selbst
          in der App löschen.
        </Para>
        <Para>
          <Strong>Gast-Zugänge:</Strong> Der anonyme Zähl-Datensatz wird spätestens 30 Tage nach
          Erstellung automatisch und unwiderruflich gelöscht (technische Umsetzung über eine
          Firestore-TTL-Richtlinie). Lokal im Browser gespeicherte Eingaben kannst du jederzeit
          selbst durch Löschen der Browserdaten entfernen.
        </Para>
      </Section>

      <Section title="5 – Nutzungsstatistik">
        <Para>
          Zur Sicherstellung des laufenden Betriebs kann der Betreiber aggregierte Kennzahlen
          einsehen, etwa die Gesamtzahl der angemeldeten Konten, die Anzahl aktiver Nutzer
          sowie das Verhältnis von Gast- zu Google-Zugängen. Es erfolgt keine Auswertung des
          individuellen Nutzungsverhaltens und keine Weitergabe zu Werbezwecken.
          Rechtsgrundlage: <Strong>Art. 6 Abs. 1 lit. f DSGVO</Strong> (berechtigtes Interesse am
          sicheren und stabilen Betrieb des Dienstes).
        </Para>
      </Section>

      <Section title="6 – Deine Rechte (Art. 15–22 DSGVO)">
        <BulletList items={[
          'Auskunft über gespeicherte Daten (Art. 15)',
          'Berichtigung unrichtiger Daten (Art. 16)',
          'Löschung deiner Daten – „Recht auf Vergessenwerden" (Art. 17)',
          'Einschränkung der Verarbeitung (Art. 18)',
          'Datenübertragbarkeit (Art. 20)',
          'Widerspruch gegen die Verarbeitung (Art. 21)',
        ]} />
        <Para>Zur Ausübung deiner Rechte: <Strong>contact@walk-buddy.app</Strong></Para>
      </Section>

      <Section title="7 – Beschwerderecht">
        <Para>
          Du hast das Recht, dich bei der österreichischen Datenschutzbehörde zu beschweren:
        </Para>
        <Para>
          <Strong>Österreichische Datenschutzbehörde</Strong><br />
          Barichgasse 40–42, 1030 Wien<br />
          dsb@dsb.gv.at
        </Para>
      </Section>

      <Section title="8 – Cookies und Tracking">
        <Para>
          TeamToss verwendet keine Tracking-Cookies und kein Web-Analytics.
          Firebase kann technisch notwendige Sitzungsdaten (Session-Token) verwenden.
        </Para>
      </Section>

      <Section title="Stand">
        <Para>Juni 2026</Para>
      </Section>
    </>
  );
}

// ── Page shell ─────────────────────────────────────────────────────────────

interface LegalPageProps {
  type: LegalType;
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const content = {
    impressum:   <ImpressumContent />,
    agb:         <AgbContent />,
    datenschutz: <DatenschutzContent />,
  }[type];

  return (
    <Box>
      {/* Back link */}
      <RouterLink to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <ArrowBackIcon sx={{ fontSize: '0.75rem', color: '#8b949e' }} />
        <Typography sx={{
          fontFamily: '"Rajdhani", sans-serif',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#8b949e',
          fontWeight: 600,
          transition: 'color 0.15s ease',
          '&:hover': { color: '#c9d1d9' },
        }}>
          Zurück zur App
        </Typography>
      </RouterLink>

      {/* Title */}
      <Box sx={{ mt: 3, mb: 4, borderBottom: '1px solid #2a2d35', pb: 2 }}>
        <Typography sx={{
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          fontSize: '1.5rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#c9d1d9',
          lineHeight: 1,
        }}>
          {TITLES[type]}
        </Typography>
      </Box>

      {/* Content */}
      {content}
    </Box>
  );
};

export default LegalPage;
