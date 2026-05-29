import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function TeamSizeSelector({ teamSize, setTeamSize }: { teamSize: string, setTeamSize: (value: string) => void }) {
  return (
    <FormControl fullWidth>
      <InputLabel id="team-size-label">Number of Squads</InputLabel>
      <Select
        labelId="team-size-label"
        id="TeamChoiceID"
        value={teamSize}
        label="Number of Squads"
        onChange={(e) => setTeamSize(e.target.value)}
      >
        {Array.from({ length: 9 }, (_, i) => i + 2).map(n => (
          <MenuItem key={n} value={`Team${n}`}>{n} Squads</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default TeamSizeSelector;
