const express = require("express");
const authRoutes = require("./routes/auth");
const anunciosRoutes = require("./routes/anuncios");

const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");

// body parser embutido no Express a partir da 4.16
app.use(express.json());

app.use(cors());

// rotas
app.use("/auth", authRoutes);
app.use("/anuncios", anunciosRoutes);

app.get("/", (req, res) => {
  res.send("API de loja rodando");
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado na porta ${PORT}`);
});
