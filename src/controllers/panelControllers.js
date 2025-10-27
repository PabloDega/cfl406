import { getCursos, getCurso, eliminarCurso, guardarDatosCursos } from "../services/cursosService.js";
import { getClases } from "../services/clasesService.js";

export const panelIndex = async (req, res) => {
    try {
        const cursos = await getCursos();
        const clases = await getClases();

        // Una sola respuesta exitosa
        return res.render("pages/panel", {
            layout: "layouts/panel",
            user: req.session.auth,
            cursos,
            clases,
        });
        
    } catch (error) {
        console.error("Error en panel controller:", error);
        
        // Una sola respuesta de error
        return res.status(500).render('error', { 
            message: 'Error interno del servidor',
            layout: 'layouts/main'
        });
    }
};

export const mostrarFormularioAgregar = async (req, res) => {
    try {
        const clases = await getClases();
        
        return res.render("pages/agregar-curso", {
            layout: "layouts/panel",
            user: req.session.auth,
            clases,
            title: "Agregar Nuevo Curso"
        });
        
    } catch (error) {
        console.error("Error en mostrarFormularioAgregar:", error);
        
        return res.status(500).render('error', { 
            message: 'Error interno del servidor',
            layout: 'layouts/panel'
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

export const agregarCurso = async (req, res) => {
    try {
        // Si es una petición GET, mostrar el formulario
        if (req.method === 'GET') {
            return mostrarFormularioAgregar(req, res);
        }
        
        // Si es POST, procesar el formulario
        const clase = await getClases();
        const keys = Object.keys(clase);
        const data = {};
        
        // Si viene como JSON
        let bodyData = req.body;
        if (req.headers['content-type'] && req.headers['content-type'].includes('application/json')) {
            bodyData = req.body;
        }
        
        keys.forEach(key => {
            if (bodyData[key] !== undefined && bodyData[key] !== null && bodyData[key] !== '') {
                data[key] = bodyData[key];
            } else {
                data[key] = null;
            }
        });
        
        // Campos obligatorios específicos
        const camposObligatorios = ['curso', 'codigo', 'area', 'sede', 'año', 'inicio', 'fin', 'cierreInscripciones', 'duracion', 'horario', 'idProfesor', 'profesor', 'descripcion', 'titulo', 'modalidad'];
        const faltantes = camposObligatorios.filter(campo => !data[campo]);
        
        if (faltantes.length > 0) {
            return res.status(400).json({
                error: true,
                msg: `Faltan campos obligatorios: ${faltantes.join(', ')}`,
                codigo: "AC01",
            });
        }

        // Procesar campos especiales
        if (typeof data.dias === 'string') {
            try {
                data.dias = JSON.parse(data.dias);
            } catch (e) {
                data.dias = [];
            }
        }
        
        if (typeof data.requisitos === 'string') {
            try {
                data.requisitos = JSON.parse(data.requisitos);
            } catch (e) {
                data.requisitos = [];
            }
        }
        
        // Convertir activo a boolean
        data.activo = data.activo === true || data.activo === 'true';

        // Lógica para agregar el curso
        const cursos = await getCursos();
        const nuevoId = cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1;
        const nuevoCurso = { id: nuevoId, ...data };
        cursos.push(nuevoCurso);

        const resultado = await guardarDatosCursos(cursos);

        if (resultado.error) {
            return res.status(400).json(resultado);
        }

        return res.json({
            error: false,
            msg: "Curso agregado exitosamente",
            data: nuevoCurso
        });
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
        const clases = await getClases();
        const keys = Object.keys(clases);
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