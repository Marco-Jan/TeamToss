import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { auth, isAdmin, getAdminStats, AdminStats } from '../../firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../../i18n/LanguageContext';

// ── Sub-components ───────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <Box sx={{
      border: '1px solid #272D39',
      borderTopWidth: '2px',
      borderTopColor: color,
      backgroundColor: '#161A22',
      p: 2.5,
      display: 'flex',
      flexDirection: 'column',
      gap: 1,
    }}>
      <Typography sx={{
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
        fontWeight: 700,
        fontSize: '0.55rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#9AA4B2',
      }}>
        {label}
      </Typography>
      <Typography sx={{
        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
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
      fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
      fontSize: '0.95rem',
      color: '#9AA4B2',
      lineHeight: 1.7,
    }}>
      {children}
    </Typography>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────

const AdminDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<boolean>(false);

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
        setError(true);
      });
  }, [user]);

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
          {t('admin.title')}
        </Typography>
      </Box>

      {!authReady ? (
        <Notice>{t('admin.loading')}</Notice>
      ) : !isAdmin(user) ? (
        <Notice>{t('admin.noAccess')}</Notice>
      ) : error ? (
        <Notice>{t('admin.error')}</Notice>
      ) : !stats ? (
        <Notice>{t('admin.loadingStats')}</Notice>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
          gap: 1.5,
        }}>
          <StatCard label={t('admin.totalUsers')} value={stats.totalUsers} color="#FF6A2B" />
          <StatCard label={t('admin.active7')} value={stats.activeLast7Days} color="#22D3C5" />
          <StatCard label={t('admin.googleAccounts')} value={stats.googleUsers} color="#FBBF24" />
          <StatCard label={t('admin.guests')} value={stats.guests} color="#A78BFA" />
        </Box>
      )}
    </Box>
  );
};

export default AdminDashboard;
