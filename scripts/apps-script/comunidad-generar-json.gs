/**
 * Memorias Vivas — Generador de JSON para /comunidad
 *
 * Instalación:
 * 1. Abre el Google Sheet "CMS Memorias vivas".
 * 2. Extensiones > Apps Script.
 * 3. Borra el contenido de Code.gs y pega todo este archivo.
 * 4. Guarda (ícono de disco o Ctrl+S) y ponle un nombre al proyecto si te lo pide.
 * 5. Vuelve al Sheet y recarga la pestaña del navegador (F5).
 *    Va a aparecer un menú nuevo "Comunidad" junto a Archivo/Edición/etc.
 * 6. Comunidad > Generar JSON. La primera vez Google te va a pedir autorizar
 *    el script (es tuyo, dale "Avanzado" > "Ir a [nombre del proyecto]" si
 *    sale la pantalla de "app no verificada" — es normal para scripts propios).
 *
 * Qué hace:
 * - Lee la hoja indicada en SHEET_NAME (ajusta el nombre si tu pestaña se
 *   llama distinto a la tabla que me pasaste).
 * - Espera estas columnas en la fila 1 (el orden no importa, los busca por
 *   nombre de encabezado): "Entidad", "Entidad / Persona", "Código", "Lugar".
 * - Arma el mismo JSON que ya está en el repo (src/data/CMS/8_comunidad_entidades.json):
 *   [{ "tipo": "...", "nombre": "...", "codigo": "...", "lugar": "..." | null }, ...]
 * - Ordena por lugar (T1, T2, T3... y por último los que no tienen lugar) y
 *   alfabéticamente por nombre dentro de cada lugar.
 * - Te muestra el JSON en una ventana con un textarea ya seleccionado, listo
 *   para copiar con Ctrl+C y pegarlo donde lo necesites (o pasármelo a mí).
 */

const SHEET_NAME = '00_Entidades'; // <-- nombre real de la pestaña en el CMS

const COL_TIPO = 'Entidad';
const COL_NOMBRE = 'Entidad / Persona';
const COL_CODIGO = 'Código';
const COL_LUGAR = 'Lugar';

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Comunidad')
    .addItem('Generar JSON', 'generarJsonComunidad')
    .addToUi();
  // Menú de Pedagogías (requiere pedagogias-generar-json.gs en el mismo proyecto)
  ui.createMenu('Pedagogías')
    .addItem('Generar JSON', 'generarJsonPedagogias')
    .addToUi();
}

function generarJsonComunidad() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert(
      'No encontré una pestaña llamada "' + SHEET_NAME + '". ' +
      'Edita la constante SHEET_NAME al inicio del script con el nombre exacto de tu pestaña.'
    );
    return;
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());

  const idxTipo = headers.indexOf(COL_TIPO);
  const idxNombre = headers.indexOf(COL_NOMBRE);
  const idxCodigo = headers.indexOf(COL_CODIGO);
  const idxLugar = headers.indexOf(COL_LUGAR);

  if (idxTipo === -1 || idxNombre === -1 || idxCodigo === -1 || idxLugar === -1) {
    SpreadsheetApp.getUi().alert(
      'No encontré alguna de estas columnas en la fila 1: "' + COL_TIPO + '", "' +
      COL_NOMBRE + '", "' + COL_CODIGO + '", "' + COL_LUGAR + '". ' +
      'Revisa que los encabezados coincidan exactamente (mayúsculas/acentos incluidos).'
    );
    return;
  }

  const entries = [];
  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    const nombre = String(row[idxNombre] || '').trim();
    if (!nombre) continue; // salta filas vacías

    const tipo = String(row[idxTipo] || '').trim();
    const codigo = String(row[idxCodigo] || '').trim();
    const lugarRaw = String(row[idxLugar] || '').trim();

    entries.push({
      tipo: tipo || null,
      nombre: nombre,
      codigo: codigo || null,
      lugar: lugarRaw || null,
    });
  }

  entries.sort((a, b) => {
    const la = lugarOrden(a.lugar);
    const lb = lugarOrden(b.lugar);
    if (la[0] !== lb[0]) return la[0] - lb[0];
    if (la[1] !== lb[1]) return la[1] - lb[1];
    return a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' });
  });

  const json = JSON.stringify(entries, null, 2);
  mostrarJson(json, entries.length);
}

/** Orden: T1..T9 en orden numérico primero, sin lugar (null) al final. */
function lugarOrden(lugar) {
  if (!lugar) return [1, 0];
  const m = /^T(\d+)/.exec(lugar);
  return [0, m ? parseInt(m[1], 10) : 99];
}

function mostrarJson(json, total) {
  const safeJson = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const html = HtmlService.createHtmlOutput(
    '<p style="font-family:sans-serif;font-size:13px;margin:0 0 8px">' +
    total + ' entidades. Copia el JSON de abajo (ya está seleccionado, Ctrl+C / Cmd+C):' +
    '</p>' +
    '<textarea id="out" style="width:100%;height:420px;font-family:monospace;font-size:12px" readonly>' +
    safeJson +
    '</textarea>' +
    '<script>' +
    'var ta = document.getElementById("out");' +
    'ta.focus();' +
    'ta.select();' +
    '</script>'
  )
    .setWidth(600)
    .setHeight(520);

  SpreadsheetApp.getUi().showModalDialog(html, 'JSON — Comunidad Memorias Vivas');
}
