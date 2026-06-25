import React, { useEffect, useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import RemoveDoneIcon from '@mui/icons-material/RemoveDone';
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
  DialogTitle,
  Snackbar,
  Alert
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
  const [duplicateWarning, setDuplicateWarning] = useState<string>('');

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
    const trimmed = nickname.trim();
    if (trimmed === '') return;
    if (nicknames.some(n => n.NickName === trimmed)) {
      setDuplicateWarning(t('roster.duplicate', { name: trimmed }));
      return;
    }
    await addNickname(trimmed);
    setNickname('');
    await fetchNicknames();
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

  // Sind bereits alle gespeicherten Spieler in der Queue?
  const allSelected = nicknames.length > 0 && nicknames.every(n => playerList.includes(n.NickName));

  const handleToggleAll = () => {
    if (allSelected) {
      // Nur die Roster-Namen entfernen – manuell eingegebene Spieler bleiben erhalten.
      updatePlayerList(playerList.filter(p => !nicknames.some(n => n.NickName === p)));
    } else {
      const namesToAdd = nicknames.map(n => n.NickName).filter(name => !playerList.includes(name));
      updatePlayerList([...playerList, ...namesToAdd]);
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

      {nicknames.length > 0 && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <Button
            onClick={handleToggleAll}
            startIcon={allSelected ? <RemoveDoneIcon /> : <DoneAllIcon />}
            sx={{
              m: 0,
              px: 1.25,
              py: 0.5,
              color: allSelected ? '#9AA4B2' : '#FF6A2B',
              border: `1px solid ${allSelected ? '#333B49' : '#FF6A2B'}`,
              borderRadius: '999px',
              fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
              fontWeight: 600,
              fontSize: '0.78rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: allSelected ? 'rgba(139, 148, 158, 0.08)' : 'rgba(232, 103, 10, 0.08)',
                borderColor: allSelected ? '#9AA4B2' : '#FF8A4D',
              },
            }}
          >
            {allSelected ? t('roster.deselectAll') : t('roster.selectAll')}
          </Button>
        </Box>
      )}

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
                borderRadius: '14px',
                border: `1px solid ${isSelected ? '#FF6A2B' : '#272D39'}`,
                backgroundColor: isSelected ? 'rgba(255, 106, 43, 0.12)' : '#161A22',
                boxShadow: isSelected ? '0 0 18px rgba(255, 106, 43, 0.25)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                p: 1,
                transition: 'all 0.2s ease',
                cursor: isEditing ? 'default' : 'pointer',
                position: 'relative',
                '&:hover': {
                  borderColor: '#FF6A2B',
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
                        color: '#EAEDF2',
                        fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
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
                        color: '#5B6472',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#22D3C5', backgroundColor: 'transparent' },
                      }}
                    >
                      <CheckIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleCancelEdit(); }}
                      sx={{
                        color: '#5B6472',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#FB5A52', backgroundColor: 'transparent' },
                      }}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography sx={{
                    color: isSelected ? '#FF6A2B' : '#EAEDF2',
                    fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif',
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
                        color: '#5B6472',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#FF6A2B', backgroundColor: 'transparent' },
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleDeleteNickname(id); }}
                      sx={{
                        color: '#5B6472',
                        p: 0.25,
                        borderRadius: 0,
                        '&:hover': { color: '#FB5A52', backgroundColor: 'transparent' },
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
        <DialogActions sx={{ borderTop: '1px solid #272D39', px: 2, py: 1.5 }}>
          <Button
            onClick={handleCancelDelete}
            sx={{
              color: '#9AA4B2',
              borderColor: '#272D39',
              border: '1px solid #272D39',
              m: 0,
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleConfirmDelete}
            sx={{
              color: '#FB5A52',
              borderColor: '#FB5A52',
              border: '1px solid #FB5A52',
              m: 0,
              ml: 1,
              '&:hover': { backgroundColor: 'rgba(248, 81, 73, 0.08)' },
            }}
          >
            {t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!duplicateWarning}
        autoHideDuration={3000}
        onClose={() => setDuplicateWarning('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        sx={{
          top: '50% !important',
          left: '50% !important',
          right: 'auto !important',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Alert
          severity="warning"
          variant="filled"
          onClose={() => setDuplicateWarning('')}
          sx={{ fontFamily: '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", sans-serif', fontWeight: 600, letterSpacing: '0.04em' }}
        >
          {duplicateWarning}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default NicknameManager;
