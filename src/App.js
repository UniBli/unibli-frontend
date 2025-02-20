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
  //console.log(user);
  

  //variaveis de ambiente configuradas no .env
  const auth0Domain =process.env.REACT_APP_AUTH0_DOMAIN;
  const env = process.env.REACT_APP_ENV;
  const local = process.env.REACT_APP_UNIBLI_SERVER_LOCAL;
  const prod = process.env.REACT_APP_UNIBLI_SERVER_HEROKU_HTTPS;
  const serverOrigin = env === "development" ? local : prod 
    
  //const [callFetch, setCallFetch] = useState();
  const [integrado2, setIntegrado2] = useState();
  const [unibliUser, setUnibliUser] = useState();

  
  useEffect(() => {
    console.log('integrado2', integrado2);
    
    if(user?.sub){
      axios
        .get(`${serverOrigin}/usuarios/user/${user.sub}`)
        .then((resp) => {     
          setUnibliUser(resp.data.usuario)
        })
        .catch((error) => {
          console.error('Erro ao buscar usuário:', error);
          setUnibliUser({erro: error})
        });
    }
  },[
    serverOrigin,
    user?.sub, 
    integrado2])

  useEffect(()=>{
    console.log('Entrou no useEffect - unibliUser:', unibliUser);
    
    if(unibliUser?.erro){
      setIntegrado2(false)     
    }else if(unibliUser){
      setIntegrado2(true)     
    }

    // if(!unibliUser){
    //   setIntegrado2(false)     
    // }else{
    //   setIntegrado2(true)     
    // }

  },[unibliUser])  




  return (
    <>
      <BrowserRouter>    
        <NavBar isAuthenticated={isAuthenticated} origin={serverOrigin} integrado2={integrado2}/>
        
        <Routes>       
          {/* Rotas Privadas */}
          <Route path="/settings" element={<Settings auth0Domain={auth0Domain} origin={serverOrigin} integrado2={integrado2} setIntegrado2={setIntegrado2} usuario={unibliUser}/>}/>
          <Route path="/bookingDetails" element={<DetalhesReserva />}/>
          <Route path="/maintainCollection" element={<ManterAcervo/>}/>

          {/* Rotas Públicas */}
          <Route path="/" element={<ConsultarTitulos origin={serverOrigin}/>}/>
          <Route path="/reserveTitles/:bookId" element={<ReservarTitulos origin={serverOrigin}/>}/>
          <Route path="/consultTitles/" element={<ResultadoConsultarTitulos origin={serverOrigin}/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>    
        <FooterPage/>
      </BrowserRouter>

     
    </>
  );
}

export default App;
