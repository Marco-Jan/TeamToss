import Button from '@mui/material/Button';
import { handleSignOut } from '../firebase/firebaseInit';

const SignOutButton: React.FC = () => {
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleSignOut}
      style={{ margin: '20px 20px'}}
    >
      Abmelden
    </Button>
  );
}

export default SignOutButton;