import { getCursos } from "../services/cursosService.js";

export const index = async (req, res) => {
  try {
    let cursos = await getCursos();
    if (!cursos) {
      throw new Error("No hay cursos disponibles");
    }
    res.render("pages/index", {
      data: "Pablo",
      cursos,
    });
  } catch (error) {
    console.error("Error en index controller:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const login = async (req, res) => {
  try {
    res.render("pages/login", { layout: "layouts/panel" });
  } catch (error) {
    console.error("Error en login controller:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const formulario = async (req, res) => {
  try {
    let cursos = await getCursos();
    if (!cursos) {
      throw new Error("No hay cursos disponibles");
    }
    res.render("pages/formulario", { 
      layout: "layouts/formulario", 
      cursos 
    });
  } catch (error) {
    console.error("Error en formulario controller:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const postFormulario = async (req, res) => {
  try {
    const { nombre, email, curso } = req.body;
    // Aquí puedes manejar la lógica para procesar el formulario
    console.log("Datos del formulario:", { nombre, email, curso });
    res.redirect("/");
  } catch (error) {
    console.error("Error en postFormulario controller:", error);
    res.status(500).send("Internal Server Error");
  }
} 