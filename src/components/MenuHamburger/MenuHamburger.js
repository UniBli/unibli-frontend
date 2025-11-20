import { useState } from 'react';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Sidebar } from 'primereact/sidebar';
import { Badge } from 'primereact/badge';
import { Link } from 'react-router-dom';

import LogoutButton from '../Auth0/LogoutButton';
import Profile from '../Auth0/Profile';
import SettingsButton from './SettingsButton';
import DetalhesReservaButton from './DetalhesReservaButton';

import { useUser } from '../../context/UserContext'; // 1. Importar o hook

// CSS scoped
import styles from './styles/MenuHamburger.module.css';

// 2. Remover todas as props
const MenuHamburger = () => {
  const [visibleRight, setVisibleRight] = useState(false);

  // 3. Consumir os dados diretamente do contexto
  const { integrado, isLoadingUser } = useUser();

  // A lógica de exibição permanece a mesma, mas agora com dados do contexto
  const showBadge = !isLoadingUser && !integrado;

  return (
    <>
      <Button 
        className={styles.hamburgerButton}
        icon='pi pi-bars'
        onClick={() => setVisibleRight(true)}
        text
        tooltip={showBadge ? "Conclua o seu cadastro!" : undefined}
        tooltipOptions={{ position: 'left' }}
      >
        {showBadge && (
          <Badge className={styles.customIcon} value="!" size="large" severity="warning"></Badge>
        )}
      </Button>

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
              {/* SettingsButton também será autossuficiente */}
              <SettingsButton />
            </Link>
            <Link to="/detalhes/reserva">
              <DetalhesReservaButton/>
            </Link>
          </div>
        </div>
      </Sidebar>
    </>
  );
};

export default MenuHamburger;