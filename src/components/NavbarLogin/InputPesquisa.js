// components
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
// hooks
import { useState } from 'react';
// CSS scoped
import styles from './styles/InputPesquisa.module.css';

const InputPesquisa = () => {

    // gerenciando estados
    const [search, setSearch] = useState('');
    
    const handleSearch = (e) => {
        setSearch(e.target.value);
    }

    // função que bloqueia o carregamento da página após o envio do formulário
    const handleSubmit = (e) => {
        e.preventDefault();
        setSearch('');
    }

    return (
        <div className={styles.containerInputPesquisa}>
            <form onSubmit={handleSubmit}
                className='p-inputgroup'
            >
                <InputText
                    placeholder='Pesquise pelo título desejado' 
                    className={styles.inputPesquisa}
                    name='search'
                    onChange={handleSearch}
                    value={search}
                    required
                />
                <Link to={search.trim() !== '' ? `/consultTitles/${search}` : '#'}>
                    <button
                        type='submit'
                        className={styles.buttonPesquisa}
                    >
                        <i className='pi pi-search'></i>
                    </button>
                </Link>

            </form>
        </div>      
    );
};

export default InputPesquisa;
