import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { auth, isAdmin, getAdminStats, AdminStats } from '../../firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';

// ── Sub-components ───────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <Box sx={{
      border: '1px solid #2a2d35',
      borderTopWidth: '2px',
      borderTopColor: color,
      backgroundColor: '#111318',
      p: 2.5,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}>
      <Typography sx={{
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        fontSize: '0.55rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#8b949e',
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontFamily: '"Rajdhani", sans-serif',
        fontWeight: 700,
        fontSize: '2.25rem',
        lineHeight: 1,
        color: color,
      }}>
        {value}
      </Typography>
    </Box>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{
      fontFamily: '"Rajdhani", sans-serif',
      fontSize: '0.95rem',
      color: '#8b949e',
      lineHeight: 1.7,
    }}>
      {children}
    </Typography>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthReady(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!isAdmin(user)) return;
    getAdminStats()
      .then(setStats)
      .catch((e) => {
        console.error(e);
        setError('Statistik konnte nicht geladen werden. Sind die Firestore-Rules korrekt deployt?');
      });
  }, [user]);

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
          Admin Terminal
        </Typography>
      </Box>

      {!authReady ? (
        <Notice>Lade…</Notice>
      ) : !isAdmin(user) ? (
        <Notice>Kein Zugriff. Dieses Terminal ist nur für den Betreiber sichtbar.</Notice>
      ) : error ? (
        <Notice>{error}</Notice>
      ) : !stats ? (
        <Notice>Lade Statistik…</Notice>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 1.5,
        }}>
          <StatCard label="Nutzer gesamt" value={stats.totalUsers} color="#e8670a" />
          <StatCard label="Aktiv (7 Tage)" value={stats.activeLast7Days} color="#2dd4bf" />
          <StatCard label="Google-Konten" value={stats.googleUsers} color="#f0c030" />
          <StatCard label="Gäste" value={stats.guests} color="#a855f7" />
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
