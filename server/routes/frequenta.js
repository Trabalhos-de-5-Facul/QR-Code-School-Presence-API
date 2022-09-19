const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para inserir Frequência de um Aluno
router.post("/", (req, res, next) => {
  const body = req.body;
  if (body.ra_aluno == null || body.cod_aula == null || body.presenca == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL insereFrequenta(?,?,?)",
      [body.ra_aluno, body.cod_aula, body.presenca],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Frequência cadastrada com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere a Frequência de um Aluno",
          },
        });
      }
    );
  });
});

// Rota para deletar a Frequência de um Aluno
router.delete("/", (req, res, next) => {
  const body = req.body;
  if (body.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("CALL deletaFrequenta(?)", [body.cod], (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(201).send({
        mensagem: "Frequência deletada com sucesso",
        request: {
          tipo: "DELETE",
          descricao: "Deleta a Frequência de um Aluno",
        },
      });
    });
  });
});

module.exports = router;
