// components
import { InputText } from 'primereact/inputtext';
import { useNavigate } from 'react-router-dom';
// hooks
import { useState } from 'react';
// CSS scoped
import styles from './styles/InputPesquisa.module.css';

const InputPesquisa = () => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/acervo/consultar?titulo="+search)
    }

    return (
        <div className={styles.containerInputPesquisa}>
            <form onSubmit={handleSubmit}
                className='p-inputgroup'
            >
                <InputText
                    placeholder='Pesquise o título desejado' 
                    className={styles.inputPesquisa}
                    name='search'
                    onChange={(e)=> setSearch(e.target.value)}
                    value={search}
                    required
                />
                <button
                    type='submit'
                    className={styles.buttonPesquisa}
                >
                    <i className='pi pi-search'></i>
                </button>

            </form>
        </div>      
    );
};

export default InputPesquisa;
