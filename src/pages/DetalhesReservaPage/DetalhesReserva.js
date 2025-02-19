import styles from './DetalhesReserva.module.css'
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Redirect from '../RedirectPage/Redirect';

//import CardReservaLeitor from '../../components/CardReserva/CardReservaLeitor'

import { useAuth0 } from '@auth0/auth0-react';


const DetalhesReserva = () => {

  const {user} = useAuth0();

  //Só para testar ---------------------
  user.locale = true;

  //para o bibliotecário vê a lista apenas da unidade dele ex: unidade fatecA = 1 e fatecB = 2
  //const bibiotecario = 1
  //------------------------------------

  return (
    <div className={styles.main}>
      <div className={styles.listBooksReservation}>
        {/* {
          books && books.slice(0,10).map((book) => (
            <CardReservaLeitor key={book.id} book={book}/>
          ))
        } */}
      </div>

      <div className={styles.legendas}>
        {user.locale && (
        <>
          <h2>Legendas</h2>
          <span>
            <p>   
              <i className="pi pi-times-circle"></i>: 
              Cancelar Reserva
            </p>
            <p>   
              <i className="pi pi-check-circle"></i>: 
              Título Retirado
            </p>
          </span>
        </>
        )}


      </div>

    </div>
  )
}

export default withAuthenticationRequired(DetalhesReserva, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => (<Redirect/>)
});