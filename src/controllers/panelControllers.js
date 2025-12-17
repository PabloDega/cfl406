import { getCursos, getCurso, eliminarCurso, guardarDatosCursos, getCursosSinProcesar, getLastId } from "../services/cursosService.js";
import { getClases } from "../services/clasesService.js";
import { crearFecha } from "../utils/dates.js";

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
        const clase = await getClases();
        const keys = Object.keys(clase.cursos);
        const data = {};
                
        keys.forEach(key => {
            if (req.body[key] !== undefined && req.body[key] !== null && req.body[key] !== '') {
                data[key] = req.body[key];
            } else {
                data[key] = null;
            }
        });
        //data.activo = true; // Por defecto activo en true para nuevos cursos
        
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

        // Normalizar campos booleanos (pueden venir como string 'true'/'false' o boolean true/false)
        if (data.activo !== undefined && data.activo !== null) {
            data.activo = data.activo === true || data.activo === 'true';
        }
        
        // Eliminar inscripcion del data si viene, ya que se calcula automáticamente
        delete data.inscripcion;

        // Discriminar entre INSERT y UPDATE
        const accion = req.body.accion || 'insert';
        // Usar getCursosSinProcesar para no recalcular inscripcion automáticamente
        const cursos = await getCursosSinProcesar();
        let resultado;
        let mensaje;
        let cursoModificado;

        if (accion === 'update') {
            // LÓGICA PARA ACTUALIZAR (UPDATE)
            console.log("Ejecutando UPDATE para curso ID:", data.id);
            console.log("Datos recibidos para actualización:", data);
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

            // Calcular inscripcion automáticamente antes de guardar
            cursosModificados.forEach(curso => {
                const fechaCierre = crearFecha(curso.cierreInscripciones);
                const hoy = new Date();
                curso.inscripcion = fechaCierre >= hoy;
            });

            resultado = await guardarDatosCursos(cursosModificados);
            cursoModificado = cursosModificados.find(c => c.id === cursoId);
            mensaje = "Curso modificado exitosamente";
            
        } else {
            // LÓGICA PARA AGREGAR (INSERT)
            console.log("Ejecutando INSERT para nuevo curso");
            
            // cargar id automáticamente
            data.id = await getLastId() + 1;

            // Si activo no viene definido, por defecto es true
            if (data.activo === undefined || data.activo === null) {
                data.activo = true;
            }
            
            const cursoNuevo = data;

            // Calcular inscripcion automáticamente
            cursoNuevo.inscripcion = new Date(cursoNuevo.cierreInscripciones) >= new Date();

            cursos.push(cursoNuevo);
            
            resultado = await guardarDatosCursos(cursos);
            mensaje = "Curso agregado exitosamente";
        }

        if (resultado.error) {
            return res.status(400).json(resultado);
        }

        return res.json({
            error: false,
            msg: mensaje,
            data: cursoModificado
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