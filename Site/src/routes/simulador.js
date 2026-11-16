var express = require("express");
var router = express.Router();

// Rota do simulador desativada temporariamente.
// Este stub preserva a rota e evita erros 500/require caso o arquivo original seja removido.
router.post("/salvar", function (req, res) {
  res.status(410).json({ error: "Simulador temporariamente indisponível (arquivado)." });
});

module.exports = router;
