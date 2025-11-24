import styles from './styles/EditarConta.module.css';
import { useAuth0 } from '@auth0/auth0-react';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
//import { InputSwitch } from 'primereact/inputswitch';
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

const EditarConta = () => {
  
  const toast = useRef(null);
  
  const { 
    usuarioUnibliBd, 
    integrado, 
    serverOrigin, 
    setUsuarioUnibliBd,
    bibliotecario,
    fatecs // Consumindo a lista de Fatecs do contexto
  } = useUser();

  const { user } = useAuth0(); 
  //console.log('user',user.sub);
  //console.log('usuarioUnibliBd',usuarioUnibliBd.auth0UserId);
   
  // Estados locais para o formulário
  const [nome, setNome] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [cpf, setCpf] = useState('');
  const [rg, setRg] = useState('');
  const [ra, setRa] = useState('');
  const [tel, setTel] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numResidencial, setNumResidencial] = useState('');
  const [complemento, setComplemento] = useState('');
  const [matricula, setMatricula] = useState('');
  const [unidadePolo, setUnidadePolo] = useState('');
  const [loading, setLoading] = useState(false);
  const [validado, setValidado] = useState(false);

  console.log('unidadePolo', unidadePolo);
  
    
    useEffect(() => {
    if (usuarioUnibliBd) {
      setNome(usuarioUnibliBd.nome ?? user?.name ?? '');
      setEmail(usuarioUnibliBd.email ?? user?.email ?? '');
      setCpf(usuarioUnibliBd.cpf ?? '');
      setRg(usuarioUnibliBd.rg ?? '');
      setRa(usuarioUnibliBd.ra ?? '');
      setTel(usuarioUnibliBd.telefone ?? '');
      setCep(usuarioUnibliBd.cep ?? '');
      setEndereco(usuarioUnibliBd.endereco ?? '');
      setNumResidencial(usuarioUnibliBd.numResidencia ?? '');
      setComplemento(usuarioUnibliBd.complemento ?? '');
      setMatricula(usuarioUnibliBd.matricula ?? '');

      // Garantindo que as flags sejam booleanas (ou null/undefined)
      setValidado(usuarioUnibliBd.validado ?? false);

      setUnidadePolo(fatecs.find(fatec => fatec.id_fatec===usuarioUnibliBd?.fk_id_fatec).id_fatec ?? '');
    }
  }, [usuarioUnibliBd, user, fatecs]);



  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };

  const cadastrar = async () => {
    setLoading(true);
    try {
      const userDataPayload = {
        nome, cpf, endereco, "numResidencia": numResidencial, complemento, cep, 
	        "telefone": tel, email, ra, matricula, 
	        "tipoBibliotecario": bibliotecario, 
	        "validado": validado,
	        "auth0UserId": user?.sub, rg, 
	        "unidadePolo": unidadePolo,
      };

      const response = await axios.post(`${serverOrigin}/usuarios/cadastrar/usuario`, userDataPayload);
      
      showToast('success', 'Sucesso!', response.data.message || 'Cadastro realizado com sucesso!');
      
      if (response.data.usuario) {
        setUsuarioUnibliBd(response.data.usuario);
      }
    } catch (error) {
      console.error('Erro no processo de cadastro:', error);
      const errorMessage = error.response?.data?.error || 'Ocorreu um erro ao salvar seus dados.';
      showToast('error', 'Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const atualizar = async () => {
    setLoading(true);
    try {
      const auth0UserId = user?.sub;
      if (!auth0UserId) {
        throw new Error("ID do usuário não encontrado para atualização.");
      }

      console.log('const atualizar = async', unidadePolo);
      

      const dadosAtualizados = {
	        nome, cpf, endereco, numResidencia: numResidencial, complemento, cep, 
	        telefone: tel, email, ra, rg,
	        // Incluindo as flags e unidadePolo para atualização
	        tipoBibliotecario: bibliotecario,
	        validado: validado,
	        fk_id_fatec: unidadePolo,
	      };

      const response = await axios.put(`${serverOrigin}/usuarios/atualizar/${auth0UserId}`, dadosAtualizados);

      showToast('success', 'Sucesso!', response.data.message || 'Dados atualizados com sucesso!');

      if (response.data.usuario) {
        setUsuarioUnibliBd(response.data.usuario);
      }
    } catch (error) {
      console.error('Erro no processo de atualização:', error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao atualizar seus dados.';
      showToast('error', 'Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (integrado) {
      atualizar();
    } else {
      cadastrar();
    }
  };

  return (   
    <div className={styles.divEditarconta}>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit}>
        {/* O JSX do formulário permanece o mesmo */}
        <section className={styles.dadosPessoais}>
          <div>
            <label><span>Nome:*</span><input type="text" name="nome" placeholder="Digite o seu nome" onChange={(e) => setNome(e.target.value)} value={nome} required disabled={loading} /></label>
            <label><span>E-mail:*</span><input type="email" name="email" placeholder="Digite o seu e-mail" onChange={(e) => setEmail(e.target.value)} value={email} required disabled={loading} /></label>
          </div>
          <div>
            <label><span>CPF:*</span><input type="text" name="cpf" placeholder="Digite o seu CPF" onChange={(e) => setCpf(e.target.value)} value={cpf} required disabled={loading} /></label>
            <label><span>RG:*</span><input type="text" name="rg" placeholder="Digite o seu RG" onChange={(e) => setRg(e.target.value)} value={rg} required disabled={loading} /></label>
          </div>
          <div>
            {!bibliotecario && (
              <label>
                <span>RA:*</span>
                <input 
                  type="text" name="ra" placeholder="Digite o seu RA" 
                  onChange={(e) => setRa(e.target.value)} 
                  value={ra} required disabled={loading} 
                />
              </label>
            )}
            
            <label>
              <span>Telefone/Celular:*</span>
              <input 
                type="tel" name="tel" placeholder="Digite seu número de tel. ou cel." 
                onChange={(e) => setTel(e.target.value)} 
                value={tel} required disabled={loading} 
              />
            </label>
            {!!bibliotecario && (<label></label>)}
          </div>
        </section>

        {!bibliotecario && (
          <section className={styles.dadosEndereco}>
            <div>
              <label><span>CEP:*</span><input type="text" name="cep" placeholder="Digite o seu CEP" onChange={(e) => setCep(e.target.value)} value={cep} required disabled={loading} /></label>
              <label><span>Endereço:*</span><input type="text" name="endereco" placeholder="Digite o seu endereco" onChange={(e) => setEndereco(e.target.value)} value={endereco} required disabled={loading} /></label>
            </div>
            <div>
              <label><span>Número Residencial: *</span><input type="text" name="numResidencial" placeholder="Digite o seu número residencial" onChange={(e) => setNumResidencial(e.target.value)} value={numResidencial} required disabled={loading} /></label>
              <label><span>Complemento:</span><input type="text" name="complemento" placeholder="Digite o seu complemento" onChange={(e) => setComplemento(e.target.value)} value={complemento} disabled={loading} /></label>
            </div>
          </section>
        )}
        
          <section className={styles.dadosBibliotecario}>
            <div>
              {!!bibliotecario &&(
                <label><span>Matrícula:</span><input type="text" name="matricula" placeholder="Sua Matrícula" onChange={(e) => setMatricula(e.target.value)} value={matricula} required/></label>
              )}
              <label>
                <span>Unidade/Polo:*</span>
                <Dropdown 
                  value={unidadePolo} 
                  onChange={(e) => setUnidadePolo(e.value)} 
                  options={fatecs} 
                  optionLabel="nome" 
                  optionValue="id_fatec" // O valor selecionado será o ID da Fatec
                  placeholder="Selecione a Unidade/Polo" 
                  required
                  disabled={loading}
                  className={styles.dropdownFatec}
                />
              </label>
               {!bibliotecario && (<label></label>)}
            </div>
          </section>

        {loading ? (<button disabled>Carregando...</button>) : (<button>{integrado ? 'Atualizar' : 'Cadastrar'}</button>)}
      </form>
    </div>
  );
}

export default EditarConta;