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

// custom hook
//import { useFetch } from '../../hooks/useFetch';  


const ReservarTitulos = ({origin, integrado}) => {
    
    const { bookId } = useParams();
    const { isAuthenticated } = useAuth0();
    const [checked, setChecked] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const toast = useRef(null);

    const [book, setBook] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(()=>{
        setLoading(true)
        axios.get(`${origin}/acervo/livro/${bookId}`)
        .then((resp) => {
          setBook(resp?.data?.livro)
          setLoading(false)
        }).catch((error) => {
            //console.error('Deu erro (error):', error);
            setError(error);
            setBook([]); // Defina como array vazio em caso de erro
            setLoading(false);    
        });
      },[origin, bookId])  
    
    // Para a página sempre recarregar mostrando o topo primeiro
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    console.log('book', book);

    // Função para lidar com a mudança do estado de checked
    const handleCheckedChange = (e) => {
        setChecked(e.value);
    };
    
    const handleReservation = (e) => {
        e.preventDefault();
        if (isAuthenticated && !toastVisible) {
            if(integrado){
                toast.current.show({ severity: 'success', summary: 'Sucesso', detail: 'Reserva efetuada!' });
                setToastVisible(true);
                setTimeout(() => {
                    setToastVisible(false);
                }, 3000); // Tempo em milissegundos para ocultar o toast
            }else if(!integrado){
                toast.current.show({ severity: 'warn', summary: 'Aviso', detail: 'Conclua seu cadastro para efetuar reservas!' });
                setToastVisible(true);
                setTimeout(() => {
                    setToastVisible(false);
                }, 3000); // Tempo em milissegundos para ocultar o toast
            }
           
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
        return (
            <>
            <section className={styles.section_bookInformationReservation}>
                {error && <p>{error}</p>}
                <div className={styles.div_bookButton}>
                    <form onSubmit={handleReservation}>
                        <div className={styles.book}>
                            <CardBook 
                                disponibilidade={book?.disponibilidadeLivro ? book?.disponibilidadeLivro : book?.quantidadeLivro}
                                
                                qtd={book?.quantidadeLivro}
                                img={book?.imagem}
                                nome={book?.titulo}
                                exibirAdds={false}
                            />
                        </div>

                        <Toast ref={toast} onClose={() => setToastVisible(false)} />           
                        <div className={styles.button}>
                                <Button
                                    type="submit"
                                    icon={(isAuthenticated && !integrado) && "pi pi-exclamation-triangle"}
                                    label={     
                                        ((!isAuthenticated) || (isAuthenticated && integrado)) 
                                         && "RESERVAR"
                                    }
                                    size="large"
                                    className={
                                        isAuthenticated 
                                            ? !integrado 
                                                ? styles.btnReservarNaoItegrado // NÃO integrado 
                                                : styles.btnReservar // Integrado
                                            :  styles.disabledButton //precisa logar primeiro
                                    }
                                />
                            </div>
                    </form>
                </div>

                <div className={styles.div_informationsBook}>
                    <div className={styles.div_resume}>
                        <h1>{book?.titulo}</h1>
                        
                        <h2>Resumo</h2>
                        <div className={styles.div_resumeTxt} style={checked ? { 'height': '15rem', overflowY:'auto' } : { 'height': '6em' }}>
                                <p className={styles.descricaoLivro}> 
                                    {book?.descricao}
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
                        <ul>

                            {book?.edicao && (<li>Edição: {book?.edicao}</li>)}
                            {book?.editora && (<li>Editora: {book?.editora}</li>)}
                            {book?.genero && (<li>Gênero: {book?.genero}</li>)}
                            {book?.idioma && (<li>Idioma: {book?.idioma}</li>)}
                            {book?.isbn10 && (<li>ISBN10: {book?.isbn10}</li>)}
                            {book?.isbn13 && (<li>ISBN13: {book?.isbn13}</li>)}
                            {book?.quantidadePaginas && (<li>Nº de Páginas: {book?.quantidadePaginas}</li>)}
                        </ul>
                    </div>
                    <div className={styles.div_autor}>
                        <h2>Autora(s)/Autor(es)</h2>
                        <p>{book?.autor}</p>
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
