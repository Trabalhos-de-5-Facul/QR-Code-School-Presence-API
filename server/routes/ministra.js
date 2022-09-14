const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para inserir a relação de Ministrar de um Professor
router.post("/", (req, res, next) => {
  const body = req.body;
  if (body.cod_disc == null || body.cod_prof == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL insereMinistra(?,?)",
      [body.cod_disc, body.cod_prof],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Relação de Ministrar cadastrada com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere a relação de Ministrar de um Professor",
          },
        });
      }
    );
  });
});

// Rota para deletar a relação de Ministrar de um Professor
router.delete("/", (req, res, next) => {
  const body = req.body;
  if (body.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("CALL deletaMinistra(?)", [body.cod], (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(201).send({
        mensagem: "Relação de Ministrar deletada com sucesso",
        request: {
          tipo: "DELETE",
          descricao: "Deleta a relação de Ministrar de um Professor",
        },
      });
    });
  });
});

module.exports = router;
