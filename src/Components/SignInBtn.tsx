// SignInBtn.tsx
import React from 'react';
import { signInWithGoogle } from '../firebase/firebaseInit';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google'; 
import { Grid } from '@mui/material';

const SignInButton: React.FC = () => {
  return (
    <Grid container justifyContent="center">
    <Button
      variant="contained"
      color="secondary"
      startIcon={<GoogleIcon />}
      onClick={signInWithGoogle}
      style={{ margin: '20px 0'}}
    >
      Mit Google anmelden
    </Button>
    </Grid>
  );
};

export default SignInButton;
