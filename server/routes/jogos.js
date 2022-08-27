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

module.exports = router;
