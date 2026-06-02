import React, { useEffect, useState } from 'react';
import { getPlayers } from '../firebase/players';
import { Player } from '../types/player';
import { Typography, Grid, Box } from '@mui/material';
import { useLanguage } from '../i18n/LanguageContext';

export const PlayersList: React.FC = () => {
  const { t } = useLanguage();
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchPlayers = async () => {
      const loadedPlayers = await getPlayers();
      setPlayers(loadedPlayers);
    };
    fetchPlayers();
  }, []);

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box sx={{ width: 3, height: 18, backgroundColor: '#e8670a' }} />
        <Typography sx={{
          fontFamily: '"Rajdhani", sans-serif',
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#8b949e',
        }}>
          {t('roster.savedOperators')}
        </Typography>
        {players.length > 0 && (
          <Typography sx={{
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: '#e8670a',
            fontWeight: 600,
          }}>
            [{players.length}]
          </Typography>
        )}
      </Box>

      <Grid container spacing={1}>
        {players.map(player => (
          <Grid item xs={6} sm={4} key={player.id}>
            <Box sx={{
              border: '1px solid #2a2d35',
              borderLeft: '2px solid #e8670a',
              backgroundColor: '#111318',
              px: 1.5,
              py: 1,
              transition: 'border-color 0.2s ease',
              '&:hover': {
                borderLeftColor: '#ff8c3a',
                backgroundColor: 'rgba(232, 103, 10, 0.05)',
              },
            }}>
              <Typography sx={{
                fontFamily: '"Rajdhani", sans-serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
                color: '#c9d1d9',
              }}>
                {player.name}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
