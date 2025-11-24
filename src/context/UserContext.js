import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth0();
  
  const [usuarioUnibliBd, setUsuarioUnibliBd] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [erro, setErro] = useState(null)
  const [fatecs, setFatecs] = useState([]); // Novo estado para a lista de Fatecs
		const [bibliotecario, setBibliotecario] = useState(false);
    const [usuariosNaoValidados, setUsuariosNaoValidados] = useState([]); // Novo estado para usuários não validados

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
          setUsuarioUnibliBd(resp.data?.usuario || null);
          setBibliotecario(resp.data?.usuario?.tipoBibliotecario ?? false);
        } catch (error) {
          console.error('Usuário do Auth0 não encontrado no BD da UniBli:', error.message);
          setErro(error.message);
          setUsuarioUnibliBd(null);
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

  // Função para buscar usuários não validados (apenas para bibliotecários)
  // Usando useCallback para memorizar a função e evitar que ela mude a cada render
  const fetchUsuariosNaoValidados = useCallback(async () => {
    if (!bibliotecario || !serverOrigin) return;

    try {
      // Assumindo um endpoint para buscar usuários não validados
      const response = await axios.get(`${serverOrigin}/usuarios/invalidados`);
      console.log('response.data.usuario',response.data.usuario);
      
      // Assumindo que a resposta é um array de objetos de usuário
      setUsuariosNaoValidados(response.data.usuarios || []);
    } catch (error) {
      console.error('Erro ao buscar usuários não validados:', error);
    }
  }, [bibliotecario, serverOrigin]); // Dependências da função

  // Efeito para buscar usuários não validados quando o status de bibliotecário mudar
  useEffect(() => {
    if (bibliotecario) {
      fetchUsuariosNaoValidados();
    }
  }, [bibliotecario, fetchUsuariosNaoValidados]); // Adicionando fetchUsuariosNaoValidados como dependência

  // Efeito para buscar a lista de Fatecs
  useEffect(() => {
    const fetchFatecs = async () => {
      try {
        const response = await axios.get(`${serverOrigin}/fatecs`);
        // A resposta é um objeto com a chave "fatecs" que contém um array de objetos
        setFatecs(response.data.fatecs || []); 
      } catch (error) {
        console.error('Erro ao buscar Fatecs:', error);
        // Não há toast aqui, apenas log no console
      }
    };

    if (serverOrigin) {
      fetchFatecs();
    }
  }, [serverOrigin]);
  
  // 'integrado' é um valor derivado diretamente do estado 'usuarioUnibliBd'.
  const value = {
    usuarioUnibliBd,
    integrado: !!usuarioUnibliBd,
    isLoadingUser,
    isLoadingAuth,
    serverOrigin,
    setUsuarioUnibliBd, // Expondo a função para atualizar o usuário
    erro,
    bibliotecario: !!bibliotecario,
    fatecs, // Expondo a lista de Fatecs
    usuariosNaoValidados, // Expondo a lista de usuários não validados
    fetchUsuariosNaoValidados // Expondo a função para re-buscar a lista
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
