import React from 'react';
import { signInWithGoogle } from '../firebase/firebaseInit';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google';
import { useLanguage } from '../i18n/LanguageContext';

const SignInButton: React.FC = () => {
  const { t } = useLanguage();
  return (
    <Button
      variant="outlined"
      startIcon={<GoogleIcon sx={{ fontSize: '1rem !important' }} />}
      onClick={signInWithGoogle}
      sx={{
        m: 0,
        borderColor: '#e8670a',
        color: '#e8670a',
        fontSize: '0.75rem',
        py: 0.75,
        px: 1.5,
        '&:hover': {
          borderColor: '#ff8c3a',
          backgroundColor: 'rgba(232, 103, 10, 0.08)',
          color: '#ff8c3a',
        },
      }}
    >
      {t('auth.signIn')}
    </Button>
  );
};

export default SignInButton;
