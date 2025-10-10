import session from 'express-session';
import FileStore from 'session-file-store';

// Crear el store de archivos
const FileStoreSession = FileStore(session);

export const sessionConfig = {
  store: new FileStoreSession({
    path: './sessions',      // Carpeta donde se guardan las sesiones
    ttl: 86400,             // Tiempo de vida en segundos (24 horas)
    retries: 0,             // No reintentar si hay error
    logFn: process.env.NODE_ENV === 'development' ? console.log : () => {} // Log solo en desarrollo
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  }
};

export const rateLimitConfig = {
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
};