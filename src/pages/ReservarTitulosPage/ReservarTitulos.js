// src/pages/ReservarTitulosPage/ReservarTitulos.js

import CardBook from '../../components/CardBook/CardBook';
import ReservarTitulosLoading from './ReservarTitulosLoading.js';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { ToggleButton } from 'primereact/togglebutton';
import { Divider } from 'primereact/divider';
import { Avatar } from 'primereact/avatar';
import { SelectButton } from 'primereact/selectbutton';
import styles from './styles/ReservarTitulos.module.css';

// hooks
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const ReservarTitulos = () => {
    const { bookId } = useParams();
    const { isAuthenticated } = useAuth0();
    
    // Consumir isLoadingUser do contexto
    const { integrado, usuarioUnibliBd, serverOrigin, isLoadingUser } = useUser();
    const usuario = usuarioUnibliBd?.id_usuario;

    const [checked, setChecked] = useState(false);
    const toast = useRef(null);
    const [book, setBook] = useState(null); // Iniciar como null para clareza
    const [fatecs, setFatecs] = useState([]);
    const [loading, setLoading] = useState(true); // Loading para os dados do livro
    const [error, setError] = useState('');
    const [selectedFatecId, setSelectedFatecId] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(() => {
        if (!serverOrigin) return; // Espera a origin estar disponível

        const urlTitulo = `${serverOrigin}/acervo/livros/${bookId}`;
        const urlFatecs = `${serverOrigin}/fatecs?livroId=${bookId}`;
        
        setLoading(true);
        Promise.all([
            axios.get(urlTitulo),
            axios.get(urlFatecs)
        ])
        .then(([respBook, respFatecs]) => {
            setBook(respBook?.data?.livro || null);
            setFatecs(respFatecs?.data?.fatecs || []);
        }).catch((error) => {
            setError(error.message);
            setBook(null);
            setFatecs([]);
        }).finally(() => {
            setLoading(false);
        });
    }, [bookId, serverOrigin]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (toastMessage && toast.current) {
            toast.current.show(toastMessage);
            setToastMessage(null); 
        }
    }, [toastMessage]);

    const handleCheckedChange = (e) => {
        setChecked(e.value);
    };
    
    const handleReservation = async (e) => {
        e.preventDefault();
        
        if (!isAuthenticated) {
            setToastMessage({ severity: 'info', summary: 'Info', detail: 'Para efetuar a reserva é necessário fazer login!' });
            return;
        }

        // A verificação de isLoadingUser aqui previne cliques enquanto os dados do usuário carregam
        if (isLoadingUser) {
            setToastMessage({ severity: 'info', summary: 'Aguarde', detail: 'Verificando dados do usuário...' });
            return;
        }

        if (!integrado) {
            setToastMessage({ severity: 'warn', summary: 'Aviso', detail: 'Conclua seu cadastro para efetuar reservas!' });
            return;
        }

        if (!selectedFatecId) {
            setToastMessage({ severity: 'warn', summary: 'Aviso', detail: 'Selecione uma FATEC para efetuar a reserva!' });
            return;
        }

        try {
            const response = await axios.post(`${serverOrigin}/reservas/reservar`, {
                usuarioId: usuario,
                livroId: parseInt(bookId),
                fatecId: selectedFatecId
            });

            if (response.status === 200 || response.status === 201) {
                setToastMessage({ severity: 'success', summary: 'Sucesso', detail: 'Reserva efetuada com sucesso!' });
                setSelectedFatecId(null);
                setBook(prevBook => ({
                    ...prevBook,
                    disponibilidadeLivro: prevBook?.disponibilidadeLivro ? prevBook?.disponibilidadeLivro - 1 : prevBook?.quantidadeLivro - 1
                }));
            }
        } catch (error) {
            console.error('Erro ao efetuar reserva:', error);
            let errorMessage = error.response?.data?.error || 'Erro ao efetuar reserva!';
            setToastMessage({ severity: 'error', summary: 'Erro', detail: errorMessage });
        }
    };
    
    // O loading principal agora considera o carregamento do livro E do usuário
    if (loading || (isAuthenticated && isLoadingUser)) {
        return <ReservarTitulosLoading/>;
    } else {
        return (
            <>
                <Toast ref={toast} />
                <section className={styles.section_bookInformationReservation}>
                    {error && <p>{error}</p>}
                    {!book && !loading && <div className={styles.error}>Livro não encontrado.</div>}
                    {book && (
                        <>
                            <div className={styles.div_bookButton}>
                                <form onSubmit={handleReservation}>
                                    <div className={styles.book}>
                                        <CardBook 
                                            disponibilidade={book?.disponibilidadeLivro ?? book?.quantidadeLivro}
                                            qtd={book?.quantidadeLivro}
                                            img={book?.imagem}
                                            nome={book?.titulo}
                                            exibirAdds={false}
                                        />
                                    </div>
                                    <div className={styles.button}>
                                        <Button
                                            type="submit"
                                            // O ícone só aparece se autenticado E não integrado (e não carregando)
                                            icon={(isAuthenticated && !integrado) ? "pi pi-exclamation-triangle" : undefined}
                                            // O label muda dependendo do estado
                                            label={(!isAuthenticated || integrado) ? "RESERVAR" : ""}
                                            size="large"
                                            className={
                                                isAuthenticated 
                                                    ? !integrado 
                                                        ? styles.btnReservarNaoItegrado // Estilo para não integrado
                                                        : styles.btnReservar // Estilo para integrado
                                                    : styles.disabledButton // Estilo para não autenticado
                                            }
                                            // Desabilita se os dados do livro estiverem carregando
                                            disabled={loading} 
                                        />
                                    </div>
                                </form>
                            </div>
                            <div className={styles.div_informationsBook}>
                                <div className={styles.div_resume}>
                                    <h1>{book.titulo}</h1>
                                    <h2>Resumo</h2>
                                    <div className={styles.div_resumeTxt} style={checked ? { 'height': '15rem', overflowY:'auto' } : { 'height': '6em' }}>
                                        <p className={styles.descricaoLivro}>{book.descricao}</p>
                                        <p className={styles.moreDescription} style={checked ? { 'display': 'none' } : { 'display': 'flex' }}>...</p>
                                    </div>
                                    <ToggleButton offLabel="Ler mais" offIcon="pi pi-angle-down" onLabel="Ler menos" onIcon="pi pi-angle-up" checked={checked} onChange={handleCheckedChange} />
                                    <Divider type="solid" />
                                </div>
                                <div className={styles.div_details}>
                                    {book.quantidadePaginas && (<div className={styles.qtdPaginas}><p>Número de páginas</p><i className="pi pi-book"></i><p>{book.quantidadePaginas}</p></div>)}
                                    {book.idioma && (<div className={styles.idioma}><p>Idioma</p><i className="pi pi-globe"></i><p>{book.idioma}</p></div>)}
                                    {book.editora && (<div className={styles.editora}><p>Editora</p><i className="pi pi-building"></i><p>{book.editora}</p></div>)}
                                    {book.edicao && (<div className={styles.edicao}><p>Edição</p><i className="pi pi-hashtag"></i><p>{book.edicao}</p></div>)}
                                    {book.genero && (<div className={styles.genero}><p>Gênero</p><i className="pi pi-tag"></i><p>{book.genero}</p></div>)}
                                    {(book.isbn10 || book.isbn13) && (<div className={styles.isbn}><p>{book.isbn10 && book.isbn13 ? "ISBN-10/ISBN-13" : book.isbn10 ? "ISBN-10" : "ISBN-13"}</p><i className="pi pi-barcode" style={{color:'#000'}}></i>{book.isbn10 && book.isbn13 ? (<><p>{book.isbn10}</p><p>{book.isbn13}</p></>) : book.isbn10 ? (<p>{book.isbn10}</p>) : (<p>{book.isbn13}</p>)}</div>)}
                                </div>
                                <div className={styles.div_autor}>
                                    <h2>Autora(s)/Autor(es)</h2>        
                                    <div className={styles.autorInformation}>
                                        <div className={styles.div_autorIcon}>
                                            {book.autor?.split(',').map((autor,i) => {
                                                const randomLightColor = () => `rgb(${Math.floor(120 + Math.random() * 135)}, ${Math.floor(120 + Math.random() * 135)}, ${Math.floor(120 + Math.random() * 135)})`;
                                                return (<Avatar key={`${autor}_${i}`} className={styles.div_autorProfile} style={{backgroundColor:randomLightColor(), color: '#ffffff'}} icon="pi pi-user" size="xlarge" shape="circle" />);
                                            })}
                                        </div>
                                        <div className={styles.div_autorProfileTxt}>
                                            {book.autor?.split(',').map((autor, i, arr ) => (<p key={i}>{autor.trim()}{i < arr.length - 1 && ','}</p>))}
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.div_ondeEncontrar}>
                                    <h2>Onde encontrar</h2>
                                    <div className={styles.div_fatecs}>
                                        <SelectButton value={fatecs.find(fatec => fatec.id_fatec === selectedFatecId)} onChange={(e) => setSelectedFatecId(e.value?.id_fatec)} optionLabel="nome" options={fatecs} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </section>
            </>
        );
    }
}

export default ReservarTitulos;