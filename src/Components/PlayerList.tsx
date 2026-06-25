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
        <Box sx={{ width: 3, height: 18, backgroundColor: '#FF6A2B' }} />
        <Typography sx={{
          fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: '#9AA4B2',
        }}>
          {t('roster.savedOperators')}
        </Typography>
        {players.length > 0 && (
          <Typography sx={{
            fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
            fontSize: '0.65rem',
            letterSpacing: '0.12em',
            color: '#FF6A2B',
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
              borderRadius: '10px',
              border: '1px solid #272D39',
              borderLeft: '3px solid #FF6A2B',
              backgroundColor: '#161A22',
              px: 1.5,
              py: 1,
              transition: 'border-color 0.2s ease, background-color 0.2s ease',
              '&:hover': {
                borderLeftColor: '#FF8A4D',
                backgroundColor: 'rgba(255, 106, 43, 0.06)',
              },
            }}>
              <Typography sx={{
                fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
                fontWeight: 600,
                fontSize: '0.95rem',
                letterSpacing: '0.05em',
                color: '#EAEDF2',
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
