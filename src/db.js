const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "..", "data", "database.sqlite");

// ensure data directory exists
const fs = require("fs");
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Não foi possível conectar ao banco de dados", err);
  } else {
    console.log("Conectado ao banco SQLite.");
  }
});

// cria tabelas se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);

  // ensure "name" column exists for existing databases
  db.all("PRAGMA table_info(users)", (err, cols) => {
    if (!err) {
      const hasName = cols.some((c) => c.name === "name");
      if (!hasName) {
        db.run(`ALTER TABLE users ADD COLUMN name TEXT`, (err2) => {
          if (err2) {
            console.warn(
              "Não foi possível adicionar coluna name em users",
              err2,
            );
          }
        });
      }
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      raridade TEXT,
      preco REAL,
      descricao TEXT,
      imagem TEXT
    )
  `);
});

module.exports = db;
