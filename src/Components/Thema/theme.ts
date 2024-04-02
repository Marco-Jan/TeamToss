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
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          margin: '10px',
        },
      },
    },
  },
  overrides: {
    MuiTableCell: {
      root: {
        backgroundColor: 'lightblue'
      },
      paddingDefault: {
        padding: '40px 24px 40px 16px',
      },
    },
  },
});
