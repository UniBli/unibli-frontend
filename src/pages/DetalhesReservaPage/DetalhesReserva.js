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
  // os carregamentos de autenticacao e usuario ja terminaram.
  // Por isso, nao precisamos mais de `isLoadingUser` para a logica de renderizacao inicial.
  const { usuarioUnibliBd, serverOrigin, bibliotecario } = useUser();

  // 2. Estados especificos para este componente.
  // Renomeado de 'loading' para 'loadingReservas' para maior clareza.
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  
  // 3. Referencia para o Toast
  const toast = useRef(null);

  console.log('reservas', reservas);
  console.log('reservas.length', reservas.filter(reserva => reserva.status === 'ativa').length);
 
  

  // 4. Efeito para buscar os dados especificos desta pagina (as reservas).
  useEffect(() => {
    // Condicao de guarda: se nao ha um usuario do nosso BD, nao ha reservas para buscar.
    if (!usuarioUnibliBd?.id_usuario) {
      setLoadingReservas(false); // Finaliza o carregamento, pois nao ha nada a fazer.
      return;
    }

    // Se temos um usuario, buscamos suas reservas.
    const carregarReservas = async () => {
      setLoadingReservas(true); // Garante que o spinner desta pagina seja exibido.
      try {
        let uri = 
          bibliotecario 
            ? `${serverOrigin}/reservas` 
            : `${serverOrigin}/reservas/usuario/${usuarioUnibliBd.id_usuario}`

        const response = await axios.get(uri);
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
    
  }, [usuarioUnibliBd, serverOrigin, bibliotecario]); // O useEffect agora depende apenas dos dados que realmente iniciam a busca.

  // 5. Funcoes auxiliares do componente.
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

  const handleReservaFinalizada = (reservaId) => {
    setReservas(prevReservas => prevReservas.filter(reserva => reserva.id_reserva !== reservaId));
    // Mostrar toast de sucesso
    toast.current.show({
      severity: 'success', 
      summary: 'Sucesso', 
      detail: 'Reserva finalizada!', 
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

  // --- LOGICA DE RENDERIZACAO DA PAGINA ---
  // O LayoutAutenticado ja nos protegeu dos "pisca-piscas" iniciais.
  // Agora, gerenciamos os estados internos desta pagina.

  // ESTADO 1: Usuario autenticado, mas sem cadastro no nosso banco de dados.
  // Esta verificacao agora e segura e nao vai piscar na tela.
  if (!usuarioUnibliBd) {
    return (
      <div className={styles.semReservas}>
         <div className={styles.noReservationsFound}>
            <img 
              src='../imgStatus/mail-bro.svg' 
              alt='Ilustracao de um detetive' 
            />
          </div>
          <h1 className={styles.txtNoReservationsFound}>
            Complete seu cadastro para conseguir reservar!
          </h1>
      </div>
    ); 
  }

  // ESTADO 2: Carregando os dados especificos desta pagina (as reservas).
  // Usamos o estilo de carregamento local que voce definiu.
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
  
  // ESTADO 4: Renderizacao de sucesso.
  // Exibe a lista de reservas ou a mensagem de "nenhuma reserva encontrada".
  return (
    <div className={styles.main}
    style={!bibliotecario ? {
              justifyContent: 'flex-start',
          } : null}
    >
      {/* Toast centralizado no componente pai */}
      <Toast ref={toast} />
      
      {reservas.filter(reserva => reserva.status === 'ativa').length > 0 ? (
        <div 
          className={styles.listBooksReservation}
        >
          {
            reservas
              .filter(reserva => reserva.status === 'ativa')
              .map((reserva) => (
                <CardReserva 
                  key={reserva.id_reserva} 
                  reserva={reserva}
                  formatDate={formatDate}
                  onReservaCancelada={handleReservaCancelada}
                  onReservaFinalizada={handleReservaFinalizada}
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
              alt='Ilustracao de um detetive' 
            />
          </div>
          <h1 className={styles.txtNoReservationsFound}>
            Nenhuma reserva ativa encontrada
          </h1>
          <small>:'-(</small>
        </div>
      )}
      
      {/* Renderiza a legenda apenas se o usuario for um bibliotecario */}
      {bibliotecario && (
        <div className={styles.legendas}>
          <h2>Legendas</h2>
          <span>
            <p><i className="pi pi-times-circle"></i>: Cancelar Reserva</p>
            <p><i className="pi pi-check-circle"></i>: Titulo Retirado</p>
          </span>
        </div>
      )}
    </div>
  );
}

// A exportacao com o HOC do Auth0 permanece inalterada.
export default withAuthenticationRequired(DetalhesReserva, {
  onRedirecting: () => (<Redirect/>)
});
