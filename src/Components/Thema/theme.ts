import { createTheme } from '@mui/material/styles';


export const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Blaue Farbe für primäre Aktionen
    },
    secondary: {
      main: '#dc004e', // Rote Farbe für sekundäre Aktionen
    },
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h6: {
      fontWeight: 600,
    },
  },
});

theme.components = {
  MuiButton: {
    styleOverrides: {
      root: {
        // Direkte Angabe von Margin, um den oben genannten Fehler zu vermeiden
        margin: '0 auto', // Entsprechend theme.spacing(1) bei einem Standardfaktor von 8
      },
    },
  },
};


