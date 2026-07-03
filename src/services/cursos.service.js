import { normalizarGetCurso } from "../utils/cursos.utils.js";
import { Cursos, Areas, Sede, Titulo, Modalidad, Docentes } from "../models/index.model.js";

export const upsertCursos = async (data, accion) => {
  try {
    if (accion === "insert") {
      // Asignar un nuevo ID automáticamente
      const maxIdCurso = await Cursos.max("id");
      data.id = (maxIdCurso || 0) + 1;
    }
    await Cursos.upsert(data);

    return {
      error: false,
      msg: `Curso ${accion === "insert" ? "insertado" : "actualizado"} con éxito`,
      data: data,
    };
  } catch (error) {
    console.error("Error guardando datos de cursos:", error);
    throw {
      error: true,
      msg: "Error al guardar los datos de cursos",
      codigo: "GDC01",
    };
  }
};

const agregarEstadoInscripcion = (cursos) => {
  return cursos.map((curso) => {
    return {
      ...curso,
      inscripcion: new Date(curso.cierre_inscripcion) >= new Date(),
    };
  });
};

export const getCursos = async () => {
  try {
    const cursos = await Cursos.findAll({ 
      raw: true,
      include: [
        { model: Areas, attributes: ["area"] },
        { model: Sede, attributes: ["nombre"] },
        { model: Titulo, attributes: ["titulo"] },
        { model: Modalidad, attributes: ["modalidad"] },
        { model: Docentes, attributes: ["nombre"] },
      ],
    });
    const normalizados = cursos.map((c) => normalizarGetCurso(c));
    console.log("Cursos obtenidos de la base de datos:", normalizados);
    return agregarEstadoInscripcion(normalizados);
    /* // Filtrar cursos activos
    const cursosActivos = cursos.filter((curso) => curso.activo);
    
    if (cursosActivos.length === 0) {
      throw {
        error: true,
        msg: "No hay cursos activos disponibles",
        codigo: "GCS01"
      };
    }
    
    // Agregar estado de inscripción
    return agregarEstadoInscripcion(cursosActivos); */
  } catch (error) {
    console.error("Error en getCursos:", error);
    if (error.error) {
      throw error; // Re-lanzar errores estructurados
    }
    throw {
      error: true,
      msg: "Error al obtener cursos",
      codigo: "GCS02",
    };
  }
};

export const getCurso = async (id) => {
  try {
    const curso = await Cursos.findByPk(id, {
      raw: true,
      include: [
        { model: Areas, attributes: ["area"] },
        { model: Sede, attributes: ["nombre"] },
        { model: Titulo, attributes: ["titulo"] },
        { model: Modalidad, attributes: ["modalidad"] },
        { model: Docentes, attributes: ["nombre"] },
      ],
    });
    const normalizados = normalizarGetCurso(curso);
    console.log("Curso obtenido de la base de datos:", normalizados);
    return normalizados;
    // Buscar curso por ID
    const cursoEncontrado = cursosRaw.find((curso) => curso.id === id);

    if (!cursoEncontrado) {
      throw {
        error: true,
        msg: "No se encuentra el curso seleccionado",
        codigo: "GC01",
      };
    }

    // Agregar estado de inscripción y devolver como objeto único
    const cursosConEstado = agregarEstadoInscripcion([cursoEncontrado]);
    return cursosConEstado[0]; // Devolver el objeto, no un array
  } catch (error) {
    console.error("Error en getCurso:", error);
    if (error.error) {
      throw error; // Re-lanzar errores estructurados
    }
    throw {
      error: true,
      msg: "Error al obtener el curso",
      codigo: "GC02",
    };
  }
};

export const eliminarCurso = async (id) => {
  try {
    // Hacer un soft delete registrando un 1 en el campo "eliminado" del curso correspondiente
    const curso = await Cursos.findByPk(id);
    if (!curso) {
      throw {
        error: true,
        msg: "No se encuentra el curso seleccionado",
        codigo: "EC01",
      };
    }
    curso.eliminado = 1;
    await curso.save();
    return {
      error: false,
      msg: "Curso eliminado con éxito",
    };
  } catch (error) {
    console.error("Error en eliminarCurso:", error);
    if (error.error) {
      throw error; // Re-lanzar errores estructurados
    }
    throw {
      error: true,
      msg: "Error al eliminar el curso",
      codigo: "EC02",
    };
  }
};
