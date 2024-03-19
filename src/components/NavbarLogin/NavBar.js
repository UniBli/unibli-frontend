// components
import Navbar from 'react-bootstrap/Navbar';
import LoginButton from '../Auth0/LoginButton.js';
import InputPesquisa from './InputPesquisa.js';
import MenuHamburger from '../MenuHamburger/MenuHamburger.js';
import { Link } from 'react-router-dom';

// CSS scoped
import styles from './styles/NavBar.module.css';

const NavBar = ({ books, isAuthenticated  }) => {



    return (
            <Navbar className={styles.navbar}>
                <Link to="/">
                    <Navbar.Brand className={styles.logo}>
                        <img
                        src='https://raw.githubusercontent.com/UniBli/unibli/main/frontend/public/img/logoUniBliNav_F-Positivo.svg'
                        className='d-inline-block align-top'
                        alt='Logo UniBli'
                        />
                    </Navbar.Brand>
                </Link>    
                <InputPesquisa books={books} className={styles.search}/>
                {isAuthenticated ? <MenuHamburger/> : <LoginButton className={styles.loginButton}/>  }              
            </Navbar>
    );
};

export default NavBar;
