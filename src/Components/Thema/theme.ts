import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#e8670a',
      light: '#ff8c3a',
      dark: '#b34f00',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2dd4bf',
      light: '#5eead4',
      dark: '#14b8a6',
      contrastText: '#0a0b0d',
    },
    background: {
      default: '#08090a',
      paper: '#111318',
    },
    text: {
      primary: '#c9d1d9',
      secondary: '#8b949e',
    },
    divider: '#2a2d35',
    error: {
      main: '#f85149',
    },
    success: {
      main: '#2dd4bf',
    },
  },
  shape: {
    borderRadius: 0,
  },
  typography: {
    fontFamily: '"Rajdhani", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' },
    h2: { fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' },
    h3: { fontWeight: 600, letterSpacing: '0.06em' },
    h6: { fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '10px',
          borderRadius: 0,
          letterSpacing: '0.12em',
          fontWeight: 700,
          fontFamily: '"Rajdhani", sans-serif',
          fontSize: '0.85rem',
          textTransform: 'uppercase',
        },
        contained: {
          background: 'linear-gradient(135deg, #e8670a, #b34f00)',
          border: '1px solid #e8670a',
          boxShadow: '0 0 12px rgba(232, 103, 10, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #ff8c3a, #e8670a)',
            boxShadow: '0 0 24px rgba(232, 103, 10, 0.45)',
          },
        },
        outlined: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#111318',
          border: '1px solid #2a2d35',
          borderRadius: 0,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 0,
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: '1rem',
            letterSpacing: '0.05em',
            '& fieldset': { borderColor: '#2a2d35' },
            '&:hover fieldset': { borderColor: '#e8670a' },
            '&.Mui-focused fieldset': { borderColor: '#e8670a' },
          },
          '& .MuiInputLabel-root': {
            fontFamily: '"Rajdhani", sans-serif',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.85rem',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e8670a',
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: { borderRadius: 0 },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontFamily: '"Rajdhani", sans-serif',
          '& fieldset': { borderColor: '#2a2d35' },
          '&:hover fieldset': { borderColor: '#e8670a' },
          '&.Mui-focused fieldset': { borderColor: '#e8670a' },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          fontSize: '0.85rem',
          '&.Mui-focused': { color: '#e8670a' },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #2a2d35',
        },
        indicator: {
          backgroundColor: '#e8670a',
          height: '2px',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 600,
          letterSpacing: '0.12em',
          fontSize: '0.82rem',
          textTransform: 'uppercase',
          color: '#8b949e',
          '&.Mui-selected': {
            color: '#e8670a',
          },
          '&.Mui-disabled': {
            color: '#3a3d45',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#111318',
          border: '1px solid #2a2d35',
          borderRadius: 0,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#c9d1d9',
          borderBottom: '1px solid #2a2d35',
        },
      },
    },
    MuiDialogContentText: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          color: '#8b949e',
          letterSpacing: '0.04em',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: '"Rajdhani", sans-serif',
          letterSpacing: '0.06em',
          '&.Mui-selected': { backgroundColor: 'rgba(232, 103, 10, 0.15)' },
          '&:hover': { backgroundColor: 'rgba(232, 103, 10, 0.08)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
  },
});
