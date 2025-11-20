import CardBook from '../../components/CardBook/CardBook';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { DataScroller } from 'primereact/datascroller';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import FiltroLivro from '../../components/FiltroLivro/FiltroLivro';
import { ScrollTop } from 'primereact/scrolltop';
import styles from './styles/ResultadoConsultarTitulos.module.css';
import { useRef, useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext'; // 1. Importar o hook
import axios from 'axios';

// 2. Remover a prop 'origin'
const ResultadoConsultarTitulos = () => {
  // 3. Consumir a 'serverOrigin' do contexto
  const { serverOrigin } = useUser();

  const ds = useRef(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [fatecs, setFatecs] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!serverOrigin) return; // Não faz nada se a origin ainda não foi carregada

    const urlTitulos = `${serverOrigin}/acervo/livros?${searchParams}`;
    const urlFatecs = `${serverOrigin}/fatecs`;
    const urlCursos = `${serverOrigin}/cursos`;
    const urlAutores = `${serverOrigin}/acervo/livros/autores`;

    setLoading(true);
    Promise.all([
      axios.get(urlTitulos),
      axios.get(urlFatecs),
      axios.get(urlCursos),
      axios.get(urlAutores)
    ])
    .then(([respBooks, respFatecs, respCursos, respAutores]) => {
      setBooks(respBooks.data || []);
      setFatecs(respFatecs.data.fatecs || []);
      setCursos(respCursos.data || []);
      setAutores(respAutores.data || []);
    })
    .catch((error) => {
      console.error("Erro ao buscar dados:", error);
      setError("Erro ao buscar dados do servidor.");
    })
    .finally(() => {
      setLoading(false);
    });
  }, [serverOrigin, searchParams]); // Adiciona serverOrigin às dependências

  const voltar = () => {
    navigate('/acervo/consultar');
  };

  const itemTemplate = (book) => (
    <Link key={book?.id_livro} to={`/reservar/livro/${book?.id_livro}`}>
      <CardBook disponibilidade={book?.disponibilidadeLivro ?? book?.quantidadeLivro} qtd={book?.quantidadeLivro} img={book?.imagem} nome={book?.titulo} />
    </Link>
  );

  const footer = <Button type="text" icon="pi pi-plus" label="Ver Mais" onClick={() => ds.current.load()} />;

  // O resto do JSX permanece exatamente o mesmo
  return (
    <section className={styles.section_books}>
      <div id="div_booksID" className={styles.div_books}>
        {error ? (<p>{error.message}</p>) : loading ? (
          <>
            <h2>Buscando livro(s) ...</h2>
            <div style={{ display:'flex', justifyContent:'start', alignItems:'center', flexDirection:'column-reverse', height:'90vh', paddingTop:'20vh' }}>
              <ProgressSpinner style={{ width: '100px', height: '100px', display:'flex' }} strokeWidth="4" />  
            </div>
          </>
        ) : ( 
          <>
            <div style={{ display: 'flex', justifyItems:'center', alignItems: 'center', marginBottom: '20px', flexWrap:'wrap', gap:'20px' }}>
              {books.length === 0 && (<Button title='Voltar' style={{ backgroundColor:'#055904', color:'#FFF', border:'0px', marginLeft:'30px', width:'50px', height:'50px', borderRadius:'50%' }} icon="pi pi-arrow-left" aria-label="Filter" onClick={voltar} />)}
              <h2 style={{ width:'50%', height:'50px', padding:'0px 20px' }}>{books.length} livro(s) encontrado(s):</h2>
            </div>
            <ScrollTop />
            {Array.isArray(books) && books.length === 0 ? (
              <div className={styles.div_NotResults}><img src='../imgStatus/peopleSearch-bro.svg' alt='Ilustração de um detetive' /></div>
            ) : (
              <div className={styles.div_results}>
                <FiltroLivro cursos={cursos} autores={autores} fatecs={fatecs} />
                <DataScroller className={styles.dataScrollerUniBli} ref={ds} value={books} itemTemplate={itemTemplate} rows={5} loader footer={footer} />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default ResultadoConsultarTitulos;