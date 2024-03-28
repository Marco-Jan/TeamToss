import { Button, TextField } from '@mui/material';


function PlayerInputForm({ onAddPlayer, playerInput, setPlayerInput }: { onAddPlayer: () => void, playerInput: string, setPlayerInput: (input: string) => void }) {
        return (
            <>
                <TextField
                    fullWidth
                    label="Spielername"
                    value={playerInput}
                    onChange={(e) => setPlayerInput(e.target.value)}
                />
                <Button variant="contained" fullWidth onClick={onAddPlayer} sx={{ width: 1 / 2, margin: '20px 0px', borderRadius: 13, padding: 4 }}>Spieler hinzufügen</Button>
            </>
        );
    }
  

    export default PlayerInputForm;