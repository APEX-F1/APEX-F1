// ================================================================
// DASHBOARD | APEX F1
//
// Dados que cada rota da API precisa devolver (JSON):
//
//   GET /dashboard/quiz/:idUsuario
//       -> { tentativas: [{ pontuacao, percentual, classificacao, data }],
//            porTema:    [{ tema, acertos, total }] }
//       (tentativas da mais antiga para a mais recente)
//
//   GET /dashboard/erradas
//       -> [{ enunciado, tema, erros }]
//       (da pergunta mais errada para a menos errada)
//
//   GET /dashboard/simulador/:idUsuario
//       -> [{ pista, posicao, pontos, data }]
//       (da corrida mais antiga para a mais recente)
// ================================================================

// Deixe true para ver a tela com dados de exemplo.
// Quando as rotas da API estiverem prontas, troque para false.
var USAR_DADOS_DE_EXEMPLO = false;

var PONTUACAO_MAXIMA = 144;   // soma dos pontos do quiz (16 perguntas)
var TOTAL_PILOTOS = 23;       // grid do simulador (22 fixos + você)

var COR_QUIZ = "#e10600";
var COR_SIMULADOR = "#ff8000";

// A API guarda a categoria do quiz; aqui ela vira o nome exibido no gráfico.
var NOMES_TEMAS = {
    F1: "Fórmula 1",
    Senna: "Senna",
    Historia: "Minha História"
};

var idUsuario = sessionStorage.ID_USUARIO;


// ================================================================
// DADOS DE EXEMPLO (só aparecem se USAR_DADOS_DE_EXEMPLO = true)
// ================================================================

var EXEMPLO_QUIZ = {
    tentativas: [
        { pontuacao: 62, percentual: 43, classificacao: "Piloto de Grid", data: "2026-11-01" },
        { pontuacao: 78, percentual: 54, classificacao: "Piloto de Grid", data: "2026-11-03" },
        { pontuacao: 95, percentual: 66, classificacao: "Pole Position", data: "2026-11-05" },
        { pontuacao: 110, percentual: 76, classificacao: "Pole Position", data: "2026-11-08" },
        { pontuacao: 128, percentual: 89, classificacao: "Campeão Mundial", data: "2026-11-10" }
    ],
    porTema: [
        { tema: "Fórmula 1", acertos: 19, total: 30 },
        { tema: "Senna", acertos: 22, total: 30 },
        { tema: "Minha História", acertos: 17, total: 20 }
    ]
};

var EXEMPLO_ERRADAS = [
    { enunciado: "Na vitória do Senna no GP do Brasil de 1991, a primeira dele em casa, ele terminou a corrida com problema no câmbio. Qual era a única marcha que ainda funcionava?", tema: "Senna", erros: 9 },
    { enunciado: "Em qual circuito aconteceu a primeira corrida do Campeonato Mundial de Fórmula 1, em 1950?", tema: "Fórmula 1", erros: 8 },
    { enunciado: "Quantas vitórias o Senna conquistou na Fórmula 1?", tema: "Senna", erros: 6 },
    { enunciado: "Quem fundou a McLaren?", tema: "Fórmula 1", erros: 5 },
    { enunciado: "Em que data a Netflix lançou a minissérie sobre o Senna?", tema: "Minha História", erros: 3 }
];

var EXEMPLO_SIMULADOR = [
    { pista: "Interlagos", posicao: 5, pontos: 10, data: "2026-11-02" },
    { pista: "Mônaco", posicao: 3, pontos: 15, data: "2026-11-04" },
    { pista: "Silverstone", posicao: 1, pontos: 25, data: "2026-11-06" },
    { pista: "Monza", posicao: 2, pontos: 18, data: "2026-11-08" },
    { pista: "Suzuka", posicao: 4, pontos: 12, data: "2026-11-09" },
    { pista: "Spa", posicao: 1, pontos: 25, data: "2026-11-10" }
];


// ================================================================
// CONFIGURAÇÃO GERAL DOS GRÁFICOS (cores do APEX F1)
// ================================================================

Chart.defaults.color = "#a0a0b2";
Chart.defaults.borderColor = "#2e2e3d";
Chart.defaults.font.family = "'Inter', sans-serif";


// ================================================================
// FUNÇÕES
// ================================================================

// Busca os dados na API (ou devolve o exemplo)
function buscarDados(rota, exemplo) {
    if (USAR_DADOS_DE_EXEMPLO) {
        return Promise.resolve(exemplo);
    }

    return fetch(rota, { cache: "no-store" }).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error(`Erro ${resposta.status} na rota ${rota}`);
        }
        return resposta.json();
    });
}

function mostrarMensagem(idElemento, texto) {
    var elemento = document.getElementById(idElemento);
    if (texto) {
        elemento.innerHTML = texto;
    }
    elemento.classList.remove("display-none");
}

// Gráfico de barras
function criarGraficoBarras(idCanvas, labels, valores, cor, maximo) {
    new Chart(document.getElementById(idCanvas), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                backgroundColor: cor,
                borderRadius: 6
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, max: maximo }
            }
        }
    });
}

// Gráfico de linha
function criarGraficoLinha(idCanvas, labels, valores, cor, opcoesY) {
    new Chart(document.getElementById(idCanvas), {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                data: valores,
                borderColor: cor,
                backgroundColor: cor,
                pointBackgroundColor: cor,
                tension: 0.2
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: opcoesY }
        }
    });
}


// ---------------------------------------------------------------
// QUIZ
// ---------------------------------------------------------------
function carregarQuiz() {
    buscarDados(`/dashboard/quiz/${idUsuario}`, EXEMPLO_QUIZ).then(function (dados) {
        var tentativas = dados.tentativas;

        if (tentativas.length == 0) {
            mostrarMensagem("vazioQuiz");
        }

        // Indicadores
        var melhor = 0;
        var somaPercentual = 0;

        for (var i = 0; i < tentativas.length; i++) {
            if (tentativas[i].pontuacao > melhor) {
                melhor = tentativas[i].pontuacao;
            }
            somaPercentual += Number(tentativas[i].percentual);
        }

        kpiTentativas.innerHTML = tentativas.length;

        if (tentativas.length > 0) {
            kpiMelhor.innerHTML = `${melhor} pts`;
            kpiMedia.innerHTML = `${Math.round(somaPercentual / tentativas.length)}%`;
            kpiClassificacao.innerHTML = tentativas[tentativas.length - 1].classificacao;
        }

        // Gráfico: acertos por tema (%)
        var labelsTemas = [];
        var valoresTemas = [];

        for (var j = 0; j < dados.porTema.length; j++) {
            var tema = dados.porTema[j];
            labelsTemas.push(NOMES_TEMAS[tema.tema] || tema.tema);
            valoresTemas.push(tema.total > 0 ? Math.round((tema.acertos / tema.total) * 100) : 0);
        }

        criarGraficoBarras("graficoTemas", labelsTemas, valoresTemas, COR_QUIZ, 100);

        // Gráfico: pontuação por tentativa
        var labelsTentativas = [];
        var valoresTentativas = [];

        for (var k = 0; k < tentativas.length; k++) {
            labelsTentativas.push(`${k + 1}ª`);
            valoresTentativas.push(tentativas[k].pontuacao);
        }

        criarGraficoLinha("graficoTentativas", labelsTentativas, valoresTentativas, COR_QUIZ,
            { beginAtZero: true, max: PONTUACAO_MAXIMA });

    }).catch(function (erro) {
        console.error(`Erro ao carregar o quiz: ${erro.message}`);
        mostrarMensagem("vazioQuiz", "Não foi possível carregar os dados do quiz.");
    });
}


// ---------------------------------------------------------------
// PERGUNTAS MAIS ERRADAS
// ---------------------------------------------------------------
function carregarErradas() {
    buscarDados("/dashboard/erradas", EXEMPLO_ERRADAS).then(function (erradas) {
        if (erradas.length == 0) {
            mostrarMensagem("vazioErradas");
            return;
        }

        var maiorErro = erradas[0].erros;
        for (var i = 0; i < erradas.length; i++) {
            if (erradas[i].erros > maiorErro) {
                maiorErro = erradas[i].erros;
            }
        }

        listaErradas.innerHTML = "";

        for (var j = 0; j < erradas.length; j++) {
            var item = erradas[j];
            var largura = Math.round((item.erros / maiorErro) * 100);
            var nomeTema = NOMES_TEMAS[item.tema] || item.tema;

            listaErradas.innerHTML += `
                <div class="erro-item">
                    <div class="erro-topo">
                        <span class="erro-tema">${nomeTema}</span>
                        <span class="erro-qtd">${item.erros} erros</span>
                    </div>
                    <p>${item.enunciado}</p>
                    <div class="erro-barra">
                        <div class="erro-barra-preenchida" style="width: ${largura}%"></div>
                    </div>
                </div>
            `;
        }

    }).catch(function (erro) {
        console.error(`Erro ao carregar as perguntas mais erradas: ${erro.message}`);
        mostrarMensagem("vazioErradas", "Não foi possível carregar as perguntas mais erradas.");
    });
}


// ---------------------------------------------------------------
// SIMULADOR
// ---------------------------------------------------------------
function carregarSimulador() {
    buscarDados(`/dashboard/simulador/${idUsuario}`, EXEMPLO_SIMULADOR).then(function (corridas) {

        if (corridas.length == 0) {
            mostrarMensagem("vazioSimulador");
        }

        // Indicadores
        var vitorias = 0;
        var podios = 0;
        var pontos = 0;

        var pistas = [];
        var posicoes = [];
        var pontosPorCorrida = [];

        for (var i = 0; i < corridas.length; i++) {
            if (corridas[i].posicao == 1) {
                vitorias++;
            }
            if (corridas[i].posicao <= 3) {
                podios++;
            }
            pontos += Number(corridas[i].pontos);

            pistas.push(corridas[i].pista);
            posicoes.push(corridas[i].posicao);
            pontosPorCorrida.push(corridas[i].pontos);
        }

        kpiCorridas.innerHTML = corridas.length;
        kpiVitorias.innerHTML = vitorias;
        kpiPodios.innerHTML = podios;
        kpiPontos.innerHTML = pontos;

        // Gráfico: posição final (1º fica no topo)
        criarGraficoLinha("graficoPosicoes", pistas, posicoes, COR_SIMULADOR,
            { reverse: true, min: 1, max: TOTAL_PILOTOS, ticks: { precision: 0 } });

        // Gráfico: pontos por corrida
        criarGraficoBarras("graficoPontos", pistas, pontosPorCorrida, COR_SIMULADOR);

    }).catch(function (erro) {
        console.error(`Erro ao carregar o simulador: ${erro.message}`);
        mostrarMensagem("vazioSimulador", "Não foi possível carregar os dados do simulador.");
    });
}


// ================================================================
// INÍCIO
// ================================================================

if (USAR_DADOS_DE_EXEMPLO) {
    avisoExemplo.classList.remove("display-none");
}

carregarQuiz();
carregarErradas();
carregarSimulador();
