import Button from '@mui/material/Button';
import { handleSignOut } from '../firebase/firebaseInit';
import { useLanguage } from '../i18n/LanguageContext';

const SignOutButton: React.FC = () => {
  const { t } = useLanguage();
  return (
    <Button
      variant="outlined"
      onClick={handleSignOut}
      sx={{
        m: 0,
        borderColor: '#272D39',
        color: '#9AA4B2',
        fontSize: '0.72rem',
        py: 0.6,
        px: 1.25,
        '&:hover': {
          borderColor: '#FB5A52',
          color: '#FB5A52',
          backgroundColor: 'rgba(248, 81, 73, 0.06)',
        },
      }}
    >
      {t('auth.signOut')}
    </Button>
  );
};

export default SignOutButton;
