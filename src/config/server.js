import session from 'express-session';

// Configuración diferente según el entorno
let sessionStore;

if (process.env.NODE_ENV === 'production') {
  // En producción (Linux): usar file-store
  const FileStore = (await import('session-file-store')).default;
  const FileStoreSession = FileStore(session);
  
  sessionStore = new FileStoreSession({
    path: './sessions',
    ttl: 86400,
    retries: 2,
    logFn: () => {} // Sin logs en producción
  });
} else {
  // En desarrollo (Windows): usar SQLite
  const SQLiteStore = (await import('connect-sqlite3')).default;
  const SQLiteStoreSession = SQLiteStore(session);
  
  sessionStore = new SQLiteStoreSession({
    db: 'sessions.db',
    dir: './data',
    ttl: 86400 * 1000 // En milisegundos para SQLite
  });
}

export const sessionConfig = {
  store: sessionStore,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  rolling: true, // Renovar cookie en cada request
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
};

export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, // 100 peticiones por IP cada 15 minutos
  standardHeaders: true, // Retorna info en los headers `RateLimit-*`
  legacyHeaders: false, // Desactiva headers `X-RateLimit-*`
  message: 'Demasiadas peticiones desde esta IP, por favor intente más tarde.',
  // Excluir rutas estáticas del rate limit
  skip: (req) => {
    const staticExtensions = ['.css', '.js', '.jpg', '.jpeg', '.png', '.gif', '.ico', '.svg', '.woff', '.woff2', '.ttf', '.eot'];
    return staticExtensions.some(ext => req.path.endsWith(ext));
  }
};

// Rate limiter estricto para login (prevenir fuerza bruta)
export const loginLimiterConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 5, // Solo 5 intentos de login cada 15 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiados intentos de inicio de sesión. Por favor, intente de nuevo en 15 minutos.',
  skipSuccessfulRequests: true // No contar intentos exitosos
};

// Rate limiter para 404s (bloquear scanners agresivos)
export const notFoundLimiterConfig = {
  windowMs: 5 * 60 * 1000, // 5 minutos
  limit: 10, // Solo 10 peticiones 404 cada 5 minutos
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Demasiadas peticiones a recursos inexistentes. Acceso temporalmente bloqueado.',
  skipSuccessfulRequests: true // Solo contar 404s, no peticiones exitosas
};