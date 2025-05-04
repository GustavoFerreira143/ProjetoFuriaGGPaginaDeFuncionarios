import React, { useEffect, useState } from 'react'
import axios from 'axios'


function MensagemFeedback() {

  const [usuarios, setUsuarios] = useState([]);
  const [erro, setErro] = useState(null);
  const [abreJanela, setAbreJanela] = useState(false)
  const [infoUser, setInfosUser] = useState({})
  const [jogosUser, setJogosUser] = useState([])
  const [carregandoUsers, setCarregandoUsers] = useState(false)
  const [carregamentoFinalizado, setCarregamentoFinalizado] = useState(false);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [paginaAtual, setPaginaAtual] = useState(1); // inicia com 0
  const [filtros, setFiltros] = useState({
    estado: '',
    idadeMin: '',
    idadeMax: '',
    redeSocial: '',
    interesseEmComp: '',
    interesseCatalogo: '',
    receberPromo: '',
    somenteVizualizados:''
  });


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



  /*--------------------------------------------------------------------Aciona DropDown filtros e Adiciona filtros selecionados */

  const toggleDropdown = () => setMostrarDropdown(prev => !prev);
  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltros({ ...filtros, [name]: value });
  };

  /*--------------------------------------------------------------------Evento de Clique Botão Filtros */

  const aplicarFiltros = () => {
    // Reinicia os estados relevantes
    setPaginaAtual(1);
    setCarregamentoFinalizado(false);
    setCarregandoUsers(true);

    // Monta os parâmetros da query string
    const params = new URLSearchParams();

    if (filtros.estado) params.append('estado', filtros.estado);
    if (filtros.idadeMin) params.append('idadeMin', filtros.idadeMin);
    if (filtros.idadeMax) params.append('idadeMax', filtros.idadeMax);
    if (filtros.redeSocial) params.append('redeSocial', filtros.redeSocial);
    if (filtros.interesseEmComp) params.append('interesseEmComp', filtros.interesseEmComp);
    if (filtros.interesseCatalogo) params.append('interesseCatalogo', filtros.interesseCatalogo);
    if (filtros.receberPromo) params.append('receberPromo', filtros.receberPromo);
    if (filtros.somenteVizualizados) params.append('somenteVizualizados', filtros.somenteVizualizados)

    // Envia a requisição com os filtros
    axios.get(`https://web-production-7ea7.up.railway.app/verif/pesquisa/user/rec?${params.toString()}`, {
      withCredentials: true
    })
      .then(response => {
        const novosUsuarios = Array.isArray(response.data) ? response.data : [];
        setUsuarios(novosUsuarios); // substitui lista
        if (novosUsuarios.length === 0) {
          setCarregamentoFinalizado(true); // evita scroll se vazio
        }
        setErro('');
      })
      .catch(error => {
        const mensagem = error.response?.data?.erro || 'Erro ao buscar usuários filtrados';
        setErro(mensagem);
        setUsuarios([]);
      })
      .finally(() => {
        setCarregandoUsers(false);
      });
  };

  /*-----------------------------------------------------------------------------Primeiro Carregamento da Página-*/

  async function RecebeInfosUser() {
    try {
      const response = await axios.get('https://web-production-7ea7.up.railway.app/verif/pesquisa/user/rec', {
        withCredentials: true,
      });

      const dados = Array.isArray(response.data) ? response.data : [];
      setUsuarios(dados);

      // Em caso de sucesso, define como página 1
      setPaginaAtual(1);

    } catch (err) {
      setErro('Erro ao buscar os usuários.');
    }
  }

  useEffect(() => {
    RecebeInfosUser();
  }, []);

  /*--------------------------------------------------------------------------Carrega com Base no scroll com os filtros incluidos-*/

  useEffect(() => {
    const container = document.getElementById('container');
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollTop + container.clientHeight >= container.scrollHeight - 10 &&
        !carregandoUsers &&
        !carregamentoFinalizado
      ) {
        setCarregandoUsers(true);

        // Simula um delay para exibir o ícone de loading
        setTimeout(async () => {
          try {
            const response = await axios.get('https://web-production-7ea7.up.railway.app/verif/pesquisa/user/rec', {
              withCredentials: true,
              params: {
                pagina: paginaAtual,
                ...filtros
              }
            });

            const novosUsuarios = Array.isArray(response.data) ? response.data : [];

            if (novosUsuarios.length > 0) {
              setUsuarios(prev => [...prev, ...novosUsuarios]);
              setPaginaAtual(prev => prev + 1);
            } else {
              setCarregamentoFinalizado(true);
            }

          } catch (err) {
            setErro('Erro ao carregar mais usuários.');
          } finally {
            setCarregandoUsers(false);
          }
        }, 1500); // Delay de 1.5 segundos para exibir o ícone de loading
      }
    };

    container.addEventListener('scroll', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [paginaAtual, filtros, carregandoUsers, carregamentoFinalizado]);

/*-------------------------------------------------------------------------------Atualiza Id Vizualizado*/

  function enviaIdParaAtualizarVisualizado(id) {

    if (!id || !id) {
      return;
    }

    axios.post('https://web-production-7ea7.up.railway.app/atualiz/user/fa/view', { id_fa: id }, {
      withCredentials: true
    })
      .then(response => {

      })
      .catch(error => {

        if (error.response) {
         
        } else {
        
        }
      });
  }
  console.log(usuarios)
  return (
    <>
      {abreJanela && (
        <div className="fixed w-full h-full bg-black/80 z-30 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <div className='top-0 overflow-y-auto md:overflow-y-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-5 rounded shadow-lg w-full md:w-100 h-full md:w-155 md:h-155 z-30 mt-0 transition-all duration-500 ease-in-out opacity-0 animate-fadeIn'>
            <h3 className='text-center font-semibold my-3'></h3>
            <div className="grid grid-cols-12 border-b pb-2 mt-3">
              <div className="col-span-11">
                <h1 className="text-center text-lg ml-15 ">Carteirinha Fã Furioso</h1>
              </div>
              <div className="col-span-1 cursor-pointer">
                <img
                  src="/x-lg.svg"
                  alt=""
                  className="h-10 "
                  onClick={() => {
                    setAbreJanela(false);
                    document.body.style.overflow = 'auto';
                  }}
                />
              </div>
            </div>
            <div className='md:flex mt-3 '>
              <div className='mx-auto md:block w-[20%] h-[20%]'>
                <img src='Furia_Esports_logo.png' className=' ' />
              </div>
              <div className='md:ml-10 md:w-[85%]'>
                <h3 className='mt-1'><strong>Nome do Fã: </strong>{infoUser.nome}</h3>
                <p className='mt-1'><strong>Idade: </strong> {infoUser.idade}</p>
                <p className='mt-1'><strong>Estado: </strong> {infoUser.estado}</p>
                <p className='mt-1'><strong>Email: </strong> {infoUser.email}</p>
                <p className='mt-1'><strong>RedeSocial: </strong> {infoUser.redeSocial} </p>
                <p className='mt-1'><strong>NickDeUsuario: </strong>{infoUser.userRede}</p>

              </div>

            </div>
            <div className='border rounded-lg p-3 overflow-y-auto h-70'>
              <p >
                <strong>
                  Jogador Favorito:</strong>{" "}
                {infoUser.membroFavorito != "" ? infoUser.membroFavorito : "Não Informado"}
              </p>
              <div className='flex my-5'>
                <p>
                  <strong>
                    Aceitou Receber Promoções?</strong>{" "}

                </p>
                <p className='text-center ml-1'>{infoUser.receberPromo == 1 ? "Sim" : "Não"}</p>
              </div>
              <div className='flex my-5'>
                <p>

                  <strong>
                    Tem interesse no Catalogo?</strong>
                </p>
                <p className='text-center ml-1'>{infoUser.interesseCatalogo == 1 ? "Sim" : "Não"}</p>
              </div>

              <div className='flex my-5'>
                <p>

                  <strong>
                    Tem Interesse em Algum estilo Furia?</strong>
                </p>
                <p className='text-center ml-1'>{infoUser.modeloInteresse != '' ? infoUser.modeloInteresse : "Não"}</p>
              </div>


              <div className='flex my-5'>
                <p>
                  <strong>
                    Tem Interesse Em Competições?</strong>{" "}

                </p>
                <p className='text-center ml-1'>{infoUser.interesseEmComp == 1 ? "Sim" : "Não"}</p>
              </div>
              <p className='text-center font-semibold my-3'>
                Sugestão para Novos Looks Furia
              </p>
              <p className='text-center'>
                {infoUser.estiloSugestao}
              </p>
              <p className='my-3 text-center'>
                <strong>Mensagem</strong>
              </p>
              <p className='text-center'>
                {infoUser.mensagem}
              </p>
              <div>
                <p className='text-black text-center my-2'><strong>Jogos Favorito</strong></p>
                <div className='flex justify-center'>
                  {jogosUser[0] != undefined ?
                    jogosUser.map((jogos) => (
                      <>

                        <p className='mr-3 mt-2 font-semibold'>
                          | {jogos.nome_jogo} |
                        </p>

                      </>

                    )) :
                    <p className='text-center'>Nenhum Jogo Relatado</p>

                  }
                </div>
              </div>
            </div>
            <div className=''> <button className='p-2 bg-black mt-3 text-white rounded-md w-full transition hover:bg-blue-500 duration-500 easy-in-out cursor-pointer' onClick={() => {
              const destinatario = infoUser.email.trim();
              const assunto = encodeURIComponent("Olá Revisamos o seu FeedBack");
              const corpo = encodeURIComponent("Olá, este é um email Furia refente ao seu FeedBack Furioso, muito obrigado");
              const mailtoURL = `mailto:${destinatario}?subject=${assunto}&body=${corpo}`;

              window.open(mailtoURL, '_blank');
            }}>Enviar Email FeedBack</button></div>
          </div>
        </div >
      )
      }
      <div className='overflow-y-auto w-full h-screen relative' id="container" >
        <h1 className='text-white text-center  md:text-lg p-5 ml-5'>
          Verificar Pesquisas de Usuários
        </h1>
        <div className="relative flex text-left justify-end w-[50%] mx-auto">
          <button
            onClick={toggleDropdown}
            className="p-2 bg-white rounded-md w-20 mb-5 hover:text-black hover:scale-105 transition ease-in-out duration-300 cursor-pointer"
          >
            Filtrar
          </button>

          {mostrarDropdown && (
            <div className="absolute z-10 mt-2 w-72 top-10 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-4 space-y-2 animate-fadeIn">
              <input
                type="text"
                name="estado"
                value={filtros.estado}
                onChange={(e) => {
                  const valor = e.target.value.toUpperCase().slice(0, 2);
                  setFiltros({ ...filtros, estado: valor });
                }}
                maxLength={2}
                placeholder="Estado (UF)"
                className="w-full p-2 border rounded uppercase"
              />


              <div className="flex gap-2">
                <input type="number" name="idadeMin" value={filtros.idadeMin} onChange={handleFiltroChange}
                  className="w-1/2 p-2 border rounded" placeholder="Idade mín" />
                <input type="number" name="idadeMax" value={filtros.idadeMax} onChange={handleFiltroChange}
                  className="w-1/2 p-2 border rounded" placeholder="Idade máx" />
              </div>

              <select name="redeSocial" value={filtros.redeSocial} onChange={handleFiltroChange} className="w-full p-2 border rounded">
                <option value="">Selecione uma rede social</option>
                <option value="Instagram">Instagram</option>
                <option value="Twitter">Twitter</option>
                <option value="TikTok">TikTok</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitch">Twitch</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Discord">Discord</option>
                <option value="Reddit">Reddit</option>
                <option value="Outro">Outro</option>
              </select>

              <select name="interesseEmComp" value={filtros.interesseEmComp} onChange={handleFiltroChange} className="w-full p-2 border rounded">
                <option value="">Interesse em Competições</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>

              <select name="interesseCatalogo" value={filtros.interesseCatalogo} onChange={handleFiltroChange} className="w-full p-2 border rounded">
                <option value="">Interesse em Catálogo</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>

              <select name="receberPromo" value={filtros.receberPromo} onChange={handleFiltroChange} className="w-full p-2 border rounded">
                <option value="">Receber Promoções</option>
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
              <select name="somenteVizualizados" value={filtros.somenteVizualizados} onChange={handleFiltroChange} className="w-full p-2 border rounded">
                <option value="">Somente não Vizualizados</option>
                <option value="false">Sim</option>
                <option value="true">Não</option>
              </select>
              <button onClick={(e) => { aplicarFiltros(); toggleDropdown(); setPaginaAtual(1) }} className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition cursor-pointer">
                Aplicar Filtros
              </button>
            </div>
          )}
        </div>

        {erro && <p className="text-red-500 text-center clear-both">{erro}</p>}
        <hr className='clear-both' />
        <div className='md:w-[50%] text-white mx-auto'>
          <div>

            {usuarios.length === 0 ? (
              <p>Nenhum usuário encontrado.</p>
            ) : (
              usuarios.map((item, index) => (
                <div key={index} className='border m-5 p-5 rounded-lg hover:bg-white hover:text-black hover:scale-105 transition easy-in-out duration-800 cursor-pointer' onClick={() => {
                  setInfosUser(item.infosdofa)
                  setJogosUser(item.jogosfavoritos)

                  enviaIdParaAtualizarVisualizado(item.infosdofa.id_fa)
                  setAbreJanela(true);
                  document.body.style.overflow = 'hidden';
                }
                }>
                  <h3 className='text-center font-semibold my-3'>Dados Do Fã</h3>
                  <div className='flex mt-3'>
                    <img src='Furia_Esports_logo.png' className='hidden md:block md:w-[15%] h-[15%]'></img>
                    <div className='md:ml-10 md:w-[85%]'>
                      <h3><strong className='mr-3'>Nome do Fã:</strong>{item.infosdofa?.nome}</h3>
                      <p><strong>Email:</strong> {item.infosdofa?.email}</p>
                      <p><strong>Estado:</strong> {item.infosdofa?.estado}</p>
                      <p>
                        <strong>Mensagem:</strong>{" "}
                        {item.infosdofa?.mensagem?.length > 50
                          ? item.infosdofa.mensagem.substring(0, 50) + "..."
                          : item.infosdofa?.mensagem}
                      </p>
                      <p className=''><strong>Visualizado:  </strong>{item.infosdofa.vizualizado? <strong className='text-green-500'>Já Visualizado</strong> : <strong className='text-red-500'>Ainda não Visualizado</strong>}</p>
                    </div>
                  </div>


                </div>
              ))
            )}
          </div>
        </div>
        {carregandoUsers && (
          <div className='flex justify-center'>
            <img
              src="/Loading.png"
              className="animate-spin w-10 h-10 mx-auto"
              alt="Carregando..."
            />
          </div>
        )}
      </div>
    </>
  )
}

export default MensagemFeedback