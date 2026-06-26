// Datenmodell für den Gear-/Loadout-Randomizer.
// Ein "GamePack" beschreibt ein Spiel: welche Slots es gibt (z. B. Primär-,
// Sekundärwaffe, Map) und welche Items pro Slot in Frage kommen.
// Manche Packs liefern ihre Items statisch (im Code), andere laden sie aus
// einer kostenlosen öffentlichen API (siehe load()).

import type { Lang } from '../i18n/translations';

// Ein einzelnes wählbares Item (Waffe, Agent, Map, Champion …).
export interface GearItem {
  name: string;
  category?: string; // optionale Klassifizierung, z. B. "Rifle"
  image?: string;    // optionale Bild-URL (nur API-Packs liefern Bilder)
}

// Ein Slot eines Loadouts – hält den Pool an möglichen Items.
export interface GearSlot {
  id: string;
  label: Record<Lang, string>;
  items: GearItem[];
  // shared = im Pro-Spieler-Modus EINMAL für alle gewürfelt (z. B. Map, Seite),
  // statt pro Spieler unterschiedlich.
  shared?: boolean;
}

// Eine Spaß-Challenge / Beschränkung.
export interface Challenge {
  text: Record<Lang, string>;
}

export interface GamePack {
  id: string;
  name: string;
  accent: string;          // Akzentfarbe (aus dem Theme)
  slots: GearSlot[];       // sofort verfügbare Slots (statisch oder Fallback)
  load?: () => Promise<GearSlot[]>; // optionaler Async-Loader (öffentliche API)
  challenges: Challenge[];
}

// Zufälliges Element aus einem Array ziehen.
export const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];
