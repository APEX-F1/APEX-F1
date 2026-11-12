// SESSÃO

function validarSessao(caminhoLogin) {
  var id = sessionStorage.ID_USUARIO;
  var email = sessionStorage.EMAIL_USUARIO;
  var nome = sessionStorage.NOME_USUARIO;

  var b_usuario = document.getElementById("b_usuario");

  if (id != null && email != null && nome != null) {
    if (b_usuario != null) {
      b_usuario.innerHTML = nome;
    }
  } else {
    window.location.href = caminhoLogin || "../login.html";
  }
}

// EXIBIR SESSÃO NA NAVBAR (todas as páginas)

function exibirSessao(caminhoLogin) {
  var area = document.getElementById("area-usuario");

  if (area == null) {
    return;
  }

  var id = sessionStorage.ID_USUARIO;
  var nome = sessionStorage.NOME_USUARIO;
  var login = caminhoLogin || "login.html";

  area.innerHTML = "";

  if (id != null && nome != null && nome !== "") {
    var saudacao = document.createElement("span");
    saudacao.className = "saudacao";
    saudacao.appendChild(document.createTextNode("Olá, "));

    var nomeUsuario = document.createElement("strong");
    nomeUsuario.textContent = nome;
    saudacao.appendChild(nomeUsuario);
    saudacao.appendChild(document.createTextNode("!"));

    var sair = document.createElement("button");
    sair.type = "button";
    sair.className = "botao-sair";
    sair.textContent = "Sair";
    sair.onclick = function () {
      limparSessao(login);
    };

    area.appendChild(saudacao);
    area.appendChild(sair);
  } else {
    var entrar = document.createElement("a");
    entrar.href = login;
    entrar.className = "botao-sair";
    entrar.textContent = "Fazer Login";

    area.appendChild(entrar);
  }
}

function caminhoLoginPadrao() {
  return window.location.pathname.indexOf("/dashboard/") !== -1
    ? "../login.html"
    : "login.html";
}

document.addEventListener("DOMContentLoaded", function () {
  exibirSessao(caminhoLoginPadrao());
});

// ENCERRAR SESSÃO

function limparSessao(caminhoLogin) {
  sessionStorage.removeItem("ID_USUARIO");
  sessionStorage.removeItem("NOME_USUARIO");
  sessionStorage.removeItem("EMAIL_USUARIO");

  window.location.href = caminhoLogin || "../login.html";
}

// CARREGAMENTO (LOADING)

function aguardar() {
  var divAguardar = document.getElementById("div_aguardar");

  if (divAguardar != null) {
    divAguardar.style.display = "flex";
  }
}

function finalizarAguardar(texto) {
  var divAguardar = document.getElementById("div_aguardar");

  if (divAguardar != null) {
    divAguardar.style.display = "none";
  }

  var divErrosLogin = document.getElementById("div_erros_login");

  if (divErrosLogin != null && texto) {
    divErrosLogin.style.display = "flex";
    divErrosLogin.innerHTML = texto;
  }
}
