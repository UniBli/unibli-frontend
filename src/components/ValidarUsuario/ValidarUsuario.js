import styles from './styles/ValidarUsuario.module.css';
import React, { useRef } from 'react';
import { useUser } from '../../context/UserContext';
import { Toast } from 'primereact/toast';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import axios from 'axios';

const ValidarUsuario = () => {
  const { 
    usuariosNaoValidados, 
    serverOrigin, 
    fetchUsuariosNaoValidados, 
    fatecs
  } = useUser();

  console.log('usuariosNaoValidados', usuariosNaoValidados);
  

  const toast = useRef(null);

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };

  const validarUsuario = async (auth0UserId, nome) => {
    try {
      // Endpoint para validar o usuário. Assumindo que o endpoint é /usuarios/validar/{auth0UserId}
      //const response = 
      await axios.put(`${serverOrigin}/usuarios/validar/${auth0UserId}`, { validado: true });
      
      showToast('success', 'Sucesso!', `Usuário ${nome} validado com sucesso!`);
      
      // Atualiza a lista de usuários não validados
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

  return (
    <div className={styles.divValidarUsuario}>
      <Toast ref={toast} />  
      <h4>Contas de Usuários Não Validados ({usuariosNaoValidados.length})</h4>
      
      {usuariosNaoValidados.length === 0 
        ?(
          <p>Não há usuários pendentes de validação.</p>
        ) 
        
        :(
          <div className={styles.mainUsuariosNaoValidados}>
          
          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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


{/* 
          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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

          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
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


          {usuariosNaoValidados.map((usuario) => (
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
                    <strong>Unidade/Polo:</strong> {fatecs.find(fatec => fatec.id_fatec===usuario?.fk_id_fatec).nome ?? 'Sem Fatec'}
                  </p>
                </div>
                <button
                  onClick={() => validarUsuario(usuario.auth0UserId, usuario.nome)} 
                >
                  Validar Conta 
                </button>
              </Card>
            </div>
          ))} */}



        </div>)
      }
    </div>
  );
};

export default ValidarUsuario;
