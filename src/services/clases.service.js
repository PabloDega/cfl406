import { Clase } from '../models/index.model.js'

export const getClases = async () => {
  try {
    const clases = await Clase.findAll({ raw: true });
    // convertir en objeto con clave por cada propiedad .objeto y valor por cada propiedad .clase
    const clasesObj = {};
    clases.forEach(clase => {
      clasesObj[clase.objeto] = JSON.parse(clase.clase);
    });
    console.log("Clases obtenidas en el servicio");
    return clasesObj;
  } catch (error) {
    console.error("Error obteniendo clases:", error);
    throw error;
  }
};

export const upsertClase = async (claseData) => {
  try {
    const [clase, created] = await Clase.upsert(claseData, { returning: true });
    console.log(`Clase ${created ? 'creada' : 'actualizada'}: `, JSON.stringify(clase, null, 2));
    return { clase, created };
  } catch (error) {
    console.error("Error upserting clase:", error);
    throw error;
  } 
}