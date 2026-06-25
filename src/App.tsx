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
import { theme, tokens, DISPLAY_FONT } from './Components/Thema/theme';

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
        sx={{ minHeight: '100vh', py: { xs: 2, sm: 3 }, px: { xs: 2, sm: 3 }, display: 'flex', flexDirection: 'column' }}
      >
        {/* ── Header ── */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1.5,
          pb: 2,
          mb: { xs: 2, sm: 3 },
          borderBottom: `1px solid ${tokens.border}`,
        }}>
          <RouterLink to="/" style={{ textDecoration: 'none' }} aria-label="TeamToss home">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
              {/* Coin mark */}
              <Box sx={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF8A4D, #FF6A2B)',
                boxShadow: '0 4px 14px rgba(255,106,43,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Typography sx={{ fontFamily: DISPLAY_FONT, fontWeight: 900, fontSize: '1.05rem', color: '#0B0D12', lineHeight: 1 }}>
                  T
                </Typography>
              </Box>
              <Box>
                <Typography sx={{
                  fontFamily: DISPLAY_FONT,
                  fontWeight: 800,
                  fontSize: '1.45rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: tokens.ink,
                }}>
                  Team<Box component="span" sx={{ color: tokens.brand }}>Toss</Box>
                </Typography>
                <Typography sx={{
                  fontSize: '0.72rem',
                  color: tokens.muted,
                  fontWeight: 600,
                  mt: 0.35,
                }}>
                  {t('header.subtitle')}
                </Typography>
              </Box>
            </Box>
          </RouterLink>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LanguageToggle />
            <InfoModal />
            {user ? (
              <>
                {isAdmin(user) && (
                  <RouterLink to="/admin" style={{ textDecoration: 'none' }}>
                    <Typography sx={{
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      color: tokens.muted,
                      px: 1,
                      transition: 'color 0.15s ease',
                      '&:hover': { color: tokens.brand },
                    }}>
                      {t('nav.admin')}
                    </Typography>
                  </RouterLink>
                )}
                {userPhoto && (
                  <Box sx={{
                    width: 34,
                    height: 34,
                    borderRadius: '50%',
                    border: `2px solid ${tokens.brand}`,
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
          pt: 2.5,
          borderTop: `1px solid ${tokens.border}`,
          display: 'flex',
          justifyContent: 'center',
          gap: 3,
        }}>
          {NAV_LINKS.map(({ to, key }) => (
            <RouterLink key={to} to={to} style={{ textDecoration: 'none' }}>
              <Typography sx={{
                fontSize: '0.78rem',
                color: tokens.faint,
                fontWeight: 600,
                transition: 'color 0.15s ease',
                '&:hover': { color: tokens.muted },
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
