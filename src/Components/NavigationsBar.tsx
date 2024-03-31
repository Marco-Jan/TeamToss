import React, { useState } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Button, Grid, Container, TextField, } from '@mui/material';
import TeamSizeSelector from './TeamSizeSelector';
import { PlayersList } from './PlayerList';
import NicknameManager from './NickNameManager';


interface TabPanelProps {
    children?: React.ReactNode;
    index: unknown;
    value: unknown;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                height: '100%',
                minHeight: '30px',
            }}
        >
            {value === index && (
                <Box sx={{ p: 3, minHeight: '500px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: unknown) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}



export const TabNavigation: React.FC = () => {
    const [value, setValue] = useState(0);
    const [coinResult, setCoinResult] = useState<string>('');
    const [playerInput, setPlayerInput] = useState<string>('');
    const [playerList, setPlayerList] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[][]>([]);

    const [teamSize, setTeamSize] = useState<string>('Team2');

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
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
        <Grid>
            {teams.map((team, index) => (
                <React.Fragment key={index}>
                    <Typography variant="h6" gutterBottom>Team {index + 1}:</Typography>
                    <Typography variant="h5">{team.join(', ')}</Typography>
                </React.Fragment>
            ))}
        </Grid>
    );


    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static">
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="simple tabs example"
                    centered // Zentriert die Tabs, wenn es nur zwei gibt
                    // Für mehr Kontrolle über das Styling kannst du das sx-Property verwenden:
                    sx={{ '.MuiTabs-flexContainer': { justifyContent: 'center' } }}
                >                    <Tab label="TeamGenerator" {...a11yProps(0)} />
                    <Tab label="CoinToss" {...a11yProps(1)} />
                </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12}>
                        <Container maxWidth="sm">
                            <PlayersList />
                            <NicknameManager playerList={playerList} onAddPlayer={handleAddPlayer} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, margin: 2 }}>
                                <TextField 
                                    fullWidth   
                                    label="Add random player"
                                    value={playerInput}
                                    onChange={handlePlayerInputChange}
                                    sx={{ flexGrow: 2}}
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => handleAddPlayer()}
                                    sx={{ mr: 1 }}>+
                                </Button>
                            </Box>
                        </Container>
                    </Grid>


                </Grid>
                <Grid container spacing={2} justifyContent="center">
                    <TeamSizeSelector teamSize={teamSize} setTeamSize={setTeamSize} />

                    <Grid item xs={6}>
                        <Button variant="contained" fullWidth onClick={handleGenerateTeams}>Generate your Teams</Button>
                    </Grid>
                    <Grid item xs={12}>
                        {/* Dynamische Team-Anzeige */}
                        <TeamDisplay teams={teams} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button variant="contained" fullWidth onClick={handleClearList} sx={{ width: 1 / 2, margin: '20px 0px', boxShadow: 3 }}>Clear</Button>
                    </Grid>
                </Grid>
            </TabPanel>
            {/* **************************** Münzwurf Tab *********************************** */}

            <TabPanel value={value} index={1}>
                <Grid container justifyContent="center"> {/* Zentriere den Inhalt des Containers */}
                    <Grid item>
                        <Button
                            variant="contained"
                            onClick={handleCoinToss}
                            sx={{
                                width: 'auto', // Entferne fullWidth und definiere eine angemessene Breite, wenn gewünscht
                                p: 1.5,
                                bgcolor: 'primary.main',
                                color: 'primary.contrastText',
                                '&:hover': {
                                    bgcolor: 'primary.dark',
                                    color: 'primary.contrastText',
                                },
                                border: '1px solid',
                                borderColor: 'primary.light',
                                borderRadius: 5,
                                fontSize: '0.875rem',
                                fontWeight: '700',
                                textAlign: 'center',
                                m: 0.5,
                            }}
                        >
                            Münzwurf
                        </Button>
                    </Grid>
                </Grid>
                <Typography variant="h1" gutterBottom sx={{ height: '50px', m: 4 }}>{coinResult}</Typography>
            </TabPanel>

        </Box>
    );
}
