// hooks
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from 'react'
// pages
import Settings from './pages/SettingsPage/Settings.js';
import DetalhesReserva from './pages/DetalhesReservaPage/DetalhesReserva.js';
import ManterAcervo from './pages/ManterAcervoPage/ManterAcervo.js';
import ReservarTitulos from './pages/ReservarTitulosPage/ReservarTitulos.js';
import ConsultarTitulos from './pages/ConsultarTitulosPage/ConsultarTitulos.js';
import ResultadoConsultarTitulos from './pages/ConsultarTitulosPage/ResultadoConsultarTitulos.js'
import NotFound from "./pages/NotFoundPage/NotFound.js";

// components
import NavBar from "./components/NavbarLogin/NavBar";
import FooterPage from "./components/FooterPage/FooterPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// styles
import './App.css'

import axios from 'axios';

const App = () => {
  // hook do auth0
  const {user, isAuthenticated} = useAuth0();
  

  //variaveis de ambiente configuradas no .env
  const auth0Domain =process.env.REACT_APP_AUTH0_DOMAIN;
  const env = process.env.REACT_APP_ENV;
  const local = process.env.REACT_APP_UNIBLI_SERVER_LOCAL;
  const prod = process.env.REACT_APP_UNIBLI_SERVER_HEROKU_HTTPS;
  const serverOrigin = env === "development" ? local : prod 
    
  //const [callFetch, setCallFetch] = useState();
  const [integrado, setIntegrado] = useState();
  const [usuarioUnibliBd, setUsuarioUnibliBd] = useState();

  
  useEffect(() => {    
    console.log("useEffect do Integrado (A)", integrado)
    if(user?.sub){
      axios
        .get(`${serverOrigin}/usuarios/usuario/${user?.sub}`)
        .then((resp) => {     
          setUsuarioUnibliBd(resp?.data.usuario)          
        })
        .catch((error) => {
          console.error('Erro ao buscar usuário:', error);
          setUsuarioUnibliBd({erro: error})
        });
    }
  },[
    serverOrigin,
    user?.sub, 
    integrado])

  useEffect(()=>{
    console.log('Entrou no useEffect - unibliUser:', usuarioUnibliBd);
    
    if(usuarioUnibliBd?.erro){
      setIntegrado(false)     
    }else if(usuarioUnibliBd){
      setIntegrado(true)     
    }
  },[usuarioUnibliBd])  




  return (
    <>
      <BrowserRouter>    
        <NavBar isAuthenticated={isAuthenticated} origin={serverOrigin} integrado={integrado}/>
        
        <Routes>       
          {/* Rotas Privadas */}
          <Route path="/settings" element={<Settings auth0Domain={auth0Domain} origin={serverOrigin} integrado={integrado} setIntegrado={setIntegrado} usuarioUnibliBd={usuarioUnibliBd}/>}/>
          <Route path="/detalhes/reserva" element={<DetalhesReserva />}/>
          <Route path="/maintainCollection" element={<ManterAcervo/>}/>

          {/* Rotas Públicas */}
          <Route path="/" element={<ConsultarTitulos origin={serverOrigin}/>}/>
          <Route path="/reservar/livro/:bookId" element={<ReservarTitulos origin={serverOrigin} integrado={integrado} />}/>
          <Route path="/acervo/consultar" element={<ResultadoConsultarTitulos origin={serverOrigin}/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>    
        <FooterPage/>
      </BrowserRouter>

     
    </>
  );
}

export default App;
