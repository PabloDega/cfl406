import fs from 'fs';
import path from 'path';
import { __dirname } from '../../index.js';

export const getCursos = async () => {
    try {
        const cursosPath = path.join(__dirname, '/data/cursos.json');
        const cursosData = await fs.promises.readFile(cursosPath, 'utf-8');
        return JSON.parse(cursosData).cursos;
    } catch (error) {
        console.error("Error reading cursos data:", error);
        throw error;
    }
}