import React, { useState } from 'react';
import { TextField, Button, Grid } from '@mui/material';

const PlayerInput: React.FC = () => {
  const [playerInput, setPlayerInput] = useState<string>('');

  const handlePlayerInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPlayerInput(event.target.value);
  };

  const handleAddPlayer = (): void => {
    if (playerInput.trim() !== '') {
      // setPlayerList([...playerList, playerInput]);
      setPlayerInput('');
    }
  };

  return (
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
  );
};

export default PlayerInput;
