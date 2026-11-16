// Model do simulador substituído por stub para preservação da interface.
function salvar() {
  return new Promise(function (resolve, reject) {
    reject(new Error("Simulador arquivado - operação não disponível."));
  });
}

module.exports = {
  salvar,
};
