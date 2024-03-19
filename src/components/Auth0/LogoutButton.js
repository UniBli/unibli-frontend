// components
import { Button } from 'primereact/button';
// CSS scoped
import styles from './styles/LogoutButton.module.css'
// hooks
import { useAuth0 } from '@auth0/auth0-react';

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
        <>
          <div className={styles.containerLogoutButton}>
            <Button
              label='Sair' 
              icon='pi pi-sign-out' 
              iconPos='right'
              severity='success'
              className={styles.logoutButton}
              onClick={() => logout({ 
                logoutParams: { returnTo: window.location.origin } 
              })}
              text
            />
          </div>
        </>
  );
};

export default LogoutButton;
