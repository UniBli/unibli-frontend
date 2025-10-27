import styles from './Redirect.module.css'

const Redirect = () => {
    const redirectLogin = process.env.PUBLIC_URL + "/imgStatus/redirectLogin-bro.svg";

    return (
        <section className={styles.sectionRedirect}>
        <img src={redirectLogin} alt='Imagem de servidor seguro'/>
        <h1 className={styles.txtRedirect}>Estamos redirecionando você para a página de login! 
        </h1>
        <small>Aguarde... </small>
    </section>
  )
}

export default Redirect