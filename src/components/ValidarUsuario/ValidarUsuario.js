import styles from './styles/ValidarUsuario.module.css';
import React, { useRef, useState, useMemo } from 'react';
import { useUser } from '../../context/UserContext';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import axios from 'axios';
import { Tag } from 'primereact/tag';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const ValidarUsuario = () => {
  const { 
    usuariosNaoValidados, 
    serverOrigin, 
    fetchUsuariosNaoValidados, 
    fatecs
  } = useUser();

  const toast = useRef(null);
  const [filtros, setFiltros] = useState({
    nome: '',
    email: '',
    cpf: '',
    ra: '',
    fatec: null
  });

  // Função para aplicar os filtros
  const usuariosFiltrados = useMemo(() => {
    return usuariosNaoValidados.filter(usuario => {
      const matchesNome = !filtros.nome || 
        usuario.nome.toLowerCase().includes(filtros.nome.toLowerCase());
      
      const matchesEmail = !filtros.email || 
        usuario.email.toLowerCase().includes(filtros.email.toLowerCase());
      
      const matchesCPF = !filtros.cpf || 
        usuario.cpf.includes(filtros.cpf);
      
      const matchesRA = !filtros.ra || 
        usuario.ra.includes(filtros.ra);
      
      const matchesFatec = !filtros.fatec || 
        usuario.fk_id_fatec === filtros.fatec;

      return matchesNome && matchesEmail && matchesCPF && matchesRA && matchesFatec;
    });
  }, [usuariosNaoValidados, filtros]);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };

  const validarUsuario = async (auth0UserId, nome) => {
    try {
      await axios.put(`${serverOrigin}/usuarios/validar/${auth0UserId}`, { validado: true });
      showToast('success', 'Sucesso!', `Usuário ${nome} validado com sucesso!`);
      fetchUsuariosNaoValidados();
    } catch (error) {
      console.error('Erro ao validar usuário:', error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao validar o usuário.';
      showToast('error', 'Erro', errorMessage);
    }
  };

  const header = (usuario) => (
    <div style={{ display: 'flex', alignItems: 'center', padding: '0rem', gap:'10px'}}>
      <Avatar 
        label={!usuario.picture ? usuario.nome[0] : null} 
        size="large" 
        shape="circle" 
      />
      <div>
        <h5>{usuario.nome}</h5>
        <p>{usuario.email}</p>
      </div>
    </div>
  );

  // Opções para o dropdown de Fatecs
  const opcoesFatecs = [
    { label: 'Todas as Fatecs', value: null },
    ...fatecs.map(fatec => ({
      label: fatec.nome,
      value: fatec.id_fatec
    }))
  ];

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      email: '',
      cpf: '',
      ra: '',
      fatec: null
    });
  };

  return (
    <div className={styles.divValidarUsuario}>
      <Toast ref={toast} />
      <Tag 
        severity="warning" 
        value={`Usuários não validados: ${usuariosFiltrados.length} (Total: ${usuariosNaoValidados.length})`}
        rounded
      ></Tag>

      {/* Componente de Filtro */}
      <div className={styles.filtroContainer}>
        <div className={styles.filtroGrid}>
          <div className={styles.filtroItem}>
            <label htmlFor="nome">Nome:</label>
            <InputText
              id="nome"
              value={filtros.nome}
              onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
              placeholder="Buscar por nome..."
            />
          </div>

          <div className={styles.filtroItem}>
            <label htmlFor="email">Email:</label>
            <InputText
              id="email"
              value={filtros.email}
              onChange={(e) => setFiltros({...filtros, email: e.target.value})}
              placeholder="Buscar por email..."
            />
          </div>

          <div className={styles.filtroItem}>
            <label htmlFor="cpf">CPF:</label>
            <InputText
              id="cpf"
              value={filtros.cpf}
              onChange={(e) => setFiltros({...filtros, cpf: e.target.value})}
              placeholder="Buscar por CPF..."
            />
          </div>

          <div className={styles.filtroItem}>
            <label htmlFor="ra">RA:</label>
            <InputText
              id="ra"
              value={filtros.ra}
              onChange={(e) => setFiltros({...filtros, ra: e.target.value})}
              placeholder="Buscar por RA..."
            />
          </div>

          <div className={styles.filtroItem}>
            <label htmlFor="fatec">Unidade/Polo:</label>
            <Dropdown
              id="fatec"
              value={filtros.fatec}
              options={opcoesFatecs}
              onChange={(e) => setFiltros({...filtros, fatec: e.value})}
              placeholder="Selecione uma Fatec"
            />
          </div>

          <div className={styles.filtroItem}>
            <button 
              className={styles.botaoLimpar}
              onClick={limparFiltros}
            >
              Limpar Filtros
            </button>
          </div>
        </div>
      </div>
      


      {usuariosFiltrados?.length === 0 
        ? (<>
            {usuariosNaoValidados.length === 0 
              ? (
                  <div className={styles.mainResultadoBusca}>
                    <div className={styles.resultadoBusca}>
                        <img 
                          src='../imgStatus/ok-bro.svg' 
                          alt='Ilustração de um detetive' 
                        />
                      </div>
                      <h1 className={styles.txtNoReservationsFound}>
                        Não há usuários pendentes de validação
                      </h1>
                  </div>
              ) 
              : (
                  <div className={styles.mainResultadoBusca}>
                    <div className={styles.resultadoBusca}>
                        <img 
                          src='../imgStatus/questions-bro.svg' 
                          alt='Ilustração de um detetive' 
                        />
                      </div>
                      <h1 className={styles.txtNoReservationsFound}>
                       Nenhum usuário encontrado com os filtros aplicados
                      </h1>
                  </div>
              ) 
            }

          
          </>) 
        : (
          <div className={styles.mainUsuariosNaoValidados}>
            {usuariosFiltrados.map((usuario) => (
              <div className={styles.divCardsUsuariosNaoValidados} key={usuario.auth0UserId}>
                <Card className={styles.cardUsuariosNaoValidados} header={() => header(usuario)}>
                  <div>
                    <p>
                      <strong>CPF:</strong> 
                      {usuario.cpf}
                    </p>
                    <p>
                      <strong>RA:</strong> 
                      {usuario.ra}
                    </p>
                    <p>
                      <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec)?.nome ?? 'Sem Fatec'}
                    </p>
                  </div>
                  <button
                    onClick={() => validarUsuario(usuario.auth0UserId, usuario.nome)} 
                  >
                    Validar Conta 
                  </button>
                </Card>
              </div>
            ))}
          </div>
        )
      }
    </div>
  );
};

export default ValidarUsuario;