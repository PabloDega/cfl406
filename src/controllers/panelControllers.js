import { getCursos, getCurso, eliminarCurso, getClase, guardarDatosCursos } from "../services/cursosService.js";

export const panelIndex = async (req, res) => {
    try {
        const cursos = await getCursos();
        res.render("pages/panel", {
            layout: "layouts/panel",
            user: req.session.auth,
            cursos,
        });
    } catch (error) {
        console.error("Error en panel controller:", error);
        res.status(500).json({
            error: true,
            msg: "Error interno del servidor",
            codigo: "PI01",
        });
    }
};

export const cursosAcciones = async (req, res) => {
    try {
        const { accion, id } = req.params;
        const cursoId = parseInt(id);
        console.log(accion, id)
        // Validar parámetros
        if (!accion || isNaN(cursoId)) {
            return res.status(400).json({
                error: true,
                msg: "Parámetros inválidos",
                codigo: "CA01",
            });
        }

        // Validar acción
        if (accion === "eliminar") {
            // Ejecutar acción
            const resultado = await eliminarCurso(cursoId);
            if (resultado.error) {
                return res.status(400).json(resultado);
            }
            return res.json(resultado);
        } else if(accion === "ver" || accion === "editar"){
            const curso = await getCurso(cursoId);
            return res.send({error: false, data: curso});
        } else if(accion === "inscribir"){
            return res.send({error: false, msg: "", redirect: `/panel/cursos/inscribir/${cursoId}`})
        } else {
            return res.status(400).json({
                error: true,
                msg: "Acción no válida",
                codigo: "CA02",
            });
        }
    } catch (error) {
        console.error("Error en cursosAcciones:", error);
        return res.status(500).json({
            error: true,
            msg: "Error al ejecutar la operación",
            codigo: "CA03",
        });
    }
};

export const getClaseCursos = async (req, res) => {
   try {
       const data = await getClase();
       res.json({
           error: false,
           data,
       });
   } catch (error) {
       console.error("Error en getClase:", error);
       return res.status(500).json({
           error: true,
           msg: "Error al obtener las clases",
           codigo: "GC02",
       });
   }
};

export const agregarCurso = async (req, res) => {
    try {
        // leer clase de curso desde el servicio
        const clase = await getClase();
        const keys = Object.keys(clase);
        const data = {};
        keys.forEach(key => {
            if (req.body[key] !== undefined) {
                data[key] = req.body[key];
            } else {
                data[key] = null;
            }
        });
        
        // Validar campos obligatorios
        if (Object.values(data).some(value => !value)) {
            return res.status(400).json({
                error: true,
                msg: "Todos los campos son obligatorios",
                codigo: "AC01",
            });
        }

        // Lógica para agregar el curso
        const cursos = await getCursos();
        const nuevoId = cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1;
        const nuevoCurso = { id: nuevoId, ...data };
        cursos.push(nuevoCurso);

        const resultado = await guardarDatosCursos(cursos);

        if (resultado.error) {
            return res.status(400).json(resultado);
        }

        return res.json(resultado);
    } catch (error) {
        console.error("Error en agregarCurso:", error);
        return res.status(500).json({
            error: true,
            msg: "Error al agregar el curso",
            codigo: "AC02",
        });
    }
};

export const modificarCurso = async (req, res) => {
    try {
        const { id } = req.params;
        const cursoId = parseInt(id);
        if (isNaN(cursoId)) {
            return res.status(400).json({
                error: true,
                msg: "ID de curso inválido",
                codigo: "MC01",
            });
        }
        // leer clase de curso desde el servicio
        const clase = await getClase();
        const keys = Object.keys(clase);
        const data = {};
        keys.forEach(key => {
            if (req.body[key] !== undefined) {
                data[key] = req.body[key];
            } else {
                data[key] = null;
            }
        });
        // Validar campos obligatorios
        if (Object.values(data).some(value => !value)) {
            return res.status(400).json({
                error: true,
                msg: "Todos los campos son obligatorios",
                codigo: "MC02",
            });
        }
        // Lógica para modificar el curso
        const cursos = await getCursos();
        let cursoEncontrado = false;
        const cursosModificados = cursos.map((curso) => {
            if (curso.id === cursoId) {
                cursoEncontrado = true;
                return { ...curso, ...data };
            }
            return curso;
        });

        if (!cursoEncontrado) {
            return res.status(404).json({
                error: true,
                msg: "Curso no encontrado",
                codigo: "MC03",
            });
        }

        const resultado = await guardarDatosCursos(cursosModificados);

        if (resultado.error) {
            return res.status(400).json(resultado);
        }

        return res.json(resultado);
    } catch (error) {
        console.error("Error en modificarCurso:", error);
        return res.status(500).json({
            error: true,
            msg: "Error al modificar el curso",
            codigo: "MC04",
        });
    }
};