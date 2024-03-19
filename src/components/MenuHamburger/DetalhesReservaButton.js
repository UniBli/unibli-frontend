// components
import { Button } from 'primereact/button';
// CSS scoped
import styles from './styles/DetalhesReservaButton.module.css'

const DetalhesReservaButton = () => {
  return (
    <div className={styles.containerDetalhesReservaButton}>
      <Button
        label='Detalhes da Reserva'
        icon='pi pi-info-circle'
        iconPos='right'
        severity='success'
        className={styles.detalhesReservaButton}
        text
      />
    </div>
  );
};

export default DetalhesReservaButton;
