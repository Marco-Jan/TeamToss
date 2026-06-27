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

import type { GamePack, GearSlot, Challenge } from './types';
import { tokens } from '../Components/Thema/theme';

// ── localStorage-Cache für API-Loader ─────────────────────────────
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 h
// Bei Strukturänderungen an den Slots hochzählen – invalidiert alte Caches.
const CACHE_VERSION = 'v3';

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
  ];

  writeCache(CACHE_KEY, slots);
  return slots;
}

// ── Hilfsfunktion: einfacher Slot aus Namen ──────────────────────
const namesToItems = (names: string[]) => names.map((name) => ({ name }));

// Items mit fester Kategorie (z. B. R6-Seite, Tarkov-Panzerungs-Beispiel).
const namesToItemsCat = (names: string[], category: string) =>
  names.map((name) => ({ name, category }));

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
        'Glock-18', 'USP-S', 'P2000', 'Dual Berettas', 'P250', 'Five-SeveN',
        'Tec-9', 'CZ75-Auto', 'Desert Eagle', 'R8 Revolver',
      ]),
    },
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems([
        'AK-47', 'M4A4', 'M4A1-S', 'Galil AR', 'FAMAS', 'AUG', 'SG 553',
        'MP9', 'MAC-10', 'MP7', 'MP5-SD', 'UMP-45', 'P90', 'PP-Bizon',
        'Nova', 'XM1014', 'Sawed-Off', 'MAG-7', 'M249', 'Negev',
        'SSG 08', 'AWP', 'SCAR-20', 'G3SG1',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Ancient', 'Anubis', 'Dust II', 'Inferno', 'Mirage', 'Nuke', 'Overpass',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Eco-Runde – nichts kaufen, Waffen sparen', en: 'Eco round — buy nothing, save your weapons' } },
    { text: { de: 'Force-Buy – alle kaufen trotz wenig Geld', en: 'Force-buy — everyone buys despite low cash' } },
    { text: { de: 'Nur Pistolen – keine Primärwaffe, auch im Full-Buy', en: 'Pistols only — no primary, even on a full buy' } },
    { text: { de: 'Keine Utility – keine Granaten, Flashs oder Smokes', en: 'No utility — no grenades, flashes or smokes' } },
    { text: { de: 'Voller Rush – gemeinsam ein Bombsite stürmen', en: 'Full rush — storm one bombsite together' } },
    { text: { de: 'Nur Deagle – ausschließlich Desert Eagle nutzen', en: 'Deagle only — use only the Desert Eagle' } },
    { text: { de: 'Keine Zielfernrohre – kein AWP, SSG oder Auto-Sniper', en: 'No scopes — no AWP, SSG or auto-sniper' } },
    { text: { de: 'Nur SMGs – ausschließlich Maschinenpistolen kaufen', en: 'SMGs only — buy only submachine guns' } },
    { text: { de: 'Save-Runde – nicht aufgeben, am Leben bleiben', en: 'Save round — don’t engage, stay alive' } },
    { text: { de: 'Nur Messer – die Runde nur mit dem Messer bestreiten', en: 'Knife only — play the round with knife only' } },
    { text: { de: 'Nur AWP – ausschließlich Sniper, kein Rifle', en: 'AWP only — snipers only, no rifles' } },
  ],
};

// ── Rainbow Six Siege: statisch (Operator ändern sich langsam) ───
const r6: GamePack = {
  id: 'r6',
  name: 'Rainbow Six',
  accent: tokens.teal,
  slots: [
    {
      id: 'operator',
      label: { de: 'Operator', en: 'Operator' },
      // Seite steht als Kategorie am Operator (kein widersprüchlicher Extra-Roll).
      items: [
        ...namesToItemsCat([
          'Ace', 'Amaru', 'Ash', 'Blackbeard', 'Blitz', 'Brava', 'Buck',
          'Capitão', 'Deimos', 'Dokkaebi', 'Finka', 'Flores', 'Fuze', 'Glaz',
          'Gridlock', 'Grim', 'Hibana', 'Iana', 'IQ', 'Jackal', 'Kali', 'Lion',
          'Maverick', 'Montagne', 'Nøkk', 'Nomad', 'Osa', 'Ram', 'Rauora', 'Sens',
          'Sledge', 'Solid Snake', 'Striker', 'Thatcher', 'Thermite', 'Twitch',
          'Ying', 'Zero', 'Zofia',
        ], 'Attack'),
        ...namesToItemsCat([
          'Alibi', 'Aruni', 'Azami', 'Bandit', 'Castle', 'Caveira', 'Clash',
          'Denari', 'Doc', 'Echo', 'Ela', 'Fenrir', 'Frost', 'Goyo', 'Jäger',
          'Kaid', 'Kapkan', 'Lesion', 'Maestro', 'Melusi', 'Mira', 'Mozzie',
          'Mute', 'Oryx', 'Pulse', 'Rook', 'Sentry', 'Skopós', 'Smoke', 'Solis',
          'Tachanka', 'Thorn', 'Thunderbird', 'Tubarão', 'Valkyrie', 'Vigil',
          'Wamai', 'Warden',
        ], 'Defense'),
      ],
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Bank', 'Border', 'Calypso Casino', 'Chalet', 'Club House', 'Coastline',
        'Consulate', 'Emerald Plains', 'Fortress', 'Kafe Dostoyevsky', 'Lair',
        'Nighthaven Labs', 'Oregon', 'Outback',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Keine Drohnen oder Kameras benutzen', en: 'No drones or cameras — never scan' } },
    { text: { de: 'Keine Wände oder Luken verstärken (Verteidigung)', en: 'No reinforcements — don’t reinforce any wall or hatch' } },
    { text: { de: 'Verzichte komplett auf dein Operator-Gadget', en: 'Don’t use your operator’s special gadget' } },
    { text: { de: 'Nur Roamen – verlasse den Zielraum und halte dich fern', en: 'Roam only — leave the objective and never anchor' } },
    { text: { de: 'Nur Anchor – bleib die ganze Runde am Ziel', en: 'Anchor only — never leave the objective room' } },
    { text: { de: 'Nur Sekundärwaffe (Pistole) benutzen', en: 'Secondary weapon only — pistol the whole round' } },
    { text: { de: 'Spiel vertikal – öffne Decken oder Böden für Kills', en: 'Play vertically — open ceilings or floors and fight through them' } },
    { text: { de: 'Keine Wurfgadgets (Granaten, Blendgranaten, Claymores)', en: 'No throwable utility — no grenades, flashes or claymores' } },
    { text: { de: 'Nur aus der Hüfte schießen – kein Zielen über Visier', en: 'Hipfire only — never aim down sights' } },
    { text: { de: 'Lone Wolf – keine Absprachen, kein Voice/Ping', en: 'Lone wolf — no comms, no callouts or pings' } },
    { text: { de: 'Run-out – pushe die Angreifer beim Round-Start (Verteidigung)', en: 'Run-out — push the attackers’ spawn at round start' } },
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
      items: namesToItems(['Classic', 'Shorty', 'Frenzy', 'Ghost', 'Bandit', 'Sheriff']),
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
        'Phoenix', 'Jett', 'Raze', 'Reyna', 'Yoru', 'Neon', 'Iso', 'Waylay',
        'Sova', 'Breach', 'Skye', 'KAY/O', 'Fade', 'Gekko', 'Tejo',
        'Brimstone', 'Viper', 'Omen', 'Astra', 'Harbor', 'Clove', 'Miks',
        'Cypher', 'Sage', 'Killjoy', 'Chamber', 'Deadlock', 'Vyse', 'Veto',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Ascent', 'Haven', 'Split', 'Breeze', 'Lotus', 'Sunset', 'Summit',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Spare diese Runde dein gesamtes Geld – kaufe nichts', en: 'Save all your credits this round — buy nothing' } },
    { text: { de: 'Force-Buy – gib all dein Geld diese Runde aus', en: 'Force buy — spend all your credits this round' } },
    { text: { de: 'Kaufe keine Primärwaffe – nur deine Sidearm', en: 'Buy no primary weapon — sidearm only' } },
    { text: { de: 'Kaufe diese Runde keine Schutzweste', en: 'Buy no armor this round' } },
    { text: { de: 'Renne nur mit dem Messer, bis du deinen ersten Kill hast', en: 'Run only your knife until your first kill' } },
    { text: { de: 'Nutze niemals das Zielfernrohr (kein ADS/Scope)', en: 'Never aim down sights — no scoping' } },
    { text: { de: 'Kaufe nur einen Sniper (Marshal, Outlaw oder Operator)', en: 'Buy a sniper only (Marshal, Outlaw, or Operator)' } },
    { text: { de: 'Setze diese Runde keine Fähigkeiten ein', en: 'Use no abilities this round' } },
    { text: { de: 'Verbrauche alle deine Fähigkeiten vor Rundenende', en: 'Use up every ability before the round ends' } },
    { text: { de: 'Betritt als Erster den Bombenspot (Entry)', en: 'Be the first to enter the site (entry)' } },
    { text: { de: 'Verteidige nur einen Spot und rotiere nicht', en: 'Hold a single site and never rotate' } },
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
  ],
  challenges: [
    { text: { de: 'Kein Flash – wähle einen anderen Beschwörerzauber', en: 'No Flash — pick a different summoner spell' } },
    { text: { de: 'Keine Beschwörerzauber benutzen das ganze Spiel', en: 'Use no summoner spells the entire game' } },
    { text: { de: 'Kein Rückzug zur Basis vor Minute 8', en: 'No recall to base before minute 8' } },
    { text: { de: 'Kein Basebesuch bis zum ersten Kill oder Tod', en: 'No backing until your first kill or death' } },
    { text: { de: 'Nur Angriffs-Items (AD) kaufen', en: 'Buy only attack-damage (AD) items' } },
    { text: { de: 'Nur Fähigkeitsstärke-Items (AP) kaufen', en: 'Buy only ability-power (AP) items' } },
    { text: { de: 'Ward-Maxing – kaufe bei jedem Base Kontrollwards', en: 'Ward-maxing — buy control wards every back and keep full vision' } },
    { text: { de: 'Off-Meta-Lane – spiele deinen Champion ungewohnt', en: 'Off-meta lane — play your champion in an unusual lane' } },
    { text: { de: 'Nur All-In – keine Pokes, nur volle Kämpfe', en: 'All-in only — no poking, commit to full fights' } },
    { text: { de: 'First-Pick ohne Reroll – nimm den ersten Champion', en: 'First pick, no reroll — take the first random champion' } },
    { text: { de: 'Lane nicht verlassen – kein Roamen vor dem ersten Turm', en: 'No roaming — don’t leave your lane before the first tower falls' } },
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
        'Kettle', 'Rattler', 'Arpeggio', 'Tempest', 'Bettina', 'Ferro',
        'Renegade', 'Aphelion', 'Stitcher', 'Canto', 'Bobcat', 'Il Toro',
        'Vulcano', 'Dolabra', 'Torrente', 'Osprey', 'Jupiter', 'Rascal',
        'Hullcracker', 'Equalizer',
      ]),
    },
    {
      id: 'sidearm',
      label: { de: 'Sekundärwaffe', en: 'Sidearm' },
      items: namesToItems(['Hairpin', 'Burletta', 'Venator', 'Anvil']),
    },
    {
      id: 'shield',
      label: { de: 'Schild', en: 'Shield' },
      items: namesToItems(['Light Shield', 'Medium Shield', 'Heavy Shield']),
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Dam Battlegrounds', 'Blue Gate', 'Acerra Spaceport', 'Buried City',
        'Stella Montis', 'Riven Tides',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Kein Schild – überlebe die ganze Raid ohne Schild', en: 'No shield — survive the whole raid without a shield' } },
    { text: { de: 'Nur Sekundärwaffe – nimm ausschließlich eine Pistole mit', en: 'Sidearm only — bring nothing but a pistol' } },
    { text: { de: 'Nahkampf bis zum ersten ARC-Kill – erst danach Schusswaffen', en: 'Melee until your first ARC kill — no guns before that' } },
    { text: { de: 'Reiner Stealth-Lauf – kein ARC-Roboter darf dich entdecken', en: 'Pure stealth — let no ARC machine ever detect you' } },
    { text: { de: 'Nur PvE – keine anderen Raider angreifen', en: 'PvE only — never fight other raiders' } },
    { text: { de: 'Kein Heilen – überlebe ohne Heil-Items', en: 'No healing — survive without using any healing items' } },
    { text: { de: 'Solo den Raid bestreiten – kein Team, keine Hilfe', en: 'Solo the raid — no squad, no help' } },
    { text: { de: 'Alles looten, nichts verkaufen – nur einlagern oder nutzen', en: 'Loot everything, sell nothing — only stash or use it' } },
    { text: { de: 'Zufälliger Extraktionspunkt – würfle den Ausgang', en: 'Random extraction — roll the exit point and take only that one' } },
    { text: { de: 'Vollgepackt extrahieren – nur mit randvollem Rucksack raus', en: 'Extract heavy — only leave with a completely full backpack' } },
    { text: { de: 'Kopfschuss-Diät – ARC und Raider nur per Kopfschuss', en: 'Headshots only — kill ARC machines and raiders with headshots only' } },
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
      // Bewusste Mit/Ohne-Entscheidung (Gear-Fear vs. Hatchling) – Klasse egal.
      id: 'armor',
      label: { de: 'Rüstung', en: 'Armor' },
      items: [
        { name: 'Mit Rüstung', nameLoc: { de: 'Mit Rüstung', en: 'Armored' } },
        { name: 'Ohne Rüstung', nameLoc: { de: 'Ohne Rüstung', en: 'No armor' } },
      ],
    },
    {
      id: 'helmet',
      label: { de: 'Helm', en: 'Helmet' },
      items: [
        { name: 'Mit Helm', nameLoc: { de: 'Mit Helm', en: 'Helmet' } },
        { name: 'Ohne Helm', nameLoc: { de: 'Ohne Helm', en: 'No helmet' } },
      ],
    },
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems([
        // Sturmgewehre
        'M4A1', 'HK 416A5', 'AK-74M', 'AKM', 'AK-12', 'AUG A3', 'Mk47 Mutant',
        'SIG MCX', 'ASh-12', 'ADAR 2-15',
        // Battle Rifles
        'SCAR-H', 'MDR 7.62', 'RFB', 'M1A', 'SR-25', 'G28',
        // Karabiner
        'SKS', 'OP-SKS', 'Vepr Hunter',
        // Bolt-Action
        'Mosin', 'SV-98', 'DVL-10', 'M700', 'T-5000',
        // DMR
        'SVDS', 'RSASS', 'VSS Vintorez',
        // SMG
        'MP5', 'MP7A1', 'MPX', 'Vityaz-SN', 'Vector', 'UMP 45', 'P90', 'Kedr',
        // Schrotflinten
        'MP-153', 'MP-155', 'Saiga-12K', 'M870', 'KS-23M',
        // LMG
        'RPK-16', 'PKM', 'PKP Pecheneg', 'RPD',
      ]),
    },
    {
      id: 'sidearm',
      label: { de: 'Faustfeuerwaffe', en: 'Sidearm' },
      items: namesToItems([
        'Glock 17', 'Glock 18C', 'Glock 19X', 'P226R', 'M1911A1', 'M45A1',
        'USP', 'Five-seveN MK2', 'PL-15', 'SR-1MP Gyurza', 'APS Stechkin',
        'PM (Makarov)', 'TT-33', 'MP-443 Grach', 'Desert Eagle',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Factory', 'Customs', 'Woods', 'Shoreline', 'Interchange', 'Reserve',
        'Lighthouse', 'Streets of Tarkov', 'Ground Zero', 'The Lab',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Nur Pistole – keine Primärwaffe erlaubt', en: 'Sidearm only — no primary weapon allowed' } },
    { text: { de: 'Hatchling-Run – nur Nahkampf, keine Schusswaffen', en: 'Hatchling run — melee only (knife/hatchet), no firearms' } },
    { text: { de: 'Keine Panzerung, kein Helm – geh nackt rein', en: 'No armor, no helmet — go in bare' } },
    { text: { de: 'Kein Heilen – keine Medkits, Stims oder Schmerzmittel', en: 'No healing — no medkits, stims or painkillers' } },
    { text: { de: 'Alles looten, nichts verkaufen – jeden Loot rausbringen', en: 'Loot everything, sell nothing — extract every item you find' } },
    { text: { de: 'SCAV-Gun-Budget – nur billigste Händlerwaffe, kein Flohmarkt', en: 'Budget Scav-gun run — cheapest trader weapon only, no flea market' } },
    { text: { de: 'Kein Rucksack – nur Taschen und Weste fürs Loot', en: 'No backpack — pockets and rig only for loot' } },
    { text: { de: 'Schalldämpfer verboten – lauf laut, jeder hört dich', en: 'Suppressors banned — run loud, everyone hears you' } },
    { text: { de: 'Zufalls-Extract – raus nur am zufällig gewürfelten Ausgang', en: 'Random extract — leave only via a randomly rolled exit' } },
    { text: { de: 'Keine Meta-Munition – nur niedrige Pen-Klasse', en: 'No meta ammo — low-pen rounds only (Tier 3 bullets max)' } },
    { text: { de: 'Solo-Hardcore – kein Team, kein Heilen, kein Flohmarkt', en: 'Solo hardcore — no team, no healing, no flea market in one run' } },
  ],
};

// ── Call of Duty: statisch (Black Ops 7 S4 / Warzone, Stand 2026) ─
const cod: GamePack = {
  id: 'cod',
  name: 'Call of Duty',
  accent: '#A3B18A',
  slots: [
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems([
        // Sturmgewehre
        'AK-27', 'MXR-17', 'DS20 Mirage', 'MK35 ISR', 'M15 Mod 0', 'Peacekeeper MK1',
        'X9 Maverick', 'Voyak KT-3', 'EGRT-17', 'Maddox RFB',
        // SMGs
        'Dravec 45', 'Carbon 57', 'VST', 'Ryden 45K', 'RK-9', 'Razor 9mm',
        'MPC-25', 'REV-46', 'Kogot-7', 'Sturmwolf 45',
        // Scharfschützen
        'VS Recon', 'Strider 300', 'Hawker HX', 'Shadow SK', 'XR-3 Ion',
        // LMGs
        'Sokol 545', 'MK.78', 'XM325',
        // Schrotflinten
        'Akita', 'M10 Breacher', 'Echo 12', 'SG-12',
        // Marksman
        'M8A1', 'Swordfish A1', 'Warden 308', 'M34 Novaline',
      ]),
    },
    {
      id: 'secondary',
      label: { de: 'Sekundärwaffe', en: 'Secondary' },
      items: namesToItems([
        'Jäger 45', 'Velox 5.7', 'CODA 9', '1911', 'GREKHOVA',
        'AAROW 109', 'A.R.C. M1',
        'Knife', 'Katana', 'Ballistic Knife', 'Flatline MK.II', 'H311-SAW',
      ]),
    },
    {
      id: 'perk',
      label: { de: 'Perk-Paket', en: 'Perk Package' },
      items: namesToItems(['Enforcer Core', 'Recon Core', 'Strategist Core', 'Hybrid']),
    },
    {
      id: 'lethal',
      label: { de: 'Tödliche Ausrüstung', en: 'Lethal' },
      items: namesToItems([
        'Frag', 'Semtex', 'C4', 'Molotov', 'Combat Axe', 'Cluster Grenade',
        'Point Turret', 'Needle Drone',
      ]),
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems(['Verdansk', 'Rebirth Island']),
    },
  ],
  challenges: [
    { text: { de: 'Nur Pistolen', en: 'Pistols only' } },
    { text: { de: 'Nur Scharfschützen', en: 'Snipers only' } },
    { text: { de: 'Nur Nahkampf / Messer', en: 'Melee / knife only' } },
    { text: { de: 'Keine Killstreaks', en: 'No killstreaks' } },
    { text: { de: 'Keine Perks', en: 'No perks' } },
    { text: { de: 'Nur Hüftfeuer (kein Zielen)', en: 'Hip-fire only (no ADS)' } },
    { text: { de: 'SMG-Sturm – aggressiv pushen', en: 'SMG rush — push aggressively' } },
    { text: { de: 'Nur Bodenloot – kein Loadout-Drop', en: 'Ground loot only — no loadout drop' } },
    { text: { de: 'Keine Schutzplatten', en: 'No armor plates' } },
    { text: { de: 'Nur Schrotflinten', en: 'Shotguns only' } },
    { text: { de: 'Ein Leben – kein Rückkauf', en: 'One life — no buyback' } },
  ],
};

// ── Fortnite: statisch (Chapter 7 Season 3 „Runners", Stand 2026) ─
const fortnite: GamePack = {
  id: 'fortnite',
  name: 'Fortnite',
  accent: '#9D6CFF',
  slots: [
    {
      id: 'weapon',
      label: { de: 'Startwaffe', en: 'Starting Weapon' },
      items: namesToItems([
        'Surgical Burst Rifle', 'Chaos Exploder Rifle', 'Hunting Rifle',
        'Extending Focus Shotgun', 'Chaos Reloader Shotgun', 'Maven Auto Shotgun',
        'Striker Pump Shotgun', 'Flex SMG', 'Stinger SMG',
        'Lancehead Pistol', 'Ranger Pistol',
      ]),
    },
    {
      id: 'poi',
      label: { de: 'Landeplatz', en: 'Landing Spot' },
      shared: true,
      items: namesToItems([
        'Lifty Lodge', 'Latte Landing', 'Chopped Shop', 'The Battlewoods',
        'Wonkeeland', 'Calamari Canyon', 'Frosted Flats', 'Golden Grove',
        'Sinister Strip', 'Heatwave Harbor', 'Shaken Sanctuary', 'Sunken Shores',
        'Cluster Coast',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Lande am ausgelosten POI – kein Umdrehen', en: 'Land at the rolled POI — no diverting' } },
    { text: { de: 'Zero-Build-Kopf – bau nichts, auch wenn du kannst', en: 'Zero-build mindset — never build, even if you can' } },
    { text: { de: 'Nur graue & grüne Waffen erlaubt', en: 'Common and Uncommon (grey/green) weapons only' } },
    { text: { de: 'Kein Heilen – kämpf mit dem, was du hast', en: 'No healing — fight with the HP you’ve got' } },
    { text: { de: 'Nur Spitzhacke bis zum ersten Kill', en: 'Pickaxe only until your first elimination' } },
    { text: { de: 'Keine Fahrzeuge – immer zu Fuß', en: 'No vehicles — travel on foot only' } },
    { text: { de: 'Kein Mats farmen, kein Abbauen', en: 'No harvesting materials at all' } },
    { text: { de: 'Trag nur eine Waffe – lass den Rest fallen', en: 'Carry one weapon only — drop everything else' } },
    { text: { de: 'Erste Waffe behalten – kein Tauschen das ganze Match', en: 'Keep your first weapon — no swapping all match' } },
    { text: { de: 'Bleib in Bewegung – nie länger als 5 Sek. stehen', en: 'Keep moving — never stand still over 5 seconds' } },
    { text: { de: 'Kein Kistenlooten – nur Bodenloot & Gegnerbeute', en: 'No chest looting — floor loot and kills only' } },
  ],
};

// ── Apex Legends: statisch (Season 29 „Overclocked", Stand 2026) ──
const APEX_WEAPONS = [
  // Sturmgewehre
  'R-301 Carbine', 'VK-47 Flatline', 'HAVOC Rifle', 'Hemlok Burst AR', 'Nemesis Burst AR',
  // SMGs
  'R-99', 'Alternator', 'Volt SMG', 'Prowler Burst PDW', 'C.A.R. SMG',
  // LMGs
  'M600 Spitfire', 'Devotion LMG', 'Rampage LMG',
  // Marksman
  'Triple Take', '30-30 Repeater', 'Bocek Compound Bow',
  // Sniper
  'Longbow DMR', 'Charge Rifle', 'Sentinel',
  // Schrotflinten
  'Peacekeeper', 'EVA-8 Auto', 'Mastiff', 'Mozambique',
  // Pistolen
  'Wingman', 'RE-45 Auto', 'P2020',
];
const apex: GamePack = {
  id: 'apex',
  name: 'Apex Legends',
  accent: '#E5484D',
  slots: [
    {
      id: 'legend',
      label: { de: 'Legende', en: 'Legend' },
      items: namesToItems([
        'Bangalore', 'Bloodhound', 'Caustic', 'Gibraltar', 'Lifeline', 'Mirage',
        'Pathfinder', 'Wraith', 'Octane', 'Wattson', 'Crypto', 'Revenant', 'Loba',
        'Rampart', 'Horizon', 'Fuse', 'Valkyrie', 'Seer', 'Ash', 'Mad Maggie',
        'Newcastle', 'Vantage', 'Catalyst', 'Ballistic', 'Conduit', 'Alter',
        'Sparrow', 'Axle',
      ]),
    },
    {
      id: 'primary',
      label: { de: 'Primärwaffe', en: 'Primary' },
      items: namesToItems(APEX_WEAPONS),
    },
    {
      id: 'secondary',
      label: { de: 'Sekundärwaffe', en: 'Secondary' },
      items: namesToItems(APEX_WEAPONS),
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems([
        'Kings Canyon', 'World’s Edge', 'Olympus', 'Storm Point', 'Broken Moon', 'E-District',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Lande sofort am ausgelosten Hotspot der Karte', en: 'Hot-drop the map’s rolled hotspot' } },
    { text: { de: 'Keine Heilung – nur das Knockdown-Schild zum Blocken', en: 'No healing — knockdown shield to block only' } },
    { text: { de: 'Nur Nahkampf bis zum ersten Kill', en: 'Melee only until your first kill' } },
    { text: { de: 'Keine Taktik- und keine Ultimate-Fähigkeit', en: 'No tactical and no ultimate ability' } },
    { text: { de: 'Plündere kein lila oder goldenes Loot (nur weiß/blau)', en: 'Loot no purple or gold gear (white/blue only)' } },
    { text: { de: 'Nur Schüsse aus der Hüfte – kein Zielen (ADS)', en: 'Hipfire only — never aim down sights' } },
    { text: { de: 'Belebe oder respawne keine Teammates wieder', en: 'Never revive or respawn teammates' } },
    { text: { de: 'Nur Sniper und Marksman-Waffen führen', en: 'Carry snipers and marksman weapons only' } },
    { text: { de: 'Pistolen-only – nur Wingman, RE-45 oder P2020', en: 'Pistols only — Wingman, RE-45 or P2020' } },
    { text: { de: 'Bleibe am Ring-Rand und rotiere als Letzter', en: 'Stay on the ring edge, rotate in last' } },
    { text: { de: 'Wirf jede Granate sofort beim Gegnerkontakt', en: 'Throw a grenade on every enemy contact' } },
  ],
};

// ── Overwatch: statisch (Reign of Talon, Season 3, Stand 2026) ───
// Held impliziert Rolle → Rolle als Kategorie-Label, kein widersprüchlicher Roll.
const overwatch: GamePack = {
  id: 'ow',
  name: 'Overwatch',
  accent: '#F99E1A',
  slots: [
    {
      id: 'hero',
      label: { de: 'Held', en: 'Hero' },
      items: [
        ...namesToItemsCat([
          'D.Va', 'Doomfist', 'Domina', 'Hazard', 'Junker Queen', 'Mauga',
          'Orisa', 'Ramattra', 'Reinhardt', 'Roadhog', 'Sigma', 'Winston',
          'Wrecking Ball', 'Zarya',
        ], 'Tank'),
        ...namesToItemsCat([
          'Anran', 'Ashe', 'Bastion', 'Cassidy', 'Echo', 'Emre', 'Freja',
          'Genji', 'Hanzo', 'Junkrat', 'Mei', 'Pharah', 'Reaper', 'Shion',
          'Sierra', 'Sojourn', 'Soldier: 76', 'Sombra', 'Symmetra', 'Torbjörn',
          'Tracer', 'Vendetta', 'Venture', 'Widowmaker',
        ], 'Damage'),
        ...namesToItemsCat([
          'Ana', 'Baptiste', 'Brigitte', 'Illari', 'Jetpack Cat', 'Juno',
          'Kiriko', 'Lifeweaver', 'Lúcio', 'Mercy', 'Mizuki', 'Moira',
          'Wuyang', 'Zenyatta',
        ], 'Support'),
      ],
    },
    {
      id: 'map',
      label: { de: 'Karte', en: 'Map' },
      shared: true,
      items: namesToItems([
        // Control
        'Antarctic Peninsula', 'Busan', 'Ilios', 'Lijiang Tower', 'Nepal', 'Oasis', 'Samoa',
        // Escort
        'Circuit Royal', 'Dorado', 'Havana', 'Junkertown', 'Rialto', 'Route 66',
        'Shambali Monastery', 'Watchpoint: Gibraltar',
        // Hybrid
        'Blizzard World', 'Eichenwalde', 'Hollywood', 'King’s Row', 'Midtown', 'Numbani', 'Paraíso',
        // Push
        'Colosseo', 'Esperança', 'New Queen Street', 'Runasapi',
        // Flashpoint
        'Aatlis', 'New Junk City', 'Suravasa',
      ]),
    },
  ],
  challenges: [
    { text: { de: 'Kein Ultimate einsetzen', en: 'Never use your Ultimate' } },
    { text: { de: 'Nur Nahkampf bis zur ersten Elimination', en: 'Melee only until your first elimination' } },
    { text: { de: 'Nur Primärfeuer – kein Sekundärfeuer', en: 'Primary fire only — no secondary fire' } },
    { text: { de: 'Nur die Waffe – keine Fähigkeiten', en: 'Weapon only — use no abilities' } },
    { text: { de: 'Niemals zurückweichen – immer vorrücken', en: 'Never retreat — always push forward' } },
    { text: { de: 'Keine Heilpakete aufnehmen', en: 'Never pick up a health pack' } },
    { text: { de: 'Als Support: niemanden heilen', en: 'As support: never heal a teammate' } },
    { text: { de: 'Bleib immer in der Nähe eines Teammates', en: 'Never leave a teammate’s side' } },
    { text: { de: 'Immer auf dem Missionsziel stehen', en: 'Always stand on the objective' } },
    { text: { de: 'Keine Bewegungsfähigkeiten – kein Dash, Sprung, Teleport', en: 'No movement abilities — no dash, jump, or teleport' } },
    { text: { de: 'Erst nachladen, wenn das Magazin leer ist', en: 'Only reload when your magazine is fully empty' } },
  ],
};

export const GAME_PACKS: GamePack[] = [
  valorant, cs2, r6, lol, arcRaiders, tarkov, cod, fortnite, apex, overwatch,
];

export function getPack(id: string): GamePack | undefined {
  return GAME_PACKS.find((p) => p.id === id);
}

// ── Aufgaben-Pool (Modus „Aufgabe", Ziehung pro Team) ────────────
// Spielunabhängige Fun-/Team-Tasks – immer im Pool.
export const GENERAL_TASKS: Challenge[] = [
  { text: { de: 'Jedes Teammitglied muss mindestens einen Kill/Punkt holen', en: 'Every team member must get at least one kill/point' } },
  { text: { de: 'Ruft eure Taktik laut an, bevor ihr angreift', en: 'Call your strategy out loud before you push' } },
  { text: { de: 'Gewinnt die Runde, ohne ein Wort zu sagen', en: 'Win the round without saying a single word' } },
  { text: { de: 'Gebt eurem Team einen Namen und ruft ihn vor dem Start', en: 'Name your team and shout it before the start' } },
  { text: { de: 'Macht ein gemeinsames Highlight-Play und feiert es', en: 'Pull off one team highlight play and celebrate it' } },
  { text: { de: 'Erste drei Minuten nur defensiv spielen', en: 'Play purely defensive for the first three minutes' } },
  { text: { de: 'Kommuniziert diese Runde nur über Pings/Emotes', en: 'Communicate only via pings/emotes this round' } },
  { text: { de: 'Der MVP des Teams wählt die Strafe fürs andere Team', en: 'The team MVP picks the other team’s forfeit' } },
  { text: { de: 'Holt euch den ersten Kill der Runde als Team', en: 'Get the first kill of the round as a team' } },
  { text: { de: 'Spielt eine Runde mit vertauschten Rollen', en: 'Play one round with swapped roles' } },
];

// Spielspezifische Team-Missionen, nach Pack-ID.
export const PACK_TASKS: Record<string, Challenge[]> = {
  cs2: [
    { text: { de: 'Holt einen Team-Ace (alle 5 in einer Runde)', en: 'Get a team ace (all 5 in one round)' } },
    { text: { de: 'Gewinnt eine Pistolenrunde ohne Nachkauf', en: 'Win a pistol round with no extra buy' } },
    { text: { de: 'Jeder im Team braucht einen Utility-Assist', en: 'Everyone on the team gets a utility assist' } },
    { text: { de: 'Gewinnt einen 1vX-Clutch und feiert ihn', en: 'Win a 1vX clutch and hype it up' } },
    { text: { de: 'Legt/entschärft die Bombe drei Runden in Folge', en: 'Plant/defuse the bomb three rounds in a row' } },
  ],
  valorant: [
    { text: { de: 'Gewinnt eine Runde nur mit Fähigkeiten-Kills', en: 'Win a round with ability kills only' } },
    { text: { de: 'Holt ein Team-Ace', en: 'Get a team ace' } },
    { text: { de: 'Jeder Agent setzt seine Ultimate sinnvoll ein', en: 'Every agent uses their ultimate meaningfully' } },
    { text: { de: 'Plant den Spike dreimal auf demselben Spot', en: 'Plant the spike on the same spot three times' } },
    { text: { de: 'Gewinnt einen Eco- oder Save-Round-Hold', en: 'Win an eco or save-round hold' } },
  ],
  r6: [
    { text: { de: 'Gewinnt eine Runde nur übers Objective (kein Kill)', en: 'Win a round on the objective only (no kills)' } },
    { text: { de: 'Macht einen koordinierten vertikalen Push', en: 'Pull off a coordinated vertical push' } },
    { text: { de: 'Jeder Operator nutzt sein Gadget mindestens einmal', en: 'Every operator uses their gadget at least once' } },
    { text: { de: 'Gewinnt einen 1v3-Clutch', en: 'Win a 1v3 clutch' } },
    { text: { de: 'Entschärft den Defuser unter Druck', en: 'Disable the defuser under pressure' } },
  ],
  lol: [
    { text: { de: 'Holt den ersten Drachen als Team', en: 'Take the first dragon as a team' } },
    { text: { de: 'Gewinnt einen 5v5-Teamfight am Baron', en: 'Win a 5v5 teamfight at Baron' } },
    { text: { de: 'Jede Lane holt ihren ersten Turm', en: 'Every lane takes its first tower' } },
    { text: { de: 'Macht in jeder Lane einen erfolgreichen Gank', en: 'Land a successful gank in every lane' } },
    { text: { de: 'Beendet das Spiel unter 25 Minuten', en: 'Close the game out under 25 minutes' } },
  ],
  arc: [
    { text: { de: 'Extrahiert alle gemeinsam am selben Punkt', en: 'Extract together at the same point' } },
    { text: { de: 'Legt einen großen ARC-Boss im Team', en: 'Take down a big ARC boss as a team' } },
    { text: { de: 'Jeder bringt mindestens ein seltenes Item raus', en: 'Everyone extracts at least one rare item' } },
    { text: { de: 'Rettet ein heruntergestrecktes Teammitglied unter Beschuss', en: 'Revive a downed teammate under fire' } },
    { text: { de: 'Schließt die Raid ohne PvP ab', en: 'Finish the raid with no PvP' } },
  ],
  tarkov: [
    { text: { de: 'Extrahiert das ganze Team lebend', en: 'Extract the whole team alive' } },
    { text: { de: 'Jeder bringt mindestens einen Quest-Gegenstand raus', en: 'Everyone extracts at least one quest item' } },
    { text: { de: 'Gewinnt einen Kampf gegen ein anderes Squad', en: 'Win a fight against another squad' } },
    { text: { de: 'Überlebt einen Raid ohne zu heilen', en: 'Survive a raid without healing' } },
    { text: { de: 'Lootet einen Marked Room als Team', en: 'Loot a marked room as a team' } },
  ],
  cod: [
    { text: { de: 'Holt einen Team-Wipe in einem Gebäude', en: 'Get a team wipe inside one building' } },
    { text: { de: 'Gewinnt ein Gulag-Comeback', en: 'Win a Gulag comeback' } },
    { text: { de: 'Jeder besorgt sich seinen Loadout-Drop', en: 'Everyone secures their loadout drop' } },
    { text: { de: 'Steht mit dem ganzen Team im Endkreis', en: 'Reach the final circle with the full team' } },
    { text: { de: 'Holt drei Fahrzeug-Kills', en: 'Get three vehicle kills' } },
  ],
  fortnite: [
    { text: { de: 'Landet alle am selben POI und überlebt die erste Minute', en: 'Land at the same POI and survive the first minute' } },
    { text: { de: 'Holt einen Team-Wipe gegen ein Gegner-Squad', en: 'Get a team wipe on an enemy squad' } },
    { text: { de: 'Jeder braucht mindestens eine Elimination', en: 'Everyone needs at least one elimination' } },
    { text: { de: 'Gewinnt ein Bau- oder Box-Fight-Duell', en: 'Win a build or box fight' } },
    { text: { de: 'Holt euch den Sieg (Victory Royale)', en: 'Get the Victory Royale' } },
  ],
  apex: [
    { text: { de: 'Holt einen Team-Wipe in einem Kampf', en: 'Get a team wipe in one fight' } },
    { text: { de: 'Jede Ultimate wird einmal sinnvoll genutzt', en: 'Every ultimate gets used once meaningfully' } },
    { text: { de: 'Belebt ein Teammitglied über eine Respawn-Beacon', en: 'Respawn a teammate via a beacon' } },
    { text: { de: 'Gewinnt einen Endkreis-Kampf', en: 'Win an end-circle fight' } },
    { text: { de: 'Werdet Champions – holt den Sieg', en: 'Become Champions — get the win' } },
  ],
  ow: [
    { text: { de: 'Holt einen Team-Kill (alle Gegner)', en: 'Get a team kill (whole enemy team)' } },
    { text: { de: 'Landet eine koordinierte Ulti-Combo', en: 'Land a coordinated ultimate combo' } },
    { text: { de: 'Gewinnt einen Overtime-Hold am Ziel', en: 'Win an overtime hold on the objective' } },
    { text: { de: 'Pusht den Payload bis ans Ziel ohne Wipe', en: 'Push the payload to the end without a wipe' } },
    { text: { de: 'Jeder Support hält den Tank am Leben', en: 'Every support keeps the tank alive' } },
  ],
};
