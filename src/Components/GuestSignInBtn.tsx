import React, { useState } from 'react';
import { signInAsGuest } from '../firebase/firebaseInit';
import { Button, Dialog, DialogContent, DialogActions, Box, Typography } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import { useLanguage } from '../i18n/LanguageContext';

const GuestSignInButton: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleConfirm = async () => {
    setOpen(false);
    await signInAsGuest();
  };

  return (
    <>
      <Button
        variant="text"
        startIcon={<PersonOutlineIcon sx={{ fontSize: '1rem !important' }} />}
        onClick={() => setOpen(true)}
        sx={{
          m: 0,
          color: '#8b949e',
          fontSize: '0.75rem',
          py: 0.75,
          px: 1.5,
          '&:hover': {
            color: '#c9d1d9',
            backgroundColor: 'rgba(139, 148, 158, 0.08)',
          },
        }}
      >
        {t('auth.guest')}
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#111318',
            border: '1px solid #2a2d35',
            borderTop: '2px solid #e8670a',
            backgroundImage: 'none',
            maxWidth: 420,
          },
        }}
      >
        <DialogContent sx={{ px: 3, pt: 3, pb: 1 }}>
          <Typography sx={{
            fontFamily: '"Rajdhani", sans-serif',
            fontWeight: 700,
            fontSize: '0.7rem',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#e8670a',
            mb: 2,
          }}>
            {t('guest.title')}
          </Typography>

          <Box component="ul" sx={{ m: 0, pl: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              t('guest.bullet1'),
              t('guest.bullet2'),
              t('guest.bullet3'),
              t('guest.bullet4'),
            ].map((line, i) => (
              <Box component="li" key={i}>
                <Typography sx={{
                  fontFamily: '"Rajdhani", sans-serif',
                  fontSize: '0.92rem',
                  color: '#8b949e',
                  lineHeight: 1.6,
                }}>
                  {line}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 1.5 }}>
          <Button
            onClick={handleConfirm}
            variant="contained"
            sx={{ m: 0, fontSize: '0.75rem', px: 2 }}
          >
            {t('guest.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GuestSignInButton;
