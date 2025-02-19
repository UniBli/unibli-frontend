import styles from './styles/DeletarConta.module.css';

import { Dialog } from 'primereact/dialog';

import { useState } from 'react';

const DeletarConta = ({origin}) => {


    const [visible, setVisible] = useState(false);
    const [excluir, setExcluir] = useState('')
  
  
    const handleDelete = (e) => {
      e.preventDefault();
      
      if (excluir === 'Excluir conta') {
        console.log('conta excluída');
        setVisible(false);
      } else {
        console.log('conta NÃO excluída');
      }
  
      setExcluir('');
    }
  


  return (
    
    <div className={styles.divDeletarConta}>

    <h2>Deletar conta</h2>
    <div>
      <p>
        Tem certeza de que deseja excluir seu cadastro? Esta ação é irreversível e todos os seus dados serão permanentemente removidos do sistema.
      </p>

      <p>
      Lamentamos ver você partir, mas entendemos que cada pessoa tem suas razões. Antes de tomar essa decisão definitiva, gostaríamos de lembrar algumas informações importantes:
      </p>
      <p>
        <ol>
          <li>Ao excluir seu cadastro, você perderá acesso a todos os recursos e benefícios exclusivos associados à sua conta;</li>
          <li>Não será possível recuperar seus dados após a exclusão;</li>
          <li>Se você decidir voltar a utilizar nossos serviços, será necessário criar um novo cadastro e começar do zero.</li>
        </ol>
      </p>

      <p>
      Por favor, pense cuidadosamente antes de prosseguir. Se você ainda tem alguma dúvida ou preocupação, nossa equipe de suporte estará disponível para ajudar. Caso contrário, se você está certo de sua decisão, clique no botão <italic>"Confirmar Exclusão"</italic> abaixo.
      </p>
    </div>
    
    <div 
      className={styles.divBotaoDeletarConta}
    >
        <button
            type='submit'
            className={styles.buttonTrash}
            onClick={() => setVisible(true)}
        >
            CONFIRMAR EXCLUSÃO<i className='pi pi-trash'></i>
        </button>
    </div>
  
  <Dialog position='top' header="Confirmar exclusão de conta" visible={visible} modal={false} className={styles.dialog} onHide={() => {if (!visible) return; setVisible(false); }}>
        <p className="m-0">
            Para confirmar a exclusão da sua conta, digite <italic>"Excluir conta"</italic> abaixo e clique no botão excluir.
        </p>

        <form onSubmit={handleDelete}>
          <input type="text" name='excluir' value={excluir} onChange={(e) => setExcluir(e.target.value)} required/>
          <button type="submit">Excluir</button>
        </form>

    </Dialog>



    <p className={styles.support}>
          Caso precise, contate o suporte: 
          <a href="mailto:unibli.tcc.fatec@gmail.com?subject=Suporte Unibli">unibli.tcc.fatec@gmail.com</a>
    </p>

  </div>

  )
}

export default DeletarConta