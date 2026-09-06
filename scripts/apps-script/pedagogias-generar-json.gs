/**
 * Memorias Vivas — Generador de JSON/JS para /pedagogias
 *
 * Instalación (mismo proyecto Apps Script que Comunidad, o pegar junto a él):
 * 1. Abre el Google Sheet "CMS Memorias vivas".
 * 2. Extensiones > Apps Script.
 * 3. Crea un archivo nuevo (p. ej. Pedagogias.gs) y pega todo este archivo,
 *    O añade estas funciones al proyecto existente sin borrar Comunidad.
 * 4. Guarda y recarga la pestaña del Sheet (F5).
 *    Debe aparecer el menú "Pedagogías" junto a "Comunidad" (si ambos están en el proyecto).
 * 5. Pedagogías > Generar JSON. Autoriza la primera vez si Google lo pide.
 *
 * Qué hace:
 * - Lee la pestaña SHEET_NAME (ajusta el nombre si tu pestaña se llama distinto).
 * - Espera estas columnas en la fila 1 (busca por nombre de encabezado):
 *   id_material, categoria, titulo, descripcion, formato, archivo_url, foto_portada, fecha, orden
 * - Arma el mismo array que src/data/CMS/9_pedagogias.js y lo muestra listo para copiar.
 */

const PEDAGOGIAS_SHEET_NAME = '09_Pedagogias';

const PED_COLS = [
  'id_material',
  'categoria',
  'titulo',
  'descripcion',
  'formato',
  'archivo_url',
  'foto_portada',
  'fecha',
  'orden',
];

/**
 * El menú "Pedagogías" lo registra onOpen() en comunidad-generar-json.gs
 * (mismo proyecto Apps Script). Si solo usas este archivo, descomenta:
 *
 * function onOpen() {
 *   SpreadsheetApp.getUi()
 *     .createMenu('Pedagogías')
 *     .addItem('Generar JSON', 'generarJsonPedagogias')
 *     .addToUi();
 * }
 */

function generarJsonPedagogias() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PEDAGOGIAS_SHEET_NAME);
  if (!sheet) {
    SpreadsheetApp.getUi().alert(
      'No encontré una pestaña llamada "' + PEDAGOGIAS_SHEET_NAME + '". ' +
      'Edita PEDAGOGIAS_SHEET_NAME al inicio del script con el nombre exacto de tu pestaña.'
    );
    return;
  }

  const values = sheet.getDataRange().getValues();
  const headers = values[0].map((h) => String(h).trim());

  const idx = {};
  for (let c = 0; c < PED_COLS.length; c += 1) {
    const name = PED_COLS[c];
    idx[name] = headers.indexOf(name);
  }

  const missing = PED_COLS.filter((name) => idx[name] === -1);
  if (missing.length) {
    SpreadsheetApp.getUi().alert(
      'No encontré estas columnas en la fila 1: ' + missing.join(', ') + '. ' +
      'Revisa que los encabezados coincidan exactamente.'
    );
    return;
  }

  const entries = [];
  for (let i = 1; i < values.length; i += 1) {
    const row = values[i];
    const id = cellStr(row[idx.id_material]);
    const titulo = cellStr(row[idx.titulo]);
    if (!id && !titulo) continue;

    const ordenRaw = row[idx.orden];
    let orden = 0;
    if (ordenRaw !== '' && ordenRaw !== null && ordenRaw !== undefined) {
      const n = Number(ordenRaw);
      orden = Number.isFinite(n) ? n : 0;
    }

    entries.push({
      id_material: id || null,
      categoria: cellStr(row[idx.categoria]) || null,
      titulo: titulo || null,
      descripcion: cellStr(row[idx.descripcion]) || '',
      formato: cellStr(row[idx.formato]) || null,
      archivo_url: cellStr(row[idx.archivo_url]) || null,
      foto_portada: cellStr(row[idx.foto_portada]) || null,
      fecha: cellStr(row[idx.fecha]) || null,
      orden: orden,
    });
  }

  const json = JSON.stringify(entries, null, 2);
  const jsModule =
    '// Generado desde: Pedagogías (pestaña ' + PEDAGOGIAS_SHEET_NAME + ' del CMS).\n' +
    'const pedagogias = ' + json + '\n\n' +
    'export default pedagogias\n';

  mostrarJsonPedagogias(jsModule, entries.length);
}

function cellStr(value) {
  if (value === null || value === undefined) return '';
  if (Object.prototype.toString.call(value) === '[object Date]') {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  }
  return String(value).trim();
}

function mostrarJsonPedagogias(text, total) {
  const safe = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const html = HtmlService.createHtmlOutput(
    '<p style="font-family:sans-serif;font-size:13px;margin:0 0 8px">' +
    total + ' materiales. Copia el contenido (ya está seleccionado) y reemplaza ' +
    '<code>src/data/CMS/9_pedagogias.js</code>:</p>' +
    '<textarea id="out" style="width:100%;height:420px;font-family:monospace;font-size:12px" readonly>' +
    safe +
    '</textarea>' +
    '<script>' +
    'var ta = document.getElementById("out");' +
    'ta.focus();' +
    'ta.select();' +
    '</script>'
  )
    .setWidth(640)
    .setHeight(520);

  SpreadsheetApp.getUi().showModalDialog(html, 'JS — Pedagogías Memorias Vivas');
}
