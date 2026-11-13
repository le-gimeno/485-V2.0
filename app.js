// Revisión de carreras UNDEF – lógica de la página.
// Sin API: la revisión la hace Claude con la suscripción del usuario.
//  · Modo automático: la página se abrió con iniciar.bat y el servidor local llama a Claude Code.
//  · Modo copiar y pegar: la página se abrió desde la web (Vercel); el pedido se pega en claude.ai.

const PLANTILLA_JSON = `{
  "conclusion": "una o dos líneas",
  "documentos": [{"archivo": "", "tipo": "", "carrera": "", "unidad_academica": "", "nivel": "", "modalidad": "", "nueva_o_modificacion": ""}],
  "revisado": ["qué se revisó: puntos del formulario recorridos, aritmética verificada, documentos cruzados, marcas y comentarios previos analizados"],
  "normas_consultadas": ["normas efectivamente contrastadas, con los artículos usados"],
  "correcto": ["cada ítem verificado, con números, puntos o artículos"],
  "ya_senalado": [{"referencia": "#12 SA", "ubicacion": "", "pedido": "", "falta": ""}],
  "seguimiento": [{"numero_anterior": 1, "ubicacion": "", "resumen": "", "estado": "resuelta | parcial | pendiente | reintroducida", "detalle": ""}],
  "observaciones": [{
    "numero": 1, "archivo": "", "ubicacion": "",
    "semaforo": "rojo | amarillo | naranja | verde",
    "tipo": "corrección | completar | sugerencia | comentario | general",
    "documento_dice": "", "norma": "", "explicacion": "", "redaccion_propuesta": "",
    "accion": "reemplazar | insertar | insertar_parrafo | eliminar | comentar | ninguna",
    "parrafo": "P12", "ancla": "", "texto_nuevo": "", "comentario": ""
  }],
  "a_verificar": [{"archivo": "", "ubicacion": "", "texto": "", "parrafo": "", "ancla": ""}],
  "normativa_faltante": [{"norma": "", "donde": "", "que_no_se_verifico": ""}],
  "requisitos_militares": {"contexto": "", "items": [{"archivo": "", "ubicacion": "", "texto": "", "parrafo": "", "ancla": ""}]},
  "no_aplica": [{"punto": "", "motivo": ""}],
  "resumen_devolucion": "dos o tres oraciones formales para la nota de devolución a la unidad académica",
  "siguiente_paso": ""
}`;

const INSTRUCCIONES = `
# Cómo trabajar para la aplicación "Revisión de carreras UNDEF"

Aplicá el método "Revisión de documentos de carrera UNDEF" (skill revision-carreras-undef) a los documentos que siguen. Dirigite de forma neutral, en castellano.

Diferencias con el método:
- NO generes ni edites archivos, NO ejecutes scripts y NO escribas XML: ignorá las secciones técnicas (§5 y la parte de XML de §8.2–8.4). La aplicación ya extrajo el texto del Word y es la que escribe el control de cambios y los comentarios, con el autor "SA-UNDEF".
- Tu respuesta es ÚNICAMENTE un objeto JSON con la estructura de abajo, en un solo bloque de código \`\`\`json. Nada de texto antes ni después.
- Si la respuesta es muy larga y se corta, cuando te escriban "continuá" seguí exactamente desde el último carácter, sin repetir nada y sin abrir un bloque nuevo.

Cómo viene el documento:
- Cada párrafo empieza con su identificador: [P12] o [P40 | tabla 2, fila 3, col 1].
- Las marcas de otros revisores aparecen como ⟦+Autor: texto insertado⟧ y ⟦−Autor: texto eliminado⟧. Revisalas como pide el método (texto que queda roto al aceptarlas, espacios o puntos perdidos).
- Los rangos de comentarios previos aparecen como «#n» … «/#n»; al final hay una lista con número, autor, texto anclado y contenido de cada comentario.
- Si hay "Controles automáticos de la app", son cuentas que la aplicación ya hizo sobre las tablas: usalas, verificá cada diferencia en el texto y, si es real, cargala como observación.

SEMÁFORO (campo "semaforo" de cada observación):
- "rojo": lo fundamental. Incumplimientos de la RR 485/25 u otra norma verificada, contradicciones de fondo (título–contenidos, Formulario A vs. C, órganos o competencias mal asignados), errores de carga horaria, porcentajes o correlatividades, y OMISIONES GRAVES (falta un punto obligatorio del formulario, la Comisión Académica, el CRE, el régimen de regularidad, etc.).
- "amarillo": omisiones menores, datos a completar ([COMPLETAR]), cosas incompletas o a mejorar que no son graves.
- "naranja": puntuación, gramática, ortografía y cuestiones editoriales (numeración, formato, siglas, espacios, mayúsculas, unificación de términos).
- "verde": sugerencias de redacción o mejoras sin norma detrás.

Cómo completar cada observación (siguiendo §8.1 del método):
- "reemplazar": corrección con norma o error objetivo detrás. "ancla" = texto actual exacto; "texto_nuevo" = cómo debe quedar ese mismo fragmento.
- "insertar": agregar "texto_nuevo" justo después del "ancla" (una palabra, una cita o un marcador "[COMPLETAR – … (RR 485/25, Form. A, pto. 1.b)]"). Incluí el espacio inicial si hace falta.
- "insertar_parrafo": uno o más párrafos nuevos después del párrafo que contiene el "ancla". Separá párrafos con \\n.
- "eliminar": quitar el "ancla" (restos de copiar y pegar, normas derogadas, duplicaciones).
- "comentar": decisiones de la unidad académica, sugerencias sin norma, coherencia título–contenidos, etc. Solo comentario.
- "ninguna": observaciones generales que no conviene anclar en un lugar.
- "parrafo": identificador del párrafo del ancla (P12). "archivo": nombre exacto del documento.
- "ancla": fragmento CORTO y ÚNICO copiado literalmente de ese párrafo (3 a 15 palabras), sin los marcadores «#n» y sin texto de dentro de ⟦ ⟧. Nunca anclar dentro de marcas ajenas.
- "comentario": el texto del comentario del Word, completo: qué dice el documento → qué exige la norma → propuesta. Sin indicar el color del semáforo. En correcciones de forma triviales puede quedar vacío. Si amplía un comentario previo: "Amplía #n (autor): …".
- Numerá las observaciones en el orden en que aparecen en el texto (§4), con las generales al final.
- En "a_verificar" y "requisitos_militares", completá "parrafo" y "ancla" si hay una ubicación concreta.
- Si hay dos documentos de la misma carrera (A y C, o B y C), cruzalos (§2, paso 4) y cargá la observación en ambos.

NORMATIVA FALTANTE: en "normativa_faltante" listá cada norma que el documento cita o que haría falta para verificar algo y que NO tenés para leer (ni transcripta en el método ni entre los PDF disponibles): qué norma es, dónde se cita y qué no se pudo verificar por su falta. No la des por buena ni por mala: también va a "a_verificar" si corresponde.

"revisado": enumerá concretamente qué recorriste (por ejemplo "Formulario A, puntos 1.a a 6, contra la lista de control de la RR 485/25 (§9.2)", "Aritmética de la caja curricular y del 4.d", "31 comentarios y 480 marcas previas de otros revisores"). "seguimiento": solo si hay una revisión anterior (si no, []).

Estructura de la respuesta (usá "" o [] cuando no haya contenido):
\`\`\`json
${PLANTILLA_JSON}
\`\`\`
`.trim();

const INSTRUCCIONES_RAPIDA = `
# REVISIÓN RÁPIDA
Pedido de revisión rápida: informá SOLO observaciones de semáforo "rojo" (lo fundamental). En "correcto" poné como máximo 5 ítems; en "ya_senalado", solo lo que sea grave; omití forma, sugerencias y detalles menores. Consultá PDF solo si es imprescindible. Completá igual "conclusion", "revisado" (aclarando que fue una revisión rápida) y "normativa_faltante".`.trim();

// ---------- Estado ----------

const estado = { modo: 'manual', metodo: null, normas: [], documentos: [], informe: null, revision: null, sondeo: null, inicioRevision: 0, filtro: 'todos' };
const casillas = new WeakMap(); // observación → casilla "Word"
const $ = sel => document.querySelector(sel);
const guardarPref = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { /* sin almacenamiento */ } };
const leerPref = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
const SEMAFORO = Exportar.SEMAFORO;
const ORDEN = Exportar.ORDEN;

function el(tag, attrs = {}, ...hijos) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  for (const h of hijos.flat()) if (h != null && h !== false) e.append(h.nodeType ? h : String(h));
  return e;
}

// ---------- Modo de trabajo y normativa ----------

async function api(ruta, opciones = {}) {
  const r = await fetch(ruta, { ...opciones, headers: { 'X-SA-UNDEF': '1', ...(opciones.headers || {}) }, cache: 'no-store' });
  let j = null;
  try { j = await r.json(); } catch (e) { /* sin cuerpo JSON */ }
  if (!r.ok) throw new Error((j && j.error) || `Error ${r.status}`);
  return j;
}

async function detectarModo() {
  try {
    const e = await api('api/estado');
    if (e && e.local && e.claude && e.sesion) {
      estado.modo = 'local';
      $('#modo').textContent = 'Modo automático: la revisión la hace Claude Code en esta computadora, con tu suscripción.';
      $('#modo').className = 'modo modo-local';
    } else if (e && e.local) {
      $('#modo').textContent = e.claude
        ? 'Servidor local abierto, pero falta iniciar sesión en Claude (cerrá y volvé a abrir iniciar.bat). Mientras tanto: modo copiar y pegar.'
        : 'Servidor local abierto, pero no se encontró Claude Code. Mientras tanto: modo copiar y pegar.';
      $('#modo').className = 'modo modo-aviso';
    }
  } catch (e) { /* abierta desde la web: modo copiar y pegar */ }
  document.body.dataset.modo = estado.modo;
  $('#revisar').hidden = estado.modo !== 'local';
  $('#manual').hidden = estado.modo === 'local';
  await cargarNormas();
  actualizarBotones();
  if (estado.modo === 'local') revisarPendiente();
}

// Si la página se recargó mientras Claude trabajaba, retomar o recuperar el resultado
async function revisarPendiente() {
  let e;
  try { e = await api('api/estado'); } catch (x) { return; }
  if (e.estado === 'corriendo') {
    $('#progreso').hidden = false;
    estado.sondeo = setInterval(sondear, 3000);
    actualizarBotones();
    avisar('Hay una revisión en curso: se retomó el seguimiento. Cuando termine, si no tenés el .docx cargado, cargalo para poder generar el Word.');
  } else if (e.estado === 'listo') {
    $('#recuperar').hidden = false;
  }
}

async function recuperarResultado() {
  if (!estado.documentos.length) { avisar('Primero cargá el mismo .docx que se revisó; después tocá "Recuperar".', 'error'); return; }
  $('#recuperar').hidden = true;
  await sondear();
}

async function cargarNormas() {
  try {
    estado.normas = estado.modo === 'local' ? await api('api/normativa') : await (await fetch('normativa.json', { cache: 'no-cache' })).json();
  } catch (e) { estado.normas = []; }
  if (!Array.isArray(estado.normas)) estado.normas = [];
  $('#normas').replaceChildren(...estado.normas.map(n => el('li', {}, el('a', { href: n.archivo, download: n.archivo }, n.nombre))));
  $('#normas-ayuda').textContent = estado.modo === 'local'
    ? 'Para sumar normativa, copiá el PDF en la carpeta de la aplicación (junto a index.html) y recargá la página. Si querés darle un nombre, agregalo en normativa.json.'
    : 'Para sumar normativa a la versión web, subí el PDF al repositorio de GitHub y agregalo a normativa.json.';
}

const nombreNorma = archivo => { const n = estado.normas.find(x => x.archivo.toLowerCase() === archivo.toLowerCase()); return n ? n.nombre : archivo; };

// ---------- Preferencias ----------

function iniciarPreferencias() {
  $('#autor').value = leerPref('sa_autor') || 'SA-UNDEF';
  $('#autor').addEventListener('change', e => guardarPref('sa_autor', e.target.value.trim() || 'SA-UNDEF'));
  $('#incluir-metodo').checked = leerPref('sa_incluir_metodo') !== 'no';
  $('#incluir-metodo').addEventListener('change', e => guardarPref('sa_incluir_metodo', e.target.checked ? 'si' : 'no'));
  $('#unificar').checked = leerPref('sa_unificar') !== 'no';
  $('#unificar').addEventListener('change', e => guardarPref('sa_unificar', e.target.checked ? 'si' : 'no'));
}

// ---------- Documentos ----------

async function prepararDocumento(file) {
  const ctx = await DocxMotor.abrirDocx(file);
  ctx.texto = DocxMotor.representacionParaModelo(ctx);
  ctx.nComentarios = DocxMotor.leerComentarios(ctx).length;
  try { ctx.controles = Controles.analizar(ctx.docXmlOriginal); } catch (e) { ctx.controles = null; }
  return ctx;
}

async function cargarArchivos(files) {
  for (const f of files) {
    if (!/\.docx$/i.test(f.name)) { avisar(`${f.name}: solo se aceptan archivos .docx. Los PDF revisalos directamente en Claude.`, 'error'); continue; }
    if (estado.documentos.some(d => d.nombre === f.name)) { avisar(`${f.name} ya está cargado.`); continue; }
    try { estado.documentos.push(await prepararDocumento(f)); }
    catch (e) { avisar(`${f.name}: ${e.message}`, 'error'); }
  }
  dibujarDocumentos();
}

function dibujarDocumentos() {
  const lista = $('#lista-docs');
  lista.replaceChildren();
  estado.documentos.forEach((d, i) => {
    const c = d.controles;
    const ctrl = c && c.analizadas ? ` · cuentas: ${c.errores.length ? '⚠️ ' + c.errores.length + ' diferencias' : '✅ sin diferencias'}` : '';
    lista.append(el('li', {},
      el('span', { class: 'doc-nombre' }, d.nombre),
      el('span', { class: 'doc-info' }, `${d.parrafos.length} párrafos · ${d.nComentarios} comentarios previos · ${(d.docXmlOriginal.match(/<w:(ins|del) /g) || []).length} marcas previas${ctrl}`),
      el('button', { class: 'quitar', type: 'button', title: 'Quitar', 'aria-label': 'Quitar ' + d.nombre, onclick: () => { estado.documentos.splice(i, 1); dibujarDocumentos(); } }, '×')));
  });
  actualizarBotones();
}

function actualizarBotones() {
  const hay = estado.documentos.length > 0;
  $('#revisar').disabled = !hay || !!estado.sondeo;
  $('#copiar-pedido').disabled = !hay;
  $('#descargar-pedido').disabled = !hay;
}

// ---------- Pedido ----------

async function cargarMetodo() {
  if (estado.metodo) return estado.metodo;
  const r = await fetch('metodo.md', { cache: 'no-cache' });
  if (!r.ok) throw new Error('No se pudo leer metodo.md (¿está junto al index.html?).');
  estado.metodo = await r.text();
  return estado.metodo;
}

async function revisionAnteriorElegida() {
  const id = $('#anterior').value;
  return id ? Almacen.obtener(id) : null;
}

async function armarPedido() {
  const partes = [];
  const rapida = $('#tipo-revision').value === 'rapida';
  const incluirMetodo = estado.modo === 'local' || $('#incluir-metodo').checked;
  if (incluirMetodo) partes.push('# MÉTODO DE REVISIÓN\n\n' + await cargarMetodo());
  partes.push(INSTRUCCIONES);
  if (rapida) partes.push(INSTRUCCIONES_RAPIDA);
  if (estado.modo === 'local') {
    partes.push(`# NORMATIVA DISPONIBLE\nEstás corriendo en la carpeta de la aplicación, que contiene estos PDF: ${estado.normas.map(n => `${n.archivo} (${n.nombre})`).join('; ') || '(ninguno)'}.\nPodés leerlos con la herramienta Read cuando necesites verificar el texto exacto de un artículo (los escaneados, como la RR 485/25 y el anexo de la RR 169/22: leé solo las páginas necesarias). No uses ninguna otra herramienta. Toda norma que no esté entre estos PDF ni transcripta en el método va a "normativa_faltante".`);
  } else {
    partes.push('# NORMATIVA DISPONIBLE\nSolo tenés la normativa transcripta en el método y los PDF que el usuario adjunte a esta conversación. Toda otra norma que haga falta va a "normativa_faltante".');
  }
  const anterior = await revisionAnteriorElegida();
  if (anterior && anterior.informe) {
    const obs = anterior.informe.observaciones || [];
    partes.push(`# REVISIÓN ANTERIOR (${new Date(anterior.fecha).toLocaleDateString('es-AR')}, ${(anterior.archivos || []).map(a => a.nombre).join(', ')})\nEstas son las observaciones de la revisión anterior de este documento. Completá "seguimiento" con una entrada por cada una: "resuelta", "parcial" (resuelta a medias), "pendiente" o "reintroducida" (estaba corregida y volvió a aparecer), con el detalle de qué cambió. En "observaciones" poné solo lo que siga pendiente o sea nuevo.\n` +
      obs.map(o => `${o.numero}. [${(o.semaforo || '').toUpperCase()}] ${o.ubicacion} — ${o.explicacion || o.documento_dice}${o.redaccion_propuesta ? ' | Propuesta: ' + o.redaccion_propuesta.slice(0, 300) : ''}`).join('\n'));
  }
  partes.push(`# ${estado.documentos.length > 1 ? 'DOCUMENTOS' : 'DOCUMENTO'} A REVISAR`);
  for (const d of estado.documentos) {
    partes.push(d.texto);
    const ctrl = Controles.textoParaClaude(d.nombre, d.controles);
    if (ctrl) partes.push(ctrl);
  }
  const extra = $('#pedido').value.trim();
  partes.push(`# PEDIDO\n\nRevisá ${estado.documentos.length > 1 ? 'estos documentos' : 'este documento'} con el método${rapida ? ' (revisión rápida: solo lo fundamental)' : ''} y respondé solo con el JSON.${extra ? '\n\nPedido del usuario: ' + extra : ''}`);
  return partes.join('\n\n');
}

// ---------- Modo automático ----------

async function revisarLocal() {
  try {
    const pedido = await armarPedido();
    await api('api/revisar', { method: 'POST', headers: { 'content-type': 'text/plain; charset=utf-8' }, body: pedido });
  } catch (e) { avisar('No se pudo iniciar la revisión: ' + e.message, 'error'); return; }
  $('#resultado').hidden = true;
  $('#progreso').hidden = false;
  $('#progreso-texto').textContent = 'Claude está revisando el documento…';
  $('#progreso-detalle').textContent = '';
  estado.sondeo = setInterval(sondear, 3000);
  actualizarBotones();
}

function describirProgreso(cola) {
  let actividad = '', consultas = [];
  for (const linea of cola.split('\n')) {
    let ev;
    try { ev = JSON.parse(linea); } catch (e) { continue; }
    if (ev.type !== 'assistant' || !ev.message || !Array.isArray(ev.message.content)) continue;
    for (const b of ev.message.content) {
      if (b.type === 'tool_use') {
        const ruta = (b.input && (b.input.file_path || b.input.path || b.input.pattern)) || '';
        const archivo = ruta.split(/[\\/]/).pop();
        if (b.name === 'Read' && archivo) { actividad = 'Consultando ' + nombreNorma(archivo); if (!consultas.includes(archivo)) consultas.push(archivo); }
        else actividad = 'Buscando en la normativa';
      } else if (b.type === 'text' && b.text && b.text.trim()) actividad = 'Redactando el informe';
      else if (b.type === 'thinking') actividad = 'Analizando el documento';
    }
  }
  return { actividad, consultas };
}

async function sondear() {
  let e;
  try { e = await api('api/estado'); } catch (err) { terminarSondeo(); avisar('Se perdió la conexión con el servidor local (¿se cerró la ventana de iniciar.bat?).', 'error'); return; }
  if (e.estado === 'corriendo') {
    const m = Math.floor(e.segundos / 60), s = e.segundos % 60;
    $('#progreso-texto').textContent = `Claude está revisando el documento… ${m} min ${String(s).padStart(2, '0')} s`;
    try {
      const p = describirProgreso((await api('api/progreso')).cola || '');
      $('#progreso-detalle').textContent = [p.actividad, p.consultas.length ? `Normativa consultada: ${p.consultas.map(nombreNorma).join(', ')}` : ''].filter(Boolean).join(' · ');
    } catch (err) { /* el progreso es opcional */ }
    return;
  }
  terminarSondeo();
  if (e.estado !== 'listo') return;
  try {
    const r = await api('api/resultado');
    let res = null;
    for (const linea of (r.salida || '').split('\n')) { try { const ev = JSON.parse(linea); if (ev.type === 'result') res = ev; } catch (x) { /* línea incompleta */ } }
    if (!res) throw new Error('Claude Code no devolvió un resultado. ' + (r.error || '').slice(0, 400));
    if (res.is_error || (res.subtype && res.subtype !== 'success')) throw new Error('Claude Code terminó con error: ' + String(res.result || res.subtype).slice(0, 400));
    await procesarRespuesta(res.result || '');
  } catch (err) {
    avisar(err.message, 'error');
  }
}

function terminarSondeo() {
  clearInterval(estado.sondeo);
  estado.sondeo = null;
  $('#progreso').hidden = true;
  actualizarBotones();
}

async function cancelarLocal() {
  try { await api('api/cancelar', { method: 'POST' }); } catch (e) { /* nada */ }
  terminarSondeo();
  avisar('Revisión cancelada.');
}

// ---------- Modo copiar y pegar ----------

async function copiarPedido() {
  try {
    await navigator.clipboard.writeText(await armarPedido());
    avisar('Pedido copiado. Pegalo en un chat nuevo de claude.ai y después pegá acá la respuesta.');
  } catch (e) {
    avisar('No se pudo copiar automáticamente: usá "Descargar pedido" y adjuntá el archivo en Claude.', 'error');
  }
}

async function descargarPedido() {
  descargar(new Blob([await armarPedido()], { type: 'text/plain;charset=utf-8' }), 'pedido_revision_SA-UNDEF.txt');
}

async function cargarRespuestaPegada() {
  const t = $('#respuesta').value.trim();
  if (!t) { avisar('Pegá primero la respuesta de Claude.', 'error'); return; }
  try { await procesarRespuesta(t); } catch (e) { avisar(e.message, 'error'); }
}

// ---------- Lectura de la respuesta ----------

function extraerJson(texto) {
  const bloques = [...texto.matchAll(/```(?:json)?\s*([\s\S]*?)(?:```|$)/g)].map(m => m[1]);
  const candidatos = [];
  if (bloques.length) candidatos.push(bloques.join(''));
  const i = texto.indexOf('{'), j = texto.lastIndexOf('}');
  if (i >= 0 && j > i) candidatos.push(texto.slice(i, j + 1));
  for (const c of candidatos) {
    for (const v of [c, c.replace(/,\s*([}\]])/g, '$1')]) {
      try { return JSON.parse(v); } catch (e) { /* probar el siguiente */ }
    }
  }
  throw new Error('No se pudo leer la respuesta como JSON. Si Claude la cortó, escribile "continuá" y pegá la respuesta completa (todas las partes, en orden).');
}

const ACCIONES = ['reemplazar', 'insertar', 'insertar_parrafo', 'eliminar', 'comentar', 'ninguna'];
const ESTADOS_SEG = ['resuelta', 'parcial', 'pendiente', 'reintroducida'];
const txt = v => (v == null ? '' : String(v));

function semaforoDe(o) {
  const s = txt(o.semaforo).toLowerCase().trim();
  if (SEMAFORO[s]) return s;
  if (/sugerencia/i.test(o.tipo)) return 'verde';
  if (/completar/i.test(o.tipo)) return 'amarillo';
  return 'amarillo';
}

function normalizarInforme(x) {
  const arr = v => (Array.isArray(v) ? v : []);
  const ubic = u => ({ archivo: txt(u.archivo), ubicacion: txt(u.ubicacion), texto: txt(u.texto), parrafo: txt(u.parrafo), ancla: txt(u.ancla) });
  const unico = estado.documentos.length === 1 ? estado.documentos[0].nombre : '';
  const inf = {
    conclusion: txt(x.conclusion),
    documentos: arr(x.documentos).map(d => ({ archivo: txt(d.archivo), tipo: txt(d.tipo), carrera: txt(d.carrera), unidad_academica: txt(d.unidad_academica), nivel: txt(d.nivel), modalidad: txt(d.modalidad), nueva_o_modificacion: txt(d.nueva_o_modificacion) })),
    revisado: arr(x.revisado).map(txt),
    normas_consultadas: arr(x.normas_consultadas).map(txt),
    correcto: arr(x.correcto).map(txt),
    ya_senalado: arr(x.ya_senalado).map(y => ({ referencia: txt(y.referencia), ubicacion: txt(y.ubicacion), pedido: txt(y.pedido), falta: txt(y.falta) })),
    seguimiento: arr(x.seguimiento).map(s => ({ numero_anterior: txt(s.numero_anterior), ubicacion: txt(s.ubicacion), resumen: txt(s.resumen), estado: ESTADOS_SEG.includes(s.estado) ? s.estado : 'pendiente', detalle: txt(s.detalle) })),
    observaciones: arr(x.observaciones).map((o, i) => ({
      numero: o.numero || i + 1, archivo: txt(o.archivo) || unico, ubicacion: txt(o.ubicacion), semaforo: semaforoDe(o), tipo: txt(o.tipo),
      documento_dice: txt(o.documento_dice), norma: txt(o.norma), explicacion: txt(o.explicacion), redaccion_propuesta: txt(o.redaccion_propuesta),
      accion: ACCIONES.includes(o.accion) ? o.accion : 'comentar', parrafo: txt(o.parrafo), ancla: txt(o.ancla), texto_nuevo: txt(o.texto_nuevo), comentario: txt(o.comentario),
    })),
    a_verificar: arr(x.a_verificar).map(ubic),
    normativa_faltante: arr(x.normativa_faltante).map(n => ({ norma: txt(n.norma), donde: txt(n.donde), que_no_se_verifico: txt(n.que_no_se_verifico) })),
    requisitos_militares: { contexto: txt(x.requisitos_militares && x.requisitos_militares.contexto), items: arr(x.requisitos_militares && x.requisitos_militares.items).map(ubic) },
    no_aplica: arr(x.no_aplica).map(n => ({ punto: txt(n.punto), motivo: txt(n.motivo) })),
    resumen_devolucion: txt(x.resumen_devolucion),
    siguiente_paso: txt(x.siguiente_paso),
  };
  const nombres = estado.documentos.map(d => d.nombre);
  for (const o of [...inf.observaciones, ...inf.a_verificar, ...inf.requisitos_militares.items]) {
    if (!o.archivo) o.archivo = unico;
    if (!nombres.includes(o.archivo)) o.archivo = nombres.find(n => o.archivo && n.toLowerCase().includes(o.archivo.toLowerCase())) || unico || o.archivo;
  }
  return inf;
}

async function procesarRespuesta(texto) {
  const inf = normalizarInforme(extraerJson(texto));
  if (!inf.conclusion && !inf.observaciones.length && !inf.correcto.length) throw new Error('La respuesta no tiene el formato esperado (faltan conclusión y observaciones).');
  estado.informe = inf;
  const anterior = await revisionAnteriorElegida().catch(() => null);
  estado.revision = {
    id: 'r' + Date.now().toString(36),
    fecha: new Date().toISOString(),
    archivos: estado.documentos.map(d => ({ nombre: d.nombre, datos: d.buffer })),
    informe: inf,
    rapida: $('#tipo-revision').value === 'rapida',
    anteriorId: anterior ? anterior.id : null,
    anteriorTitulo: anterior ? tituloRevision(anterior) : null,
    estadoTramite: 'En revisión',
    notas: '',
    nota: null,
  };
  estado.filtro = 'todos';
  dibujarInforme();
  await guardarRevision();
}

// ---------- Guardado de revisiones ----------

let temporizadorGuardado = null;
function programarGuardado() {
  clearTimeout(temporizadorGuardado);
  temporizadorGuardado = setTimeout(guardarRevision, 800);
}

async function guardarRevision() {
  if (!estado.revision) return;
  estado.revision.informe = estado.informe;
  try { await Almacen.guardar(estado.revision); $('#guardado').textContent = 'Guardado en este navegador ✓'; }
  catch (e) { $('#guardado').textContent = 'No se pudo guardar en este navegador.'; }
  dibujarGuardadas();
}

function tituloRevision(r) {
  const d = (r.informe && r.informe.documentos && r.informe.documentos[0]) || {};
  return [d.carrera || (r.archivos && r.archivos[0] && r.archivos[0].nombre) || 'Revisión', d.tipo].filter(Boolean).join(' – ');
}

function contarSemaforo(inf) {
  const c = { rojo: 0, amarillo: 0, naranja: 0, verde: 0 };
  for (const o of (inf && inf.observaciones) || []) c[o.semaforo] = (c[o.semaforo] || 0) + 1;
  return c;
}

async function dibujarGuardadas() {
  let lista = [];
  try { lista = await Almacen.listar(); } catch (e) { $('#guardadas').replaceChildren(el('p', { class: 'nota' }, 'Este navegador no permite guardar revisiones.')); return; }
  // selector de revisión anterior
  const sel = $('#anterior');
  const valor = sel.value;
  sel.replaceChildren(el('option', { value: '' }, '— ninguna (revisión nueva) —'),
    ...lista.filter(r => !estado.revision || r.id !== estado.revision.id).map(r => el('option', { value: r.id }, `${new Date(r.fecha).toLocaleDateString('es-AR')} · ${tituloRevision(r)}`)));
  sel.value = lista.some(r => r.id === valor) ? valor : '';
  $('#guardadas-cantidad').textContent = lista.length ? `(${lista.length})` : '';
  if (!lista.length) { $('#guardadas').replaceChildren(el('p', { class: 'nota' }, 'Todavía no hay revisiones guardadas. Cada revisión se guarda sola al terminar.')); return; }
  const filas = lista.map(r => {
    const c = contarSemaforo(r.informe);
    const estadoSel = el('select', { 'aria-label': 'Estado del trámite', onchange: async ev => { r.estadoTramite = ev.target.value; if (estado.revision && estado.revision.id === r.id) estado.revision.estadoTramite = r.estadoTramite; await Almacen.guardar(r); } },
      ...['En revisión', 'Enviada a la unidad', 'Respondida', 'Aprobada', 'Archivada'].map(v => el('option', { value: v, selected: r.estadoTramite === v }, v)));
    const notas = el('input', { type: 'text', value: r.notas || '', placeholder: 'Notas…', 'aria-label': 'Notas', onchange: async ev => { r.notas = ev.target.value; if (estado.revision && estado.revision.id === r.id) estado.revision.notas = r.notas; await Almacen.guardar(r); } });
    return el('tr', { class: estado.revision && estado.revision.id === r.id ? 'actual' : '' },
      el('td', {}, new Date(r.fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })),
      el('td', {}, el('strong', {}, tituloRevision(r)), el('div', { class: 'nota' }, (r.archivos || []).map(a => a.nombre).join(', ') + (r.rapida ? ' · rápida' : ''))),
      el('td', { class: 'mini-semaforo' }, ORDEN.map(k => el('span', { class: 'punto punto-' + k, title: SEMAFORO[k].nombre }, String(c[k] || 0)))),
      el('td', {}, estadoSel, notas),
      el('td', { class: 'acciones-fila' },
        el('button', { type: 'button', class: 'boton secundario chico', onclick: () => abrirRevision(r.id) }, 'Abrir'),
        el('button', { type: 'button', class: 'boton secundario chico', onclick: () => exportarRevision(r) }, 'Exportar'),
        el('button', { type: 'button', class: 'boton secundario chico peligro', onclick: () => borrarRevision(r) }, 'Borrar')));
  });
  $('#guardadas').replaceChildren(el('div', { class: 'tabla-scroll' }, el('table', { class: 'tabla-guardadas' },
    el('thead', {}, el('tr', {}, ['Fecha', 'Revisión', 'Semáforo', 'Estado y notas', ''].map(t => el('th', {}, t)))), el('tbody', {}, filas))));
}

async function abrirRevision(id) {
  const r = await Almacen.obtener(id);
  if (!r) { avisar('No se encontró la revisión.', 'error'); return; }
  try {
    estado.documentos = await Promise.all((r.archivos || []).map(a => prepararDocumento(new File([a.datos], a.nombre))));
  } catch (e) { avisar('No se pudieron abrir los documentos guardados: ' + e.message, 'error'); return; }
  estado.revision = r;
  estado.informe = r.informe;
  estado.filtro = 'todos';
  $('#tipo-revision').value = r.rapida ? 'rapida' : 'completa';
  dibujarDocumentos();
  dibujarInforme();
  dibujarGuardadas();
  avisar('Revisión abierta. Podés cambiar casillas, colores y textos, y volver a generar el Word sin consultar a Claude.');
}

async function borrarRevision(r) {
  if (!confirm(`¿Borrar la revisión "${tituloRevision(r)}" del ${new Date(r.fecha).toLocaleDateString('es-AR')}? No se puede deshacer (salvo que la hayas exportado).`)) return;
  await Almacen.borrar(r.id);
  if (estado.revision && estado.revision.id === r.id) estado.revision = null;
  dibujarGuardadas();
}

function aBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let s = '';
  for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(s);
}
function deBase64(b64) {
  const s = atob(b64);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) bytes[i] = s.charCodeAt(i);
  return bytes.buffer;
}

function exportarRevision(r) {
  const copia = { formato: 'revision-undef', version: 1, ...r, archivos: (r.archivos || []).map(a => ({ nombre: a.nombre, base64: aBase64(a.datos) })) };
  const fecha = new Date(r.fecha).toISOString().slice(0, 10);
  descargar(new Blob([JSON.stringify(copia)], { type: 'application/json' }), `revision_${fecha}_${tituloRevision(r).replace(/[^\wÁÉÍÓÚÑáéíóúñ\- ]+/g, '').slice(0, 60).trim().replace(/\s+/g, '_')}.json`);
}

async function importarRevision(file) {
  try {
    const j = JSON.parse(await file.text());
    if (j.formato !== 'revision-undef' || !j.informe) throw new Error('el archivo no es una revisión exportada por esta aplicación');
    const r = { ...j, archivos: (j.archivos || []).map(a => ({ nombre: a.nombre, datos: deBase64(a.base64) })) };
    delete r.formato; delete r.version;
    await Almacen.guardar(r);
    await dibujarGuardadas();
    avisar('Revisión importada.');
  } catch (e) { avisar('No se pudo importar: ' + e.message, 'error'); }
}

async function descargarPlanilla() {
  try {
    const lista = await Almacen.listar();
    if (!lista.length) { avisar('No hay revisiones guardadas.', 'error'); return; }
    descargar(await Exportar.planilla(lista), `seguimiento_revisiones_SA-UNDEF_${new Date().toISOString().slice(0, 10)}.xlsx`);
  } catch (e) { avisar('No se pudo generar la planilla: ' + e.message, 'error'); }
}

// ---------- Informe en pantalla ----------

const ETIQUETA_ACCION = { reemplazar: 'Corrige', insertar: 'Inserta', insertar_parrafo: 'Inserta párrafo', eliminar: 'Elimina', comentar: 'Comentario', ninguna: 'Solo informe' };

function campoEditable(obj, clave, etiqueta, filas = 2) {
  const ta = el('textarea', { rows: filas, 'aria-label': etiqueta });
  ta.value = obj[clave] || '';
  ta.addEventListener('input', () => { obj[clave] = ta.value; programarGuardado(); });
  return el('label', { class: 'campo' }, el('span', {}, etiqueta), ta);
}

function tarjetaObservacion(o) {
  const docx = estado.documentos.find(d => d.nombre === o.archivo);
  if (o.incluir === undefined) o.incluir = !!docx && o.accion !== 'ninguna';
  const check = el('input', { type: 'checkbox', 'aria-label': 'Incluir en el Word' });
  check.checked = o.incluir;
  check.disabled = !docx || o.accion === 'ninguna';
  check.addEventListener('change', () => { o.incluir = check.checked; programarGuardado(); });
  casillas.set(o, check);
  const tarjeta = el('li', { class: 'obs', 'data-semaforo': o.semaforo });
  const selColor = el('select', { class: 'sel-semaforo sel-' + o.semaforo, 'aria-label': 'Color del semáforo' }, ORDEN.map(k => el('option', { value: k, selected: o.semaforo === k }, SEMAFORO[k].nombre)));
  selColor.addEventListener('change', () => {
    o.semaforo = selColor.value;
    selColor.className = 'sel-semaforo sel-' + o.semaforo;
    tarjeta.dataset.semaforo = o.semaforo;
    dibujarTablero();
    programarGuardado();
  });
  const detalles = el('details', { class: 'editar' }, el('summary', {}, 'Editar lo que se carga en el Word'),
    o.accion !== 'comentar' && o.accion !== 'ninguna' ? campoEditable(o, 'texto_nuevo', o.accion === 'reemplazar' ? 'Texto nuevo (reemplaza al anclaje)' : 'Texto a insertar', 3) : null,
    campoEditable(o, 'ancla', 'Texto de anclaje (debe existir tal cual en el documento)', 1),
    campoEditable(o, 'comentario', 'Comentario', 4));
  tarjeta.append(
    el('div', { class: 'obs-cab' },
      selColor,
      el('label', { class: 'incluir' }, check, ' Word'),
      el('strong', {}, `${o.numero}. ${o.ubicacion}`),
      el('span', { class: 'chip chip-' + o.accion }, ETIQUETA_ACCION[o.accion] || o.accion),
      estado.documentos.length > 1 ? el('span', { class: 'chip' }, o.archivo) : null),
    o.documento_dice ? el('p', {}, el('em', {}, 'Dice: '), o.documento_dice) : null,
    o.norma ? el('p', {}, el('em', {}, 'Norma: '), o.norma) : null,
    o.explicacion ? el('p', {}, o.explicacion) : null,
    o.redaccion_propuesta ? el('blockquote', {}, o.redaccion_propuesta) : null,
    detalles);
  return tarjeta;
}

function tarjetaUbicable(x, tipo) {
  const docx = estado.documentos.find(d => d.nombre === x.archivo);
  if (x.incluir === undefined) x.incluir = !!docx && !!x.ancla && tipo === 'verificar';
  const check = el('input', { type: 'checkbox', 'aria-label': 'Cargar como comentario en el Word' });
  check.checked = x.incluir;
  check.disabled = !docx || !x.ancla;
  check.addEventListener('change', () => { x.incluir = check.checked; programarGuardado(); });
  return el('li', {}, el('label', { class: 'incluir' }, check, ' Word'), ' ', el('strong', {}, x.ubicacion ? x.ubicacion + ': ' : ''), x.texto);
}

const seccion = (titulo, hijos, clase = '') => el('section', { class: 'bloque ' + clase }, el('h3', {}, titulo), hijos);

function dibujarTablero() {
  const inf = estado.informe;
  const c = contarSemaforo(inf);
  const caja = k => el('div', { class: `semaforo-caja caja-${k}${estado.filtro === k ? ' activa' : ''}` },
    el('button', { type: 'button', class: 'semaforo-num', 'aria-pressed': String(estado.filtro === k), title: 'Mostrar solo ' + SEMAFORO[k].nombre, onclick: () => filtrar(estado.filtro === k ? 'todos' : k) },
      el('span', { class: 'n' }, String(c[k] || 0)), el('span', { class: 'etq' }, SEMAFORO[k].nombre)),
    el('span', { class: 'desc' }, SEMAFORO[k].desc),
    el('span', { class: 'masivo' }, 'Word: ',
      el('button', { type: 'button', class: 'enlace', onclick: () => tildarColor(k, true) }, 'tildar'), ' · ',
      el('button', { type: 'button', class: 'enlace', onclick: () => tildarColor(k, false) }, 'destildar')));
  const rojos = inf.observaciones.filter(o => o.semaforo === 'rojo');
  $('#tablero').replaceChildren(
    el('div', { class: 'semaforo' }, ORDEN.map(caja)),
    el('p', { class: 'nota' }, estado.filtro === 'todos' ? 'Tocá un número para ver solo ese color.' : `Mostrando solo ${SEMAFORO[estado.filtro].nombre}. `, estado.filtro !== 'todos' ? el('button', { type: 'button', class: 'enlace', onclick: () => filtrar('todos') }, 'Ver todas') : null),
    rojos.length ? el('div', { class: 'rojos' }, el('h3', {}, 'Puntos fundamentales a corregir'), el('ol', {}, rojos.map(o => el('li', {}, el('strong', {}, `${o.numero}. ${o.ubicacion}: `), o.explicacion || o.documento_dice)))) : null);
  const lista = $('.observaciones');
  if (lista) lista.dataset.filtro = estado.filtro;
}

function filtrar(k) {
  estado.filtro = k;
  dibujarTablero();
  const s = $('#seccion-observaciones');
  if (s && k !== 'todos') s.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function tildarColor(k, valor) {
  for (const o of estado.informe.observaciones.filter(o => o.semaforo === k)) {
    const ch = casillas.get(o);
    if (ch && !ch.disabled) { ch.checked = valor; o.incluir = valor; }
  }
  programarGuardado();
}

function dibujarInforme() {
  const inf = estado.informe;
  const rev = estado.revision || {};
  const controles = estado.documentos.filter(d => d.controles && d.controles.analizadas);
  const SEG = Exportar.SEGUIMIENTO;
  $('#informe').replaceChildren(...[
    inf.conclusion ? el('p', { class: 'conclusion' }, inf.conclusion) : null,
    inf.documentos.length ? el('ul', { class: 'docs-id' }, inf.documentos.map(d => el('li', {}, el('strong', {}, d.archivo), ` — ${[d.tipo, d.carrera, d.unidad_academica, d.nivel, d.modalidad, d.nueva_o_modificacion].filter(Boolean).join(' · ')}`))) : null,
    rev.rapida ? el('p', { class: 'aviso-suave' }, 'Revisión rápida: solo se buscaron los puntos fundamentales (rojo).') : null,
    el('div', { id: 'tablero' }),
    inf.normativa_faltante.length ? el('div', { class: 'faltante' },
      el('h3', {}, '📚 Normativa que no se pudo verificar'),
      el('p', {}, 'Se cita en el documento o haría falta para verificarlo, pero no estaba disponible. Si conseguís estos archivos, agregalos y volvé a revisar:'),
      el('ul', {}, inf.normativa_faltante.map(n => el('li', {}, el('strong', {}, n.norma), n.donde ? ` (citada en ${n.donde})` : '', n.que_no_se_verifico ? ` — ${n.que_no_se_verifico}` : ''))),
      el('p', { class: 'nota' }, $('#normas-ayuda').textContent)) : null,
    inf.seguimiento.length ? seccion('Seguimiento de la revisión anterior', [
      rev.anteriorTitulo ? el('p', { class: 'nota' }, 'Comparado con: ' + rev.anteriorTitulo) : null,
      el('ul', { class: 'seguimiento' }, inf.seguimiento.map(s => el('li', { class: 'seg-' + s.estado }, el('span', { class: 'seg-estado' }, SEG[s.estado]), ' ', el('strong', {}, `${s.numero_anterior}. ${s.ubicacion}`), s.resumen ? ` — ${s.resumen}` : '', s.detalle ? el('div', { class: 'nota' }, s.detalle) : null)))]) : null,
    inf.revisado.length || inf.normas_consultadas.length || controles.length ? seccion('Qué se revisó', [
      inf.revisado.length ? el('ul', {}, inf.revisado.map(t => el('li', {}, t))) : null,
      inf.normas_consultadas.length ? el('p', {}, el('strong', {}, 'Normativa contrastada: '), inf.normas_consultadas.join('; ')) : null,
      ...controles.map(d => el('div', { class: 'controles' },
        el('p', {}, el('strong', {}, `Controles automáticos de la app${estado.documentos.length > 1 ? ' (' + d.nombre + ')' : ''}: `), `${d.controles.analizadas} tablas con números, ${d.controles.correctos} cuentas sin diferencias${d.controles.errores.length ? ', ' + d.controles.errores.length + ' diferencias:' : '.'}`),
        d.controles.errores.length ? el('ul', {}, d.controles.errores.map(e => el('li', {}, '⚠️ ' + e))) : null))]) : null,
    inf.correcto.length ? seccion('✅ Lo que está correcto', el('ul', { class: 'ok' }, inf.correcto.map(t => el('li', {}, t)))) : null,
    inf.ya_senalado.length ? seccion('Ya señalado y pendiente', el('ul', {}, inf.ya_senalado.map(y => el('li', {}, el('strong', {}, `${y.referencia}${y.ubicacion ? ' (' + y.ubicacion + ')' : ''}: `), `${y.pedido}${y.falta ? ' — Falta: ' + y.falta : ''}`)))) : null,
    inf.observaciones.length ? el('section', { class: 'bloque', id: 'seccion-observaciones' }, el('h3', {}, 'Observaciones, correcciones y agregados'), el('ol', { class: 'observaciones', 'data-filtro': estado.filtro }, inf.observaciones.map(tarjetaObservacion))) : null,
    inf.a_verificar.length ? seccion('Puntos a verificar', el('ul', { class: 'ubicables' }, inf.a_verificar.map(x => tarjetaUbicable(x, 'verificar')))) : null,
    inf.requisitos_militares.items.length ? seccion('🎖️ Requisitos propios de carrera militar', [inf.requisitos_militares.contexto ? el('p', {}, inf.requisitos_militares.contexto) : null, el('ul', { class: 'ubicables' }, inf.requisitos_militares.items.map(x => tarjetaUbicable(x, 'militar')))]) : null,
    inf.no_aplica.length ? seccion('N/A (no aplica)', el('ul', {}, inf.no_aplica.map(n => el('li', {}, el('strong', {}, n.punto + ': '), n.motivo)))) : null,
    inf.siguiente_paso ? seccion('Siguiente paso', el('p', {}, inf.siguiente_paso)) : null,
  ].filter(Boolean));
  dibujarTablero();
  // Nota de devolución
  if (!rev.nota) rev.nota = Exportar.textoNota(datosExportacion());
  $('#nota').value = rev.nota;
  $('#resultado').hidden = false;
  $('#salidas').replaceChildren();
  $('#generar').disabled = !estado.documentos.length;
  $('#guardado').textContent = '';
  $('#resultado').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function datosExportacion() {
  const rev = estado.revision || {};
  return {
    informe: estado.informe,
    documentos: estado.documentos.map(d => ({ nombre: d.nombre, controles: d.controles })),
    rapida: !!rev.rapida,
    anterior: rev.anteriorTitulo || null,
    autor: ($('#autor').value || 'SA-UNDEF').trim(),
    fecha: rev.fecha ? new Date(rev.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : null,
  };
}

const nombreBase = () => {
  const d = estado.informe.documentos[0] || {};
  return (d.carrera || (estado.documentos[0] && estado.documentos[0].nombre.replace(/\.docx$/i, '')) || 'revision').replace(/[^\wÁÉÍÓÚÑáéíóúñ\- ]+/g, '').trim().slice(0, 60).replace(/\s+/g, '_');
};

async function descargarInformeDocx() {
  try { descargar(await Exportar.informeDocx(datosExportacion()), `Informe_revision_${nombreBase()}_SA-UNDEF.docx`); }
  catch (e) { avisar('No se pudo generar el informe: ' + e.message, 'error'); }
}

async function descargarNotaDocx() {
  try { descargar(await Exportar.notaDocx($('#nota').value), `Nota_devolucion_${nombreBase()}.docx`); }
  catch (e) { avisar('No se pudo generar la nota: ' + e.message, 'error'); }
}

// ---------- Generar Word con control de cambios ----------

async function generarWord() {
  const autor = ($('#autor').value || 'SA-UNDEF').trim();
  const unificar = $('#unificar').checked;
  const inf = estado.informe;
  const salidas = $('#salidas');
  salidas.replaceChildren();
  for (const ctx of estado.documentos) {
    const items = inf.observaciones.filter(o => o.incluir && o.archivo === ctx.nombre).map(o => ({ ...o, comentario: textoComentario(o) }));
    const extra = [
      ...inf.a_verificar.filter(x => x.incluir && x.archivo === ctx.nombre).map(x => ({ accion: 'comentar', parrafo: x.parrafo, ancla: x.ancla, comentario: `Punto a verificar – ${x.texto}`, ubicacion: x.ubicacion, numero: 'V' })),
      ...inf.requisitos_militares.items.filter(x => x.incluir && x.archivo === ctx.nombre).map(x => ({ accion: 'comentar', parrafo: x.parrafo, ancla: x.ancla, comentario: `Requisito propio de carrera militar – se señala, no se observa. ${x.texto}`, ubicacion: x.ubicacion, numero: 'M' })),
    ];
    if (!items.length && !extra.length && !unificar) continue;
    try {
      const r = await DocxMotor.aplicarHallazgos(ctx, [...items, ...extra], autor, { unificar });
      const nombre = ctx.nombre.replace(/\.docx$/i, '') + '_SA-UNDEF_control_de_cambios.docx';
      const ok = !r.problemas.length;
      salidas.append(el('div', { class: 'salida ' + (ok ? 'salida-ok' : 'salida-mal') },
        el('h4', {}, ctx.nombre),
        el('p', {}, `${r.aplicados.length} cambios o comentarios cargados (${r.cantidadComentarios} comentarios nuevos, firmados "${autor}").`),
        unificar ? el('p', {}, `Autores unificados: ${r.unificados} marcas y comentarios de otros revisores ahora figuran como "${autor}" (se conservan todos, pendientes).`) : null,
        ok ? el('p', {}, '✅ Verificado: rechazando las marcas nuevas, el documento vuelve al original con todas las marcas y comentarios previos.')
          : el('div', {}, el('p', {}, '⚠️ La verificación encontró problemas. Revisá el archivo antes de enviarlo:'), el('ul', {}, r.problemas.map(p => el('li', {}, p)))),
        r.noUbicados.length ? el('div', {}, el('p', {}, `No se pudieron ubicar ${r.noUbicados.length} (corregí el texto de anclaje en "Editar" y volvé a generar):`),
          el('ul', {}, r.noUbicados.map(n => el('li', {}, `${n.numero}. ${n.ubicacion} – ${n.error} ("${(n.ancla || '').slice(0, 80)}")`)))) : null,
        r.aplicados.some(a => a.ambiguo) ? el('p', {}, 'Nota: algún anclaje aparecía en más de un lugar; se usó la primera aparición.') : null,
        r.avisos.length ? el('details', {}, el('summary', {}, `Avisos sobre el texto con todo aceptado (${r.avisos.length})`), el('ul', {}, r.avisos.map(a => el('li', {}, a)))) : null,
        el('a', { class: 'boton', href: URL.createObjectURL(r.blob), download: nombre }, 'Descargar ' + nombre)));
    } catch (e) {
      salidas.append(el('div', { class: 'salida salida-mal' }, el('h4', {}, ctx.nombre), el('p', {}, 'No se pudo generar: ' + e.message)));
    }
  }
  if (!salidas.children.length) avisar('No hay observaciones tildadas para cargar en el Word.', 'error');
}

function textoComentario(o) {
  if (o.comentario && o.comentario.trim()) return `Obs. ${o.numero}. ${o.comentario.trim()}`;
  if (o.accion === 'comentar') return `Obs. ${o.numero}. ${[o.explicacion, o.norma && 'Norma: ' + o.norma, o.redaccion_propuesta && 'Se sugiere: ' + o.redaccion_propuesta].filter(Boolean).join(' ')}`;
  return '';
}

// ---------- Informe como texto ----------

function informeTexto() {
  const inf = estado.informe;
  const c = contarSemaforo(inf);
  const L = ['# Revisión SA-UNDEF', '', inf.conclusion, ''];
  for (const d of inf.documentos) L.push(`- **${d.archivo}** — ${[d.tipo, d.carrera, d.unidad_academica, d.nivel, d.modalidad, d.nueva_o_modificacion].filter(Boolean).join(' · ')}`);
  L.push('', `**Semáforo:** 🔴 ${c.rojo} · 🟡 ${c.amarillo} · 🟠 ${c.naranja} · 🟢 ${c.verde}`);
  const ic = { rojo: '🔴', amarillo: '🟡', naranja: '🟠', verde: '🟢' };
  if (inf.normativa_faltante.length) L.push('', '## Normativa que no se pudo verificar', ...inf.normativa_faltante.map(n => `- ${n.norma}${n.donde ? ' (citada en ' + n.donde + ')' : ''}${n.que_no_se_verifico ? ' — ' + n.que_no_se_verifico : ''}`));
  if (inf.seguimiento.length) L.push('', '## Seguimiento de la revisión anterior', ...inf.seguimiento.map(s => `- ${Exportar.SEGUIMIENTO[s.estado]} — ${s.numero_anterior}. ${s.ubicacion}${s.resumen ? ': ' + s.resumen : ''}${s.detalle ? ' (' + s.detalle + ')' : ''}`));
  if (inf.revisado.length) L.push('', '## Qué se revisó', ...inf.revisado.map(t => '- ' + t));
  if (inf.correcto.length) L.push('', '## ✅ Lo que está correcto', ...inf.correcto.map(t => '- ✅ ' + t));
  if (inf.ya_senalado.length) L.push('', '## Ya señalado y pendiente', ...inf.ya_senalado.map(y => `- **${y.referencia}**${y.ubicacion ? ' (' + y.ubicacion + ')' : ''}: ${y.pedido}${y.falta ? ' — Falta: ' + y.falta : ''}`));
  if (inf.observaciones.length) L.push('', '## Observaciones, correcciones y agregados');
  for (const o of inf.observaciones) {
    L.push('', `${o.numero}. ${ic[o.semaforo] || ''} **${o.ubicacion}**${estado.documentos.length > 1 ? ' [' + o.archivo + ']' : ''}`);
    if (o.documento_dice) L.push(`   - Dice: ${o.documento_dice}`);
    if (o.norma) L.push(`   - Norma: ${o.norma}`);
    if (o.explicacion) L.push(`   - ${o.explicacion}`);
    if (o.redaccion_propuesta) L.push('', ...o.redaccion_propuesta.split('\n').map(l => '   > ' + l));
  }
  if (inf.a_verificar.length) L.push('', '## Puntos a verificar', ...inf.a_verificar.map(x => `- ${x.ubicacion ? '**' + x.ubicacion + ':** ' : ''}${x.texto}`));
  if (inf.requisitos_militares.items.length) L.push('', '## 🎖️ Requisitos propios de carrera militar', inf.requisitos_militares.contexto, ...inf.requisitos_militares.items.map(x => `- ${x.ubicacion ? '**' + x.ubicacion + ':** ' : ''}${x.texto}`));
  if (inf.no_aplica.length) L.push('', '## N/A (no aplica)', ...inf.no_aplica.map(n => `- ${n.punto}: ${n.motivo}`));
  if (inf.siguiente_paso) L.push('', '## Siguiente paso', inf.siguiente_paso);
  return L.join('\n');
}

async function copiarTexto(texto, ok) {
  try { await navigator.clipboard.writeText(texto); avisar(ok); }
  catch (e) { avisar('No se pudo copiar automáticamente.', 'error'); }
}

function descargar(blob, nombre) {
  const a = el('a', { href: URL.createObjectURL(blob), download: nombre });
  document.body.append(a); a.click(); a.remove();
}

// ---------- Avisos ----------

function avisar(msg, tipo = 'info') {
  const a = el('div', { class: 'aviso aviso-' + tipo, role: tipo === 'error' ? 'alert' : 'status' }, msg,
    el('button', { type: 'button', 'aria-label': 'Cerrar', onclick: e => e.target.parentNode.remove() }, '×'));
  $('#avisos').append(a);
  if (tipo !== 'error') setTimeout(() => a.remove(), 6000);
}

// ---------- Inicio ----------

document.addEventListener('DOMContentLoaded', () => {
  iniciarPreferencias();
  detectarModo();
  dibujarGuardadas();
  const input = $('#archivos');
  input.addEventListener('change', () => { cargarArchivos(Array.from(input.files)); input.value = ''; });
  const zona = $('#zona');
  ['dragenter', 'dragover'].forEach(t => zona.addEventListener(t, e => { e.preventDefault(); zona.classList.add('sobre'); }));
  ['dragleave', 'drop'].forEach(t => zona.addEventListener(t, e => { e.preventDefault(); zona.classList.remove('sobre'); }));
  zona.addEventListener('drop', e => cargarArchivos(Array.from(e.dataTransfer.files)));
  $('#revisar').addEventListener('click', revisarLocal);
  $('#cancelar').addEventListener('click', cancelarLocal);
  $('#boton-recuperar').addEventListener('click', recuperarResultado);
  $('#copiar-pedido').addEventListener('click', copiarPedido);
  $('#descargar-pedido').addEventListener('click', descargarPedido);
  $('#cargar-respuesta').addEventListener('click', cargarRespuestaPegada);
  $('#generar').addEventListener('click', generarWord);
  $('#copiar').addEventListener('click', () => copiarTexto(informeTexto(), 'Informe copiado al portapapeles.'));
  $('#descargar-informe').addEventListener('click', descargarInformeDocx);
  $('#nota').addEventListener('input', () => { if (estado.revision) { estado.revision.nota = $('#nota').value; programarGuardado(); } });
  $('#copiar-nota').addEventListener('click', () => copiarTexto($('#nota').value, 'Nota copiada al portapapeles.'));
  $('#descargar-nota').addEventListener('click', descargarNotaDocx);
  $('#regenerar-nota').addEventListener('click', () => { if (!estado.revision) return; estado.revision.nota = Exportar.textoNota(datosExportacion()); $('#nota').value = estado.revision.nota; programarGuardado(); });
  $('#planilla').addEventListener('click', descargarPlanilla);
  const imp = $('#importar');
  imp.addEventListener('change', () => { if (imp.files[0]) importarRevision(imp.files[0]); imp.value = ''; });
  if (typeof JSZip === 'undefined') avisar('No se pudo cargar la biblioteca JSZip (cdnjs). Revisá la conexión a internet.', 'error');
});
