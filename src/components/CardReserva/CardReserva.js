import React, { useRef } from 'react';
import styles from './styles/CardReserva.module.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Toast } from 'primereact/toast';
import axios from 'axios';

const CardReserva = ({ reserva, formatDate, onReservaCancelada, origin, bibliotecario }) => {
    const { user } = useAuth0();
    const toast = useRef(null);

    const handleCancelarReserva = async () => {
        try {
            console.log('Cancelando reserva ID:', reserva.id_reserva);
            console.log('Origin:', origin);
            
            // Chama o endpoint de cancelar reserva usando a origin
            const response = await axios.delete(`${origin}/reservas/${reserva.id_reserva}/cancelar`);
            
            console.log('Resposta do cancelamento:', response.data);

            toast.current.show({
                severity: 'success', 
                summary: 'Sucesso', 
                detail: 'Reserva cancelada com sucesso!', 
                life: 3000
            });

            // Chama a função callback para atualizar a lista
            if (onReservaCancelada) {
                onReservaCancelada(reserva.id_reserva);
            }

        } catch (error) {
            console.error('Erro ao cancelar reserva:', error);
            
            const errorMessage = error.response?.data?.error || 'Erro ao cancelar reserva';
            
            toast.current.show({
                severity: 'error', 
                summary: 'Erro', 
                detail: errorMessage, 
                life: 5000
            });
        }
    }

    const handleTituloRetirado = () => {
        toast.current.show({
            severity: 'success', 
            summary: 'Sucesso', 
            detail: 'Livro retirado com sucesso', 
            life: 3000
        });
    }

    return (
        <>
            <Toast ref={toast} />
            <div className={styles.cardReservaLeitor}>
                <h2>Livro: {reserva.Livro?.titulo || 'Nome não encontrado'}</h2>
                <p>Reservado: {formatDate(reserva.dataDaReserva)}</p>
                <p>Unidade/Polo: {reserva.Fatec?.nome || 'Fatec não encontrada'}</p>
                <p>ID da Reserva: {reserva.id_reserva}</p>
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
                            onClick={handleTituloRetirado} 
                            className={styles.btnTituloRetirado}
                            title="Marcar como retirado"
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