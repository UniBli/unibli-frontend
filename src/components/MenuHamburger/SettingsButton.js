// components
import { Button } from "primereact/button";
import { Badge } from 'primereact/badge';

// CSS scoped
import styles from './styles/SettingsButton.module.css';

const SettingsButton = ({integrado2}) => {

  return (
    <div className={styles.containerSettingsButton}>
      {!integrado2 ? (
        <Button
          label="Configurações" 
          icon="pi pi-cog" 
          iconPos="left"
          severity="success"
          className={styles.naoIntegrado}
          tooltip="Conclua o seu cadastro!"
          tooltipOptions={{ position: 'left' }}
        >
          <Badge className={styles.customIcon} value="!" severity="warning"></Badge>
        </Button>
        
      ):(
        <Button
        label="Configurações" 
        icon="pi pi-cog" 
        iconPos="right"
        severity="success"
        className={styles.settingsButton}
        text
      />
      )}
      


    </div>
  );
};

export default SettingsButton;
