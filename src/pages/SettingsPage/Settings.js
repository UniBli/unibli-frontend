import Redirect from '../RedirectPage/Redirect';
import styles from './styles/Settings.module.css';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Badge } from 'primereact/badge';

import ProfileHorizontal from '../../components/Auth0/ProfileHorizontal.js';

import DeletarConta from '../../components/DeletarConta/DeletarConta.js'

import EditarConta from '../../components/EditarConta/EditarConta.js'

import { useAuth0 } from '@auth0/auth0-react';

const Settings = ({auth0Domain, origin, integrado, setIntegrado, usuarioUnibliBd}) => {
  
  const {isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div className={styles.main}>
        <ProfileHorizontal/>
        <TabView>
          { !integrado ? (
            <TabPanel leftIcon="pi pi-user-edit" header="Completar cadastro">
              <Badge className={styles.customIcon} value="!" size="large" severity="warning"></Badge>
              <EditarConta auth0Domain={auth0Domain} origin={origin} integrado={integrado} setIntegrado={setIntegrado} usuarioUnibliBd={usuarioUnibliBd}/>
            </TabPanel> 
          ):(
            <TabPanel leftIcon="pi pi-user-edit" header="Editar conta">
              <EditarConta auth0Domain={auth0Domain} origin={origin} integrado={integrado} setIntegrado={setIntegrado} usuarioUnibliBd={usuarioUnibliBd}/>
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