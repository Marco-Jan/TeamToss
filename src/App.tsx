import React, { useEffect, useState } from 'react';
import { Typography, Container, Grid } from '@mui/material';
import './App.css';
import { auth } from './firebase/firebaseInit';
import { User, onAuthStateChanged } from 'firebase/auth';
import GoogleSignInButton from './Components/SignInBtn';
import SignOutButton from './Components/SignOutBtn';
import { TabNavigation } from './Components/NavigationsBar'; 

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

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom align="center">TeamToss</Typography>

      {/* Anmeldekomponenten */}
      <Grid container spacing={2} alignItems="center" style={{ padding: '20px 0' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexDirection: 'column' }}>
            {userPhoto && <img src={userPhoto} alt="Profilbild" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
            <SignOutButton />
          </div>
        ) : (
          <GoogleSignInButton />
        )}
      </Grid>

      <TabNavigation />
    </Container>
  );
};

export default App;
