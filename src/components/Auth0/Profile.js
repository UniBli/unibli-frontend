// components
import { Avatar } from 'primereact/avatar';
// CSS scoped
import styles from './styles/Profile.module.css'
// hooks
import { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Profile = () => {

  //Para adicionar a palavra 'Menu' no header do componente Sidebar 
  useEffect(() => {
    const sidebarHeader = document.querySelector('.p-sidebar-header');
    
    const txtMenu = document.createElement('h2');
    txtMenu.textContent = 'Menu';
    txtMenu.style.color = '#055904';
    txtMenu.style.margin = '0';
    
    //Verificação para escrever o txtMenu apenas 1 vez
    if (!sidebarHeader.querySelector('h2')) {
      sidebarHeader.insertBefore(txtMenu, sidebarHeader.firstChild);
    }
  }, []);

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className={styles.sidebar}>
        <div className={styles.containerAvatarProfile}>
          <Avatar className={styles.avatarProfile} image={user.picture} alt={user.name} size='xlarge' shape='circle'/>
        </div>
        <h3>{user.name}</h3>
        <p>{user.email}</p>
      </div>
    )
  );
};

export default Profile;