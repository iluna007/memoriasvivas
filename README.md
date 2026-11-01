# Memorias Vivas

Sitio web del proyecto **EC 649 · Memorias Vivas** — preservación de la identidad local y patrimonio cultural de comunidades aledañas al Golfo Dulce en la Península de Osa — adscrito a la [Vicerrectoría de Acción Social](https://www.accionsocial.ucr.ac.cr/) de la [Universidad de Costa Rica](https://www.ucr.ac.cr/).

Aplicación **Vite + React** con interfaz en **Tailwind CSS**, escena **3D** con [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), **mapa** con Mapbox y secciones de contenido curado. Código abierto: [github.com/iluna007/memoriasvivas](https://github.com/iluna007/memoriasvivas).

---

## Usar este proyecto como base

Este repositorio está pensado para poder reutilizarse: comunidades, cátedras o proyectos similares pueden clonarlo y adaptarlo para construir su propio archivo de memoria/identidad local, sin partir de cero.

Lo más fácil de personalizar:

- **Contenido**: casi todos los textos y listados editables viven en `src/data/CMS/` (un archivo por sección) y se combinan mediante un adaptador en `src/data/` — no hace falta tocar componentes para cambiar el contenido.
- **Textos institucionales**: `/sobre`, pie de página (`src/components/Footer.jsx`) y metadatos de `CITATION.cff`.
- **Identidad visual**: colores y tema en `tailwind.config.js` y `src/utils/pageThemeClasses.js`.
- **Mapa**: cambiá el estilo de Mapbox y las coordenadas iniciales en `src/pages/Mapa.jsx`, y los puntos/videos en `src/data/CMS/territorio.js` y `src/data/mapaVideosPlaylists.js`.

Ver la licencia del código y del contenido más abajo antes de reutilizarlo.

---

## Citar este repositorio

GitHub detecta el archivo [`CITATION.cff`](./CITATION.cff) en la raíz y muestra el botón **«Citar este repositorio»** (menú lateral del repositorio o pestaña al crear un release), con formatos APA, BibTeX y otros generados a partir de los metadatos.

1. **Cita básica (sin DOI)** — usa la salida que ofrezca GitHub a partir de `CITATION.cff`, o una referencia manual coherente con los autores y el título allí indicados.
2. **DOI con Zenodo** (recomendado para publicaciones académicas): enlaza el repositorio público a [Zenodo](https://zenodo.org/), crea un **release** en GitHub y deja que Zenodo asigne un **DOI** a esa versión. Luego puedes añadir en `CITATION.cff` el bloque `identifiers` con `type: doi` y el valor del DOI, y mencionar el DOI en esta sección del README.
3. **Repositorio público** — la integración con Zenodo y la cita automática de GitHub requieren que el código sea **público**.

La lista de personas del equipo del proyecto también está en `src/data/CMS/7_equipo.js`; si cambia el equipo, actualiza `CITATION.cff` para mantener la cita al día.

---

## Idioma

El sitio abre en **inglés**. Las rutas en inglés van bajo `/en` (la portada es `/en`). El español usa las mismas rutas sin prefijo (`/sobre`, `/mapa`, …).

El botón **ES** / **EN** de la barra cambia de idioma y recuerda la elección en este navegador. Si alguien ya eligió español, la próxima visita a `/` se queda en español.

Los textos de la interfaz están en `src/locales/es.json` y `src/locales/en.json`. El contenido del CMS sigue en español en `src/data/CMS/`; las traducciones al inglés se superponen desde `src/data/en/` para que una nueva exportación de la hoja no las borre.

## Contenido principal

| Ruta | Descripción |
|------|-------------|
| `/` y `/en` | Portada con el video y el logo. Al entrar se abre Constelaciones |
| `/constelaciones` | Escena 3D: estrellas, red de proximidad, fondo y panel de controles |
| `/sobre` | Texto del proyecto |
| `/comunidad` | Personas de la comunidad (`src/data/comunidad.js`) |
| `/equipo` | Equipo (`src/data/CMS/7_equipo.js`) |
| `/mapa` | Mapa Mapbox, con la capa del ferrocarril de la UFCO |
| `/diccionario` | Diccionario de conceptos |
| `/documentales` | Documentales destacados |
| `/activaciones` | Publicaciones y activaciones |
| `/pedagogias` | Material pedagógico |
| `/actividades` | Línea de tiempo de actividades |
| `/archivo` | Relatos y metadatos del archivo |
| `/contacto` | Contacto |

En inglés, cada ruta lleva el prefijo `/en` (por ejemplo `/en/mapa`).

En pantallas estrechas la barra pasa a un menú de hamburguesa. El tema claro/oscuro y el color de fondo se guardan en `localStorage`. El pie enlaza a la UCR, la Sede del Sur, Acción Social, la Escuela de Filosofía y la Escuela de Arquitectura, y a [YouTube](https://www.youtube.com/@MemoriasVivasdelsur) e [Instagram](https://www.instagram.com/memo.riasvivas/).

---

## Requisitos

- [Node.js](https://nodejs.org/) **20** (la misma versión que usa Netlify; 18 también sirve en local)
- npm (incluido con Node)

---

## Puesta en marcha

```bash
git clone https://github.com/iluna007/memoriasvivas.git
cd memoriasvivas
npm install
```

### Mapa (Mapbox)

1. Copia el ejemplo de entorno y añade tu [token de acceso público](https://account.mapbox.com/) (`pk.…`):

   ```bash
   cp .env.example .env
   ```

2. Edita `.env`:

   ```env
   VITE_MAPBOX_ACCESS_TOKEN=pk.tu_token_aqui
   ```

3. Arranca el servidor de desarrollo:

   ```bash
   npm run dev
   ```

4. Abre la URL que indique Vite (por defecto `http://localhost:5173`).

Sin token, la ruta **Mapa** muestra un aviso para configurar la variable; el resto del sitio funciona con normalidad.

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (Vite) |
| `npm run build` | Compilación de producción en `dist/` |
| `npm run preview` | Sirve la carpeta `dist/` para probar el build localmente |
| `npm run fetch:documentales` | Actualiza el listado del canal de YouTube en `src/data/documentalesYoutube.js` |

---

## Variables de entorno

| Variable | Obligatoria | Descripción |
|----------|-------------|-------------|
| `VITE_MAPBOX_ACCESS_TOKEN` | Solo para el mapa | Token público Mapbox (`pk.…`). Vite solo expone variables que empiezan por `VITE_`. |

Detalle para **Netlify**: ver [NETLIFY.md](./NETLIFY.md) (variable en el panel del sitio y nuevo deploy tras añadirla).

---

## Stack tecnológico

- [Vite](https://vitejs.dev/) 7
- [React 18](https://react.dev/)
- [React Router](https://reactrouter.com/) 7
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — escena 3D / WebGL
- [@react-three/drei](https://github.com/pmndrs/drei) — utilidades (`OrbitControls`, `Html`, `Billboard`, etc.)
- [Tailwind CSS](https://tailwindcss.com/) 3
- [Mapbox GL](https://www.mapbox.com/mapbox-gljs) + [react-map-gl](https://visgl.github.io/react-map-gl/) — mapa
- [i18next](https://www.i18next.com/) — español e inglés
- [GSAP](https://gsap.com/) — movimiento de la línea de tiempo y de la portada

---

## Estructura del código (resumen)

```
src/
  App.jsx              # Rutas, layout, tema y color de fondo
  Scene.jsx            # Escena 3D (estrellas, red, fondo)
  pages/               # Una vista por ruta
  components/          # Navbar, Footer, paneles, leyendas, etc.
  data/CMS/            # Exportación en español del CMS
  data/en/             # Traducciones al inglés de ese contenido
  locales/             # Textos de la interfaz (es.json, en.json)
  i18n/                # Idioma según la ruta
  utils/               # Utilidades (p. ej. clases de tema para páginas)
```

Los textos de interfaz viven en `src/locales/`. El contenido editable vive en `src/data/CMS/` y, en inglés, en `src/data/en/`. Cada sección se descarga cuando se abre, así la portada no carga el mapa ni la escena 3D.

---

## Controles en la vista Constelaciones

- **Ratón**: orbitar, zoom y paneo (OrbitControls).
- **Panel flotante** (icono de controles): velocidad del movimiento, distancia de la red de líneas, amplitud de flotación, tamaño del espacio, rotación sobre el eje propio, **oscilación de opacidad y brillo** de las estrellas, **pulso de opacidad de la red**, visibilidad del cubo delimitador y de la red, color de fondo de la escena.
- **Clic en una estrella**: abre el panel lateral con información asociada (cuando exista contenido).

---

## Despliegue

Cualquier hosting de sitios estáticos sirve la carpeta `dist/` tras `npm run build`. Para **Netlify** y el token Mapbox, sigue [NETLIFY.md](./NETLIFY.md).

---

## Licencia y uso

- **Código**: [MIT](./LICENSE) — podés clonar, modificar y reutilizar este repositorio como base para tu propio sitio o sistema de archivo/memoria comunitaria.
- **Contenido** (textos, datos del CMS, fotografías propias del proyecto): [CC BY-NC-SA 4.0](./LICENSE-CONTENT.md).

El uso del nombre y las marcas de la Universidad de Costa Rica debe ajustarse a las políticas institucionales.
