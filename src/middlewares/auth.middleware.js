export const checkLogin = (req, res, next) => {
  if (!req.session || !req.session.auth || !req.session.auth.login) {
    return res.redirect("/login");
  }
  
  const auth = req.session.auth;
  const now = Date.now();
  
  // Verificar si la sesión ha expirado
  if (auth.expiresAt && now > auth.expiresAt) {
    req.session.destroy((err) => {
      if (err) console.error('Error destroying expired session:', err);
    });
    return res.redirect("/login?expired=true");
  }
  
  // Verificar inactividad (opcional: 2 horas sin actividad)
  /* const maxInactivity = 2 * 60 * 60 * 1000; // 2 horas
  if (auth.lastActivity && (now - auth.lastActivity) > maxInactivity) {
    req.session.destroy((err) => {
      if (err) console.error('Error destroying inactive session:', err);
    });
    return res.redirect("/login?inactive=true");
  } */
  
  // Actualizar última actividad
  req.session.auth.lastActivity = now;
  
  return next();
};

// Middleware para verificar roles específicos
export const requireRole = (role) => {
  return (req, res, next) => {
    if (!req.session || !req.session.auth || req.session.auth.rol !== role) {
      return res.status(403).json({
        error: true,
        message: "Acceso denegado. Permisos insuficientes.",
        requiredRole: role
      });
    }
    next();
  };
};

// Función para generar token único de sesión
export const generateSessionToken = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  return `${timestamp}-${random}`;
}