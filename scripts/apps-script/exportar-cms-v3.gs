/**
 * Memorias Vivas: exportar pestañas del CMS a archivos que el sitio pueda usar
 * Version 3
 *
 * Cambios respecto a la version 2:
 *  - Nueva pestaña Sobre -> 10_sobre.js
 *  - Columnas privadas que NUNCA se exportan (Equipo: Teléfono y Correo).
 *    La v2 las exportaba y terminaban en el repositorio público.
 *  - Fechas con hora conservan la hora (Medios.fecha_captura)
 *  - Celdas de tipo hora/duración (00:41:33) se exportan como HH:mm:ss
 *    y no como "1899-12-30"
 *  - Al final deja en el registro de ejecución un resumen con el enlace de
 *    la carpeta y de cada archivo, y muestra una ventana con enlaces clicables
 *
 * Cambios de la version 2:
 *  - Actividades, Medios y Pedagogias con configuracion explicita
 *  - Lista de pestañas omitidas (Transcripciones)
 *  - Descarta filas totalmente vacias y columnas sin titulo
 *  - Avisa de titulos de columna duplicados
 *  - Fechas segun la zona horaria del Sheet (sin correr un dia)
 *  - Actualiza el archivo existente en lugar de borrarlo (conserva historial)
 *  - Validacion de integridad entre Actividades y Medios
 *  - No filtra por "visible": el filtro lo hace el sitio
 */

const CONFIG_PESTAÑAS = {
  "Archivo":      { fileName: "1_archivo.js",     varName: "archivo",     format: "js", keyMap: {} },
  "Conceptos":    { fileName: "6_conceptos.js",   varName: "conceptos",   format: "js", keyMap: {} },
  "Equipo": {
    fileName: "7_equipo.js",
    varName: "equipo",
    format: "js",
    keyMap: {
      "Nombre": "nombre",
      "Apellidos": "apellidos",
      "Cargo": "cargo",
      "Escuela": "escuela",
      "Sede": "sede",
      "Bio (150 palabras)": "bio",
      "Contribuciones": "contribuciones",
      "Fotos": "fotos",
    },
  },
  "00_Taxonomia": {
    fileName: "8_comunidad_entidades.json",
    format: "json",
    keyMap: {
      "Entidad": "tipo",
      "Entidad / Persona": "nombre",
      "Código": "codigo",
      "Lugar": "lugar",
    },
  },
  "Territorio":   { fileName: "territorio.js",    varName: "territorio",  format: "js", keyMap: {} },
  "Citas":        { fileName: "citas.js",         varName: "citas",       format: "js", keyMap: {} },
  "Pedagogias":   { fileName: "9_pedagogias.js",  varName: "pedagogias",  format: "js", keyMap: {} },
  "Actividades":  { fileName: "actividades.js",   varName: "actividades", format: "js", keyMap: {} },
  "Medios":       { fileName: "medios.js",        varName: "medios",      format: "js", keyMap: {} },
  "Sobre":        { fileName: "10_sobre.js",      varName: "sobre",       format: "js", keyMap: {} },
};

// Columnas que nunca salen de la hoja (datos personales). Se comparan con el
// titulo original de la columna, sin espacios y sin distinguir mayusculas.
const COLUMNAS_PRIVADAS = {
  "Equipo": ["Teléfono", "Telefono", "Correo"],
};

// Pestañas que NO se exportan (privacidad o peso). Comparacion sin distinguir mayusculas.
const PESTAÑAS_OMITIDAS = ["Transcripciones"];

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Memorias Vivas")
    .addItem("Exportar CMS", "exportarPestañasComoJS")
    .addItem("Solo validar (sin exportar)", "validarCMS")
    .addToUi();
}

function nombreDeVariableSeguro(sheetName) {
  let v = sheetName
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  if (/^[0-9]/.test(v)) v = "_" + v;
  return v;
}

/** Fecha sola, fecha con hora, o duración/hora suelta (Sheets la guarda como 30/12/1899). */
function formatearFecha(d, tz) {
  if (Number(Utilities.formatDate(d, tz, "yyyy")) < 1900) return Utilities.formatDate(d, tz, "HH:mm:ss");
  const hora = Utilities.formatDate(d, tz, "HH:mm:ss");
  return hora === "00:00:00"
    ? Utilities.formatDate(d, tz, "yyyy-MM-dd")
    : Utilities.formatDate(d, tz, "yyyy-MM-dd HH:mm:ss");
}

/** Lee una pestaña y devuelve { headers, objetos, avisos }. */
function leerPestaña(sheet, keyMap, tz) {
  const name = sheet.getName();
  const data = sheet.getDataRange().getValues();
  const avisos = [];
  if (data.length < 2) return { headers: [], objetos: [], avisos: avisos };

  const headersRaw = data[0].map((h) => String(h).trim());
  const privadas = (COLUMNAS_PRIVADAS[name] || []).map((p) => p.toLowerCase());
  const headers = headersRaw.map((h) => (privadas.indexOf(h.toLowerCase()) !== -1 ? "" : keyMap[h] || h));

  // Columnas validas: con titulo y sin repetir
  const vistos = {};
  const columnas = [];
  headers.forEach((h, i) => {
    if (!h) return;
    if (vistos[h] !== undefined) {
      avisos.push(name + ": titulo de columna repetido '" + h + "' (se ignora la columna " + (i + 1) + ")");
      return;
    }
    vistos[h] = i;
    columnas.push({ key: h, idx: i });
  });

  const objetos = [];
  data.slice(1).forEach((row) => {
    const obj = {};
    let tieneDatos = false;
    columnas.forEach((c) => {
      let val = row[c.idx];
      if (val instanceof Date) val = formatearFecha(val, tz);
      if (typeof val === "string") val = val.trim();
      if (val === "") val = null;
      if (val !== null) tieneDatos = true;
      obj[c.key] = val;
    });
    if (tieneDatos) objetos.push(obj);
  });

  return { headers: columnas.map((c) => c.key), objetos: objetos, avisos: avisos };
}

/** Revisa ids duplicados y referencias rotas entre Actividades y Medios. */
function validarIntegridad(porPestaña) {
  const problemas = [];
  const acts = porPestaña["Actividades"];
  const meds = porPestaña["Medios"];

  function duplicados(objs, campo, etiqueta) {
    const cuenta = {};
    objs.forEach((o) => { if (o[campo]) cuenta[o[campo]] = (cuenta[o[campo]] || 0) + 1; });
    Object.keys(cuenta).forEach((k) => {
      if (cuenta[k] > 1) problemas.push(etiqueta + ": id repetido " + k + " (" + cuenta[k] + " veces)");
    });
  }

  if (acts) {
    duplicados(acts, "id_actividades", "Actividades");
    const idsAct = {};
    acts.forEach((a) => { if (a.id_actividades) idsAct[a.id_actividades] = true; });
    acts.forEach((a) => {
      if (a.id_padre && !idsAct[a.id_padre]) {
        problemas.push("Actividades " + a.id_actividades + ": id_padre '" + a.id_padre + "' no existe");
      }
      if (a.id_padre && a.id_padre === a.id_actividades) {
        problemas.push("Actividades " + a.id_actividades + ": es su propio padre");
      }
    });
  }

  if (meds) {
    duplicados(meds, "id_medio", "Medios");
    const idsMed = {};
    meds.forEach((m) => { if (m.id_medio) idsMed[m.id_medio] = true; });

    if (acts) {
      const idsAct = {};
      acts.forEach((a) => { if (a.id_actividades) idsAct[a.id_actividades] = true; });
      meds.forEach((m) => {
        if (m.id_actividades && !idsAct[m.id_actividades]) {
          problemas.push("Medios " + m.id_medio + ": id_actividades '" + m.id_actividades + "' no existe");
        }
      });
      acts.forEach((a) => {
        if (a.foto_portada && !idsMed[a.foto_portada]) {
          problemas.push("Actividades " + a.id_actividades + ": foto_portada '" + a.foto_portada + "' no existe en Medios");
        }
      });
    }
  } else if (acts) {
    const conPortada = acts.filter((a) => a.foto_portada).length;
    if (conPortada) {
      problemas.push("Hay " + conPortada + " actividades con foto_portada pero no existe la pestaña Medios");
    }
  }
  const sobre = porPestaña["Sobre"];
  if (sobre) {
    const tipos = ["imagen", "titulo", "parrafo", "firma"];
    duplicados(sobre, "id_bloque", "Sobre");
    sobre.forEach((b) => {
      if (tipos.indexOf(b.tipo) === -1) problemas.push("Sobre " + b.id_bloque + ": tipo '" + b.tipo + "' no reconocido");
      if (b.tipo !== "imagen" && !b.texto) problemas.push("Sobre " + b.id_bloque + ": sin texto");
    });
  }
  return problemas;
}

function cargarTodas(ss) {
  const tz = ss.getSpreadsheetTimeZone();
  const omitidas = PESTAÑAS_OMITIDAS.map((n) => n.toLowerCase());
  const porPestaña = {};
  const detalle = [];
  const avisos = [];

  ss.getSheets().forEach((sheet) => {
    const name = sheet.getName();
    if (omitidas.indexOf(name.toLowerCase()) !== -1) {
      detalle.push({ name: name, omitida: true });
      return;
    }
    const config = CONFIG_PESTAÑAS[name] || null;
    const r = leerPestaña(sheet, config ? config.keyMap : {}, tz);
    r.avisos.forEach((a) => avisos.push(a));
    if (r.objetos.length === 0) {
      detalle.push({ name: name, vacia: true });
      return;
    }
    porPestaña[name] = r.objetos;
    detalle.push({ name: name, config: config, objetos: r.objetos });
  });

  return { porPestaña: porPestaña, detalle: detalle, avisos: avisos };
}

function validarCMS() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const t = cargarTodas(ss);
  const problemas = t.avisos.concat(validarIntegridad(t.porPestaña));
  const msg = problemas.length
    ? "⚠️ " + problemas.length + " problema(s):\n\n" + problemas.slice(0, 30).map((p) => "• " + p).join("\n") +
      (problemas.length > 30 ? "\n... y " + (problemas.length - 30) + " mas (ver registro)" : "")
    : "✅ Sin problemas de integridad";
  problemas.forEach((p) => Logger.log("⚠️ " + p));
  SpreadsheetApp.getUi().alert(msg);
}

function exportarPestañasComoJS() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const spreadsheetFile = DriveApp.getFileById(ss.getId());
  const folder = spreadsheetFile.getParents().next();
  const folderName = folder.getName();

  Logger.log("📁 Carpeta destino: " + folderName + " | " + folder.getUrl());

  const t = cargarTodas(ss);
  const problemas = t.avisos.concat(validarIntegridad(t.porPestaña));
  const creados = [];
  const omitidas = [];
  const vacias = [];

  t.detalle.forEach((d) => {
    if (d.omitida) { omitidas.push(d.name); return; }
    if (d.vacia) { vacias.push(d.name); return; }

    const config = d.config;
    const fileName = config ? config.fileName : nombreDeVariableSeguro(d.name) + ".js";
    const format = config ? config.format : "js";

    let fileContent;
    if (format === "json") {
      fileContent = JSON.stringify(d.objetos, null, 2) + "\n";
    } else {
      const vName = config && config.varName ? config.varName : nombreDeVariableSeguro(d.name);
      fileContent =
        `// Generado automáticamente desde: ${d.name}\n` +
        `// Archivo: CMS Memorias vivas | ${new Date().toLocaleDateString("es-CR")}\n\n` +
        `const ${vName} = ${JSON.stringify(d.objetos, null, 2)};\n\n` +
        `export default ${vName};\n`;
    }

    // Actualizar el existente (conserva historial); borrar copias sobrantes
    const existing = folder.getFilesByName(fileName);
    let file = null;
    while (existing.hasNext()) {
      const f = existing.next();
      if (!file) file = f; else f.setTrashed(true);
    }
    if (file) file.setContent(fileContent);
    else file = folder.createFile(fileName, fileContent, MimeType.PLAIN_TEXT);

    Logger.log("✅ " + fileName + " | registros: " + d.objetos.length + " | " + file.getUrl());
    creados.push({ nombre: fileName, n: d.objetos.length, sinMapeo: !config, url: file.getUrl() });
  });

  Logger.log("🎉 EXPORTACIÓN COMPLETA: " + creados.length + " archivos");
  Logger.log("──────── ENLACES ────────");
  Logger.log("📁 Carpeta: " + folderName + " → " + folder.getUrl());
  creados.forEach((c) => Logger.log("📄 " + c.nombre + " (" + c.n + ") → " + c.url));
  Logger.log("────────────────────────");
  problemas.forEach((p) => Logger.log("⚠️ " + p));

  const sinMapeo = creados.filter((c) => c.sinMapeo).map((c) => c.nombre);
  let msg =
    "✅ Exportación completa\n\n" +
    creados.map((f) => "• " + f.nombre + " (" + f.n + ")" + (f.sinMapeo ? " SIN MAPEO" : "")).join("\n") +
    "\n\nUbicación: " + folderName;
  if (omitidas.length) msg += "\n\nOmitidas a propósito: " + omitidas.join(", ");
  if (vacias.length) msg += "\nVacías: " + vacias.join(", ");
  if (sinMapeo.length) msg += "\n\n⚠️ Pestañas sin mapeo definido: " + sinMapeo.join(", ");
  if (problemas.length) {
    msg += "\n\n⚠️ " + problemas.length + " problema(s) de integridad:\n" +
      problemas.slice(0, 15).map((p) => "• " + p).join("\n") +
      (problemas.length > 15 ? "\n... y " + (problemas.length - 15) + " más (ver registro de ejecución)" : "");
  }
  msg += "\n\nRecuerda copiar los archivos a src/data/CMS/ en tu repo.";
  mostrarResumen(msg, folder, folderName, creados);
}

/** Ventana con el resumen y enlaces clicables a la carpeta y a cada archivo. */
function mostrarResumen(msg, folder, folderName, creados) {
  const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const enlace = (url, texto) => '<a href="' + url + '" target="_blank" rel="noopener">' + esc(texto) + "</a>";
  const html =
    '<div style="font-family:Arial,sans-serif;font-size:13px;line-height:1.5">' +
    "<p><b>📁 " + enlace(folder.getUrl(), folderName) + "</b></p>" +
    "<ul style='padding-left:18px'>" +
    creados.map((c) => "<li>" + enlace(c.url, c.nombre) + " (" + c.n + ")" + (c.sinMapeo ? " <b>SIN MAPEO</b>" : "") + "</li>").join("") +
    "</ul>" +
    '<pre style="white-space:pre-wrap;font-size:12px;background:#f4f4f4;padding:8px">' + esc(msg) + "</pre>" +
    "</div>";
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html).setWidth(560).setHeight(520),
    "Exportación CMS Memorias Vivas"
  );
}
