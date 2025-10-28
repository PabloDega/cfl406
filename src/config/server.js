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
  windowMs: 1 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
};