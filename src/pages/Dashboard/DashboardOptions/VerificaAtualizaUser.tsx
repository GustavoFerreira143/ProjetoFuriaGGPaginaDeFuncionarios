import React from 'react'
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';


function VerificaAtualizaUser() {

  const [janelaVisivel, setJanelaVisivel] = useState(false)
  const [usuarioSelecionado, setUsuarioSelecionado] = useState({
    id_func: 0,
    nome: '',
    email: '',
    senha: '',
    permisaoUser: '',
    desativado: false
  });
  const [pesquisaUser, setPesquisaUser] = useState('')
  const [timeoutId, setTimeoutId] = useState(null);
  const [confirmaSenha, setconfirmaSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [mensagem, setmensagem] = useState('')
  const [carregandoUsers, setCarregandoUsers] = useState(false)


  const [dadosUsuarios, setDadosUsuarios] = useState([
    {
      id_func: 0,
      nome: '',
      email: '',
      senha: '',
      permisaoUser: '',
      desativado: false
    }
  ]);
  const [fimDaLista, setFimDaLista] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(0);

  useEffect(() => {
    function VerificaUser() {
      axios.post('https://localhost:5000/func/conferelogin/VerificaLogado', { nome: "Vazio" }, {
        withCredentials: true
      })
        .then(response => {

        })
        .catch(error => {
          window.location.replace('/');
        });
    }

    VerificaUser();  // Chama a função apenas uma vez

  }, []);



  /*-------------------------------------------------------------------Primeiro Carregamento de Infos da Página*/
  useEffect(() => {
    if (pesquisaUser.trim() !== '') {
      setPaginaAtual(0); // Resetar página
      return;
    }

    setCarregandoUsers(true);
    axios.get('https://localhost:5000/func/editaUserDados/user?pagina=0', {
      withCredentials: true
    })
      .then(response => {
        setDadosUsuarios(response.data);
        setPaginaAtual(1); // Próxima página será 1
      })
      .catch(() => {
        setDadosUsuarios([]);
      })
      .finally(() => setCarregandoUsers(false));
  }, [pesquisaUser]);


  /*-------------------------------------------------------------------Carrega componente com base no Scroll de Página*/

  useEffect(() => {
    const container = document.getElementById('container');
    if (!container) return;

    const handleScroll = () => {
      if (pesquisaUser.trim() !== '' || carregandoUsers || fimDaLista) return;

      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 10
      ) {
        setCarregandoUsers(true);

        setTimeout(() => {
          axios.get(`https://localhost:5000/func/editaUserDados/user?pagina=${paginaAtual}`, {
            withCredentials: true
          })
            .then(response => {
              if (response.status === 204) {
                setFimDaLista(true);
                return;
              }

              if (Array.isArray(response.data) && response.data.length > 0) {
                setDadosUsuarios(prev => [...prev, ...response.data]);
                setPaginaAtual(prev => prev + 1);
              }
            })
            .catch(error => {
              if (error.response?.data?.erro === 'sem_mais_dados' || error.response?.status === 204) {
                setFimDaLista(true);
              }
            })
            .finally(() => setCarregandoUsers(false));
        }, 500);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [paginaAtual, carregandoUsers, pesquisaUser, fimDaLista]);


  /*---------------------------------------------------------------------------------Filtra com Base no input de Pesquisa- */
  useEffect(() => {
    if (timeoutId) clearTimeout(timeoutId); // limpar timeout anterior se usuário ainda estiver digitando

    const novoTimeout = setTimeout(() => {
      if (pesquisaUser.trim() !== '') {
        setmensagem('Pesquisando...');
        axios.get(`https://localhost:5000/func/editaUserDados/user?filtro=${encodeURIComponent(pesquisaUser)}`, {
          withCredentials: true
        })
          .then(response => {
            setmensagem('');
            setDadosUsuarios(response.data);
          })
          .catch(error => {
            setmensagem('Erro ao buscar usuários');
            setDadosUsuarios([]);
          });
      }
    }, 600); // espera 600ms após o usuário parar de digitar

    setTimeoutId(novoTimeout);
  }, [pesquisaUser]);

  /*---------------------------------------------------------------------------------Altera Infos de Usuario- */

  function EnviarAlteracoes() {
    setmensagem('') // limpa mensagem anterior
    if (usuarioSelecionado.senha !== confirmaSenha) {
      setmensagem('As senhas não coincidem.')
      return
    }

    setIsLoading(true)

    axios.post('https://localhost:5000/func/editaUserDados/enviar', usuarioSelecionado, {
      withCredentials: true
    })
      .then(response => {
        setmensagem(response.data.message || 'Usuário atualizado com sucesso.')
        setTimeout(() => window.location.reload(), 2000)
      })
      .catch(error => {
        if (error.response) {
          setmensagem(error.response.data.message || 'Erro ao atualizar usuário.')
        } else {
          setmensagem('Erro de conexão com o servidor.')
        }
      })
      .finally(() => {
        setIsLoading(false)
      })
  }


  return (
    <>
      {janelaVisivel && (
        <div className="fixed w-full h-full bg-black/80 z-30 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <div className="top-0 overflow-y-auto md:overflow-y-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-5 rounded shadow-lg w-full md:w-100 h-full md:w-160 md:h-160 z-30 mt-0 opacity-0 animate-fadeIn">

            <div className="grid grid-cols-12 border-b pb-2 mt-3">
              <div className="col-span-11">
                <h1 className="text-center text-lg md:ml-15">Editar Dados De Usuario</h1>
              </div>
              <div
                className="col-span-1 cursor-pointer"
                onClick={() => {
                  setJanelaVisivel(false);
                  document.body.style.overflow = 'auto';
                }}
              >
                <img src="/x-lg.svg" alt="" className="h-10" />
              </div>
            </div>

            {mensagem !== '' && <p className="text-center text-red-500">{mensagem}</p>}

            <div className="w-[75%] mx-auto mt-2">
              <p className="text-lg">Nome do Usuario:</p>
              <p className="mb-2 mt-2 text-md">{usuarioSelecionado.nome}</p>

              <p className="text-lg">Email do Usuario</p>
              <p className="mb-2 mt-2 text-md">{usuarioSelecionado.email}</p>

              <p className="mt-2 text-lg">Senha do Usuario</p>
              <input
                type="password"
                value={usuarioSelecionado.senha}
                onChange={(e) => setUsuarioSelecionado({ ...usuarioSelecionado, senha: e.target.value })}
                className="w-[90%] border rounded px-2 py-1 mb-4 mt-2"
              />

              <p>Confirmação de Senha</p>
              <input
                type="password"
                value={confirmaSenha}
                onChange={(e) => setconfirmaSenha(e.currentTarget.value)}
                className="w-[90%] border rounded px-2 py-1 mb-4 mt-2"
              />

              <div>
                <p className="mt-2 text-lg">Autorização atual do Usuario</p>
                <select
                  value={usuarioSelecionado.permisaoUser}
                  onChange={(e) => setUsuarioSelecionado({ ...usuarioSelecionado, permisaoUser: e.currentTarget.value })}
                  className="border rounded-lg p-2 w-[90%] bg-white mt-3"
                >
                  <option value="">Selecione Tipo de Acesso</option>
                  <option value="admin">Admin</option>
                  <option value="comum">Comum</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  checked={usuarioSelecionado.desativado}
                  onChange={(e) => setUsuarioSelecionado({ ...usuarioSelecionado, desativado: e.target.checked })}
                />
                <p>Desativar Usuario</p>
              </div>

              <button
                className="w-full bg-black p-2 text-white rounded-md mt-8 hover:bg-blue-500 transition ease-in-out duration-300 cursor-pointer"
                onClick={EnviarAlteracoes}
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Atualizar Usuário'}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className='overflow-y-auto w-full h-screen relative' id="container">
        <div className='overflow-y-hidden'>
          <h1 className='text-white text-center md:text-lg p-5 ml-5'>
            Funcionarios Existentes no Sistema
          </h1>
          {mensagem != '' ? <h1 className='text-red-500 text-center'>{mensagem}</h1> : ""}
          <hr />
          <div className='flex justify-center'>
            <input id="" type="text" placeholder='Pesquisar Por Nome / Email' className='border-b border-white p-3 mt-5 w-[40%] text-white' value={pesquisaUser} onChange={(e) => { setPesquisaUser(e.currentTarget.value) }} />
          </div>
          <div className="w-[90%] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-white">
              {dadosUsuarios.length === 0 ? (
                <p className="text-center text-gray-500 my-5">Nenhum usuário encontrado.</p>
              ) : (
                dadosUsuarios.map((usuario, index) => (
                  <div
                    key={index}
                    className="border m-5 p-5 rounded-lg hover:bg-white hover:text-black hover:scale-105 transition ease-in-out duration-800 cursor-pointer"
                    onClick={() => {
                      setUsuarioSelecionado({
                        id_func: usuario.id_func,
                        nome: usuario.nome,
                        email: usuario.email,
                        senha: usuario.senha,
                        permisaoUser: usuario.permisaoUser,
                        desativado: usuario.desativado
                      });
                      setconfirmaSenha(usuario.senha);
                      setJanelaVisivel(true);
                      document.body.style.overflow = 'hidden';
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <h3 className="text-center font-semibold my-3">Dados do Usuário</h3>

                    <div className="flex mt-3">
                      <img
                        src="/Furia_Esports_logo.png"
                        alt="Logo"
                        className="w-[15%] h-[15%]"
                      />
                      <div className="ml-10 w-[85%]">
                        <p><strong className="mr-2">Nome:</strong> {usuario.nome}</p>
                        <p><strong className="mr-2">Email:</strong> {usuario.email}</p>
                        <p><strong className="mr-2">Tipo:</strong> {usuario.permisaoUser}</p>
                        <p><strong className="mr-2">Desativado?:</strong> {usuario.desativado ? 'Sim' : 'Não'}</p>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <img src="/editar.svg" alt="Editar" width={30} className="cursor-pointer" />
                    </div>
                  </div>
                ))
              )}
              {carregandoUsers && (
                <div className='flex justify-center'>
                  <img
                    src="/Loading.png"
                    className="animate-spin w-6 h-6 mx-auto"
                    alt="Carregando..."
                  />
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </>
  )
}

export default VerificaAtualizaUser