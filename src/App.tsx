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
      <Grid container alignItems="center" justifyContent="space-between" spacing={2} style={{ padding: '20px 0' }}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h2" gutterBottom align="center">TeamToss</Typography>
        </Grid>
        <Grid item xs={12} sm={6} style={{ display: 'flex', justifyContent: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {userPhoto && <img src={userPhoto} alt="Profilbild" style={{ width: 50, height: 50, borderRadius: '50%' }} />}
              <SignOutButton />
            </div>
          ) : (
            <GoogleSignInButton />
          )}
        </Grid>
        <Grid item xs={12}>
          <TabNavigation />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
