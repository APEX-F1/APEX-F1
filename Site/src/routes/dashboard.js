var express = require("express");
var router = express.Router();

var dashboardController = require("../controllers/dashboardController");

// Tentativas e acertos por tema do quiz de um usuário
router.get("/quiz/:idUsuario", function (req, res) {
  dashboardController.quiz(req, res);
});

// Perguntas mais erradas (todos os usuários)
router.get("/erradas", function (req, res) {
  dashboardController.erradas(req, res);
});

// Corridas do simulador de um usuário
router.get("/simulador/:idUsuario", function (req, res) {
  dashboardController.simulador(req, res);
});

module.exports = router;
