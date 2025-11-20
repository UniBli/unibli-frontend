import styles from './NotFound.module.css'

const NotFound = ({statusImg}) => {
    return (
        <section className={styles.sectionNotFound}>
        <img src={statusImg} alt='Ilustração de página não encontrada'/>
        <h1 className={styles.txtNotFound}>Página não encontrada
        </h1>
        <small>:'-(</small>
    </section>
  )
}

export default NotFound