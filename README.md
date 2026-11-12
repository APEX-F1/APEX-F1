# APEX F1

> Um site-homenagem à Fórmula 1 e a Ayrton Senna, com quiz, simulador de corrida e dashboard.

Projeto individual de **Manoel Alves da Silva Filho** · Análise e Desenvolvimento de Sistemas · São Paulo Tech School (SPTech) · 2026

---

## Sobre o projeto

O APEX F1 nasceu de uma memória simples: os domingos em que meu pai comprava pastel na feira e a gente assistia à corrida juntos. A Fórmula 1 voltou para a minha vida depois de um tempo, e a minissérie *Senna* (Netflix, 29/11/2024) fez do Ayrton Senna o meu ídolo.

O site não é um produto para vender. É uma forma de compartilhar o que a Fórmula 1 e o Senna representam para mim e de mostrar, na prática, o que aprendi no curso: site, cadastro e login, banco de dados, API e dashboard. O prazo para tudo isso foi de seis semanas.

## O que o site tem

- **Cadastro e login:** o conteúdo restrito só abre para usuários cadastrados.
- **Página inicial:** resumo do projeto, grid com as equipes, principais pilotos (Lando Norris, Gabriel Bortoleto, Rafael Câmara e Charles Leclerc) e lendas do automobilismo.
- **Senna:** história, legado e maiores feitos.
- **McLaren:** uma área só para o meu time.
- **Minha história:** como, onde e por que a Fórmula 1 e o Senna entraram na minha vida.
- **Dedicações:** as pessoas que me ajudaram a chegar até aqui.
- **Paddock:** a área de jogos, com o quiz e o simulador de corrida.
- **Dashboard:** indicadores com os dados do quiz e do simulador.

### Quiz

16 perguntas e 144 pontos possíveis, divididas em três temas: **Fórmula 1**, **Ayrton Senna** e **Minha história**. O foco é a Fórmula 1 e o Senna, e as perguntas pessoais são poucas e breves.

### Simulador e mini campeonato

Um simulador de corrida em JavaScript, em que a pessoa escolhe um piloto ou digita o próprio nome e corre contra o grid fixo. O mini campeonato usa o grid de 22 pilotos (11 equipes), permite escolher o número do carro (sem repetir e sem o 17, aposentado pela FIA) e pontua do 1º ao 10º colocado.

### Dashboard

Mostra o desempenho no quiz, as perguntas mais erradas e os resultados do simulador, a partir dos dados guardados no banco.

## Tecnologias

- HTML, CSS e JavaScript
- Node.js (API) e MySQL (banco `apexf1`)
- Chart.js (gráficos da dashboard)
- `sessionStorage` para o controle de sessão
- Figma (protótipo das telas)
- VS Code, GitHub e Trello

## Protótipo

O protótipo das telas está no Figma: [APEX F1 – Protótipo do Site](https://www.figma.com/design/uaElOZDxyl0neLljWNpiGx/APEX-F1-%E2%80%93-Prot%C3%B3tipo-do-Site)

## Estrutura do repositório

O servidor serve a pasta `Site/public`, então os links usam caminhos como `/css/...` e `/js/...`.

```
APEX-F1/
├── Site/
│   └── public/
│       ├── css/          base.css, componentes.css e um CSS por página
│       ├── js/           cadastro.js, sessao.js, corrida.js e demais scripts
│       └── *.html        index, login, cadastro, senna, mclaren,
│                         minha-historia, dedicacoes, paddock, dashboard...
├── src/                  API (rotas, controllers e models)
├── database/             script SQL do banco apexf1
└── README.md
```

> Ajuste os nomes das pastas se a estrutura real do repositório for diferente.

## Banco de dados

O banco se chama `apexf1`. A tabela `usuario` guarda os usuários cadastrados (chave primária `idUsuario`), e as demais tabelas guardam os resultados do quiz e do simulador que alimentam a dashboard. O script completo, a modelagem lógica e o DER ficam na pasta `database/` e na documentação do projeto.

Pela proposta da disciplina de Sistemas Operacionais, o banco roda em uma máquina virtual Linux que contém somente o MySQL.

## Como rodar

1. Clone o repositório:
   ```bash
   git clone https://github.com/Manoel-Alves21/APEX-F1.git
   cd APEX-F1
   ```
2. Execute o script SQL da pasta `database/` no MySQL para criar o banco `apexf1` e as tabelas.
3. Configure o arquivo de ambiente (`.env.dev`) com os dados do banco e a porta da aplicação (`3333`).
4. Instale as dependências e inicie a API:
   ```bash
   npm i
   npm start
   ```
5. Abra no navegador: `http://localhost:3333`

## Controle de acesso

As páginas Dashboard, Paddock e Minha história são protegidas por `validarSessao`, que confere a sessão guardada no `sessionStorage`. Sem login, a pessoa volta para a tela de login. O botão **Sair** limpa a sessão. Depois do login, o usuário vai para a página inicial.

## Documentação

A documentação completa do projeto (contexto, objetivo, justificativa, escopo, premissas e restrições, diagrama técnico, backlog, burndown, modelagem lógica e tabelas) acompanha o repositório.

## Fora do escopo

- Aplicativo mobile nativo
- Autenticação avançada (como autenticação em dois fatores)

## Autor

**Manoel Alves da Silva Filho**

- GitHub: [Manoel-Alves21](https://github.com/Manoel-Alves21)
- LinkedIn: [manoel-alves-23a240323](https://www.linkedin.com/in/manoel-alves-23a240323/)

## Agradecimentos

À minha família e aos meus amigos, que estão na seção Dedicações do site, e ao Ayrton Senna, pela inspiração.

> *"No que diz respeito ao empenho, ao compromisso, ao esforço, à dedicação, não existe meio-termo. Ou você faz uma coisa bem-feita ou não faz."* — Ayrton Senna
