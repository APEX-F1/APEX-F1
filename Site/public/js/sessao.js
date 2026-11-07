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
