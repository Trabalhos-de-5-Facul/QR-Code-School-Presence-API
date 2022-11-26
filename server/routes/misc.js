const express = require("express");
const router = express.Router();
const db = require("../db").pool;

// Rota para retornar o time stamp atual
router.get("/timestamp", (req, res, next) => {
  db.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }
    conn.query(
      "SELECT CURRENT_TIMESTAMP() as TIMESTAMP",
      (err, result, field) => {
        conn.release();
        if (err) {
          return res.status(500).send({ erro: err });
        }
        return res.status(200).send({
          request: {
            tipo: "GET",
            descricao: "Retorna o TIMESTAMP Atual",
          },
          quantidade: result.length,
          timestamp: result,
        });
      }
    );
  });
});

module.exports = router;
