import React, { useState, useEffect } from 'react';
import { AppBar, Tabs, Tab, Box, Typography, Button, TextField, IconButton, Collapse } from '@mui/material';
import TeamSizeSelector from './TeamSizeSelector';
import { PlayersList } from './PlayerList';
import NicknameManager from './NickNameManager';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
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
    const [value, setValue] = useState(0);
    const [coinRotation, setCoinRotation] = useState<number>(0);
    const [hasFlipped, setHasFlipped] = useState<boolean>(false);
    const [isFlipping, setIsFlipping] = useState<boolean>(false);
    const [playerInput, setPlayerInput] = useState<string>('');
    const [playerList, setPlayerList] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('tt_queue');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });
    const [teams, setTeams] = useState<string[][]>([]);
    const [leaders, setLeaders] = useState<Record<number, string>>({});

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    const [teamSize, setTeamSize] = useState<string>('Team2');
    const [showQueue, setShowQueue] = useState<boolean>(true);
    const [editingIndex, setEditingIndex] = useState<number>(-1);
    const [editValue, setEditValue] = useState<string>('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoggedIn(!!user);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        localStorage.setItem('tt_queue', JSON.stringify(playerList));
    }, [playerList]);

    const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleCoinToss = (): void => {
        if (isFlipping) return;
        const result = Math.random() < 0.5 ? 'HEADS' : 'TAILS';
        const targetFace = result === 'HEADS' ? 0 : 180;
        setIsFlipping(true);
        setHasFlipped(true);
        setCoinRotation(prev => {
            const extraSpins = 6 + Math.floor(Math.random() * 3); // 6–8 Umdrehungen
            const fullTurns = (Math.floor(prev / 360) + extraSpins) * 360;
            return fullTurns + targetFace;
        });
        setTimeout(() => setIsFlipping(false), 2000);
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

    const handleStartEditQueue = (index: number, currentName: string): void => {
        setEditingIndex(index);
        setEditValue(currentName);
    };

    const handleCancelEditQueue = (): void => {
        setEditingIndex(-1);
        setEditValue('');
    };

    const handleSaveEditQueue = (index: number): void => {
        const newName = editValue.trim();
        const oldName = playerList[index];
        if (newName === '' || newName === oldName) {
            handleCancelEditQueue();
            return;
        }
        // Doppelte Namen vermeiden
        if (playerList.some((p, i) => i !== index && p === newName)) {
            handleCancelEditQueue();
            return;
        }
        setPlayerList(prev => prev.map((p, i) => (i === index ? newName : p)));
        handleCancelEditQueue();
    };

    const handleEditQueueKeyDown = (e: React.KeyboardEvent, index: number): void => {
        if (e.key === 'Enter') handleSaveEditQueue(index);
        if (e.key === 'Escape') handleCancelEditQueue();
    };

    const handleClearList = (): void => {
        setPlayerList([]);
        setTeams([]);
        setLeaders({});
        localStorage.removeItem('tt_queue');
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
        setLeaders({});
    };

    const handleSelectLeader = (squadIndex: number, member: string): void => {
        const isCurrentLeader = leaders[squadIndex] === member;
        setLeaders(prev => ({
            ...prev,
            [squadIndex]: isCurrentLeader ? '' : member,
        }));
        if (!isCurrentLeader) {
            // Leader sofort an die erste Stelle des Squads setzen
            setTeams(prev => prev.map((team, i) =>
                i === squadIndex ? [member, ...team.filter(m => m !== member)] : team
            ));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddPlayer();
    };

    const TeamDisplay = ({ teams }: { teams: string[][] }) => (
        <Box sx={{
            width: '100%',
            mt: 2,
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
            gap: 1,
        }}>
            {teams.map((team, index) => {
                const color = TEAM_COLORS[index % TEAM_COLORS.length];
                return (
                    <Box key={index} sx={{
                        border: '1px solid #2a2d35',
                        borderTopWidth: '2px',
                        borderTopColor: color,
                        p: 1.25,
                        backgroundColor: '#111318',
                    }}>
                        <Typography sx={{
                            fontSize: '0.55rem',
                            letterSpacing: '0.18em',
                            color: color,
                            textTransform: 'uppercase',
                            fontWeight: 700,
                            mb: 0.5,
                            fontFamily: '"Rajdhani", sans-serif',
                        }}>
                            Squad {index + 1}
                        </Typography>
                        {team.length > 0 ? (
                            team.map((member, mi) => {
                                const isLeader = leaders[index] === member;
                                return (
                                <Typography
                                    key={mi}
                                    onClick={() => handleSelectLeader(index, member)}
                                    sx={{
                                        color: isLeader ? color : '#c9d1d9',
                                        fontWeight: isLeader ? 700 : 600,
                                        letterSpacing: '0.04em',
                                        fontFamily: '"Rajdhani", sans-serif',
                                        fontSize: '1rem',
                                        lineHeight: 1.5,
                                        wordBreak: 'break-word',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 0.5,
                                        transition: 'color 0.15s ease',
                                        '&:hover': { color: color },
                                    }}
                                >
                                    <Box component="span" sx={{
                                        fontSize: '0.75rem',
                                        color: isLeader ? color : 'transparent',
                                        lineHeight: 1,
                                    }}>
                                        ★
                                    </Box>
                                    {member}
                                </Typography>
                                );
                            })
                        ) : (
                            <Typography sx={{
                                color: '#c9d1d9',
                                fontWeight: 600,
                                fontFamily: '"Rajdhani", sans-serif',
                                fontSize: '1rem',
                                lineHeight: 1.5,
                            }}>
                                —
                            </Typography>
                        )}
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
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', md: 'row' },
                    gap: 3,
                    alignItems: 'flex-start',
                }}>
                    {/* Left: controls */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, width: '100%', minWidth: 0 }}>
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

                    {/* Right: collapsible operator queue */}
                    <Box sx={{ width: { xs: '100%', md: 300 }, flexShrink: 0 }}>
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
                            {playerList.length === 0 ? (
                                <Typography sx={{
                                    px: 2,
                                    py: 2.5,
                                    fontSize: '0.7rem',
                                    letterSpacing: '0.12em',
                                    color: '#4a4d55',
                                    textTransform: 'uppercase',
                                    fontFamily: '"Rajdhani", sans-serif',
                                    fontWeight: 600,
                                    textAlign: 'center',
                                }}>
                                    No operators queued
                                </Typography>
                            ) : (
                                playerList.map((name, i) => {
                                    const isEditing = editingIndex === i;
                                    return (
                                    <Box
                                        key={name}
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            px: 2,
                                            py: 1.25,
                                            borderTop: i === 0 ? 'none' : '1px solid #1e2128',
                                            '&:hover': { backgroundColor: 'rgba(232, 103, 10, 0.04)' },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, minWidth: 0 }}>
                                            <Typography sx={{
                                                fontSize: '0.75rem',
                                                color: '#4a4d55',
                                                fontFamily: '"Rajdhani", sans-serif',
                                                fontWeight: 700,
                                                letterSpacing: '0.1em',
                                                minWidth: 20,
                                            }}>
                                                {String(i + 1).padStart(2, '0')}
                                            </Typography>
                                            {isEditing ? (
                                                <TextField
                                                    value={editValue}
                                                    onChange={e => setEditValue(e.target.value)}
                                                    onKeyDown={e => handleEditQueueKeyDown(e, i)}
                                                    autoFocus
                                                    variant="standard"
                                                    size="small"
                                                    sx={{
                                                        flex: 1,
                                                        '& .MuiInputBase-input': {
                                                            color: '#c9d1d9',
                                                            fontFamily: '"Rajdhani", sans-serif',
                                                            fontWeight: 600,
                                                            fontSize: '1.1rem',
                                                            letterSpacing: '0.05em',
                                                            p: 0,
                                                        },
                                                    }}
                                                />
                                            ) : (
                                                <Typography sx={{
                                                    fontFamily: '"Rajdhani", sans-serif',
                                                    fontWeight: 600,
                                                    fontSize: '1.1rem',
                                                    letterSpacing: '0.05em',
                                                    color: '#c9d1d9',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {name}
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            {isEditing ? (
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleSaveEditQueue(i)}
                                                        sx={{
                                                            color: '#3a3d45',
                                                            p: 0.5,
                                                            borderRadius: 0,
                                                            '&:hover': { color: '#2dd4bf', backgroundColor: 'transparent' },
                                                        }}
                                                    >
                                                        <CheckIcon sx={{ fontSize: '1rem' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={handleCancelEditQueue}
                                                        sx={{
                                                            color: '#3a3d45',
                                                            p: 0.5,
                                                            borderRadius: 0,
                                                            '&:hover': { color: '#f85149', backgroundColor: 'transparent' },
                                                        }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: '1rem' }} />
                                                    </IconButton>
                                                </>
                                            ) : (
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleStartEditQueue(i, name)}
                                                        sx={{
                                                            color: '#3a3d45',
                                                            p: 0.5,
                                                            borderRadius: 0,
                                                            '&:hover': { color: '#e8670a', backgroundColor: 'transparent' },
                                                        }}
                                                    >
                                                        <EditIcon sx={{ fontSize: '1rem' }} />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveFromQueue(name)}
                                                        sx={{
                                                            color: '#3a3d45',
                                                            p: 0.5,
                                                            borderRadius: 0,
                                                            '&:hover': {
                                                                color: '#f85149',
                                                                backgroundColor: 'transparent',
                                                            },
                                                        }}
                                                    >
                                                        <CloseIcon sx={{ fontSize: '1rem' }} />
                                                    </IconButton>
                                                </>
                                            )}
                                        </Box>
                                    </Box>
                                    );
                                })
                            )}
                        </Box>
                        </Collapse>
                    </Box>
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
                    py: 8,
                    gap: 5,
                }}>
                    {/* 3D coin */}
                    <Box
                        onClick={handleCoinToss}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleCoinToss()}
                        sx={{
                            width: 180,
                            height: 180,
                            perspective: '1000px',
                            cursor: isFlipping ? 'default' : 'pointer',
                            userSelect: 'none',
                            transition: 'transform 0.25s ease',
                            '&:hover': { transform: isFlipping ? 'none' : 'scale(1.05)' },
                            '&:active': { transform: isFlipping ? 'none' : 'scale(0.96)' },
                        }}
                    >
                        <Box sx={{
                            position: 'relative',
                            width: '100%',
                            height: '100%',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 2s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            transform: `rotateX(${coinRotation}deg)`,
                        }}>
                            {/* Front face — HEADS */}
                            <Box sx={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '2px solid #e8670a',
                                backgroundColor: '#111318',
                                backfaceVisibility: 'hidden',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 35px rgba(232, 103, 10, 0.3), inset 0 0 30px rgba(232, 103, 10, 0.06)',
                            }}>
                                <Typography sx={{
                                    fontFamily: '"Rajdhani", sans-serif',
                                    fontWeight: 700,
                                    fontSize: hasFlipped ? '1.6rem' : '1rem',
                                    letterSpacing: '0.2em',
                                    color: '#e8670a',
                                    textTransform: 'uppercase',
                                    textShadow: '0 0 24px rgba(232, 103, 10, 0.6)',
                                }}>
                                    {hasFlipped ? 'HEADS' : 'FLIP'}
                                </Typography>
                            </Box>

                            {/* Back face — TAILS */}
                            <Box sx={{
                                position: 'absolute',
                                inset: 0,
                                borderRadius: '50%',
                                border: '2px solid #2dd4bf',
                                backgroundColor: '#111318',
                                backfaceVisibility: 'hidden',
                                transform: 'rotateX(180deg)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 35px rgba(45, 212, 191, 0.3), inset 0 0 30px rgba(45, 212, 191, 0.06)',
                            }}>
                                <Typography sx={{
                                    fontFamily: '"Rajdhani", sans-serif',
                                    fontWeight: 700,
                                    fontSize: '1.6rem',
                                    letterSpacing: '0.2em',
                                    color: '#2dd4bf',
                                    textTransform: 'uppercase',
                                    textShadow: '0 0 24px rgba(45, 212, 191, 0.6)',
                                }}>
                                    TAILS
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Typography sx={{
                        fontFamily: '"Rajdhani", sans-serif',
                        fontWeight: 600,
                        fontSize: '0.62rem',
                        letterSpacing: '0.22em',
                        color: '#4a4d55',
                        textTransform: 'uppercase',
                        transition: 'opacity 0.3s ease',
                        opacity: isFlipping ? 1 : 0.6,
                    }}>
                        {isFlipping ? 'Flipping…' : 'Tap the coin to flip'}
                    </Typography>
                </Box>
            </TabPanel>
        </Box>
    );
};

export default TabNavigation;
