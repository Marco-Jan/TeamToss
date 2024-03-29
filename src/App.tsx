import React, { useEffect, useState } from 'react';
import { TextField, Typography, Container, Grid, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import './App.css';
import { SelectChangeEvent } from '@mui/material/Select';
import { PlayersList } from './Components/PlayerList';
import GoogleSignInButton from './Components/SignInBtn';
import SignOutButton from './Components/SignOutBtn'; // Stelle sicher, dass der Import korrekt ist
import { auth } from './firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';
import NicknameManager from './Components/NickNameManager';


const App: React.FC = () => {
  const [playerInput, setPlayerInput] = useState<string>('');
  const [playerList, setPlayerList] = useState<string[]>([]);
  const [teams, setTeams] = useState<string[][]>([]);
  const [coinResult, setCoinResult] = useState<string>('');
  const [teamSize, setTeamSize] = useState<string>('Team1');
  const [user, setUser] = useState<User | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.photoURL) {
        setUserPhoto(currentUser.photoURL);
      } else {
        setUserPhoto('');
      }
    });

    return () => unsubscribe();
  }, []);


  const handleTeamSizeChange = (event: SelectChangeEvent<string>): void => {
    setTeamSize(event.target.value);
  };

  const handlePlayerInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPlayerInput(event.target.value);
  };

  const handleAddPlayer = (nickname?: string): void => {
    const nameToAdd = nickname?.trim() || playerInput.trim();
    if (nameToAdd !== '' && !playerList.includes(nameToAdd)) {
      setPlayerList(prevList => [...prevList, nameToAdd]);
      setPlayerInput(''); // Das Eingabefeld immer zurücksetzen
    }
  };
  
  //  const addNicknameToPlayerList = (nickname: string) => {
  //   setPlayerList((playerList) => {
  //     // Überprüfe, ob der Nickname bereits in der Liste ist, um Duplikate zu vermeiden
  //     if (!playerList.includes(nickname)) {
  //       return [...playerList, nickname];
  //     }
  //     return playerList;
  //   });
  // };
  

  const handleClearList = (): void => {
    setPlayerList([]);
    setTeams([]);
  };

  const handleCoinToss = (): void => {
    const x = 'Kopf';
    const y = 'Zahl';

    setTimeout(() => setCoinResult('.'), 200);
    setTimeout(() => setCoinResult('..'), 500);
    setTimeout(() => setCoinResult('...'), 800);

    setTimeout(() => {
      const coinToss = Math.random() <= 0.5 ? x : y;
      setCoinResult(coinToss);
    }, 1500);
  };

  const handleGenerateTeams = (): void => {
    const numberOfTeams = parseInt(teamSize.replace('Team', ''), 10); // Wandelt den String "Team1", "Team2" etc. in eine Nummer um
    const shuffledPlayers = shuffleArray(playerList);
    console.log(playerList, 'playerList');
    
    const newTeams: string[][] = Array.from({ length: numberOfTeams }, () => []);

    for (let i = 0; i < shuffledPlayers.length; i++) {
      newTeams[i % numberOfTeams].push(shuffledPlayers[i]);
    }

    setTeams(newTeams); // Aktualisiert den Zustand von `teams` direkt
  };

  const shuffleArray = (array: string[]): string[] => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const TeamDisplay = ({ teams }: { teams: string[][] }) => (
    <>
      {teams.map((team, index) => (
        <React.Fragment key={index}>
          <Typography variant="h6" gutterBottom>Team {index + 1}:</Typography>
          <Typography variant="h5">{team.join(', ')}</Typography>
        </React.Fragment>
      ))}
    </>
  );




  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom align="center">TeamToss</Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12}>
          <Container maxWidth="sm">
            <Container maxWidth="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '20px 0' }}>
              {user ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {userPhoto && <img src={userPhoto} alt="Profilbild" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
                  <SignOutButton />
                </div>
              ) : (
                <GoogleSignInButton />
              )}
            </Container>

            <FormControl fullWidth sx={{ margin: '20px 0' }}>
              <InputLabel id="team-size-label">Welche Team Größe soll erstellt werden?</InputLabel>
              <Select
                labelId="team-size-label"
                id="TeamChoiceID"
                value={teamSize}
                label="Welche Team Größe soll erstellt werden?"
                onChange={handleTeamSizeChange}
              >
                <MenuItem value="Team2">2 Teams</MenuItem>
                <MenuItem value="Team3">3 Teams</MenuItem>
                <MenuItem value="Team4">4 Teams</MenuItem>
              </Select>
            </FormControl>
            <PlayersList />
            <NicknameManager onAddPlayer={handleAddPlayer} />
            <TextField
              fullWidth
              label="Spielername"
              value={playerInput}
              onChange={handlePlayerInputChange}
            />
            {/* Dynamische Team-Anzeige */}
            <TeamDisplay teams={teams} />
            <Typography variant="h6" gutterBottom>Münzwurf Ergebnis:</Typography>
            <Typography variant="h3" gutterBottom>{coinResult}</Typography>
          </Container>
        </Grid>
        <Grid item xs={12}>
        <Button variant="contained" fullWidth onClick={() => handleAddPlayer()} sx={{ width: 1 / 2, margin: '20px 0px', borderRadius: 13, padding: 4 }}>Spieler hinzufügen</Button>

        </Grid>
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={handleCoinToss} sx={{
            width: 1 / 1,
            p: 0.75,
            bgcolor: (theme) =>
              theme.palette.mode === 'dark' ? '#101010' : 'grey.100',
            color: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.300' : 'grey.800',
            border: '1px solid',
            borderColor: (theme) =>
              theme.palette.mode === 'dark' ? 'grey.800' : 'grey.300',
            borderRadius: 5,
            fontSize: '0.875rem',
            fontWeight: '700',
            textAlign: 'center',
          }}>Münzwurf</Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" fullWidth onClick={handleGenerateTeams}>Teams generieren</Button>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" fullWidth onClick={handleClearList} sx={{ width: 1 / 2, margin: '20px 0px', boxShadow: 3 }}>Liste leeren</Button>
        </Grid>
      </Grid>

    </Container>
  );
};

export default App;
