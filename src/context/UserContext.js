import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth0();
  
  const [usuarioUnibliBd, setUsuarioUnibliBd] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  const env = process.env.REACT_APP_ENV;
  const local = process.env.REACT_APP_UNIBLI_SERVER_LOCAL;
  const prod = process.env.REACT_APP_UNIBLI_SERVER_HEROKU_HTTPS;
  const serverOrigin = env === "development" ? local : prod;

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (isLoadingAuth) {
        return;
      }
      if (isAuthenticated && user?.sub) {
        try {
          const resp = await axios.get(`${serverOrigin}/usuarios/${user.sub}`);
          setUsuarioUnibliBd(resp.data.usuario || null);
        } catch (error) {
          console.error('Usuário do Auth0 não encontrado no BD da UniBli:', error.message);
          setUsuarioUnibliBd(null);
        } finally {
          setIsLoadingUser(false);
        }
      } else {
        setUsuarioUnibliBd(null);
        setIsLoadingUser(false);
      }
    };

    fetchUserDetails();
  }, [user, isAuthenticated, isLoadingAuth, serverOrigin]);

  // 'integrado' é um valor derivado diretamente do estado 'usuarioUnibliBd'.
  const value = {
    usuarioUnibliBd,
    integrado: !!usuarioUnibliBd,
    isLoadingUser,
    isLoadingAuth,
    serverOrigin,
    setUsuarioUnibliBd // Expondo a função para atualizar o usuário
  };

  // O console.log de diagnóstico foi removido daqui.

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
};
