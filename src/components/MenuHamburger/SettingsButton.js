import { Button } from "primereact/button";
import { Badge } from 'primereact/badge';
import { useUser } from '../../context/UserContext'; // 1. Importar o hook

// CSS scoped
import styles from './styles/SettingsButton.module.css';

// 2. Remover todas as props
const SettingsButton = () => {

  // 3. Consumir os dados diretamente do contexto
  const { integrado, isLoadingUser } = useUser();

  const showBadge = !isLoadingUser && !integrado;

  return (
     <div className={styles.containerSettingsButton}>
      {showBadge ? (
        // Versão "Não Integrado"
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
      ) : (
        // Versão "Integrado" ou "Carregando"
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