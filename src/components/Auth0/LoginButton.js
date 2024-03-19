// components
import { Button } from 'primereact/button';
// CSS scoped
import styles from './styles/LoginButton.module.css'
// hooks
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (

    <Button
    label='Entrar'
    icon='pi pi-sign-in'
    iconPos='right'
    severity='success'
    className={styles.loginButton}
    onClick={() => loginWithRedirect()}
    rounded
  />
  );
};

export default LoginButton;