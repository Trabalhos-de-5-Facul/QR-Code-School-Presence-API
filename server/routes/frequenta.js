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
        frequencias: result,
      });
    });
  });
});

//Rota para
router.get("/:cod", (req, res, next) => {
  const params = req.params;
  if (params.cod == null) {
    return res.status(400).end();
  }

  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      `SELECT nome_aluno, RA, COD_DISC from Alunos 
    inner Join Matricula_se
    on Matricula_se.fk_Alunos_RA = Alunos.RA
    inner join Disciplina
    on Disciplina.COD_DISC = Matricula_se.fk_Disciplina_COD_DISC
    inner join Aula 
    on Aula.fk_Disciplina_COD_DISC = Disciplina.COD_DISC
    inner join Frequenta
    on Frequenta.fk_Aula_COD_AULA = Aula.COD_AULA
    where Aula.COD_AULA = (SELECT COD_AULA FROM Professores
    inner join Ministra
    on Ministra.fk_Professores_COD_PROF = Professores.COD_PROF
    inner join Disciplina
    on Disciplina.COD_DISC = Ministra.fk_Disciplina_COD_DISC
    inner join Aula
    on Aula.fk_Disciplina_COD_DISC = Disciplina.COD_DISC
    inner join Frequenta
    on Frequenta.fk_Aula_COD_AULA = Aula.COD_AULA
    where Professores.COD_PROF = 14 and CURRENT_TIMESTAMP() between inicio_aula and fim_aula LIMIT 1)
    and Frequenta.presenca_aluno = 0 group by nome_aluno;`,
      [params.cod],
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(200).send({
          request: {
            tipo: "GET",
            descricao: "",
          },
          quantidade: result.length,
          alunos: result,
        });
      }
    );
  });
});

// Rota para inserir Frequência de um Aluno
router.post("/", (req, res, next) => {
  const body = req.body;

  try {
    ws.Inform(body.ra_aluno);
  } catch (Error) {
    console.log(Error);
  }

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
  const body = req.body;

  try {
    ws.Inform(body.ra_aluno);
  } catch (Error) {
    console.log(Error);
  }

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
