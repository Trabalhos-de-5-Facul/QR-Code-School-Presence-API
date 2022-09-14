const db = require("mysql2");

const pool = db.createPool({
  host: "database-pib.cp9unjk7ypjw.sa-east-1.rds.amazonaws.com",
  port: 3306,
  user: "admin",
  password: "userunix123qwe",
  database: "escola",
});

exports.pool = pool;
