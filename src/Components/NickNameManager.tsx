import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Für den Löschen-Button
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Für den Hinzufügen-Button
import { addNickname, getNicknames, deleteNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';

export interface NicknameManagerProps {
  onAddPlayer: (nickname: string) => void;
}

const NicknameManager: React.FC<NicknameManagerProps> = ({ onAddPlayer }) => {
  const [nickname, setNickname] = useState<string>('');
  const [nicknames, setNicknames] = useState<Nickname[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        fetchNicknames();
      } else {
        setNicknames([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchNicknames = async () => {
    const fetchedNicknames = await getNicknames();
    setNicknames(fetchedNicknames);
  };

  useEffect(() => {
    fetchNicknames();
  }, []);

  const handleAddNickname = async () => {
    if (nickname.trim() !== '') {
      await addNickname(nickname);
      setNickname('');
      await fetchNicknames();
    }
  };

  const handleDeleteNickname = async (id: string) => {
    await deleteNickname(id);
    await fetchNicknames();
  };

  return (
    <Box>
      <TextField
        fullWidth
        label="Spielername"
        value={nickname}
        onChange={e => setNickname(e.target.value)}
        margin="normal"
      />
      <Button
        variant="contained"
        startIcon={<AddCircleOutlineIcon />}
        onClick={handleAddNickname}
        sx={{ mb: 2 }}
      >
        SpielernameSpeichern
      </Button>
      {nicknames.map(({ id, NickName }) => (
        <Box key={id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>
          <Typography variant="body1">{NickName}</Typography>
          <Box>
            <Button
              variant="outlined"
              onClick={() => onAddPlayer(NickName)}
              sx={{ mr: 1 }}
            >
              +
            </Button>
            <IconButton color="error" onClick={() => handleDeleteNickname(id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default NicknameManager;
