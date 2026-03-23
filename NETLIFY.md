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
