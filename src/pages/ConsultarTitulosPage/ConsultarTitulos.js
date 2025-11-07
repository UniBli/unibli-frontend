// components
import CardBook from '../../components/CardBook/CardBook';
import { Link } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';
import { ScrollTop } from 'primereact/scrolltop';


// CSS scoped
import styles from './styles/ConsultarTitulos.module.css';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';
//import {useState, useEffect} from 'react';
import { useEffect, useState } from 'react';

import axios from 'axios';

const ConsultarTitulos = ({origin}) => {

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [cursosComLivros, setCursosComLivros] = useState([]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const [respCursos, respLivrosCursos] = await Promise.all([
          axios.get(`${origin}/cursos`),
          axios.get(`${origin}/acervo/livros/cursos`)
        ]);

        const cursos = Array.isArray(respCursos?.data) ? respCursos.data : [];
        const livrosCursos = Array.isArray(respLivrosCursos?.data) ? respLivrosCursos.data : [];

        // Normaliza o mapa de livros
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

        // Combina cursos + livros
        const combinados = cursos.map(curso => {
          if (!curso || typeof curso.id_curso === 'undefined') {
            return { ...curso, livros: [] };
          }
          
          const idCursoStr = curso.id_curso.toString();
          const livrosArray = livrosMap[idCursoStr] || [];
          
          return {
            ...curso,
            livros: Array.isArray(livrosArray) ? livrosArray.slice(0, 7) : []
          };
        });

        setCursosComLivros(combinados);
      } catch (error) {
        console.error("❌ Erro ao carregar cursos/livros:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [origin]);
  

  // Swiper ----------------------------------
  const breakpoints = {
    280: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    360: {
      slidesPerView: 1,
      spaceBetween: 10,
    },
    640: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    768: {
      slidesPerView: 3,
      spaceBetween: -30,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: -40,
    },
    1360: {
      slidesPerView: 5,
      spaceBetween: -50,
    },
  }
  //------------------------------------------


  /****************** PARA LOADING DO BOOOK ******************/
  const booksLoading =[
    {id:1, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
    {id:2, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
    {id:3, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
    {id:4, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
    {id:5, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
    {id:6, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)},
    {id:7, component: (<Skeleton width='12.5rem' height='20.5rem' borderRadius='16px'></Skeleton>)}
  ]

  const divSkeleton = {display:'flex', justifyContent:'center', alignItems:'center', margin:'3rem'};
  /*********************************************************/
  
  return (
    <main>
      <section className={styles.banner}>
        <img className={styles.imgBanner} src="img_banner.png" alt="Menina lendo um livro na biblioteca" />
        <div className={styles.txtBanner}>
          <p>O sistema <span>UniBli</span> veio</p>
          <p>para facilitar a vida do</p>
          <p>leitor Fatecano, que</p>
          <p>mora longe da sua</p>
          <p>unidade!</p>
        </div>
      </section>

      <section className={styles.books}>
        <ScrollTop />


        {
          (loading || cursosComLivros == null)
            ? (
              <>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={30}
                  navigation={true}
                  pagination={{
                    dynamicBullets:true,
                    clickable: true,
                  }}
                  breakpoints={breakpoints}
                  modules={[Navigation, Pagination]}
                > 
                {
                  booksLoading.map((book) => (
                    <SwiperSlide key={book?.id}>
                      <div style={divSkeleton}>
                        {book?.component}
                      </div>
                    </SwiperSlide>
                  ))
                }
                </Swiper>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={30}
                  navigation={true}
                  pagination={{
                    dynamicBullets:true,
                    clickable: true,
                  }}
                  breakpoints={breakpoints}
                  modules={[Navigation, Pagination]}
                > 
                {
                  booksLoading.map((book) => (
                    <SwiperSlide key={book?.id}>
                      <div style={divSkeleton}>
                        {book?.component}
                      </div>
                    </SwiperSlide>
                  ))
                }
                </Swiper>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={30}
                  navigation={true}
                  pagination={{
                    dynamicBullets:true,
                    clickable: true,
                  }}
                  breakpoints={breakpoints}
                  modules={[Navigation, Pagination]}
                > 
                {
                  booksLoading.map((book) => (
                    <SwiperSlide key={book?.id}>
                      <div style={divSkeleton}>
                        {book?.component}
                      </div>
                    </SwiperSlide>
                  ))
                }
                </Swiper>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={30}
                  navigation={true}
                  pagination={{
                    dynamicBullets:true,
                    clickable: true,
                  }}
                  breakpoints={breakpoints}
                  modules={[Navigation, Pagination]}
                > 
                {
                  booksLoading.map((book) => (
                    <SwiperSlide key={book?.id}>
                      <div style={divSkeleton}>
                        {book?.component}
                      </div>
                    </SwiperSlide>
                  ))
                }
                </Swiper>
              </>
            )
            : 
            cursosComLivros.map(curso => (
          <div key={curso.id_curso} className={styles.containerBooks}>
            {error && <p>{error.message}</p>}
            {
              <>
                <Link 
                  className={styles.txtNomeCurso}
                  title="Clique para consultar os livros deste curso!" 
                  to={`/acervo/consultar?cursoId=${curso.id_curso}`}
                >
                  <h2>{curso.nome}:</h2>
                </Link>
                <Swiper
                  slidesPerView={3}
                  spaceBetween={30}
                  navigation={true}
                  pagination={{
                    dynamicBullets:true,
                    clickable: true,
                  }}
                  breakpoints={breakpoints}
                  modules={[Navigation, Pagination]}
                >
                {
                  Array.isArray(curso.livros) && curso.livros.map((book) => (
                    <SwiperSlide key={book?.id_livro}>
                      <Link to={`/reservar/livro/${book?.id_livro}`}>
                      <CardBook 
                        disponibilidade={book?.disponibilidadeLivro ? book?.disponibilidadeLivro : book?.quantidadeLivro}
                        qtd={book?.quantidadeLivro}
                        img={book?.imagem}
                        nome={book?.titulo}            
                        exibirAdds={true}
                      />
                      </Link>
                    </SwiperSlide>
                  ))
                }
                </Swiper>
              </>
        }


        


            
            
          </div> 
        ))}
      </section>

    </main>
  );
}

export default ConsultarTitulos;
