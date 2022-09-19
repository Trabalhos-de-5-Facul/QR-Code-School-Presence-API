const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para inserir Matrícula de um Aluno
router.post("/", (req, res, next) => {
  const body = req.body;
  if (body.ra == null || body.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL insereMatricula_se(?,?)",
      [body.ra, body.cod],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Matrícula cadastrada com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere a Matrícula de um Aluno",
          },
        });
      }
    );
  });
});

// Rota para deletar a Matrícula de um Aluno
router.delete("/", (req, res, next) => {
  const body = req.body;
  if (body.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL deletaMatricula_se(?)",
      [body.cod],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Matrícula deletada com sucesso",
          request: {
            tipo: "DELETE",
            descricao: "Deleta a Matrícula de um Aluno",
          },
        });
      }
    );
  });
});

module.exports = router;
