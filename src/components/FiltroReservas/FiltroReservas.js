import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import styles from './styles/FiltroReservas.module.css';

const FiltroReservas = ({ reservas, onFiltroChange, fatecs }) => {
  const [filtros, setFiltros] = useState({
    ra: '',
    nomeUsuario: '',
    fatec: '',
    tituloLivro: '',
    idReserva: '',
    status: 'ativa',
    dataReserva: '',
    dataExpiracao: ''
  });

  // Preparar opções para os Dropdowns
  const opcoesStatus = [
    { label: 'Todos os status', value: '' },
    { label: 'Ativa', value: 'ativa' },
    { label: 'Finalizada', value: 'finalizada' },
    { label: 'Cancelada', value: 'cancelada' },
    { label: 'Expirada Processada', value: 'expirada_processada' }
  ];

  const opcoesFatecs = [
    { label: 'Todas as Fatecs', value: '' },
    ...fatecs.map(fatec => ({
      label: fatec.nome,
      value: fatec.nome
    }))
  ];

  const handleFiltroChange = (campo, valor) => {
    const novosFiltros = {
      ...filtros,
      [campo]: valor
    };
    
    setFiltros(novosFiltros);
    onFiltroChange(novosFiltros);
  };

  const limparFiltros = () => {
    const filtrosLimpos = {
      ra: '',
      nomeUsuario: '',
      fatec: '',
      tituloLivro: '',
      idReserva: '',
      status: 'ativa',
      dataReserva: '',
      dataExpiracao: ''
    };
    
    setFiltros(filtrosLimpos);
    onFiltroChange(filtrosLimpos);
  };

  return (
    <div className={styles.filtroContainer}>      
      <div className={styles.gridFiltros}>
        {/* RA do Usuário */}
        <div className={styles.grupoFiltro}>
          <label>RA:</label>
          <input
            type="text"
            value={filtros.ra}
            onChange={(e) => handleFiltroChange('ra', e.target.value)}
            placeholder="Digite o RA..."
            className={styles.input}
          />
        </div>

        {/* Nome do Usuário */}
        <div className={styles.grupoFiltro}>
          <label>Nome do usuário:</label>
          <input
            type="text"
            value={filtros.nomeUsuario}
            onChange={(e) => handleFiltroChange('nomeUsuario', e.target.value)}
            placeholder="Digite o nome..."
            className={styles.input}
          />
        </div>

        {/* Fatec - Agora com Dropdown */}
        <div className={styles.grupoFiltro}>
          <label>Fatec:</label>
          <Dropdown
            value={filtros.fatec}
            onChange={(e) => handleFiltroChange('fatec', e.value)}
            options={opcoesFatecs}
            placeholder="Selecione a Fatec"
            className={styles.dropdown}
          />
        </div>

        {/* Título do Livro */}
        <div className={styles.grupoFiltro}>
          <label>Título do livro:</label>
          <input
            type="text"
            value={filtros.tituloLivro}
            onChange={(e) => handleFiltroChange('tituloLivro', e.target.value)}
            placeholder="Digite o título..."
            className={styles.input}
          />
        </div>

        {/* ID da Reserva */}
        <div className={styles.grupoFiltro}>
          <label>ID da Reserva:</label>
          <input
            type="text"
            value={filtros.idReserva}
            onChange={(e) => handleFiltroChange('idReserva', e.target.value)}
            placeholder="Digite o ID..."
            className={styles.input}
          />
        </div>

        {/* Status - Agora com Dropdown */}
        <div className={styles.grupoFiltro}>
          <label>Status:</label>
          <Dropdown
            value={filtros.status}
            onChange={(e) => handleFiltroChange('status', e.value)}
            options={opcoesStatus}
            placeholder="Selecione o status"
            className={styles.dropdown}
          />
        </div>

        {/* Data da Reserva */}
        <div className={styles.grupoFiltro}>
          <label>Data da Reserva:</label>
          <input
            type="date"
            value={filtros.dataReserva}
            onChange={(e) => handleFiltroChange('dataReserva', e.target.value)}
            className={styles.input}
          />
        </div>

        {/* Data de Expiração */}
        <div className={styles.grupoFiltro}>
          <label>Data de Expiração:</label>
          <input
            type="date"
            value={filtros.dataExpiracao}
            onChange={(e) => handleFiltroChange('dataExpiracao', e.target.value)}
            className={styles.input}
          />
        </div>
      </div>

      <button 
        onClick={limparFiltros}
        className={styles.botaoLimpar}
      >
        Limpar Filtros
      </button>
    </div>
  );
};

export default FiltroReservas;