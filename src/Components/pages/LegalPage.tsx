import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useLanguage } from '../../i18n/LanguageContext';
import { legalContent, LegalType, Block } from '../../i18n/legalContent';

// ── Shared sub-components ──────────────────────────────────────────────────

function Strong({ children }: { children: React.ReactNode }) {
  return (
    <Typography component="span" sx={{
      fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
      color: '#EAEDF2',
      fontSize: 'inherit',
    }}>
      {children}
    </Typography>
  );
}

// Rendert **fett** markierte Abschnitte innerhalb eines Textes.
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <Strong key={i}>{part.slice(2, -2)}</Strong>
      : <React.Fragment key={i}>{part}</React.Fragment>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ mb: 3.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
        <Box sx={{ width: 3, height: 16, backgroundColor: '#FF6A2B', flexShrink: 0 }} />
        <Typography sx={{
          fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#FF6A2B',
        }}>
          {title}
        </Typography>
      </Box>
      <Box>{children}</Box>
    </Box>
  );
}

function Para({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{
      fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
      fontSize: '0.95rem',
      color: '#9AA4B2',
      lineHeight: 1.7,
      letterSpacing: '0.02em',
      mb: 1,
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
            fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
            fontSize: '0.95rem',
            color: '#9AA4B2',
            lineHeight: 1.7,
          }}>
            {renderInline(item)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function renderBlock(block: Block, i: number): React.ReactNode {
  switch (block.type) {
    case 'lead':
      return <Para key={i}><Strong>{block.text}</Strong></Para>;
    case 'p':
      return <Para key={i}>{renderInline(block.text)}</Para>;
    case 'lines':
      return (
        <Para key={i}>
          {block.lines.map((line, li) => (
            <React.Fragment key={li}>
              {renderInline(line)}
              {li < block.lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </Para>
      );
    case 'bullets':
      return <BulletList key={i} items={block.items} />;
  }
}

// ── Page shell ─────────────────────────────────────────────────────────────

interface LegalPageProps {
  type: LegalType;
}

const LegalPage: React.FC<LegalPageProps> = ({ type }) => {
  const { lang, t } = useLanguage();
  const sections = legalContent[lang][type];
  const bindingNote = t('legal.bindingNote');

  return (
    <Box>
      {/* Back link */}
      <RouterLink to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <ArrowBackIcon sx={{ fontSize: '0.75rem', color: '#9AA4B2' }} />
        <Typography sx={{
          fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
          fontSize: '0.62rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: '#9AA4B2',
          fontWeight: 600,
          transition: 'color 0.15s ease',
          '&:hover': { color: '#EAEDF2' },
        }}>
          {t('legal.backToApp')}
        </Typography>
      </RouterLink>

      {/* Title */}
      <Box sx={{ mt: 3, mb: 4, borderBottom: '1px solid #272D39', pb: 2 }}>
        <Typography sx={{
          fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: '1.5rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: '#EAEDF2',
          lineHeight: 1,
        }}>
          {t(`legal.title.${type}`)}
        </Typography>
      </Box>

      {/* Hinweis: nur in EN gesetzt (deutsche Fassung ist verbindlich) */}
      {bindingNote && (
        <Typography sx={{
          fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
          fontSize: '0.8rem',
          fontStyle: 'italic',
          color: '#6B7480',
          lineHeight: 1.6,
          mb: 3,
        }}>
          {bindingNote}
        </Typography>
      )}

      {/* Content */}
      {sections.map((section, si) => (
        <Section key={si} title={section.title}>
          {section.blocks.map((block, bi) => renderBlock(block, bi))}
        </Section>
      ))}
    </Box>
  );
};

export default LegalPage;
