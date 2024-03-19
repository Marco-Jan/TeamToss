import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Grid } from '@mui/material';
import './App.css';

const App: React.FC = () => {
  const [playerInput, setPlayerInput] = useState<string>('');
  const [playerList, setPlayerList] = useState<string[]>([]);
  const [team1, setTeam1] = useState<string[]>([]);
  const [team2, setTeam2] = useState<string[]>([]);
  const [coinResult, setCoinResult] = useState<string>('');

  const handlePlayerInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPlayerInput(event.target.value);
  };

  const handleAddPlayer = (): void => {
    if (playerInput.trim() !== '') {
      setPlayerList([...playerList, playerInput]);
      setPlayerInput('');
    }
  };

  const handleClearList = (): void => {
    setPlayerList([]);
    setTeam1([]);
    setTeam2([]);
  };

  const handleCoinToss = (): void => {
    const x = 'Kopf';
    const y = 'Zahl';

    setTimeout(() => setCoinResult('.'), 200);
    setTimeout(() => setCoinResult('..'), 500);
    setTimeout(() => setCoinResult('...'), 800);

    setTimeout(() => {
      const coinToss = Math.random() <= 0.5 ? x : y;
      setCoinResult(coinToss);
    }, 1500);
  };

  const handleGenerateTeams = (): void => {
    const shuffledPlayers = shuffleArray(playerList);
    const halfLength = Math.ceil(shuffledPlayers.length / 2);
    const firstTeam = shuffledPlayers.slice(0, halfLength);
    const secondTeam = shuffledPlayers.slice(halfLength);

    setTeam1(firstTeam);
    setTeam2(secondTeam);
  };

  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom align="center">TeamToss</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Spielername"
            value={playerInput}
            onChange={handlePlayerInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleAddPlayer} sx={{ margin: '20px 0px' }}>Spieler hinzufügen</Button>
        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={handleCoinToss} sx={{
          width: 1 / 1,
          p: 1,
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
          color: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
          border: '1px solid',
          borderColor: (theme) =>
            theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
          borderRadius: 2,
          fontSize: '0.875rem',
          fontWeight: '700',
          textAlign: 'center',
        }}>Münzwurf</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={handleGenerateTeams}>Teams generieren</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleClearList} sx={{ margin: '20px 0px', boxShadow: 3}}>Liste leeren</Button>
        </Grid>
      </Grid>
      <Typography variant="h6" gutterBottom>Spielerliste:</Typography>
      <Typography>{playerList.join(', ')}</Typography>
      <Typography variant="h6" gutterBottom>Team 1:</Typography>
      <Typography variant="h5">{team1.join(', ')}</Typography>
      <Typography variant="h6" gutterBottom>Team 2:</Typography>
      <Typography variant="h5">{team2.join(', ')}</Typography>
      <Typography variant="h6" gutterBottom>Münzwurf Ergebnis:</Typography>
      <Typography variant="h3" gutterBottom>{coinResult}</Typography>
    </Container>
  );
};

export default App;
