import fs from "fs";
import path from "path";
import { __dirname } from "../../index.js";

// Función auxiliar para leer datos de cursos
const leerDatosCursos = async () => {
  try {
    const cursosPath = path.join(__dirname, "/data/cursos.json");
    const cursosData = await fs.promises.readFile(cursosPath, "utf-8");
    return JSON.parse(cursosData);
  } catch (error) {
    console.error("Error leyendo datos de cursos:", error);
    throw {
      error: true,
      msg: "Error al acceder a los datos de cursos",
      codigo: "LDC01"
    };
  }
};

// Función auxiliar para guardar datos de cursos
const guardarDatosCursos = async (cursos) => {
  try {
    const cursosPath = path.join(__dirname, "/data/cursos.json");
    await fs.promises.writeFile(cursosPath, JSON.stringify({ cursos }, null, 2), "utf-8");
  } catch (error) {
    console.error("Error guardando datos de cursos:", error);
    throw {
      error: true,
      msg: "Error al guardar los datos de cursos",
      codigo: "GDC01"
    };
  }
};

// Función auxiliar para agregar estado de inscripción
const agregarEstadoInscripcion = (cursos) => {
  const hoy = new Date();
  return cursos.map((curso) => {
    const fechaCierre = new Date(curso.cierreInscripciones);
    return {
      ...curso,
      inscripcion: fechaCierre >= hoy,
    };
  });
};

export const getCursos = async () => {
  try {
    let cursosRaw = await leerDatosCursos();
    cursosRaw = cursosRaw.cursos;
    // Filtrar cursos activos
    const cursosActivos = cursosRaw.filter((curso) => curso.activo);
    
    if (cursosActivos.length === 0) {
      throw {
        error: true,
        msg: "No hay cursos activos disponibles",
        codigo: "GCS01"
      };
    }
    
    // Agregar estado de inscripción
    return agregarEstadoInscripcion(cursosActivos);
    
  } catch (error) {
    console.error("Error en getCursos:", error);
    if (error.error) {
      throw error; // Re-lanzar errores estructurados
    }
    throw {
      error: true,
      msg: "Error al obtener cursos",
      codigo: "GCS02"
    };
  }
};

export const getCurso = async (id) => {
  try {
    let cursosRaw = await leerDatosCursos();
    cursosRaw = cursosRaw.cursos;    
    // Buscar curso por ID
    const cursoEncontrado = cursosRaw.find((curso) => curso.id === id);
    
    if (!cursoEncontrado) {
      throw {
        error: true,
        msg: "No se encuentra el curso seleccionado",
        codigo: "GC01"
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
      codigo: "GC02"
    };
  }
};

export const getCursosRaw = async () => {
  try {
    let cursosRaw = await leerDatosCursos();
    cursosRaw = cursosRaw.cursos;    
    // Devolver todos los cursos (activos e inactivos) con estado de inscripción
    return agregarEstadoInscripcion(cursosRaw);
    
  } catch (error) {
    console.error("Error en getCursosRaw:", error);
    if (error.error) {
      throw error; // Re-lanzar errores estructurados
    }
    throw {
      error: true,
      msg: "Error al obtener cursos sin filtrar",
      codigo: "GCR01"
    };
  }
};

export const eliminarCurso = async (id) => {
  try {
    let cursosRaw = await leerDatosCursos();
    cursosRaw = cursosRaw.cursos;    
    // Buscar y modificar el curso
    let cursoEncontrado = false;
    const cursosModificados = cursos.map((curso) => {
      if (curso.id === id) {
        cursoEncontrado = true;
        return { ...curso, activo: false };
      }
      return curso;
    });
    
    if (!cursoEncontrado) {
      throw {
        error: true,
        msg: "No se encuentra el curso seleccionado",
        codigo: "EC01"
      };
    }
    
    // Guardar los cambios
    await guardarDatosCursos(cursosModificados);
    
    return {
      error: false,
      msg: "Curso eliminado con éxito"
    };
    
  } catch (error) {
    console.error("Error en eliminarCurso:", error);
    if (error.error) {
      throw error; // Re-lanzar errores estructurados
    }
    throw {
      error: true,
      msg: "Error al eliminar el curso",
      codigo: "EC02"
    };
  }
};

// Función auxiliar para validar estructura de curso
export const validarCurso = (curso) => {
  const camposRequeridos = ['id', 'nombre', 'cierreInscripciones', 'activo'];
  const camposFaltantes = camposRequeridos.filter(campo => !(campo in curso));
  
  if (camposFaltantes.length > 0) {
    throw {
      error: true,
      msg: `Campos requeridos faltantes: ${camposFaltantes.join(', ')}`,
      codigo: "VC01"
    };
  }
  
  return true;
};

export const getClase = async () => {
  try {
    let cursosRaw = await leerDatosCursos();
    return cursosRaw.clase;
  } catch (error) {
    console.error("Error en getCursosRaw:", error);
    if (error.error) {
      throw error; // Re-lanzar errores estructurados
    }
    throw {
      error: true,
      msg: "Error al obtener cursos sin filtrar",
      codigo: "GCR01"
    };
  }
};