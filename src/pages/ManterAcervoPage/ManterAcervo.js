import styles from './ManterAcervo.module.css';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Redirect from '../RedirectPage/Redirect';

const ManterAcervo = () => {
  return (
    <div className={styles.tamanhoTela}>ManterAcervo</div>
  )
}

export default withAuthenticationRequired(ManterAcervo, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (<Redirect/>)
});