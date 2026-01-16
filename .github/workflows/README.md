# CI/CD - Integración y Despliegue Continuo

## ¿Qué es CI/CD?

**CI/CD** significa **Continuous Integration / Continuous Deployment** (Integración y Despliegue Continuo).

### CI (Continuous Integration)
- Se ejecuta **automáticamente** cada vez que haces push o creas un Pull Request
- Verifica que el código:
  - ✅ Pasa el linter (ESLint)
  - ✅ Compila correctamente (build)
  - ✅ Genera la documentación sin errores
- Si algo falla, te avisa **antes** de que se mezcle el código

### CD (Continuous Deployment)
- Se ejecuta cuando el código pasa a `main` o se crea un tag de versión
- Puede:
  - 📦 Publicar automáticamente en npm
  - 🚀 Desplegar automáticamente a servidores
  - 🏷️ Crear releases en GitHub

## Archivos creados

### `.github/workflows/ci.yml`
**Integración Continua** - Se ejecuta en cada push/PR:
- Instala dependencias
- Ejecuta el linter
- Compila el proyecto
- Genera documentación
- Sube los archivos compilados como artifacts

### `.github/workflows/cd.yml`
**Despliegue Continuo** - Se ejecuta en producción:
- Publica en npm cuando se crea un tag `v*`
- Puede desplegar automáticamente a servidores

## Beneficios

1. **Detección temprana de errores**: Si el código no compila o tiene errores de linting, lo sabes inmediatamente
2. **Confianza**: Sabes que el código en `main` siempre compila y funciona
3. **Automatización**: No necesitas recordar ejecutar builds manualmente
4. **Historial**: GitHub guarda un historial de todos los builds y sus resultados
5. **Colaboración**: Los PRs muestran si el código pasa todas las verificaciones

## Cómo funciona

1. Haces `git push` o creas un Pull Request
2. GitHub Actions detecta el cambio
3. Ejecuta el workflow automáticamente
4. Te muestra el resultado (✅ éxito o ❌ error)
5. Si todo está bien, puedes hacer merge con confianza

## Probar que funciona

### Opción 1: Workflow de prueba simple
He creado un workflow de prueba (`test.yml`) que puedes ejecutar manualmente:

1. Ve a tu repositorio en GitHub
2. Pestaña **"Actions"**
3. Selecciona **"Test Workflow"** en el menú lateral
4. Haz clic en **"Run workflow"** → **"Run workflow"**
5. Verás que se ejecuta y muestra información básica del proyecto

### Opción 2: Hacer un push
Simplemente haz un commit y push:
```bash
git add .
git commit -m "test: verificar GitHub Actions"
git push
```

Luego ve a la pestaña "Actions" en GitHub para ver los workflows ejecutándose.

## Ver los resultados

- Ve a la pestaña **"Actions"** en tu repositorio de GitHub
- Verás todos los workflows ejecutados
- Puedes ver logs detallados de cada paso

## Configuración necesaria

### Para publicar en npm (opcional):
1. Ve a tu repositorio en GitHub → Settings → Secrets and variables → Actions
2. Añade un secret llamado `NPM_TOKEN` con tu token de npm
3. El workflow se ejecutará automáticamente cuando crees un tag `v1.2.3`

### Para deploy automático (opcional):
1. Configura los secrets necesarios (SSH keys, hosts, etc.)
2. Descomenta y ajusta la sección de deploy en `cd.yml`

## Personalización

Puedes modificar estos workflows para:
- Añadir tests cuando los implementes
- Añadir análisis de código (SonarQube, CodeClimate)
- Añadir notificaciones (Slack, email)
- Añadir más entornos de deploy
