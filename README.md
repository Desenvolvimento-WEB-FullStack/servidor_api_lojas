# API Loja

API simples em Node.js usando Express e SQLite para gerenciar usuários e produtos.

## Instalação

```bash
npm install
```

## Executar

```bash
npm start
# ou em modo de desenvolvimento (com nodemon instalado globalmente):
npm run dev
```

## Rotas

### Autenticação

- `POST /auth/register` - registrar novo usuário `{ name, email, password }`
- `POST /auth/login` - efetuar login `{ email, password }` (retorna também `name` e `id` no corpo)

### Produtos

- `POST /products` - criar produto (JSON):
  ```json
  {
    "nome": "Elemental Hero Neos",
    "raridade": "Ultra Raro",
    "preco": 95.0,
    "descricao": "O herói supremo que pode se evoluir",
    "imagem": "https://images.ygoprodeck.com/images/cards/89631139.jpg"
  }
  ```
- `GET /products` - lista todos produtos
- `GET /products?name=foo` - pesquisa por nome parcial
- `DELETE /products/:id` - exclui produto

Os dados são persistidos em um banco SQLite localizado em `data/database.sqlite`.
