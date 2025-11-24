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

  //console.log('unidadePolo', unidadePolo);
  // Funções de máscara
  const aplicarMascaraCPF = (valor) => {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
    valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return valor;
  };

  const aplicarMascaraTelefone = (valor) => {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    if (valor.length <= 10) {
      valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
      valor = valor.replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      valor = valor.replace(/(\d{2})(\d)/, '($1) $2');
      valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    }
    return valor;
  };

  const aplicarMascaraCEP = (valor) => {
    if (!valor) return '';
    valor = valor.replace(/\D/g, '');
    valor = valor.replace(/(\d{5})(\d)/, '$1-$2');
    return valor;
  };

  const aplicarMascaraRG = (valor) => {
    if (!valor) return '';
    
    // Remove tudo exceto letras, números e traço
    let valorLimpo = valor.replace(/[^\w-]/g, '');
    valorLimpo = valorLimpo.toUpperCase();
    
    // Se já tem traço, separa o corpo do dígito
    if (valorLimpo.includes('-')) {
      const [corpo, digito] = valorLimpo.split('-');
      const corpoFormatado = corpo
        .replace(/^([A-Z0-9]{2})([A-Z0-9]{3})?([A-Z0-9]{3})?/, (match, p1, p2, p3) => {
          if (p3) return `${p1}.${p2}.${p3}`;
          if (p2) return `${p1}.${p2}`;
          return p1;
        });
      return digito ? `${corpoFormatado}-${digito}` : corpoFormatado;
    }
    
    // Se não tem traço, aplica a formatação progressiva
    if (valorLimpo.length <= 2) {
      return valorLimpo;
    } else if (valorLimpo.length <= 5) {
      return valorLimpo.replace(/^([A-Z0-9]{2})([A-Z0-9]+)/, '$1.$2');
    } else if (valorLimpo.length <= 8) {
      return valorLimpo.replace(/^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]+)/, '$1.$2.$3');
    } else {
      // Para 9+ caracteres: formata como XX.XXX.XXX-X
      const corpo = valorLimpo.substring(0, 8);
      const digito = valorLimpo.substring(8, 9);
      return corpo.replace(/^([A-Z0-9]{2})([A-Z0-9]{3})([A-Z0-9]{3})/, '$1.$2.$3') + (digito ? `-${digito}` : '');
    }
  };
    
  useEffect(() => {
    if (usuarioUnibliBd) {
      setNome(usuarioUnibliBd.nome ?? user?.name ?? '');
      setEmail(usuarioUnibliBd.email ?? user?.email ?? '');
      
      // Aplicar máscaras nos campos quando os dados forem carregados
      setCpf(aplicarMascaraCPF(usuarioUnibliBd.cpf) ?? '');
      setRg(aplicarMascaraRG(usuarioUnibliBd.rg) ?? '');
      setRa(usuarioUnibliBd.ra ?? '');
      setTel(aplicarMascaraTelefone(usuarioUnibliBd.telefone) ?? '');
      setCep(aplicarMascaraCEP(usuarioUnibliBd.cep) ?? '');
      setEndereco(usuarioUnibliBd.endereco ?? '');
      setNumResidencial(usuarioUnibliBd.numResidencia ?? '');
      setComplemento(usuarioUnibliBd.complemento ?? '');
      setMatricula(usuarioUnibliBd.matricula ?? '');

      // Garantindo que as flags sejam booleanas (ou null/undefined)
      setValidado(usuarioUnibliBd.validado ?? false);

      setUnidadePolo(fatecs.find(fatec => fatec.id_fatec===usuarioUnibliBd?.fk_id_fatec)?.id_fatec ?? '');
    }
  }, [usuarioUnibliBd, user, fatecs]);

  // Funções de validação
  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validarCPF = (cpf) => {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11) return false;
    
    // Validação de CPF (algoritmo de validação)
    let soma = 0;
    let resto;
    
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    for (let i = 1; i <= 9; i++) {
      soma = soma + parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
      soma = soma + parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
  };

  const validarRG = (rg) => {
    // RG pode conter letras e números, 9 caracteres
    return rg.replace(/[^\w]/g, '').length >= 9;
  };

  // Handlers para os campos com máscara
  const handleCpfChange = (e) => {
    const valor = e.target.value;
    const valorComMascara = aplicarMascaraCPF(valor);
    setCpf(valorComMascara);
  };

  const handleTelefoneChange = (e) => {
    const valor = e.target.value;
    const valorComMascara = aplicarMascaraTelefone(valor);
    setTel(valorComMascara);
  };

  const handleCepChange = (e) => {
    const valor = e.target.value;
    const valorComMascara = aplicarMascaraCEP(valor);
    setCep(valorComMascara);
  };

  const handleRgChange = (e) => {
    const valor = e.target.value;
    const valorComMascara = aplicarMascaraRG(valor);
    setRg(valorComMascara);
  };

  const handleRaChange = (e) => {
    // Permite apenas números para RA
    const valor = e.target.value.replace(/\D/g, '');
    setRa(valor);
  };

  const handleNumResidencialChange = (e) => {
    // Permite números e letras, mas remove caracteres especiais
    const valor = e.target.value.replace(/[^\w\s]/gi, '');
    setNumResidencial(valor);
  };

  const showToast = (severity, summary, detail) => {
    toast.current.show({ severity, summary, detail, life: 5000 });
  };

  const validarFormulario = () => {
    // Validação de campos obrigatórios
    if (!nome.trim()) {
      showToast('error', 'Erro', 'Nome é obrigatório');
      return false;
    }

    if (!email.trim()) {
      showToast('error', 'Erro', 'E-mail é obrigatório');
      return false;
    }

    if (!validarEmail(email)) {
      showToast('error', 'Erro', 'E-mail inválido');
      return false;
    }

    if (!cpf.trim()) {
      showToast('error', 'Erro', 'CPF é obrigatório');
      return false;
    }

    const cpfSemMascara = cpf.replace(/\D/g, '');
    if (!validarCPF(cpfSemMascara)) {
      showToast('error', 'Erro', 'CPF inválido');
      return false;
    }

    if (!rg.trim()) {
      showToast('error', 'Erro', 'RG é obrigatório');
      return false;
    }

    if (!validarRG(rg)) {
      showToast('error', 'Erro', 'RG deve ter 9 caracteres');
      return false;
    }

    if (!tel.trim()) {
      showToast('error', 'Erro', 'Telefone é obrigatório');
      return false;
    }

    if (!unidadePolo) {
      showToast('error', 'Erro', 'Unidade/Polo é obrigatório');
      return false;
    }

    // Validações específicas para alunos (não bibliotecários)
    if (!bibliotecario) {
      if (!ra.trim()) {
        showToast('error', 'Erro', 'RA é obrigatório');
        return false;
      }

      if (!cep.trim()) {
        showToast('error', 'Erro', 'CEP é obrigatório');
        return false;
      }

      if (!endereco.trim()) {
        showToast('error', 'Erro', 'Endereço é obrigatório');
        return false;
      }

      if (!numResidencial.trim()) {
        showToast('error', 'Erro', 'Número residencial é obrigatório');
        return false;
      }
    }

    // Validações específicas para bibliotecários
    if (bibliotecario && !matricula.trim()) {
      showToast('error', 'Erro', 'Matrícula é obrigatória para bibliotecários');
      return false;
    }

    return true;
  };

  const cadastrar = async () => {
    setLoading(true);
    try {
      const userDataPayload = {
        nome: nome.trim(), 
        cpf: cpf.replace(/\D/g, ''), 
        endereco: endereco.trim(), 
        numResidencia: numResidencial.trim(), 
        complemento: complemento.trim(), 
        cep: cep.replace(/\D/g, ''), 
        telefone: tel.replace(/\D/g, ''), 
        email: email.trim(), 
        ra: ra.trim(), 
        matricula: matricula.trim(), 
        tipoBibliotecario: bibliotecario, 
        validado: validado,
        auth0UserId: user?.sub, 
        rg: rg, // Mantém letras no RG
        unidadePolo: unidadePolo,
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
        nome: nome.trim(),
        cpf: cpf.replace(/\D/g, ''),
        endereco: endereco.trim(),
        numResidencia: numResidencial.trim(),
        complemento: complemento.trim(),
        cep: cep.replace(/\D/g, ''),
        telefone: tel.replace(/\D/g, ''),
        email: email.trim(),
        ra: ra.trim(),
        rg: rg, // Mantém letras no RG
        // Incluindo as flags e unidadePolo para atualização
        tipoBibliotecario: bibliotecario,
        validado: validado,
        fk_id_fatec: unidadePolo,
        ...(bibliotecario && { matricula: matricula.trim() })
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
    
    if (!validarFormulario()) {
      return;
    }
    
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
        <section className={styles.dadosPessoais}>
          <div>
            <label>
              <span>Nome:*</span>
              <input 
                type="text" 
                name="nome" 
                placeholder="Digite o seu nome" 
                onChange={(e) => setNome(e.target.value)} 
                value={nome} 
                required 
                disabled={loading} 
                maxLength={255}
              />
            </label>
            <label>
              <span>E-mail:*</span>
              <input 
                type="email" 
                name="email" 
                placeholder="Digite o seu e-mail" 
                onChange={(e) => setEmail(e.target.value)} 
                value={email} 
                required 
                disabled={loading} 
                maxLength={255}
              />
            </label>
          </div>
          <div>
            <label>
              <span>CPF:*</span>
              <input 
                type="text" 
                name="cpf" 
                placeholder="Digite o seu CPF" 
                onChange={handleCpfChange}
                value={cpf} 
                required 
                disabled={loading} 
                maxLength={14}
              />
            </label>
            <label>
              <span>RG:*</span>
              <input 
                type="text" 
                name="rg" 
                placeholder="Digite o seu RG" 
                onChange={handleRgChange}
                value={rg} 
                required 
                disabled={loading} 
                maxLength={12}
              />
            </label>
          </div>
          <div>
            {!bibliotecario && (
              <label>
                <span>RA:*</span>
                <input 
                  type="text" 
                  name="ra" 
                  placeholder="Digite o seu RA" 
                  onChange={handleRaChange}
                  value={ra} 
                  required 
                  disabled={loading} 
                  maxLength={255}
                />
              </label>
            )}
            
            <label>
              <span>Telefone/Celular:*</span>
              <input 
                type="tel" 
                name="tel" 
                placeholder="Digite seu número de tel. ou cel." 
                onChange={handleTelefoneChange}
                value={tel} 
                required 
                disabled={loading} 
                maxLength={15}
              />
            </label>
            {!!bibliotecario && (<label></label>)}
          </div>
        </section>

        {!bibliotecario && (
          <section className={styles.dadosEndereco}>
            <div>
              <label>
                <span>CEP:*</span>
                <input 
                  type="text" 
                  name="cep" 
                  placeholder="Digite o seu CEP" 
                  onChange={handleCepChange}
                  value={cep} 
                  required 
                  disabled={loading} 
                  maxLength={9}
                />
              </label>
              <label>
                <span>Endereço:*</span>
                <input 
                  type="text" 
                  name="endereco" 
                  placeholder="Digite o seu endereco" 
                  onChange={(e) => setEndereco(e.target.value)} 
                  value={endereco} 
                  required 
                  disabled={loading} 
                  maxLength={255}
                />
              </label>
            </div>
            <div>
              <label>
                <span>Número Residencial: *</span>
                <input 
                  type="text" 
                  name="numResidencial" 
                  placeholder="Digite o seu número residencial" 
                  onChange={handleNumResidencialChange}
                  value={numResidencial} 
                  required 
                  disabled={loading} 
                  maxLength={255}
                />
              </label>
              <label>
                <span>Complemento:</span>
                <input 
                  type="text" 
                  name="complemento" 
                  placeholder="Digite o seu complemento" 
                  onChange={(e) => setComplemento(e.target.value)} 
                  value={complemento} 
                  disabled={loading} 
                  maxLength={255}
                />
              </label>
            </div>
          </section>
        )}
        
        <section className={styles.dadosBibliotecario}>
          <div>
            {!!bibliotecario &&(
              <label>
                <span>Matrícula: {!!!bibliotecario && '*'}</span>
                <input 
                  type="text" 
                  name="matricula" 
                  placeholder="Sua Matrícula" 
                  onChange={(e) => setMatricula(e.target.value)} 
                  value={matricula} 
                  required
                  disabled={loading || (!!bibliotecario && 'disabled')}
                  maxLength={255}
                />
              </label>
            )}
            <label>
              <span>Unidade/Polo:{!!!bibliotecario && '*'}</span>
              <Dropdown 
                value={unidadePolo} 
                onChange={(e) => setUnidadePolo(e.value)} 
                options={fatecs} 
                optionLabel="nome" 
                optionValue="id_fatec"
                placeholder="Selecione a Unidade/Polo" 
                required
                disabled={loading || (!!bibliotecario && 'disabled')}
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
