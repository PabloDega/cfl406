import { Sede } from '../models/index.model.js'

export const getSedes = async () => {
    try {
        const sedes = await Sede.findAll({ raw: true });
        console.log("Sedes obtenidas: ", JSON.stringify(sedes, null, 2));
        return sedes;
    } catch (error) {
        console.error("Error reading sedes data:", error);
        throw error;
    }
}

export const upsertSede = async (sedeData) => {
    try {
        const [sede, created] = await Sede.upsert(sedeData, { returning: true });
        console.log(`Sede ${created ? 'creada' : 'actualizada'}: `, JSON.stringify(sede, null, 2));
        return { sede, created };
    } catch (error) {
        console.error("Error upserting sede:", error);
        throw error;
    }
}