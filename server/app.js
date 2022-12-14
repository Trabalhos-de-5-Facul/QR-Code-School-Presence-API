const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

const rotaAlunos = require("./routes/alunos");
const rotaAulas = require("./routes/aulas");
const rotaDisciplinas = require("./routes/disciplinas");
const rotaProfessores = require("./routes/professores");
const rotaFrequenta = require("./routes/frequenta");
const rotaMatricula = require("./routes/matricula");
const rotaMinistra = require("./routes/ministra");

// Uso do Morgan para monitoramento de requisições
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Para dados JSON
app.use(cors());

// Permissão de origem e cabeçalho para todos os servidores
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).send({});
  }
  next();
});

// Chamada das rotas
app.use("/alunos", rotaAlunos);
app.use("/aulas", rotaAulas);
app.use("/disciplinas", rotaDisciplinas);
app.use("/professores", rotaProfessores);
app.use("/frequenta", rotaFrequenta);
app.use("/matricula", rotaMatricula);
app.use("/ministra", rotaMinistra);

// Rota padrão da API
app.use("/", (req, res) => {
  return res.json({ server: "online" });
});

// Tratamento de erro ao não encontrar uma Rota válida
app.use((req, res, next) => {
  const erro = new Error("Rota não encontrada.");
  erro.status = 404;
  next(erro);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.send({
    erro: {
      mensagem: error.message,
    },
  });
});

module.exports = app;
