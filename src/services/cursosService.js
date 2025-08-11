import fs from 'fs';
import path from 'path';
import { __dirname } from '../../index.js';

export const getCursos = async () => {
    try {
        const cursosPath = path.join(__dirname, '/data/cursos.json');
        const cursosData = await fs.promises.readFile(cursosPath, 'utf-8');
        let cursos = JSON.parse(cursosData).cursos;
        // agregar una propiedad a cada curso llamada inscripcion con un booleano que se calcule en false si la fecha de cierreInscripciones es menor a hoy
        cursos = cursos.map(curso => {
            const fechaCierre = new Date(curso.cierreInscripciones);
            const hoy = new Date();
            return {
                ...curso,
                inscripcion: fechaCierre >= hoy
            };
        });
        return cursos;
    } catch (error) {
        console.error("Error reading cursos data:", error);
        throw error;
    }
}