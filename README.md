# Memorias Vivas

Proyecto **Vite + React (JS) + Three.js + Tailwind** con una escena 3D para explorar geometrías.

## Contenido de la escena

- **Esfera roja** a la izquierda (con ligera rotación automática)
- **Cubo blanco** a la derecha (rotación automática)
- **Fondo negro** (espacio)
- **OrbitControls**: puedes rotar, hacer zoom y desplazarte con el ratón para explorar la escena

## Cómo ejecutar

```bash
npm install
npm run dev
```

Abre en el navegador la URL que muestre Vite (normalmente `http://localhost:5173`).

## Controles

- **Clic izquierdo + arrastrar**: rotar la cámara alrededor de la escena
- **Clic derecho + arrastrar** (o scroll): acercar/alejar (zoom)
- **Clic central + arrastrar**: desplazar (pan) la vista

## Stack

- [Vite](https://vitejs.dev/)
- [React 18](https://react.dev/)
- [Three.js](https://threejs.org/) vía [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [@react-three/drei](https://github.com/pmndrs/drei) (OrbitControls, etc.)
- [Tailwind CSS](https://tailwindcss.com/)
