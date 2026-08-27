# Memorias Vivas

Sitio web del proyecto **EC 649 · Memorias Vivas** — preservación de la identidad local y patrimonio cultural de comunidades aledañas al Golfo Dulce en la Península de Osa — adscrito a la [Vicerrectoría de Acción Social](https://www.accionsocial.ucr.ac.cr/) de la [Universidad de Costa Rica](https://www.ucr.ac.cr/).

Aplicación **Vite + React** con interfaz en **Tailwind CSS**, escena **3D** con [React Three Fiber](https://docs.pmnd.rs/react-three-fiber), **mapa** con Mapbox y secciones de contenido curado. Código abierto: [github.com/iluna007/memoriasvivas](https://github.com/iluna007/memoriasvivas).

---

## Citar este repositorio

GitHub detecta el archivo [`CITATION.cff`](./CITATION.cff) en la raíz y muestra el botón **«Citar este repositorio»** (menú lateral del repositorio o pestaña al crear un release), con formatos APA, BibTeX y otros generados a partir de los metadatos.

1. **Cita básica (sin DOI)** — usa la salida que ofrezca GitHub a partir de `CITATION.cff`, o una referencia manual coherente con los autores y el título allí indicados.
2. **DOI con Zenodo** (recomendado para publicaciones académicas): enlaza el repositorio público a [Zenodo](https://zenodo.org/), crea un **release** en GitHub y deja que Zenodo asigne un **DOI** a esa versión. Luego puedes añadir en `CITATION.cff` el bloque `identifiers` con `type: doi` y el valor del DOI, y mencionar el DOI en esta sección del README.
3. **Repositorio público** — la integración con Zenodo y la cita automática de GitHub requieren que el código sea **público**.

La lista de personas del equipo del proyecto también está en `src/data/CMS/7_equipo.js`; si cambia el equipo, actualiza `CITATION.cff` para mantener la cita al día.

---

## Contenido principal

| Ruta | Descripción |
|------|-------------|
| `/` | **Constelaciones** — escena 3D interactiva: estrellas con billboards animados, red de proximidad entre nodos, fondo estelar, panel de controles (velocidad, amplitud, opacidad/brillo pulsantes, red, color de fondo, etc.) |
| `/sobre` | Texto del proyecto |
| `/comunidad` | Tarjetas de personas de la comunidad (datos en `src/data/comunidad.js`) |
| `/equipo` | Miembros del equipo (CMS `src/data/CMS/7_equipo.js`) |
| `/mapa` | Mapa Mapbox (requiere token; ver variables de entorno) |
| `/archivo` | Vista tipo archivo / ISAD sobre relatos y metadatos |
| `/contacto` | Formulario de contacto |

Navegación fija, **tema claro/oscuro** y selector de color de fondo (persistencia en `localStorage`). Pie de página con enlaces institucionales (UCR, Sede del Sur, Acción Social, Escuela de Filosofía, Escuela de Arquitectura), redes ([YouTube](https://www.youtube.com/@MemoriasVivasdelsur), [Instagram](https://www.instagram.com/memo.riasvivas/)), código abierto en GitHub y crédito de diseño.

---

## Requisitos

- [Node.js](https://nodejs.org/) **18+** (recomendado LTS)
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

---

## Estructura del código (resumen)

```
src/
  App.jsx              # Rutas, layout, tema y color de fondo
  Scene.jsx            # Escena 3D (estrellas, red, fondo)
  pages/               # Una vista por ruta
  components/          # Navbar, Footer, paneles, leyendas, etc.
  data/                # Datos y CMS en JS; adaptadores (p. ej. archivo ISAD)
  utils/               # Utilidades (p. ej. clases de tema para páginas)
```

Los textos y listas exportables suelen vivir en `src/data/` y `src/data/CMS/`.

---

## Controles en la vista Constelaciones

- **Ratón**: orbitar, zoom y paneo (OrbitControls).
- **Panel flotante** (icono de controles): velocidad del movimiento, distancia de la red de líneas, amplitud de flotación, tamaño del espacio, rotación sobre el eje propio, **oscilación de opacidad y brillo** de las estrellas, **pulso de opacidad de la red**, visibilidad del cubo delimitador y de la red, color de fondo de la escena.
- **Clic en una estrella**: abre el panel lateral con información asociada (cuando exista contenido).

---

## Despliegue

Cualquier hosting de sitios estáticos sirve la carpeta `dist/` tras `npm run build`. Para **Netlify** y el token Mapbox, sigue [NETLIFY.md](./NETLIFY.md).

---

## Más documentación

- [GIT_SETUP.md](./GIT_SETUP.md) — notas de configuración Git (opcional)

---

## Licencia y uso

El uso del nombre y marcas de la Universidad de Costa Rica debe ajustarse a las políticas institucionales. El código del repositorio se ofrece como **código abierto** para fines del proyecto; revisa los archivos del repositorio si se añade una licencia explícita (`LICENSE`).
