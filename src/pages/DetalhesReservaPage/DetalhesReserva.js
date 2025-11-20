import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { withAuthenticationRequired } from '@auth0/auth0-react';

// Componentes, Contexto e UI
import Redirect from '../RedirectPage/Redirect';
import CardReserva from '../../components/CardReserva/CardReserva';
import { useUser } from '../../context/UserContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

// Estilos
import styles from './styles/DetalhesReserva.module.css';

const DetalhesReserva = () => {
  // 1. Consumir os dados do contexto.
  // O LayoutAutenticado garante que, quando este componente renderiza,
  // os carregamentos de autenticação e usuário já terminaram.
  // Por isso, não precisamos mais de `isLoadingUser` para a lógica de renderização inicial.
  const { usuarioUnibliBd, serverOrigin } = useUser();

  // 2. Estados específicos para este componente.
  // Renomeado de 'loading' para 'loadingReservas' para maior clareza.
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  
  // 3. Referência para o Toast
  const toast = useRef(null);

  // 4. Efeito para buscar os dados específicos desta página (as reservas).
  useEffect(() => {
    // Condição de guarda: se não há um usuário do nosso BD, não há reservas para buscar.
    if (!usuarioUnibliBd?.id_usuario) {
      setLoadingReservas(false); // Finaliza o carregamento, pois não há nada a fazer.
      return;
    }

    // Se temos um usuário, buscamos suas reservas.
    const carregarReservas = async () => {
      setLoadingReservas(true); // Garante que o spinner desta página seja exibido.
      try {
        const response = await axios.get(`${serverOrigin}/reservas/usuario/${usuarioUnibliBd.id_usuario}`);
        setReservas(response.data.reservas || []);
        setError(null); // Limpa qualquer erro anterior em caso de sucesso.
      } catch (err) {
        console.error('Erro ao carregar reservas:', err);
        setError('Erro ao carregar as reservas.');
        
        // Mostrar toast de erro
        toast.current.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar as reservas.',
          life: 5000
        });
      } finally {
        setLoadingReservas(false); // Finaliza o carregamento das reservas.
      }
    };

    carregarReservas();
    
  }, [usuarioUnibliBd, serverOrigin]); // O useEffect agora depende apenas dos dados que realmente iniciam a busca.

  // 5. Funções auxiliares do componente.
  const handleReservaCancelada = (reservaId) => {
    setReservas(prevReservas => prevReservas.filter(reserva => reserva.id_reserva !== reservaId));
    // Mostrar toast de sucesso
    toast.current.show({
      severity: 'success', 
      summary: 'Sucesso', 
      detail: 'Reserva cancelada!', 
      life: 3000
    });
  };

  const handleError = (errorMessage) => {
    // Mostrar toast de erro
    toast.current.show({
      severity: 'error', 
      summary: 'Erro', 
      detail: errorMessage, 
      life: 5000
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // --- LÓGICA DE RENDERIZAÇÃO DA PÁGINA ---
  // O LayoutAutenticado já nos protegeu dos "pisca-piscas" iniciais.
  // Agora, gerenciamos os estados internos desta página.

  // ESTADO 1: Usuário autenticado, mas sem cadastro no nosso banco de dados.
  // Esta verificação agora é segura e não vai piscar na tela.
  if (!usuarioUnibliBd) {
    return (
      <div className={styles.semReservas}>
         <div className={styles.noReservationsFound}>
            <img 
              src='../imgStatus/mail-bro.svg' 
              alt='Ilustração de um detetive' 
            />
          </div>
          <h1 className={styles.txtNoReservationsFound}>
            Complete seu cadastro para conseguir reservar!
          </h1>
      </div>
    ); 
  }

  // ESTADO 2: Carregando os dados específicos desta página (as reservas).
  // Usamos o estilo de carregamento local que você definiu.
  if (loadingReservas) {
    return (
      <div className={styles.loading}>
        <ProgressSpinner style={{ width: '100px', height: '100px', display:'flex' }} strokeWidth="4" />  
      </div>
    );
  }

  // ESTADO 3: Erro ao buscar as reservas.
  if (error) {
    return (
      <>
        <Toast ref={toast} />
        <div className={styles.error}>{error}</div>
      </>
    );
  }
  
  // ESTADO 4: Renderização de sucesso.
  // Exibe a lista de reservas ou a mensagem de "nenhuma reserva encontrada".
  return (
    <div className={styles.main}>
      {/* Toast centralizado no componente pai */}
      <Toast ref={toast} />
      
      {reservas.filter(reserva => reserva.status === 'ativa').length > 0 ? (
        <div className={styles.listBooksReservation}>
          {
            reservas
              .filter(reserva => reserva.status === 'ativa')
              .map((reserva) => (
                <CardReserva 
                  key={reserva.id_reserva} 
                  reserva={reserva}
                  formatDate={formatDate}
                  onReservaCancelada={handleReservaCancelada}
                  onError={handleError}
                  origin={serverOrigin}
                  bibliotecario={usuarioUnibliBd?.tipoBibliotecario}
                />
              ))
          }
        </div>
      ) : (
        <div className={styles.semReservas}>
          <div className={styles.noReservationsFound}>
            <img 
              src='../imgStatus/fileSearching-bro.svg' 
              alt='Ilustração de um detetive' 
            />
          </div>
          <h1 className={styles.txtNoReservationsFound}>
            Nenhuma reserva ativa encontrada
          </h1>
          <small>:'-(</small>
        </div>
      )}
      
      {/* Renderiza a legenda apenas se o usuário for um bibliotecário */}
      {!!usuarioUnibliBd?.tipoBibliotecario && (
        <div className={styles.legendas}>
          <h2>Legendas</h2>
          <span>
            <p><i className="pi pi-times-circle"></i>: Cancelar Reserva</p>
            <p><i className="pi pi-check-circle"></i>: Título Retirado</p>
          </span>
        </div>
      )}
    </div>
  );
}

// A exportação com o HOC do Auth0 permanece inalterada.
export default withAuthenticationRequired(DetalhesReserva, {
  onRedirecting: () => (<Redirect/>)
});