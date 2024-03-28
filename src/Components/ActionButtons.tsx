import { Button, Grid } from '@mui/material';



function ActionButtons({ onCoinToss, onGenerateTeams, onClearList }: { onCoinToss: () => void, onGenerateTeams: () => void, onClearList: () => void }) {
    return (
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={onCoinToss} sx={{
            width: 1 / 1,
            p: 0.75,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 5,
            fontSize: '0.875rem',
            fontWeight: '700',
            textAlign: 'center',
          }}>Münzwurf</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={onGenerateTeams}>Teams generieren</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={onClearList} sx={{ width: 1 / 2, margin: '20px 0px', boxShadow: 3 }}>Liste leeren</Button>
        </Grid>
      </Grid>
    );
  }
  
    export default ActionButtons;