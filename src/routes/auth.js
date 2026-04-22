const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middlewares/auth");

const router = express.Router();
const ALLOWED_PLANS = ["Gratuito", "Bronze", "Prata", "Ouro"];

// register user (optional)
router.post("/register", async (req, res) => {
  const { name, email, password, plan } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ error: "Nome, email e senha são obrigatórios" });
  }

  const selectedPlan = plan || "Gratuito";
  if (!ALLOWED_PLANS.includes(selectedPlan)) {
    return res.status(400).json({
      error: "Plano inválido. Use: Gratuito, Bronze, Prata ou Ouro",
    });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (name, email, password, plan) VALUES (?, ?, ?, ?)",
      [name, email, hash, selectedPlan],
      function (err) {
        if (err) {
          if (err.code === "SQLITE_CONSTRAINT") {
            return res.status(409).json({ error: "Usuário já existe" });
          }
          return res.status(500).json({ error: "Erro ao criar usuário" });
        }
        res
          .status(201)
          .json({ id: this.lastID, name, email, plan: selectedPlan });
      },
    );
  } catch (err) {
    res.status(500).json({ error: "Erro interno" });
  }
});

// login route
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar usuário" });
    }
    if (!user) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan || "Gratuito",
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    );

    // optionally return user info without password
    res.json({
      message: "Login realizado com sucesso",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        plan: user.plan || "Gratuito",
      },
    });
  });
});

module.exports = router;
