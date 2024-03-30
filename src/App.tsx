import React, { useEffect, useState } from 'react';
import { Typography, Container } from '@mui/material';
import './App.css';
// import { SelectChangeEvent } from '@mui/material/Select';
import GoogleSignInButton from './Components/SignInBtn';
import SignOutButton from './Components/SignOutBtn'; // Stelle sicher, dass der Import korrekt ist
import { auth } from './firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';
import { TabNavigation } from './Components/NavigationsBar';


// App-Komponente


const App: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);
  const [userPhoto, setUserPhoto] = useState<string>('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.photoURL) {
        setUserPhoto(currentUser.photoURL);
      } else {
        setUserPhoto('');
      }
    });

    return () => unsubscribe();
  }, []);


  // const handleTeamSizeChange = (event: SelectChangeEvent<string>): void => {
  //   setTeamSize(event.target.value);
  // };


  return (
    <Container maxWidth="sm">

      <Container maxWidth="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '20px 0' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {userPhoto && <img src={userPhoto} alt="Profilbild" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
            <SignOutButton />
          </div>
        ) : (
          <GoogleSignInButton />
        )}
      </Container>
      <Typography variant="h2" gutterBottom align="center">TeamToss</Typography>
      <TabNavigation />
    </Container>
  );
};

export default App;
