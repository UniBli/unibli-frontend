import React, { useRef } from 'react';
import styles from './styles/CardReserva.module.css';
//import { useAuth0 } from '@auth0/auth0-react';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Badge } from 'primereact/badge';
import { useUser } from '../../context/UserContext';



const CardReserva = ({ reserva, formatDate, onReservaCancelada, origin, bibliotecario, onError, onReservaFinalizada }) => {
    //const { user } = useAuth0();
    const toast = useRef(null);
    const { finalizarReserva } = useUser();    

    const handleCancelarReserva = async () => {
        try {
            console.log('Cancelando reserva ID:', reserva.id_reserva);
            console.log('Origin:', origin);
            
            // Chama o endpoint de cancelar reserva usando a origin
            const response = await axios.delete(`${origin}/reservas/${reserva.id_reserva}/cancelar`);
            
            console.log('Resposta do cancelamento:', response.data);

            // Chama a função callback para atualizar a lista e mostrar sucesso
            if (onReservaCancelada) {
                onReservaCancelada(reserva.id_reserva);
            }

        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            
            const errorMessage = error.response?.data?.error || 'Erro ao cancelar reserva';
            
            // Chama a função de erro passada pelo pai
            if (onError) {
                onError(errorMessage);
            }
        }
    }

    const handleTituloFinalizada = async () => {
        try {
            console.log('Finalizando reserva ID:', reserva.id_reserva);
            
            // Chama a funcao do contexto para finalizar a reserva
            const response = await finalizarReserva(reserva.id_reserva);
            
            console.log('Resposta da finalizacao:', response);

            // Chama a funcao callback para atualizar a lista
            if (onReservaFinalizada) {
                onReservaFinalizada(reserva.id_reserva);
            }

            // Mostra toast de sucesso
            if (toast.current) {
                toast.current.show({
                    severity: 'success', 
                    summary: 'Sucesso', 
                    detail: 'Livro retirado com sucesso', 
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Erro ao finalizar reserva:', error);
            
            const errorMessage = error.response?.data?.error || 'Erro ao finalizar reserva';
            
            // Chama a funcao de erro passada pelo pai
            if (onError) {
                onError(errorMessage);
            }
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <div className={styles.cardReservaLeitor}>

                {!!bibliotecario && reserva.Livro?.titulo && (
                    <Badge 
                    style={{borderRadius:'16px', height:'auto'}} 
                    value={`ID do Livro: ${reserva.Livro?.id_livro}`} 
                    severity="success"
                    ></Badge>
                )}
                <span className={styles.spanLivro}>
                    <h2 title={reserva.Livro?.titulo || 'Nome não encontrado'}>
                        Livro: {reserva.Livro?.titulo || 'Nome não encontrado'}
                    </h2>
                </span>
                
                <span className={styles.spanReserva}>
                        <Badge 
                        style={{borderRadius:'16px', height:'auto'}} 
                        value={`ID da Reserva: ${reserva.id_reserva}`} 
                        severity="success"
                        ></Badge>
                    <p>
                        Reservado: {formatDate(reserva.dataDaReserva)}
                    </p>
                </span>
               
                <Badge 
                style={{borderRadius:'16px', height:'auto'}} 
                value={`Data de Expiração: ${reserva.dataExpiracao}`} 
                severity="success"
                ></Badge>

                <span className={styles.spanUnidadePolo}>
                    <p className={styles.unidadePolo}>
                        Unidade/Polo: {reserva.Fatec?.nome || 'Fatec não encontrada'}
                    </p>
                </span>
                
                {!!bibliotecario && (<>
                        <Badge 
                        style={{borderRadius:'16px', height:'auto'}} 
                        value={`RA: ${reserva.Usuario?.ra}`} 
                        severity="success"
                        ></Badge>
                        <Badge 
                        style={{borderRadius:'16px', height:'auto'}} 
                        value={`Nome: ${reserva.Usuario?.nome}`} 
                        severity="success"
                        ></Badge>
                </>)}                

                <span>
                    <button 
                        onClick={handleCancelarReserva} 
                        className={bibliotecario ? styles.btnCancelarReserva : ''}
                        title="Cancelar Reserva"
                    >
                        {/* Se não é bibliotecário então aparece o texto*/}
                        {!bibliotecario && (
                            <p>CANCELAR RESERVA</p>
                        )}
                        <i className="pi pi-times-circle"></i>
                    </button>
                    {bibliotecario ? (
                        <button 
                            onClick={handleTituloFinalizada} 
                            className={styles.btnTituloRetirado}
                            title="Marcar como finalizada"
                        >
                            <i className="pi pi-check-circle" style={{fontSize:'20px'}}></i>
                        </button>
                    ): ''}
                </span>
            </div>
        </>
    )
}

export default CardReserva;
