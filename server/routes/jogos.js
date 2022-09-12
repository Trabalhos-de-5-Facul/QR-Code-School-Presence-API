const express = require("express");
const router = express.Router();
const db = require("../db").pool;

router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM Jogos", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas os Jogos",
        },
        quantidade: result.length,
        jogos: result,
      });
    });
  });
});

router.post("/", (req, res, next) => {
  const body = req.body;
  if (body.nome == null || body.nota == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "INSERT INTO Jogos (Nome, Nota) VALUES (?,?)",
      [body.nome, body.nota],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Jogo cadastrado com sucesso",
          jogoId: result.insertId,
          request: {
            tipo: "POST",
            descricao: "Cadastra um Jogo",
          },
        });
      }
    );
  });
});

module.exports = router;
