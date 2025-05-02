<h1 align="center">Neste Projeto Será criado o Acesso de Usuários Furia para terem acesso as informações coletadas e efetuar propagandas Furia</h1>
<h3>Objetivos da Aplicação Funcionarios</h3>
<ul>
  <li>
      Aplicação Responsiva, Amigavel de fácil entendimento e que siga os padrões Furia
  </li>
  <li>
      Recebimento Asyncrono de Informações 
  </li>
  <li>
      Tratamento de Exeções e Bugs 
  </li>
  <li>
      Análise de conjunto de dados Enviados pelo FeedBack de clientes. 
  </li>
  <li>
      Envio de Noticias atualizadas para página de Clientes
  </li>
    <li>
      Controle de Visulização com base no tipo de usuario Logado 
  </li>
  <li>
      Cadastro de Usuário e edição de Dados 
  </li>
</ul>
<h3>Layout da Aplicação</h3>
<p>
  Para esse Projeto foram utilizados rigorosos critérios para criação de layout seguindo ao máximo o padrão da marca furia, referencias mais utilizadas foram do site de catalogo https://www.furia.gg .
</p>
<h3>Ferramentas Utilizadas</h3>
<p>
  Abaixo segue as ferramentas utilizadas para Criar a Aplicação
</p>
<ul>
  <li>
    Sistema Operacional Windows 10
  </li>
  <li>
    NodeJS versão 22.12.0
  </li>
  <li>
    Npm versão 11.0.0
  </li>
  <li>
    IDE Visual Studio Code, juntamente com a Extenção ES7+ React/Redux/React-Native snippets
  </li>
</ul>
<p>Agora segue abaixo Ferramentas para Criação do Código via NodeJS Npm</p>
  <li>
    Vite com Configuração para React + Código JS
  </li>
  <li>
    Integração de TailWindCss ao Projeto
  </li>
  <li>
    React Router Dom
  </li>
  <li>
    Axios para Requisições
  </li>
  <li>
    Recharts para Criação de Gráficos personalizados com base me Dados recebidos.
  </li>
    <li>
    html2canvas utilizado para tirar foto de graficos de forma automatica com base em cliques.
  </li>
<h2>Como deve ser Feito para Efetuar a Integração do Código?</h2>
<p>
  Necessario Obrigatóriamente o Dowload de NODEJS e disponibilidade do NPM do node.
</p>
<h3>
  Passo a Passo:
</h3>
<p>
  Efetue o Download do NodeJs em sua Máquina, segue o link de Dowload: https://nodejs.org/pt, após download por Completo Recomendado rodar no terminal da Máquina: node --version e npm --version, assim verificando a disponibilidadde das mesmas na máquina.
</p>
<p>
  Clone o repositório na máquina local, pondendo ser feito Dowload Zip do arquivo ou via git bash utilizando o comando : git clone https://github.com/GustavoFerreira143/ProjetoFuriaGGPaginaDeFuncionarios.git
</p>
<p>
  Por fim Basta abrir o terminal na pasta criada e rodar o comando npm install, após a finalização deve ser rodado npm run dev e então a aplicação já deverá estar ativa, pois ela puxa o build diretamente do package.json
</p>
<p>
  Caso por ventura tenha alguma falha em dowloads, segue abaixo os respectivos npm install de itens instalados no projeto:
</p>
<ul>
  <li>
    npm install react-router-dom 
</li>
  <li>
    npm install axios 
</li>
  <li>
    npm install tailwindcss @tailwindcss/vite
</li>
    <li>
    npm install html2canvas
</li>
      <li>
    npm install recharts
</li>
</ul>
<h3>IMPORTANTE!!!</h3>
<h4>Há links de requisições pelo código eles funcionam em Conjunto da API presente em https://github.com/GustavoFerreira143/ApiProjetoFuriaGG</h4>
<p>Necessario a configuração do mesmo para correto funcionamento da página, pois sem ele só havera uma landPage e modais sem suas respectivas funcionalidades</p>

<h1>Estrutura de Código</h1>
<p>O código está bem estruturado e espero que de simples compreenssão </p>
<p>Estarei inserindo aqui os Arquivos e seus respectivos conteudos, caso se tenha a necessidade de Algum Debug</p>
<pre>
  Importante Informação 
A função VerificaUser() dentro de um useEffect está inserido em todos os componentes do código e seu uso é o mesmo se o usuário estiver logado, ou seja,
Já tem login no sistema ele não deve ir para tela de login e caso não esteja ele deve ser redirecionado para login automaticamento o obrigando fazer login para acesso a rotas desejadas
_______________________________________________________________________________________________________________________________________________________________________________________________ 
|_src
   |_App.jsx <- Cria as Rotas do Projeto e o UserProvider para uma váriavel super global para verificações de login
   |
   |_Context.jsx <- Cria as Variaveis super Globais que puxam valores do LocalStorage para reutilização no Código, as váriveis do localStorage são "permissaoUser" que recebe uma string e localStorage "telaUser" para armazenar a tela onde o usuario estava ao fechar o site e com esses itens são criados os userState permissaoUser e telaUser
   |
   |_index.css <- Css padrão da aplicação que contém as animações criadas manualmente e algumas propriedades globais de css
   |
   |_GeralComponents
   |    |
   |    |_Footer
   |    |  |_Footer.tsx <- contém o footer padrão da aplicação para ser um elemento responsivo e fixo na página 
   |    |_NavBar
   |      |_NavBar.tsx <- NavBar contém o elemento fixo navBar que contém o navBar padrão da página mais a lógica de Logout na Função EfetuarLogout() que é disparada em um onClick e esse Click também faz a limpeza dos itens no localStorage os demais itens são para caso queria ser ativado o NavBar animado como na página de clientes
   |      |_NavBar.css <- simples css para o NavBar para algumas propriedades simples
   |
   |_pages
     |_Login
     |   |_Login.tsx <- Contém uma tela estilo modal para capturar informações de login e enviar por meio da função EnviaDados() em caso de sucesso ela seta os valores do localStorage e guarda o cookie seguro de usuário e então o re-direciona para /dashboard
     |
     |_Dashboard
       |_Dashboard.tsx <- Contém o componente que recebe todas as demais componentes do código para exibição sem a necessidade de rotas especificas dentro dele contém a importação de todos os items dentro da pasta DashboardOptions, barra lateral animada e responsiva que faz a navegação entre esses componentes e proteção de alguns dados em caso o login seja comum.
       |_DashboardOptions
         |
         |_AtualizaNoticias
         |  |
         |  |_AtualizaNoticias.tsx <- neste arquivo contém a parte visual das noticias com 4 modais e 1 tela base a tela base contém todas as noticias armazenadas no sistema com base no que o cliente vê, os valores são coletados em CarregaNoticias em Logicas e então o primeiro modal é para vizulização completa do texto da noticia presente no Ver Mais,
         |  |  o segundo modal é referente em caso o usuario clicar em adicionar noticia onde nele mostra as opções para inserção de uma nova noticia, a lógica está presente em Logicas RecebeInsereNoticia.
         |  |  o terceiro é o modal referente a quando o usuário clicar em deletar noticia, o mesmo apresenta informações das noticias atuais recuperadas e exibe para o usuario em formato de lista possibilitando o deleção do respectivo item.
         |  |  o quarto modal é para a confirmação de deleção e em caso usuário confirma deleção é feito lógica de delação presente em Lógicas DeletarNoticia .
         |  |
         |  |_Logicas
         |     |_CarregaNoticias.js
         |     |       |_RecebeNoticias() <- Envia Requisição e retorna as noticias presentes no banco
         |     | 
         |     |_DeletarNoticias.js
         |     |        |
         |     |        |_Deletar() <- essa função é responsavel por enviar os dados da noticia para deleção no backend
         |     |        
         |     |_RecebeInsereNoticias.js
         |              |
         |              |_EnviarNoticia() <- Função que trata e envia noticias para a api que a armazena
         |                      
         |_DashboardView.tsx <- neste componente contém um modal e a página, este componente faz a criação e exibição das tabelas personalizadas com base nos retornos da função CarregaDashboard() que recebe os valores da respectiva tabela e insire nos seus respectivos componentes,  
         |                      já o modal que somente adms tem acesso que utiliza a função handleSubmitGrafico que envia dados para o banco para criação de uma tabela com dados personalidados e a função exportToPNG ela funciona utilizando html2canvas para criar
         |                      uma imagem da tabela de dados geradas.
         |  
         |_EnvioDeAlertas.tsx <- neste componente é onde pode ser enviado os emails personalizados aos usuários que autorizaram o envio de anuncios promossionais da furia, ele contém a função EnviarDadosPromocao() que valida se todos os campos obrifatórios foram 
         |                       preenchidos e se foram preenchidos corretamente e a função EnviarEmail() que ao ser selecionado os usuários que vão receber o email ele valida os dados e envia para a API para a mesma enviar os emails. 
         |  
         |
         |_InserirUser.tsx <- este componente é visivel somente para admins nele por meio da função enviarDadosUser() ele envia os dados para criação de novos usuários com base em dados digitados nos inputs e retorna sucesso ou erro.
         |
         |_MensagemFeedback.tsx <- neste componente é onde são exibidos todos os feedbacks dos usuários de forma ordenada e ao clicar no item é aberto um modal com os dados enviados pelo usuário, ao abrir a página é rodado a seguinte função RecebeInfosUser(), ela é responsavel por recuperar os dados de feedbacks armazenados e retorna os dados para serem manipulados.
         |                         tambem contém um useEffect que detecta o final do scroll da página e envia requisições personalizadas para carregamento dinâmico de dados.
         |                          outra função tambem é a enviaIdParaAtualizarVisualizado(id) que ao clicar para ver a ficha do cliente é atualizado o item visualizado da tabela para ter o controle de quais foram visualizadas
         |                          contém a seguinte função aplicarFiltros utilizada para aplicar os filtros de página para retorno de informação personalizada de usuário.
         |  
         |
         |_VerificaAtualizaUser.tsx <- este componente é visivel somente para admins nesta página é retornado os funcionarios presentes no sistema, possibilitando a edição de senha, desativação e troca de funções, este componente contém um useEffect responsável pelo primeiro carregamento do usuário para vizulizar os 10 primeiros funcionarios
                                      outro useEffect faz o carregamento de forma dinamica enviando uma requisição para retornar mais usuários quando chega ao final da página
                                      a outro useEffect que a cada vez que o state pesquisaUser for modificado ele realiza pesquisas de usuário e com settimout para evitar flood de dados.
                                      esta função EnviarAlteracoes() é disparada quando o usuário modifica as informações do usuário e sanatiza e envia para a api para efetuar a alteração.    
  </pre>
<h1 align="center">Por Fim Aproveite</h1>


