// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
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


// Initialize Firebase
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
      isLogginCheck(true);
      console.log(user);
    }).catch((error) => {
      // Error handling
      console.log(error.message);
    });
};

export const handleSignOut = async () => {
  try {
    await signOut(auth);
    console.log('Abmeldung erfolgreich');
  } catch (error) {
    console.error('Fehler bei der Abmeldung', error);
  }
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
    NickName: doc.data().NickName as string, // Typ explizit angeben
  })) as Nickname[]; // Bestätige dem Compiler, dass dies ein Array von Nicknames ist
};


// Funktion zum Löschen eines Nicknames anhand seiner ID
export const deleteNickname = async (nicknameId: string): Promise<void> => {
  await deleteDoc(doc(db, "TeamTossNickNames", nicknameId));
};




export default app;