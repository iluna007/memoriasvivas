# Desplegar en Netlify (Mapbox)

El archivo `.env` **no se sube** al repositorio (está en `.gitignore`). En Netlify hay que definir la misma variable.

## Pasos

1. Netlify → tu sitio → **Site configuration** → **Environment variables**.
2. **Add a variable**:
   - **Key:** `VITE_MAPBOX_ACCESS_TOKEN`
   - **Value:** tu token público de Mapbox (empieza por `pk.`).
   - Ámbitos: al menos **Production** (y **Deploy previews** si quieres el mapa en previews).
3. **Deploys** → **Trigger deploy** → **Clear cache and deploy site** (o un push nuevo).

> Vite solo incluye variables que empiezan por `VITE_` en el build. Sin un nuevo deploy después de añadir la variable, el mapa seguirá sin token.

## Contador de visitas (pie de página)

El pie muestra un total almacenado con **Netlify Functions** y **Netlify Blobs** (`netlify/functions/visitor-count.mjs`). No requiere variables de entorno adicionales: al desplegar en Netlify, el contador se incrementa en cada carga de la aplicación (el cliente guarda el último valor en `sessionStorage` para no repetir peticiones al navegar dentro del sitio).

En **desarrollo local** (`npm run dev`) la función no existe y verás «—»; para probar el contador usa `netlify dev` desde la raíz del proyecto o revisa el sitio ya publicado.
