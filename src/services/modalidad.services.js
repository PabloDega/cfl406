import { Modalidad } from '../models/index.model.js'

export const getModalidades = async () => {
    try {
        const modalidades = await Modalidad.findAll();
        console.log("Modalidades obtenidas: ", JSON.stringify(modalidades, null, 2));
        return modalidades;
    } catch (error) {
        console.error("Error reading modalidades data:", error);
        throw error;
    }
}

export const upsertModalidad = async (modalidadData) => {
    try {
        const [modalidad, created] = await Modalidad.upsert(modalidadData, { returning: true });
        console.log(`Modalidad ${created ? 'creada' : 'actualizada'}: `, JSON.stringify(modalidad, null, 2));
        return { modalidad, created };
    } catch (error) {
        console.error("Error upserting modalidad:", error);
        throw error;
    }
}