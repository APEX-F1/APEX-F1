var database = require("../database/config");

function autenticar(email, senha) {
  console.log("ACESSEI O USUARIO MODEL: ", email, senha);

  var instrucaoSql = `
        SELECT id, nome, email
        FROM usuario
        WHERE email = '${email}' AND senha = '${senha}';
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);

  return database.executar(instrucaoSql);
}

function cadastrar(nome, nascimento, email, senha) {
  console.log("ACESSEI O USUARIO MODEL: ", nome, email, senha);

  var instrucaoSql = `
        INSERT INTO usuario (nome, email, dataNascimento, senha)
        VALUES ('${nome}', '${email}', '${nascimento}', '${senha}');
    `;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);

  return database.executar(instrucaoSql);
}

module.exports = {
  autenticar,
  cadastrar,
};
