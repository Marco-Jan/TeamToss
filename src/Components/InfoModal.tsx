import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, IconButton,
  Box, Typography,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import GroupsIcon from '@mui/icons-material/Groups';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CasinoIcon from '@mui/icons-material/Casino';
import { useLanguage } from '../i18n/LanguageContext';

const InfoModal: React.FC = () => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(() => !localStorage.getItem('tt_info_seen'));

  const features = [
    {
      icon: <GroupsIcon sx={{ fontSize: '1.1rem', color: '#e8670a' }} />,
      title: t('info.feat1.title'),
      desc: t('info.feat1.desc'),
    },
    {
      icon: <BookmarkIcon sx={{ fontSize: '1.1rem', color: '#2dd4bf' }} />,
      title: t('info.feat2.title'),
      desc: t('info.feat2.desc'),
    },
    {
      icon: <CasinoIcon sx={{ fontSize: '1.1rem', color: '#f0c030' }} />,
      title: t('info.feat3.title'),
      desc: t('info.feat3.desc'),
    },
  ];

  const handleClose = () => {
    localStorage.setItem('tt_info_seen', '1');
    setOpen(false);
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen(true)}
        size="small"
        aria-label="Info"
        sx={{
          color: '#3a3d45',
          borderRadius: 0,
          p: 0.75,
          '&:hover': { color: '#8b949e', backgroundColor: 'transparent' },
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: '1.2rem' }} />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        sx={{ '& .MuiDialog-container': { alignItems: 'flex-start', pt: 10 } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1 }}>
          <Box>
            <Box component="span" sx={{ color: '#e8670a' }}>TEAM</Box>
            <Box component="span" sx={{ color: '#c9d1d9' }}>TOSS</Box>
            <Box sx={{
              fontSize: '0.55rem',
              letterSpacing: '0.22em',
              color: '#8b949e',
              mt: 0.5,
              fontWeight: 600,
            }}>
              {t('info.whatIsThis')}
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: '#3a3d45', '&:hover': { color: '#c9d1d9', backgroundColor: 'transparent' } }}>
            <CloseIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 2.5, pb: 3 }}>
          <Typography sx={{
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: '0.88rem',
            color: '#8b949e',
            letterSpacing: '0.04em',
            lineHeight: 1.6,
            mb: 3,
          }}>
            {t('info.intro')}
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {features.map(({ icon, title, desc }) => (
              <Box key={title} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                <Box sx={{
                  mt: 0.15,
                  width: 28,
                  height: 28,
                  border: '1px solid #2a2d35',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  backgroundColor: '#0d0e11',
                }}>
                  {icon}
                </Box>
                <Box>
                  <Typography sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#c9d1d9',
                    lineHeight: 1.2,
                    mb: 0.4,
                  }}>
                    {title}
                  </Typography>
                  <Typography sx={{
                    fontFamily: '"Rajdhani", sans-serif',
                    fontSize: '0.82rem',
                    color: '#8b949e',
                    letterSpacing: '0.03em',
                    lineHeight: 1.55,
                  }}>
                    {desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InfoModal;
