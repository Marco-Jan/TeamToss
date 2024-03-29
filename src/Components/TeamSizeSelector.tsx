
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

function TeamSizeSelector({ teamSize, setTeamSize }: { teamSize: string, setTeamSize: (value: string) => void}) {
    return (
    <FormControl fullWidth sx={{ margin: '20px 0' }}>
        <InputLabel id="team-size-label">Team Größe</InputLabel>
        <Select
            labelId="team-size-label"
            id="TeamChoiceID"
            value={teamSize}
            label="Welche Team Größe soll erstellt werden?"
            onChange={(e) => setTeamSize(e.target.value)}
        >
            <MenuItem value="Team2">2 Teams</MenuItem>
            <MenuItem value="Team3">3 Teams</MenuItem>
            <MenuItem value="Team4">4 Teams</MenuItem>
        </Select>
    </FormControl>
    );
  }
  
    export default TeamSizeSelector;