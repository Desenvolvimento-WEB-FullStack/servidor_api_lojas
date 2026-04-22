const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middlewares/auth");

const router = express.Router();

// create ad
router.post("/", (req, res) => {
  const { nome, url, preco, descricao, parcelamento, contato } = req.body;
  if (
    !nome ||
    !url ||
    preco == null ||
    !descricao ||
    !parcelamento ||
    !contato
  ) {
    return res.status(400).json({
      error:
        "Nome, url, preco, descricao, parcelamento e contato são obrigatórios",
    });
  }

  const adStatus = "PUBLICADO";
  const adUserId = req.user && req.user.id ? req.user.id : null;

  db.run(
    `INSERT INTO products (nome, url, preco, descricao, parcelamento, contato, status, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [nome, url, preco, descricao, parcelamento, contato, adStatus, adUserId],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Erro ao inserir anúncio" });
      }
      res.status(201).json({
        id: this.lastID,
        nome,
        url,
        preco,
        descricao,
        parcelamento,
        contato,
        status: adStatus,
        user_id: adUserId,
      });
    },
  );
});

// list ads with optional name search
router.get("/", (req, res) => {
  const { name } = req.query;
  let query =
    "SELECT id, nome, url, preco, descricao, parcelamento, contato, status, user_id FROM products";
  const params = [];
  if (name) {
    query += " WHERE nome LIKE ?";
    params.push(`%${name}%`);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar anúncios" });
    }
    res.json(rows);
  });
});

// toggle ad status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  db.get("SELECT id, status FROM products WHERE id = ?", [id], (err, ad) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar anúncio" });
    }

    if (!ad) {
      return res.status(404).json({ error: "Anúncio não encontrado" });
    }

    const currentStatus = ad.status || "PUBLICADO";
    const nextStatus = currentStatus === "PUBLICADO" ? "PAUSADO" : "PUBLICADO";

    db.run(
      "UPDATE products SET status = ? WHERE id = ?",
      [nextStatus, id],
      function (updateErr) {
        if (updateErr) {
          return res
            .status(500)
            .json({ error: "Erro ao atualizar status do anúncio" });
        }

        res.json({
          message: "Status do anúncio atualizado com sucesso",
          id: Number(id),
          status: nextStatus,
        });
      },
    );
  });
});

module.exports = router;
