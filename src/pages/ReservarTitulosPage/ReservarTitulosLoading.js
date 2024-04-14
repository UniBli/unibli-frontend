import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
        
import styles from './styles/ReservarTitulosLoading.module.css';

const ReservarTitulosLoading = () => {
    
    return( 
        <>
        <section className={styles.section_bookInformationReservation}>

            <div className={styles.div_bookButton}>
                    <div className={styles.book}>
                       <Skeleton className={styles.skeletonBook}></Skeleton>
                    </div>

                           
                <div className={styles.button}>
                    <Button
                        type="submit"
                        label="RESERVAR"
                        size="large"
                        className={styles.disabledButton}
                    />
                </div>
            </div>

            <div className={styles.div_informationsBook}>
                <div className={styles.div_resume} style={{width:'100%'}}>
                    <Skeleton width="100%" height='3rem' borderRadius="16px"></Skeleton>
                    <h2>Resumo</h2>
                    <div  style={{display:'flex',flexDirection:'column', gap:'10px', width:'100%', }}>
                        <Skeleton width="100%" height='1.5rem' borderRadius="16px"></Skeleton>
                        <Skeleton width="100%" height='1.5rem' borderRadius="16px"></Skeleton>
                        <Skeleton width="70%" height='1.5rem' borderRadius="16px"></Skeleton>
                    </div>

                    <Divider type="solid" />
                </div>
                <div className={styles.div_details}>

                </div>
                <div className={styles.div_autor}>
                    <h2>Autora(s)/Autor(es)</h2>

                </div>
                <div className={styles.div_ondeEncontrar}>
                    <h2>Onde encontrar</h2>
                </div>
            </div>

        </section>
        </>
        )
}

export default ReservarTitulosLoading