# API Loja

API simples em Node.js usando Express e SQLite para gerenciar usuários e anúncios.

## Instalação

```bash
npm install
```

## Executar

```bash
npm start

```

## Rotas

### Autenticação

- `POST /auth/register` - registrar novo usuário `{ name, email, password, plan }`
- `POST /auth/login` - efetuar login `{ email, password }` (retorna também `name` e `id` no corpo)

### Anúncios

- `POST /anuncios` - criar anúncio (JSON):
  ```json
  {
    "nome": "Tênis Nike Air",
    "url": "https://meusite.com/anuncio/tenis-nike-air",
    "preco": 399.9,
    "descricao": "Tênis novo, sem uso",
    "parcelamento": "12x de R$ 33,32",
    "contato": "(11) 99999-9999",
    "user_id": null
  }
  ```
- `GET /anuncios` - lista todos anúncios
- `GET /anuncios?name=foo` - pesquisa por nome parcial
- `DELETE /anuncios/:id` - exclui anúncio

Os dados são persistidos em um banco SQLite localizado em `data/database.sqlite`.
