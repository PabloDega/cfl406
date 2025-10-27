# 🎓 CFL 406 - Panel Administrativo

Panel administrativo y sitio web del CFL406 - Centro de Formación Laboral

## 🚀 Tecnologías

- **Backend:** Node.js + Express.js
- **Template Engine:** EJS + Express Layouts
- **Base de Datos:** JSON files + MySQL
- **Sesiones:** SQLite (dev) + FileStore (prod)
- **Seguridad:** Helmet + CORS + Rate Limiting

## 📦 Instalación

```bash
npm install
cp .env.example .env
# Configurar variables en .env
npm start
```

## 🛠️ Scripts

```bash
npm start          # Iniciar servidor
npm run dev        # Desarrollo con nodemon
npm run production # Producción con PM2
```

## 🔧 Configuración

Editar `.env` con tus configuraciones:
- `SERVERPORT`: Puerto del servidor
- `SESSION_SECRET`: Clave secreta para sesiones
- `NODE_ENV`: Entorno (development/production)

## 📁 Estructura

```
├── src/
│   ├── config/         # Configuraciones
│   ├── controllers/    # Controladores
│   ├── middlewares/    # Middlewares
│   ├── routes/         # Rutas
│   └── views/          # Templates EJS
├── public/             # Archivos estáticos
├── data/               # Datos JSON
└── index.js           # Servidor principal
```

## 🔐 Funcionalidades

- ✅ Sistema de autenticación
- ✅ Panel administrativo
- ✅ Gestión de cursos (CRUD)
- ✅ Formulario de inscripción
- ✅ Rate limiting
- ✅ Sesiones persistentes

## 📊 Estado: En desarrollo