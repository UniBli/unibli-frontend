// components
import { Button } from "primereact/button";
// CSS scoped
import styles from './styles/SettingsButton.module.css';

const SettingsButton = () => {

  return (
    <div className={styles.containerSettingsButton}>
      <Button
        label="Configurações" 
        icon="pi pi-cog" 
        iconPos="right"
        severity="success"
        className={styles.settingsButton}
        text
      />
    </div>
  );
};

export default SettingsButton;
