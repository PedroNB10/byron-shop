import express from "express";
import * as exampleController from "../controllers/example.controller.js";

const router = express.Router();

router.get("/example", exampleController.methodExampleController);

export default router;
