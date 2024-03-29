// src/components/PlayersList.tsx
import React, { useEffect, useState } from 'react';
import { getPlayers } from '../firebase/players';
import { Player } from '../types/player';

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
    <div>
      <h2>Spielerliste</h2>
      <ul>
        {players.map(player => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
    </div>
  );
};
