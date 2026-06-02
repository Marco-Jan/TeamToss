import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { addNickname, getNicknames, deleteNickname, updateNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Typography,
  IconButton,
  Box,
  Button,
  TextField,
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
  const { t } = useLanguage();
  const [nickname, setNickname] = useState<string>('');
  const [nicknames, setNicknames] = useState<Nickname[]>([]);
  const [, setSelectedNickname] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('');
  const [editingId, setEditingId] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');

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

  const handleStartEdit = (id: string, currentName: string) => {
    setEditingId(id);
    setEditValue(currentName);
  };

  const handleCancelEdit = () => {
    setEditingId('');
    setEditValue('');
  };

  const handleSaveEdit = async (id: string, oldName: string) => {
    const newName = editValue.trim();
    if (newName === '' || newName === oldName) {
      handleCancelEdit();
      return;
    }
    // Doppelte Namen vermeiden
    if (nicknames.some(n => n.id !== id && n.NickName === newName)) {
      handleCancelEdit();
      return;
    }
    await updateNickname(id, newName);
    // Falls der Operator gerade in der Queue ist, dort ebenfalls umbenennen
    if (playerList.includes(oldName)) {
      updatePlayerList(playerList.map(p => (p === oldName ? newName : p)));
    }
    handleCancelEdit();
    await fetchNicknames();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent, id: string, oldName: string) => {
    if (e.key === 'Enter') handleSaveEdit(id, oldName);
    if (e.key === 'Escape') handleCancelEdit();
  };

  const handleAddSelectedPlayer = (selectedNickname: string) => {
    if (playerList.includes(selectedNickname)) {
      updatePlayerList(playerList.filter(p => p !== selectedNickname));
    } else {
      onAddPlayer(selectedNickname);
      setSelectedNickname('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddNickname();
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          label={t('roster.saveOperator')}
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="contained"
          onClick={handleAddNickname}
          sx={{ minWidth: 56, height: 56, m: 0, px: 1 }}
        >
          <AddCircleOutlineIcon />
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {nicknames.map(({ id, NickName }) => {
          const isSelected = playerList.includes(NickName);
          const isEditing = editingId === id;
          return (
            <Box
              key={id}
              sx={{
                width: 112,
                height: 112,
                border: `1px solid ${isSelected ? '#e8670a' : '#2a2d35'}`,
                borderTop: `2px solid ${isSelected ? '#e8670a' : '#3a3d45'}`,
                backgroundColor: isSelected ? 'rgba(232, 103, 10, 0.1)' : '#111318',
                boxShadow: isSelected ? '0 0 16px rgba(232, 103, 10, 0.25)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 1,
                transition: 'all 0.2s ease',
                cursor: isEditing ? 'default' : 'pointer',
                position: 'relative',
                '&:hover': {
                  borderColor: '#e8670a',
                  backgroundColor: isSelected ? 'rgba(232, 103, 10, 0.15)' : 'rgba(232, 103, 10, 0.05)',
                },
              }}
              onClick={() => { if (!isEditing) handleAddSelectedPlayer(NickName); }}
            >
              {isEditing ? (
                <>
                  <TextField
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => handleEditKeyDown(e, id, NickName)}
                    onClick={e => e.stopPropagation()}
                    autoFocus
                    variant="standard"
                    size="small"
                    sx={{
                      flex: 1,
                      '& .MuiInputBase-input': {
                        color: '#c9d1d9',
                        fontFamily: '"Rajdhani", sans-serif',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        p: 0,
                      },
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleSaveEdit(id, NickName); }}
                      sx={{
                        color: '#3a3d45',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#2dd4bf', backgroundColor: 'transparent' },
                      }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      sx={{
                        color: '#3a3d45',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#f85149', backgroundColor: 'transparent' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={{
                    color: isSelected ? '#e8670a' : '#c9d1d9',
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    letterSpacing: '0.04em',
                    wordBreak: 'break-word',
                    lineHeight: 1.2,
                    flex: 1,
                  }}>
                    {NickName}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleStartEdit(id, NickName); }}
                      sx={{
                        color: '#3a3d45',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#e8670a', backgroundColor: 'transparent' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleDeleteNickname(id); }}
                      sx={{
                        color: '#3a3d45',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#f85149', backgroundColor: 'transparent' },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              )}
            </Box>
          );
        })}
      </Box>

      <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
        <DialogTitle>{t('roster.confirmDelete')}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <DialogContentText>
            {t('roster.removePrompt')}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #2a2d35', px: 2, py: 1.5 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: '#8b949e',
              borderColor: '#2a2d35',
              border: '1px solid #2a2d35',
              m: 0,
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              color: '#f85149',
              borderColor: '#f85149',
              border: '1px solid #f85149',
              m: 0,
              ml: 1,
              '&:hover': { backgroundColor: 'rgba(248, 81, 73, 0.08)' },
            }}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NicknameManager;
