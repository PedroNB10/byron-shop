import express from "express";

import exampleRouter from "./routes/example.routes.js";

const app = express();
const port = 8080;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/", exampleRouter);

app.listen(port, () => {
  console.log(`Server Running on http://localhost:${port}`);
});
