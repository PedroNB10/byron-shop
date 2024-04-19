import express from "express";
import * as carrinhoController from "../controllers/carrinho.controller.js";
const router = express.Router();

router.post("/", carrinhoController.adicionarProdutoAoCarrinho);

export default router;
