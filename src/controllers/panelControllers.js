import { getCursos, getCurso, eliminarCurso } from "../services/cursosService.js";

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
