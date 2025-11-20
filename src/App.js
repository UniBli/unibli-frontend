import { BrowserRouter, Routes, Route } from "react-router-dom";
import LayoutAutenticado from "./layouts/LayoutAutenticado";
import { useAuth0 } from "@auth0/auth0-react";
//import { useUser } from './context/UserContext'; // Importa o hook do contexto

// Pages
import Settings from './pages/SettingsPage/Settings.js';
import DetalhesReserva from './pages/DetalhesReservaPage/DetalhesReserva.js';
import ManterAcervo from './pages/ManterAcervoPage/ManterAcervo.js';
import ReservarTitulos from './pages/ReservarTitulosPage/ReservarTitulos.js';
import ConsultarTitulos from './pages/ConsultarTitulosPage/ConsultarTitulos.js';
import ResultadoConsultarTitulos from './pages/ConsultarTitulosPage/ResultadoConsultarTitulos.js'
import NotFound from "./pages/NotFoundPage/NotFound.js";

// Components
import NavBar from "./components/NavbarLogin/NavBar";
import FooterPage from "./components/FooterPage/FooterPage";

// Styles
import './App.css'

const App = () => {
  const logoUniBliNavFPositivo = process.env.PUBLIC_URL + "/img/logoUniBliNav_F_Positivo.svg";
  const logoUniBliTextoFNegativo = process.env.PUBLIC_URL + "/img/logoUniBliTexto_F_Negativo.svg";
  const imgNotFoundPath = process.env.PUBLIC_URL + "/imgStatus/404-bro.svg"; 
  
  // A única responsabilidade do App.js agora é o roteamento e layout principal.
  // Os estados de usuário foram movidos para o UserContext.
  const { isAuthenticated } = useAuth0();

  return (
    <>
      <BrowserRouter>    
        {/* O NavBar não precisa mais de props relacionadas ao usuário */}
        <NavBar 
          logo={logoUniBliNavFPositivo} 
          isAuthenticated={isAuthenticated} 
        />
        
        <Routes>       
          {/* Rotas Privadas: Os componentes internos buscarão os dados do contexto */}
          <Route 
            path="/settings" 
            element={
              <LayoutAutenticado>
                <Settings />
              </LayoutAutenticado>
            }
          />
          <Route 
            path="/detalhes/reserva" 
            element={
              <LayoutAutenticado>
                <DetalhesReserva />
              </LayoutAutenticado>
            }
          />
          <Route 
            path="/maintainCollection" 
            element={
              <LayoutAutenticado>
                <ManterAcervo/>
              </LayoutAutenticado>
            }
          />

          {/* Rotas Públicas: Os componentes internos buscarão os dados do contexto */}
          <Route path="/" element={<ConsultarTitulos />}/>
          <Route path="/reservar/livro/:bookId" element={<ReservarTitulos />}/>
          <Route path="/acervo/consultar" element={<ResultadoConsultarTitulos />}/>
          <Route path="*" element={<NotFound statusImg={imgNotFoundPath}/>}/>
        </Routes>    
        <FooterPage logo={logoUniBliTextoFNegativo}/>
      </BrowserRouter>
    </>
  );
}

export default App;
