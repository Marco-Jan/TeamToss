import React from 'react';
import { Box, Typography } from '@mui/material';
import { useLanguage } from '../i18n/LanguageContext';
import { Lang } from '../i18n/translations';

const LANGS: Lang[] = ['de', 'en'];

const LanguageToggle: React.FC = () => {
  const { lang, setLang } = useLanguage();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25 }}>
      {LANGS.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 && (
            <Typography sx={{ color: '#272D39', fontSize: '0.7rem', px: 0.25 }}>|</Typography>
          )}
          <Typography
            component="button"
            onClick={() => setLang(l)}
            sx={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              p: 0,
              fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: lang === l ? '#FF6A2B' : '#9AA4B2',
              transition: 'color 0.15s ease',
              '&:hover': { color: lang === l ? '#FF6A2B' : '#EAEDF2' },
            }}
            aria-pressed={lang === l}
          >
            {l}
          </Typography>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default LanguageToggle;
