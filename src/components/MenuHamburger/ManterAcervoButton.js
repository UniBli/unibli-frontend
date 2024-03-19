// components
import { Button } from 'primereact/button';
// CSS scoped
import style from './styles/ManterAcervoButton.module.css';

const ManterAcervoButton = () => {

  return (
        <>
          <div className={style.containerManterAcervoButton}>
            <Button
              label='Manter Acervo'
              icon="pi pi-plus "
              iconPos='right'
              severity='success'
              className={style.manterAcervoButton}
              text
            />
          </div>
        </>
  );
};

export default ManterAcervoButton;
