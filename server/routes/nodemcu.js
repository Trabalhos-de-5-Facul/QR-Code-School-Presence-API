const express = require("express");
const router = express.Router();
const ws = require("../app-ws");

var cod_chamada = -1;

//Rota para NodeMCU
router.get("/:cod", (req, res, next) => {
  const params = req.params;
  if (params.cod == null) {
    return res.status(400).end();
  }

  if (cod_chamada != params.cod) {
    cod_chamada = params.cod;

    try {
      ws.Inform(cod_chamada);
    } catch (Error) {
      console.log(Error);
    }

    console.log("cod_chamada: " + cod_chamada);
    return res.status(201).send({
      mensagem: "OVERWRITE",
    });
  }

  console.log("cod_chamada: " + cod_chamada);
  return res.status(201).send({
    mensagem: "NO OVERWRITE",
  });
});

// Rota para NodeMCU 2
router.post("/", (req, res, next) => {
  const body = req.body;

  if (body.cod == null) {
    return res.status(400).end();
  }

  if (cod_chamada != body.cod) {
    cod_chamada = body.cod;

    try {
      ws.Inform(cod_chamada);
    } catch (Error) {
      console.log(Error);
    }

    console.log("cod_chamada: " + cod_chamada);
    return res.status(201).send({
      mensagem: "OVERWRITE",
    });
  }

  console.log("cod_chamada: " + cod_chamada);
  return res.status(201).send({
    mensagem: "NO OVERWRITE",
  });
});

module.exports = router;
