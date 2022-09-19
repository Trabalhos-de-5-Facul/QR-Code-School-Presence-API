const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para verificar todos as Aulas
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM Aula", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas as Aulas",
        },
        quantidade: result.length,
        aulas: result,
      });
    });
  });
});

// Rota para inserir uma Aula
router.post("/", (req, res, next) => {
  const body = req.body;
  if (
    body.cod == null ||
    body.inicio == null ||
    body.fim == null ||
    body.cod_disc == null ||
    body.cod_prof == null ||
    body.lecionada == null
  ) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL insereAula(?,?,?,?,?,?)",
      [
        body.cod,
        body.inicio,
        body.fim,
        body.cod_disc,
        body.cod_prof,
        body.lecionada,
      ],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Aula cadastrada com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere uma Aula",
          },
        });
      }
    );
  });
});

// Rota para lecionar uma Aula
router.post("/:cod", (req, res, next) => {
  const params = req.params;
  if (params.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("CALL lecionaAula(?)", [params.cod], (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(201).send({
        mensagem: "Aula lecionada com sucesso",
        request: {
          tipo: "POST",
          descricao: "Leciona uma Aula",
        },
      });
    });
  });
});

// Rota para atualizar uma Aula
router.patch("/", (req, res, next) => {
  const body = req.body;
  if (
    body.cod == null ||
    body.inicio == null ||
    body.fim == null ||
    body.cod_disc == null ||
    body.cod_prof == null ||
    body.lecionada == null
  ) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL updateAula(?,?,?,?,?,?)",
      [
        body.cod,
        body.inicio,
        body.fim,
        body.cod_disc,
        body.cod_prof,
        body.lecionada,
      ],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Aula atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza uma Aula",
          },
        });
      }
    );
  });
});

// Rota para deletar uma Aula
router.delete("/", (req, res, next) => {
  const body = req.body;
  if (body.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("CALL deletaAula(?)", [body.cod], (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(201).send({
        mensagem: "Aula deletada com sucesso",
        request: {
          tipo: "DELETE",
          descricao: "Deleta uma Aula",
        },
      });
    });
  });
});

module.exports = router;
