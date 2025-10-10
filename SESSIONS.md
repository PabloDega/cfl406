# 🔐 Sistema de Sesiones Persistentes

## ¿Qué cambió?

Antes: Las sesiones se guardaban en **memoria** y se perdían al reiniciar el servidor.
Ahora: Las sesiones persisten entre reinicios con diferentes stores según el entorno.

## 🌍 **Configuración por Entorno:**

### 🖥️ **Desarrollo (Windows)**
```javascript
// Usa SQLite (más estable en Windows)
store: new SQLiteStoreSession({
  db: 'sessions.db',
  dir: './data',
  ttl: 86400 * 1000
})
```
- **Archivo**: `./data/sessions.db`
- **Ventaja**: No hay problemas de bloqueo de archivos en Windows
- **Storage**: Base de datos SQLite

### 🐧 **Producción (Linux)**
```javascript
// Usa File Store (óptimo en Linux)
store: new FileStoreSession({
  path: './sessions',
  ttl: 86400,
  retries: 2
})
```
- **Carpeta**: `./sessions/`
- **Ventaja**: Mejor rendimiento en sistemas Linux
- **Storage**: Archivos JSON individuales

## 🔧 **Errores Solucionados:**

### ✅ **Error EPERM (Windows)**
```
Error: EPERM: operation not permitted, rename
```
**Solución**: SQLite en desarrollo evita problemas de bloqueo de archivos

### ✅ **Error Headers Already Sent**
```
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent
```
**Solución**: Verificación de `res.headersSent` en controladores

## 📂 **Estructura de Archivos:**

```
data/
├── sessions.db          # SQLite (desarrollo)
├── cursos.json
└── users.json

sessions/                # File store (producción)
├── [sessionId1].json
└── [sessionId2].json
```

## 🔄 **Comportamiento Actual:**

### ✅ **Funcionamiento:**
- ✅ Usuario se loguea → Sesión se guarda
- ✅ Servidor se reinicia → Sesión persiste  
- ✅ Usuario sigue logueado → No necesita re-login
- ✅ Compatible con Windows y Linux
- ✅ Sin errores de bloqueo de archivos

### ⏰ **Expiración:**
- Las sesiones expiran después de 24 horas
- Limpieza automática de sesiones expiradas

## 🛡️ **Seguridad:**

- `.gitignore` actualizado para excluir:
  - `sessions/` (producción)
  - `data/sessions.db` (desarrollo)
- Cookies configuradas con `httpOnly` y `secure`
- Manejo seguro de errores sin exponer información sensible

## 🧹 **Mantenimiento:**

### Desarrollo (Windows):
```bash
# Limpiar sesiones de desarrollo
rm data/sessions.db
```

### Producción (Linux):
```bash
# Limpiar sesiones de producción  
rm -rf sessions/*
```

## 🚀 **Próximos Pasos:**

Para aplicaciones de mayor escala:
- **Redis**: Para múltiples servidores
- **MongoDB**: Si ya usas MongoDB
- **PostgreSQL**: Con `connect-pg-simple`

## 🔧 **Instalación:**

```bash
# Paquetes necesarios
npm install connect-sqlite3 session-file-store
```

## ✅ **Estado Actual:**
- 🟢 **Desarrollo**: SQLite funcionando sin errores
- 🟢 **Producción**: File Store listo para Linux
- 🟢 **Headers**: Error solucionado con verificaciones
- 🟢 **Persistencia**: Sesiones sobreviven reinicios