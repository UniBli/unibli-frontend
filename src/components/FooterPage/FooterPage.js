//CSS scoped
import styles from './styles/FooterPage.module.css';
import { Link } from 'react-router-dom';

const FooterPage = () => {
  return (
    <>
      <section id={styles.footer}>
        <div className={styles.logoUniBli}>
          <Link to="/">

          <img
            src='https://raw.githubusercontent.com/UniBli/unibli/main/frontend/public/img/logoUniBli%2BTexto_F-Negativo.svg'
            className='d-inline-block align-top'
            alt='Logo UniBli'
            />
            </Link>
          <small>Todos os direitos reservados a ©UniBli</small>
        </div>

        <small>Feito com <span role='img' aria-label='Coração verde'>💚</span> por, Thyago, Weslley e Hélio</small>
        <small>Orientador  Rodrigo Bossini</small>

      </section>
    </>
  );
};

export default FooterPage;