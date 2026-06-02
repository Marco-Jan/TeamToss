import { useState, useEffect } from 'react';
import { TextField } from '@mui/material';

const MIN_SQUADS = 2;
const parseCount = (value: string): string => value.replace('Team', '');

function TeamSizeSelector({ teamSize, setTeamSize }: { teamSize: string, setTeamSize: (value: string) => void }) {
  // Lokaler Text, damit man frei tippen/löschen kann; nach oben gemeldet wird nur ein gültiger Wert.
  const [text, setText] = useState<string>(parseCount(teamSize));

  useEffect(() => {
    setText(parseCount(teamSize));
  }, [teamSize]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setText(raw);
    const n = parseInt(raw, 10);
    if (!isNaN(n) && n >= MIN_SQUADS) {
      setTeamSize(`Team${n}`);
    }
  };

  const handleBlur = () => {
    const n = parseInt(text, 10);
    const clamped = isNaN(n) || n < MIN_SQUADS ? MIN_SQUADS : n;
    setText(String(clamped));
    setTeamSize(`Team${clamped}`);
  };

  return (
    <TextField
      fullWidth
      type="number"
      id="TeamChoiceID"
      label="Number of Squads"
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      inputProps={{ min: MIN_SQUADS, inputMode: 'numeric' }}
    />
  );
}

export default TeamSizeSelector;
