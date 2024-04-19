import express from "express";

import exampleRouter from "./routes/example.routes.js";
import produtosRouter from "./routes/produtos.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import carrinhoRouter from "./routes/carrinho.routes.js";

const app = express();
const port = 8080;

app.use(express.json());
// express.json() is a middleware function provided by the Express.js framework. It's used to parse incoming request bodies with JSON payloads.

// When you send data to your server using HTTP POST or PUT requests with a JSON payload in the body (common in APIs), express.json() parses that JSON data and makes it available in req.body object of your Express route handlers.

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/usuarios", usuarioRouter);
app.use("/produtos", produtosRouter);
app.use("/carrinho", carrinhoRouter);

app.use("/", exampleRouter);

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
