import CardBook from '../../components/CardBook/CardBook';
import ReservarTitulosLoading from './ReservarTitulosLoading.js'

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

import axios from 'axios';

const ReservarTitulos = ({origin, integrado, usuario}) => {
    
    const { bookId } = useParams();
    const { isAuthenticated } = useAuth0();
    const [checked, setChecked] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const toast = useRef(null);

    const [book, setBook] = useState([])
    const [fatecs, setFatecs] = useState([])

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const urlTitulo = `${origin}/acervo/livros/${bookId}`
    const urlFatecs = `${origin}/fatecs?livroId=${bookId}`

    const [selectedFatecId, setSelectedFatecId] = useState(null);
    
    // Novo state para controlar as mensagens do toast
    const [toastMessage, setToastMessage] = useState(null);

    useEffect(()=>{
        setLoading(true)

        Promise.all([
            axios.get(urlTitulo),
            axios.get(urlFatecs)
        ])
        .then(([respBook, respFatecs]) => {
        // Popula os estados
            setBook(respBook?.data?.livro || []);
            setFatecs(respFatecs?.data?.fatecs || []);
            setLoading(false)
        }).catch((error) => {
            setError(error.message);
            setBook([]);
            setFatecs([]);
            setLoading(false);    
        });
       

      },[urlTitulo, urlFatecs])  

    // Para a página sempre recarregar mostrando o topo primeiro
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // useEffect para mostrar toast quando houver mensagem
    useEffect(() => {
        if (toastMessage && toast.current) {
            toast.current.show(toastMessage);
            setToastVisible(true);
            setTimeout(() => {
                setToastVisible(false);
                setToastMessage(null);
            }, 3000);
        }
    }, [toastMessage]);

    // Função para lidar com a mudança do estado de checked
    const handleCheckedChange = (e) => {
        setChecked(e.value);
    };
    
    const handleReservation = async (e) => {
        e.preventDefault();
        
        if (isAuthenticated && !toastVisible) {
            if(integrado){
                // Verifica se uma FATEC foi selecionada
                if (!selectedFatecId) {
                    setToastMessage({ 
                        severity: 'warn', 
                        summary: 'Aviso', 
                        detail: 'Selecione uma FATEC para efetuar a reserva!' 
                    });
                    return;
                }

                try {
                    setLoading(true);
                    
                    // Faz a requisição POST para criar a reserva
                    const response = await axios.post(`${origin}/reservas/reservar`, {
                        usuarioId: usuario,
                        livroId: parseInt(bookId),
                        fatecId: selectedFatecId
                    });

                    // Se a requisição foi bem sucedida
                    if (response.status === 200 || response.status === 201) {
                        setToastMessage({ 
                            severity: 'success', 
                            summary: 'Sucesso', 
                            detail: 'Reserva efetuada com sucesso!' 
                        });
                        setSelectedFatecId(null);
                        // ATUALIZA A DISPONIBILIDADE DO LIVRO
                        setBook(prevBook => ({
                            ...prevBook,
                            disponibilidadeLivro: prevBook.disponibilidadeLivro - 1
                        }));
                    }

                } catch (error) {
                    console.error('Erro ao efetuar reserva:', error);
                    
                    let errorMessage = 'Erro ao efetuar reserva!';
                    
                    if (error.response) {
                        if (error.response.status === 400) {
                            errorMessage = 'Dados inválidos para reserva!';
                        } else if (error.response.status === 409) {
                            errorMessage = 'Reserva já existente ou conflito!';
                        } else if (error.response.status === 500) {
                            errorMessage = 'Erro interno do servidor!';
                        }
                    }
                    
                    setToastMessage({ 
                        severity: 'error', 
                        summary: 'Erro', 
                        detail: errorMessage 
                    });
                } finally {
                    setLoading(false);
                }

            } else if(!integrado){
                setToastMessage({ 
                    severity: 'warn', 
                    summary: 'Aviso', 
                    detail: 'Conclua seu cadastro para efetuar reservas!' 
                });
            }
        
        } else if (!isAuthenticated && !toastVisible) {
            setToastMessage({ 
                severity: 'info', 
                summary: 'Info', 
                detail: 'Para efetuar a reserva é necessário fazer login!' 
            });
        }
    };

    
    if(loading){
        return(
            <ReservarTitulosLoading/>
        )
    } else {
        return (
            <>
            {/* Toast movido para fora de qualquer formulário */}
            <Toast ref={toast} />
            
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
                                    disabled={loading} // Desabilita durante o loading
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

                        {book?.quantidadePaginas && (
                            <div className={styles.qtdPaginas}>
                                <p>Número de páginas</p>
                                <i className="pi pi-book"></i>
                                <p>{book?.quantidadePaginas}</p>
                            </div>
                        )}

                        {book?.idioma && (
                            <div className={styles.idioma}>
                                <p>Idioma</p>
                                <i className="pi pi-globe"></i>
                                <p>{book?.idioma}</p>
                            </div>
                        )}

                        {book?.editora && (
                            <div className={styles.editora}>
                                <p>Editora</p>
                                <i className="pi pi-building"></i>
                                <p>{book?.editora}</p>
                            </div>
                        )}

                        {book?.edicao && (
                            <div className={styles.edicao}>
                                <p>Edição</p>
                                <i className="pi pi-hashtag"></i>
                                <p>{book?.edicao}</p>
                            </div>
                        )}

                        {book?.genero && (
                            <div className={styles.genero}>
                                <p>Gênero</p>
                                <i className="pi pi-tag"></i>
                                <p>{book?.genero}</p>
                            </div>
                        )}
    
                        {(book?.isbn10 || book?.isbn13) && (
                            <div className={styles.isbn}>
                                <p>
                                {book?.isbn10 && book?.isbn13
                                    ? "ISBN-10/ISBN-13"
                                    : book?.isbn10
                                        ? "ISBN-10"
                                        : "ISBN-13"}
                                </p>
                                <i className="pi pi-barcode" style={{color:'#000'}}></i>
                                {book?.isbn10 && book?.isbn13
                                    ? (<>
                                    <p>{book?.isbn10}</p>
                                    <p>{book?.isbn13}</p>
                                    </>)
                                    : book?.isbn10
                                        ? (<p>{book?.isbn10}</p>)
                                        : (<p>{book?.isbn13}</p>)
                                }
                            </div>
                        )}


                    </div>
                    <div className={styles.div_autor}>
                        <h2>Autora(s)/Autor(es)</h2>        
                        <div className={styles.autorInformation}>
                            <div className={styles.div_autorIcon}>
                                {book?.autor?.split(',').map((autor,i) => {
                                    const randomLightColor = () => {
                                        const r = Math.floor(120 + Math.random() * 135); // de 120 a 255
                                        const g = Math.floor(120 + Math.random() * 135);
                                        const b = Math.floor(120 + Math.random() * 135);
                                        return `rgb(${r}, ${g}, ${b})`;
                                    };


                                    return (
                                        <Avatar 
                                            key={`${autor}_${i}`}
                                            className={styles.div_autorProfile}
                                            style={{
                                                backgroundColor:randomLightColor(),
                                                color: '#ffffff'
                                            }}
                                            icon="pi pi-user" 
                                            size="xlarge" 
                                            shape="circle" />
                        
                                    )
                                })}
                            </div>
                            <div className={styles.div_autorProfileTxt}>
                                {book?.autor?.split(',').map((autor, i, arr ) => (
                                    <p key={i}>
                                        {autor.trim()}{i < arr.length - 1 && ','}
                                    </p>
                                ))}
                            </div>
                            

                        </div>
                    </div>

                    <div className={styles.div_ondeEncontrar}>
                        <h2>Onde encontrar</h2>
                        <div className={styles.div_fatecs}>
                            <SelectButton
                                value={fatecs.find(fatec => fatec.id_fatec === selectedFatecId)}
                                onChange={(e) => setSelectedFatecId(e.value.id_fatec)}
                                optionLabel="nome"
                                options={fatecs}
                            />
                        </div>

                    </div>
                </div>

            </section>
            </>
        );
    }
}

export default ReservarTitulos;