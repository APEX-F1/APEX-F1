# 🏎️ APEX F1

### Beyond the Grid. Into the Data.

**Uma plataforma digital dedicada à Fórmula 1, à sua história e à análise de dados do automobilismo.**

> Um site-homenagem à Fórmula 1 e a Ayrton Senna, com quiz, simulador de corrida e dashboard.

[Sobre o projeto](#-sobre-o-projeto) · [Funcionalidades](#-funcionalidades) · [Dados e análises](#-dados-e-análises) · [Tecnologias](#-tecnologias) · [Estrutura](#-estrutura-do-repositório) · [Como rodar](#-como-rodar) · [Roadmap](#-roadmap)

---

## 🏁 Sobre o projeto

O **APEX F1** é um site que reúne a história da Fórmula 1, jogos e visualização de dados em uma experiência digital organizada, com cadastro e login, banco de dados, API e dashboard.

O projeto nasceu de uma memória simples: os domingos em que meu pai comprava pastel na feira e a gente assistia à corrida juntos. A Fórmula 1 voltou para a minha vida depois de um tempo, e a minissérie *Senna* (Netflix, 29/11/2024) fez do Ayrton Senna o meu ídolo. Por isso o site tem uma área especial dedicada a **Ayrton Senna**, celebrando sua trajetória e seu legado.

Ele não é um produto para vender. É uma forma de compartilhar o que a Fórmula 1 e o Senna representam para mim e de mostrar, na prática, o que aprendi no curso. Foi desenvolvido como Projeto Individual de Análise e Desenvolvimento de Sistemas da SPTech, em seis semanas, e também serve como portfólio profissional.

## 🏆 Funcionalidades

- **Cadastro e login:** o conteúdo restrito só abre para usuários cadastrados.
- **Página inicial:** resumo do projeto, grid com as equipes, principais pilotos (Lando Norris, Gabriel Bortoleto, Rafael Câmara e Charles Leclerc) e lendas do automobilismo.
- **Senna:** história, legado e maiores feitos de Ayrton Senna.
- **McLaren:** uma área só para o meu time.
- **Minha história:** como, onde e por que a Fórmula 1 e o Senna entraram na minha vida.
- **Dedicações:** as pessoas que me ajudaram a chegar até aqui.
- **Paddock:** a área de jogos, com o quiz e o simulador de corrida.
- **Dashboard:** indicadores com os dados do quiz e do simulador.

### Quiz

16 perguntas e 144 pontos possíveis, divididas em três temas: **Fórmula 1**, **Ayrton Senna** e **Minha história**. O foco é a Fórmula 1 e o Senna, e as perguntas pessoais são poucas e breves.

### Simulador e mini campeonato

Um simulador de corrida em JavaScript, em que a pessoa escolhe um piloto ou digita o próprio nome e corre contra o grid fixo. O mini campeonato usa o grid de 22 pilotos (11 equipes), permite escolher o número do carro (sem repetir e sem o 17, aposentado pela FIA) e pontua do 1º ao 10º colocado.

## 📊 Dados e análises

Os dados do quiz e do simulador ficam guardados no banco e alimentam a dashboard, que apresenta indicadores como:

- Desempenho dos usuários no quiz.
- Perguntas mais erradas.
- Resultados do simulador e do mini campeonato.

## 🛠️ Tecnologias

| Tecnologia | Aplicação |
|---|---|
| HTML e CSS | Estrutura e apresentação da interface |
| JavaScript | Interatividade, quiz, simulador e controle de sessão (`sessionStorage`) |
| Node.js | API e integração entre o site e o banco |
| MySQL | Armazenamento e consulta dos dados (banco `apexf1`) |
| Chart.js | Gráficos da dashboard |
| Figma | Protótipo das telas |
| Git, GitHub e Trello | Versionamento, documentação e planejamento |

Protótipo: [APEX F1 – Protótipo do Site](https://www.figma.com/design/uaElOZDxyl0neLljWNpiGx/APEX-F1-%E2%80%93-Prot%C3%B3tipo-do-Site)

## 📁 Estrutura do repositório

O servidor serve a pasta `Site/public`, então os links usam caminhos como `/css/...` e `/js/...`.

<!-- Confira os nomes das pastas com a estrutura real do repositório -->
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

### Banco de dados

O banco se chama `apexf1`. A tabela `usuario` guarda os usuários cadastrados (chave primária `idUsuario`), e as demais tabelas guardam os resultados do quiz e do simulador que alimentam a dashboard. O script, a modelagem lógica e o DER ficam na pasta `database/` e na documentação. Pela proposta da disciplina de Sistemas Operacionais, o banco roda em uma máquina virtual Linux que contém somente o MySQL.

### Controle de acesso

As páginas Dashboard, Paddock e Minha história são protegidas por `validarSessao`, que confere a sessão guardada no `sessionStorage`. Sem login, a pessoa volta para a tela de login. O botão **Sair** limpa a sessão, e depois do login o usuário vai para a página inicial.

## ▶️ Como rodar

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

## 🗺️ Roadmap

- [x] Definir e documentar os requisitos do projeto.
- [x] Prototipar as telas no Figma.
- [x] Modelar o banco de dados relacional.
- [x] Desenvolver o HTML e o CSS de todas as páginas.
- [x] Implementar o backend e a integração com o MySQL (cadastro e login).
- [x] Implementar o controle de acesso por sessão.
- [x] Desenvolver o simulador de corrida e o mini campeonato.
- [x] Definir as perguntas e a pontuação do quiz.
- [ ] Integrar o quiz ao banco de dados.
- [ ] Desenvolver a dashboard com os dados do quiz e do simulador.
- [ ] Realizar testes e validar as funcionalidades.
- [ ] Documentar e apresentar a versão final.

O progresso será atualizado conforme cada etapa for concluída.

## 🎓 Contexto acadêmico

**Projeto Individual — Análise e Desenvolvimento de Sistemas**

Instituição: SPTech

O projeto tem finalidade acadêmica e de desenvolvimento de portfólio, integrando conceitos de programação, banco de dados, desenvolvimento web e análise de dados. A documentação completa (contexto, objetivo, justificativa, escopo, premissas e restrições, diagrama técnico, backlog, burndown, modelagem lógica e tabelas) acompanha o repositório.

Fora do escopo: aplicativo mobile nativo e autenticação avançada (como autenticação em dois fatores).

## 📚 Fontes e créditos

As referências históricas, imagens e demais recursos de terceiros serão documentados conforme forem selecionados, respeitando suas respectivas licenças e condições de utilização.

## ⚖️ Aviso

O APEX F1 é um projeto independente, sem afiliação oficial com a Fórmula One Management, a FIA, as equipes ou os pilotos mencionados. As marcas e os nomes de terceiros pertencem aos respectivos titulares.

## 👤 Autor

**Manoel Alves da Silva Filho**

- GitHub: [Manoel-Alves21](https://github.com/Manoel-Alves21)
- LinkedIn: [manoel-alves-23a240323](https://www.linkedin.com/in/manoel-alves-23a240323/)

## 🙏 Agradecimentos

À minha família e aos meus amigos, que estão na seção Dedicações do site, e ao Ayrton Senna, pela inspiração.

---

**APEX F1 — Beyond the Grid. Into the Data.** 🏁

> *"No que diz respeito ao empenho, ao compromisso, ao esforço, à dedicação, não existe meio-termo. Ou você faz uma coisa bem-feita ou não faz."* — Ayrton Senna
