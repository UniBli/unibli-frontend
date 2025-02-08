// components
import CardBook from '../../components/CardBook/CardBook';
import { Link } from 'react-router-dom';
import { Skeleton } from 'primereact/skeleton';

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



// custom hook
import { useFetch } from '../../hooks/useFetch';  

  const ConsultarTitulos = () => {


    const origin = process.env.REACT_APP_UNIBLI_SERVER_HEROKU_HTTPS;
    const url = `${origin}/unibli/acervo`; 
    const {data: books, loading, error} = useFetch(url,null,origin)   
    console.log('ORIGIN: ', origin)


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

          <div className={styles.containerBooks}>
            <h2>Análise e Desenvolvimento de Sistemas:</h2>
            {error && <p>{error}</p>}
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
                loading
                ? booksLoading.map((book) => (
                    <SwiperSlide key={book.id}>
                      <div style={divSkeleton}>
                          {book.component}
                      </div>
                    </SwiperSlide>
                ))
                : books && books.map((book) => (
                    <SwiperSlide key={book._id || book.livro_id}>
                      <Link to={`/reserveTitles/${book._id || book.livro_id}`}>
                        <CardBook 
                          disponibilidade={book.quantidadeDisponivel ?? 1}
                          qtd={(book.quantidadeLivros || book.quantidade_livro) ?? 1} 
                          img={(book?.imageLinks || book?.image_link)} nome={book.titulo}
                        />
                      </Link>
                    </SwiperSlide>
                ))
              }
            </Swiper>
          </div>

        {/*

          <div className={styles.containerBooks}>
            <h2>Gestão de Recursos Humanos:</h2>
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
              {books.map((book) => (
                <SwiperSlide key={book.id}>
                  <Link to={`/reserveTitles/${book.id}`}>
                    <CardBook disponibilidade={book.disponibilidade}
                      qtd={book.qtd} img={book.img} nome={book.nome}
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className={styles.containerBooks}>
            <h2>Gestão Comercial:</h2>
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
              {books.map((book) => (
                <SwiperSlide key={book.id}>
                  <Link to={`/reserveTitles/${book.id}`}>
                    <CardBook disponibilidade={book.disponibilidade}
                      qtd={book.qtd} img={book.img} nome={book.nome}
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        
        */}

        </section>

      </main>
    );
  }

  export default ConsultarTitulos;
