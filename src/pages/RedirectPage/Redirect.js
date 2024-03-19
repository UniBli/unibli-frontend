import styles from './Redirect.module.css'

const Redirect = () => {
    return (
        <section className={styles.sectionRedirect}>
        <img src='https://raw.githubusercontent.com/UniBli/unibli/main/frontend/public/imgStatus/redirectLogin-bro.svg' alt='Imagem de servidor seguro'/>
        <h1 className={styles.txtRedirect}>Estamos redirecionando você para a página de login! 
        </h1>
        <small>Aguarde... </small>
    </section>
  )
}

export default Redirect