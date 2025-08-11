import express from "express"
export const router = express.Router();
import * as mainControllers from "../controllers/mainControllers.js";

router.get("/", mainControllers.index);

router.get("/admin", mainControllers.login);

router.get("/formulario", mainControllers.formulario);

router.post("/formulario", mainControllers.postFormulario);