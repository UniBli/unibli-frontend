import React, { useState, useEffect } from "react";
import CardFiltro from "./CardFiltro";

import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "primereact/button";

import styles from "./styles/FiltroLivro.module.css";

const FiltroLivro = ({ cursos = [], autores = [], fatecs = [] }) => {
  const [selectedCursos, setSelectedCursos] = useState([]);
  const [selectedAutores, setSelectedAutores] = useState([]);
  const [selectedFatecs, setSelectedFatecs] = useState([]);

  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

   // Inicializa os filtros baseados na URL atual
  useEffect(() => {
    const cursoParam = searchParams.get('cursoId');
    const autorParam = searchParams.get('autor');
    const fatecParam = searchParams.get('fatecId');

    // Limpa os estados atuais
    setSelectedCursos([]);
    setSelectedAutores([]);
    setSelectedFatecs([]);

    // Preenche com os valores da URL
    if (cursoParam) {
      const curso = cursos.find(c => c.id_curso == cursoParam);
      if (curso) setSelectedCursos([curso.nome]);
    }
    
    if (autorParam) {
      setSelectedAutores([autorParam]);
    }
    
    if (fatecParam) {
      const fatec = fatecs.find(f => f.id_fatec == fatecParam);
      if (fatec) setSelectedFatecs([fatec.nome]);
    }
  }, [searchParams, cursos, fatecs]);


  const aplicarFiltros = () => {
    const params = new URLSearchParams();

    // Adiciona apenas o primeiro curso selecionado (ou adapte para múltiplos se necessário)
    if (selectedCursos.length > 0) {
      const cursoSelecionado = cursos.find(curso => curso.nome === selectedCursos[0]);
      if (cursoSelecionado) {
        params.append('cursoId', cursoSelecionado.id_curso);
      }
    }

    // Adiciona apenas o primeiro autor selecionado
    if (selectedAutores.length > 0) {
      params.append('autor', selectedAutores[0]);
    }

    // Adiciona apenas a primeira fatec selecionada
    if (selectedFatecs.length > 0) {
      const fatecSelecionada = fatecs.find(fatec => fatec.nome === selectedFatecs[0]);
      if (fatecSelecionada) {
        params.append('fatecId', fatecSelecionada.id_fatec);
      }
    }

    // Navega para a mesma página com os novos parâmetros
    navigate(`/acervo/consultar?${params.toString()}`);
  };

  const limparFiltros = () => {
    setSelectedCursos([]);
    setSelectedAutores([]);
    setSelectedFatecs([]);
    navigate('/acervo/consultar'); // Volta para a página sem filtros
  };

  const hasActiveFilters = selectedCursos.length > 0 || selectedAutores.length > 0 || selectedFatecs.length > 0;

  return (
    <div className={styles.containerfiltro}>
      <div id={styles.filtro}>
        <div className={styles.header}>
          <div className={styles.filtrarIcoTxt}>
          <Button
            title="Filtrar"
            style={{backgroundColor:'#055904', border:'#055904'}}
            icon={!hasActiveFilters ? "pi pi-filter-slash" : "pi pi-filter"} 
            onClick={aplicarFiltros}
            disabled={!hasActiveFilters}
          />
          <h3 className={styles.txtFiltro}>Filtro</h3>
          </div>
          <Button 
            title="Limpar Filtro"
            style={{backgroundColor:'#055904', border:'#055904'}}
            icon="pi pi-eraser" 
            onClick={limparFiltros}
            disabled={!hasActiveFilters}
          />
        </div>

        <form  onSubmit={(e) => e.preventDefault()}>

          <CardFiltro
            titulo="Cursos"
            lista={cursos}
            valueKey="nome"
            idKey="id_curso"
            selected={selectedCursos}
            setSelected={setSelectedCursos}
          />

          <CardFiltro
            titulo="Autores"
            lista={autores}
            selected={selectedAutores}
            setSelected={setSelectedAutores}
          />

          <CardFiltro
            titulo="Fatecs"
            lista={fatecs}
            valueKey="nome"
            idKey="id_fatec"
            selected={selectedFatecs}
            setSelected={setSelectedFatecs}
          />
        </form>
      </div>
    </div>
  );
};

export default FiltroLivro;
