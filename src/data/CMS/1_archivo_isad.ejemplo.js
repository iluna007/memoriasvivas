/**
 * Ejemplo de fila en convención ISAD (AtoM 2.6) + extensiones Memorias.
 * No se importa desde `1_archivo.js`; sirve como plantilla al exportar CSV→JSON.
 *
 * Plantillas oficiales: https://wiki.accesstomemory.org/Resources/CSV_templates
 *
 * Para usar: copia objetos como este al array en `1_archivo.js` (sin la clave `título`;
 * el adaptador las reconocerá como ISAD) o importa y concatena con `rawArchivo`.
 */
const ejemploIsad = [
  {
    legacyId: '9001',
    identifier: 'V-EJEMPLO-ISAD',
    title: 'Título ISAD de ejemplo (sustituir)',
    levelOfDescription: 'Item',
    language: 'es',
    digitalObjectURI: 'https://youtu.be/ScMzIvxBSi4',
    eventStartDates: '2025-01-15',
    eventActors: 'Persona entrevista|Cámara|Montaje|Productora general',
    memoriasIdsConceptos: 'C1, C3',
    memoriasDuracion: '00:10:00',
    memoriasConsentimiento: 'firmado',
    memoriasIdsLugares: 'L01',
    memoriasIdsPersonas: 'P01',
    memoriasIdsEmociones: 'E01',
    memoriasIdsPracticas: 'PR01'
  }
]

export default ejemploIsad
