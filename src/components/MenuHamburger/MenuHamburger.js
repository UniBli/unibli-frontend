// components
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'primereact/sidebar';
import { Badge } from 'primereact/badge';

import LogoutButton from '../Auth0/LogoutButton';
import Profile from '../Auth0/Profile';
import SettingsButton from './SettingsButton';
import DetalhesReservaButton from './DetalhesReservaButton';
// import ManterAcervoButton from './ManterAcervoButton';
import { Link } from 'react-router-dom';

// CSS scoped
import styles from './styles/MenuHamburger.module.css';

// hooks
import { useState } from 'react';
// import { useEffect } from 'react';

// import axios from 'axios';
// import { useAuth0 } from '@auth0/auth0-react';

const MenuHamburger = ({origin, integrado2}) => {
  const [visibleRight, setVisibleRight] = useState(false);

  return (
    <>

    { !integrado2 ? (
        <Button 
          className={styles.hamburgerButton}
          icon='pi pi-bars'
          onClick={() => setVisibleRight(true)}
          text
          tooltip="Conclua o seu cadastro!"
          tooltipOptions={{ position: 'left' }}
        >
          <Badge className={styles.customIcon} value="!" size="large" severity="warning"></Badge>
        </Button>
    ):(
      <Button 
        className={styles.hamburgerButton}
        icon='pi pi-bars'
        onClick={() => setVisibleRight(true)}
        text>
        </Button>
    )}
      <Sidebar 
        visible={visibleRight} 
        position='right' 
        onHide={() => setVisibleRight(false)}>

        <div className={styles.contentSidebar}>
          <div className={styles.profile}>
            <Profile/>
          </div>
          <Divider/>
          <div className={styles.usersActions}>
            <LogoutButton/>
            <Link to="/settings">
              <SettingsButton integrado2={integrado2}/>
            </Link>
            <Link to="/bookingDetails">
              <DetalhesReservaButton/>
            </Link>
          </div>
        </div>

        {/* Ajustar usando a requisição da role
        {
         user.picture 
          ? (
              <div className={styles.bibliotecarioActions}>
                <Link to='/maintainCollection'>
                  <ManterAcervoButton/>
                </Link>
              </div>
            ) 
          : (<div></div>)
        } */}
      </Sidebar>
    </>
  );
};

export default MenuHamburger;