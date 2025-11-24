// components
import { Avatar } from 'primereact/avatar';
// CSS scoped
import styles from './styles/ProfileHorizontal.module.css'
// hooks
import { useAuth0 } from '@auth0/auth0-react';
import { useUser } from '../../context/UserContext'; // Importando o UserContext

const ProfileHorizontal = () => {

  //Para adicionar a palavra 'Menu' no header do componente Sidebar

  const { user, isAuthenticated, isLoading } = useAuth0();
  const { usuarioUnibliBd, bibliotecario } = useUser(); // Consumindo o contexto

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  return (
    isAuthenticated && (
      <div className={styles.profileContainer}>
        <div className={styles.containerAvatarProfile}>
          <Avatar className={styles.avatarProfile} image={user.picture} alt={usuarioUnibliBd?.nome} size='xlarge' shape='circle'/>
        </div>
        <div>
          <div className={styles.nameAndTag}>
            <h3>
              {usuarioUnibliBd?.nome ?? user?.name} 
              {bibliotecario && (<i className="pi pi-id-card" title="Bibliotecario" style={{ color:'#055904'}}></i>)} 
            </h3>
          </div>
          <p>{usuarioUnibliBd?.email ?? user?.email}</p>
          <small>{user.sub}</small>
        </div>
      </div>
    )
  );
};

export default ProfileHorizontal;