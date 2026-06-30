import { Areas } from '../models/index.model.js'

export const getAreas = async () => {
    try {
        const areas = await Areas.findAll();
        console.log("Áreas obtenidas: ", JSON.stringify(areas, null, 2));
        return areas;
    } catch (error) {
        console.error("Error reading areas data:", error);
        throw error;
    }
}

export const upsertArea = async (areaData) => {
    try {
        const [area, created] = await Areas.upsert(areaData, { returning: true });
        console.log(`Área ${created ? 'creada' : 'actualizada'}: `, JSON.stringify(area, null, 2));
        return { area, created };
    } catch (error) {
        console.error("Error upserting area:", error);
        throw error;
    }
}