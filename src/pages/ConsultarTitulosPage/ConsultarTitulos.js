import CardBook from '../../components/CardBook/CardBook';
import { Link } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';
import styles from './styles/ConsultarTitulos.module.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
import { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext'; // 1. Importar o hook
import axios from 'axios';

// 2. Remover a prop 'origin'
const ConsultarTitulos = () => {
  // 3. Consumir a 'serverOrigin' do contexto
  const { serverOrigin } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cursosComLivros, setCursosComLivros] = useState([]);

  useEffect(() => {
    if (!serverOrigin) return; // Não faz nada se a origin ainda não foi carregada

    setLoading(true);
    const fetchData = async () => {
      try {
        const [respCursos, respLivrosCursos] = await Promise.all([
          axios.get(`${serverOrigin}/cursos`),
          axios.get(`${serverOrigin}/acervo/livros/cursos`)
        ]);
        // ... (resto da lógica de processamento de dados, sem alteração)
        const cursos = Array.isArray(respCursos?.data) ? respCursos.data : [];
        const livrosCursos = Array.isArray(respLivrosCursos?.data) ? respLivrosCursos.data : [];
        const livrosMap = {};
        livrosCursos.forEach(item => {
          if (item && typeof item === 'object') {
            const entries = Object.entries(item);
            if (entries.length > 0) {
              const [idCurso, livros] = entries[0];
              livrosMap[idCurso.toString()] = Array.isArray(livros) ? livros : [];
            }
          }
        });
        const combinados = cursos.map(curso => {
          if (!curso || typeof curso.id_curso === 'undefined') return { ...curso, livros: [] };
          const idCursoStr = curso.id_curso.toString();
          const livrosArray = livrosMap[idCursoStr] || [];
          return { ...curso, livros: Array.isArray(livrosArray) ? livrosArray.slice(0, 7) : [] };
        });
        setCursosComLivros(combinados);
      } catch (error) {
        console.error("❌ Erro ao carregar cursos/livros:", error);
        setError(error.message || "Erro desconhecido ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [serverOrigin]); // Agora depende da serverOrigin do contexto

  // O resto do JSX permanece exatamente o mesmo
  const breakpoints = { 280: { slidesPerView: 1, spaceBetween: 10 }, 360: { slidesPerView: 1, spaceBetween: 10 }, 640: { slidesPerView: 2, spaceBetween: 20 }, 768: { slidesPerView: 3, spaceBetween: -30 }, 1024: { slidesPerView: 4, spaceBetween: -40 }, 1360: { slidesPerView: 5, spaceBetween: -50 } };
  const booksLoading = [ {id:1, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)}, {id:2, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)}, {id:3, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)}, {id:4, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)}, {id:5, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)}, {id:6, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)}, {id:7, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)} ];
  const divSkeleton = {display:'flex', justifyContent:'center', alignItems:'center', margin:'3rem'};
  
  return (
    <main>
      <section className={styles.banner}>
        <img className={styles.imgBanner} src="img_banner.png" alt="Menina lendo um livro na biblioteca" />
        <div className={styles.txtBanner}><p>O sistema <span>UniBli</span> veio</p><p>para facilitar a vida do</p><p>leitor Fatecano, que</p><p>mora longe da sua</p><p>unidade!</p></div>
      </section>

      <section className={styles.books}>
        <ScrollTop />
        {error && (
          <div className={styles.backendDisconnected}>
            <div className={styles.noConnection}>
              <img 
                src='../imgStatus/peopleDisconnectingPlug-bro.svg' 
                alt='Pessoas desconectando um plug de tomada' 
              />
            </div>
            <h1 className={styles.txtNoConnection}>
              {error}
            </h1>
            {error === 'Network Error' && (<small>Rodar o Backend ^^º</small>)}
          </div>
        )}



        {!error && loading && (
          <>
            {[...Array(4)].map((_, i) => (
              <Swiper key={i} slidesPerView={3} spaceBetween={30} navigation={true} pagination={{ dynamicBullets:true, clickable: true }} breakpoints={breakpoints} modules={[Navigation, Pagination]}> 
                {booksLoading.map((book) => (<SwiperSlide key={book?.id}><div style={divSkeleton}>{book?.component}</div></SwiperSlide>))}
              </Swiper>
            ))}
          </>
        )}

        {!error && !loading && cursosComLivros.map(curso => (
          <div key={curso.id_curso} className={styles.containerBooks}>
            {/* Removi a verificação de erro aninhada que estava aqui */}
            <Link className={styles.txtNomeCurso} title="Clique para consultar os livros deste curso!" to={`/acervo/consultar?cursoId=${curso.id_curso}`}><h2>{curso.nome}:</h2></Link>
            <Swiper slidesPerView={3} spaceBetween={30} navigation={true} pagination={{ dynamicBullets:true, clickable: true }} breakpoints={breakpoints} modules={[Navigation, Pagination]}>
              {Array.isArray(curso.livros) && curso.livros.map((book) => (
                <SwiperSlide key={book?.id_livro}>
                  <Link to={`/reservar/livro/${book?.id_livro}`}>
                    <CardBook 
                      disponibilidade={book?.disponibilidadeLivro ?? book?.quantidadeLivro} 
                      qtd={book?.quantidadeLivro} 
                      img={book?.imagem} 
                      nome={book?.titulo} 
                      exibirAdds={true} />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div> 
        ))}
      </section>
    </main>
  );
}

export default ConsultarTitulos;