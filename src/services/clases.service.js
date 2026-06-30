import { Clase } from '../models/index.model.js'

export const getClases = async () => {
  try {
    const clases = await Clase.findAll();
    console.log("Clases obtenidas: ", JSON.stringify(clases, null, 2));
    return clases;
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