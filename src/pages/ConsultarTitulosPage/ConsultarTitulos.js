// components
import CardBook from '../../components/CardBook/CardBook';
import { Link } from 'react-router-dom';

// CSS scoped
import styles from './styles/ConsultarTitulos.module.css';


// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// import required modules
import { Navigation, Pagination } from 'swiper/modules';




const ConsultarTitulos = ({ books }) => {

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

  return (
    <main>
      <section className={styles.banner}>
        <img className={styles.imgBanner} src="https://raw.githubusercontent.com/thyagoerick/unibli/main/frontend/public/img_banner.png" alt="" />
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
      </section>
    </main >
  );
}

export default ConsultarTitulos;