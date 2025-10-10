import fs from "fs";
import path from "path";
import { __dirname } from "../../index.js";

// Función auxiliar para leer datos de clases
const leerDatosClases = async () => {
  try {
    const clasesPath = path.join(__dirname, "/data/clases.json");
    const clasesData = await fs.promises.readFile(clasesPath, "utf-8");
    return JSON.parse(clasesData);
  } catch (error) {
    console.error("Error leyendo datos de clases:", error);
    throw {
      error: true,
      msg: "Error al acceder a los datos de clases",
      codigo: "LDC01"
    };
  }
};

export const getClases = async () => {
  try {
    let clasesRaw = await leerDatosClases();
    return clasesRaw;
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