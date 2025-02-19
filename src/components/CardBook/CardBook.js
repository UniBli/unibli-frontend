import styles from './styles/CardBook.module.css'
import { Tooltip } from 'primereact/tooltip';

const CardBook = ({disponibilidade, qtd, img, nome, exibirAdds=true}) => {
        
    // controlle para padronizar os tamanhos dos titulos
    const titulo = String(nome).length >= 20 ? String(nome).slice(0, 15) + "..." : String(nome);

    return (
        <>
        <div className={`${styles.container}`}>

            {exibirAdds && (  
                <Tooltip target=".custom-target-icon" mouseTrack />
            )}
            <div className={styles.book}>
                <div  className={styles.divBookBorder} >
                    { typeof img === "string" && img.includes("http") 
                        ? <img src={img} alt="Imagem do livro" />
                        : <h5>{nome}</h5>
                    }
                </div>
            </div>
            <div className={styles.details}>
                <span 
                    className={`${exibirAdds ? 'exibir-adds custom-target-icon ' : ''}`}
                    data-pr-tooltip={exibirAdds ? nome : ''}
                    data-pr-position={exibirAdds ? 'right' : ''}
                    data-pr-at={exibirAdds ? 'right+5 top' : ''}
                    data-pr-my={exibirAdds ? 'left center-2' : ''}
                > 
                    {exibirAdds && (
                        <p className={styles.title}>{titulo}</p>
                    )}
                </span> 
                <p>Disponibilidade: {disponibilidade}</p>
                <p>Quantidade: {qtd}</p>
            </div>
        </div>
    </>
    );
};

export default CardBook