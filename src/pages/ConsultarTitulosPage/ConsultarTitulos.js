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
  import {useState, useEffect} from 'react';


  import axios from 'axios';


  const ConsultarTitulos = () => {

    /********************************************************************** */
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const origin = process.env.REACT_APP_UNIBLI_SERVER_HTTP;
                const URL = `${origin}/teste/fetec1/acervo`;

                const response = await axios.get(URL);
                setBooks(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar livros:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);
    /********************************************************************** */



    // Swiper
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
                    <SwiperSlide key={book._id}>
                      <Link to={`/reserveTitles/${book._id}`}>
                        <CardBook disponibilidade={book.quantidadeDisponivel}
                          qtd={book.quantidadeLivros} img={book.imageLinks} nome={book.titulo}
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
