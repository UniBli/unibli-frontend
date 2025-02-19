// components
import CardBook from '../../components/CardBook/CardBook';
import { Link, useSearchParams } from 'react-router-dom'
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';


// css scoped
import styles from './styles/ResultadoConsultarTitulos.module.css'


// hooks
import { useRef } from 'react';

import { useEffect, useState } from 'react';

import axios from 'axios';


const ResultadoConsultarTitulos = ({origin}) => {

   //DataScroller
  const ds = useRef(null);

  const [ searchParams ] = useSearchParams();

  const [books, setBooks] = useState('')

  const url = `${origin}/unibli/acervo?${searchParams}`
  console.log('url',url)
  console.log('searchParams', searchParams)


  useEffect(()=>{
    axios.get(url)
    .then((resp) => {
      console.log('resp.data', resp.data)
      setBooks(resp.data)
    }).catch((error) => {
      console.error( error);
    });
  },[url])


  //Cards
  const itemTemplate = (book) => {
    return (
        <Link key={book.id} to={`/reserveTitles/${book.id || book._id}`}>
          <CardBook 
            disponibilidade={book.quantidadeDisponivel ?? 1}
            qtd={(book.quantidadeLivros || book.quantidade_livro) ?? 1} 
            img={(book?.imageLinks || book?.image_link)} nome={book.titulo}
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
          <h2 >{books.length} livro(s) encontrado(s):</h2>
          {
            books.length === 0
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
        </div>
      </section>
  )
}

export default ResultadoConsultarTitulos