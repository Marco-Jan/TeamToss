import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, IconButton, ThemeProvider, CardActionArea } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addNickname, getNicknames, deleteNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';
import { theme } from './Thema/theme';
import { Card, CardContent, Typography, CardActions } from '@mui/material';



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

  // const handleSelectChange = (event: SelectChangeEvent) => {
  //   setSelectedNickname(event.target.value as string);
  // };

  const handleAddSelectedPlayer = (selectedNickname: string) => {
    if (selectedNickname) {
      onAddPlayer(selectedNickname);
      setSelectedNickname('');
    }
  };

  {/* PlayerCard Bull */ }
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Playername"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          margin="normal"
        />
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddNickname}
        // sx={{ mb: 1, p: 0,  }}
        >
        </Button>
      </Box>

      {/*/  player Cards hier ändern */}

      <Box sx={{ minWidth: 275, display: 'flex', flexWrap: 'wrap', }}>
        {nicknames.map(({ id, NickName }) => (
          <Card sx={{ m: 1, minWidth: 'auto', backgroundColor: '#1976d2' }}>
            <CardActionArea onClick={() => handleAddSelectedPlayer(NickName)}>
              <CardContent key={id}>
                <Typography sx={{ color: playerList.includes(NickName) ? 'red' : 'white' }} variant="body1">{NickName}</Typography>
              </CardContent>

            </CardActionArea>
          </Card>
        ))}
        <CardActions>
          {selectedNickname && (
            <IconButton color="info" onClick={() => handleDeleteNickname(nicknames.find(nick => nick.NickName === selectedNickname)?.id || '')}>
              <DeleteIcon />
            </IconButton>
          )}
        </CardActions>
      </Box>

      {/*/  playerList hier löschen wenn fertig */}

      {/* <Box sx={{ width: '100%', mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddSelectedPlayer}
        // sx={{ mr: 1, p: 0 }}
        >
        </Button> 
      </Box> */}
    </ThemeProvider>
  );
};

export default NicknameManager;
