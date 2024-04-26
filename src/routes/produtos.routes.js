import express from "express";
import multer from "multer"; // essa lib é para upload de arquivos
import path from "path"; // essa lib é para trabalhar com caminhos de arquivos
import * as produtosController from "../controllers/produtos.controller.js";
import autorizarUsuarioAdmin from "../middlewares/admin.middleware.js";
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public"); // função de callback que recebe um erro e o caminho onde os arquivos serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/:produtoId", produtosController.getProdutoPorId);
router.post("/", autorizarUsuarioAdmin, produtosController.criarProduto);
router.get("/", produtosController.getProdutos);
// router.post("/carrinho", produtosController.adicionarProdutoAoCarrinho);

// name: fotos é o nome do campo que contém as fotos
router.put(
  "/:produtoId",
  upload.fields([{ name: "fotos", maxCount: 6 }]),
  produtosController.adicionarFotosAoProduto
);
export default router;
