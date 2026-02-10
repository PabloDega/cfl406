import 'dotenv/config';
import fs from "fs";

// Validar variables de entorno
if (!process.env.SESSION_SECRET) {
  console.error('❌ SESSION_SECRET no está definido en .env');
  process.exit(1);
}

if (!process.env.SERVERPORT) {
  console.error('❌ SERVERPORT no está definido en .env');
  process.exit(1);
}

import express from "express";
const app = express();

// Logger HTTP - Solo errores y requests importantes
import morgan from 'morgan';

const format = process.env.NODE_ENV === "production" ? "combined" : "dev";

const skip = (req, res) => {
  if (req.url.includes("/.well-known/") || req.url.includes("/favicon.ico") || req.url.includes(".map")) return true;
  return res.statusCode < 400 && !req.url.includes("/panel");
};

const stream = process.env.NODE_ENV === "production"
  ? fs.createWriteStream("logs/info/access.log", { flags: "a" })
  : process.stdout;

app.use(morgan(format, { stream, skip }));

// Configuración de Helmet para seguridad
import helmet from 'helmet';
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Permite scripts inline
      styleSrc: ["'self'", "'unsafe-inline'"],  // Permite estilos inline
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'", "https://www.google.com", "https://maps.google.com"], // Permite iframes de Google
    },
  },
}));

// Configuración de CORS
import cors from 'cors';
app.use(cors());

// Rate limiting
import rateLimit from 'express-rate-limit';
import { rateLimitConfig, loginLimiterConfig } from './src/config/server.js';
const limiter = rateLimit(rateLimitConfig);
app.use(limiter);

// Rate limiter específico para login
const loginLimiter = rateLimit(loginLimiterConfig);
app.use('/login', loginLimiter);

// Rate limiter para 404s
import { notFoundLimiterConfig } from './src/config/server.js';
const notFoundLimiter = rateLimit(notFoundLimiterConfig);

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // Para manejar JSON en requests
import http from 'http';
const server = http.createServer(app);
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export const __dirname = dirname(fileURLToPath(import.meta.url));

//-----------------------------
// Layouts EJS
app.set('views', './src/views/');
app.set("view engine", "ejs");
import expressEjsLayouts from 'express-ejs-layouts';
app.use(expressEjsLayouts);
app.set("layout", "layouts/main");

// session
import session from 'express-session';
import { sessionConfig } from './src/config/server.js';
app.use(session(sessionConfig));

// Seguridad básica
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Configuración de la ruta principal
import * as mainRoutes from "./src/routes/mainRoutes.js";
app.use("/", mainRoutes.router);

import * as panelRoutes from "./src/routes/panelRoutes.js";
import { checkLogin } from "./src/middlewares/auth.js";
app.use("/panel", checkLogin, panelRoutes.router);

app.use(express.static("public"));

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { message: 'Error interno del servidor' });
});

// 404 handler con rate limiting
app.use(notFoundLimiter, (req, res, next) => {
  res.status(404).render('404', { title: 'Página no encontrada' });
});

// Server
const PORT = process.env.SERVERPORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Servidor activo en http://localhost:${PORT}`);
  console.log(`📁 Directorio: ${__dirname}`);
  console.log(`🔒 Modo: ${process.env.NODE_ENV || 'development'}`);
});