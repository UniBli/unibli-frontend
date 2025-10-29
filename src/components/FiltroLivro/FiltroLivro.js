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

    // Processa parâmetros que podem ser strings separadas por vírgula
    const processParam = (param) => {
      if (!param) return [];
      if (Array.isArray(param)) return param;
      return param.split(',').map(item => item.trim());
    };

    // Preenche com os valores da URL
    if (cursoParam) {
      const cursoIds = processParam(cursoParam);
      const cursosSelecionados = cursos
        .filter(c => cursoIds.includes(c.id_curso.toString()))
        .map(c => c.nome);
      setSelectedCursos(cursosSelecionados);
    }
    
    if (autorParam) {
      // AGORA: autores são processados como array
      const autoresSelecionados = processParam(autorParam);
      setSelectedAutores(autoresSelecionados);
    }
    
    if (fatecParam) {
      const fatecIds = processParam(fatecParam);
      const fatecsSelecionadas = fatecs
        .filter(f => fatecIds.includes(f.id_fatec.toString()))
        .map(f => f.nome);
      setSelectedFatecs(fatecsSelecionadas);
    }
  }, [searchParams, cursos, fatecs]);

  const aplicarFiltros = () => {
    const params = new URLSearchParams();

    // Envia como string separada por vírgula
    if (selectedCursos.length > 0) {
      const cursoIds = selectedCursos
        .map(cursoNome => {
          const cursoSelecionado = cursos.find(curso => curso.nome === cursoNome);
          return cursoSelecionado?.id_curso;
        })
        .filter(id => id !== undefined);
      
      if (cursoIds.length > 0) {
        params.append('cursoId', cursoIds.join(','));
      }
    }

    // AGORA: autores também são enviados como string separada por vírgula
    if (selectedAutores.length > 0) {
      params.append('autor', selectedAutores.join(','));
    }

    if (selectedFatecs.length > 0) {
      const fatecIds = selectedFatecs
        .map(fatecNome => {
          const fatecSelecionada = fatecs.find(fatec => fatec.nome === fatecNome);
          return fatecSelecionada?.id_fatec;
        })
        .filter(id => id !== undefined);
      
      if (fatecIds.length > 0) {
        params.append('fatecId', fatecIds.join(','));
      }
    }

    const url = `/acervo/consultar?${params.toString()}`;
    console.log('Navegando para URL:', url);
    console.log('Parâmetros enviados:', {
      cursos: selectedCursos,
      autores: selectedAutores,
      fatecs: selectedFatecs
    });
    
    navigate(url);
  };

  const limparFiltros = () => {
    setSelectedCursos([]);
    setSelectedAutores([]);
    setSelectedFatecs([]);
    navigate('/acervo/consultar');
  };

  const hasActiveFilters = selectedCursos.length > 0 || selectedAutores.length > 0 || selectedFatecs.length > 0;

  return (
    <div className={styles.containerfiltro}>
      <div id={styles.filtro}>
        <div className={styles.header}>
          <h3 className={styles.txtFiltro}>Filtro</h3>
          <div className={styles.filtrarIcos}>
            <Button
              className={styles.btn_filtrar}
              title="Filtrar"
              icon={!hasActiveFilters ? "pi pi-filter-slash" : "pi pi-filter"} 
              onClick={aplicarFiltros}
              disabled={!hasActiveFilters}
            />
            <Button
              className={styles.btn_limpar}
              title="Limpar Filtro"
              icon="pi pi-eraser" 
              onClick={limparFiltros}
            />
          </div>
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