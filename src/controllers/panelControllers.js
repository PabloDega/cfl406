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
    console.log("agregarCurso llamado");
    try {
        // Si es una petición GET, mostrar el formulario
        if (req.method === 'GET') {
            return mostrarFormularioAgregar(req, res);
        }
        
        // Si es POST, procesar el formulario
        const clase = await getClases();
        const keys = Object.keys(clase.cursos);
        const data = {};
        
        console.log("req.body:", req.body);
        
        keys.forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                data[key] = req.body[key];
            } else {
                data[key] = null;
            }
        });
        //data.activo = true; // Por defecto activo en true para nuevos cursos

        console.log("Datos recibidos para nuevo curso:", data);
        
        // Campos obligatorios específicos
        const camposObligatorios = ['curso', 'codigo', 'area', 'sede', 'año', 'inicio', 'fin', 'cierreInscripciones', 'duracion', 'horario', 'profesor', 'descripcion', 'titulo', 'modalidad'];
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
        if (typeof data.dias === 'string') {
            try {
                data.dias = data.dias.split(",");
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
        
        // Discriminar entre INSERT y UPDATE
        const accion = req.body.accion || 'insert';
        const cursos = await getCursos();
        let resultado;
        let mensaje;
        let cursoResultado;

        if (accion === 'update') {
            // LÓGICA PARA ACTUALIZAR (UPDATE)
            console.log("Ejecutando UPDATE para curso ID:", data.id);
            
            if (!data.id) {
                return res.status(400).json({
                    error: true,
                    msg: "ID de curso requerido para actualizar",
                    codigo: "AC03",
                });
            }

            const cursoId = parseInt(data.id);
            let cursoEncontrado = false;
            
            const cursosModificados = cursos.map((curso) => {
                if (curso.id === cursoId) {
                    cursoEncontrado = true;
                    // Preservar campos que no vienen en data (como 'activo', 'idProfesor', 'inscripcion')
                    // Solo actualizar los campos que sí vienen en data
                    const cursoActualizado = { ...curso };
                    
                    // Actualizar solo los campos recibidos (no null/undefined)
                    Object.keys(data).forEach(key => {
                        if (data[key] !== null && data[key] !== undefined) {
                            cursoActualizado[key] = data[key];
                        }
                    });
                    
                    // Mantener el ID original
                    cursoActualizado.id = cursoId;
                    
                    return cursoActualizado;
                }
                return curso;
            });

            if (!cursoEncontrado) {
                return res.status(404).json({
                    error: true,
                    msg: "Curso no encontrado",
                    codigo: "AC04",
                });
            }

            resultado = await guardarDatosCursos(cursosModificados);
            cursoResultado = cursosModificados.find(c => c.id === cursoId);
            mensaje = "Curso modificado exitosamente";
            
        } else {
            // LÓGICA PARA AGREGAR (INSERT)
            console.log("Ejecutando INSERT para nuevo curso");
            
            // Convertir activo a boolean solo para INSERT
            if (data.activo !== undefined && data.activo !== null) {
                data.activo = data.activo === true || data.activo === 'true';
            } else {
                // Si no viene, por defecto es true
                data.activo = true;
            }
            
            const nuevoId = cursos.length > 0 ? Math.max(...cursos.map(c => c.id)) + 1 : 1;
            cursoResultado = { id: nuevoId, ...data };
            cursos.push(cursoResultado);
            
            resultado = await guardarDatosCursos(cursos);
            mensaje = "Curso agregado exitosamente";
        }

        if (resultado.error) {
            return res.status(400).json(resultado);
        }

        return res.json({
            error: false,
            msg: mensaje,
            data: cursoResultado
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