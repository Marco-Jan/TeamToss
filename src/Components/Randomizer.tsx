import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, TextField, IconButton } from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import BoltIcon from '@mui/icons-material/Bolt';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useLanguage } from '../i18n/LanguageContext';
import { tokens, DISPLAY_FONT, BODY_FONT } from './Thema/theme';
import { GAME_PACKS, getPack } from '../games/packs';
import type { GearItem, GearSlot } from '../games/types';
import { pick } from '../games/types';

type Mode = 'loadout' | 'players' | 'challenge';

const ROLL_MS = 1400; // Gesamtdauer der Würfel-Animation
const TICK_MS = 70;    // Wie schnell die Items durchrattern

// Ein zufälliges Item pro Slot ziehen.
function rollLoadout(slots: GearSlot[]): Record<string, GearItem> {
  const out: Record<string, GearItem> = {};
  for (const slot of slots) {
    if (slot.items.length) out[slot.id] = pick(slot.items);
  }
  return out;
}

interface RandomizerProps {
  // Geteilte Spielerliste aus dem Team Builder (für den Pro-Spieler-Modus).
  players: string[];
  onAddPlayer: (name: string) => void;
  onRemovePlayer: (name: string) => void;
}

const Randomizer: React.FC<RandomizerProps> = ({ players, onAddPlayer, onRemovePlayer }) => {
  const { t, lang } = useLanguage();

  const [packId, setPackId] = useState<string>(GAME_PACKS[0].id);
  const [playerInput, setPlayerInput] = useState<string>('');
  const [mode, setMode] = useState<Mode>('loadout');
  const pack = getPack(packId) ?? GAME_PACKS[0];

  // Slots: zunächst statisch, bei API-Packs nach dem Laden ersetzt.
  const [slots, setSlots] = useState<GearSlot[]>(pack.slots);
  const [loadingPack, setLoadingPack] = useState<boolean>(false);

  const [rolling, setRolling] = useState<boolean>(false);
  const [revealKey, setRevealKey] = useState<number>(0);
  const [loadout, setLoadout] = useState<Record<string, GearItem> | null>(null);
  const [challenge, setChallenge] = useState<string | null>(null);
  const [playerLoadouts, setPlayerLoadouts] = useState<{ name: string; loadout: Record<string, GearItem> }[]>([]);
  // Gemeinsame Slots (z. B. Map) – im Pro-Spieler-Modus einmal für alle.
  const [sharedLoadout, setSharedLoadout] = useState<Record<string, GearItem>>({});

  const intervalRef = useRef<number | null>(null);

  const sharedSlots = slots.filter((s) => s.shared);
  const perPlayerSlots = slots.filter((s) => !s.shared);
  const timeoutRef = useRef<number | null>(null);

  // Pack wechseln: statische Slots sofort, dann ggf. Live-Daten laden.
  useEffect(() => {
    const p = getPack(packId);
    if (!p) return;
    setSlots(p.slots);
    setLoadout(null);
    setChallenge(null);
    setPlayerLoadouts([]);
    setSharedLoadout({});
    if (!p.load) {
      setLoadingPack(false);
      return;
    }
    let cancelled = false;
    setLoadingPack(true);
    p.load()
      .then((loaded) => { if (!cancelled && loaded.length) setSlots(loaded); })
      .catch(() => { /* statischer Fallback bleibt aktiv */ })
      .finally(() => { if (!cancelled) setLoadingPack(false); });
    return () => { cancelled = true; };
  }, [packId]);

  // Timer beim Unmount aufräumen.
  useEffect(() => () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const setFinal = (names: string[]): void => {
    if (mode === 'loadout') {
      setLoadout(rollLoadout(slots));
    } else if (mode === 'challenge') {
      setChallenge(pick(pack.challenges).text[lang]);
    } else {
      // Gemeinsame Slots (Map, Seite) einmal – pro-Spieler-Slots je Spieler.
      setSharedLoadout(rollLoadout(sharedSlots));
      setPlayerLoadouts(names.map((name) => ({ name, loadout: rollLoadout(perPlayerSlots) })));
    }
  };

  const doRoll = (): void => {
    if (rolling || loadingPack) return;
    const names = mode === 'players' ? players : [];
    if (mode === 'players' && names.length === 0) return;
    setRolling(true);
    // Items durchrattern lassen …
    intervalRef.current = window.setInterval(() => setFinal(names), TICK_MS);
    // … und nach ROLL_MS auf dem Endergebnis einrasten.
    timeoutRef.current = window.setTimeout(() => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setFinal(names);
      setRolling(false);
      setRevealKey((k) => k + 1);
    }, ROLL_MS);
  };

  const handleInlineAdd = (): void => {
    const name = playerInput.trim();
    if (!name) return;
    onAddPlayer(name);
    setPlayerInput('');
  };

  const accent = pack.accent;
  const hasResult =
    (mode === 'loadout' && loadout) ||
    (mode === 'challenge' && challenge) ||
    (mode === 'players' && playerLoadouts.length > 0);

  const rollLabelKey =
    mode === 'challenge' ? 'rng.roll.challenge'
      : mode === 'players' ? 'rng.roll.players'
        : 'rng.roll.loadout';

  // ── Einzelne Gear-Kachel ──
  const GearCard = ({ slot, item }: { slot: GearSlot; item?: GearItem }) => (
    <Box sx={{
      borderRadius: '14px',
      border: `1px solid ${tokens.border}`,
      backgroundColor: tokens.surface,
      overflow: 'hidden',
      animation: rolling ? 'tt-rolling 0.18s linear infinite' : undefined,
    }}>
      <Box sx={{ height: 4, backgroundColor: accent }} />
      <Box sx={{ p: 1.5, display: 'flex', alignItems: 'center', gap: 1.25, minHeight: 64 }}>
        {item?.image && (
          <Box sx={{
            width: 56, height: 40, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img
              src={item.image}
              alt=""
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>
        )}
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{
            fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase',
            color: tokens.muted, fontWeight: 700, mb: 0.25,
          }}>
            {slot.label[lang]}
          </Typography>
          <Typography sx={{
            fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: '1.05rem',
            color: tokens.ink, lineHeight: 1.1, wordBreak: 'break-word',
          }}>
            {item?.name ?? '—'}
          </Typography>
          {item?.category && (
            <Typography sx={{ fontSize: '0.72rem', color: tokens.faint, mt: 0.15 }}>
              {item.category}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );

  const LoadoutGrid = ({ data, slotList }: { data: Record<string, GearItem>; slotList: GearSlot[] }) => (
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
      gap: 1.25,
    }}>
      {slotList.map((slot) => <GearCard key={slot.id} slot={slot} item={data[slot.id]} />)}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ── Spiel-Auswahl ── */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.25 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: tokens.brand }} />
          <Typography component="h2" sx={{ fontFamily: DISPLAY_FONT, fontWeight: 700, fontSize: '0.95rem', color: tokens.ink }}>
            {t('rng.pickGame')}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {GAME_PACKS.map((p) => {
            const active = p.id === packId;
            return (
              <Box
                key={p.id}
                onClick={() => setPackId(p.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setPackId(p.id)}
                sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.75,
                  px: 1.75, py: 1, borderRadius: '10px', cursor: 'pointer', userSelect: 'none',
                  border: `1px solid ${active ? p.accent : tokens.border2}`,
                  background: active
                    ? `linear-gradient(180deg, ${p.accent}26, ${p.accent}10)`
                    : `linear-gradient(180deg, ${tokens.surface2}, ${tokens.surface})`,
                  // Leichter 3D-Effekt: heller Rand oben, solide Kante + Schatten unten.
                  boxShadow: active
                    ? `inset 0 1px 0 ${p.accent}55, 0 2px 0 ${p.accent}66, 0 5px 14px ${p.accent}33`
                    : 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 0 #0B0D12, 0 4px 8px rgba(0,0,0,0.45)',
                  transition: 'transform 0.12s ease, box-shadow 0.12s ease, border-color 0.15s ease, background 0.15s ease',
                  '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: active
                      ? `inset 0 1px 0 ${p.accent}55, 0 3px 0 ${p.accent}66, 0 7px 18px ${p.accent}3D`
                      : 'inset 0 1px 0 rgba(255,255,255,0.06), 0 3px 0 #0B0D12, 0 6px 12px rgba(0,0,0,0.5)',
                  },
                  '&:active': {
                    transform: 'translateY(1px)',
                    boxShadow: active
                      ? `inset 0 1px 0 ${p.accent}55, 0 1px 0 ${p.accent}66, 0 2px 6px ${p.accent}33`
                      : 'inset 0 1px 2px rgba(0,0,0,0.5), 0 1px 0 #0B0D12',
                  },
                }}
              >
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: p.accent, boxShadow: `0 0 6px ${p.accent}` }} />
                <Typography sx={{
                  fontWeight: 700, fontSize: '0.85rem',
                  color: active ? tokens.ink : tokens.muted,
                }}>
                  {p.name}
                </Typography>
                {p.load && (
                  <Typography sx={{
                    fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.08em',
                    textTransform: 'uppercase', color: p.accent,
                    border: `1px solid ${p.accent}66`, borderRadius: '4px', px: 0.5, py: 0.1,
                  }}>
                    {t('rng.source.live')}
                  </Typography>
                )}
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* ── Modus-Auswahl ── */}
      <Box sx={{
        display: 'flex', width: '100%', p: 0.5, borderRadius: '14px',
        border: `1px solid ${tokens.border}`, backgroundColor: tokens.surface,
      }}>
        {(['loadout', 'players', 'challenge'] as Mode[]).map((m) => {
          const active = m === mode;
          return (
            <Box
              key={m}
              onClick={() => setMode(m)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setMode(m)}
              sx={{
                flex: 1, textAlign: 'center', py: 1, borderRadius: '10px', cursor: 'pointer', userSelect: 'none',
                background: active ? `linear-gradient(180deg, ${tokens.surface2}, ${tokens.surface})` : 'transparent',
                color: active ? tokens.ink : tokens.muted,
                boxShadow: active ? 'inset 0 1px 0 rgba(255,255,255,0.06), 0 2px 0 #0B0D12, 0 4px 10px rgba(0,0,0,0.5)' : 'none',
                fontWeight: 700, fontSize: '0.85rem', fontFamily: BODY_FONT,
                transition: 'color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              {t(`rng.mode.${m}`)}
            </Box>
          );
        })}
      </Box>

      {/* ── Inline-Spielerliste (Pro-Spieler-Modus, geteilt mit Team Builder) ── */}
      {mode === 'players' && (
        <Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              placeholder={t('builder.addOperator')}
              value={playerInput}
              onChange={(e) => setPlayerInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleInlineAdd(); }}
              inputProps={{ 'aria-label': t('builder.addOperator') }}
            />
            <Button variant="contained" onClick={handleInlineAdd} aria-label={t('builder.addOperator')} sx={{ minWidth: 56, px: 1.5 }}>
              <AddIcon />
            </Button>
          </Box>
          {players.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1.5 }}>
              {players.map((name) => (
                <Box key={name} sx={{
                  display: 'inline-flex', alignItems: 'center', gap: 0.25,
                  pl: 1, pr: 0.25, py: 0.4, borderRadius: '8px',
                  border: `1px solid ${tokens.border2}`,
                  background: `linear-gradient(180deg, ${tokens.surface2}, ${tokens.surface})`,
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 0 #0B0D12, 0 3px 6px rgba(0,0,0,0.4)',
                }}>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', color: tokens.ink, px: 0.25 }}>
                    {name}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => onRemovePlayer(name)}
                    aria-label={`${name} entfernen`}
                    sx={{ p: 0.25, color: tokens.faint, '&:hover': { color: tokens.danger, backgroundColor: 'transparent' } }}
                  >
                    <CloseIcon sx={{ fontSize: '0.9rem' }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* ── Aktion ── */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="contained"
          fullWidth
          size="large"
          onClick={doRoll}
          disabled={rolling || loadingPack || (mode === 'players' && players.length === 0)}
          startIcon={mode === 'challenge' ? <BoltIcon /> : <CasinoIcon />}
          sx={{ py: 1.5, fontSize: '1.05rem' }}
        >
          {rolling ? t('rng.rolling') : hasResult ? t('rng.again') : t(rollLabelKey)}
        </Button>

        {loadingPack && (
          <Typography sx={{ mt: 1.5, fontSize: '0.82rem', color: accent, fontWeight: 600 }}>
            {t('rng.loadingGear')}
          </Typography>
        )}
        {mode === 'players' && players.length === 0 && !loadingPack && (
          <Typography sx={{ mt: 1.5, fontSize: '0.82rem', color: tokens.faint }}>
            {t('rng.players.empty')}
          </Typography>
        )}
        {mode === 'challenge' && !loadingPack && (
          <Typography sx={{ mt: 1.5, fontSize: '0.82rem', color: tokens.faint }}>
            {t('rng.challenge.hint')}
          </Typography>
        )}
      </Box>

      {/* ── Ergebnis ── */}
      {mode === 'loadout' && loadout && (
        <Box key={revealKey} sx={{ animation: rolling ? undefined : 'tt-deal-in 0.35s ease both' }}>
          <LoadoutGrid data={loadout} slotList={slots} />
        </Box>
      )}

      {mode === 'challenge' && challenge && (
        <Box
          key={revealKey}
          sx={{
            animation: rolling ? 'tt-rolling 0.18s linear infinite' : 'tt-deal-in 0.35s ease both',
            borderRadius: '16px',
            border: `1px solid ${accent}66`,
            background: `linear-gradient(135deg, ${accent}1A, transparent)`,
            p: { xs: 3, sm: 4 },
            textAlign: 'center',
          }}
        >
          <Typography sx={{
            fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
            color: accent, fontWeight: 800, mb: 1,
          }}>
            {pack.name} · {t('rng.mode.challenge')}
          </Typography>
          <Typography sx={{
            fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: { xs: '1.4rem', sm: '1.7rem' },
            color: tokens.ink, lineHeight: 1.2,
          }}>
            {challenge}
          </Typography>
        </Box>
      )}

      {mode === 'players' && playerLoadouts.length > 0 && (
        <Box key={revealKey} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Gemeinsam für alle (Map / Seite) */}
          {sharedSlots.length > 0 && (
            <Box sx={{
              animation: rolling ? undefined : 'tt-deal-in 0.35s ease both',
              borderRadius: '16px',
              border: `1px solid ${accent}55`,
              background: `linear-gradient(135deg, ${accent}14, transparent)`,
              p: 1.5,
            }}>
              <Typography sx={{
                fontSize: '0.62rem', letterSpacing: '0.14em', textTransform: 'uppercase',
                color: accent, fontWeight: 800, mb: 1,
              }}>
                {t('rng.players.shared')}
              </Typography>
              <LoadoutGrid data={sharedLoadout} slotList={sharedSlots} />
            </Box>
          )}

          {/* Pro Spieler */}
          {playerLoadouts.map((p, i) => (
            <Box
              key={`${p.name}-${i}`}
              sx={{
                animation: rolling ? undefined : 'tt-deal-in 0.35s ease both',
                animationDelay: rolling ? undefined : `${i * 0.05}s`,
              }}
            >
              <Typography sx={{
                fontFamily: DISPLAY_FONT, fontWeight: 800, fontSize: '1.05rem',
                color: accent, mb: 0.75,
              }}>
                {p.name}
              </Typography>
              <LoadoutGrid data={p.loadout} slotList={perPlayerSlots} />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Randomizer;
