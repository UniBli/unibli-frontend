import styles from './styles/EditarConta.module.css';

import { useAuth0 } from '@auth0/auth0-react';

import { Toast } from 'primereact/toast';

import { useState, useRef  } from 'react';

import axios from 'axios';

const EditarConta = ({auth0Domain, origin, integrado2, setIntegrado2,  usuario}) => {
  
    const toast = useRef(null);

    const showSuccess = () => {
        toast.current.show({severity:'success', summary: 'Success', detail:'Usuário cadastrado!', life: 3000});
    }
    const showError = () => {
      toast.current.show({severity:'error', summary: 'Error', detail:'Usuário não cadastrado!', life: 3000});
    }

    const {user} = useAuth0();


  const [nome, setNome] = useState(user?.name ? user?.name : '');
  const [email, setEmail] = useState(user?.email ? user?.email : '');
  const [cpf, setCpf] = useState(usuario?.cpf ? usuario?.cpf : '')
  const [rg, setRg] = useState(usuario?.rg ? usuario?.rg : '')
  const [ra, setRa] = useState(usuario?.ra ? usuario?.ra : '')
  const [tel, setTel] = useState(usuario?.telefone ? usuario?.telefone : '')
  const [cep, setCep] = useState(usuario?.cep ? usuario?.cep : '')
  const [endereco, setEndereco] = useState(usuario?.endereco ? usuario?.endereco : '')
  const [numResidencial, setNumResidencial] = useState(usuario?.numResidencia ? usuario?.numResidencia : '')
  const [complemento, setComplemento] = useState(usuario?.complemento ? usuario?.complemento : '')
  const [matricula, setMatricula] = useState(usuario?.matricula ? usuario?.matricula : '') 
  const [unidadePolo, setUnidadePolo] = useState(usuario?.FatecId ? usuario?.FatecId : '')
  

  const [loading, setLoading] = useState(false);


  const cadastrar = () => {
    (async () =>{
      setLoading(true)
  
      //Get Toke Auth0
      const res = await axios.get(`${origin}/auth0/token`);
      const token = res.data.access_token;

      //Update User Auth0
      const data = {
        email,
        name: nome
      };
      await axios.patch(`https://${auth0Domain}/api/v2/users/${user.sub}`, data, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        console.log('Usuário atualizado com sucesso:', response.data);
      })
      .catch(error => {
        console.error('Erro ao atualizar o usuário:', error.response ? error.response.data : error.message);
      });

      //Create no UniBli - Aiven
      await axios.post(`${origin}/usuarios/cadastrar/user`, {
        nome, 
        cpf, 
        endereco, 
        "numResidencia": numResidencial, 
        complemento, 
        cep, 
        "telefone":tel, 
        email, 
        ra, 
        matricula, 
        'tipoBibliotecario':null,
        "auth0UserId": user.sub,
        rg,
        unidadePolo,
      })
      .then(function (response) {
        console.log(response);
        setIntegrado2(true); 
        showSuccess();
      })
      .catch(function (error) {
        console.error(error)
        setIntegrado2(false);
        showError();
      });
      setLoading(false)
    })();
  }

  const handleSubmit = (event) => {
    event.preventDefault();
      cadastrar();
    
}


  return (   
  <div className={styles.divEditarconta}>
    <Toast ref={toast} />
    <form onSubmit={handleSubmit}>
      
      <section className={styles.dadosPessoais}>
        {/* Nome e Email */}
        <div>
          <label>
              <span>Nome:*</span>
              <input type="text" name="nome" placeholder="Digite o seu nome"
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                  required
                  disabled={loading ? true : false}
              />
          </label>

          <label>
              <span>E-mail:*</span>
              <input type="email" name="email" placeholder="Digite o seu e-mail"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required
                  disabled={loading ? true : false}
              />
          </label>
        </div>

        {/* CPF e RG */}
        <div>
          <label>
              <span>CPF:*</span>
              <input type="text" name="cpf" placeholder="Digite o seu CPF"
                  onChange={(e) => setCpf(e.target.value)}
                  value={cpf}
                  required
                  disabled={loading ? true : false}
              />
          </label>

          <label>
              <span>RG:*</span>
              <input type="text" name="rg" placeholder="Digite o seu RG"
                  onChange={(e) => setRg(e.target.value)}
                  value={rg}
                  required
                  disabled={loading ? true : false}
              />
          </label>
        </div>

        {/* RA e Celular */}
        <div>
          {
            !user.profile && (
              <label>
              <span>RA:*</span>
              <input type="text" name="ra" placeholder="Digite o seu RA"
                  onChange={(e) => setRa(e.target.value)}
                  value={ra}
                  required
                  disabled={loading ? true : false}
              />
              </label>
            )
          }
          <label>
              <span>Telefone/Celular:*</span>
              <input type="tel" name="tel" placeholder="Digite seu número de tel. ou cel."
                  onChange={(e) => setTel(e.target.value)}
                  value={tel}
                  required
                  disabled={loading ? true : false}  
              />
          </label>
        </div>
      </section>

      <section className={styles.dadosEndereco}>
        {/* CEP e Endereço */}
        <div>
          <label>
              <span>CEP:*</span>
              <input type="text" name="cep" placeholder="Digite o seu CEP"
                  onChange={(e) => setCep(e.target.value)}
                  value={cep}
                  required
                  disabled={loading ? true : false}  
              />
          </label>

          <label>
              <span>Endereço:*</span>
              <input type="text" name="endereco" placeholder="Digite o seu endereco"
                  onChange={(e) => setEndereco(e.target.value)}
                  value={endereco}
                  required
                  disabled={loading ? true : false}  
              />
          </label>
        </div>

        {/* Nº Residencial e Complemento */}
        <div>
          <label>
              <span>Número Residencial: *</span>
              <input type="text" name="numResidencial" placeholder="Digite o seu número residencial"
                  onChange={(e) => setNumResidencial(e.target.value)}
                  value={numResidencial}
                  required
                  disabled={loading ? true : false}     
              />
          </label>

          <label>
              <span>Complemento:</span>
              <input type="text" name="complemento" placeholder="Digite o seu complemento"
                  onChange={(e) => setComplemento(e.target.value)}
                  value={complemento}
                  disabled={loading ? true : false}
              />
          </label>
        </div>

      </section>

      {/* Verificar se é bibliotecário aqui */}
      {
        !user.profile && (
          <section className={styles.dadosBibliotecario}>
            {/* MAtícula e Unidade/Polo */}
            <div>
              <label>
                  <span>Matrícula:</span>
                  <input type="text" name="matricula" placeholder="Sua Matrícula"
                      onChange={(e) => setMatricula(e.target.value)}
                      value={matricula}
                      required
                      disabled/>
              </label>
    
              <label>
                  <span>Unidade/Polo:</span>
                    <input type="text" name="unidadePolo" placeholder="Sua Unidade/Polo"
                      onChange={(e) => setUnidadePolo(e.target.value)}
                      value={unidadePolo}
                      required
                      disabled/>
              </label>
            </div>
    
          </section>
        )
      }

      {
        !integrado2
        ? loading
            ? (<button disabled>Carregando...</button>)
            : (<button>Cadastrar</button>)    
        :(<button>Atualizar</button>)     
      }

    </form>

  </div>

  )
}

export default EditarConta