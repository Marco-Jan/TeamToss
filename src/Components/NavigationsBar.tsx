import React, { useState, useEffect, useCallback } from 'react';
import { Box, Tabs, Tab, Typography, Button, TextField, IconButton, Tooltip, Snackbar, Alert, Collapse } from '@mui/material';
import TeamSizeSelector from './TeamSizeSelector';
import NicknameManager from './NickNameManager';
import Randomizer from './Randomizer';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getNicknames, addNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { useLanguage } from '../i18n/LanguageContext';
import { tokens, DISPLAY_FONT, BODY_FONT, TEAM_COLORS } from './Thema/theme';

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
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </Box>
    );
}

function a11yProps(index: number) {
    return { id: `tab-${index}`, 'aria-controls': `tabpanel-${index}` };
}

// Small section eyebrow with an accent dot.
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
        <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: tokens.brand }} />
        <Typography component="h2" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: '0.95rem', color: tokens.ink }}>
            {children}
        </Typography>
    </Box>
);

const TabNavigation: React.FC = () => {
    const { t } = useLanguage();
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
    // Vorab markierte Captains (werden beim Generieren auf verschiedene Teams verteilt).
    const [captains, setCaptains] = useState<string[]>(() => {
        try {
            const saved = localStorage.getItem('tt_captains');
            return saved ? JSON.parse(saved) : [];
        } catch { return []; }
    });

    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [rosterOpen, setRosterOpen] = useState<boolean>(false);
    // Gespeicherte Spieler (Firestore) – zentral hier, damit Speichern oben und
    // Auswählen unten dieselbe Liste teilen.
    const [nicknames, setNicknames] = useState<Nickname[]>([]);
    const [teamSize, setTeamSize] = useState<string>('Team2');

    const refreshNicknames = useCallback(async () => {
        setNicknames(await getNicknames());
    }, []);
    // Hinweis, wenn ein bereits vorhandener Name in die Liste soll.
    const [duplicateWarning, setDuplicateWarning] = useState<string>('');
    // Bestätigung nach dem Speichern in den Kader.
    const [saveMessage, setSaveMessage] = useState<string>('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            // Roster (Firestore) nur für vollwertige Google-Konten – nicht für anonyme Gäste.
            const loggedIn = !!user && !user.isAnonymous;
            setIsLoggedIn(loggedIn);
            if (loggedIn) {
                void refreshNicknames();
            } else {
                setNicknames([]);
            }
        });
        return unsubscribe;
    }, [refreshNicknames]);

    // Alle noch nicht gespeicherten Spieler der Queue auf einmal in den Kader speichern.
    const handleSaveAll = async (): Promise<void> => {
        const toSave = playerList.filter(p => !nicknames.some(n => n.NickName === p));
        if (toSave.length === 0) return;
        for (const name of toSave) {
            await addNickname(name);
        }
        await refreshNicknames();
        setSaveMessage(t('builder.savedAll', { n: toSave.length }));
    };

    useEffect(() => {
        localStorage.setItem('tt_queue', JSON.stringify(playerList));
    }, [playerList]);

    useEffect(() => {
        localStorage.setItem('tt_captains', JSON.stringify(captains));
    }, [captains]);

    const handleToggleCaptain = (name: string): void => {
        setCaptains(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
    };

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

    const handleAddPlayer = (nickname?: string): void => {
        const nameToAdd = nickname?.trim() || playerInput.trim();
        if (nameToAdd === '') return;
        if (playerList.includes(nameToAdd)) {
            setDuplicateWarning(t('builder.duplicate', { name: nameToAdd }));
            return;
        }
        setPlayerList(prev => [...prev, nameToAdd]);
        setPlayerInput('');
    };

    const handleRemoveFromQueue = (name: string): void => {
        setPlayerList(prev => prev.filter(p => p !== name));
        setCaptains(prev => prev.filter(c => c !== name));
    };

    const handleClearList = (): void => {
        setPlayerList([]);
        setTeams([]);
        setLeaders({});
        setCaptains([]);
        localStorage.removeItem('tt_queue');
        localStorage.removeItem('tt_captains');
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
        const newTeams: string[][] = Array.from({ length: numberOfTeams }, () => []);

        // Markierte Captains zuerst – je einer pro Team (Round-Robin), damit sie sich verteilen.
        const activeCaptains = shuffleArray(playerList.filter(p => captains.includes(p)));
        const others = shuffleArray(playerList.filter(p => !captains.includes(p)));

        activeCaptains.forEach((captain, i) => {
            newTeams[i % numberOfTeams].push(captain);
        });

        // Restliche Spieler immer ins aktuell kleinste Team – hält die Teams ausgeglichen.
        others.forEach(player => {
            let minIdx = 0;
            for (let i = 1; i < numberOfTeams; i++) {
                if (newTeams[i].length < newTeams[minIdx].length) minIdx = i;
            }
            newTeams[minIdx].push(player);
        });

        // Captain an Position 0 eines Teams wird automatisch Anführer.
        const newLeaders: Record<number, string> = {};
        newTeams.forEach((team, i) => {
            if (team.length > 0 && captains.includes(team[0])) {
                newLeaders[i] = team[0];
            }
        });

        setTeams(newTeams);
        setLeaders(newLeaders);
    };

    const handleSelectLeader = (squadIndex: number, member: string): void => {
        const isCurrentLeader = leaders[squadIndex] === member;
        setLeaders(prev => ({
            ...prev,
            [squadIndex]: isCurrentLeader ? '' : member,
        }));
        if (!isCurrentLeader) {
            // Leader sofort an die erste Stelle des Teams setzen
            setTeams(prev => prev.map((team, i) =>
                i === squadIndex ? [member, ...team.filter(m => m !== member)] : team
            ));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAddPlayer();
    };

    const canGenerate = playerList.length >= 2;

    // ── Team result cards (neon jerseys) ──
    const TeamDisplay = ({ teams }: { teams: string[][] }) => (
        <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)' },
            gap: 1.5,
        }}>
            {teams.map((team, index) => {
                const color = TEAM_COLORS[index % TEAM_COLORS.length];
                return (
                    <Box key={index} sx={{
                        position: 'relative',
                        borderRadius: '14px',
                        overflow: 'hidden',
                        border: `1px solid ${tokens.border}`,
                        backgroundColor: tokens.surface,
                        animation: 'tt-deal-in 0.35s ease both',
                        animationDelay: `${index * 0.06}s`,
                    }}>
                        {/* colour band */}
                        <Box sx={{ height: 4, backgroundColor: color }} />
                        <Box sx={{ p: 1.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography sx={{
                                    fontFamily: DISPLAY_FONT,
                                    fontWeight: 900,
                                    fontSize: '1.6rem',
                                    lineHeight: 1,
                                    color: color,
                                }}>
                                    {index + 1}
                                </Typography>
                                <Typography component="h3" sx={{
                                    fontSize: '0.62rem',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: tokens.muted,
                                    fontWeight: 700,
                                }}>
                                    {t('builder.squad', { n: index + 1 })}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                                {team.length > 0 ? team.map((member, mi) => {
                                    const isLeader = leaders[index] === member;
                                    return (
                                        <Box
                                            key={mi}
                                            onClick={() => handleSelectLeader(index, member)}
                                            role="button"
                                            tabIndex={0}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSelectLeader(index, member)}
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 0.5,
                                                py: 0.4,
                                                cursor: 'pointer',
                                                transition: 'color 0.12s ease',
                                                color: isLeader ? color : tokens.ink,
                                                fontWeight: isLeader ? 800 : 600,
                                                '&:hover': { color: color },
                                            }}
                                        >
                                            <StarIcon sx={{
                                                fontSize: '0.85rem',
                                                color: isLeader ? color : 'transparent',
                                                flexShrink: 0,
                                            }} />
                                            <Typography component="span" sx={{
                                                fontFamily: BODY_FONT,
                                                fontWeight: 'inherit',
                                                color: 'inherit',
                                                fontSize: '0.98rem',
                                                wordBreak: 'break-word',
                                            }}>
                                                {member}
                                            </Typography>
                                        </Box>
                                    );
                                }) : (
                                    <Typography sx={{ color: tokens.faint, fontSize: '0.98rem' }}>—</Typography>
                                )}
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );

    return (
        <Box sx={{ width: '100%' }}>
            {/* ── Segmented tabs ── */}
            <Box sx={{
                display: 'inline-flex',
                width: '100%',
                p: 0.5,
                borderRadius: '14px',
                border: `1px solid ${tokens.border}`,
                backgroundColor: tokens.surface,
            }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    variant="fullWidth"
                    aria-label="navigation tabs"
                    sx={{ width: '100%', minHeight: 'unset' }}
                >
                    <Tab label={t('tab.teamBuilder')} {...a11yProps(0)} />
                    <Tab label={t('tab.randomizer')} {...a11yProps(1)} />
                    <Tab label={t('tab.coinFlip')} {...a11yProps(2)} />
                </Tabs>
            </Box>

            {/* ── Team Builder ── */}
            <TabPanel value={value} index={0}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    {/* Step 1 — add players */}
                    <Box>
                        <SectionLabel>{t('builder.addOperator')}</SectionLabel>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                placeholder={t('builder.addOperator')}
                                value={playerInput}
                                onChange={(e) => setPlayerInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                inputProps={{ 'aria-label': t('builder.addOperator') }}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleAddPlayer()}
                                aria-label={t('builder.addOperator')}
                                sx={{ minWidth: 56, px: 1.5 }}
                            >
                                <AddIcon />
                            </Button>
                        </Box>

                        {/* Player count + clear */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, mb: 1 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', color: tokens.muted }}>
                                {playerList.length === 1
                                    ? t('builder.queuedOne', { n: playerList.length })
                                    : t('builder.queuedOther', { n: playerList.length })}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {isLoggedIn && playerList.some(p => !nicknames.some(n => n.NickName === p)) && (
                                    <Button
                                        onClick={() => void handleSaveAll()}
                                        startIcon={<BookmarkBorderIcon sx={{ fontSize: '1rem' }} />}
                                        sx={{
                                            py: 0.25, px: 1.25, minWidth: 0,
                                            fontSize: '0.78rem', fontWeight: 700,
                                            color: tokens.teal,
                                            border: `1px solid ${tokens.teal}66`,
                                            borderRadius: '999px',
                                            '&:hover': { backgroundColor: 'rgba(34,211,197,0.08)', borderColor: tokens.teal },
                                        }}
                                    >
                                        {t('builder.saveAll')}
                                    </Button>
                                )}
                                {playerList.length > 0 && (
                                    <Button
                                        onClick={handleClearList}
                                        sx={{
                                            py: 0.25, px: 1, minWidth: 0,
                                            fontSize: '0.78rem', fontWeight: 600,
                                            color: tokens.faint,
                                            '&:hover': { color: tokens.danger, backgroundColor: 'transparent' },
                                        }}
                                    >
                                        {t('builder.clear')}
                                    </Button>
                                )}
                            </Box>
                        </Box>

                        {playerList.length === 0 ? (
                            <Box sx={{
                                py: 3, px: 2,
                                borderRadius: '12px',
                                border: `1px dashed ${tokens.border2}`,
                                textAlign: 'center',
                            }}>
                                <Typography sx={{ color: tokens.muted, fontSize: '0.92rem' }}>
                                    {t('builder.emptyHint')}
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {playerList.map((name) => {
                                        const isCaptain = captains.includes(name);
                                        return (
                                            <Box key={name} sx={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: 0.25,
                                                pl: 0.5, pr: 0.25, py: 0.4,
                                                borderRadius: '8px',
                                                border: `1px solid ${isCaptain ? tokens.brand : tokens.border2}`,
                                                background: isCaptain
                                                    ? `linear-gradient(180deg, ${tokens.brand}24, ${tokens.brand}10)`
                                                    : `linear-gradient(180deg, ${tokens.surface2}, ${tokens.surface})`,
                                                boxShadow: isCaptain
                                                    ? `inset 0 1px 0 ${tokens.brand}55, 0 2px 0 ${tokens.brand}55, 0 4px 10px ${tokens.brand}2E`
                                                    : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 0 #0B0D12, 0 3px 6px rgba(0,0,0,0.4)',
                                            }}>
                                                <Tooltip title={t('builder.captainTooltip')} placement="top" arrow>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleToggleCaptain(name)}
                                                        aria-label={t('builder.captainTooltip')}
                                                        sx={{
                                                            p: 0.25,
                                                            color: isCaptain ? tokens.brand : tokens.faint,
                                                            '&:hover': { color: tokens.brand, backgroundColor: 'transparent' },
                                                        }}
                                                    >
                                                        {isCaptain
                                                            ? <StarIcon sx={{ fontSize: '1.05rem' }} />
                                                            : <StarBorderIcon sx={{ fontSize: '1.05rem' }} />}
                                                    </IconButton>
                                                </Tooltip>
                                                <Typography sx={{
                                                    fontWeight: isCaptain ? 700 : 600,
                                                    fontSize: '0.95rem',
                                                    color: isCaptain ? tokens.brand : tokens.ink,
                                                    px: 0.25,
                                                    maxWidth: 180,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}>
                                                    {name}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleRemoveFromQueue(name)}
                                                    aria-label={`${name} entfernen`}
                                                    sx={{
                                                        p: 0.25,
                                                        color: tokens.faint,
                                                        '&:hover': { color: tokens.danger, backgroundColor: 'transparent' },
                                                    }}
                                                >
                                                    <CloseIcon sx={{ fontSize: '0.95rem' }} />
                                                </IconButton>
                                            </Box>
                                        );
                                    })}
                                </Box>
                                <Typography sx={{ mt: 1.25, fontSize: '0.78rem', color: tokens.faint }}>
                                    {t('builder.captainHint')}
                                </Typography>
                            </>
                        )}
                    </Box>

                    {/* Gespeicherte Spieler laden (Kader) – nur mit Google-Login */}
                    {isLoggedIn && (
                        <Box>
                            <Box
                                onClick={() => setRosterOpen(o => !o)}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => e.key === 'Enter' && setRosterOpen(o => !o)}
                                sx={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    cursor: 'pointer', py: 0.5,
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: tokens.brand }} />
                                    <Typography component="h2" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: '0.95rem', color: tokens.ink }}>
                                        {t('builder.loadRoster')}
                                    </Typography>
                                </Box>
                                <ExpandMoreIcon sx={{
                                    color: tokens.muted,
                                    transform: rosterOpen ? 'rotate(180deg)' : 'none',
                                    transition: 'transform 0.2s ease',
                                }} />
                            </Box>
                            <Collapse in={rosterOpen}>
                                <Box sx={{ pt: 1 }}>
                                    <NicknameManager
                                        playerList={playerList}
                                        onAddPlayer={handleAddPlayer}
                                        updatePlayerList={updatePlayerList}
                                        nicknames={nicknames}
                                        refreshNicknames={refreshNicknames}
                                    />
                                </Box>
                            </Collapse>
                        </Box>
                    )}

                    {/* Step 2 — number of teams */}
                    <TeamSizeSelector teamSize={teamSize} setTeamSize={setTeamSize} />

                    {/* Step 3 — generate */}
                    <Button
                        variant="contained"
                        fullWidth
                        size="large"
                        onClick={handleGenerateTeams}
                        disabled={!canGenerate}
                        startIcon={<ShuffleIcon />}
                        sx={{ py: 1.5, fontSize: '1.05rem' }}
                    >
                        {teams.length > 0 ? t('builder.generateAgain') : t('builder.generate')}
                    </Button>

                    {/* Results */}
                    {teams.length > 0 && (
                        <Box>
                            <Typography sx={{ mb: 1.25, fontSize: '0.78rem', color: tokens.faint, textAlign: 'center' }}>
                                {t('builder.leaderHint')}
                            </Typography>
                            <TeamDisplay teams={teams} />
                        </Box>
                    )}
                </Box>
            </TabPanel>

            {/* ── Coin Flip ── */}
            <TabPanel value={value} index={2}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: { xs: 6, sm: 8 }, gap: 4 }}>
                    <Box
                        onClick={handleCoinToss}
                        role="button"
                        tabIndex={0}
                        aria-label={t('coin.tap')}
                        onKeyDown={(e) => e.key === 'Enter' && handleCoinToss()}
                        sx={{
                            width: 190,
                            height: 190,
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
                            {/* HEADS */}
                            <Box sx={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                border: `3px solid ${tokens.brand}`,
                                background: 'radial-gradient(circle at 35% 30%, #1E232E, #11141B)',
                                backfaceVisibility: 'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 45px rgba(255,106,43,0.35), inset 0 0 30px rgba(255,106,43,0.08)',
                            }}>
                                <Typography sx={{
                                    fontFamily: DISPLAY_FONT, fontWeight: 800,
                                    fontSize: hasFlipped ? '1.7rem' : '1.05rem',
                                    color: tokens.brand,
                                    textShadow: '0 0 24px rgba(255,106,43,0.6)',
                                }}>
                                    {hasFlipped ? t('coin.heads') : t('coin.flip')}
                                </Typography>
                            </Box>

                            {/* TAILS */}
                            <Box sx={{
                                position: 'absolute', inset: 0, borderRadius: '50%',
                                border: `3px solid ${tokens.teal}`,
                                background: 'radial-gradient(circle at 35% 30%, #1E232E, #11141B)',
                                backfaceVisibility: 'hidden',
                                transform: 'rotateX(180deg)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 45px rgba(34,211,197,0.35), inset 0 0 30px rgba(34,211,197,0.08)',
                            }}>
                                <Typography sx={{
                                    fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: '1.7rem',
                                    color: tokens.teal,
                                    textShadow: '0 0 24px rgba(34,211,197,0.6)',
                                }}>
                                    {t('coin.tails')}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Typography sx={{
                        fontWeight: 600, fontSize: '0.92rem', color: tokens.muted,
                        transition: 'opacity 0.3s ease', opacity: isFlipping ? 1 : 0.85,
                    }}>
                        {isFlipping ? t('coin.flipping') : t('coin.tap')}
                    </Typography>
                </Box>
            </TabPanel>

            {/* ── Gear Roll ── */}
            <TabPanel value={value} index={1}>
                <Randomizer
                    players={playerList}
                    onAddPlayer={handleAddPlayer}
                    onRemovePlayer={handleRemoveFromQueue}
                />
            </TabPanel>

            <Snackbar
                open={!!duplicateWarning}
                autoHideDuration={3000}
                onClose={() => setDuplicateWarning('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="warning"
                    variant="filled"
                    onClose={() => setDuplicateWarning('')}
                    sx={{ fontFamily: BODY_FONT, fontWeight: 600, borderRadius: '12px' }}
                >
                    {duplicateWarning}
                </Alert>
            </Snackbar>

            <Snackbar
                open={!!saveMessage}
                autoHideDuration={2500}
                onClose={() => setSaveMessage('')}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    severity="success"
                    variant="filled"
                    onClose={() => setSaveMessage('')}
                    sx={{ fontFamily: BODY_FONT, fontWeight: 600, borderRadius: '12px' }}
                >
                    {saveMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default TabNavigation;
