import { getCursos } from "../services/cursosService.js";

export const index = async (req, res) => {
  try {
    let cursos = await getCursos();
    if (!cursos) {
      throw new Error("No hay cursos disponibles");
    }
    return res.render("pages/index", {
      data: "Pablo",
      cursos,
    });
  } catch (error) {
    console.error("Error en index controller:", error);
    return res.status(500).render('error', { 
      message: 'Error interno del servidor' 
    });
  }
}

export const formulario = async (req, res) => {
  try {
    let cursos = await getCursos();
    if (!cursos) {
      throw new Error("No hay cursos disponibles");
    }
    return res.render("pages/formulario", { 
      layout: "layouts/formulario", 
      cursos 
    });
  } catch (error) {
    console.error("Error en formulario controller:", error);
    return res.status(500).render('error', { 
      message: 'Error interno del servidor' 
    });
  }
}

export const postFormulario = async (req, res) => {
  try {
    console.log(req.body);
    //const { nombre, email, curso } = req.body;
    // Aquí puedes manejar la lógica para procesar el formulario
    //console.log("Datos del formulario:", { nombre, email, curso });
    return res.redirect("/");
  } catch (error) {
    console.error("Error en postFormulario controller:", error);
    return res.status(500).render('error', { 
      message: 'Error interno del servidor' 
    });
  }
} 