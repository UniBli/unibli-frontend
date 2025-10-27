// components
import CardBook from '../../components/CardBook/CardBook';
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import FiltroLivro from '../../components/FiltroLivro/FiltroLivro'
import { ScrollTop } from 'primereact/scrolltop';

// css scoped
import styles from './styles/ResultadoConsultarTitulos.module.css'

// Import Swiper React components
//import { Skeleton } from 'primereact/skeleton';

// hooks
import { useRef } from 'react';

import { useEffect, useState } from 'react';

import axios from 'axios';


const ResultadoConsultarTitulos = ({origin}) => {

  //DataScroller
  const ds = useRef(null);

  const navigate = useNavigate();
  const [ searchParams ] = useSearchParams();


  const [books, setBooks] = useState([])
  
  const [fatecs, setFatecs] = useState([])
  const [cursos, setCursos] = useState([])
  const [autores, setAutores] = useState([])  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')


  const urlTitulos = `${origin}/acervo/livros?${searchParams}`
  const urlFatecs = `${origin}/fatecs`
  const urlCursos = `${origin}/cursos`
  


  useEffect(() => {
    setLoading(true);

    // Faz todas as requisições ao mesmo tempo
    Promise.all([
      axios.get(urlTitulos),
      axios.get(urlFatecs),
      axios.get(urlCursos)
    ])
      .then(([respBooks, respFatecs, respCursos]) => {
        // Popula os estados
        setBooks(respBooks.data || []);
        setFatecs(respFatecs.data.fatecs || []);
        setCursos(respCursos.data || []);

        // Extrai os autores únicos dos livros
        const autoresUnicos = [
          ...new Set(
            (respBooks.data || [])
              .map((book) => book.autor)
              .filter((autor) => !!autor) // ignora nulos/undefined
          )
        ];
        setAutores(autoresUnicos);
      })
      .catch((error) => {
        console.error("Erro ao buscar dados:", error);
        setError("Erro ao buscar dados do servidor.");
        setBooks([]);
        setFatecs([]);
        setCursos([]);
        setAutores([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [urlTitulos, urlFatecs, urlCursos]);

   const voltar = () => {
    navigate('/acervo/consultar'); // Volta para a página sem filtros
  };

  //Cards
  const itemTemplate = (book) => {
    return (
        <Link key={book?.id_livro} to={`/reservar/livro/${book?.id_livro}`}>
          <CardBook 
            disponibilidade={book?.disponibilidadeLivro ? book?.disponibilidadeLivro : book?.quantidadeLivro}
            qtd={book?.quantidadeLivro}
            img={book?.imagem}
            nome={book?.titulo}
          />
        </Link>
    )}

    const footer = (
        <Button 
          type="text" icon="pi pi-plus" label="Ver Mais" 
          onClick={() => ds.current.load()}
        />
      );

      
  return (
      <section className={styles.section_books}>
        <div id="div_booksID" className={styles.div_books}>
        {
          error 
            ? (<p>{error.message}</p>)
            : loading
                ?(<>
                  <h2>Buscando livro(s) ...</h2>
                  <div 
                    style={{
                        display:'flex', justifyContent:'start', 
                        alignItems:'center', flexDirection:'column-reverse', 
                        height:'90vh', paddingTop:'20vh'
                    }}
                  >
                    <ProgressSpinner 
                      style={{
                        width: '100px', 
                        height: '100px', 
                        display:'flex'
                      }} 
                      strokeWidth="4" 
                    />  
                  </div>

                  </>
                )
                : ( 
                  <>
                    <div style={{ 
                        display: 'flex', 
                        justifyItems:'center',
                        alignItems: 'center',
                        marginBottom: '20px',
                        flexWrap:'wrap',
                        gap:'20px'
                    }}>
                      {books.length === 0 && (
                            <Button 
                              title='Voltar'
                              style={{
                                backgroundColor:'#055904',
                                color:'#FFF', 
                                border:'0px', 
                                marginLeft:'30px',
                                width:'50px',
                                height:'50px',
                                borderRadius:'50%'
                              }}    
                              icon="pi pi-arrow-left" 
                              aria-label="Filter" 
                              onClick={voltar}
                            />
                        )}
                      <h2 style={{ 
                        width:'50%',
                        height:'50px',
                        padding:'0px 20px'
                    }}>
                        {books.length} livro(s) encontrado(s):
                    </h2>
                    </div>
                    <ScrollTop />

                    {
                      Array.isArray(books) && books.length === 0
                        ?(
                          <div className={styles.div_NotResults}>
                            <img src='../imgStatus/peopleSearch-bro.svg' alt='Ilustração de um detetive' />
                          </div>
                        )
                        :(
                          <div 
                            className={styles.div_results}
                          >
                            <FiltroLivro cursos={cursos} autores={autores} fatecs={fatecs} />

                          
                            <DataScroller 
                              className={styles.dataScrollerUniBli}
                              ref={ds} 
                              value={books} 
                              itemTemplate={itemTemplate} 
                              rows={5} 
                              loader 
                              footer={footer} 
                            />
                          </div>
                        )         
                    }
                  </>
                  )
        }
        </div>
      </section>
  )
}

export default ResultadoConsultarTitulos