import React, { useEffect, useState } from 'react';
import { Button, TextField, Box, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; 
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; 
import { addNickname, getNicknames, deleteNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';


export interface NicknameManagerProps {
  onAddPlayer: (nickname: string) => void;
  playerList: string[];
}

const NicknameManager: React.FC<NicknameManagerProps> = ({ onAddPlayer, playerList }) => {
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
        label="Playername"
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
        Add
      </Button>
      {nicknames.map(({ id, NickName }) => (
        <Box key={id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', my: 1 }}>

          {/* Hier wird der Nickname angezeigt */}
          <Typography variant="body1" sx={{color: playerList.includes(NickName) ? 'rgb(40,180,39)' : 'inherit', fontSize: '20px'}}>{NickName} </Typography>
          <Box>
            <Button
              variant="contained"
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
