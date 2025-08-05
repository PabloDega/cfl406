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
    res.render("pages/login", {
      layout: "layouts/panel",
      logged: false,
      error: [{ message: "Usuario o contraseña incorrectos", code: 401 }, { message: "Otro error", code: 402 }],
    });
  } catch (error) {
    console.error("Error en login controller:", error);
    res.status(500).send("Internal Server Error");
  }
}