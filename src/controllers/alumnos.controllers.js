import { getCursos } from "../services/cursos.service.js";
import { getClases } from "../services/clases.service.js";
import { getAlumnos } from "../services/alumnos.service.js";

export const renderAlumnos = async (req, res) => {
    try {
        const alumnos = await getAlumnos();
        const cursos = await getCursos();
        const clases = await getClases();

        // Una sola respuesta exitosa
        return res.render("pages/alumnos", {
            layout: "layouts/panel",
            user: req.session.auth,
            cursos,
            clases,
        });
        
    } catch (error) {
        console.error("Error en alumnos controller:", error);
        
        // Una sola respuesta de error
        return res.status(500).render('error', { 
            message: 'Error interno del servidor',
            layout: 'layouts/main'
        });
    }
};