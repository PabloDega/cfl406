import express from "express"
export const router = express.Router();
import * as panelControllers from "../controllers/panelControllers.js";

router.get("/", panelControllers.panelIndex);

router.get("/cursos/acciones/:accion/:id", panelControllers.cursosAcciones);

router.get("/cursos/clase", panelControllers.getClaseCursos);