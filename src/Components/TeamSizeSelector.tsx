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
        <MenuItem value="Team2">2 Squads</MenuItem>
        <MenuItem value="Team3">3 Squads</MenuItem>
        <MenuItem value="Team4">4 Squads</MenuItem>
      </Select>
    </FormControl>
  );
}

export default TeamSizeSelector;
