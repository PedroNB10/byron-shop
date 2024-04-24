import express from "express";
import * as carrinhoController from "../controllers/carrinho.controller.js";
import autorizarUsuario from "../middlewares/auth.middlewares.js";
const router = express.Router();

router.post(
  "/",
  autorizarUsuario,
  carrinhoController.adicionarProdutoAoCarrinho
);
router.delete(
  "/:usuarioId/:produtoId",
  autorizarUsuario,
  carrinhoController.removerProdutoDoCarrinho
);

router.post(
  "/finalizar-compra/:usuarioId",

  carrinhoController.finalizarCompra
);

export default router;
