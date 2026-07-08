import express from "express"
export const router = express.Router();
import * as panelControllers from "../controllers/panel.controllers.js";
import * as cursosControllers from "../controllers/cursos.controllers.js";
import * as alumnosControllers from "../controllers/alumnos.controllers.js";

router.get("/", panelControllers.renderIndex);

// ===== CURSOS =====
router.get("/cursos", cursosControllers.renderCursos);
router.get("/cursos/agregar", cursosControllers.mostrarFormularioAgregar);
router.post("/cursos/agregar", cursosControllers.agregarCurso);
router.post("/cursos/modificar/:id", cursosControllers.agregarCurso);
router.get("/cursos/:accion/:id", cursosControllers.cursosAcciones);

// ===== ALUMNOS =====
router.get("/alumnos", alumnosControllers.renderAlumnos);