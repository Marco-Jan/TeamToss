// SignInBtn.tsx
import React from 'react';
import { signInWithGoogle } from '../firebase/firebaseInit';
import Button from '@mui/material/Button';
import GoogleIcon from '@mui/icons-material/Google'; 

const SignInButton: React.FC = () => {
  return (
    <Button
      variant="contained"
      color="secondary"
      startIcon={<GoogleIcon />}
      onClick={signInWithGoogle}
      style={{ margin: '20px 0'}}
    >
      Mit Google anmelden
    </Button>
  );
};

export default SignInButton;
