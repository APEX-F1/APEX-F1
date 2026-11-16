// ===== DADOS =====
var totalVoltas = 3;                                  // voltas de cada corrida

var pistas = [                                        // etapas do campeonato; seg = duração aproximada da corrida
  { gp: "GP da Austrália", local: "Albert Park",       seg: 9 },
  { gp: "GP do Japão",     local: "Suzuka",            seg: 12 },
  { gp: "GP de Mônaco",    local: "Circuito de Mônaco", seg: 8 },
  { gp: "GP da Bélgica",   local: "Spa-Francorchamps", seg: 14 },
  { gp: "GP de São Paulo", local: "Interlagos",        seg: 9 },
  { gp: "GP de Abu Dhabi", local: "Yas Marina",        seg: 10 }
];

var pontosF1 = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1];   // pontos do 1º ao 10º lugar

var grid = [                                          // grid de 2026: 11 equipes, 22 pilotos (o ritmo é estimativa minha)
  { nome: "Norris",     numero: 1,  cor: "#ff8000", ritmo: 1.02 },
  { nome: "Piastri",    numero: 81, cor: "#ff8000", ritmo: 1.02 },
  { nome: "Russell",    numero: 63, cor: "#27f4d2", ritmo: 1.04 },
  { nome: "Antonelli",  numero: 12, cor: "#27f4d2", ritmo: 1.04 },
  { nome: "Verstappen", numero: 3,  cor: "#3671c6", ritmo: 1.02 },
  { nome: "Hadjar",     numero: 6,  cor: "#3671c6", ritmo: 1.01 },
  { nome: "Leclerc",    numero: 16, cor: "#e8002d", ritmo: 1.02 },
  { nome: "Hamilton",   numero: 44, cor: "#e8002d", ritmo: 1.02 },
  { nome: "Albon",      numero: 23, cor: "#64c4ff", ritmo: 1.0 },
  { nome: "Sainz",      numero: 55, cor: "#64c4ff", ritmo: 1.0 },
  { nome: "Lawson",     numero: 30, cor: "#6692ff", ritmo: 1.0 },
  { nome: "Lindblad",   numero: 41, cor: "#6692ff", ritmo: 1.0 },
  { nome: "Alonso",     numero: 14, cor: "#229971", ritmo: 0.99 },
  { nome: "Stroll",     numero: 18, cor: "#229971", ritmo: 0.99 },
  { nome: "Ocon",       numero: 31, cor: "#b6babd", ritmo: 1.0 },
  { nome: "Bearman",    numero: 87, cor: "#b6babd", ritmo: 1.0 },
  { nome: "Hülkenberg", numero: 27, cor: "#d8ff3e", ritmo: 0.995 },
  { nome: "Bortoleto",  numero: 5,  cor: "#d8ff3e", ritmo: 0.995 },
  { nome: "Gasly",      numero: 10, cor: "#ff87bc", ritmo: 1.0 },
  { nome: "Colapinto",  numero: 43, cor: "#ff87bc", ritmo: 1.0 },
  { nome: "Pérez",      numero: 11, cor: "#ffd23f", ritmo: 0.985 },
  { nome: "Bottas",     numero: 77, cor: "#ffd23f", ritmo: 0.985 }
];

var pilotos = [];     // grid do campeonato (fixos + você, se digitar seu nome)
var escolhido = -1;   // posição do seu piloto no vetor pilotos
var etapa = 0;        // índice da corrida atual no vetor pistas
var relogio;          // guarda o setInterval da corrida
var tique = 0;        // cada tique = 0,1 segundo
var chegada = [];     // posições dos pilotos na ordem em que chegaram

// ===== MONTAR O CAMPEONATO E A TELA =====
function montarGrid() {                                       // começa um campeonato novo
  var valor = document.getElementById("selPiloto").value;     // o que foi escolhido no select

  if (valor == "novo") {                                      // quer correr com o próprio nome?
    document.getElementById("caixaNome").style.display = "flex";
    document.getElementById("caixaNumero").style.display = "flex";
  } else {
    document.getElementById("caixaNome").style.display = "none";
    document.getElementById("caixaNumero").style.display = "none";
  }

  pilotos = [];
  for (var i = 0; i < grid.length; i++) {                     // copia os pilotos fixos
    pilotos.push({ nome: grid[i].nome, numero: grid[i].numero, cor: grid[i].cor, ritmo: grid[i].ritmo, posicao: 0, volta: 1, tempo: 0, pontos: 0 });
  }

  escolhido = -1;
  if (valor == "novo") {
    var nome = document.getElementById("inputNome").value.trim();
    if (nome == "") {
      nome = "Você";
    }
    pilotos.push({ nome: nome, numero: document.getElementById("inputNumero").value, cor: "#ffffff", ritmo: 1, posicao: 0, volta: 1, tempo: 0, pontos: 0 }); // você entra no fim do grid
    escolhido = pilotos.length - 1;
  } else if (valor != "") {
    escolhido = Number(valor);
  }

  etapa = 0;                                                  // volta para a primeira corrida
  document.getElementById("btnLargar").innerHTML = "Largar";
  prepararEtapa();
  var num = document.getElementById("inputNumero").value;
  if (valor == "novo" && num != "") {                         // avisa na hora se o número não pode
    document.getElementById("aviso").innerHTML = validarNumero(num);
  }
}

function validarNumero(texto) {                               // devolve "" se o número vale, ou o motivo de não valer
  var n = Number(texto);
  if (texto == "" || n < 1 || n > 99 || n != Math.floor(n)) {
    return "Escolha um número inteiro de 1 a 99.";
  }
  if (n == 17) {
    return "O número 17 foi aposentado pela FIA.";
  }
  for (var i = 0; i < grid.length; i++) {                     // não pode repetir o número de ninguém do grid
    if (grid[i].numero == n) {
      return "O número " + n + " já é do " + grid[i].nome + ".";
    }
  }
  return "";
}

function prepararEtapa() {                                    // zera a pista para a corrida da etapa atual
  tique = 0;
  chegada = [];
  for (var i = 0; i < pilotos.length; i++) {                  // todos voltam à largada (os pontos ficam)
    pilotos[i].posicao = 0;
    pilotos[i].volta = 1;
    pilotos[i].tempo = 0;
  }

  document.getElementById("gp").innerHTML = pistas[etapa].gp + ' <small>' + pistas[etapa].local + '</small>';
  document.getElementById("etapa").innerHTML = (etapa + 1) + " / " + pistas.length;
  document.getElementById("voltaAtual").innerHTML = "0 / " + totalVoltas;
  document.getElementById("tempo").innerHTML = "0.0s";
  document.getElementById("lider").innerHTML = "-";
  document.getElementById("resultado").innerHTML = "";
  document.getElementById("aviso").innerHTML = "";
  pintarSemaforo(0, "");
  desenharPista();
  classificar();
  mostrarCampeonato();
}

function desenharPista() {                                    // monta uma faixa para cada piloto
  var marcas = "";                                            // divisórias entre as voltas
  for (var v = 1; v < totalVoltas; v++) {
    marcas += '<div class="marca" style="left:' + (v * 100 / totalVoltas) + '%"></div>';
  }

  var html = "";
  for (var i = 0; i < pilotos.length; i++) {
    var classe = "faixa";
    if (i == escolhido) {
      classe = "faixa meu-piloto";                            // destaca o seu piloto
    }
    html += '<div class="' + classe + '">' +
      '<div class="piloto-nome" style="color:' + pilotos[i].cor + '">' + pilotos[i].nome + '</div>' +
      '<div class="trilho">' + marcas + '<div class="linha-chegada"></div>' +
        '<div class="carro" id="carro' + i + '" style="background-color:' + pilotos[i].cor + '">' +
          pilotos[i].numero + '</div></div>' +
      '<div class="volta-piloto" id="volta' + i + '">V1/' + totalVoltas + '</div>' +
      '</div>';
  }
  document.getElementById("pista").innerHTML = html;
}

function classificar() {                                      // ordena pela posição na pista e mostra
  var ordem = [];
  for (var i = 0; i < pilotos.length; i++) {
    ordem.push(i);
  }
  ordem.sort(function (a, b) {                                // maior posição fica na frente
    return pilotos[b].posicao - pilotos[a].posicao;
  });

  var html = "";
  for (var k = 0; k < ordem.length; k++) {
    var classe = "linha-class";
    if (ordem[k] == escolhido) {
      classe = "linha-class meu";
    }
    html += '<div class="' + classe + '"><span class="pos">' + (k + 1) + '</span>' +
      '<span class="cor" style="background-color:' + pilotos[ordem[k]].cor + '"></span>' +
      '<span class="nome-class">' + pilotos[ordem[k]].nome + '</span></div>';
  }
  document.getElementById("classificacao").innerHTML = html;
  return ordem;
}

function mostrarCampeonato() {                                // ordena pelos pontos e mostra
  var tabela = pilotos.slice();                               // cópia do vetor, para não bagunçar a ordem original
  tabela.sort(function (a, b) {
    return b.pontos - a.pontos;
  });

  var html = "";
  for (var k = 0; k < tabela.length; k++) {
    var classe = "linha-class";
    if (tabela[k] == pilotos[escolhido]) {
      classe = "linha-class meu";
    }
    html += '<div class="' + classe + '"><span class="pos">' + (k + 1) + '</span>' +
      '<span class="cor" style="background-color:' + tabela[k].cor + '"></span>' +
      '<span class="nome-class">' + tabela[k].nome + '</span>' +
      '<span class="pts">' + tabela[k].pontos + ' pts</span></div>';
  }
  document.getElementById("campeonato").innerHTML = html;
  return tabela;
}

function pintarSemaforo(qtd, cor) {                           // acende "qtd" luzes na cor informada
  var luzes = document.getElementsByClassName("luz");
  for (var k = 0; k < luzes.length; k++) {
    if (k < qtd) {
      luzes[k].className = "luz " + cor;
    } else {
      luzes[k].className = "luz";
    }
  }
}

function bloquear(escolha, botao) {                           // trava (true) ou libera (false) os controles
  document.getElementById("selPiloto").disabled = escolha;
  document.getElementById("inputNome").disabled = escolha;
  document.getElementById("inputNumero").disabled = escolha;
  document.getElementById("btnLargar").disabled = botao;
}

// ===== A CORRIDA =====
function largar() {                                           // chamada pelo botão
  var valor = document.getElementById("selPiloto").value;
  var aviso = document.getElementById("aviso");

  if (etapa == pistas.length) {                               // campeonato acabou: o botão é "Novo campeonato"
    montarGrid();                                             // zera pontos e volta para a etapa 1
    return;
  }

  if (valor == "") {                                          // validação: precisa escolher alguém
    aviso.innerHTML = "Escolha um piloto antes de largar.";
    return;
  }
  if (valor == "novo" && document.getElementById("inputNome").value.trim() == "") {
    aviso.innerHTML = "Digite seu nome para entrar no grid.";
    return;
  }

  if (valor == "novo") {                                      // o número escolhido precisa ser válido
    var erro = validarNumero(document.getElementById("inputNumero").value);
    if (erro != "") {
      aviso.innerHTML = erro;
      return;
    }
  }

  prepararEtapa();                                            // zera a pista (a 1ª vez só repete o que já está)
  bloquear(true, true);                                       // piloto fica travado até o fim do campeonato

  var luzes = 0;
  var contagem = setInterval(function () {                    // a cada 500 ms
    luzes++;
    pintarSemaforo(luzes, "vermelha");
    if (luzes == 5) {                                         // 5 luzes acesas: largou!
      clearInterval(contagem);
      pintarSemaforo(5, "verde");
      relogio = setInterval(avancar, 100);                    // avancar() a cada 100 ms
    }
  }, 500);
}

function avancar() {                                          // um "tique" da corrida
  tique++;
  var media = 10 / pistas[etapa].seg;                         // passo médio que faz a corrida durar "seg" segundos

  for (var i = 0; i < pilotos.length; i++) {
    var p = pilotos[i];
    if (p.posicao >= 100) {                                   // quem já chegou não anda mais
      continue;
    }

    var passo = media * p.ritmo * (Math.random() * 1.4 + 0.3);  // média x ritmo do piloto x sorte (0,3 a 1,7)
    if (Math.random() < 0.03) {                               // 3% de chance de problema
      passo = 0;
    }
    p.posicao += passo;

    if (p.posicao >= 100) {                                   // cruzou a linha de chegada
      chegada.push(i);                                        // registra na ordem de chegada
      p.tempo = (tique / 10).toFixed(1);                      // tempo em segundos
      p.posicao = 100 + pilotos.length - chegada.length;      // passa de 100: quem chegou antes fica na frente
    }

    p.volta = Math.min(Math.floor(p.posicao / (100 / totalVoltas)) + 1, totalVoltas);
    document.getElementById("carro" + i).style.left = Math.min(p.posicao, 100) + "%";
    if (p.posicao >= 100) {
      document.getElementById("volta" + i).innerHTML = "🏁";
    } else {
      document.getElementById("volta" + i).innerHTML = "V" + p.volta + "/" + totalVoltas;
    }
  }

  var ordem = classificar();
  var lider = pilotos[ordem[0]];
  document.getElementById("voltaAtual").innerHTML = lider.volta + " / " + totalVoltas;
  document.getElementById("tempo").innerHTML = (tique / 10).toFixed(1) + "s";
  document.getElementById("lider").innerHTML = lider.nome;

  if (chegada.length == pilotos.length) {                     // todos chegaram: fim da corrida
    clearInterval(relogio);
    mostrarResultado();
  }
}

function mostrarResultado() {                                 // pontua, mostra o resultado e guarda os dados
  var medalhas = ["🥇", "🥈", "🥉"];
  var texto = "<h3>Resultado - " + pistas[etapa].gp + "</h3>";
  var lista = [];                                             // dados da corrida, para a dashboard

  for (var k = 0; k < chegada.length; k++) {                  // percorre a ordem de chegada
    var p = pilotos[chegada[k]];
    var pts = 0;
    if (k < 10) {
      pts = pontosF1[k];                                      // só o top 10 pontua
    }
    p.pontos += pts;

    var marca = (k + 1) + "º";
    if (k < 3) {
      marca = medalhas[k];
    }
    texto += '<div class="linha-resultado"><span>' + marca + '</span><span>' + p.nome +
      '</span><span>' + p.tempo + 's</span><span class="pts">+' + pts + '</span></div>';
    lista.push({ piloto: p.nome, numero: p.numero, posicao: k + 1, pontos: pts, tempo: p.tempo });
  }

  var historico = JSON.parse(localStorage.getItem("corridas") || "[]");  // guarda no navegador
  historico.push({ gp: pistas[etapa].gp, data: new Date().toLocaleString("pt-BR"), jogador: pilotos[escolhido].nome, resultado: lista });
  localStorage.setItem("corridas", JSON.stringify(historico));

  var posicaoJogador = chegada.indexOf(escolhido);
  var pontosJogador = posicaoJogador >= 0 && posicaoJogador < 10 ? pontosF1[posicaoJogador] : 0;
  salvarCorrida({
    idGP: etapa + 1,
    etapa: etapa + 1,
    piloto: pilotos[escolhido].nome,
    numero: pilotos[escolhido].numero,
    posicao: posicaoJogador + 1,
    pontos: pontosJogador,
    tempo: pilotos[escolhido].tempo
  });

  texto += '<p class="mensagem-final">' + pilotos[escolhido].nome + ' terminou em ' +
    (chegada.indexOf(escolhido) + 1) + 'º</p>';

  var tabela = mostrarCampeonato();                           // atualiza os pontos do campeonato
  etapa++;                                                    // próxima etapa

  if (etapa < pistas.length) {                                // ainda tem corrida
    document.getElementById("btnLargar").innerHTML = "Próxima: " + pistas[etapa].gp;
    bloquear(true, false);
  } else {                                                    // acabou o campeonato
    texto += '<p class="mensagem-final">Campeão do mundial: ' + tabela[0].nome + ' com ' + tabela[0].pontos +
      ' pontos. Você ficou em ' + (tabela.indexOf(pilotos[escolhido]) + 1) + 'º.</p>';
    document.getElementById("btnLargar").innerHTML = "Novo campeonato";
    bloquear(false, false);                                   // libera a escolha do piloto
  }
  document.getElementById("resultado").innerHTML = texto;
}

function salvarCorrida(dados) {                               // envia o resultado da etapa para o dashboard
  var idUsuario = sessionStorage.ID_USUARIO;

  if (idUsuario == undefined || idUsuario == null || idUsuario == "") {
    return;
  }

  fetch("/simulador/salvar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      idUsuario: idUsuario,
      idGP: dados.idGP,
      etapa: dados.etapa,
      pilotoEscolhido: dados.piloto,
      numeroCarro: dados.numero,
      posicao: dados.posicao,
      pontos: dados.pontos,
      tempo: Number(dados.tempo)
    })
  })
    .then(function (resposta) {
      if (!resposta.ok) {
        console.error("Não foi possível salvar a corrida no dashboard.");
      }
    })
    .catch(function (erro) {
      console.error("Erro ao salvar a corrida: " + erro.message);
    });
}

// ===== AO CARREGAR A PÁGINA =====
var opcoes = '<option value="">Escolha seu piloto...</option>';
for (var i = 0; i < grid.length; i++) {                       // uma opção para cada piloto fixo
  opcoes += '<option value="' + i + '">' + grid[i].nome + '</option>';
}
opcoes += '<option value="novo">Correr com o meu nome</option>';
document.getElementById("selPiloto").innerHTML = opcoes;
montarGrid();
