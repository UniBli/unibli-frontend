// components
import CardBook from '../../components/CardBook/CardBook';
import { Link } from 'react-router-dom'
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';


// css scoped
import styles from './styles/ResultadoConsultarTitulos.module.css'


// hooks
import { useRef } from 'react';

import { useParams } from 'react-router-dom';

const ResultadoConsultarTitulos = ({ books }) => {

   //DataScroller
  const ds = useRef(null);

  const { titleBook } = useParams();


  let resultadoDaPesquisa = books.filter(book =>  book.nome.toLowerCase().includes(titleBook.toLowerCase()));

  //Cards
  const itemTemplate = (book) => {
    return (
        <Link key={book.id} to={`/reserveTitles/${book.id}`}>
          <CardBook disponibilidade={book.disponibilidade}
            qtd={book.qtd} img={book.img} nome={book.nome}
            />
        </Link>
    )}

    const footer = (<Button 
                      type="text" icon="pi pi-plus" label="Ver Mais" 
                      onClick={() => ds.current.load()}
                    />);
  

  return (
      <section className={styles.section_books}>
        <div id="div_booksID" className={styles.div_books}>
          <h2 >{resultadoDaPesquisa.length} livro(s) encontrado(s):</h2>
          {
            resultadoDaPesquisa.length === 0
              ?(
                <div className={styles.div_NotResults}>
                  <img src='../imgStatus/peopleSearch-bro.svg' alt='Ilustração de um detetive' />
                </div>
              )
              :(
                <div className={styles.div_results}>
                 <DataScroller ref={ds} value={resultadoDaPesquisa} itemTemplate={itemTemplate} rows={5} loader footer={footer} />
                </div>
              )         
          }
        </div>
      </section>
  )
}

export default ResultadoConsultarTitulos