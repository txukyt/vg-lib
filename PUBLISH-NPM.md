# 📦 Guía para publicar en npm

## Paso 1: Crear cuenta en npm (si no la tienes)

1. Ve a https://www.npmjs.com/signup
2. Regístrate con tu email
3. **¡IMPORTANTE!** Verifica tu email (revisa la bandeja de entrada)

## Paso 2: Iniciar sesión desde la terminal

```bash
npm login
```

Te pedirá:
- **Username**: Tu nombre de usuario de npm
- **Password**: Tu contraseña (no verás lo que escribes, es normal)
- **Email**: Tu email registrado
- **OTP**: Si tienes 2FA activado, te pedirá un código

## Paso 3: Verificar que estás logueado

```bash
npm whoami
```

Debería mostrar tu nombre de usuario.

## Paso 4: Verificar el nombre del paquete

Tu paquete se llama `@txukyt/j38-lib` (con scope).

- Verifica que el nombre esté disponible: https://www.npmjs.com/package/@txukyt/j38-lib
- Si no existe, puedes usarlo
- Si existe, necesitarás cambiar el nombre en `package.json`

## Paso 5: Verificar que el build está listo

```bash
npm run build:prod
```

Esto genera los archivos en `dist/` que se publicarán.

## Paso 6: Publicar el paquete

Como tu paquete usa un scope (`@dmorapedregosa/`), necesitas especificar que sea público:

```bash
npm publish --access public
```

**Importante**: 
- El script `prepublishOnly` en tu `package.json` ejecutará automáticamente `build:prod` antes de publicar
- Solo se publicarán los archivos en `dist/` (definido en `files` del package.json)

## Paso 7: Verificar que se publicó

1. Ve a: https://www.npmjs.com/package/@txukyt/j38-lib
2. Deberías ver tu paquete publicado con la versión `1.2.3`

## Actualizar una versión existente

Cuando quieras publicar una nueva versión:

1. **Actualiza la versión en `package.json`**:
   - `1.2.3` → `1.2.4` (patch: correcciones)
   - `1.2.3` → `1.3.0` (minor: nuevas funcionalidades)
   - `1.2.3` → `2.0.0` (major: cambios incompatibles)

   O usa:
   ```bash
   npm version patch   # 1.2.3 → 1.2.4
   npm version minor   # 1.2.3 → 1.3.0
   npm version major   # 1.2.3 → 2.0.0
   ```

2. **Publica de nuevo**:
   ```bash
   npm publish --access public
   ```

## Solución de problemas

### Error: "You must verify your email"
- Ve a npmjs.com y verifica tu email

### Error: "Package name already exists"
- Cambia el nombre en `package.json` o usa un scope diferente

### Error: "You do not have permission to publish"
- Asegúrate de estar logueado con `npm login`
- Verifica que eres el dueño del scope `@dmorapedregosa`

### Error: "Invalid package name"
- El nombre debe seguir las convenciones de npm
- No puede tener mayúsculas ni espacios

## Instalar tu paquete publicado

Una vez publicado, otros pueden instalarlo con:

```bash
npm install @txukyt/j38-lib
```

## Automatizar con GitHub Actions

Ya tienes configurado el workflow `.github/workflows/cd.yml` que publicará automáticamente cuando crees un tag `v1.2.3`.

1. Crea un secret en GitHub:
   - Settings → Secrets and variables → Actions
   - Añade `NPM_TOKEN` con tu token de npm

2. Crea un tag:
   ```bash
   git tag v1.2.3
   git push origin v1.2.3
   ```

3. GitHub Actions publicará automáticamente en npm.
