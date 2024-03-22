// components
import { Button } from 'primereact/button';
// CSS scoped
import styles from './styles/LoginButton.module.css'
// hooks
import { useAuth0 } from '@auth0/auth0-react';

const LoginButton = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

/*  
  //Para enviar o objeto de usuario que está logado para o backend -- verificar depois se essa é ou não a melhor forma
  const sendPayloadToBackend = async (payload) => {
    try {
      await fetch(
        'http://seu-backend.com/auth0/callback', 
        { payload });
      console.log('Payload enviado para o backend com sucesso');
    } catch (error) {
      console.error('Erro ao enviar o payload para o backend:', error);
    }
  };

  if (isAuthenticated && user) {
    // Aqui você pode acessar os dados do usuário autenticado
    const { 
      client_id, code_verifier, grant_type, code,redirect_uri
    } = user;
    // Você pode montar o payload como desejar
    const payloadFromAuth0 = { client_id, code_verifier, grant_type, code,redirect_uri};
    // Enviar o payload para o backend
    sendPayloadToBackend(payloadFromAuth0);
  }
  */

  return (

    <Button
    label='Entrar'
    icon='pi pi-sign-in'
    iconPos='right'
    severity='success'
    className={styles.loginButton}
    onClick={handleLogin}
    rounded
  />
  );
};

export default LoginButton;