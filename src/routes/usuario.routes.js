import express from "express";
import * as usuarioController from "../controllers/usuario.controller.js";
import autorizarUsuario from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/", usuarioController.criarUsuario);
router.post("/login", usuarioController.login);
// para usar a middleware de autorização, basta passar a função como segundo argumento
// router.get("/", autorizarUsuario, usuarioController.getUsuarios);
router.get("/", usuarioController.getUsuarios);
router.get("/:usuarioId", usuarioController.getUsuarioPorIdParams);
export default router;
