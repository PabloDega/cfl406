import { Users } from '../models/index.model.js'

export const getUsers = async () => {
    try {
        const usuarios = await Users.findAll();
        console.log("Usuarios obtenidos: ", JSON.stringify(usuarios, null, 2));
        return usuarios;
    } catch (error) {
        console.error("Error reading users data:", error);
        throw error;
    }
}
