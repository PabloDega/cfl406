import express from "express"
export const router = express.Router();
import * as panelControllers from "../controllers/panelControllers.js";

router.get("/", panelControllers.panelIndex);

router.get("/cursos/agregar", panelControllers.mostrarFormularioAgregar);
router.post("/cursos/agregar", panelControllers.agregarCurso);
router.post("/cursos/modificar/:id", panelControllers.agregarCurso);

router.get("/cursos/:accion/:id", panelControllers.cursosAcciones);