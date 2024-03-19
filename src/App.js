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

  //Objeto de teste
  /**/
  const books =[
    {id:1, disponibilidade: 1, qtd: 1, img:'https://books.google.com.br/books/publisher/content?id=MWkOEAAAQBAJ&hl=pt-BR&pg=PA2&img=1&zoom=3&sig=ACfU3U2bTyWRW6_GMC3Qh3gqEkM8hKxBLg&w=1280', nome:'Livro TESTE1'},
    {id:2, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE2'},
    {id:3, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE3'},
    {id:4, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE4'},
    {id:5, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE5'},
    {id:6, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE6'},
    {id:7, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE7'},
    {id:8, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE8'},
    {id:9, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE9'},
    {id:10, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE10'},
    {id:11, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE11'},
    {id:12, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE12'},
    {id:13, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE13'},
    {id:14, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE14'},
    {id:15, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE15'},
    {id:16, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE16'},
    {id:17, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE17'},
    {id:18, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE18'},
    {id:19, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE19'},
    {id:20, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE20'},
    {id:21, disponibilidade: 1, qtd: 1, img:'', nome:'Livro TESTE21'},
  ]
  /**/

  return (
    <>
      <BrowserRouter>    
        <NavBar books={books} isAuthenticated={isAuthenticated} />
        
        <Routes>       
          {/* Rotas Privadas */}
          <Route path="/settings" element={<Settings/>}/>
          <Route path="/bookingDetails" element={<DetalhesReserva/>}/>
          <Route path="/maintainCollection" element={<ManterAcervo/>}/>

          {/* Rotas Públicas */}
          <Route path="/" element={<ConsultarTitulos books={books}/>}/>
          <Route path="/reserveTitles/:bookId" element={<ReservarTitulos books={books}/>}/>
          <Route path="/consultTitles/:titleBook" element={<ResultadoConsultarTitulos books={books}/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>    
        <FooterPage/>
      </BrowserRouter>

     
    </>
  );
}

export default App;
