import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { withAuthenticationRequired } from '@auth0/auth0-react';

// Componentes, Contexto e UI
import Redirect from '../RedirectPage/Redirect';
import CardReserva from '../../components/CardReserva/CardReserva';
import FiltroReservas from '../../components/FiltroReservas/FiltroReservas';
import { useUser } from '../../context/UserContext';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Toast } from 'primereact/toast';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';


// Estilos
import styles from './styles/DetalhesReserva.module.css';

const DetalhesReserva = () => {
  const { usuarioUnibliBd, serverOrigin, bibliotecario, fatecs } = useUser();
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [reservas, setReservas] = useState([]);
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [error, setError] = useState(null);
  const toast = useRef(null);

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState('right');
  const show = (position) => {
        setPosition(position);
        setVisible(true);
    };


  // Função para aplicar filtros (agora pode ser usada em múltiplos lugares)
  const aplicarFiltros = (todasReservas, filtros) => {
    let reservasFiltradas = todasReservas;

    // Aplicar filtros sequencialmente
    if (filtros.ra) {
      reservasFiltradas = reservasFiltradas.filter(reserva => 
        reserva.Usuario?.ra?.toLowerCase().includes(filtros.ra.toLowerCase())
      );
    }

    if (filtros.nomeUsuario) {
      reservasFiltradas = reservasFiltradas.filter(reserva => 
        reserva.Usuario?.nome?.toLowerCase().includes(filtros.nomeUsuario.toLowerCase())
      );
    }

    if (filtros.fatec) {
      reservasFiltradas = reservasFiltradas.filter(reserva => 
        reserva.Fatec?.nome === filtros.fatec
      );
    }

    if (filtros.tituloLivro) {
      reservasFiltradas = reservasFiltradas.filter(reserva => 
        reserva.Livro?.titulo?.toLowerCase().includes(filtros.tituloLivro.toLowerCase())
      );
    }

    if (filtros.idReserva) {
      reservasFiltradas = reservasFiltradas.filter(reserva => 
        reserva.id_reserva.toString().includes(filtros.idReserva)
      );
    }

    if (filtros.status) {
      reservasFiltradas = reservasFiltradas.filter(reserva => 
        reserva.status === filtros.status
      );
    }

    if (filtros.dataReserva) {
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const dataReserva = new Date(reserva.dataDaReserva).toISOString().split('T')[0];
        return dataReserva === filtros.dataReserva;
      });
    }

    if (filtros.dataExpiracao) {
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const dataExpiracao = new Date(reserva.dataExpiracao).toISOString().split('T')[0];
        return dataExpiracao === filtros.dataExpiracao;
      });
    }

    return reservasFiltradas;
  };

  // 4. Efeito para buscar os dados especificos desta pagina (as reservas).
  useEffect(() => {
    if (!usuarioUnibliBd?.id_usuario) {
      setLoadingReservas(false);
      return;
    }

    const carregarReservas = async () => {
      setLoadingReservas(true);
      try {
        let uri = 
          bibliotecario 
            ? `${serverOrigin}/reservas` 
            : `${serverOrigin}/reservas/usuario/${usuarioUnibliBd.id_usuario}`

        const response = await axios.get(uri);
        const todasReservas = response.data.reservas || [];
        setReservas(todasReservas);
        
        // Se for bibliotecário, aplica o filtro padrão (status "ativa")
        if (bibliotecario) {
          const filtrosPadrao = { status: 'ativa' };
          const reservasFiltradasInicial = aplicarFiltros(todasReservas, filtrosPadrao);
          setReservasFiltradas(reservasFiltradasInicial);
        } else {
          // Para usuários normais, mostra apenas as ativas (comportamento original)
          setReservasFiltradas(todasReservas.filter(reserva => reserva.status === 'ativa'));
        }
        
        setError(null);
      } catch (err) {
        console.error('Erro ao carregar reservas:', err);
        setError('Erro ao carregar as reservas.');
        toast.current.show({
          severity: 'error',
          summary: 'Erro',
          detail: 'Erro ao carregar as reservas.',
          life: 5000
        });
      } finally {
        setLoadingReservas(false);
      }
    };

    carregarReservas();
  }, [usuarioUnibliBd, serverOrigin, bibliotecario]);

  // Função para lidar com mudanças nos filtros
  const handleFiltroChange = (filtros) => {
    const reservasFiltradas = aplicarFiltros(reservas, filtros);
    setReservasFiltradas(reservasFiltradas);
  };

  // Funções auxiliares (mantidas do código original)
  const handleReservaCancelada = (reservaId) => {
    const novasReservas = reservas.filter(reserva => reserva.id_reserva !== reservaId);
    setReservas(novasReservas);
    
    // Reaplica os filtros atuais
    const filtrosAtuais = { status: 'ativa' }; // Ou você pode manter o estado dos filtros atuais
    const novasReservasFiltradas = aplicarFiltros(novasReservas, filtrosAtuais);
    setReservasFiltradas(novasReservasFiltradas);
    
    toast.current.show({
      severity: 'success', 
      summary: 'Sucesso', 
      detail: 'Reserva cancelada!', 
      life: 3000
    });
  };

  const handleReservaFinalizada = (reservaId) => {
    const novasReservas = reservas.filter(reserva => reserva.id_reserva !== reservaId);
    setReservas(novasReservas);
    
    // Reaplica os filtros atuais
    const filtrosAtuais = { status: 'ativa' };
    const novasReservasFiltradas = aplicarFiltros(novasReservas, filtrosAtuais);
    setReservasFiltradas(novasReservasFiltradas);
    
    toast.current.show({
      severity: 'success', 
      summary: 'Sucesso', 
      detail: 'Reserva finalizada!', 
      life: 3000
    });
  };

  const handleError = (errorMessage) => {
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

  // Renderização condicional
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

  if (loadingReservas) {
    return (
      <div className={styles.loading}>
        <ProgressSpinner style={{ width: '100px', height: '100px', display:'flex' }} strokeWidth="4" />  
      </div>
    );
  }

  if (error) {
    return (
      <>
        <Toast ref={toast} />
        <div className={styles.error}>{error}</div>
      </>
    );
  }

  return (<>

    <div className={styles.main}
      style={!!bibliotecario ? { justifyContent: 'flex-start' } : null}
    >
      <Toast ref={toast} />
      {/* Componente de Filtro - apenas para bibliotecários */}
      {bibliotecario && (
            <Dialog header={(<h3>Filtro de Reservas</h3>)} visible={visible} position={position} style={{ width: '50vw' }} onHide={() => {if (!visible) return; setVisible(false); }} modal={false}  draggable={false} resizable={false}>
                 <FiltroReservas
                    reservas={reservas}
                    onFiltroChange={handleFiltroChange}
                    fatecs={fatecs}
                  />
            </Dialog>        
      )}

      {/* Lista de reservas - agora mostra todas as reservas filtradas (sem filtrar por ativa) */}
      {reservasFiltradas.length > 0 ? (
        <div className={styles.listBooksReservation}>
          {reservasFiltradas.map((reserva) => (
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
          ))}
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
            {bibliotecario && reservas.length > 0 
              ? 'Nenhuma reserva encontrada com os filtros aplicados'
              : 'Nenhuma reserva encontrada'
            }
          </h1>
          <small>:'-(</small>
        </div>
      )}
      
      {bibliotecario && (
        <div className={styles.legendas}>
          <h2>Legendas</h2>
          <span>
            <p><i className="pi pi-times-circle"></i>: Cancelar Reserva</p>
            <p><i className="pi pi-check-circle"></i>: Titulo Retirado</p>
          </span>
          <div className={styles.divContainerBtnFiltrar}>
            <Button label="Filtrar" icon="pi pi-filter-fill" onClick={() => show('right')} className="p-button-success" style={{borderRadius:'16px'}}/>
          </div>
        </div>
      )}
    </div>
  </>);
}

export default withAuthenticationRequired(DetalhesReserva, {
  onRedirecting: () => (<Redirect/>)
});