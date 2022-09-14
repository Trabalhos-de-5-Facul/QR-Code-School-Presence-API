const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para verificar todos os Professores
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM Professores", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas os Professores",
        },
        quantidade: result.length,
        professores: result,
      });
    });
  });
});

/*
// Rota para verificar um Professor pela senha e email
router.get("/verifica/", (req, res, next) => {
  const body = req.body;
  if (body.senha == null || body.email == null || body.ra == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL verifica_prof(?,?)",
      [body.senha, body.email],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(200).send({
          request: {
            tipo: "GET",
            descricao: "Verifica um Professor pela senha e email",
          },
          quantidade: result.length,
          cod: result,
        });
      }
    );
  });
});
*/

// Rota para inserir um Professor
router.post("/", (req, res, next) => {
  const body = req.body;
  if (
    body.cod == null ||
    body.email == null ||
    body.senha == null ||
    body.nome == null
  ) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL insereProfessor(?,?,?,?)",
      [body.cod, body.email, body.senha, body.nome],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Professor cadastrado com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere um Professor",
          },
        });
      }
    );
  });
});

// Rota para atualizar um Professor
router.patch("/", (req, res, next) => {
  const body = req.body;
  if (
    body.cod == null ||
    body.email == null ||
    body.senha == null ||
    body.nome == null
  ) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL updateProfessor(?,?,?,?)",
      [body.cod, body.email, body.senha, body.nome],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Professor atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza um Professor",
          },
        });
      }
    );
  });
});

// Rota para deletar um Professor
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
      "CALL deletaProfessores(?)",
      [body.cod],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Professor deletado com sucesso",
          request: {
            tipo: "DELETE",
            descricao: "Deleta um Professor",
          },
        });
      }
    );
  });
});

module.exports = router;
