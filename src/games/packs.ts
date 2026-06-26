// Game-Packs für den Randomizer.
//
// Zwei Daten-Strategien (siehe Brainstorming):
//  • Statisch  – kleine, selten geänderte Listen direkt im Code (CS2, R6).
//                Null API-Abhängigkeit, funktioniert offline; Patches manuell.
//  • Loader    – holt aktuelle Daten clientseitig aus einer GRATIS, key-freien,
//                CORS-tauglichen API und cached sie in localStorage (Valorant,
//                LoL). Self-updating: kein Nachpflegen bei Patches.
//
// Da das Projekt auf Firebase Spark läuft (kein Backend/Cron), passiert alles
// im Browser. Der Cache schont die API und macht die App offline-fähig.

import type { GamePack, GearSlot } from './types';
import { tokens } from '../Components/Thema/theme';

// ── localStorage-Cache für API-Loader ─────────────────────────────
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 h
// Bei Strukturänderungen an den Slots hochzählen – invalidiert alte Caches.
const CACHE_VERSION = 'v2';

interface CacheEntry {
  ts: number;
  slots: GearSlot[];
}

function readCache(key: string): GearSlot[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry;
    if (Date.now() - entry.ts > CACHE_TTL) return null;
    return entry.slots;
  } catch {
    return null;
  }
}

function writeCache(key: string, slots: GearSlot[]): void {
  try {
    localStorage.setItem(key, JSON.stringify({ ts: Date.now(), slots } satisfies CacheEntry));
  } catch {
    /* Quota o. Ä. – Cache ist optional, ignorieren */
  }
}

// ── Valorant: valorant-api.com (gratis, kein Key, CORS *) ─────────
interface ValApiResponse<T> { data: T[]; }
interface ValWeapon {
  displayName: string;
  category: string;            // z. B. "EEquippableCategory::Rifle"
  displayIcon: string | null;
  shopData: { categoryText: string } | null;
}
interface ValAgent { displayName: string; displayIcon: string | null; }
interface ValMap { displayName: string; tacticalDescription: string | null; }

async function loadValorant(): Promise<GearSlot[]> {
  const CACHE_KEY = `tt_pack_valorant_${CACHE_VERSION}`;
  const cached = readCache(CACHE_KEY);
  if (cached) return cached;

  const [wRes, aRes, mRes] = await Promise.all([
    fetch('https://valorant-api.com/v1/weapons'),
    fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true'),
    fetch('https://valorant-api.com/v1/maps'),
  ]);
  const weapons = (await wRes.json() as ValApiResponse<ValWeapon>).data;
  const agents = (await aRes.json() as ValApiResponse<ValAgent>).data;
  const maps = (await mRes.json() as ValApiResponse<ValMap>).data;

  const isSidearm = (w: ValWeapon) => w.category.endsWith('Sidearm');
  const isMelee = (w: ValWeapon) => w.category.endsWith('Melee');

  const slots: GearSlot[] = [
    {
      id: 'sidearm',
      label: { de: 'Sekundärwaffe', en: 'Sidearm' },
      items: weapons.filter(isSidearm).map((w) => ({
        name: w.displayName,
        category: w.shopData?.categoryText,
        image: w.displayIcon ?? undefined,
      })),
    },
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: weapons.filter((w) => !isSidearm(w) && !isMelee(w)).map((w) => ({
        name: w.displayName,
        category: w.shopData?.categoryText,
        image: w.displayIcon ?? undefined,
      })),
    },
    {
      id: 'agent',
      label: { de: 'Agent', en: 'Agent' },
      items: agents.map((a) => ({ name: a.displayName, image: a.displayIcon ?? undefined })),
    },
    {
      id: 'map',
      label: { de: 'Map', en: 'Map' },
      shared: true,
      items: maps
        .filter((m) => m.displayName !== 'The Range' && m.tacticalDescription !== null)
        .map((m) => ({ name: m.displayName })),
    },
  ];

  writeCache(CACHE_KEY, slots);
  return slots;
}

// ── League of Legends: Riot Data Dragon CDN (gratis, kein Key) ────
interface DDChampion { name: string; image: { full: string }; }
interface DDChampionResponse { data: Record<string, DDChampion>; }

async function loadLol(): Promise<GearSlot[]> {
  const CACHE_KEY = `tt_pack_lol_${CACHE_VERSION}`;
  const cached = readCache(CACHE_KEY);
  if (cached) return cached;

  const versions = await (await fetch('https://ddragon.leagueoflegends.com/api/versions.json')).json() as string[];
  const ver = versions[0];
  const champs = await (await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${ver}/data/en_US/champion.json`,
  )).json() as DDChampionResponse;

  const champions = Object.values(champs.data).map((c) => ({
    name: c.name,
    image: `https://ddragon.leagueoflegends.com/cdn/${ver}/img/champion/${c.image.full}`,
  }));

  const slots: GearSlot[] = [
    {
      id: 'role',
      label: { de: 'Rolle', en: 'Role' },
      items: [
        { name: 'Top' }, { name: 'Jungle' }, { name: 'Mid' },
        { name: 'Bot (ADC)' }, { name: 'Support' },
      ],
    },
    { id: 'champion', label: { de: 'Champion', en: 'Champion' }, items: champions },
    {
      id: 'summoner',
      label: { de: 'Beschwörerzauber', en: 'Summoner Spell' },
      items: ['Flash', 'Ignite', 'Teleport', 'Heal', 'Exhaust', 'Barrier', 'Cleanse', 'Smite', 'Ghost']
        .map((name) => ({ name })),
    },
  ];

  writeCache(CACHE_KEY, slots);
  return slots;
}

// ── Hilfsfunktion: einfacher Slot aus Namen ──────────────────────
const namesToItems = (names: string[]) => names.map((name) => ({ name }));

// ── CS2: statisch (kleine, stabile Listen) ───────────────────────
const cs2: GamePack = {
  id: 'cs2',
  name: 'CS2',
  accent: tokens.brand,
  slots: [
    {
      id: 'pistol',
      label: { de: 'Pistole', en: 'Pistol' },
      items: namesToItems([
        'Glock-18', 'USP-S', 'P2000', 'P250', 'Five-SeveN', 'Tec-9',
        'CZ75-Auto', 'Dual Berettas', 'Desert Eagle', 'R8 Revolver',
      ]),
    },
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems([
        'AK-47', 'M4A4', 'M4A1-S', 'Galil AR', 'FAMAS', 'SG 553', 'AUG',
        'AWP', 'SSG 08', 'MP9', 'MAC-10', 'MP7', 'UMP-45', 'P90', 'Nova', 'XM1014',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Map', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Mirage', 'Inferno', 'Nuke', 'Overpass', 'Vertigo', 'Ancient',
        'Anubis', 'Dust II', 'Train',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Nur Pistolen – kein Primärwaffen-Kauf', en: 'Pistols only – no primary buy' } },
    { text: { de: 'Kein AWP die ganze Runde', en: 'No AWP for the whole round' } },
    { text: { de: 'Nur Messer-Kills zählen', en: 'Only knife kills count' } },
    { text: { de: 'Eco-Runde: max. 1000$ ausgeben', en: 'Eco round: spend max $1000' } },
    { text: { de: 'Keine Granaten kaufen', en: 'No utility / grenades' } },
    { text: { de: 'Nur Deagle erlaubt', en: 'Deagle only' } },
  ],
};

// ── Rainbow Six Siege: statisch (Operator ändern sich langsam) ───
const r6: GamePack = {
  id: 'r6',
  name: 'Rainbow Six',
  accent: tokens.teal,
  slots: [
    {
      id: 'side',
      label: { de: 'Seite', en: 'Side' },
      shared: true,
      items: namesToItems(['Angriff', 'Verteidigung']),
    },
    {
      id: 'operator',
      label: { de: 'Operator', en: 'Operator' },
      items: namesToItems([
        // Angreifer
        'Sledge', 'Thatcher', 'Ash', 'Thermite', 'Twitch', 'Montagne', 'Glaz',
        'Fuze', 'Blitz', 'IQ', 'Buck', 'Blackbeard', 'Capitão', 'Hibana', 'Jackal',
        'Ying', 'Zofia', 'Dokkaebi', 'Lion', 'Finka', 'Maverick', 'Nomad', 'Gridlock',
        'Nøkk', 'Amaru', 'Kali', 'Iana', 'Ace', 'Zero', 'Flores', 'Osa', 'Sens',
        // Verteidiger
        'Smoke', 'Mute', 'Castle', 'Pulse', 'Doc', 'Rook', 'Kapkan', 'Tachanka',
        'Jäger', 'Bandit', 'Frost', 'Valkyrie', 'Caveira', 'Echo', 'Mira', 'Lesion',
        'Ela', 'Vigil', 'Maestro', 'Alibi', 'Clash', 'Kaid', 'Mozzie', 'Warden',
        'Goyo', 'Wamai', 'Oryx', 'Melusi', 'Aruni', 'Thunderbird', 'Thorn', 'Azami',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Map', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Bank', 'Border', 'Chalet', 'Clubhouse', 'Coastline', 'Consulate',
        'Kafe Dostoyevsky', 'Oregon', 'Skyscraper', 'Themepark', 'Villa', 'Nighthaven Labs',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Keine Drohnen / Kameras nutzen', en: 'No drones / cameras' } },
    { text: { de: 'Nur Pistole erlaubt', en: 'Sidearm only' } },
    { text: { de: 'Angreifer: keine Aufklärung vor dem Push', en: 'Attackers: no recon before the push' } },
    { text: { de: 'Verteidiger: keine Verstärkungen setzen', en: 'Defenders: no reinforcements' } },
    { text: { de: 'Nur Shotguns', en: 'Shotguns only' } },
    { text: { de: 'Kein Operator-Gadget einsetzen', en: 'No operator gadget' } },
  ],
};

// ── Valorant: API-Loader + statischer Fallback ───────────────────
const valorant: GamePack = {
  id: 'valorant',
  name: 'Valorant',
  accent: '#FB5A52',
  load: loadValorant,
  slots: [
    {
      id: 'sidearm',
      label: { de: 'Sekundärwaffe', en: 'Sidearm' },
      items: namesToItems(['Classic', 'Shorty', 'Frenzy', 'Ghost', 'Sheriff']),
    },
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems([
        'Stinger', 'Spectre', 'Bucky', 'Judge', 'Bulldog', 'Guardian',
        'Phantom', 'Vandal', 'Marshal', 'Outlaw', 'Operator', 'Ares', 'Odin',
      ]),
    },
    {
      id: 'agent',
      label: { de: 'Agent', en: 'Agent' },
      items: namesToItems([
        'Jett', 'Raze', 'Phoenix', 'Reyna', 'Yoru', 'Neon', 'Iso',
        'Sova', 'Breach', 'Skye', 'KAY/O', 'Fade', 'Gekko',
        'Brimstone', 'Omen', 'Viper', 'Astra', 'Harbor', 'Clove',
        'Sage', 'Cypher', 'Killjoy', 'Chamber', 'Deadlock', 'Vyse',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Map', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Ascent', 'Bind', 'Haven', 'Split', 'Icebox', 'Breeze',
        'Fracture', 'Pearl', 'Lotus', 'Sunset', 'Abyss',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Nur Pistolen kaufen', en: 'Pistols only' } },
    { text: { de: 'Keine Fähigkeiten in Runde 1', en: 'No abilities in round 1' } },
    { text: { de: 'Kein Operator / Sniper', en: 'No Operator / sniper' } },
    { text: { de: 'Ultimate sofort einsetzen, sobald bereit', en: 'Use ult the instant it is ready' } },
    { text: { de: 'Blind-Buy – Shop nicht ansehen', en: 'Blind buy – do not check the shop' } },
    { text: { de: 'Nur Nahkampf bis zum First Blood', en: 'Melee only until first blood' } },
  ],
};

// ── League of Legends: API-Loader + statischer Fallback ──────────
const lol: GamePack = {
  id: 'lol',
  name: 'League of Legends',
  accent: '#4D8BFF',
  load: loadLol,
  slots: [
    {
      id: 'role',
      label: { de: 'Rolle', en: 'Role' },
      items: namesToItems(['Top', 'Jungle', 'Mid', 'Bot (ADC)', 'Support']),
    },
    {
      id: 'champion',
      label: { de: 'Champion', en: 'Champion' },
      items: namesToItems([
        'Ahri', 'Garen', 'Lee Sin', 'Jinx', 'Thresh', 'Yasuo', 'Lux',
        'Darius', 'Ezreal', 'Leona', 'Zed', 'Ashe', 'Malphite', 'Kai’Sa',
      ]),
    },
    {
      id: 'summoner',
      label: { de: 'Beschwörerzauber', en: 'Summoner Spell' },
      items: namesToItems(['Flash', 'Ignite', 'Teleport', 'Heal', 'Exhaust', 'Barrier', 'Cleanse', 'Smite', 'Ghost']),
    },
  ],
  challenges: [
    { text: { de: 'Kein Recall vor Minute 5', en: 'No recall before minute 5' } },
    { text: { de: 'Nur AD-Items kaufen', en: 'Buy AD items only' } },
    { text: { de: 'Beschwörerzauber nicht benutzen', en: 'Do not use summoner spells' } },
    { text: { de: 'First-Pick – kein Re-Roll des Champions', en: 'First pick – no champion re-roll' } },
    { text: { de: 'Nur ein Stiefel-Item erlaubt', en: 'Only one boots item allowed' } },
  ],
};

// ── ARC Raiders: statisch (Extraction-Shooter, kein Gratis-API) ──
// Item-Namen aus aktuellen Community-Quellen (arcraiders.wiki, Raidex).
// Da das Spiel jung ist & häufig patcht: Liste bei größeren Updates nachziehen.
const arcRaiders: GamePack = {
  id: 'arc',
  name: 'ARC Raiders',
  accent: '#FBBF24',
  slots: [
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems([
        'Anvil', 'Jupiter', 'Equalizer', 'Hullcracker', 'Stitcher', 'Bobcat',
        'Venator', 'Renegade', 'Dolabra', 'Kettle', 'Osprey', 'Canto',
        'Aphelion', 'Bettina', 'Arpeggio',
      ]),
    },
    {
      id: 'sidearm',
      label: { de: 'Sekundärwaffe', en: 'Sidearm' },
      items: namesToItems(['Ferro', 'Burletta', 'Il Toro']),
    },
    {
      id: 'gadget',
      label: { de: 'Gadget', en: 'Gadget' },
      items: namesToItems([
        'Photoelectric Cloak', 'Snap Hook', 'Zipline', 'Decoy', 'Gas Grenade',
        'Flashbang', 'Shockwave', 'Tripwire', 'Healing Drone', 'Shield Pylon',
      ]),
    },
    {
      id: 'shield',
      label: { de: 'Schild', en: 'Shield' },
      items: namesToItems(['Light Shield', 'Medium Shield', 'Heavy Shield']),
    },
    {
      id: 'map',
      label: { de: 'Map', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Dam Battlegrounds', 'Spaceport', 'Buried City', 'Blue Gate',
        'Stella Montis', 'Riven Tides',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Kein Schild ausrüsten', en: 'No shield equipped' } },
    { text: { de: 'Nur Pistole mitnehmen', en: 'Sidearm only' } },
    { text: { de: 'Keine Gadgets benutzen', en: 'No gadgets' } },
    { text: { de: 'Nur am gewürfelten Map-Extraktionspunkt raus', en: 'Extract only at a random extraction point' } },
    { text: { de: 'Nahkampf bis zum ersten ARC-Kill', en: 'Melee only until your first ARC kill' } },
    { text: { de: 'Alles looten – nichts verkaufen diese Runde', en: 'Loot everything – sell nothing this run' } },
  ],
};

// ── Escape from Tarkov: statisch ────────────────────────────────
// Hinweis: tarkov.dev bietet ein gratis GraphQL-API (Maps/Waffen/Ammo,
// auto-aktuell bei Wipes). Bei Bedarf als Live-Loader nachrüstbar (load?).
const tarkov: GamePack = {
  id: 'tarkov',
  name: 'Escape from Tarkov',
  accent: '#A3E635',
  slots: [
    {
      id: 'armor',
      label: { de: 'Panzerung', en: 'Armor' },
      items: namesToItems(['Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6']),
    },
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems([
        'AK-74M', 'AKM', 'M4A1', 'HK 416A5', 'MK-47 Mutant', 'SA-58', 'RFB',
        'ADAR 2-15', 'SKS', 'Mosin', 'M700', 'DVL-10', 'RPK-16', 'PKM',
        'MP5', 'MPX', 'Vector', 'P90', 'Saiga-12', 'MP-153', 'M870', 'KS-23',
      ]),
    },
    {
      id: 'sidearm',
      label: { de: 'Sekundärwaffe', en: 'Sidearm' },
      items: namesToItems([
        'PM (Makarov)', 'Glock 17', 'Glock 18C', 'M9A3', 'USP',
        'P226R', 'SR-1MP', 'FN 5-7', 'Desert Eagle',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Map', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Customs', 'Woods', 'Factory', 'Interchange', 'Reserve', 'Shoreline',
        'Lighthouse', 'Streets of Tarkov', 'The Lab', 'Ground Zero',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Pistolen-Run – nur Sekundärwaffe', en: 'Pistol run – sidearm only' } },
    { text: { de: 'Hatchling – keine Waffe, nur Nahkampf', en: 'Hatchling – melee only, no gun' } },
    { text: { de: 'Keine Rüstung tragen', en: 'No armor equipped' } },
    { text: { de: 'Nur am gewürfelten Extract raus', en: 'Extract only at a random point' } },
    { text: { de: 'Kein Healing diesen Raid', en: 'No healing this raid' } },
    { text: { de: 'Alles looten – nichts verkaufen', en: 'Loot everything – sell nothing' } },
  ],
};

export const GAME_PACKS: GamePack[] = [valorant, cs2, r6, lol, arcRaiders, tarkov];

export function getPack(id: string): GamePack | undefined {
  return GAME_PACKS.find((p) => p.id === id);
}
