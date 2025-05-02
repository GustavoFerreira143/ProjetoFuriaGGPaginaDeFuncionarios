import React from 'react'
import { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { recebeInsereNoticias } from './Logicas/RecebeInsereNoticias'
import { carregaNoticias } from './Logicas/CarregaNoticias';
import { deletarNoticia } from './Logicas/DeletarNoticia';

function AtualizaNoticias() {

  const {
    noticiaSelecionada, setNoticiaSelecionada, Deletar, isDelete, erroDeletar
  } = deletarNoticia()

  const {
    noticias,
    noticiasRecebidas,
  } = carregaNoticias()

  const [abreConfirmacao, setAbreConfirmacao] = useState(false)
  const [mostrarModal, setMostrarModal] = useState(false);
  const {
    tipoModal, setTipoModal,
    imagemFile,
    fileInputRef,
    imagemPreview,
    mensagemNoticia, setmensagemNoticia,
    error,
    isLoading,
    handleButtonClick,
    handleFileChange,
    EnviarNoticia,
  } = recebeInsereNoticias();


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


  function parseMensagemComLinks(mensagem) {
    if (!mensagem) return "Sem Texto Anexado";

    const regex = /(https?:\/\/[^\s]+)/g;
    const mensagemComLinks = mensagem.replace(regex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-400 underline">${url}</a>`;
    });

    return mensagemComLinks;
  }


  return (
    <>
      {mostrarModal && noticiaSelecionada && (
        <div
          className="fixed w-full h-full bg-black/80 z-40 top-0">
          <div className='overflow-y-auto md:overflow-y-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2  animate-fadeIn
                  bg-white p-5 rounded shadow-lg w-full md:w-100 h-full md:w-190 md:h-160 z-30 mt-0 md:mt-0 
                  transition-all duration-300 ease-in-out'>
            <div className='grid grid-cols-12'>
              <div className='col-span-11'>
                <h1 className='text-center mb-2 ml-14 md:ml-20'><strong>Notícias</strong></h1>
              </div>
              <div className='col-span-1 cursor-pointer' onClick={() => setMostrarModal(false)}>
                <img src="/x-lg.svg" alt="Fechar" className='h-10 mb-2' />
              </div>
            </div>
            <hr />
            <div className='mt-4'>
              <img
                src={noticiaSelecionada?.img}
                alt="Imagem da notícia"
                className='w-full h-100 rounded'
              />
              <p className='text-black text-justify px-2 md:px-4 w-full font-semibold'>
                <span dangerouslySetInnerHTML={{
                  __html: parseMensagemComLinks(noticiaSelecionada?.texto)
                }} />
              </p>
            </div>
          </div>
        </div>

      )}


      {tipoModal.adicionar && (
        <div className="fixed w-full h-full bg-black/80 z-30 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <div className='top-0 overflow-y-auto md:overflow-y-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-5 rounded shadow-lg w-full md:w-100 h-full md:w-150 md:h-170 z-30 mt-0 transition-all duration-500 ease-in-out opacity-0 animate-fadeIn'>

            <div className='grid grid-cols-12 border-b pb-2 mt-3'>
              <div className='col-span-11'>
                <h1 className='text-center text-lg md:ml-15'>Adicionar Noticia</h1>
              </div>
              <div className='col-span-1 cursor-pointer'>
                <img src="/x-lg.svg" alt="" className='h-10' onClick={() => setTipoModal({ ...tipoModal, adicionar: false })} />
              </div>
            </div>

            {error !== '' && <p className='text-red-500 text-center'>{error}</p>}

            <div className='flex justify-center mt-3'>
              <button
                onClick={handleButtonClick}
                className='bg-black text-white p-2 rounded-md transition hover:bg-white hover:text-black duration-500 ease-in-out cursor-pointer'
              >
                Adicionar Imagem
              </button>

              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif"
                ref={fileInputRef}
                onChange={handleFileChange}
                className='hidden'
              />
            </div>

            {imagemPreview && (
              <>
                <div className='flex justify-center mt-2'>
                  <img
                    src={imagemPreview}
                    alt="Pré-visualização"
                    className='w-full h-90 border border-gray-300 rounded-md shadow-md'
                  />
                </div>

                <textarea
                  placeholder='Insira o Texto da Noticia Aqui'
                  className='w-full p-2 border-b mt-3'
                  value={mensagemNoticia}
                  onChange={e => setmensagemNoticia(e.currentTarget.value)}
                />

                <div className='flex justify-center'>
                  <button
                    className='bg-black text-white p-2 rounded-md transition hover:bg-white hover:text-black duration-500 ease-in-out cursor-pointer w-full'
                    onClick={() => EnviarNoticia()}
                    disabled={isLoading}
                  >
                    {isLoading ? "Enviando Aguarde..." : "Enviar Noticia"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tipoModal.deletar && (
        <div className="fixed w-full h-full bg-black/80 z-30 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <div className="top-0 overflow-y-auto overflow-x-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-5 rounded shadow-lg w-full md:w-100 h-full md:w-160 md:h-160 z-30 mt-0 opacity-0 animate-fadeIn">

            <div className="grid grid-cols-12 border-b pb-2 mt-3">
              <div className="col-span-11">
                <h1 className="text-center text-lg md:ml-15">Excluir Notícia</h1>
              </div>
              <div className="col-span-1 cursor-pointer">
                <img
                  src="/x-lg.svg"
                  alt=""
                  className="h-10"
                  onClick={() => {
                    setTipoModal({ ...tipoModal, deletar: false });
                    document.body.style.overflow = 'auto';
                  }}
                />
              </div>
            </div>

            {noticiasRecebidas[0] ? (
              noticiasRecebidas.map((noticia, i) => (
                <div key={i} className="w-full h-70 md:h-[25%] bg-white text-white mx-2 rounded-lg shadow-lg mb-2 flex items-center cursor-pointer mt-5">

                  <img src={noticia.imagem} className="min-w-[25%] max-w-[25%] h-full rounded-lg" />

                  <p
                    className="text-wrap text-black ml-5 w-[30%]"
                    dangerouslySetInnerHTML={{ __html: parseMensagemComLinks(noticia.mensagem) }}
                  />

                  <div
                    className="ml-auto w-15 h-full flex-shrink-0 hover:bg-blue-900 rounded-lg transition ease-in-out duration-500 cursor-pointer"
                    onClick={() => {
                      setNoticiaSelecionada({
                        id: noticia.id,
                        imagem: noticia.imagem,
                        texto: noticia.mensagem,
                      });
                      setAbreConfirmacao(true);
                    }}
                  >
                    <img src="/deletar.svg" className="w-[40%] ml-5 h-full" />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-lg">Nenhuma Notícia Enviada</p>
            )}
          </div>
        </div>
      )}

      {abreConfirmacao && (
        <div className="fixed w-full h-full bg-black/80 z-30 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <div className="top-0 overflow-y-auto md:overflow-x-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-5 rounded shadow-lg md:w-100 md:h-100 h-full z-30 mt-0 opacity-0 animate-fadeIn">

            <div className="grid grid-cols-12 border-b pb-2 mt-3">
              <div className="col-span-11">
                <h1 className="text-center text-lg md:ml-15">Confirma Deleção?</h1>
              </div>
              <div className="col-span-1 cursor-pointer">
                <img src="/x-lg.svg" alt="" className="h-10" onClick={() => setAbreConfirmacao(false)} />
              </div>
            </div>

            {erroDeletar !== '' && (
              <p className="text-center text-red-500">{erroDeletar}</p>
            )}

            <p className="text-center font-semibold my-5">Item a Ser Deletado:</p>

            <div className="w-full h-[50%] md:h-[25%] bg-white text-white mx-2 rounded-lg shadow-lg mb-2 flex items-center">
              <img src={noticiaSelecionada.imagem} className="min-w-[25%] h-full rounded-lg" />
              <p
                className="text-wrap text-black ml-5 w-full"
                dangerouslySetInnerHTML={{ __html: parseMensagemComLinks(noticiaSelecionada.texto) }}
              />
            </div>

            <div className="w-full mt-10">
              <button
                className="w-full bg-black text-white p-3 hover:bg-blue-900 rounded-lg transition ease-in-out duration-500 cursor-pointer"
                onClick={Deletar}
                disabled={isDelete}
              >
                {isDelete ? "Deletando Aguarde..." : "Deletar"}
              </button>
            </div>
          </div>
        </div>
      )}


      <div className='overflow-y-auto w-full h-screen relative' id="container" >
        <h1 className='text-white text-center  md:text-lg p-5 ml-5'>
          Atualizar Noticias
        </h1>
        <hr />

        <div className='w-[25%] flex mx-auto justify-center mt-10'>
          <button className='text-black bg-white rounded-md  p-3 transition easy-in-out hover:bg-black hover:text-white duration-500 cursor-pointer' onClick={() => { setTipoModal({ ...tipoModal, adicionar: true }); document.body.style.overflow = 'hidden'; }}>Adicionar Noticia</button>
          <button className='text-black bg-white rounded-md ml-3 p-3 transition easy-in-out hover:bg-black hover:text-white duration-500 cursor-pointer' onClick={() => { setTipoModal({ ...tipoModal, deletar: true }); document.body.style.overflow = 'hidden'; }}>Deletar Noticia</button>
        </div>

        <div className="w-full h-100 md:h-180 mt-10">
          <h1 className='text-2xl pl-10 md:pl-20 py-4 text-white'>
            Noticias Atuais Em Exibição
          </h1>

          <div className="overflow-x-auto whitespace-nowrap scroll-smooth px-4 py-5 " id="NoticiasFuria">

            {!noticias ? [
              { img: '/Noticias/NoticiaFuria.jpg', texto: 'Treinos da Furia tem inicio em 24/04/2025 https://www.furia.gg' },
              { img: '/Noticias/CalendarioDeJogosFuria.jpg', texto: 'Calendario de Jogos Kings League já disponivel' },
              { img: '/Noticias/NoticiaFuria2.jpg', texto: 'A furiagg anunciou a ida de skullzcs ao banco de reservas. yek1ndar entra no time como stand-in.' },
              { img: '/Noticias/FuriaKingsLeague.jpg', texto: 'Com duas vitórias, a equipe da furiagg iniciou a sua participação na kingsleague_br https://www.furia.gg com a liderança geral da competição.' },
              {
                img: '/Noticias/FuriaAdidas.jpg',
                texto: 'Furiagg anuncia patrocínio de adidasbrasil e nova jersey para Conferir basta ir no site https://www.furia.gg .',
              }
            ].map((noticia, i) => {
              const textoPlano = typeof noticia.texto === 'string' ? noticia.texto : '';
              const textoComLinks = parseMensagemComLinks(textoPlano);

              const textoCortado = textoPlano.length > 100 ? textoPlano.slice(0, 100) + '...' : textoComLinks;
              const excedeLimite = textoPlano.length > 100;

              return (
                <div key={i} className="inline-block lg:w-[50%] h-110 w-[100%] md:w-[80%] md:h-150 bg-white text-black text-center mx-2 rounded-lg shadow-lg">
                  <img src={noticia.img} className='w-full h-[80%] rounded-lg' />
                  <p className='mt-4 px-4 h-[20%] overflow-hidden text-wrap'>
                    <span dangerouslySetInnerHTML={{ __html: textoCortado }} />
                    {excedeLimite && (
                      <button
                        className="text-blue-400 ml-2 underline cursor-pointer"
                        onClick={() => {
                          setNoticiaSelecionada({
                            img: noticia.img,
                            texto: textoPlano,
                          });
                          setMostrarModal(true);
                        }}
                      >
                        Ver Completo
                      </button>
                    )}
                  </p>
                </div>
              );
            })
              :
              noticiasRecebidas.map((noticia, i) => {
                const textoPlano = typeof noticia.mensagem === 'string' ? noticia.mensagem : '';
                const textoComLinks = parseMensagemComLinks(textoPlano);

                const textoCortado = textoPlano.length > 100 ? textoPlano.slice(0, 100) + '...' : textoComLinks;
                const excedeLimite = textoPlano.length > 100;

                return (
                  <div key={i} className="inline-block lg:w-[50%] h-110 w-[100%] md:w-[80%] md:h-150 bg-white text-black text-center mx-2 rounded-lg shadow-lg">
                    <img src={noticia.imagem} className='w-full h-[80%] rounded-lg' />
                    <p className='mt-4 px-4 h-[20%] overflow-hidden text-wrap'>
                      <span dangerouslySetInnerHTML={{ __html: textoCortado }} />
                      {excedeLimite && (
                        <button
                          className="text-blue-400 ml-2 underline cursor-pointer"
                          onClick={() => {
                            setNoticiaSelecionada({
                              img: noticia.imagem,
                              texto: textoPlano,
                            });
                            setMostrarModal(true);
                          }}
                        >
                          Ver Completo
                        </button>
                      )}
                    </p>
                  </div>
                );
              })}

          </div>
        </div>
      </div>
    </>
  )
}

export default AtualizaNoticias