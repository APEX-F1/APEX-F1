# Diário de Prompts - APEX F1

**Projeto:** APEX F1 (Site)
**Repositório:** APEX-F1
**Data dos registros:** 11/11/2026

## Ferramenta, IA e agente utilizados

- **Ferramenta:** opencode (CLI)
- **IA / modelo:** big-pickle (ID: `opencode/big-pickle`)
- **Agente:** agente principal do opencode, com execução direta das ferramentas
- **Subagentes:** nenhum subagente foi utilizado nesta sessão

---

## Registro 1 - 11/11/2026

### Prompt enviado pelo usuário

> Troque o atual simulador pelo arquivo de campeonato, configure o arquivo JS e CSS dele para rodar tudo certinho e troque o href do paddock para levar para ele ao clicar "simulador.Conecte a dashbord aos dados do Quiz e do Simulador, sem alterar a estrutura apenas quando a pessoa fazer um dos minigames, a dashboard cria.

### O que foi solicitado

1. Substituir o simulador atual pelo arquivo de campeonato.
2. Configurar o JS e o CSS do campeonato para funcionar corretamente.
3. Alterar o `href` do Paddock para abrir o campeonato ao clicar em "simulador".
4. Conectar o dashboard aos dados do Quiz e do Simulador, sem mudar a estrutura da dashboard, gravando os dados quando o usuário concluir um dos minigames.

### O que foi feito

- `public/campeonato.html` reescrito com caminhos relativos corretos, navbar, validação de sessão e rodapé do site.
- `public/css/campeonato.css` refeito com os estilos completos do campeonato (painel de informações, escolha do piloto, semáforo, pista, classificação ao vivo e resultado).
- `public/js/campeonato.js` conectado ao endpoint `POST /simulador/salvar`, enviando o resultado de cada etapa para o banco.
- `public/paddock.html` alterado para apontar o botão do simulador para `campeonato.html`.
- Backend ajustado ao schema:
  - `src/models/simuladorModel.js` e `src/controllers/simuladorController.js` passaram a gravar na tabela `simulacao`.
  - `src/models/quizModel.js` e `src/controllers/quizController.js` passaram a gravar `acertos` e `totalPerguntas` em `tentativa_quiz` e as respostas em `resposta_quiz`.
  - `src/models/dashboardModel.js` passou a ler `tentativa_quiz`, `resposta_quiz`, `quiz_pergunta` e `simulacao`.
  - `public/js/dashboard.js` passou a traduzir as categorias do quiz para os nomes exibidos nos gráficos.
- Sintaxe de todos os arquivos JS validada com `node --check`.
- Página `campeonato.html`, CSS e JS testados via servidor local (HTTP 200).

### Arquivos alterados/criados

- `Site/public/campeonato.html` (reescrito)
- `Site/public/css/campeonato.css` (reescrito)
- `Site/public/js/campeonato.js` (alterado)
- `Site/public/paddock.html` (alterado)
- `Site/public/js/dashboard.js` (alterado)
- `Site/src/models/simuladorModel.js` (alterado)
- `Site/src/controllers/simuladorController.js` (alterado)
- `Site/src/models/quizModel.js` (alterado)
- `Site/src/controllers/quizController.js` (alterado)
- `Site/src/models/dashboardModel.js` (alterado)

### Resultado

Simulador substituído pelo Mini Campeonato Mundial, acessível pelo Paddock. Os resultados do quiz e das corridas são gravados no banco e exibidos na dashboard.

---

## Registro 2 - 11/11/2026

### Prompt enviado pelo usuário

> Crie um diário de prompt que contenha o que pedi, qual IA/Agente foi usado

### O que foi solicitado

Criar um documento registrando os prompts enviados e qual IA/agente foi utilizado.

### O que foi feito

Criação deste arquivo `DIARIO-DE-PROMPTS.md`, contendo os prompts, a ferramenta, o modelo de IA e o agente utilizados, além do resumo das ações executadas.

### Resultado

Diário de prompts criado na raiz do repositório.

---

## Observações

- Para o dashboard carregar os dados corretamente, é necessário executar o script `Site/src/database/script-tabelas.sql` no MySQL, garantindo as tabelas `simulacao`, `tentativa_quiz` e `resposta_quiz` com as colunas usadas pelo backend.
- O arquivo antigo `V2_simulador.html` permanece no projeto, mas não é mais acessado pelo Paddock.
