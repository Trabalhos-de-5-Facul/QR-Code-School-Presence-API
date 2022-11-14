const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para verificar todos os Alunos
router.get("/", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("SELECT * FROM Alunos", (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna todas os Alunos",
        },
        quantidade: result.length,
        alunos: result,
      });
    });
  });
});

//Rota para buscar informações da aula atual de um aluno
router.get("/:ra/", (req, res, next) => {
  const params = req.params;
  if (params.ra == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(`SELECT * FROM Alunos
    inner join Matricula_se
    on Alunos.RA = Matricula_se.fk_Alunos_RA
    inner join Disciplina
    on Matricula_se.fk_Disciplina_COD_DISC = Disciplina.COD_DISC
    inner join Aula 
    on Disciplina.COD_DISC = Aula.fk_Disciplina_COD_DISC
    inner join Frequenta 
    on Frequenta.fk_Aula_COD_AULA = Disciplina.COD_DISC 
    Where RA = ? and  CURRENT_TIMESTAMP() between inicio_aula and fim_aula LIMIT 1`,
    [params.ra],
    (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(200).send({
        request: {
          tipo: "GET",
          descricao: "Retorna informações da aula atual de um aluno",
        },
        quantidade: result.length,
        aula: result,
      });
    });
  });
});

// Rota para verificar um Aluno pela senha e email
router.get("/:senha/:email", (req, res, next) => {
  const params = req.params;
  if (params.senha == null || params.email == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL verifica_aluno(?,?,@output); SELECT @output;",
      [params.senha, params.email],
      (err, result, field, rows) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }

        if (result[1][0]["@output"] == -1) {
          return res.status(500).send({ erro: "Email ou Senha incorretos." });
        } else {
          return res.status(200).send({
            request: {
              tipo: "GET",
              descricao: "Verifica um Aluno pela senha e email",
            },
            ra: result[1][0]["@output"],
          });
        }
      }
    );
  });
});

// Rota para inserir um Aluno
router.post("/", (req, res, next) => {
  const body = req.body;
  if (
    body.senha == null ||
    body.email == null ||
    body.ra == null ||
    body.nome == null
  ) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL insereAluno(?,?,?,?)",
      [body.senha, body.email, body.ra, body.nome],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Aluno cadastrado com sucesso",
          request: {
            tipo: "POST",
            descricao: "Insere um Aluno",
          },
        });
      }
    );
  });
});

// Rota para atualizar um Aluno
router.patch("/", (req, res, next) => {
  const body = req.body;
  if (
    body.senha == null ||
    body.email == null ||
    body.ra == null ||
    body.nome == null
  ) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "CALL updateAluno(?,?,?,?)",
      [body.senha, body.email, body.ra, body.nome],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(201).send({
          mensagem: "Aluno atualizado com sucesso",
          request: {
            tipo: "PATCH",
            descricao: "Atualiza um Aluno",
          },
        });
      }
    );
  });
});

// Rota para deletar um Aluno
router.delete("/", (req, res, next) => {
  const body = req.body;
  if (body.ra == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query("CALL deletaAluno(?)", [body.ra], (err, result, field) => {
      conn.release();
      if (err) {
        return res.status(500).send({ erro: err });
      }
      return res.status(201).send({
        mensagem: "Aluno deletado com sucesso",
        request: {
          tipo: "DELETE",
          descricao: "Deleta um Aluno",
        },
      });
    });
  });
});

module.exports = router;
