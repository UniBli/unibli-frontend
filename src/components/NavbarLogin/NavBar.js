import Navbar from 'react-bootstrap/Navbar';
import LoginButton from '../Auth0/LoginButton.js';
import InputPesquisa from './InputPesquisa.js';
import MenuHamburger from '../MenuHamburger/MenuHamburger.js';
import { Link } from 'react-router-dom';
import { useUser } from '../../context/UserContext.js';

// CSS scoped
import styles from './styles/NavBar.module.css';

// Removidas as props 'origin', 'integrado', 'isLoadingUser'
const NavBar = ({logo, isAuthenticated}) => {

    const { erro } = useUser();
    
    return (
        <Navbar className={styles.navbar}>
            <Link to="/">
                <Navbar.Brand className={styles.logo}>
                    <img
                    src={logo}
                    className='d-inline-block align-top'
                    alt='Logo UniBli'
                    />
                </Navbar.Brand>
            </Link>
            {/* Se o erro for diferente de Network Error e se tiver usuarioUnibliBd (true), então ele mostra os campos*/}
            {(erro !== "Network Error" ) && (<>
                <InputPesquisa className={styles.search}/>
                <Link 
                to={`/acervo/consultar`}
                >
                    <p className={styles.verAcervoCompleto}>Ver acervo completo</p>
                </Link>                   
                {isAuthenticated ? <MenuHamburger /> : <LoginButton className={styles.loginButton}/>}
            </>)}
        </Navbar>
    );
};

export default NavBar;
