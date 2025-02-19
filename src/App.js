// hooks
import { useAuth0 } from "@auth0/auth0-react";

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

const App = () => {
  // hook do auth0
  const {isAuthenticated} = useAuth0();

  //variaveis de ambiente configuradas no .env
  const env = process.env.REACT_APP_ENV;
  const local = process.env.REACT_APP_UNIBLI_SERVER_LOCAL;
  const prod = process.env.REACT_APP_UNIBLI_SERVER_HEROKU_HTTPS;
  const auth0Domain =process.env.REACT_APP_AUTH0_DOMAIN;
  const origin = env === "development" ? local : prod 
    

  return (
    <>
      <BrowserRouter>    
        <NavBar isAuthenticated={isAuthenticated} origin={origin} />
        
        <Routes>       
          {/* Rotas Privadas */}
          <Route path="/settings" element={<Settings auth0Domain={auth0Domain} origin={origin}/>}/>
          <Route path="/bookingDetails" element={<DetalhesReserva />}/>
          <Route path="/maintainCollection" element={<ManterAcervo/>}/>

          {/* Rotas Públicas */}
          <Route path="/" element={<ConsultarTitulos origin={origin}/>}/>
          <Route path="/reserveTitles/:bookId" element={<ReservarTitulos origin={origin}/>}/>
          <Route path="/consultTitles/" element={<ResultadoConsultarTitulos origin={origin}/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>    
        <FooterPage/>
      </BrowserRouter>

     
    </>
  );
}

export default App;
