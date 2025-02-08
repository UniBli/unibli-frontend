import styles from './styles/CardBook.module.css'

const CardBook = ({disponibilidade, qtd, img, nome, exibirTitulo=true}) => {
        

    const titulo = nome.length >= 20 ? nome.slice(0, 15) + "..." : nome;

    return (
        <div className={styles.container} title={nome}>
            <div className={styles.book}>
                <div  className={styles.divBookBorder} >
                    { typeof img === "string" && img.includes("http") 
                        ? <img src={img} alt="Imagem do livro" />
                        : <h5>{nome}</h5>
                    }
                </div>
            </div>
            <div className={styles.details}>
                <span> 
                    {exibirTitulo && (
                        <p
                            className={styles.title}
                        >
                            {titulo}
                            </p>
                    )}
                </span> 
                <p>Disponibilidade: {disponibilidade}</p>
                <p>Quantidade: {qtd}</p>
            </div>
        </div>
    );
};

export default CardBook