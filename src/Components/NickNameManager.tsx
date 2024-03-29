import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import { addNickname, getNicknames, deleteNickname } from '../firebase/firebaseInit';
import { Nickname } from '../types/nickname';
import { auth } from '../firebase/firebaseInit';
import { onAuthStateChanged } from 'firebase/auth';
// import { onAddPlayer } from '../App';


// Hier wird `onAddNameToPlayerList` als Prop übergeben
export interface NicknameManagerProps {
  onAddPlayer: (nickname: string) => void;
}


const NicknameManager: React.FC<NicknameManagerProps> = ({ onAddPlayer }) => {
  const [nickname, setNickname] = useState<string>('');
  const [nicknames, setNicknames] = useState<Nickname[]>([]);

  useEffect(() => {
    // Diese Funktion abonniert Änderungen am Authentifizierungsstatus
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Wenn der Benutzer angemeldet ist, rufen wir die Nicknames ab
        fetchNicknames();
      } else {
        // Wenn der Benutzer abgemeldet ist, leeren wir die Liste der Nicknames
        setNicknames([]);
      }
    });

    // Bereinigungsfunktion, um das Abonnement aufzuheben, wenn die Komponente unmountet wird
    return () => unsubscribe();
  }, []);

  // Hier definieren wir `fetchNicknames` außerhalb des useEffect, damit es im gesamten Component verfügbar ist.
  const fetchNicknames = async () => {
    const fetchedNicknames = await getNicknames();
    console.log(fetchedNicknames, 'fetchedNicknames');

    setNicknames(fetchedNicknames);
  };

  // Nutze `fetchNicknames` innerhalb von useEffect
  useEffect(() => {
    fetchNicknames();
  }, []);

  const handleAddNickname = async () => {
    if (nickname.trim() !== '') {
      await addNickname(nickname);
      setNickname(''); // Zurücksetzen des Eingabefeldes
      await fetchNicknames(); // Aktualisiere die Liste der Nicknames
    }
  };

  const handleDeleteNickname = async (id: string) => {
    await deleteNickname(id);
    await fetchNicknames(); // Aktualisiere die Liste der Nicknames
  };

  return (
    <div>
      <TextField
        label="Nickname"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        variant="outlined"
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleAddNickname}>Hinzufügen</Button>
      <ul>
        {nicknames.map(({ id, NickName }) => (
          <li key={id}>
            {NickName}
            <Button variant="contained" color="primary" onClick={() => onAddPlayer(NickName)}>Zum Team hinzufügen</Button>
            <Button variant="contained" color="secondary" onClick={() => handleDeleteNickname(id)}>Löschen</Button>
          </li>
        ))}
      </ul>
    </div >
  );
};

export default NicknameManager;
