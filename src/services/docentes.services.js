import { Docentes } from '../models/index.model.js'

export const getDocentes = async () => {
    try {
        const docentes = await Docentes.findAll();
        console.log("Docentes obtenidos: ", JSON.stringify(docentes, null, 2));
        return docentes;
    } catch (error) {
        console.error("Error reading docentes data:", error);
        throw error;
    }
}

export const upsertDocente = async (docenteData) => {
    try {
        const [docente, created] = await Docentes.upsert(docenteData, { returning: true });
        console.log(`Docente ${created ? 'creado' : 'actualizado'}: `, JSON.stringify(docente, null, 2));
        return { docente, created };
    } catch (error) {
        console.error("Error upserting docente:", error);
        throw error;
    }
}