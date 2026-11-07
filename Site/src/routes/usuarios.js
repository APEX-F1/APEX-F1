var express = require("express");
var router = express.Router();

var usuarioController = require("../controllers/usuarioController");

// Rota para cadastrar usuário
router.post("/cadastrar", function (req, res) {
  console.log("CHEGOU NA ROTA DE CADASTRO!");

  usuarioController.cadastrar(req, res);
});

// Rota para autenticar usuário
router.post("/autenticar", function (req, res) {
  usuarioController.autenticar(req, res);
});

module.exports = router;
