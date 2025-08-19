import express from "express"
export const router = express.Router();
import * as mainControllers from "../controllers/mainControllers.js";
import * as authControllers from "../controllers/authControllers.js";

router.get("/", mainControllers.index);

router.get("/formulario",mainControllers.formulario);

router.post("/formulario", mainControllers.postFormulario);

router.get("/login", authControllers.login);

router.post("/login", authControllers.postLogin);