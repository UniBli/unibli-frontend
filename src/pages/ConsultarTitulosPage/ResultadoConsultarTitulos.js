// components
import CardBook from '../../components/CardBook/CardBook';
import { Link, useSearchParams } from 'react-router-dom'
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';


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

  const [ searchParams ] = useSearchParams();

  const [books, setBooks] = useState('')

  const url = `${origin}/acervo/livros?${searchParams}`
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')



  useEffect(()=>{
    setLoading(true)
    axios.get(url)
    .then((resp) => {
      setBooks(resp.data)
      setLoading(false)
    }).catch((error) => {
      console.error('Deu erro (error):', error);
      setError(error);
      setBooks([]); // Defina como array vazio em caso de erro
      setLoading(false);
    });
  },[url])


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
  



  //  /****************** PARA LOADING DO BOOOK ******************/
  //     const booksLoading =[
  //       {id:1, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
  //       {id:2, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
  //       {id:3, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
     
  //     ]
  
  //     const divSkeleton = {display:'flex', justifyContent:'center', alignItems:'center', margin:'3rem'};
  //     /*********************************************************/    


      
  return (
      <section className={styles.section_books}>
        <div id="div_booksID" className={styles.div_books}>
        {
          error 
            ? (<p>{error.message}</p>)
            : loading
                ?(<>
                  <h2>Buscando livro(s) ...</h2>
                  <div style={{display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column-reverse', height:'90vh', paddingTop:'20vh'}}>
                   
                        <ProgressSpinner style={{width: '100px', height: '100px', display:'flex',}} strokeWidth="4" />  
                    {/* <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'row', flexWrap:'wrap'}}>
                      {
                        booksLoading?.map((book) => (
                          <div key={book?.id} style={divSkeleton}>
                            {book?.component}
                          </div>
                      ))
                      }
                    </div> */}
                  </div>

                  </>
                )
                : ( 
                  <>
                    <h2 >{books.length} livro(s) encontrado(s):</h2>
                    {
                      Array.isArray(books) && books.length === 0
                        ?(
                          <div className={styles.div_NotResults}>
                            <img src='../imgStatus/peopleSearch-bro.svg' alt='Ilustração de um detetive' />
                          </div>
                        )
                        :(
                          <div className={styles.div_results}>
                          <DataScroller ref={ds} value={books} itemTemplate={itemTemplate} rows={5} loader footer={footer} />
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