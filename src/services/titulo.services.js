import { Titulo } from '../models/index.model.js'

export const getTitulos = async () => {
    try {
        const titulos = await Titulo.findAll();
        console.log("Títulos obtenidos: ", JSON.stringify(titulos, null, 2));
        return titulos;
    } catch (error) {
        console.error("Error reading títulos data:", error);
        throw error;
    }
}

export const upsertTitulo = async (tituloData) => {
    try {
        const [titulo, created] = await Titulo.upsert(tituloData, { returning: true });
        console.log(`Título ${created ? 'creado' : 'actualizado'}: `, JSON.stringify(titulo, null, 2));
        return { titulo, created };
    } catch (error) {
        console.error("Error upserting título:", error);
        throw error;
    }
}