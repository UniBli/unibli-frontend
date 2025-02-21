// components
import { Avatar } from 'primereact/avatar';
// CSS scoped
import styles from './styles/ProfileHorizontal.module.css'
// hooks
import { useAuth0 } from '@auth0/auth0-react';

const ProfileHorizontal = () => {

  //Para adicionar a palavra 'Menu' no header do componente Sidebar 
  

  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    isAuthenticated && (
      <div className={styles.profileContainer}>
        <div className={styles.containerAvatarProfile}>
          <Avatar className={styles.avatarProfile} image={user.picture} alt={user.name} size='xlarge' shape='circle'/>
        </div>
        <div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <small>{user.sub}</small>
        </div>
      </div>
    )
  );
};

export default ProfileHorizontal;