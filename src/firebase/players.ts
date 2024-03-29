// src/firebase/players.ts
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db ,auth } from './firebaseInit';
import { Player } from '../types/player';



// Spieler hinzufügen
export const addPlayer = async (name: string): Promise<void> => {
  if (!auth.currentUser) return;
  await addDoc(collection(db, "players"), {
    name: name,
    userId: auth.currentUser.uid // Speichere die Benutzer-ID mit dem Spieler
  });
};

// Spieler abrufen
export const getPlayers = async (): Promise<Player[]> => {
  if (!auth.currentUser) return [];
  const q = query(collection(db, "players"), where("userId", "==", auth.currentUser.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    ...doc.data() as Player,
    id: doc.id
  }));
};
