CREATE DATABASE apexf1; 
USE apexf1;
describe usuario;
-- ========== NÚCLEO ==========

CREATE TABLE usuario (
  idUsuario      INT AUTO_INCREMENT PRIMARY KEY,
  nome           VARCHAR(80)  NOT NULL,
  email          VARCHAR(150) NOT NULL,
  dataNascimento DATE         NOT NULL,
  senha     VARCHAR(255) NOT NULL,
  CONSTRAINT uq_usuario_email UNIQUE (email)
);

CREATE TABLE piloto (
  idPiloto             INT AUTO_INCREMENT PRIMARY KEY,
  nome                 VARCHAR(80) NOT NULL,
  nacionalidade        VARCHAR(60) NOT NULL,
  importanciaHistorica INT         NOT NULL,
  CONSTRAINT chk_piloto_importancia
    CHECK (importanciaHistorica BETWEEN 1 AND 5)
);

CREATE TABLE equipe (
  idEquipe INT AUTO_INCREMENT PRIMARY KEY,
  nome     VARCHAR(100) NOT NULL,
  CONSTRAINT uq_equipe_nome UNIQUE (nome)
);

CREATE TABLE grande_premio (
  idGP        INT AUTO_INCREMENT PRIMARY KEY,
  nome        VARCHAR(120) NOT NULL,
  pais        VARCHAR(60)  NOT NULL,
  dataCorrida DATE         NOT NULL,
  voltas      INT          NOT NULL,
  extensaoKm  DECIMAL(6,3) NOT NULL,
  CONSTRAINT uq_gp_nome_data UNIQUE (nome, dataCorrida),
  CONSTRAINT chk_gp_voltas   CHECK (voltas > 0),
  CONSTRAINT chk_gp_extensao CHECK (extensaoKm > 0)
);

CREATE TABLE resultado (
  idResultado  INT AUTO_INCREMENT PRIMARY KEY,
  idPiloto     INT          NOT NULL,
  idGP         INT          NOT NULL,
  idEquipe     INT          NOT NULL,
  posicaoFinal INT          NULL,
  situacao     VARCHAR(20)  NOT NULL DEFAULT 'Finalizou',
  pontos       DECIMAL(5,2) NOT NULL DEFAULT 0,
  CONSTRAINT fk_resultado_piloto FOREIGN KEY (idPiloto)
    REFERENCES piloto (idPiloto),
  CONSTRAINT fk_resultado_gp FOREIGN KEY (idGP)
    REFERENCES grande_premio (idGP),
  CONSTRAINT fk_resultado_equipe FOREIGN KEY (idEquipe)
    REFERENCES equipe (idEquipe),
  CONSTRAINT uq_resultado_gp_piloto  UNIQUE (idGP, idPiloto),
  CONSTRAINT uq_resultado_gp_posicao UNIQUE (idGP, posicaoFinal),
  CONSTRAINT chk_resultado_posicao
    CHECK (posicaoFinal IS NULL OR posicaoFinal >= 1),
  CONSTRAINT chk_resultado_pontos CHECK (pontos >= 0),
  CONSTRAINT chk_resultado_situacao
    CHECK (situacao IN ('Finalizou','Abandonou','Desclassificado','Nao largou'))
);

CREATE TABLE simulacao (
  idSimulacao   INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario     INT      NOT NULL,
  idResultado   INT      NOT NULL,
  dataSimulacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_simulacao_usuario FOREIGN KEY (idUsuario)
    REFERENCES usuario (idUsuario) ON DELETE CASCADE,
  CONSTRAINT fk_simulacao_resultado FOREIGN KEY (idResultado)
    REFERENCES resultado (idResultado)
);

-- ========== MÓDULO QUIZ ==========

CREATE TABLE quiz_pergunta (
  idPergunta INT AUTO_INCREMENT PRIMARY KEY,
  enunciado  VARCHAR(255) NOT NULL,
  categoria  VARCHAR(20)  NOT NULL,
  CONSTRAINT chk_pergunta_categoria CHECK (categoria IN ('F1','Senna'))
);

CREATE TABLE quiz_alternativa (
  idAlternativa INT AUTO_INCREMENT PRIMARY KEY,
  idPergunta    INT          NOT NULL,
  texto         VARCHAR(150) NOT NULL,
  correta       BOOLEAN      NOT NULL DEFAULT FALSE,
  CONSTRAINT fk_alternativa_pergunta FOREIGN KEY (idPergunta)
    REFERENCES quiz_pergunta (idPergunta) ON DELETE CASCADE
);

CREATE TABLE tentativa_quiz (
  idTentativa    INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario      INT      NOT NULL,
  acertos        INT      NOT NULL,
  totalPerguntas INT      NOT NULL,
  dataTentativa  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tentativa_usuario FOREIGN KEY (idUsuario)
    REFERENCES usuario (idUsuario) ON DELETE CASCADE,
  CONSTRAINT chk_tentativa_total CHECK (totalPerguntas > 0),
  CONSTRAINT chk_tentativa_acertos CHECK (acertos BETWEEN 0 AND totalPerguntas)
);
USE apexf1;
select * from usuario;