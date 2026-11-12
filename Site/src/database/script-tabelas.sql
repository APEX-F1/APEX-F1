CREATE DATABASE IF NOT EXISTS apexf1;
USE apexf1;

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

-- do simulador (campeonato.js). idResultado passou a ser opcional.
CREATE TABLE simulacao (
  idSimulacao     INT AUTO_INCREMENT PRIMARY KEY,
  idUsuario       INT          NOT NULL,
  idGP            INT          NOT NULL,
  idResultado     INT          NULL,
  etapa           INT          NOT NULL,
  pilotoEscolhido VARCHAR(30)  NOT NULL,
  numeroCarro     INT          NULL,
  posicaoFinal    INT          NOT NULL,
  pontos          INT          NOT NULL DEFAULT 0,
  tempoSegundos   DECIMAL(5,1) NOT NULL,
  dataSimulacao   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_simulacao_usuario FOREIGN KEY (idUsuario)
    REFERENCES usuario (idUsuario) ON DELETE CASCADE,
  CONSTRAINT fk_simulacao_gp FOREIGN KEY (idGP)
    REFERENCES grande_premio (idGP),
  CONSTRAINT fk_simulacao_resultado FOREIGN KEY (idResultado)
    REFERENCES resultado (idResultado),
  CONSTRAINT chk_simulacao_etapa   CHECK (etapa BETWEEN 1 AND 6),
  CONSTRAINT chk_simulacao_posicao CHECK (posicaoFinal BETWEEN 1 AND 23),
  CONSTRAINT chk_simulacao_pontos  CHECK (pontos BETWEEN 0 AND 25),
  CONSTRAINT chk_simulacao_numero  CHECK (numeroCarro IS NULL OR numeroCarro BETWEEN 1 AND 99)
);

-- ========== MÓDULO QUIZ ==========

CREATE TABLE quiz_pergunta (
  idPergunta INT AUTO_INCREMENT PRIMARY KEY,
  enunciado  VARCHAR(255) NOT NULL,
  categoria  VARCHAR(20)  NOT NULL,
  pontos     INT          NOT NULL,
  CONSTRAINT chk_pergunta_categoria CHECK (categoria IN ('F1','Senna','Historia')),
  CONSTRAINT chk_pergunta_pontos CHECK (pontos > 0)
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
  idUsuario      INT         NOT NULL,
  acertos        INT         NOT NULL,
  totalPerguntas INT         NOT NULL,
  pontuacao      INT         NOT NULL,
  percentual     INT         NOT NULL,
  classificacao  VARCHAR(20) NOT NULL,
  dataTentativa  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tentativa_usuario FOREIGN KEY (idUsuario)
    REFERENCES usuario (idUsuario) ON DELETE CASCADE,
  CONSTRAINT chk_tentativa_total CHECK (totalPerguntas > 0),
  CONSTRAINT chk_tentativa_acertos CHECK (acertos BETWEEN 0 AND totalPerguntas),
  CONSTRAINT chk_tentativa_pontuacao CHECK (pontuacao BETWEEN 0 AND 144),
  CONSTRAINT chk_tentativa_percentual CHECK (percentual BETWEEN 0 AND 100),
  CONSTRAINT chk_tentativa_classificacao
    CHECK (classificacao IN ('Estreante','Piloto de Grid','Pole Position','Campeão Mundial'))
);

-- NOVA: uma linha por pergunta respondida (vetor "respostas" do quiz.html)
CREATE TABLE resposta_quiz (
  idResposta  INT AUTO_INCREMENT PRIMARY KEY,
  idTentativa INT     NOT NULL,
  idPergunta  INT     NOT NULL,
  acertou     BOOLEAN NOT NULL,
  pontos      INT     NOT NULL DEFAULT 0,
  CONSTRAINT fk_resposta_tentativa FOREIGN KEY (idTentativa)
    REFERENCES tentativa_quiz (idTentativa) ON DELETE CASCADE,
  CONSTRAINT fk_resposta_pergunta FOREIGN KEY (idPergunta)
    REFERENCES quiz_pergunta (idPergunta),
  CONSTRAINT uq_resposta_tentativa_pergunta UNIQUE (idTentativa, idPergunta),
  CONSTRAINT chk_resposta_pontos CHECK (pontos >= 0)
);

-- ========== CARGA INICIAL ==========

-- Etapas do simulador (mesmas do vetor "pistas" do campeonato.js)
-- Confira datas, voltas e extensão antes de entregar.
INSERT INTO grande_premio (nome, pais, dataCorrida, voltas, extensaoKm) VALUES
('GP da Austrália', 'Austrália',             '2026-03-08', 58, 5.278),
('GP do Japão',     'Japão',                 '2026-03-29', 53, 5.807),
('GP de Mônaco',    'Mônaco',                '2026-06-07', 78, 3.337),
('GP da Bélgica',   'Bélgica',               '2026-07-19', 44, 7.004),
('GP de São Paulo', 'Brasil',                '2026-11-08', 71, 4.309),
('GP de Abu Dhabi', 'Emirados Árabes Unidos','2026-12-06', 58, 5.281);

-- Perguntas (idPergunta = "id" do vetor "perguntas" do quiz.html)
INSERT INTO quiz_pergunta (idPergunta, enunciado, categoria, pontos) VALUES
(1,  'Qual entidade organiza o Campeonato Mundial de Fórmula 1?', 'F1', 5),
(2,  'O que define a ordem do grid de largada da corrida de domingo?', 'F1', 5),
(3,  'Qual equipe é a única que disputou todas as temporadas do Mundial desde 1950?', 'F1', 10),
(4,  'Quantos pilotos brasileiros já foram campeões mundiais de Fórmula 1?', 'F1', 10),
(5,  'Em qual circuito aconteceu a primeira corrida do Campeonato Mundial de Fórmula 1, em 1950?', 'F1', 15),
(6,  'Quem fundou a McLaren?', 'F1', 5),
(7,  'Quantos títulos mundiais de Fórmula 1 o Ayrton Senna conquistou?', 'Senna', 5),
(8,  'Qual é a cor predominante do capacete do Senna?', 'Senna', 5),
(9,  'Por qual equipe o Senna conquistou seus três títulos mundiais?', 'Senna', 10),
(10, 'Em qual circuito o Senna venceu seis vezes, a maior sequência de vitórias dele em uma mesma pista?', 'Senna', 10),
(11, 'Na vitória do Senna no GP do Brasil de 1991, a primeira dele em casa, ele terminou a corrida com problema no câmbio. Qual era a única marcha que ainda funcionava?', 'Senna', 15),
(12, 'Quantas vitórias o Senna conquistou na Fórmula 1?', 'Senna', 15),
(13, 'O que o Manoel comia nos domingos em que assistia à corrida com o pai?', 'Historia', 6),
(14, 'Em que data a Netflix lançou a minissérie sobre o Senna?', 'Historia', 6),
(15, 'Que item do dia a dia do Manoel lembra o Senna?', 'Historia', 6),
(16, 'Complete a frase do Senna que mais marcou o Manoel: “No que diz respeito ao empenho, ao compromisso, ao esforço, à dedicação, não existe ___.”', 'Historia', 6);

-- Alternativas (correta = TRUE na resposta certa)
INSERT INTO quiz_alternativa (idPergunta, texto, correta) VALUES
(1,'FIFA',FALSE),(1,'FIA',TRUE),(1,'COI',FALSE),(1,'FIM',FALSE),
(2,'O sorteio',FALSE),(2,'O treino livre de sexta',FALSE),(2,'A classificação de sábado',TRUE),(2,'A pontuação no campeonato',FALSE),
(3,'McLaren',FALSE),(3,'Ferrari',TRUE),(3,'Williams',FALSE),(3,'Mercedes',FALSE),
(4,'2',FALSE),(4,'3',TRUE),(4,'4',FALSE),(4,'5',FALSE),
(5,'Mônaco',FALSE),(5,'Monza',FALSE),(5,'Silverstone',TRUE),(5,'Spa-Francorchamps',FALSE),
(6,'Enzo Ferrari',FALSE),(6,'Colin Chapman',FALSE),(6,'Bruce McLaren',TRUE),(6,'Frank Williams',FALSE),
(7,'1',FALSE),(7,'2',FALSE),(7,'3',TRUE),(7,'4',FALSE),
(8,'Vermelho',FALSE),(8,'Amarelo',TRUE),(8,'Azul',FALSE),(8,'Branco',FALSE),
(9,'Lotus',FALSE),(9,'Williams',FALSE),(9,'Toleman',FALSE),(9,'McLaren',TRUE),
(10,'Mônaco',TRUE),(10,'Ímola',FALSE),(10,'Suzuka',FALSE),(10,'Interlagos',FALSE),
(11,'2ª',FALSE),(11,'4ª',FALSE),(11,'5ª',FALSE),(11,'6ª',TRUE),
(12,'31',FALSE),(12,'41',TRUE),(12,'51',FALSE),(12,'65',FALSE),
(13,'Pizza',FALSE),(13,'Pastel',TRUE),(13,'Coxinha',FALSE),(13,'Pipoca',FALSE),
(14,'21 de março de 2025',FALSE),(14,'1º de maio de 2024',FALSE),(14,'29 de novembro de 2024',TRUE),(14,'15 de dezembro de 2023',FALSE),
(15,'A capinha de celular',TRUE),(15,'Um boné',FALSE),(15,'Uma caneca',FALSE),(15,'Um funko pop',FALSE),
(16,'tempo livre',FALSE),(16,'meio-termo',TRUE),(16,'segunda chance',FALSE),(16,'desculpa',FALSE);