const express = require("express");
const db = require("../db");

const router = express.Router();

// create product
router.post("/", (req, res) => {
  const { nome, raridade, preco, descricao, imagem } = req.body;
  if (!nome) {
    return res.status(400).json({ error: "Nome do produto é obrigatório" });
  }
  db.run(
    `INSERT INTO products (nome, raridade, preco, descricao, imagem) VALUES (?, ?, ?, ?, ?)`,
    [nome, raridade, preco, descricao, imagem],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Erro ao inserir produto" });
      }
      res
        .status(201)
        .json({ id: this.lastID, nome, raridade, preco, descricao, imagem });
    },
  );
});

// list products with optional name search
router.get("/", (req, res) => {
  const { name } = req.query;
  let query = "SELECT * FROM products";
  const params = [];
  if (name) {
    query += " WHERE nome LIKE ?";
    params.push(`%${name}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar produtos" });
    }
    res.json(rows);
  });
});

// delete product
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: "Erro ao deletar produto" });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }
    res.json({ message: "Produto excluído" });
  });
});

module.exports = router;
