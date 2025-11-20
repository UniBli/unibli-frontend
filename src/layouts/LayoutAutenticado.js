import React from 'react';
import { useUser } from '../context/UserContext';
import { ProgressSpinner } from 'primereact/progressspinner';

const LayoutAutenticado = ({ children }) => {
  // Pega os estados de carregamento do nosso contexto.
  const { isLoadingAuth, isLoadingUser } = useUser();

  // A lógica de carregamento é a mesma, mas agora só se aplica aqui.
  const isAuthenticating = isLoadingAuth || isLoadingUser;

  if (isAuthenticating) {
    // Mostra um spinner genérico enquanto a autenticação e a busca do usuário ocorrem.
    return (
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height:'110dvh',
        marginTop: '35dvh',
      }}>
        <ProgressSpinner style={{ width: '100px', height: '100px' }} strokeWidth="4" />
      </div>
    );
  }

  // Quando tudo estiver pronto, renderiza a página protegida real.
  return children;
};

export default LayoutAutenticado;