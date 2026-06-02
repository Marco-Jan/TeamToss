// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, updateDoc, doc, setDoc, getDoc, query, where, serverTimestamp, Timestamp, getCountFromServer } from "firebase/firestore";
import { getAuth, signInWithPopup, signInAnonymously, GoogleAuthProvider, signOut, User } from "firebase/auth";
import { Nickname } from "../types/nickname";



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBHeEaZNvgD2um6vcthz1ILNHEPgYQzB60",
  authDomain: "teamtoss-a3946.firebaseapp.com",
  projectId: "teamtoss-a3946",
  storageBucket: "teamtoss-a3946.appspot.com",
  messagingSenderId: "184900601836",
  appId: "1:184900601836:web:420b1e223127bfeb1ae2c9"
};


// Init Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const auth = getAuth(app);

export const signInWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      // This gives you a Google ID token. You can use it to access the Google API.
      // const token = result.user.getIdToken();
      // The signed-in user
      const user = result.user;
      console.log(user);
    }).catch((error) => {
      // Error handling
      console.log(error.message);
    });
};

// Anonyme Gast-Anmeldung (kein Google-Konto nötig).
// Gast-Daten werden nach GUEST_TTL_DAYS automatisch gelöscht (siehe registerUserPresence + TTL-Policy).
export const signInAsGuest = async (): Promise<void> => {
  try {
    await signInAnonymously(auth);
    console.log('Als Gast angemeldet');
  } catch (error) {
    console.error('Gast-Anmeldung fehlgeschlagen', error);
  }
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log('Abmeldung erfolgreich');
  } catch (error) {
    console.error('Fehler bei der Abmeldung', error);
  }
};

// ── Nutzer-Tracking & Admin ──────────────────────────────────────────────
// Lebensdauer eines Gast-Zugangs in Tagen.
const GUEST_TTL_DAYS = 30;

// WICHTIG: Trage hier deine eigene Google-User-UID ein.
// Zu finden in der Firebase-Konsole → Authentication → Users → Spalte "User UID"
// (nachdem du dich einmal per Google eingeloggt hast).
// Nur diese UID(s) sehen das Admin-Dashboard unter /admin.
// Dieselbe UID muss zusätzlich in firestore.rules (Funktion isAdmin) eingetragen werden!
export const ADMIN_UIDS: string[] = [
 'VjVwvVysQUPvds6GW04kaRSy0rH2'
];

export const isAdmin = (user: User | null): boolean =>
  !!user && ADMIN_UIDS.includes(user.uid);

// Legt/aktualisiert den Zähl-Datensatz users/{uid}. Wird bei jeder Anmeldung aufgerufen.
// Für Gäste wird ein Ablaufdatum (expiresAt) gesetzt, das die TTL-Policy zum Löschen nutzt.
export const registerUserPresence = async (user: User): Promise<void> => {
  try {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);
    const data: Record<string, unknown> = {
      uid: user.uid,
      isAnonymous: user.isAnonymous,
      displayName: user.displayName ?? null,
      email: user.email ?? null,
      lastActiveAt: serverTimestamp(),
    };
    if (user.isAnonymous) {
      data.expiresAt = Timestamp.fromMillis(Date.now() + GUEST_TTL_DAYS * 24 * 60 * 60 * 1000);
    }
    if (!snap.exists()) {
      data.createdAt = serverTimestamp();
    }
    await setDoc(ref, data, { merge: true });
  } catch (error) {
    // Tracking ist nicht kritisch für die App-Funktion — Fehler nur loggen.
    console.error('Nutzer-Tracking fehlgeschlagen', error);
  }
};

export interface AdminStats {
  totalUsers: number;
  guests: number;
  googleUsers: number;
  activeLast7Days: number;
}

// Zählt Nutzer über serverseitige Aggregation (count) — günstig und ohne alle Dokumente zu laden.
export const getAdminStats = async (): Promise<AdminStats> => {
  const usersCol = collection(db, 'users');
  const sevenDaysAgo = Timestamp.fromMillis(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [totalSnap, guestSnap, activeSnap] = await Promise.all([
    getCountFromServer(query(usersCol)),
    getCountFromServer(query(usersCol, where('isAnonymous', '==', true))),
    getCountFromServer(query(usersCol, where('lastActiveAt', '>=', sevenDaysAgo))),
  ]);

  const totalUsers = totalSnap.data().count;
  const guests = guestSnap.data().count;
  return {
    totalUsers,
    guests,
    googleUsers: totalUsers - guests,
    activeLast7Days: activeSnap.data().count,
  };
};

export const addNickname = async (nickname: string): Promise<void> => {
  if (!auth.currentUser) return;
  await addDoc(collection(db, "TeamTossNickNames"), {
    NickName: nickname,
    userId: auth.currentUser.uid // Speichert die Benutzer-ID mit dem Nickname
  });
};

export const isLogginCheck = (isLoggin: boolean) => {
  if(isLoggin){
    return true;
  }else{
    return false;
  }
}

// Funktion zum Lesen aller Nicknames

export const getNicknames = async (): Promise<Nickname[]> => {
  if (!auth.currentUser) return [];
  const q = query(collection(db, "TeamTossNickNames"), where("userId", "==", auth.currentUser.uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    NickName: doc.data().NickName as string, 
  })) as Nickname[]; 
};

// Funktion zum Löschen eines Nicknames anhand seiner ID
export const deleteNickname = async (nicknameId: string): Promise<void> => {
  await deleteDoc(doc(db, "TeamTossNickNames", nicknameId));
};

// Funktion zum Umbenennen eines Nicknames anhand seiner ID
export const updateNickname = async (nicknameId: string, newName: string): Promise<void> => {
  await updateDoc(doc(db, "TeamTossNickNames", nicknameId), {
    NickName: newName,
  });
};

export default app;