import express from "express";
import * as produtosController from "../controllers/produtos.controller.js";
const router = express.Router();

router.post("/", produtosController.criarProduto);
router.get("/", produtosController.getProdutos);
// router.post("/carrinho", produtosController.adicionarProdutoAoCarrinho);

export default router;
