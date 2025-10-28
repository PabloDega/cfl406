import { getUsers } from "../services/loginServices.js";

export const login = async (req, res) => {
  try {
    return res.render("pages/login", { layout: "layouts/login" });
  } catch (error) {
    console.error("Error en login controller:", error);
    return res.status(500).render('error', { 
      message: 'Error interno del servidor',
      layout: 'layouts/main'
    });
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
    
    const user = users.find(user => user.username === username && user.password === password);
    
    if (user) {
      // Generar token único para la sesión
      const sessionToken = generateSessionToken();
      const loginTime = Date.now();
      const expiresAt = loginTime + (24 * 60 * 60 * 1000); // 24 horas desde ahora
      
      req.session.auth = {
        username: user.username,
        login: true,
        rol: user.rol || "user",
        sessionToken,
        loginTime,
        expiresAt,
        lastActivity: loginTime,
        userId: user.id || null
      };
      
      // Regenerar ID de sesión por seguridad
      req.session.regenerate((err) => {
        if (err) {
          console.error('Error regenerando sesión:', err);
        }
      });
      
      return res.json({ 
        success: true, 
        message: "Login exitoso",
        user: {
          username: user.username,
          rol: user.rol
        }
      });
    }

    return res.json({ success: false, message: "Credenciales incorrectas" });
  } catch (error) {
    console.error("Error en postLogin controller:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

// Función para generar token único de sesión
function generateSessionToken() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
}

// Controlador para logout
export const logout = async (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Error al cerrar sesión:', err);
        return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
      }
      res.clearCookie('sessionId'); // Limpiar cookie de sesión
      return res.json({ success: true, message: "Sesión cerrada exitosamente" });
    });
  } catch (error) {
    console.error("Error en logout controller:", error);
    return res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}

