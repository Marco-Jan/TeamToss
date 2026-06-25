import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { auth, isAdmin, getAdminStats, AdminStats } from '../../firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../../i18n/LanguageContext';
import { tokens, DISPLAY_FONT, BODY_FONT } from '../Thema/theme';

// ── Sub-components ───────────────────────────────────────────────────────

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <Box sx={{
      borderRadius: '16px',
      overflow: 'hidden',
      border: `1px solid ${tokens.border}`,
      backgroundColor: tokens.surface,
    }}>
      <Box sx={{ height: 4, backgroundColor: color }} />
      <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Typography sx={{
          fontFamily: BODY_FONT,
          fontWeight: 700,
          fontSize: '0.7rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: tokens.muted,
        }}>
          {label}
        </Typography>
        <Typography sx={{
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          fontSize: '2.4rem',
          lineHeight: 1,
          color: color,
        }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <Typography sx={{
      fontFamily: BODY_FONT,
      fontSize: '0.95rem',
      color: tokens.muted,
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
        <ArrowBackIcon sx={{ fontSize: '0.95rem', color: tokens.muted }} />
        <Typography sx={{
          fontFamily: BODY_FONT,
          fontSize: '0.85rem',
          color: tokens.muted,
          fontWeight: 600,
          transition: 'color 0.15s ease',
          '&:hover': { color: tokens.ink },
        }}>
          {t('legal.backToApp')}
        </Typography>
      </RouterLink>

      {/* Title */}
      <Box sx={{ mt: 2.5, mb: 4, borderBottom: `1px solid ${tokens.border}`, pb: 2 }}>
        <Typography component="h1" sx={{
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          fontSize: '1.9rem',
          letterSpacing: '-0.01em',
          color: tokens.ink,
          lineHeight: 1.1,
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
