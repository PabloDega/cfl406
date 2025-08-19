import { getCursos } from "../services/cursosService.js";

export const panelIndex = async (req, res) => {
    try {
      const cursos = await getCursos();

      res.render("pages/panel", { 
        layout: "layouts/panel",
        user: req.session.auth,
        cursos
    });
    } catch (error) {
      console.error("Error en panel controller:", error);
      res.status(500).send("Internal Server Error");
    }
}

export const cursosAcciones = (req, res) => {
    const pathSegments = req.path.split('/').filter(Boolean);
    
    console.log('Ruta completa:', req.path);
    console.log('Segmentos:', pathSegments);
    
    // Tu lógica aquí
    if(pathSegments.length !== 4) {
        return res.send({error: true, msg: "Ruta no válida"});
    } else {
        return res.send({error: false, msg: "Ruta válida"});
    }
};