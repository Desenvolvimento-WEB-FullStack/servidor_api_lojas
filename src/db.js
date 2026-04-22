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
      password TEXT NOT NULL,
      plan TEXT NOT NULL DEFAULT 'Gratuito'
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

      const hasPlan = cols.some((c) => c.name === "plan");
      if (!hasPlan) {
        db.run(
          `ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'Gratuito'`,
          (err2) => {
            if (err2) {
              console.warn(
                "Não foi possível adicionar coluna plan em users",
                err2,
              );
            }
          },
        );
      }
    }
  });

  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      url TEXT,
      preco REAL,
      descricao TEXT,
      parcelamento TEXT,
      contato TEXT,
      imagem TEXT,
      status TEXT NOT NULL DEFAULT 'PUBLICADO',
      user_id INTEGER
    )
  `);

  db.all("PRAGMA table_info(products)", (err, cols) => {
    if (!err) {
      const hasUrl = cols.some((c) => c.name === "url");
      if (!hasUrl) {
        db.run(`ALTER TABLE products ADD COLUMN url TEXT`, (err2) => {
          if (err2) {
            console.warn(
              "Não foi possível adicionar coluna url em products",
              err2,
            );
          }
        });
      }

      const hasStatus = cols.some((c) => c.name === "status");
      if (!hasStatus) {
        db.run(`ALTER TABLE products ADD COLUMN status TEXT`, (err2) => {
          if (err2) {
            console.warn(
              "Não foi possível adicionar coluna status em products",
              err2,
            );
          }
        });
      }

      const hasUserId = cols.some((c) => c.name === "user_id");
      if (!hasUserId) {
        db.run(`ALTER TABLE products ADD COLUMN user_id INTEGER`, (err2) => {
          if (err2) {
            console.warn(
              "Não foi possível adicionar coluna user_id em products",
              err2,
            );
          }
        });
      }

      const hasParcelamento = cols.some((c) => c.name === "parcelamento");
      if (!hasParcelamento) {
        db.run(`ALTER TABLE products ADD COLUMN parcelamento TEXT`, (err2) => {
          if (err2) {
            console.warn(
              "Não foi possível adicionar coluna parcelamento em products",
              err2,
            );
          }
        });
      }

      const hasContato = cols.some((c) => c.name === "contato");
      if (!hasContato) {
        db.run(`ALTER TABLE products ADD COLUMN contato TEXT`, (err2) => {
          if (err2) {
            console.warn(
              "Não foi possível adicionar coluna contato em products",
              err2,
            );
          }
        });
      }
    }
  });
});

module.exports = db;
