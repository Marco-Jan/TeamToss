import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addNickname, getNicknames, deleteNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';
import { theme } from './Thema/theme';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Box,
  Button,
  TextField,
  ThemeProvider,
  CardActionArea,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

export interface NicknameManagerProps {
  onAddPlayer: (nickname: string) => void;
  updatePlayerList: (playerList: string[]) => void;
  playerList: string[];
}

const NicknameManager: React.FC<NicknameManagerProps> = ({ onAddPlayer, playerList, updatePlayerList }) => {
  const [nickname, setNickname] = useState<string>('');
  const [nicknames, setNicknames] = useState<Nickname[]>([]);
  const [, setSelectedNickname] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');

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
    setSelectedPlayerId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    const updatedPlayerList = playerList.filter(player => player !== selectedPlayerId);
    updatePlayerList(updatedPlayerList);
    await deleteNickname(selectedPlayerId);
    await fetchNicknames();
    setOpenDeleteDialog(false);
  };

  const handleCancelDelete = () => {
    setOpenDeleteDialog(false);
  };

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
      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <TextField
          fullWidth
          label="Playername"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          margin="normal"
          sx={{ margin: '10px' }}
        />
        <Button
          variant="contained"
          startIcon={<AddCircleOutlineIcon />}
          onClick={handleAddNickname}
          sx={{
            display: 'flex',
            justifyContent: 'end',
            alignItems: 'center',
            margin: 'auto',
            height: '56px',
            backgroundColor: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: 'green',
            },
          }}
        >
        </Button>
      </Box>

      {/*/  player Cards hier ändern */}

      <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', overflowWrap: 'break-word' }}>
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

      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this player?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
};

export default NicknameManager;
