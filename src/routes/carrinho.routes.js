import express from "express";
import * as carrinhoController from "../controllers/carrinho.controller.js";
import autorizarUsuario from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post(
  "/adicionar/:produtoId",
  autorizarUsuario,
  carrinhoController.adicionarProdutoAoCarrinho
);
router.delete(
  "/remover/:produtoId",
  autorizarUsuario,
  carrinhoController.removerProdutoDoCarrinho
);

router.post("/finalizar", carrinhoController.finalizarCompra);
router.get("/", autorizarUsuario, carrinhoController.getCarrinhoPorUsuarioId);
export default router;
