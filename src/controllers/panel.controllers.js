import { getCursos, getCurso, eliminarCurso, upsertCursos } from "../services/cursos.service.js";
import { getClases } from "../services/clases.service.js";
import { getSedes } from "../services/sede.services.js";
import { getTitulos } from "../services/titulo.services.js";
import { getAreas } from "../services/areas.services.js";
import { getModalidades } from "../services/modalidad.services.js";
import { getDocentes } from "../services/docentes.services.js";

export const panelIndex = async (req, res) => {
    try {
        const cursos = await getCursos();
        const clases = await getClases();
        const sedes = await getSedes();
        const titulos = await getTitulos();
        const areas = await getAreas();
        const modalidades = await getModalidades();
        const docentes = await getDocentes();

        // Una sola respuesta exitosa
        return res.render("pages/panel", {
            layout: "layouts/panel",
            user: req.session.auth,
            cursos,
            clases,
            sedes,
            titulos,
            areas,
            modalidades,
            docentes
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
        const sedes = await getSedes();
        const titulos = await getTitulos();
        const areas = await getAreas();
        const modalidades = await getModalidades();
        const docentes = await getDocentes();

        return res.render("pages/agregar-curso", {
            layout: "layouts/panel",
            user: req.session.auth,
            clases,
            sedes,
            titulos,
            areas,
            modalidades,
            docentes,
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
        } else if(accion === "ver" || accion === "modificar"){
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
    console.log("agregarCurso llamado");
    try {
        // Si es una petición GET, mostrar el formulario
        if (req.method === 'GET') {
            return mostrarFormularioAgregar(req, res);
        }
        
        // Si es POST, procesar el formulario
        const clases = await getClases();
        const keys = Object.keys(clases.cursos);
        const camposCursoRequired = clases.cursos_required || [];
        const data = {};
        
        // Validar y asignar campos recibidos
        keys.forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                data[key] = req.body[key];
            } else {
                data[key] = null;
            }
        });
        //data.activo = true; // Por defecto activo en true para nuevos cursos
        
        // Campos obligatorios específicos
        const camposObligatorios = Object.keys(camposCursoRequired).filter(key => camposCursoRequired[key] === true);
        const faltantes = camposObligatorios.filter(campo => !data[campo]);
        console.log("Campos faltantes:", faltantes);
        if (faltantes.length > 0) {
            return res.status(400).json({
                error: true,
                msg: `Faltan campos obligatorios: ${faltantes.join(', ')}`,
                codigo: "AC01",
            });
        }

        // Procesar campos especiales
        if (typeof data.dias === 'string' && data.dias.trim() !== '') {
            try {
                if(typeof JSON.parse(data.dias) === 'object') {
                    data.dias = JSON.parse(data.dias);
                } else {
                    data.dias = [data.dias];
                }
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

        // Normalizar campos booleanos (pueden venir como string 'true'/'false' o boolean true/false)
        if (data.activo !== undefined && data.activo !== null) {
            data.activo = data.activo === true || data.activo === 'true';
        }
        
        // Eliminar inscripcion del data si viene, ya que se calcula automáticamente
        delete data.inscripcion;
        console.log("Datos procesados para agregar/actualizar curso:", data);

        // Discriminar entre INSERT y UPDATE
        const accion = req.body.accion || 'insert';
        const resultado = await upsertCursos(data, accion);
        res.status(200).json(resultado);
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

        const resultado = await upsertCursos(cursosModificados);

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