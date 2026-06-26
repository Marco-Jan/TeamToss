import { createTheme } from '@mui/material/styles';

// ── Design tokens ──────────────────────────────────────────────
// Dark & sporty: deep blue-black base, energetic orange brand,
// neon team colours. Display = Archivo (athletic), UI = Plus Jakarta Sans.
export const tokens = {
  bg: '#0B0D12',
  surface: '#161A22',
  surface2: '#1E232E',
  border: '#272D39',
  border2: '#333B49',
  ink: '#F2F4F8',
  muted: '#9AA4B2',
  faint: '#5B6472',
  brand: '#FF6A2B',
  brandLight: '#FF8A4D',
  brandDark: '#E8540F',
  danger: '#FB5A52',
  teal: '#22D3C5',
};

export const DISPLAY_FONT = '"Archivo Variable", "Plus Jakarta Sans Variable", sans-serif';
export const BODY_FONT = '"Plus Jakarta Sans Variable", "Helvetica", "Arial", sans-serif';

// Neon "jersey" colours, one per team (cycles for >8 teams).
export const TEAM_COLORS = [
  '#FF6A2B', // orange
  '#22D3C5', // teal
  '#4D8BFF', // blue
  '#A78BFA', // violet
  '#F472B6', // pink
  '#A3E635', // lime
  '#FBBF24', // amber
  '#FB7185', // rose
];

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: tokens.brand,
      light: tokens.brandLight,
      dark: tokens.brandDark,
      contrastText: '#0B0D12',
    },
    secondary: {
      main: tokens.teal,
      light: '#5EEAD4',
      dark: '#14B8A6',
      contrastText: '#0B0D12',
    },
    background: {
      default: tokens.bg,
      paper: tokens.surface,
    },
    text: {
      primary: tokens.ink,
      secondary: tokens.muted,
    },
    divider: tokens.border,
    error: { main: tokens.danger },
    success: { main: tokens.teal },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: BODY_FONT,
    h1: { fontFamily: DISPLAY_FONT, fontWeight: 800, letterSpacing: '-0.01em' },
    h2: { fontFamily: DISPLAY_FONT, fontWeight: 800, letterSpacing: '-0.01em' },
    h3: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    h6: { fontFamily: DISPLAY_FONT, fontWeight: 700 },
    button: { fontWeight: 700 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          margin: 0,
          borderRadius: 12,
          letterSpacing: '0.01em',
          fontWeight: 700,
          fontFamily: BODY_FONT,
          fontSize: '0.95rem',
          textTransform: 'none',
          paddingTop: 10,
          paddingBottom: 10,
        },
        contained: {
          background: 'linear-gradient(135deg, #FF8A4D, #FF6A2B)',
          color: '#0B0D12',
          boxShadow: '0 6px 20px rgba(255, 106, 43, 0.30)',
          '&:hover': {
            background: 'linear-gradient(135deg, #FF9B61, #FF7434)',
            boxShadow: '0 8px 28px rgba(255, 106, 43, 0.45)',
          },
        },
        outlined: {
          borderRadius: 12,
          borderColor: tokens.border2,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 16,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: tokens.surface2,
            fontFamily: BODY_FONT,
            fontSize: '1rem',
            '& fieldset': { borderColor: tokens.border },
            '&:hover fieldset': { borderColor: tokens.border2 },
            '&.Mui-focused fieldset': { borderColor: tokens.brand, borderWidth: '2px' },
          },
          '& .MuiInputLabel-root': {
            fontFamily: BODY_FONT,
            fontSize: '0.95rem',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: tokens.brand,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          fontFamily: BODY_FONT,
          '& fieldset': { borderColor: tokens.border },
          '&:hover fieldset': { borderColor: tokens.border2 },
          '&.Mui-focused fieldset': { borderColor: tokens.brand },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 'unset',
        },
        indicator: {
          display: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: BODY_FONT,
          fontWeight: 700,
          letterSpacing: '0.01em',
          fontSize: '0.92rem',
          textTransform: 'none',
          color: tokens.muted,
          minHeight: 'unset',
          borderRadius: 10,
          margin: 3,
          padding: '8px 12px',
          transition: 'color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
          // Aktiver Tab "hebt sich" mit leichtem 3D-Effekt aus der Leiste.
          '&.Mui-selected': {
            color: tokens.ink,
            background: `linear-gradient(180deg, ${tokens.surface2}, ${tokens.surface})`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 0 #0B0D12, 0 4px 10px rgba(0,0,0,0.5)',
          },
          '&.Mui-disabled': {
            color: tokens.faint,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: tokens.surface,
          border: `1px solid ${tokens.border}`,
          borderRadius: 18,
          backgroundImage: 'none',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          color: tokens.ink,
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontFamily: BODY_FONT,
          color: tokens.muted,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: BODY_FONT,
          borderRadius: 8,
          '&.Mui-selected': { backgroundColor: 'rgba(255, 106, 43, 0.15)' },
          '&:hover': { backgroundColor: 'rgba(255, 106, 43, 0.08)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { background: 'transparent', boxShadow: 'none' },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
  },
});
