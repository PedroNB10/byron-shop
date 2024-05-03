import express from "express";

import swaggerUI from "swagger-ui-express";
// import swaggerDocs from "./swagger.json" assert { type: "json" };

import exampleRouter from "./routes/example.routes.js";
import produtosRouter from "./routes/produtos.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import carrinhoRouter from "./routes/carrinho.routes.js";
import fs from "node:fs";
let swaggerDocs = null;

try {
  const filePath = "src/swagger.json";
  const data = fs.readFileSync(filePath, "utf8");
  swaggerDocs = JSON.parse(data);
  console.log(swaggerDocs);
} catch (err) {
  console.error("Error reading or parsing the JSON file:", err);
}

const app = express();
const port = process.env.APP_PORT ?? 8080;
const host = process.env.HOST ?? "localhost";

// app.use(express.urlencoded({extended: true})); // middleware para trabalhar com formulários
app.use(express.json());
// express.json() is a middleware function provided by the Express.js framework. It's used to parse incoming request bodies with JSON payloads.

// When you send data to your server using HTTP POST or PUT requests with a JSON payload in the body (common in APIs), express.json() parses that JSON data and makes it available in req.body object of your Express route handlers.

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/usuarios", usuarioRouter);
app.use("/produtos", produtosRouter);
app.use("/carrinho", carrinhoRouter);

app.use("/public", express.static("public")); // middleware para servir arquivos estáticos ou seja arquivos que não são processados pelo servidor como exemplo imagens

app.use("/", exampleRouter);

app.listen(port, () => {
  console.log(`Server Running on http://${host}:${port}`);
});
