import Redirect from '../RedirectPage/Redirect';
import styles from './styles/Settings.module.css';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Badge } from 'primereact/badge';

import ProfileHorizontal from '../../components/Auth0/ProfileHorizontal.js';

import DeletarConta from '../../components/DeletarConta/DeletarConta.js'

import EditarConta from '../../components/EditarConta/EditarConta.js'

import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState} from 'react';

import axios from 'axios';

const Settings = ({auth0Domain, origin}) => {

  const {isAuthenticated, isLoading } = useAuth0();

  const {user} = useAuth0();
  const [integrado, setIntegrado] = useState(false)


  useEffect(() => {
  axios.get(`${origin}/usuarios/user/${user.sub}`)
  .then((resp) => {
    const user = resp.data.usuario
    //console.log(user);
    if(user !== null){
      setIntegrado(true);
    }else{
      setIntegrado(false);
    }
  })
  .catch((error) => {
    console.error('Erro ao buscar usuário:', error);
    setIntegrado(false);
  });
    
  }, [origin, user.sub, setIntegrado])
  
  // Novo useEffect para reagir a mudanças no 'integrado'
useEffect(() => {
  if (integrado) {
    setIntegrado(true)
    console.log('Usuário integrado com sucesso!');
    // Aqui você pode alterar elementos da tela, mostrar mensagens ou redirecionar
  } else {
    setIntegrado(false)
    console.log('Usuário não integrado.');
    // Lógica para o caso de não estar integrado
  }
}, [integrado]);


  if (isLoading) {
    return <div>Loading ...</div>;
  }

  console.log('integrado',integrado);
  
  return (
    isAuthenticated && (
      <div className={styles.main}>
        <ProfileHorizontal/>
        <TabView>
          { !integrado ? (
            <TabPanel leftIcon="pi pi-user-edit" header="Completar cadastro">
              <Badge className={styles.customIcon} value="!" size="large" severity="warning"></Badge>
              <EditarConta auth0Domain={auth0Domain} origin={origin}/>
            </TabPanel> 
          ):(
            <TabPanel leftIcon="pi pi-user-edit" header="Editar conta">
              <EditarConta auth0Domain={auth0Domain} origin={origin}/>
            </TabPanel>
          )}
          <TabPanel leftIcon="pi pi-trash" header="Deletar conta">
            <DeletarConta origin={origin}/>
          </TabPanel>
        </TabView>
      </div>
    )

    // <div className={styles.tamanhoTela}>Settings</div>
  )
}

export default withAuthenticationRequired(Settings, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (<Redirect />)
});