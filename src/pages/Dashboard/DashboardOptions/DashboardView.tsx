import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line
} from 'recharts';
import html2canvas from 'html2canvas';
import { useUser } from '../../../Context'

function DashboardView() {


    const { permissaoUser } = useUser();
    const [dados, setDados] = useState(null);
    const [janelaVisivel, setJanelaVisivel] = useState(false)

    const [tabela, setTabela] = useState("");
    const [campo, setCampo] = useState("");
    const [condicoes, setCondicoes] = useState("");

    const [dadosGrafico, setDadosGrafico] = useState([]);
    const [tipoGrafico, setTipoGrafico] = useState("");


    const handleSubmitGrafico = async (e) => {
        e.preventDefault();

        if (!tabela || !campo || !tipoGrafico) {
            alert("Tabela, campo de agrupamento e tipo de gráfico são obrigatórios.");
            return;
        }

        try {
            const response = await axios.post("https://localhost:5000/rec/gera/views/grafic", {
                tabela,
                campo_agrupamento: campo,
                condicoes: condicoes || null
            }, {
                withCredentials: true
            });
            console.log(response.data)
            setDadosGrafico(response.data.dados);

        } catch (error) {
            console.error("Erro ao gerar gráfico:", error);
            alert("Erro ao gerar gráfico. Verifique os dados e tente novamente.");
        }
    };

    useEffect(() => {
        async function VerificaUser() {
            try {
                await axios.post('https://localhost:5000/func/conferelogin/VerificaLogado', { nome: "Vazio" }, {
                    withCredentials: true
                });
            } catch (error) {
                window.location.replace('/');
            }
        }

        async function CarregaDashboard() {
            try {
                const response = await axios.get('https://localhost:5000/rec/dash/views/user', {
                    withCredentials: true
                });

                const data = response.data;
                setDados(data);

            } catch (error) {

            }
        }

        VerificaUser();
        CarregaDashboard();
    }, []);

    const exportToPNG = () => {
        const chartElement = document.getElementById('chartDiv');
        html2canvas(chartElement).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'grafico.png'; // Nome do arquivo de imagem
            link.href = canvas.toDataURL();
            link.click();
        });
    };


    if (!dados) return <div>Carregando dashboard...</div>;

    return (
        <>
            {janelaVisivel ?
                <div className="fixed w-full h-full bg-black/80 z-30 transition-opacity duration-500 ease-in-out opacity-100 animate-fade">
                    <div className="top-0 overflow-y-auto overflow-x-hidden fixed md:top-1/2 md:left-1/2 transform md:-translate-x-1/2 md:-translate-y-1/2 bg-white p-5 rounded shadow-lg w-full md:w-100 h-full md:w-160 md:h-160 z-30 mt-0 opacity-0 animate-fadeIn">
                        <div className="grid grid-cols-12 border-b pb-2 mt-3">
                            <div className="col-span-11">
                                <h1 className="text-center text-lg md:ml-15">Criar Gráfico</h1>
                            </div>
                            <div className="col-span-1 cursor-pointer">
                                <img
                                    src="/x-lg.svg"
                                    alt=""
                                    className="h-10"
                                    onClick={() => setJanelaVisivel(false)}
                                />
                            </div>
                        </div>

                        <form className="mt-4 space-y-4" onSubmit={handleSubmitGrafico}>
                            <div>
                                <label className="block text-sm font-medium">Tabela</label>
                                <select
                                    value={tabela}
                                    onChange={e => setTabela(e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="fansFuria">Fans da Furia</option>
                                    <option value="JogosFavoritos">Jogos Favoritos dos Fãns</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Campo para Agrupar</label>
                                <select
                                    value={campo}
                                    onChange={e => setCampo(e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    {tabela === 'fansFuria' && (
                                        <>
                                            <option value="estado">Estado</option>
                                            <option value="redeSocial">Rede Social</option>
                                            <option value="idade">Idade</option>
                                            <option value="interesseEmComp">Interesse em Comprar</option>
                                            <option value="membroFavorito">Membro Favorito</option>
                                            <option value="interesseCatalogo">Interesse em Catálogo</option>
                                            <option value="modeloInteresse">Modelo de Interesse</option>
                                            <option value="receberPromo">Receber Promoções</option>
                                            <option value="vizualizado">Visualizado</option>
                                        </>
                                    )}
                                    {tabela === 'JogosFavoritos' && (
                                        <option value="nomeJogo">Nome do Jogo</option>
                                    )}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Condições (opcional)</label>
                                <input
                                    type="text"
                                    placeholder="Ex: idade > 18 AND estado = 'SP'"
                                    value={condicoes}
                                    onChange={e => setCondicoes(e.target.value)}
                                    className="w-full border rounded p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Tipo de Gráfico</label>
                                <select
                                    value={tipoGrafico}
                                    onChange={e => setTipoGrafico(e.target.value)}
                                    className="w-full border rounded p-2"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="bar">Gráfico de Barras</option>
                                    <option value="line">Gráfico de Linhas</option>
                                    <option value="area">Gráfico de Área</option>
                                </select>
                            </div>
                            <div className='flex justify-center'>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                >
                                    Gerar Gráfico
                                </button>
                            </div>
                        </form>
                        {dadosGrafico.length > 0 && (
                            <>
                                <div id="chartDiv" onClick={exportToPNG} className='w-full h-[300px]'>
                                    {tipoGrafico === "bar" && (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={dadosGrafico}>
                                                <XAxis
                                                    dataKey={campo}
                                                    tickFormatter={(valor) => {
                                                        if (campo === "interesseEmComp") {
                                                            return valor === 1 ? "Sim" : valor === 0 ? "Não" : valor;
                                                        }
                                                        return valor;
                                                    }}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Bar dataKey="quantidade" fill="#1E40AF" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    )}
                                    {tipoGrafico === "line" && (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={dadosGrafico}>
                                                <XAxis
                                                    dataKey={campo}
                                                    tickFormatter={(valor) => {
                                                        if (campo === "interesseEmComp" || campo === "receberPromo" || campo === "vizualizado" || campo === "interesseCatalogo") {
                                                            return valor === 1 ? "Sim" : valor === 0 ? "Não" : valor;
                                                        }
                                                        return valor;
                                                    }}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Line type="monotone" dataKey="quantidade" stroke="#3B82F6" />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    )}

                                    {tipoGrafico === "area" && (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={dadosGrafico}>
                                                <XAxis
                                                    dataKey={campo}
                                                    tickFormatter={(valor) => {
                                                        if (campo === "interesseEmComp" || campo === "receberPromo" || campo === "vizualizado" || campo === "interesseCatalogo") {
                                                            return valor === 1 ? "Sim" : valor === 0 ? "Não" : valor;
                                                        }
                                                        return valor;
                                                    }}
                                                />
                                                <YAxis />
                                                <Tooltip />
                                                <Legend />
                                                <Area type="monotone" dataKey="quantidade" stroke="#60A5FA" fill="#60A5FA" />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
                :
                ""
            }


            <div className='overflow-y-auto w-full h-screen relative' id="container">
                <h1 className='text-center text-lg text-white my-5 ml-5 md:ml-0 font-semibold'>
                    Analise de Graficos de FeedBack
                </h1>
                <hr />
                {permissaoUser == 'admin' ?
                    <div className='flex justify-center mt-5'>
                        <button className='bg-white p-3 rounded-md transition easy-in-out hover:bg-blue-500 duration-600 cursor-pointer' onClick={() => setJanelaVisivel(true)}>Criar Gráfico Personalizado</button>
                    </div>
                    :
                    ""
                }
                {/* Interesse em Comp */}
                <h1 className='text-center text-white text-2xl my-10 md:my-5'>Gráficos de Interesse de Usuário</h1>
                <div className=" w-[95%] mx-auto completo ">
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                        <div className="sombra">
                            <h2 className="text-xl font-bold my-3 text-center text-white">Interesse em Competições</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dados.interesseComp}
                                        dataKey="Quantidade"
                                        nameKey="interesseEmComp"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name }) => name}
                                        stroke="#0"
                                    >
                                        {dados.interesseComp.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={entry.interesseEmComp === "Sim" ? "#1E40AF" : "#19B0EC"}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#222222', borderColor: '#ffffff', color: '#ffffff' }}
                                        itemStyle={{ color: '#ffffff' }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="border rounded-lg sombra">
                            <h2 className="text-xl font-bold my-3 text-center text-white">Interesse em Catálogo</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dados.interesseCatalogo}
                                        dataKey="Quantidade"
                                        nameKey="interesseCatalogo"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name }) => name}
                                        stroke="#0"
                                    >
                                        {dados.interesseCatalogo.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={entry.interesseCatalogo === "Sim" ? "#1E40AF" : "#19B0EC"}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#222222', borderColor: '#ffffff', color: '#ffffff' }}
                                        itemStyle={{ color: '#ffffff' }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="border rounded-lg sombra">
                            <h2 className="text-xl font-bold my-3 text-center text-white">Desejam Receber Promoções</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dados.receberPromocoes}
                                        dataKey="Quantidade"
                                        nameKey="receberPromo"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name }) => name}
                                        stroke="#0"
                                    >
                                        {dados.receberPromocoes.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={entry.receberPromo === "Sim" ? "#1E40AF" : "#19B0EC"}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#222222', borderColor: '#ffffff', color: '#ffffff' }}
                                        itemStyle={{ color: '#ffffff' }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        {/* Distribuição de Idades */}
                        <div className="border rounded-lg sombra">
                            <h2 className="text-xl font-bold my-3 text-center text-white">Distribuição de Idades</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dados.distribuicaoIdades}
                                        dataKey="Quantidade"
                                        nameKey="faixa_etaria"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label={({ name }) => name}
                                        stroke="#000000"
                                    >
                                        {dados.distribuicaoIdades.map((entry, index) => {
                                            const tonsAzuis = [
                                                "#19B0EC",  // Azul vívido
                                                "#1E40AF",  // Azul escuro Tailwind
                                                "#456FE8",  // Azul claro Tailwind
                                                "#2F90EA",
                                                "#195DBA"  // Azul profundo
                                            ];
                                            return <Cell key={index} fill={tonsAzuis[index % tonsAzuis.length]} />;
                                        })}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#222222', borderColor: '#ffffff', color: '#ffffff' }}
                                        itemStyle={{ color: '#ffffff' }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>

                        </div>
                    </div>

                    {/* Rede Social Preferida */}
                    <div className="border p-5 rounded-lg shadow-md sombra md:w-[50%] md:mx-auto">
                        <h2 className="text-xl font-bold mb-3 text-center text-white">Redes Socias Mais Utilizadas</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dados.redeSocialPreferida}>
                                <PolarGrid />
                                <PolarAngleAxis dataKey="redeSocial" />
                                <PolarRadiusAxis />
                                <Radar name="Usuários" dataKey="Quantidade" fill="#1E40AF" fillOpacity={0.6} />
                                <Tooltip />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/*-----------------------------------------------------------------------------------Usuarios Por Estado-----*/}

                <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* Usuários por Estado */}
                    <div className="border p-5 rounded-lg shadow-md sombra">
                        <h2 className="text-xl font-bold mb-3 text-center text-white">Usuários por Estado</h2>
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={dados.usuariosPorEstado} layout="vertical">
                                <XAxis type="number" stroke="#fff" />
                                <YAxis type="category" dataKey="estado" stroke="#fff" />
                                <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#666', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                                <Bar dataKey="Quantidade" fill="#60a5fa" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>



                    {/* Ranking de Jogos Mais Amados */}
                    <div className="border p-5 rounded-lg shadow-md text-sm sombra">
                        <h2 className="text-xl font-bold mb-3 text-center text-white">Ranking de Jogos Favoritos</h2>
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart data={dados.rankJogosAmados} layout="vertical">
                                <XAxis type="number" stroke="#fff" />
                                <YAxis type="category" dataKey="jogo" stroke="#fff" />
                                <Tooltip contentStyle={{ backgroundColor: '#222', borderColor: '#fff', color: '#fff' }} />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                                <Bar dataKey="Quantidade" fill="#60a5fa" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>

            </div>
        </>
    );
}

export default DashboardView;
