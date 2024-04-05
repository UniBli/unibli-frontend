import CardBook from '../../components/CardBook/CardBook';
import ReservarTitulosLoading from './ReservarTitulosLoading.js'

import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Divider } from 'primereact/divider';


import styles from './styles/ReservarTitulos.module.css';

// hooks
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';

import axios from 'axios';

const ReservarTitulos = () => {
    
    const { bookId } = useParams();
    const { isAuthenticated } = useAuth0();
    const [checked, setChecked] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const toast = useRef(null);

    
    /********************************************************************** */
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const origin = process.env.REACT_APP_UNIBLI_SERVER_HTTP;
                const URL = `${origin}/teste/fetec1/acervo/${bookId}`;

                const response = await axios.get(URL);
                setBooks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar livros:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [ bookId ]);
    /********************************************************************** */

    // Para a página sempre recarregar mostrando o topo primeiro
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Função para lidar com a mudança do estado de checked
    const handleCheckedChange = (e) => {
        setChecked(e.value);
    };
    
    const handleReservation = (e) => {
        e.preventDefault();
        if (isAuthenticated && !toastVisible) {
            toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Reserva efetuada!' });
            setToastVisible(true);
            setTimeout(() => {
                setToastVisible(false);
            }, 3000); // Tempo em milissegundos para ocultar o toast
        } else if (!isAuthenticated && !toastVisible) {
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'Para efetuar a reserva é necessário fazer login!' });
            setToastVisible(true);
            setTimeout(() => {
                setToastVisible(false);
            }, 3000); // Tempo em milissegundos para ocultar o toast
        }
    };
    
    if(loading){
        return(
            <ReservarTitulosLoading/>
        )
    } else {
        const { 
            imageLinks: srcImg, 
            quantidadeLivros: qtd,
            quantidadeDisponivel: disponibilidade,
            titulo: nome,
            descricao
        } = books ?? {};

        return (
            <>
            <section className={styles.section_bookInformationReservation}>

                <div className={styles.div_bookButton}>
                    <form onSubmit={handleReservation}>
                        <div className={styles.book}>
                            <CardBook disponibilidade={disponibilidade}
                                qtd={qtd}
                                img={srcImg} nome={nome}
                                />
                        </div>

                        <Toast ref={toast} onClose={() => setToastVisible(false)} />           
                        <div className={styles.button}>
                                <Button
                                    type="submit"
                                    label="RESERVAR"
                                    size="large"
                                    className={!isAuthenticated && styles.disabledButton}
                                />
                            </div>
                    </form>
                </div>

                <div className={styles.div_informationsBook}>
                    <div className={styles.div_resume}>
                        <h1>{nome}</h1>
                        
                        <h2>Resumo</h2>
                        <div className={styles.div_resumeTxt} style={checked ? { 'height': 'fit-content' } : { 'height': '6em' }}>
                                <p className={styles.descricaoLivro}> 
                                    {descricao}. Lorem ipsum dolor, sit amet consectetur adipisicing elit. Excepturi vel tempora sint assumenda vero sit cupiditate? Quidem ratione nesciunt ad natusdasdasd neqweqwisi nihilasdasd Praesentium voluptas fugiat cumque ipdasdasdasdsasum autem quis!fsdfsd
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

                            checked={checked} onChange={handleCheckedChange} />

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
            </>
        );
    }
}

export default ReservarTitulos;
