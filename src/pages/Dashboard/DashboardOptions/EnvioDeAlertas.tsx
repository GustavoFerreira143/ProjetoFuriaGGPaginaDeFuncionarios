import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

function EnvioDeAlertas() {

  const [usuarioDestino, setUsuarioDestino] = useState('todos');
  const [exibeImagem, setExibeImagem] = useState('')
  const [janelaVisivel, setJanelaVisivel] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [dadosEnvio, setdadosEnvio] = useState(
    {
      assunto: '',
      mensagem1: '',
      linkimg: '',
      mensagem2: ''
    }
  )

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

  function EnviarDadosPromocao() {

    document.getElementById('CorpoDashboard').scrollTop = 0;
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setMensagem('')
    const { assunto, mensagem1, mensagem2, linkimg } = dadosEnvio;

  
    if (!assunto || assunto.trim().length <= 1) {
      setMensagem('O campo "Assunto" deve conter mais de um caractere.');
      return;
    }

   
    if (!mensagem1.trim() && !mensagem2.trim()) {
      setMensagem('Pelo menos uma das mensagens deve estar preenchida.');
      return;
    }

    const regexLink = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w- ./?%&=]*)?$/i;
    if (linkimg && !regexLink.test(linkimg)) {
      setMensagem('O link da imagem não é válido.');
      return;
    }
    setJanelaVisivel(true);

  }


  async function EnviarEmail() {
    // Validações básicas
    if (dadosEnvio.assunto.trim().length < 2) {
      setMensagem('O assunto deve conter mais de um caractere.');
      return;
    }
    if (!dadosEnvio.mensagem1.trim() && !dadosEnvio.mensagem2.trim()) {
      setMensagem('Preencha pelo menos uma das mensagens (mensagem1 ou mensagem2).');
      return;
    }
    if (dadosEnvio.linkimg && !/^https?:\/\/[\S]+$/.test(dadosEnvio.linkimg)) {
      setMensagem('O link da imagem deve ser uma URL válida.');
      return;
    }

    setIsLoading(true);
    setMensagem('');

    try {
      const response = await axios.post('https://web-production-7ea7.up.railway.app/func/enviaEmailusers/aut', {
        ...dadosEnvio,
        destino: usuarioDestino
      },
        { withCredentials: true, });
      setdadosEnvio(
        {
          assunto: '',
          mensagem1: '',
          linkimg: '',
          mensagem2: ''
        }
      )
      setMensagem(response.data.message || 'Email enviado com sucesso!');
      setJanelaVisivel(false);
    } catch (error) {

      setMensagem(error.response?.data?.message || 'Erro ao enviar email.');

    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    setUsuarioDestino(event.target.value);
  };

  return (
    <>
      {janelaVisivel ? (
        <div className="fixed w-full h-full bg-black/80 z-30 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
          <div className="top-0 overflow-y-auto md:overflow-y-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-5 rounded shadow-lg w-full h-full md:w-120 md:h-120 z-30 mt-0 opacity-0 animate-fadeIn">

            <div className="grid grid-cols-12 border-b pb-2 mt-3">
              <div className="col-span-11">
                <h1 className="text-center text-lg md:ml-15">Para Quem se destina esse Email?</h1>
                {mensagem !== '' && <h1 className="text-center text-red-500">{mensagem}</h1>}
              </div>
              <div
                className="col-span-1 cursor-pointer"
                onClick={() => {
                  setJanelaVisivel(false);
                  document.body.style.overflow = 'auto';
                }}
              >
                <img src="/x-lg.svg" alt="" className="h-10"/>
              </div>
            </div>

            <div className="w-[70%] mx-auto mt-10">
              <p><strong>Escolha o público-alvo:</strong></p>

              <label className="">
                <input
                  className="mr-5 mt-5"
                  type="radio"
                  name="publicoAlvo"
                  value="todos"
                  checked={usuarioDestino === 'todos'}
                  onChange={handleChange}
               />
                Para todos os fãs
              </label><br/>

              <label>
                <input
                  className="mr-5 mt-5"
                  type="radio"
                  name="publicoAlvo"
                  value="catalogo"
                  checked={usuarioDestino === 'catalogo'}
                  onChange={handleChange}
               />
                Fãs com interesse no Catálogo de Roupas
              </label><br/>

              <label>
                <input
                  className="mr-5 mt-5"
                  type="radio"
                  name="publicoAlvo"
                  value="games"
                  checked={usuarioDestino === 'games'}
                  onChange={handleChange}
               />
                Fãs com interesse em Games/Torneios
              </label>

              <p className="mt-4">Selecionado: <strong>{usuarioDestino || 'Nenhum'}</strong></p>
              <button
                className="w-full bg-black p-2 rounded-lg text-white transition easy-in-out duration-300 hover:bg-white hover:text-black cursor-pointer mt-10"
                onClick={EnviarEmail}
                disabled={isLoading}
              >
                {isLoading ? 'Enviando...' : 'Enviar Email'}
              </button>
            </div>
          </div>
        </div>
      ) : ""}

<div className='overflow-y-auto w-full h-screen relative'>
      <h1 className='text-white text-center  md:text-lg p-5 ml-5'>
        Envio de Email Promocionais Furia
      </h1>
      {mensagem != '' ? <h1 className='text-center text-red-500'>{mensagem}</h1> : ''}
      <hr/>
      <p className='text-white mt-5 text-center'> Está página deve ser utilizada somente para envio de Emails para Fãns que aceitaram receber anuncios Promocionais Furia ao Enviar você pode personalizar para quem deve receber o mesmo.
        <br/>
        A ordem das informações serão a ordem em que os items serão enviados</p>

      <div className='w-[50%] mx-auto text-white mt-10'>
        <p>
          Insira o Assunto do Email*
        </p>
        <input
          type="text"
          className='w-full border rounded px-2 py-2 mb-4 mt-2'
          value={dadosEnvio.assunto}
          onChange={(e) => { setdadosEnvio({ ...dadosEnvio, assunto: e.currentTarget.value }) }}
       />
        <p>
          Insira a Mensagem Promocional
        </p>
        <textarea className='w-full h-40 border rounded px-2 py-2 mb-4 mt-2' value={dadosEnvio.mensagem1}
          onChange={(e) => { setdadosEnvio({ ...dadosEnvio, mensagem1: e.currentTarget.value }) }}/>

        <input
          type="text"
          className='w-full border-b  px-2 py-2 mb-4 mt-2 text-center' placeholder='Insira a URL da Img Ex:https://furiagg.fbitsstatic.net/img/p/camiseta-oficial-furia-adidas-preta-150265/337491-2.jpg?w=4' value={exibeImagem} onChange={(e) => { setExibeImagem(e.currentTarget.value); setdadosEnvio({ ...dadosEnvio, linkimg: e.currentTarget.value }) }}></input>
        <p className='text-center my-2'>A imagem pode ser visualizada Abaixo(OBS: se a imagem não aparecer após digitar a url Corrija, pois ela deve ficar visivel automaticamente)</p>
        <div className=''>
          <img className='rounded-md h-[40%] w-[40%] mx-auto' src={exibeImagem}/>
        </div>

        <p className='mt-5'>Case Queira Inserir um texto abaixo da imagem insira Aqui</p>
        <textarea className='w-full h-40 border rounded px-2 py-2 mb-4 mt-2' value={dadosEnvio.mensagem2}
          onChange={(e) => { setdadosEnvio({ ...dadosEnvio, mensagem2: e.currentTarget.value }) }}/>

        <button className='w-full bg-white text-black rounded-md p-3 my-5 hover:bg-black hover:text-white transition easy-in-out duration-500 cursor-pointer' onClick={EnviarDadosPromocao}>Enviar Email</button>
      </div>
      </div>
    </>
  )
}

export default EnvioDeAlertas