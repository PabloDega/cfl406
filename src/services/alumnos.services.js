import {Alumnos, Localidades, Provincias, Nacionalidades, SexosGeneros, TiposDocumento} from "../models/index.model.js";

export const getAlumnos = async () => {
    try {
        const alumnos = await Alumnos.findAll({
            raw: true,
            include: [
                { model: TiposDocumento, attributes: ["nombre"] },
                { model: SexosGeneros, attributes: ["nombre"] },
                { model: Nacionalidades, attributes: ["nombre"] },
                { model: Localidades, attributes: ["nombre"] },
                { model: Provincias, attributes: ["nombre"] },
            ],
        });
        const resultado = alumnos.map((alumno) => {
            return {
                ...alumno,
                tipo_documento: alumno["TiposDocumento.nombre"],
                sexo_genero: alumno["SexosGeneros.nombre"],
                nacionalidad: alumno["Nacionalidades.nombre"],
                localidad: alumno["Localidades.nombre"],
                provincia: alumno["Provincias.nombre"],
            };
        });
        return resultado;
    } catch (error) {
        console.error("Error obteniendo alumnos:", error);
        throw {
            error: true,
            msg: "Error al obtener los alumnos",
            codigo: "GA01",
        };
    }
};

export const getAlumnoById = async (id) => {
    try {
        const alumno = await Alumnos.findByPk(id, {
            raw: true,
            include: [
                { model: TiposDocumento, attributes: ["nombre"] },
                { model: SexosGeneros, attributes: ["nombre"] },
                { model: Nacionalidades, attributes: ["nombre"] },
                { model: Localidades, attributes: ["nombre"] },
                { model: Provincias, attributes: ["nombre"] },
            ],
        });
        if (!alumno) {
            throw {
                error: true,
                msg: "Alumno no encontrado",
                codigo: "GA02",
            };
        }
        return {
            ...alumno,
            tipo_documento: alumno["TiposDocumento.nombre"],
            sexo_genero: alumno["SexosGeneros.nombre"],
            nacionalidad: alumno["Nacionalidades.nombre"],
            localidad: alumno["Localidades.nombre"],
            provincia: alumno["Provincias.nombre"],
        };
    } catch (error) {
        console.error("Error obteniendo alumno por ID:", error);
        throw {
            error: true,
            msg: "Error al obtener el alumno por ID",
            codigo: "GA03",
        };
    }
};

export const upsertAlumno = async (alumnoData) => {
    try {
        const [alumno, created] = await Alumnos.upsert(alumnoData, { returning: true });
        console.log(`Alumno ${created ? 'creado' : 'actualizado'}: `, JSON.stringify(alumno, null, 2));
        return { alumno, created };
    } catch (error) {
        console.error("Error upserting alumno:", error);
        throw {
            error: true,
            msg: "Error al crear o actualizar el alumno",
            codigo: "UA01",
        };
    }
};