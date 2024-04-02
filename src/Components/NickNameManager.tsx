import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addNickname, getNicknames, deleteNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';
import { theme } from './Thema/theme';
import { Card, CardContent, Typography, CardActions, IconButton, Box, Button, TextField, ThemeProvider, CardActionArea} from '@mui/material';



export interface NicknameManagerProps {
  onAddPlayer: (nickname: string) => void;
  updatePlayerList: (playerList: string[]) => void;
  playerList: string[];
}



const NicknameManager: React.FC<NicknameManagerProps> = ({ onAddPlayer, playerList, updatePlayerList }) => {
  const [nickname, setNickname] = useState<string>('');
  const [nicknames, setNicknames] = useState<Nickname[]>([]);
  const [, setSelectedNickname] = useState('');

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
    const updatedPlayerList = playerList.filter(player => player !== id);
    updatePlayerList(updatedPlayerList);
    await deleteNickname(id);
    await fetchNicknames();
  };

  // const handleSelectChange = (event: SelectChangeEvent) => {
  //   setSelectedNickname(event.target.value as string);
  // };

  const handleAddSelectedPlayer = (selectedNickname: string) => {
    const playerExists = playerList.includes(selectedNickname);

    if (playerExists) {
      const updatedPlayerList = playerList.filter(player => player !== selectedNickname);
      updatePlayerList(updatedPlayerList);
    } else {
      onAddPlayer(selectedNickname);
      setSelectedNickname('');
    }
  };



  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%', mt: 2, display: 'flex'}}>
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

      <Box sx={{ display: 'flex', justifyContent: 'center' ,flexWrap: 'wrap', overflowWrap: 'break-word' }}>
        {nicknames.map(({ id, NickName }) => (
          <Card sx={{ m: 1, width: '120px', height: '120px', backgroundColor: playerList.includes(NickName) ? 'green' : '#1976d2' }}>
            <CardActionArea onClick={() => handleAddSelectedPlayer(NickName)}>
              <CardContent key={id}>
                <Typography sx={{ color: 'white' }} variant="body1">{NickName}</Typography>
              </CardContent>
              <CardActions sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton color="error" onClick={() => handleDeleteNickname(id)}>
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </CardActionArea>
          </Card>
        ))}

      </Box>
    </ThemeProvider>
  );
};

export default NicknameManager;
