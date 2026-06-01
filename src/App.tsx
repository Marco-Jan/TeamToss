import React, { useEffect, useState } from 'react';
import { Typography, Container, Box } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import './App.css';
import { auth } from './firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';
import GoogleSignInButton from './Components/SignInBtn';
import SignOutButton from './Components/SignOutBtn';
import TabNavigation from './Components/NavigationsBar';
import LegalPage from './Components/pages/LegalPage';
import InfoModal from './Components/InfoModal';
import { theme } from './Components/Thema/theme';

const NAV_LINKS = [
  { to: '/impressum', label: 'Impressum' },
  { to: '/agb',       label: 'AGB' },
  { to: '/datenschutz', label: 'Datenschutz' },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setUserPhoto(currentUser?.photoURL ?? '');
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
                  Squad Generator
                </Typography>
              </Box>
            </Box>
          </RouterLink>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <InfoModal />
            {user ? (
              <>
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
              <GoogleSignInButton />
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
          {NAV_LINKS.map(({ to, label }) => (
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
                {label}
              </Typography>
            </RouterLink>
          ))}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
