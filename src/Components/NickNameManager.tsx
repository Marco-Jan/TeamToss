import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, IconButton, FormControl, InputLabel, Select, MenuItem, ThemeProvider, SelectChangeEvent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addNickname, getNicknames, deleteNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';
import { theme } from './Thema/theme';

export interface NicknameManagerProps {
  onAddPlayer: (nickname: string) => void;
  playerList: string[];
}

const NicknameManager: React.FC<NicknameManagerProps> = ({ onAddPlayer, playerList }) => {
  const [nickname, setNickname] = useState<string>('');
  const [nicknames, setNicknames] = useState<Nickname[]>([]);
  const [selectedNickname, setSelectedNickname] = useState('');

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

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedNickname(event.target.value as string);
  };

  const handleAddSelectedPlayer = () => {
    if (selectedNickname) {
      onAddPlayer(selectedNickname);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ my: 2 }}>
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

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="nickname-select-label">Saved Players</InputLabel>
          <Select
            labelId="nickname-select-label"
            value={selectedNickname}
            label="Saved Players"
            onChange={handleSelectChange}
          >
            {nicknames.map(({ id, NickName }) => (
              <MenuItem
                key={id}
                value={NickName}
                sx={{
                  color: playerList.includes(NickName) ? 'rgb(40,180,39)' : 'inherit', 
                }}
              >
                {NickName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


        <Button
          variant="contained"
          onClick={handleAddSelectedPlayer}
          sx={{ mr: 1 }}
        >
          Add to Team
        </Button>

        {selectedNickname && (
          <IconButton color="error" onClick={() => handleDeleteNickname(nicknames.find(nick => nick.NickName === selectedNickname)?.id || '')}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default NicknameManager;
