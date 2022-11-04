const express = require("express");
const router = express.Router();
const db = require("../db").pool;
const ws = require("../app-ws");

//Rota para buscar frequencia de todos os alunos
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM Frequenta", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas as Frequencias",
        },
        quantidade: result.length,
        professores: result,
      });
    });
  });
});

// Rota para inserir Frequência de um Aluno
router.post("/", (req, res, next) => {
  try {
    ws.Inform("foi");
  } catch (Error) {
    console.log(Error);
  }
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

// Rota para atualizar a Frequência de um Aluno
router.patch("/", (req, res, next) => {
  try {
    ws.Inform("foi");
  } catch (Error) {
    console.log(Error);
  }

  const body = req.body;
  if (body.ra_aluno == null || body.cod_aula == null || body.presenca == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "UPDATE Frequenta SET presenca_aluno = ? WHERE fk_Alunos_RA = ? AND fk_Aula_COD_AULA = ?",
      [body.presenca, body.ra_aluno, body.cod_aula],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Frequência atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza uma Frequência",
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
