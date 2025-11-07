//CSS scoped
import styles from './styles/FooterPage.module.css';
import { Link } from 'react-router-dom';

const FooterPage = ({logo}) => {
  return (
    <>
      <section id={styles.footer}>
        <div className={styles.logoUniBli}>
          <Link to="/">

          <img
            src={logo}
            className='d-inline-block align-top'
            alt='Logo UniBli'
            />
            </Link>
          <small>Todos os direitos reservados a ©UniBli</small>
        </div>

        <small className='authors'>Feito com <span role='img' aria-label='Coração verde'>💚</span> por, Thyago, Weslley e Hélio</small>
        <small>Andréia Cristina Grisolio Machion</small>

      </section>
    </>
  );
};

export default FooterPage;