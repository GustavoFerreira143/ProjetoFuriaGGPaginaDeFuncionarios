import React from 'react'
import NavBar from '../../GeralComponents/NavBar/NavBar'
import Footer from '../../GeralComponents/Footer/Footer'
import { useState, useEffect} from 'react'
import axios from 'axios'
import InserirUser from './DashboardOptions/InserirUser'
import EnvioDeAlertas from './DashboardOptions/EnvioDeAlertas'
import AtualizaNoticias from './DashboardOptions/AtualizaNoticias/AtualizaNoticias'
import MensagemFeedback from './DashboardOptions/MensagemFeedback'
import VerificaAtualizaUser from './DashboardOptions/VerificaAtualizaUser'
import DashboardView from './DashboardOptions/DashboardView'
import { useUser } from '../../Context'



function Dashboard() {

  const { permissaoUser } = useUser();
  const { setTelaUser } = useUser();

  const [telas, settelas] = useState({
    dashboard: false,
    inserirUser: false,
    verificaUsers: false,
    enviarPromo: false,
    atualizaNot: false,
    mensagemFeedback: false
  })
  const [Tela, setTela] = useState(false)
  const [FechaTela, setFechaTela] = useState(true);

  function ativarTela(telaSelecionada) {
    settelas({
      dashboard: false,
      inserirUser: false,
      verificaUsers: false,
      enviarPromo: false,
      atualizaNot: false,
      mensagemFeedback: false,
      [telaSelecionada]: true,
    });
  }
  useEffect(() => {
    const telaSalva = localStorage.getItem('telaUser');
  
    if (telaSalva) {
      ativarTela(telaSalva);
    } else {
      ativarTela('dashboard');
      localStorage.setItem('telaUser', 'dashboard');
    }
  }, []);

  useEffect(() => {
    function VerificaUser() {
      axios.post('https://web-production-7ea7.up.railway.app/func/conferelogin/VerificaLogado', { nome: "Vazio" }, {
        withCredentials: true
      })
        .then(response => {
          
        })
        .catch(error => {
          window.location.replace('/'); 
        });
    }
  
    VerificaUser(); 
  
  }, []);

  return (
    <>
      <NavBar/>
      <img  className='absolute w-full h-screen ' src='/FuriaFundo.png' />
      <div id="CorpoDashboard" className='w-full h-screen bg-black/95 relative'>
        <img src='./justify.svg' className={`z-30 w-10 absolute left-5 top-3 cursor-pointer ${Tela ? 'animate-open' : 'animate-close'}`} onClick={() => {
          if (Tela) {
            setFechaTela(true);
            setTimeout(() => setTela(false), 1000)

          }
          else {
            setFechaTela(false)
            setTela(true)
          }
        }}></img>
        {Tela ?
          <div className={`absolute z-20 w-full md:w-[30%] lg:w-[15%] h-full bg-white ${FechaTela ? 'animate-fecha-menu' : 'animate-menu'} `}>
            <div className='mt-20'>
              <p className='hover:bg-black hover:text-white transition duration-300 cursor-pointer p-3 font-semibold m-2' onClick={() => {
                ativarTela('dashboard');
                if (Tela) {
                  setFechaTela(true);
                  setTimeout(() => setTela(false), 1000);
                  localStorage.setItem('telaUser', 'dashboard')
                }
              }}>
                Dashboard
              </p>

              {/* Só visível para administradores */}
              {permissaoUser === 'admin' && (
                <>
                  <p className='hover:bg-black hover:text-white transition duration-300 cursor-pointer p-3 font-semibold m-2' onClick={() => {
                    ativarTela('inserirUser');
                    if (Tela) {
                      setFechaTela(true);
                      setTimeout(() => setTela(false), 1000);
                      localStorage.setItem('telaUser', 'inserirUser')
                    }
                  }}>
                    Adicionar Usuário
                  </p>

                  <p className='hover:bg-black hover:text-white transition duration-300 cursor-pointer p-3 font-semibold m-2' onClick={() => {
                    ativarTela('verificaUsers');
                    if (Tela) {
                      setFechaTela(true);
                      setTimeout(() => setTela(false), 1000);
                      localStorage.setItem('telaUser', 'verificaUsers')
                    }
                  }}>
                    Atualizar Usuários
                  </p>
                </>
              )}


              <p className='hover:bg-black hover:text-white transition duration-300 cursor-pointer p-3 font-semibold m-2' onClick={() => {
                ativarTela('enviarPromo');
                if (Tela) {
                  setFechaTela(true);
                  setTimeout(() => setTela(false), 1000);
                  localStorage.setItem('telaUser', 'enviarPromo')
                }
              }}>
                Enviar Promoções
              </p>

              <p className='hover:bg-black hover:text-white transition duration-300 cursor-pointer p-3 font-semibold m-2' onClick={() => {
                ativarTela('atualizaNot');
                if (Tela) {
                  setFechaTela(true);
                  setTimeout(() => setTela(false), 1000);
                  localStorage.setItem('telaUser', 'atualizaNot')
                }
              }}>
                Atualizar Notícias
              </p>

              <p className='hover:bg-black hover:text-white transition duration-300 cursor-pointer p-3 font-semibold m-2' onClick={() => {
                ativarTela('mensagemFeedback');
                if (Tela) {
                  setFechaTela(true);
                  setTimeout(() => setTela(false), 1000);
                  localStorage.setItem('telaUser', 'mensagemFeedback')
                }
              }}>
                Detalhes Pesquisas De Usuários
              </p>
            </div>
          </div>
          :
          ""
        }
        {
          telas.dashboard ?
          <DashboardView/>
            : ''
        }

        {
          telas.inserirUser && permissaoUser === 'admin' ?
            <InserirUser/> : ''
        }

        {
          telas.enviarPromo ?
            <EnvioDeAlertas/> : ''
        }

        {
          telas.atualizaNot ?
            <AtualizaNoticias/> : ''
        }

        {
          telas.mensagemFeedback ?
            <MensagemFeedback/> : ''
        }

        {
          telas.verificaUsers && permissaoUser === 'admin' ?
            <VerificaAtualizaUser/> : ''
        }
      </div>
      <Footer/>
    </>

  )
}

export default Dashboard