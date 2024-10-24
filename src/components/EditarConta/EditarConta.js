import styles from './styles/EditarConta.module.css';

import { useAuth0 } from '@auth0/auth0-react';

//import { Dialog } from 'primereact/dialog';

import { useState } from 'react';

const EditarConta = () => {

  const {user} = useAuth0();

  const [nome, setNome] = useState(user.name);
  const [email, setEmail] = useState(user.email);


  const [cpf, setCpf] = useState('')
  const [rg, setRg] = useState('')

  const [ra, setRa] = useState('')
  const [tel, setTel] = useState('')
  const [cep, setCep] = useState('')
  const [endereco, setEndereco] = useState('')
  const [numResidencial, setNumResidencial] = useState('')
  const [complemento, setComplemento] = useState('')
  const [matricula, setMatricula] = useState('')
  const [unidadePolo, setUnidadePolo] = useState('')


  const cadastrar = (event) => {
    console.log("Cadastrando Usuário");
    console.log(nome, email);
  }

  const editar = (event) => {
    console.log("Editando Usuário");
    console.log(nome, email);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    /** Se usuario email existe no banco unibli
     * 
     */editar()
     /* 
     * Senão existe
     * 
     */ cadastrar()
    /**/
}



  return (   
  <div className={styles.divEditarconta}>
    <form onSubmit={handleSubmit}>
      
      <section className={styles.dadosPessoais}>
        {/* Nome e Email */}
        <div>
          <label>
              <span>Nome:*</span>
              <input type="text" name="nome" placeholder="Digite o seu nome"
                  onChange={(e) => setNome(e.target.value)}
                  value={nome}
                  required/>
          </label>

          <label>
              <span>E-mail:*</span>
              <input type="email" name="email" placeholder="Digite o seu e-mail"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  required/>
          </label>
        </div>

        {/* CPF e RG */}
        <div>
          <label>
              <span>CPF:*</span>
              <input type="text" name="cpf" placeholder="Digite o seu CPF"
                  onChange={(e) => setCpf(e.target.value)}
                  value={cpf}
                  required/>
          </label>

          <label>
              <span>RG:*</span>
              <input type="text" name="rg" placeholder="Digite o seu RG"
                  onChange={(e) => setRg(e.target.value)}
                  value={rg}
                  required/>
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
                  required/>
              </label>
            )
          }
          <label>
              <span>Telefone/Celular:*</span>
              <input type="tel" name="tel" placeholder="Digite seu número de tel. ou cel."
                  onChange={(e) => setTel(e.target.value)}
                  value={tel}
                  required/>
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
                  required/>
          </label>

          <label>
              <span>Endereço:*</span>
              <input type="text" name="endereco" placeholder="Digite o seu endereco"
                  onChange={(e) => setEndereco(e.target.value)}
                  value={endereco}
                  required/>
          </label>
        </div>

        {/* Nº Residencial e Complemento */}
        <div>
          <label>
              <span>Número Residencial: *</span>
              <input type="text" name="numResidencial" placeholder="Digite o seu número residencial"
                  onChange={(e) => setNumResidencial(e.target.value)}
                  value={numResidencial}
                  required/>
          </label>

          <label>
              <span>Complemento:</span>
              <input type="text" name="complemento" placeholder="Digite o seu complemento"
                  onChange={(e) => setComplemento(e.target.value)}
                  value={complemento}
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
        !user.profile
        ? (<button>Cadastrar</button>)
        : (<button>Atualizar</button>)
      }

    </form>

  </div>

  )
}

export default EditarConta