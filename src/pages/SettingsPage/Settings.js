import Redirect from '../RedirectPage/Redirect';
import styles from './styles/Settings.module.css';
import { withAuthenticationRequired, useAuth0 } from '@auth0/auth0-react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Badge } from 'primereact/badge';

import ProfileHorizontal from '../../components/Auth0/ProfileHorizontal.js';
import DeletarConta from '../../components/DeletarConta/DeletarConta.js';
import EditarConta from '../../components/EditarConta/EditarConta.js';
import ValidarUsuario from '../../components/ValidarUsuario/ValidarUsuario.js';


import { useUser } from '../../context/UserContext'; // 1. Importar o hook

// 2. Remover as props relacionadas ao usuário
const Settings = () => {
  
  // O isLoading do Auth0 ainda é útil para a página em si
  const { isLoading: isLoadingAuth } = useAuth0();

  // 3. Consumir todos os dados necessários do contexto
  const { 
    integrado, 
    isLoadingUser, // Usar nosso loading para a lógica de UI
    serverOrigin, 
    usuarioUnibliBd, 
    setIntegrado, 
    bibliotecario
  } = useUser();

  // O auth0Domain ainda é uma variável de ambiente, podemos pegá-la aqui
  const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
  //console.log(usuarioUnibliBd);
  
  // Mostra um loading geral enquanto o Auth0 ou nosso BD estiverem carregando
  if (isLoadingAuth || isLoadingUser) {
    return <div>Loading ...</div>;
  }

  return (
    <div className={styles.main}>
      <ProfileHorizontal/>
      <TabView>
        
        { !integrado ? (
          <TabPanel leftIcon="pi pi-user-edit" header="Completar cadastro">
            <Badge className={styles.customIcon} value="!" size="large" severity="warning"></Badge>
            {/* Passa as props necessárias para o componente EditarConta */}
            <EditarConta 
              auth0Domain={auth0Domain} 
              origin={serverOrigin} 
              integrado={integrado} 
              setIntegrado={setIntegrado} 
              usuarioUnibliBd={usuarioUnibliBd}
            />
          </TabPanel> 
        ):(
          <TabPanel leftIcon="pi pi-user-edit" header="Editar conta">
            <EditarConta 
              auth0Domain={auth0Domain} 
              origin={serverOrigin} 
              integrado={integrado} 
              setIntegrado={setIntegrado} 
              usuarioUnibliBd={usuarioUnibliBd}
            />
          </TabPanel>
        )}
        
        {bibliotecario 
          ? (
            <TabPanel leftIcon="pi pi-users" header="Validar usuarios" >
              {/* Passa a origin para o componente DeletarConta */}
              <ValidarUsuario origin={serverOrigin} />   
            </TabPanel>
          )
          : (
            <TabPanel leftIcon="pi pi-trash" header="Deletar conta">
              {/* Passa a origin para o componente DeletarConta */}
              <DeletarConta origin={serverOrigin}/>   
            </TabPanel>
          )
        }
        
      </TabView>
    </div>
  );
}

export default withAuthenticationRequired(Settings, {
  onRedirecting: () => (<Redirect />)
});