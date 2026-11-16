// Controlador do simulador substituído por stub: desativado temporariamente.
function salvar(req, res) {
  res.status(410).json({ error: "Simulador temporariamente indisponível (arquivado)." });
}

module.exports = {
  salvar,
};
