import express from "express";
import * as usuarioController from "../controllers/usuario.controller.js";

const router = express.Router();

router.post("/", usuarioController.criarUsuario);
export default router;
