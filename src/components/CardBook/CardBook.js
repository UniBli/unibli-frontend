import styles from './styles/CardBook.module.css'

const CardBook = ({disponibilidade, qtd, img, nome}) => {
  return (
        <div className={styles.container} >
            <div className={styles.book}>
                <div  className={styles.divBookBorder} >
                    { img 
                        ? <img src={img} alt="Imagem do livro" />
                        : <h5>{nome}</h5>
                    }
                </div>
            </div>
            <div className={styles.details}>
                <p>Disponibilidade: {disponibilidade}</p>
                <p>Quantidade: {qtd}</p>
            </div>
        </div>
  );
};

export default CardBook