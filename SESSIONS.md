# 🔐 Sistema de Sesiones Persistentes

## ¿Qué cambió?

Antes: Las sesiones se guardaban en **memoria** y se perdían al reiniciar el servidor.
Ahora: Las sesiones se guardan en **archivos** en la carpeta `./sessions/` y persisten entre reinicios.

## 📂 Estructura de Archivos de Sesión

```
sessions/
├── [sessionId1].json  # Datos de sesión del usuario 1
├── [sessionId2].json  # Datos de sesión del usuario 2
└── ...
```

## ⚙️ Configuración Actual

```javascript
store: new FileStoreSession({
  path: './sessions',      // Carpeta donde se guardan
  ttl: 86400,             // 24 horas de duración
  retries: 0,             // No reintentar si hay error
  logFn: development ? console.log : () => {} // Log solo en desarrollo
})
```

## 🔄 Comportamiento

### ✅ **Ahora FUNCIONA:**
- Usuario se loguea → Sesión se guarda en archivo
- Servidor se reinicia → Sesión persiste
- Usuario sigue logueado → No necesita loguearse de nuevo

### ⏰ **Expiración:**
- Las sesiones expiran después de 24 horas
- Los archivos de sesión se limpian automáticamente

## 🛡️ Seguridad

- Carpeta `sessions/` está en `.gitignore` (no se sube al repositorio)
- Archivos de sesión son temporales y se limpian automáticamente
- Cookies configuradas con `httpOnly` y `secure` en producción

## 🧹 Mantenimiento

Los archivos de sesión expirados se eliminan automáticamente. Si necesitas limpiar manualmente:

```bash
# Eliminar todas las sesiones (forzar re-login de todos los usuarios)
rm -rf sessions/*
```

## 📊 Monitoreo

En modo desarrollo, puedes ver los logs de sesiones en la consola.
En producción, los logs están desactivados para mejor performance.

## 🚀 Alternativas Futuras

Si la aplicación crece, considera estas alternativas:
- **Redis**: Para aplicaciones con múltiples servidores
- **MongoDB**: Si ya usas MongoDB para otros datos
- **PostgreSQL**: Con `connect-pg-simple`

## 🔧 Problemas Comunes

**Error: "Cannot find module 'session-file-store'"**
```bash
npm install session-file-store
```

**Sesiones no persisten:**
- Verificar que existe la carpeta `sessions/`
- Verificar permisos de escritura en la carpeta