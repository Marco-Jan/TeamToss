import { Box, IconButton, Typography } from '@mui/material';
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';
import { useLanguage } from '../i18n/LanguageContext';
import { tokens, DISPLAY_FONT } from './Thema/theme';

const MIN_SQUADS = 2;
const MAX_SQUADS = 12;
const parseCount = (value: string): number => {
  const n = parseInt(value.replace('Team', ''), 10);
  return isNaN(n) ? MIN_SQUADS : n;
};

function TeamSizeSelector({ teamSize, setTeamSize }: { teamSize: string, setTeamSize: (value: string) => void }) {
  const { t } = useLanguage();
  const count = parseCount(teamSize);

  const setCount = (next: number) => {
    const clamped = Math.min(MAX_SQUADS, Math.max(MIN_SQUADS, next));
    setTeamSize(`Team${clamped}`);
  };

  const stepBtn = {
    width: 48,
    height: 48,
    borderRadius: 12,
    border: `1px solid ${tokens.border2}`,
    color: tokens.ink,
    backgroundColor: tokens.surface2,
    '&:hover': { borderColor: tokens.brand, color: tokens.brand, backgroundColor: tokens.surface2 },
    '&.Mui-disabled': { color: tokens.faint, borderColor: tokens.border },
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 1.5,
      px: 2,
      py: 1.5,
      borderRadius: 14,
      border: `1px solid ${tokens.border}`,
      backgroundColor: tokens.surface,
    }}>
      <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: tokens.ink }}>
        {t('builder.numSquads')}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <IconButton
          aria-label="minus"
          onClick={() => setCount(count - 1)}
          disabled={count <= MIN_SQUADS}
          sx={stepBtn}
        >
          <RemoveIcon />
        </IconButton>

        <Typography sx={{
          fontFamily: DISPLAY_FONT,
          fontWeight: 800,
          fontSize: '1.8rem',
          color: tokens.brand,
          minWidth: 40,
          textAlign: 'center',
          lineHeight: 1,
        }}>
          {count}
        </Typography>

        <IconButton
          aria-label="plus"
          onClick={() => setCount(count + 1)}
          disabled={count >= MAX_SQUADS}
          sx={stepBtn}
        >
          <AddIcon />
        </IconButton>
      </Box>
    </Box>
  );
}

export default TeamSizeSelector;
