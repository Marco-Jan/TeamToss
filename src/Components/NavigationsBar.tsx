import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Button, TextField, Collapse, IconButton } from '@mui/material';
import TeamSizeSelector from './TeamSizeSelector';
import { PlayersList } from './PlayerList';
import NicknameManager from './NickNameManager';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseInit';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ pt: 3 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
}

function a11yProps(index: number) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

const TEAM_COLORS = ['#e8670a', '#2dd4bf', '#f0c030', '#a855f7'];

const TabNavigation: React.FC = () => {
    const [value, setValue] = useState(2);
    const [coinResult, setCoinResult] = useState<string>('');
    const [playerInput, setPlayerInput] = useState<string>('');
    const [playerList, setPlayerList] = useState<string[]>([]);
    const [teams, setTeams] = useState<string[][]>([]);

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [teamSize, setTeamSize] = useState<string>('Team2');
    const [showQueue, setShowQueue] = useState<boolean>(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return unsubscribe;
    }, []);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleCoinToss = (): void => {
        setCoinResult('');
        setTimeout(() => setCoinResult('·'), 200);
        setTimeout(() => setCoinResult('· ·'), 500);
        setTimeout(() => setCoinResult('· · ·'), 800);
        setTimeout(() => {
            setCoinResult(Math.random() <= 0.5 ? 'HEADS' : 'TAILS');
        }, 1500);
    };

    const handlePlayerInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setPlayerInput(event.target.value);
    };

    const handleAddPlayer = (nickname?: string): void => {
        const nameToAdd = nickname?.trim() || playerInput.trim();
        if (nameToAdd !== '' && !playerList.includes(nameToAdd)) {
            setPlayerList(prev => [...prev, nameToAdd]);
            setPlayerInput('');
        }
    };

    const handleRemoveFromQueue = (name: string): void => {
        setPlayerList(prev => prev.filter(p => p !== name));
    };

    const handleClearList = (): void => {
        setPlayerList([]);
        setTeams([]);
        setShowQueue(false);
    };

    const updatePlayerList = (updatedPlayerList: string[]) => {
        setPlayerList(updatedPlayerList);
    };

    const shuffleArray = (array: string[]): string[] => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    const handleGenerateTeams = (): void => {
        const numberOfTeams = parseInt(teamSize.replace('Team', ''), 10);
        const shuffledPlayers = shuffleArray([...playerList]);
        const newTeams: string[][] = Array.from({ length: numberOfTeams }, () => []);
        for (let i = 0; i < shuffledPlayers.length; i++) {
            newTeams[i % numberOfTeams].push(shuffledPlayers[i]);
        }
        setTeams(newTeams);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddPlayer();
    };

    const TeamDisplay = ({ teams }: { teams: string[][] }) => (
        <Box sx={{ width: '100%', mt: 3 }}>
            {teams.map((team, index) => {
                const color = TEAM_COLORS[index % TEAM_COLORS.length];
                return (
                    <Box key={index} sx={{
                        mb: 2,
                        border: '1px solid #2a2d35',
                        borderTopWidth: '2px',
                        borderTopColor: color,
                        p: 2,
                        backgroundColor: '#111318',
                    }}>
                        <Typography sx={{
                            fontSize: '0.6rem',
                            letterSpacing: '0.22em',
                            color: color,
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            mb: 0.5,
                            fontFamily: '"Rajdhani", sans-serif',
                        }}>
                            Squad {index + 1}
                        </Typography>
                        <Typography sx={{
                            color: '#c9d1d9',
                            fontWeight: 600,
                            letterSpacing: '0.06em',
                            fontFamily: '"Rajdhani", sans-serif',
                            fontSize: '1.05rem',
                        }}>
                            {team.length > 0 ? team.join('  ·  ') : '—'}
                        </Typography>
                    </Box>
                );
            })}
        </Box>
    );

    return (
        <Box sx={{ width: '100%' }}>
            <AppBar position="static" sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="navigation tabs"
                >
                    <Tab label="Team Builder" {...a11yProps(0)} />
                    <Tab label="Roster" {...a11yProps(1)} disabled={!isLoggedIn} />
                    <Tab label="Coin Flip" {...a11yProps(2)} />
                </Tabs>
            </AppBar>

            {/* ── Team Builder ── */}
            <TabPanel value={value} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <TextField
                            fullWidth
                            label="Add Operator"
                            value={playerInput}
                            onChange={handlePlayerInputChange}
                            onKeyDown={handleKeyDown}
                        />
                        <Button
                            variant="contained"
                            onClick={() => handleAddPlayer()}
                            sx={{ minWidth: 56, height: 56, m: 0, px: 1 }}
                        >
                            <AddCircleOutlineIcon />
                        </Button>
                    </Box>

                    {playerList.length > 0 && (
                        <Box>
                            <Box
                                onClick={() => setShowQueue(prev => !prev)}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 0.5,
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    '&:hover .queue-label': { color: '#c9d1d9' },
                                }}
                            >
                                <Box sx={{ width: 8, height: 8, backgroundColor: '#e8670a', flexShrink: 0 }} />
                                <Typography className="queue-label" sx={{
                                    fontSize: '0.62rem',
                                    letterSpacing: '0.18em',
                                    color: '#8b949e',
                                    textTransform: 'uppercase',
                                    fontFamily: '"Rajdhani", sans-serif',
                                    fontWeight: 600,
                                    transition: 'color 0.15s ease',
                                    flex: 1,
                                }}>
                                    {playerList.length} Operator{playerList.length !== 1 ? 's' : ''} Queued
                                </Typography>
                                <KeyboardArrowDownIcon sx={{
                                    fontSize: '1rem',
                                    color: '#8b949e',
                                    transition: 'transform 0.2s ease',
                                    transform: showQueue ? 'rotate(180deg)' : 'rotate(0deg)',
                                }} />
                            </Box>

                            <Collapse in={showQueue}>
                                <Box sx={{
                                    mt: 1,
                                    border: '1px solid #2a2d35',
                                    borderLeft: '2px solid #e8670a',
                                    backgroundColor: '#111318',
                                }}>
                                    {playerList.map((name, i) => (
                                        <Box
                                            key={name}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                px: 1.5,
                                                py: 0.75,
                                                borderTop: i === 0 ? 'none' : '1px solid #1e2128',
                                                '&:hover': { backgroundColor: 'rgba(232, 103, 10, 0.04)' },
                                            }}
                                        >
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                                <Typography sx={{
                                                    fontSize: '0.6rem',
                                                    color: '#4a4d55',
                                                    fontFamily: '"Rajdhani", sans-serif',
                                                    fontWeight: 700,
                                                    letterSpacing: '0.1em',
                                                    minWidth: 16,
                                                }}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </Typography>
                                                <Typography sx={{
                                                    fontFamily: '"Rajdhani", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '0.9rem',
                                                    letterSpacing: '0.05em',
                                                    color: '#c9d1d9',
                                                }}>
                                                    {name}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveFromQueue(name)}
                                                sx={{
                                                    color: '#3a3d45',
                                                    p: 0.25,
                                                    borderRadius: 0,
                                                    '&:hover': {
                                                        color: '#f85149',
                                                        backgroundColor: 'transparent',
                                                    },
                                                }}
                                            >
                                                <CloseIcon sx={{ fontSize: '0.85rem' }} />
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Box>
                            </Collapse>
                        </Box>
                    )}

                    <TeamSizeSelector teamSize={teamSize} setTeamSize={setTeamSize} />

                    <Button
                        variant="contained"
                        fullWidth
                        onClick={handleGenerateTeams}
                        sx={{ m: 0, py: 1.5 }}
                    >
                        Generate Squads
                    </Button>

                    {teams.length > 0 && <TeamDisplay teams={teams} />}

                    <Button
                        variant="outlined"
                        fullWidth
                        onClick={handleClearList}
                        sx={{
                            m: 0,
                            py: 1,
                            borderColor: '#2a2d35',
                            color: '#8b949e',
                            '&:hover': {
                                borderColor: '#f85149',
                                color: '#f85149',
                                backgroundColor: 'rgba(248, 81, 73, 0.06)',
                            },
                        }}
                    >
                        Clear Roster
                    </Button>
                </Box>
            </TabPanel>

            {/* ── Saved Roster ── */}
            <TabPanel value={value} index={1}>
                <PlayersList />
                <NicknameManager
                    playerList={playerList}
                    onAddPlayer={handleAddPlayer}
                    updatePlayerList={updatePlayerList}
                />
            </TabPanel>

            {/* ── Coin Flip ── */}
            <TabPanel value={value} index={2}>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 6,
                    gap: 5,
                }}>
                    <Box
                        onClick={handleCoinToss}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleCoinToss()}
                        sx={{
                            width: 160,
                            height: 160,
                            borderRadius: '50%',
                            border: '2px solid #e8670a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 0 30px rgba(232, 103, 10, 0.25), inset 0 0 30px rgba(232, 103, 10, 0.05)',
                            transition: 'all 0.25s ease',
                            userSelect: 'none',
                            '&:hover': {
                                boxShadow: '0 0 60px rgba(232, 103, 10, 0.5), inset 0 0 40px rgba(232, 103, 10, 0.1)',
                                transform: 'scale(1.05)',
                            },
                            '&:active': {
                                transform: 'scale(0.95)',
                            },
                        }}
                    >
                        <Typography sx={{
                            fontFamily: '"Rajdhani", sans-serif',
                            fontWeight: 700,
                            fontSize: '1rem',
                            letterSpacing: '0.25em',
                            color: '#e8670a',
                            textTransform: 'uppercase',
                        }}>
                            FLIP
                        </Typography>
                    </Box>

                    {coinResult && (
                        <Typography sx={{
                            fontFamily: '"Rajdhani", sans-serif',
                            fontWeight: 700,
                            fontSize: '3.5rem',
                            letterSpacing: '0.15em',
                            color: '#e8670a',
                            textTransform: 'uppercase',
                            textShadow: '0 0 40px rgba(232, 103, 10, 0.6)',
                            lineHeight: 1,
                            minHeight: '1em',
                        }}>
                            {coinResult}
                        </Typography>
                    )}
                </Box>
            </TabPanel>
        </Box>
    );
};

export default TabNavigation;
