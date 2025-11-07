import styles from './styles/DetalhesReserva.module.css'
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Redirect from '../RedirectPage/Redirect';

import { useEffect, useState } from 'react';
import axios from 'axios';

import CardReserva from '../../components/CardReserva/CardReserva'
//import { useAuth0 } from '@auth0/auth0-react';

const DetalhesReserva = ({ origin, usuarioUnibliBd }) => {
  //const { user } = useAuth0();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log("TESTE usuarioUnibliBd:",usuarioUnibliBd.id_usuario);
  

  useEffect(() => {
    const carregarReservas = async () => {
      try {
        setLoading(true);
        
        console.log('Buscando reservas para usuário ID:', usuarioUnibliBd.id_usuario);
        
        // Busca as reservas usando o id_usuario que já veio como prop
        const responseReservas = await axios.get(`${origin}/reservas/usuario/${usuarioUnibliBd.id_usuario}`);
        
        console.log('Reservas encontradas:', responseReservas.data);
        setReservas(responseReservas.data.reservas || []);
        
      } catch (error) {
        console.error('Erro ao carregar reservas:', error);
        setError('Erro ao carregar reservas');
      } finally {
        setLoading(false);
      }
    };

    if (usuarioUnibliBd.id_usuario) {
      carregarReservas();
    }
  }, [usuarioUnibliBd.id_usuario, origin]);

  // Função para lidar com o cancelamento da reserva
  const handleReservaCancelada = (reservaId) => {
    // Remove a reserva cancelada da lista
    setReservas(prevReservas => prevReservas.filter(reserva => reserva.id_reserva !== reservaId));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <div className={styles.loading}>Carregando reservas...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.main}>
      <div className={styles.listBooksReservation}>
        {reservas.filter(reserva => reserva.status === 'ativa').length > 0 ? (
          reservas
            .filter(reserva => reserva.status === 'ativa')
            .map((reserva) => (
              <CardReserva 
                key={reserva.id_reserva} 
                reserva={reserva}
                formatDate={formatDate}
                onReservaCancelada={handleReservaCancelada}
                origin={origin} 
                bibliotecario={usuarioUnibliBd.tipoBibliotecario}
              />
            ))
        ) : (
        <div className={styles.semReservas}>
          <p>Nenhuma reserva ativa encontrada</p>
        </div>
      )}
    </div>


      <div className={styles.legendas}>
        {usuarioUnibliBd.tipoBibliotecario ? (
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
        ):''}
      </div>
    </div>
  )
}

export default withAuthenticationRequired(DetalhesReserva, {
  onRedirecting: () => (<Redirect/>)
});