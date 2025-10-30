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
                <div className={styles.div_resume} style={{width:'100%', marginTop:'20px'}}>
                    <Skeleton width="100%" height='3rem' borderRadius="16px"></Skeleton>
                    <h2>Resumo</h2>
                    <div  style={{display:'flex',flexDirection:'column', gap:'10px', width:'100%', marginTop:'10px'}}>
                        <Skeleton width="100%" height='1.5rem' borderRadius="16px"></Skeleton>
                        <Skeleton width="100%" height='1.5rem' borderRadius="16px"></Skeleton>
                        <Skeleton width="70%" height='1.5rem' borderRadius="16px"></Skeleton>
                    </div>

                    <Divider type="solid" />
                </div>
                <div className={styles.div_details} style={{width:'100%',marginTop:'20px'}}>
                     <Skeleton width="100%" height='5rem' borderRadius="16px"></Skeleton>
                </div>
                <div className={styles.div_autor} style={{width:'100%'}}>
                    <h2>Autora(s)/Autor(es)</h2>
                    <div style={{width:'100%', marginTop:'10px'}}>
                        <div style={{width:'auto', marginRight:'20px'}}>
                        <Skeleton width="5rem" height='5rem' borderRadius="50%"></Skeleton>
                        </div>
                        <div style={{width:'100%', display:'flex', flexDirection:"column", gap:'10px', }}>
                            <Skeleton width="35%" height='15px' borderRadius="16px"></Skeleton>
                            <Skeleton width="30%" height='15px' borderRadius="16px"></Skeleton>
                            <Skeleton width="45%" height='15px' borderRadius="16px"></Skeleton>
                        </div>
                    </div>
                </div>
                <div className={styles.div_ondeEncontrar} style={{width:'100%', marginTop:'20px', gap:'10px'}}>
                    <h2>Onde encontrar</h2>
                    <div style={{width:'100%'}}>
                        <Skeleton width="112px" height='3.2rem' borderRadius="50px"></Skeleton>
                        <Skeleton width="112px" height='3.2rem' borderRadius="50px"></Skeleton>
                        <Skeleton width="112px" height='3.2rem' borderRadius="50px"></Skeleton>
                        <Skeleton width="112px" height='3.2rem' borderRadius="50px"></Skeleton>
                    </div>
                </div>
            </div>

        </section>
        </>
        )
}

export default ReservarTitulosLoading