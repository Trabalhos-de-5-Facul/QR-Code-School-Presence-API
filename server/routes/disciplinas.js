const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para verificar todos as Disciplinas
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM Disciplina", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas as Disciplinas",
        },
        quantidade: result.length,
        disciplinas: result,
      });
    });
  });
});

// Rota para inserir uma Disciplina
router.post("/", (req, res, next) => {
  const body = req.body;
  if (body.cod == null || body.total_aulas == null || body.nome == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL insereDisciplina(?,?,?)",
      [body.cod, body.total_aulas, body.nome],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Disciplina cadastrada com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere uma Disciplina",
          },
        });
      }
    );
  });
});

// Rota para atualizar uma Disciplina
router.patch("/", (req, res, next) => {
  const body = req.body;
  if (body.cod == null || body.total_aulas == null || body.nome == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL updateDisciplina(?,?,?)",
      [body.cod, body.total_aulas, body.nome],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Disciplina atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza uma Disciplina",
          },
        });
      }
    );
  });
});

// Rota para deletar uma Discplina
router.delete("/", (req, res, next) => {
  const body = req.body;
  if (body.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("CALL deletaDisciplina(?)", [body.cod], (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(201).send({
        mensagem: "Disciplina deletada com sucesso",
        request: {
          tipo: "DELETE",
          descricao: "Deleta uma Disciplina",
        },
      });
    });
  });
});

module.exports = router;
