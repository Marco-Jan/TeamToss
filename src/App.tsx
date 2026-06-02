import React, { useEffect, useState } from 'react';
import { Typography, Container, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import './App.css';
import { auth, registerUserPresence, isAdmin } from './firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';
import GoogleSignInButton from './Components/SignInBtn';
import GuestSignInButton from './Components/GuestSignInBtn';
import SignOutButton from './Components/SignOutBtn';
import TabNavigation from './Components/NavigationsBar';
import LegalPage from './Components/pages/LegalPage';
import AdminDashboard from './Components/pages/AdminDashboard';
import InfoModal from './Components/InfoModal';
import LanguageToggle from './Components/LanguageToggle';
import { useLanguage } from './i18n/LanguageContext';
import { theme } from './Components/Thema/theme';

const NAV_LINKS = [
  { to: '/impressum',   key: 'footer.impressum' },
  { to: '/agb',         key: 'footer.agb' },
  { to: '/datenschutz', key: 'footer.datenschutz' },
];

const App: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserPhoto(currentUser?.photoURL ?? '');
      if (currentUser) {
        // Zähl-Datensatz für Admin-Statistik anlegen/aktualisieren (Gäste mit Ablaufdatum).
        void registerUserPresence(currentUser);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth="md"
        sx={{ minHeight: '100vh', py: 3, display: 'flex', flexDirection: 'column' }}
      >
        {/* ── Header ── */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #2a2d35',
          pb: 2.5,
          mb: 3,
        }}>
          <RouterLink to="/" style={{ textDecoration: 'none' }}>
            <Box>
              <Typography sx={{
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 700,
                fontSize: '1.75rem',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: '#e8670a',
                lineHeight: 1,
              }}>
                TEAM<span style={{ color: '#c9d1d9' }}>TOSS</span>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.75 }}>
                <Box sx={{ width: 28, height: 2, backgroundColor: '#e8670a' }} />
                <Typography sx={{
                  fontSize: '0.6rem',
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: '#8b949e',
                  fontFamily: '"Rajdhani", sans-serif',
                  fontWeight: 600,
                }}>
                  {t('header.subtitle')}
                </Typography>
              </Box>
            </Box>
          </RouterLink>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <LanguageToggle />
            <InfoModal />
            {user ? (
              <>
                {isAdmin(user) && (
                  <RouterLink to="/admin" style={{ textDecoration: 'none' }}>
                    <Typography sx={{
                      fontFamily: '"Rajdhani", sans-serif',
                      fontWeight: 600,
                      fontSize: '0.72rem',
                      letterSpacing: '0.16em',
                      textTransform: 'uppercase',
                      color: '#8b949e',
                      px: 1,
                      transition: 'color 0.15s ease',
                      '&:hover': { color: '#e8670a' },
                    }}>
                      {t('nav.admin')}
                    </Typography>
                  </RouterLink>
                )}
                {userPhoto && (
                  <Box sx={{
                    width: 36,
                    height: 36,
                    border: '1px solid #e8670a',
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}>
                    <img
                      src={userPhoto}
                      alt="Profile"
                      style={{ width: '100%', height: '100%', display: 'block', objectFit: 'cover' }}
                    />
                  </Box>
                )}
                <SignOutButton />
              </>
            ) : (
              <>
                <GuestSignInButton />
                <GoogleSignInButton />
              </>
            )}
          </Box>
        </Box>

        {/* ── Main content ── */}
        <Box sx={{ flex: 1 }}>
          <Routes>
            <Route path="/"            element={<TabNavigation />} />
            <Route path="/impressum"   element={<LegalPage type="impressum" />} />
            <Route path="/agb"         element={<LegalPage type="agb" />} />
            <Route path="/datenschutz" element={<LegalPage type="datenschutz" />} />
            <Route path="/admin"       element={<AdminDashboard />} />
          </Routes>
        </Box>

        {/* ── Footer ── */}
        <Box component="footer" sx={{
          mt: 6,
          pt: 2,
          borderTop: '1px solid #1e2128',
          display: 'flex',
          justifyContent: 'center',
          gap: 4,
        }}>
          {NAV_LINKS.map(({ to, key }) => (
            <RouterLink key={to} to={to} style={{ textDecoration: 'none' }}>
              <Typography sx={{
                fontSize: '0.58rem',
                letterSpacing: '0.16em',
                color: '#3a3d45',
                textTransform: 'uppercase',
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 600,
                transition: 'color 0.15s ease',
                '&:hover': { color: '#8b949e' },
              }}>
                {t(key)}
              </Typography>
            </RouterLink>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
