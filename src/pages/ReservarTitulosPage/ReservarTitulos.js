import CardBook from '../../components/CardBook/CardBook';

import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Divider } from 'primereact/divider';


import styles from './ReservarTitulos.module.css';


// hooks
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';

const ReservarTitulos = ({ books }) => {

    const { isAuthenticated } = useAuth0();

    const [checked, setChecked] = useState(false);
    console.log('checked', checked)

    const toast = useRef(null);
    // Não está logado
    const showMessageInfoReservation = (e) => {
        if (!isAuthenticated) {
            e.preventDefault();
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'Para efetuar a reserva é necessário fazer login!', life: 2500 });
        }
    }
    // Está logado
    const handleReservation = (e) => {
        if (isAuthenticated) {
            e.preventDefault();
            toast.current.show({severity:'success', summary: 'Sucesso', detail:'Reserva efetuada!', life: 2500});
        }
    }

    const { bookId } = useParams();
    const currentBook = books.find(book => parseInt(book.id) === parseInt(bookId));

    const { img: srcImg } = currentBook;//desestruturando objeto
    
    // Para a página sempre recarregar mostrando o topo primeiro
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
    return (
        <section className={styles.section_bookInformationReservation}>

            <div className={styles.div_bookButton}>
                <form onSubmit={handleReservation}>
                    <div className={styles.book}>
                        <CardBook disponibilidade={currentBook.disponibilidade}
                            qtd={currentBook.qtd}
                            img={srcImg} nome={currentBook.nome}
                        />
                    </div>

                    <Toast ref={toast} />
                    <div onClick={showMessageInfoReservation} className={styles.button}>
                        <Button onClick={handleReservation} label="RESERVAR" size="large"
                            disabled={!isAuthenticated && 'disabled'}
                        />
                    </div>
                </form>
            </div>

            <div className={styles.div_informationsBook}>
                <div className={styles.div_resume}>
                    <h1>{currentBook.nome}</h1>
                    <h2>Resumo</h2>
                    <div className={styles.div_resumeTxt} style={checked ? { 'height': 'fit-content' } : { 'height': '6em' }}>
                        <p className={styles.descricaoLivro}>
                            dasdasd Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi vel tempora sint assumenda vero sit cupiditate? Quidem ratione nesciunt ad natusdasdasd neqweqwisi nihilasdasd Praesentium voluptas fugiat cumque ipdasdasdasdsasum autem quis!fsdfsd
                            Harum rerum repellat quod velit nulla, omnis repellendus ratione animi error optio perferendis. Rerum rem facere dolores nostrum doloribus eligendi, perferendis praesentium voluptatum in recusandae officiis quasi sequi aliquam ex.
                            Quos debitis soluta nam, quisquam saepe voluptates tenetur deleniti assumenda ullam cum. Commodi quod voluptatibus laboriosam accusantium, molestias ad ipsum ex unde, optio alias ipsam maxime dolores, saepe ab minima?
                        </p>
                        <p className={styles.moreDescription}
                            style={checked ? { 'display': 'none' } : { 'display': 'flex' }}>...</p>
                    </div>
                    <ToggleButton
                        offLabel="Ler mais"
                        offIcon="pi pi-angle-down"

                        onLabel="Ler menos"
                        onIcon="pi pi-angle-up"

                        checked={checked} onChange={(e) => setChecked(e.value)} />

                    <Divider type="solid" />
                </div>
                <div className={styles.div_details}>
                </div>
                <div className={styles.div_autor}>
                    <h2>Autora(s)/Autor(es)</h2>
                </div>
                <div className={styles.div_ondeEncontrar}>
                    <h2>Onde encontrar</h2>
                </div>
            </div>

        </section>
    )
}

export default ReservarTitulos