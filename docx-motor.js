// Motor .docx: lee el documento (texto, control de cambios y comentarios previos)
// y escribe correcciones como control de cambios real (w:ins / w:del) y comentarios,
// sin tocar las marcas ni los comentarios de otros revisores.
// Requiere JSZip (se carga desde cdnjs en index.html).

const W_NS = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
const W14_NS = 'http://schemas.microsoft.com/office/word/2010/wordml';
const W15_NS = 'http://schemas.microsoft.com/office/word/2012/wordml';
const XML_DECL = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r\n';
const MARCAS = ['ins', 'del', 'moveFrom', 'moveTo'];
const CONTENIDO_SIMPLE = ['t', 'tab', 'br', 'cr', 'noBreakHyphen', 'softHyphen', 'lastRenderedPageBreak'];
const SEPARADOR = '\u0000'; // corta el texto plano donde hay marcas ajenas

const esW = (n, nombre) => n && n.nodeType === 1 && n.namespaceURI === W_NS && n.localName === nombre;
const hijosW = (n, nombre) => Array.from(n.childNodes).filter(c => esW(c, nombre));
const parsear = s => new DOMParser().parseFromString(s, 'application/xml');
const serializar = d => XML_DECL + new XMLSerializer().serializeToString(d).replace(/^<\?xml[^>]*\?>\s*/, '');

function parrafoDe(n) {
  for (let p = n.parentNode; p; p = p.parentNode) if (esW(p, 'p')) return p;
  return null;
}
// Marca de revisión (ins/del/move) entre el nodo y su párrafo, si existe.
function marcaDe(n, P) {
  for (let p = n.parentNode; p && p !== P; p = p.parentNode) {
    if (p.namespaceURI === W_NS && MARCAS.includes(p.localName)) return p;
  }
  return null;
}
function hijoDirecto(n, P) {
  let x = n;
  while (x && x.parentNode !== P) x = x.parentNode;
  return x;
}
function textoDe(n) {
  if (esW(n, 't') || esW(n, 'delText')) return n.textContent;
  if (esW(n, 'tab')) return '\t';
  return '';
}
function normalizar(s) {
  return s.replace(/[   ]/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
    .replace(/[–—]/g, '-');
}

// ---------- Apertura ----------

async function abrirDocx(archivo) {
  const buffer = await archivo.arrayBuffer();
  const zip = await JSZip.loadAsync(buffer);
  const leer = async ruta => (zip.file(ruta) ? zip.file(ruta).async('string') : null);
  const ctx = {
    nombre: archivo.name,
    buffer,
    zip,
    docXmlOriginal: await leer('word/document.xml'),
    commentsXml: await leer('word/comments.xml'),
    commentsExtXml: await leer('word/commentsExtended.xml'),
    tiposXml: await leer('[Content_Types].xml'),
    relsXml: await leer('word/_rels/document.xml.rels'),
  };
  if (!ctx.docXmlOriginal) throw new Error(`${archivo.name}: no parece un .docx válido (falta word/document.xml).`);
  ctx.doc = parsear(ctx.docXmlOriginal);
  ctx.comments = ctx.commentsXml ? parsear(ctx.commentsXml) : null;
  indexarParrafos(ctx);
  return ctx;
}

function indexarParrafos(ctx) {
  const body = ctx.doc.getElementsByTagNameNS(W_NS, 'body')[0];
  const tablas = Array.from(body.getElementsByTagNameNS(W_NS, 'tbl'));
  ctx.parrafos = Array.from(body.getElementsByTagNameNS(W_NS, 'p'));
  ctx.ids = new Map();
  ctx.parrafos.forEach((p, i) => {
    const id = 'P' + (i + 1);
    p.__id = id;
    ctx.ids.set(id, p);
    let tc = null, tbl = null;
    for (let x = p.parentNode; x; x = x.parentNode) {
      if (!tc && esW(x, 'tc')) tc = x;
      if (esW(x, 'tbl')) { tbl = x; break; }
    }
    if (tbl) {
      const tr = tc ? tc.parentNode : null;
      const fila = tr ? hijosW(tr.parentNode, 'tr').indexOf(tr) + 1 : 0;
      const col = tc && tr ? hijosW(tr, 'tc').indexOf(tc) + 1 : 0;
      p.__tabla = `tabla ${tablas.indexOf(tbl) + 1}, fila ${fila}, col ${col}`;
    }
  });
}

// ---------- Lectura para el modelo ----------

function nodosDeTexto(P) {
  const out = [];
  const walker = P.ownerDocument.createTreeWalker(P, NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (n.namespaceURI !== W_NS) continue;
    if (['t', 'delText', 'tab', 'commentRangeStart', 'commentRangeEnd'].includes(n.localName) && parrafoDe(n) === P) out.push(n);
  }
  return out;
}

function autorDe(m) { return m.getAttributeNS(W_NS, 'author') || '¿?'; }

// Texto del párrafo con marcas ajenas visibles: ⟦+Autor: …⟧ inserción, ⟦−Autor: …⟧ eliminación, «#n»…«/#n» comentarios.
function textoParrafo(P) {
  let s = '';
  let marcaActual = null;
  const cerrar = () => { if (marcaActual) { s += '⟧'; marcaActual = null; } };
  for (const n of nodosDeTexto(P)) {
    if (esW(n, 'commentRangeStart')) { cerrar(); s += `«#${n.getAttributeNS(W_NS, 'id')}»`; continue; }
    if (esW(n, 'commentRangeEnd')) { cerrar(); s += `«/#${n.getAttributeNS(W_NS, 'id')}»`; continue; }
    const m = marcaDe(n, P);
    if (m !== marcaActual) {
      cerrar();
      if (m) {
        const signo = (m.localName === 'ins' || m.localName === 'moveTo') ? '+' : '−';
        s += `⟦${signo}${autorDe(m)}: `;
        marcaActual = m;
      }
    }
    s += textoDe(n);
  }
  cerrar();
  return s;
}

function leerComentarios(ctx) {
  if (!ctx.comments) return [];
  const lista = Array.from(ctx.comments.getElementsByTagNameNS(W_NS, 'comment')).map(c => ({
    id: c.getAttributeNS(W_NS, 'id'),
    autor: c.getAttributeNS(W_NS, 'author') || '',
    fecha: (c.getAttributeNS(W_NS, 'date') || '').slice(0, 10),
    texto: Array.from(c.getElementsByTagNameNS(W_NS, 'p')).map(p => Array.from(p.getElementsByTagNameNS(W_NS, 't')).map(t => t.textContent).join('')).join('\n').trim(),
    paraIds: Array.from(c.getElementsByTagNameNS(W_NS, 'p')).map(p => p.getAttributeNS(W14_NS, 'paraId')).filter(Boolean),
    ancla: '',
    padre: null,
  }));
  // Texto anclado de cada comentario
  const abiertos = new Set();
  const porId = new Map(lista.map(c => [c.id, c]));
  const body = ctx.doc.getElementsByTagNameNS(W_NS, 'body')[0];
  const walker = ctx.doc.createTreeWalker(body, NodeFilter.SHOW_ELEMENT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    if (esW(n, 'commentRangeStart')) abiertos.add(n.getAttributeNS(W_NS, 'id'));
    else if (esW(n, 'commentRangeEnd')) abiertos.delete(n.getAttributeNS(W_NS, 'id'));
    else if (esW(n, 't') || esW(n, 'delText')) for (const id of abiertos) { const c = porId.get(id); if (c && c.ancla.length < 300) c.ancla += n.textContent; }
  }
  // Hilos (respuestas) desde commentsExtended.xml
  if (ctx.commentsExtXml) {
    const ext = parsear(ctx.commentsExtXml);
    const porPara = new Map();
    lista.forEach(c => c.paraIds.forEach(pid => porPara.set(pid, c)));
    for (const e of Array.from(ext.getElementsByTagNameNS(W15_NS, 'commentEx'))) {
      const hijo = porPara.get(e.getAttributeNS(W15_NS, 'paraId'));
      const padre = porPara.get(e.getAttributeNS(W15_NS, 'paraIdParent'));
      if (hijo && padre) hijo.padre = padre.id;
    }
  }
  return lista;
}

function representacionParaModelo(ctx) {
  const lineas = [`=== DOCUMENTO: ${ctx.nombre} ===`];
  for (const P of ctx.parrafos) {
    const t = textoParrafo(P);
    if (!t.trim()) continue;
    lineas.push(`[${P.__id}${P.__tabla ? ' | ' + P.__tabla : ''}] ${t}`);
  }
  const coms = leerComentarios(ctx);
  lineas.push('', `=== COMENTARIOS EXISTENTES EN ${ctx.nombre} (${coms.length}) ===`);
  for (const c of coms) {
    lineas.push(`#${c.id} | ${c.autor} | ${c.fecha}${c.padre ? ' | respuesta a #' + c.padre : ''} | anclado en: "${c.ancla.trim().slice(0, 200)}" | dice: ${c.texto}`);
  }
  return lineas.join('\n');
}

// ---------- Búsqueda del ancla ----------

function mapaPlano(P) {
  const entradas = [];
  let texto = '';
  let ultimaMarca = null;
  for (const n of nodosDeTexto(P)) {
    if (esW(n, 'commentRangeStart') || esW(n, 'commentRangeEnd')) continue;
    const m = marcaDe(n, P);
    if (m) {
      if (m !== ultimaMarca) texto += SEPARADOR;
      ultimaMarca = m;
      continue;
    }
    ultimaMarca = null;
    if (esW(n, 'delText')) continue;
    const v = textoDe(n);
    if (!v) continue;
    const run = n.parentNode;
    if (!esW(run, 'r')) continue;
    entradas.push({ nodo: n, run, ini: texto.length, fin: texto.length + v.length });
    texto += v;
  }
  return { texto, entradas };
}

function limpiarAncla(a) {
  return (a || '').replace(/«\/?#\d+»/g, '').replace(/⟦[^⟧]*⟧/g, '');
}

function buscarAncla(ctx, parrafoId, ancla) {
  const a = limpiarAncla(ancla);
  if (!a) return null;
  const candidatos = [];
  const P0 = ctx.ids.get((parrafoId || '').trim());
  const orden = P0 ? [P0, ...ctx.parrafos.filter(p => p !== P0)] : ctx.parrafos;
  for (const P of orden) {
    const { texto } = mapaPlano(P);
    let i = texto.indexOf(a);
    if (i < 0) i = normalizar(texto).indexOf(normalizar(a));
    if (i < 0) {
      // tolerar espacios múltiples o finales distintos
      const re = new RegExp(normalizar(a).trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+'));
      const m = re.exec(normalizar(texto));
      if (m) { candidatos.push({ P, ini: m.index, fin: m.index + m[0].length }); if (P === P0) break; }
      continue;
    }
    candidatos.push({ P, ini: i, fin: i + a.length });
    if (P === P0) break;
  }
  if (!candidatos.length) return null;
  const r = candidatos[0];
  r.ambiguo = !P0 && candidatos.length > 1;
  return r;
}

// ---------- Manipulación de corridas ----------

function rPrLimpio(run) {
  const rPr = hijosW(run, 'rPr')[0];
  if (!rPr) return null;
  const c = rPr.cloneNode(true);
  for (const x of Array.from(c.childNodes)) if (esW(x, 'rPrChange') || esW(x, 'ins') || esW(x, 'del')) c.removeChild(x);
  return c;
}

function explotarCorrida(run) {
  const contenido = Array.from(run.childNodes).filter(c => c.nodeType === 1 && !esW(c, 'rPr'));
  if (contenido.length <= 1) return;
  if (!contenido.every(c => c.namespaceURI === W_NS && CONTENIDO_SIMPLE.includes(c.localName))) return;
  const rPr = hijosW(run, 'rPr')[0];
  const padre = run.parentNode;
  contenido.forEach((c, i) => {
    const nr = run.cloneNode(false);
    if (rPr) nr.appendChild(rPr.cloneNode(true));
    nr.appendChild(c.cloneNode(true));
    if (i > 0) renumerar(nr);
    padre.insertBefore(nr, run);
  });
  padre.removeChild(run);
}

// Contador de identificadores de revisión: lo fija el Editor; al partir una corrida que trae
// un cambio de formato ajeno (w:rPrChange) la copia recibe un id nuevo para no duplicarlo.
const contador = { sig: 9001 };
function renumerar(run) {
  for (const x of Array.from(run.getElementsByTagNameNS(W_NS, 'rPrChange'))) x.setAttributeNS(W_NS, 'w:id', String(contador.sig++));
}

function preservar(t) { t.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve'); }

function cortarEn(P, off) {
  let { entradas } = mapaPlano(P);
  let e = entradas.find(x => x.ini < off && off < x.fin);
  if (!e) return;
  explotarCorrida(e.run);
  ({ entradas } = mapaPlano(P));
  e = entradas.find(x => x.ini < off && off < x.fin);
  if (!e || !esW(e.nodo, 't')) return;
  const corte = off - e.ini;
  const texto = e.nodo.textContent;
  const r2 = e.run.cloneNode(true);
  renumerar(r2);
  const t2 = hijosW(r2, 't')[0];
  e.nodo.textContent = texto.slice(0, corte); preservar(e.nodo);
  t2.textContent = texto.slice(corte); preservar(t2);
  e.run.parentNode.insertBefore(r2, e.run.nextSibling);
}

function aislar(P, ini, fin) {
  cortarEn(P, ini);
  cortarEn(P, fin);
  const { entradas } = mapaPlano(P);
  const runs = [];
  for (const e of entradas) if (e.ini >= ini && e.fin <= fin && !runs.includes(e.run)) runs.push(e.run);
  return runs;
}

// ---------- Escritura de marcas ----------

class Editor {
  constructor(ctx, autor) {
    this.ctx = ctx;
    this.doc = ctx.doc;
    this.autor = autor;
    this.fecha = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    let max = 9000;
    const ver = d => { if (!d) return; for (const el of Array.from(d.getElementsByTagName('*'))) { const v = parseInt(el.getAttributeNS(W_NS, 'id'), 10); if (!isNaN(v) && v > max && v < 1e9) max = v; } };
    ver(ctx.doc); ver(ctx.comments);
    contador.sig = max + 1;
    this.comentariosNuevos = [];
  }
  get sigId() { return contador.sig; }
  set sigId(v) { contador.sig = v; }
  el(nombre) { return this.doc.createElementNS(W_NS, 'w:' + nombre); }
  marca(nombre) {
    const m = this.el(nombre);
    m.setAttributeNS(W_NS, 'w:id', String(this.sigId++));
    m.setAttributeNS(W_NS, 'w:author', this.autor);
    m.setAttributeNS(W_NS, 'w:date', this.fecha);
    return m;
  }
  corridaNueva(texto, runRef) {
    const r = this.el('r');
    const rPr = runRef ? rPrLimpio(runRef) : null;
    const rp = rPr ? this.doc.importNode(rPr, true) : this.el('rPr');
    if (/\[COMPLETAR/.test(texto) && !hijosW(rp, 'i').length) rp.appendChild(this.el('i'));
    if (rp.childNodes.length) r.appendChild(rp);
    const partes = texto.split('\t');
    partes.forEach((parte, i) => {
      if (i > 0) r.appendChild(this.el('tab'));
      if (parte) { const t = this.el('t'); preservar(t); t.textContent = parte; r.appendChild(t); }
    });
    return r;
  }
  eliminarCorrida(run) {
    const d = this.marca('del');
    run.parentNode.insertBefore(d, run);
    d.appendChild(run);
    for (const t of hijosW(run, 't')) {
      const dt = this.el('delText'); preservar(dt); dt.textContent = t.textContent;
      run.replaceChild(dt, t);
    }
    return d;
  }
  insertarDespues(nodoRef, texto, runRef) {
    const ins = this.marca('ins');
    ins.appendChild(this.corridaNueva(texto, runRef));
    nodoRef.parentNode.insertBefore(ins, nodoRef.nextSibling);
    return ins;
  }
  insertarAntes(nodoRef, texto, runRef) {
    const ins = this.marca('ins');
    ins.appendChild(this.corridaNueva(texto, runRef));
    nodoRef.parentNode.insertBefore(ins, nodoRef);
    return ins;
  }

  // Devuelve {primero, ultimo, P} para anclar un comentario, o lanza error.
  reemplazar(P, ini, fin, nuevo) {
    const { texto } = mapaPlano(P);
    const viejo = texto.slice(ini, fin);
    // cambio mínimo: recortar prefijo y sufijo comunes (sin partir palabras a la mitad)
    let a = 0;
    while (a < viejo.length && a < nuevo.length && viejo[a] === nuevo[a]) a++;
    while (a > 0 && /\w/.test(viejo[a - 1]) && (/\w/.test(viejo[a] || '') || /\w/.test(nuevo[a] || ''))) a--;
    let b = 0;
    while (b < viejo.length - a && b < nuevo.length - a && viejo[viejo.length - 1 - b] === nuevo[nuevo.length - 1 - b]) b++;
    while (b > 0 && /\w/.test(viejo[viejo.length - b]) && (/\w/.test(viejo[viejo.length - b - 1] || '') || /\w/.test(nuevo[nuevo.length - b - 1] || ''))) b--;
    const dIni = ini + a, dFin = fin - b;
    const textoNuevo = nuevo.slice(a, nuevo.length - b);
    if (dIni === dFin && !textoNuevo) throw new Error('el texto propuesto es igual al actual');
    if (dIni === dFin) return this.insertarEn(P, dIni, textoNuevo);
    const runs = aislar(P, dIni, dFin);
    if (!runs.length) throw new Error('no se pudo aislar el texto a reemplazar');
    const dels = runs.map(r => this.eliminarCorrida(r));
    let ultimo = dels[dels.length - 1];
    if (textoNuevo) ultimo = this.insertarDespues(ultimo, textoNuevo, runs[runs.length - 1]);
    return { P, primero: dels[0], ultimo };
  }
  eliminar(P, ini, fin) {
    const runs = aislar(P, ini, fin);
    if (!runs.length) throw new Error('no se pudo aislar el texto a eliminar');
    const dels = runs.map(r => this.eliminarCorrida(r));
    return { P, primero: dels[0], ultimo: dels[dels.length - 1] };
  }
  insertarEn(P, off, texto) {
    cortarEn(P, off);
    const { entradas } = mapaPlano(P);
    const antes = entradas.filter(e => e.fin <= off).pop();
    const despues = entradas.find(e => e.ini >= off);
    let ins;
    if (antes) ins = this.insertarDespues(antes.run, texto, antes.run);
    else if (despues) ins = this.insertarAntes(despues.run, texto, despues.run);
    else { ins = this.marca('ins'); ins.appendChild(this.corridaNueva(texto, null)); P.appendChild(ins); }
    return { P, primero: ins, ultimo: ins };
  }
  insertarParrafo(Pref, texto) {
    const np = this.el('p');
    const pPrRef = hijosW(Pref, 'pPr')[0];
    const pPr = pPrRef ? pPrRef.cloneNode(true) : this.el('pPr');
    for (const x of Array.from(pPr.childNodes)) if (esW(x, 'pPrChange') || esW(x, 'numPr') || esW(x, 'sectPr')) pPr.removeChild(x);
    let rPr = hijosW(pPr, 'rPr')[0];
    if (!rPr) { rPr = this.el('rPr'); pPr.appendChild(rPr); }
    for (const x of Array.from(rPr.childNodes)) if (esW(x, 'ins') || esW(x, 'del') || esW(x, 'rPrChange')) rPr.removeChild(x);
    rPr.insertBefore(this.marca('ins'), rPr.firstChild);
    np.appendChild(pPr);
    const { entradas } = mapaPlano(Pref);
    const runRef = entradas.length ? entradas[entradas.length - 1].run : null;
    const lineas = texto.split('\n');
    const parrafos = [np];
    lineas.forEach((linea, i) => {
      let p = np;
      if (i > 0) { p = np.cloneNode(false); const pp = pPr.cloneNode(true); hijosW(pp, 'rPr')[0].firstChild.setAttributeNS(W_NS, 'w:id', String(this.sigId++)); p.appendChild(pp); parrafos.push(p); }
      const ins = this.marca('ins');
      ins.appendChild(this.corridaNueva(linea, runRef));
      p.appendChild(ins);
    });
    let ref = Pref;
    for (const p of parrafos) { ref.parentNode.insertBefore(p, ref.nextSibling); ref = p; }
    return { P: np, primero: np.lastChild, ultimo: parrafos[parrafos.length - 1].lastChild };
  }

  comentar(rango, texto) {
    const id = String(this.sigId++);
    const { P } = rango;
    let primero = rango.primero, ultimo = rango.ultimo;
    const P2 = parrafoDe(ultimo) || P;
    if (primero.parentNode !== ultimo.parentNode || P2 !== P) {
      primero = hijoDirecto(primero, P);
      ultimo = hijoDirecto(ultimo, P2);
    }
    const ini = this.el('commentRangeStart'); ini.setAttributeNS(W_NS, 'w:id', id);
    const fin = this.el('commentRangeEnd'); fin.setAttributeNS(W_NS, 'w:id', id);
    const ref = this.el('r');
    const cr = this.el('commentReference'); cr.setAttributeNS(W_NS, 'w:id', id);
    ref.appendChild(cr);
    primero.parentNode.insertBefore(ini, primero);
    ultimo.parentNode.insertBefore(fin, ultimo.nextSibling);
    fin.parentNode.insertBefore(ref, fin.nextSibling);
    this.comentariosNuevos.push({ id, texto });
    return id;
  }

  // Anclar un comentario sobre texto existente sin modificarlo
  rangoDeTexto(P, ini, fin) {
    const runs = aislar(P, ini, fin);
    if (!runs.length) throw new Error('no se pudo aislar el texto');
    return { P, primero: runs[0], ultimo: runs[runs.length - 1] };
  }
}

// ---------- Ensamblado ----------

function escaparXml(s) { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }

function xmlComentarios(ctx, editor) {
  const iniciales = (editor.autor.split(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]+/).filter(Boolean)[0] || 'SA').slice(0, 4);
  const nodos = editor.comentariosNuevos.map(c => {
    const parrafos = c.texto.split('\n').map(l => `<w:p><w:pPr><w:pStyle w:val="CommentText"/></w:pPr><w:r><w:t xml:space="preserve">${escaparXml(l)}</w:t></w:r></w:p>`).join('');
    return `<w:comment w:id="${c.id}" w:author="${escaparXml(editor.autor)}" w:date="${editor.fecha}" w:initials="${escaparXml(iniciales)}">${parrafos}</w:comment>`;
  }).join('');
  if (ctx.commentsXml) {
    const d = parsear(ctx.commentsXml);
    const nuevos = parsear(`<w:comments xmlns:w="${W_NS}">${nodos}</w:comments>`).documentElement;
    for (const c of Array.from(nuevos.childNodes)) d.documentElement.appendChild(d.importNode(c, true));
    return serializar(d);
  }
  return XML_DECL + `<w:comments xmlns:w="${W_NS}">${nodos}</w:comments>`;
}

// partes: { 'word/document.xml': xml, 'word/comments.xml': xml, … } que reemplazan a las del original
async function generarDocx(ctx, partes) {
  const zip = await JSZip.loadAsync(ctx.buffer); // copia fresca del original
  for (const [ruta, contenido] of Object.entries(partes)) zip.file(ruta, contenido);
  if (partes['word/comments.xml']) {
    if (!ctx.commentsXml) {
      let tipos = ctx.tiposXml;
      if (!/PartName="\/word\/comments\.xml"/.test(tipos)) {
        tipos = tipos.replace('</Types>', '<Override PartName="/word/comments.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.comments+xml"/></Types>');
        zip.file('[Content_Types].xml', tipos);
      }
      let rels = ctx.relsXml;
      if (!/Target="comments\.xml"/.test(rels)) {
        rels = rels.replace('</Relationships>', '<Relationship Id="rIdSAUNDEF1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments" Target="comments.xml"/></Relationships>');
        zip.file('word/_rels/document.xml.rels', rels);
      }
    }
  }
  return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
}

// ---------- Verificación (equivale al chequeo del §8.3 del método) ----------

function huellaMarcas(xml, autorPropio) {
  const d = parsear(xml);
  if (autorPropio) {
    const propias = n => n.getAttributeNS(W_NS, 'author') === autorPropio;
    // rechazar inserciones propias
    for (const ins of Array.from(d.getElementsByTagNameNS(W_NS, 'ins')).filter(propias)) {
      const padre = ins.parentNode;
      if (esW(padre, 'rPr')) {
        // párrafo insertado: eliminar el párrafo completo
        const p = parrafoDe(ins) || padre.parentNode.parentNode;
        if (p && p.parentNode) p.parentNode.removeChild(p);
      } else if (padre) padre.removeChild(ins);
    }
    // rechazar eliminaciones propias
    for (const del of Array.from(d.getElementsByTagNameNS(W_NS, 'del')).filter(propias)) {
      const padre = del.parentNode;
      if (!padre) continue;
      for (const dt of Array.from(del.getElementsByTagNameNS(W_NS, 'delText'))) {
        const t = d.createElementNS(W_NS, 'w:t'); t.textContent = dt.textContent; dt.parentNode.replaceChild(t, dt);
      }
      while (del.firstChild) padre.insertBefore(del.firstChild, del);
      padre.removeChild(del);
    }
  }
  const contar = nombre => Array.from(d.getElementsByTagNameNS(W_NS, nombre)).length;
  const textoMarcas = nombre => Array.from(d.getElementsByTagNameNS(W_NS, nombre)).map(m => autorDe(m) + ':' + Array.from(m.getElementsByTagName('*')).filter(x => esW(x, 't') || esW(x, 'delText')).map(x => x.textContent).join('')).join('|');
  const todo = Array.from(d.getElementsByTagName('*')).filter(x => esW(x, 't') || esW(x, 'delText')).map(x => x.textContent).join('');
  return {
    ins: contar('ins'), del: contar('del'), moveFrom: contar('moveFrom'), moveTo: contar('moveTo'),
    insTexto: textoMarcas('ins'), delTexto: textoMarcas('del'),
    cambiosFormato: ['rPrChange', 'pPrChange', 'tcPrChange', 'trPrChange', 'sectPrChange', 'tblPrChange'].reduce((a, n) => a + contar(n), 0),
    texto: todo.replace(/\s+/g, ' '),
  };
}

function verificar(ctx, editor, xmlNuevo) {
  const problemas = [];
  const o = huellaMarcas(ctx.docXmlOriginal, null);
  const n = huellaMarcas(xmlNuevo, editor.autor);
  for (const k of ['ins', 'del', 'moveFrom', 'moveTo']) if (o[k] !== n[k]) problemas.push(`Cambió la cantidad de marcas previas "${k}" (${o[k]} → ${n[k]}).`);
  if (o.insTexto !== n.insTexto) problemas.push('Cambió el texto de inserciones de otros revisores.');
  if (o.delTexto !== n.delTexto) problemas.push('Cambió el texto de eliminaciones de otros revisores.');
  if (n.cambiosFormato < o.cambiosFormato) problemas.push('Se perdieron cambios de formato de otros revisores.');
  if (o.texto !== n.texto) problemas.push('Rechazando las marcas propias, el texto no vuelve exactamente al original.');
  const refs = x => (x.match(/<w:commentReference\b/g) || []).length;
  if (refs(xmlNuevo) !== refs(ctx.docXmlOriginal) + editor.comentariosNuevos.length) problemas.push('No coincide la cantidad de comentarios (previos + nuevos).');
  if (ctx.commentsXml) {
    const idsPrevios = (ctx.commentsXml.match(/<w:comment\b[^>]*w:id="(\d+)"/g) || []).length;
    const nuevoComments = xmlComentarios(ctx, editor);
    const idsAhora = (nuevoComments.match(/<w:comment\b[^>]*w:id="(\d+)"/g) || []).length;
    if (idsAhora !== idsPrevios + editor.comentariosNuevos.length) problemas.push('Se alteraron comentarios previos.');
  }
  return problemas;
}

// Advertencias sobre el texto con todo aceptado (restos de puntuación, espacios perdidos)
function advertenciasAceptado(xml) {
  const d = parsear(xml);
  const avisos = [];
  for (const P of Array.from(d.getElementsByTagNameNS(W_NS, 'p'))) {
    let s = '';
    for (const n of nodosDeTexto(P)) {
      if (esW(n, 't') && !(marcaDe(n, P) && ['del', 'moveFrom'].includes(marcaDe(n, P).localName))) s += n.textContent;
      if (esW(n, 'tab')) s += ' ';
    }
    if (/,,|\.\.(?!\.)|\s[,.;:]\S/.test(s)) avisos.push(`Puntuación dudosa: "…${s.match(/.{0,30}(,,|\.\.|\s[,.;:]\S).{0,30}/)[0]}…"`);
    const pegadas = s.match(/[a-záéíóúñ]{3,}(?:y|la|el|de)[A-ZÁÉÍÓÚ][a-záéíóú]+/g);
    if (pegadas) avisos.push(`Posible espacio perdido: "${pegadas[0]}"`);
  }
  return avisos.slice(0, 15);
}

// ---------- Aplicación de hallazgos ----------

// ---------- Unificación de autores ----------
// Pone como autor a SA-UNDEF en todas las marcas de revisión y comentarios previos,
// sin aceptar, rechazar ni borrar nada (se conservan fechas, textos e hilos).
async function unificarAutores(ctx, partes, autor) {
  const problemas = [];
  let cantidad = 0;
  const autorXml = escaparXml(autor);
  const iniciales = escaparXml((autor.split(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]+/).filter(Boolean)[0] || 'SA').slice(0, 4));
  const sinAutores = s => s.replace(/\sw:(author|initials)="[^"]*"/g, '');
  const cambiar = (ruta, antes) => {
    let n = 0;
    let despues = antes.replace(/(\sw:author=")([^"]*)(")/g, (m, a, v, c) => { if (v !== autorXml) n++; return a + autorXml + c; });
    if (ruta === 'word/comments.xml') despues = despues.replace(/(\sw:initials=")([^"]*)(")/g, (m, a, v, c) => a + iniciales + c);
    if (sinAutores(antes) !== sinAutores(despues)) problemas.push(`La unificación de autores alteró algo más que el autor en ${ruta}.`);
    cantidad += n;
    return despues;
  };
  for (const ruta of Object.keys(partes)) partes[ruta] = cambiar(ruta, partes[ruta]);
  // Encabezados, pies y notas también pueden tener control de cambios
  for (const ruta of Object.keys(ctx.zip.files)) {
    if (partes[ruta] || !/^word\/(header\d*|footer\d*|footnotes|endnotes)\.xml$/.test(ruta)) continue;
    const s = await ctx.zip.file(ruta).async('string');
    if (/\sw:author="/.test(s)) partes[ruta] = cambiar(ruta, s);
  }
  return { cantidad, problemas };
}

async function aplicarHallazgos(ctx, items, autor, opciones = {}) {
  // Trabajar sobre una copia fresca del XML original para poder regenerar varias veces
  ctx.doc = parsear(ctx.docXmlOriginal);
  indexarParrafos(ctx);
  const editor = new Editor(ctx, autor);
  const resultado = { aplicados: [], noUbicados: [] };
  for (const it of items) {
    try {
      const pos = buscarAncla(ctx, it.parrafo, it.ancla);
      if (!pos) throw new Error('no se encontró el texto de anclaje');
      let rango;
      switch (it.accion) {
        case 'reemplazar': rango = editor.reemplazar(pos.P, pos.ini, pos.fin, it.texto_nuevo || ''); break;
        case 'eliminar': rango = editor.eliminar(pos.P, pos.ini, pos.fin); break;
        case 'insertar': rango = editor.insertarEn(pos.P, pos.fin, it.texto_nuevo || ''); break;
        case 'insertar_parrafo': rango = editor.insertarParrafo(pos.P, it.texto_nuevo || ''); break;
        default: rango = editor.rangoDeTexto(pos.P, pos.ini, pos.fin);
      }
      if (it.comentario && it.comentario.trim()) editor.comentar(rango, it.comentario.trim());
      resultado.aplicados.push({ ...it, ambiguo: pos.ambiguo });
    } catch (e) {
      resultado.noUbicados.push({ ...it, error: e.message });
    }
  }
  const xmlNuevo = serializar(ctx.doc);
  resultado.problemas = verificar(ctx, editor, xmlNuevo);
  resultado.avisos = advertenciasAceptado(xmlNuevo);
  // La verificación se hace ANTES de unificar autores (necesita distinguir las marcas propias de las ajenas)
  const partes = { 'word/document.xml': xmlNuevo };
  if (editor.comentariosNuevos.length || (opciones.unificar && ctx.commentsXml)) partes['word/comments.xml'] = xmlComentarios(ctx, editor);
  resultado.unificados = 0;
  if (opciones.unificar) {
    const u = await unificarAutores(ctx, partes, autor);
    resultado.unificados = u.cantidad;
    resultado.problemas.push(...u.problemas);
  }
  resultado.blob = await generarDocx(ctx, partes);
  resultado.cantidadComentarios = editor.comentariosNuevos.length;
  return resultado;
}

window.DocxMotor = { abrirDocx, representacionParaModelo, aplicarHallazgos, leerComentarios };
