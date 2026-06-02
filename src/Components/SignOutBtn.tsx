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
        borderColor: '#2a2d35',
        color: '#8b949e',
        fontSize: '0.72rem',
        py: 0.6,
        px: 1.25,
        '&:hover': {
          borderColor: '#f85149',
          color: '#f85149',
          backgroundColor: 'rgba(248, 81, 73, 0.06)',
        },
      }}
    >
      {t('auth.signOut')}
    </Button>
  );
};

export default SignOutButton;
