import { getUsers } from "../services/loginServices.js";

export const login = async (req, res) => {
  try {
    res.render("pages/login", { layout: "layouts/login" });
  } catch (error) {
    console.error("Error en login controller:", error);
    res.status(500).send("Internal Server Error");
  }
}

export const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // leer los datos del usuario del archivo users.json de la carpeta ./data
    let users = await getUsers();
    if (!users) {
      return res.status(400).json({ success: false, message: "No se encontraron usuarios." });
    }
    // Verificar si el usuario y la contraseña son correctos
    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Faltan datos de usuario." });
    }
    const success = users.some(user => user.username === username && user.password === password);

    if (success) {
      req.session.auth = {
        username,
        login: true,
        rol: users.find(user => user.username === username).rol || "user"
      };
    }

    res.json({ success });
  } catch (error) {
    console.error("Error en postLogin controller:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

