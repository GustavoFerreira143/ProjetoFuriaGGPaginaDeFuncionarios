import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { redirect } from 'react-router'
import { useUser } from '../../Context'

function Login() {

    const { setPermissaoUser } = useUser();
    const [visualizarSenha, setvisualisarSenha] = useState(false)
    const [dadosUser, setDadosUser] = useState({
        email:'',
        senha:''
    })
    const [error, seterror] = useState('') 
    const [isLoading, setisLoading] = useState(false) 

    useEffect(() => {
        function VerificaUser() {
            axios.post('https://web-production-7ea7.up.railway.app/func/conferelogin/VerificaLogado', {nome:"Vazio"}, {
                withCredentials: true
            })
            .then(response => {
                window.location.replace('/dashboard'); // redirecionamento caso já esteja logado
            })
            .catch(error => {

            });
        }
    
        VerificaUser();
    }, []);

    function EnviaDados() {
        seterror('');
        setisLoading(true);

        axios.post('https://web-production-7ea7.up.railway.app/func/conferelogin/login', dadosUser, {
            withCredentials: true
        })
        .then(response => {
            const permissaoUser = response.data.permissaoUser;
            localStorage.setItem('permissaoUser', response.data.permissaoUser);
            window.location.replace('/dashboard');
        })
        .catch(error => {
            setisLoading(false);
            if (error.response) {
                if (error.response.status >= 400 && error.response.status < 500) {
                    const erroMensagem = error.response.data?.erro || 'Usuário ou senha inválidos.';
                    seterror(erroMensagem);
                } else if (error.response.status >= 500) {
                    seterror('Erro inesperado, tente novamente.');
                } else {
                    seterror('Erro ao enviar feedback, tente novamente.');
                }
            } else {
                seterror('Erro de conexão. Tente novamente.');
            }
        });
    }
    

    return (
        <>
        <img id="BackGround" className='fixed w-full h-screen bg-black z-10' src='/FuriaFundo.png' />
            <div className='fixed w-full h-screen bg-black/95 z-10' >
                <div className='overflow-y-auto md:overflow-y-hidden fixed top-1/2 md:left-1/2 transform md:-translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded shadow-md shadow-white bg-white w-full md:w-100 h-120 md:w-130 md:h-120 z-20  md:mt-0' >
                    <h1 className='text-center text-lg mt-4 font-semibold'>
                        Login de Funcionarios Furia GG
                    </h1>
                    {error && <h1 className='m-0 text-center text-red-500 font-semibold'>{error}</h1>}
                    <br />
                    <hr />
                    <div className='flex intems-center justify-center'>
                        <div className=''>
                            <h1 className='text-center md:text-start text-md mx-5 mt-7'>Digite o nome no Email Furia</h1>
                            <input type="text" placeholder='ex:panda' className='border-b p-2 mt-5 mx-5 w-90 text-center md:text-start' value={dadosUser.email} onChange={(e) => setDadosUser({...dadosUser, email:e.currentTarget.value})} />
                            <p className='text-sm mx-5 text-center md:text-start'>OBS:o email será auto completado com @furia.gg no envio</p>
                            <h1 className='text-md mx-5 mt-7 text-center md:text-start'>Digite sua senha de Usuario Furia</h1>
                            <div className='flex w-100 relative'>
                                <input type={visualizarSenha ? "text" : "password"} value={dadosUser.senha} onChange={(e) => setDadosUser({...dadosUser, senha:e.currentTarget.value})} placeholder='ex:panda2123' className='border-b p-2 m-5 w-90 text-center md:text-start' />
                                <img src={visualizarSenha ? "/SenhaVisivel.png " : "/SenhaInvisivel.png"} alt="" className='w-10 absolute top-5 left-85' onClick={() => {
                                    if(visualizarSenha)
                                    {
                                        setvisualisarSenha(false)
                                    }
                                    else
                                    {
                                        setvisualisarSenha(true)
                                    }
                                    }}/>
                            </div>    

                            <br />
                            <button className='w-full bg-black text-white p-2 rounded-md transition hover:bg-blue-500 easy-in-out duration-300 cursor-pointer' disabled={isLoading} onClick={EnviaDados}>{isLoading ? "Carregando..." : "Efetuar Login"}</button>
                        </div>

                    </div>

                </div>


            </div>
        </>
    )
}

export default Login