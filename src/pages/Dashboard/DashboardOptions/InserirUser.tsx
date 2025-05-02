import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

function InserirUser() {

  const [visualizarSenha, setvisualisarSenha] = useState(false)
  const [infosUser, setInfosUSer] = useState({
    nome: '',
    email: '',
    senha: '',
    tipo: ''
  })
  const [isLoading, setisLoading] = useState(false)
  const [mensagemServer, setmensagemServer] = useState('')


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

  async function enviarDadosUser() {
    setisLoading(true);
    setmensagemServer('Enviando...');

    try {
      const response = await axios.post(
        'https://web-production-7ea7.up.railway.app/func/insereuserfurioso/user',
        infosUser,
        {
          withCredentials: true, 
        }
      );

      setisLoading(false);
      setmensagemServer('Sucesso ao inserir usuário');

      // Limpa os campos
      setInfosUSer({
        nome: '',
        email: '',
        senha: '',
        tipo: ''
      });

      return response.data;

    } catch (error) {
      setisLoading(false);

      if (error.response) {
        const status = error.response.status;

        if (status === 400) {
          setmensagemServer(error.response.data.message || 'Dados inválidos ou e-mail já existente.');
        } else if (status === 401) {
          setmensagemServer('Token ausente ou inválido. Faça login novamente.');
        } else if (status === 500) {
          setmensagemServer('Erro interno no servidor ao tentar inserir o usuário.');
        } else {
          setmensagemServer('Erro inesperado ao enviar os dados.');
        }


      } else if (error.request) {

        setmensagemServer('Erro de conexão com o servidor. Verifique sua internet ou se o backend está ativo.');

      } else {

        setmensagemServer(`Erro: ${error.message}`);
      }

      throw error;
    }
  }

  return (
    <>
      <h1 className='text-white text-center md:text-lg p-5 ml-5'>
        Inserir Novo Usuario Furia
      </h1>
      <hr />
      <div className='absolute md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 p-5 rounded  w-full md:w-100 h-full md:w-190 md:h-180  mt-0 md:mt-0'>
        <h1 className='text-white text-center md:text-lg  ml-5'>
          Insira as Informações do Usuário
        </h1>
        {mensagemServer && <p className='text-center text-white'><strong>{mensagemServer}</strong></p>}
        <div className='h-[90%] flex justify-center items-center'>
          <div className='w-[80%]'>
            <h1 className='text-white pt-5'>
              Nome
            </h1>
            <input className='p-2  border-b-1 border-white w-full text-white' value={infosUser.nome} onChange={(e) => {
              setInfosUSer({ ...infosUser, nome: e.currentTarget.value })
            }}></input>
            <h1 className='text-white pt-5'>
              Email Furia
            </h1>
            <input className='p-2 border-b-1 border-white border-white w-full text-white' value={infosUser.email} onChange={(e) => {
              setInfosUSer({ ...infosUser, email: e.currentTarget.value })
            }}></input>
            <p className='text-sm text-white '>OBS:o email será auto completado com @furia.gg no envio</p>
            <h1 className='text-white pt-5'>
              Senha
            </h1>
            <div className='flex relative'>
              <input type={visualizarSenha ? "text" : "password"} placeholder='ex:panda2123' className='p-2 border-b-1 border-white border-white w-full text-white' value={infosUser.senha} onChange={(e) => {
                setInfosUSer({ ...infosUser, senha: e.currentTarget.value })
              }} />
              <img src={visualizarSenha ? "/SenhaVisivelCorAlternativa.png " : "/SenhaInvisivelCorAlternativa.png"} alt="" className='w-10 absolute left-60 md:left-130  cursor-pointer' onClick={() => {
                if (visualizarSenha) {
                  setvisualisarSenha(false)
                }
                else {
                  setvisualisarSenha(true)
                }
              }} />
            </div>
            <div className=''>
              <select
                value={infosUser.tipo}
                onChange={(e) => setInfosUSer({ ...infosUser, tipo: e.currentTarget.value })}
                className='border rounded-lg p-2 w-60 md:w-full bg-white mt-5 cursor-pointer' >
                <option value="">Selecione Tipo de Acesso</option>
                <option value="admin">Admin</option>
                <option value="comum">Comum</option>
              </select>
            </div>
            <button className='bg-white w-full rounded-md p-2 mt-9 hover:bg-black hover:text-white transition easy-in-out duration-300 cursor-pointer' disabled={isLoading} onClick={enviarDadosUser} >{isLoading ? "Enviando Aguarde" : "Enviar"}</button>
            <h1 className='text-white pt-5 text-center'>
              Deseja Enviar Usuario em Cadeia?
            </h1>
            <h1 className='text-center text-blue-600 hover:text-blue-900 cursor-pointer'> Clique Aqui </h1>
          </div>
        </div>
      </div>
    </>

  )
}

export default InserirUser