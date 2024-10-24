import React, { useRef } from 'react';

import styles from './styles/CardReservaLeitor.module.css';

import { useAuth0 } from '@auth0/auth0-react';
import { useState } from 'react';

import { Toast } from 'primereact/toast';

const CardReservaLeitor = ({book}) => {
    const {user} = useAuth0();
    const toast = useRef(null);

    //Só para testar ---------------------
    // locale será substituida pela flag de bibliotecário
    user.locale = true;
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      };
      const [date] = useState(formatDate(new Date()));
    //------------------------------------

    const handleCancelarReserva = () => {
        toast.current.show({severity:'warn', summary: 'Aviso', detail:'A sua reserva foi cancelada com sucesso!', life: 12000000});

    }

    const handleTituloRetirado = () => {
        toast.current.show({severity:'success', summary: 'Sucesso', detail:'Livro retirado com sucesso', life: 1000});

    }

    return (
        <>
            <Toast ref={toast} />
            <div className={styles.cardReservaLeitor}>
                <h2>Livro: {book.nome}</h2>
                <p>Reservado: {date}</p>
                <p>Unidade/Polo: FatecA</p>
                <span>
                    <button onClick={handleCancelarReserva} className={user.locale && styles.btnCancelarReserva}>
                    {/* Se não é bibliotecário então aparece*/}
                    {!user.locale && (
                        <p>CANCELAR RESEVA</p>
                    )}
                        <i className="pi pi-times-circle"></i>
                    </button>
                    {user.locale && (
                        <button onClick={handleTituloRetirado} className={styles.btnTituloRetirado}>
                            <i className="pi pi-check-circle"></i>
                        </button>
                    )}
                </span>
            </div>
        </>
    )
}


export default  CardReservaLeitor;