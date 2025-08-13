import express from "express"
export const router = express.Router();
import * as mainControllers from "../controllers/mainControllers.js";

router.get("/", mainControllers.index);

router.get("/login", mainControllers.login);

router.post("/login", mainControllers.postLogin);

router.get("/formulario", mainControllers.formulario);

router.post("/formulario", mainControllers.postFormulario);