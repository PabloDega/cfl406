import express from "express"
export const router = express.Router();
import * as panelControllers from "../controllers/panelControllers.js";

router.get("/", panelControllers.panelIndex);

router.get("/cursos/:accion/:id", panelControllers.cursosAcciones);