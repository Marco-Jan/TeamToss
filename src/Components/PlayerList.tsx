import React, { useEffect, useState } from 'react';
import { getPlayers } from '../firebase/players';
import { Player } from '../types/player';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';

export const PlayersList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const loadedPlayers = await getPlayers();
      setPlayers(loadedPlayers);
    };

    fetchPlayers();
  }, []);

  return (
    <Box style={{ margin: '20px 0' }}>
      <Typography variant="h6" gutterBottom component="div">
        Save your favorite's
      </Typography>
      <Grid container spacing={2}>
        {players.map(player => (
          <Grid item xs={12} sm={6} md={4} key={player.id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" component="div" style={{ fontSize: '1.25rem' }}>
                  {player.name}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
