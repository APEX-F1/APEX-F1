var express = require("express");
var router = express.Router();

var simuladorController = require("../controllers/simuladorController");

// Rota para salvar o resultado de uma corrida do simulador
router.post("/salvar", function (req, res) {
  simuladorController.salvar(req, res);
});

module.exports = router;
