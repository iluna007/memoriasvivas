_assets-inbox — candidatos de imagen (solo local)

Esta carpeta NO se publica en Netlify. Sirve para guardar fotos y
materiales en bruto mientras se elige qué va a la web.

Subcarpetas sugeridas:
  equipo/         Retratos y fotos de miembros del proyecto
  documentales/   Posters, stills, capturas
  comunidad/      Personas / entidades entrevistadas
  territorio/     Lugares, paisajes, mapas de apoyo
  branding/       Variantes de logo y piezas institucionales

Flujo:
  1. Dejar aquí todo lo que llegue (JPG, PNG, HEIC, etc.).
  2. Elegir, convertir a JPG/WebP si hace falta, y renombrar con
     slug corto sin espacios (ej. adrian-vergara-heidke-1.jpeg).
  3. Copiar SOLO las elegidas a public/<tema>/ (eso sí va al repo).

No poner candidatos dentro de public/ — Vite los sirve y pueden
subirse por error al repositorio.

Las imágenes de esta carpeta están en .gitignore; este README sí
queda versionado para marcar la ubicación en el proyecto.
