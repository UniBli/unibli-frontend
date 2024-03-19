import styles from './DetalhesReserva.module.css'
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Redirect from '../RedirectPage/Redirect';

const DetalhesReserva = () => {
  return (
    <div className={styles.tamanhoTela}>
      <h1>
        DetalhesReserva
      </h1>
    </div>
  )
}

export default withAuthenticationRequired(DetalhesReserva, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (<Redirect/>)
});