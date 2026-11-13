// Archivos que se descargan: informe de revisión (.docx), nota de devolución (.docx)
// y planilla de seguimiento (.xlsx). Se arman desde cero con JSZip.

window.Exportar = (function () {
  const SEMAFORO = {
    rojo: { nombre: 'ROJO', fondo: 'C62828', letra: 'FFFFFF', desc: 'Fundamental: incumplimientos normativos, contradicciones de fondo y omisiones graves' },
    amarillo: { nombre: 'AMARILLO', fondo: 'F9A825', letra: '000000', desc: 'Omisiones, datos a completar o cuestiones a mejorar' },
    naranja: { nombre: 'NARANJA', fondo: 'EF6C00', letra: 'FFFFFF', desc: 'Puntuación, gramática, ortografía y cuestiones editoriales' },
    verde: { nombre: 'VERDE', fondo: '2E7D32', letra: 'FFFFFF', desc: 'Sugerencias' },
  };
  const ORDEN = ['rojo', 'amarillo', 'naranja', 'verde'];
  const SEGUIMIENTO = { resuelta: '✅ Resuelta', parcial: '⚠️ Resuelta a medias', pendiente: '❌ Pendiente', reintroducida: '🔁 Volvió a aparecer' };

  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // ---------- Word ----------

  function run(texto, o = {}) {
    const rPr = [o.b && '<w:b/>', o.i && '<w:i/>', o.color && `<w:color w:val="${o.color}"/>`, o.tam && `<w:sz w:val="${o.tam}"/><w:szCs w:val="${o.tam}"/>`,
      o.fondo && `<w:shd w:val="clear" w:color="auto" w:fill="${o.fondo}"/>`].filter(Boolean).join('');
    return String(texto == null ? '' : texto).split('\n').map((l, i) =>
      `<w:r>${rPr ? `<w:rPr>${rPr}</w:rPr>` : ''}${i ? '<w:br/>' : ''}<w:t xml:space="preserve">${esc(l)}</w:t></w:r>`).join('');
  }
  function par(contenido, o = {}) {
    const runs = Array.isArray(contenido) ? contenido.join('') : (typeof contenido === 'string' && contenido.startsWith('<w:r') ? contenido : run(contenido, o));
    const pPr = [o.estilo && `<w:pStyle w:val="${o.estilo}"/>`, o.juntoAlSiguiente && '<w:keepNext/>',
      o.sangria && `<w:ind w:left="${o.sangria}"/>`, o.antes != null && `<w:spacing w:before="${o.antes}" w:after="${o.despues == null ? 120 : o.despues}"/>`,
      o.alinear && `<w:jc w:val="${o.alinear}"/>`, o.borde && `<w:pBdr><w:left w:val="single" w:sz="24" w:space="8" w:color="${o.borde}"/></w:pBdr>`].filter(Boolean).join('');
    return `<w:p>${pPr ? `<w:pPr>${pPr}</w:pPr>` : ''}${runs}</w:p>`;
  }
  const titulo = (t, n = 1) => par(run(t), { estilo: 'Titulo' + n, juntoAlSiguiente: true });
  const vineta = (contenido) => par(contenido, { estilo: 'Vineta' });
  function etiqueta(color) {
    const s = SEMAFORO[color] || SEMAFORO.amarillo;
    return run(` ${s.nombre} `, { b: true, color: s.letra, fondo: s.fondo, tam: 18 });
  }
  function tabla(filas, anchos, o = {}) {
    const total = anchos.reduce((a, b) => a + b, 0);
    const grid = anchos.map(a => `<w:gridCol w:w="${a}"/>`).join('');
    const tr = filas.map((f, i) => `<w:tr>${f.map((c, j) => {
      const celda = typeof c === 'object' && c !== null && !Array.isArray(c) ? c : { contenido: c };
      const fondo = celda.fondo || (i === 0 && o.encabezado ? 'E8EEF7' : null);
      const contenido = celda.xml || run(celda.contenido, { b: i === 0 && o.encabezado, color: celda.letra, tam: 20 });
      return `<w:tc><w:tcPr><w:tcW w:w="${anchos[j]}" w:type="dxa"/>${fondo ? `<w:shd w:val="clear" w:color="auto" w:fill="${fondo}"/>` : ''}</w:tcPr><w:p><w:pPr><w:spacing w:before="40" w:after="40"/></w:pPr>${contenido}</w:p></w:tc>`;
    }).join('')}</w:tr>`).join('');
    return `<w:tbl><w:tblPr><w:tblW w:w="${total}" w:type="dxa"/><w:tblBorders>${['top', 'left', 'bottom', 'right', 'insideH', 'insideV'].map(b => `<w:${b} w:val="single" w:sz="4" w:space="0" w:color="BFC7D5"/>`).join('')}</w:tblBorders><w:tblCellMar><w:left w:w="100" w:type="dxa"/><w:right w:w="100" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${grid}</w:tblGrid>${tr}</w:tbl>` + par('', { antes: 0, despues: 60 });
  }

  const ESTILOS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="22"/><w:szCs w:val="22"/><w:lang w:val="es-AR"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="120" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style>
<w:style w:type="paragraph" w:styleId="Titulo0"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="60"/></w:pPr><w:rPr><w:b/><w:color w:val="1F4E8C"/><w:sz w:val="36"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Titulo1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="320" w:after="120"/><w:pBdr><w:bottom w:val="single" w:sz="6" w:space="2" w:color="1F4E8C"/></w:pBdr><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="1F4E8C"/><w:sz w:val="28"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Titulo2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Vineta"><w:name w:val="List Bullet"/><w:basedOn w:val="Normal"/><w:pPr><w:numPr><w:ilvl w:val="0"/><w:numId w:val="1"/></w:numPr><w:spacing w:after="60"/><w:ind w:left="360" w:hanging="360"/></w:pPr></w:style>
<w:style w:type="paragraph" w:styleId="Cita"><w:name w:val="Quote"/><w:basedOn w:val="Normal"/><w:pPr><w:ind w:left="567"/><w:pBdr><w:left w:val="single" w:sz="12" w:space="8" w:color="1F4E8C"/></w:pBdr><w:shd w:val="clear" w:color="auto" w:fill="F3F5F8"/></w:pPr><w:rPr><w:sz w:val="20"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Nota"><w:name w:val="Nota"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="5B6576"/><w:sz w:val="18"/></w:rPr></w:style>
</w:styles>`;
  const NUMERACION = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:numbering xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:abstractNum w:abstractNumId="0"><w:lvl w:ilvl="0"><w:start w:val="1"/><w:numFmt w:val="bullet"/><w:lvlText w:val="•"/><w:lvlJc w:val="left"/><w:pPr><w:ind w:left="360" w:hanging="360"/></w:pPr></w:lvl></w:abstractNum><w:num w:numId="1"><w:abstractNumId w:val="0"/></w:num></w:numbering>`;

  async function docx(cuerpo) {
    const zip = new JSZip();
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/numbering.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.numbering+xml"/></Types>`);
    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`);
    zip.file('word/_rels/document.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/numbering" Target="numbering.xml"/></Relationships>`);
    zip.file('word/styles.xml', ESTILOS);
    zip.file('word/numbering.xml', NUMERACION);
    zip.file('word/document.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>${cuerpo}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1300" w:right="1300" w:bottom="1300" w:left="1300" w:header="709" w:footer="709" w:gutter="0"/></w:sectPr></w:body></w:document>`);
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', compression: 'DEFLATE' });
  }

  const hoy = () => new Date().toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  function contar(inf) {
    const c = { rojo: 0, amarillo: 0, naranja: 0, verde: 0 };
    for (const o of inf.observaciones) c[o.semaforo] = (c[o.semaforo] || 0) + 1;
    return c;
  }
  function identificacion(inf, nombres) {
    const d = inf.documentos[0] || {};
    return { carrera: d.carrera || '', unidad: d.unidad_academica || '', tipo: inf.documentos.map(x => x.tipo).filter(Boolean).join(' y ') || '', archivos: nombres.join(', ') };
  }

  // datos: { informe, documentos: [{nombre, controles}], rapida, anterior: titulo|null, autor, fecha }
  async function informeDocx(datos) {
    const inf = datos.informe;
    const id = identificacion(inf, datos.documentos.map(d => d.nombre));
    const c = contar(inf);
    const B = [];
    B.push(par(run('Informe de revisión'), { estilo: 'Titulo0' }));
    B.push(par(run(`${datos.autor || 'SA-UNDEF'} · Secretaría Académica – UNDEF · ${datos.fecha || hoy()}${datos.rapida ? ' · Revisión rápida (solo puntos fundamentales)' : ''}`, { color: '5B6576' })));
    B.push(tabla([
      ['Carrera', id.carrera], ['Unidad académica', id.unidad], ['Documento', id.tipo], ['Archivo/s', id.archivos],
      ...(datos.anterior ? [['Comparado con', datos.anterior]] : []),
    ].map(([a, b]) => [{ contenido: a, fondo: 'F3F5F8' }, b]), [2600, 6700]));

    B.push(titulo('Conclusión'));
    B.push(par(run(inf.conclusion || '—', { b: true })));

    B.push(titulo('Semáforo de revisión'));
    B.push(tabla([
      ['Color', 'Cantidad', 'Qué incluye'],
      ...ORDEN.map(k => [{ contenido: SEMAFORO[k].nombre, fondo: SEMAFORO[k].fondo, letra: SEMAFORO[k].letra }, String(c[k] || 0), SEMAFORO[k].desc]),
    ], [1500, 1200, 6600], { encabezado: true }));
    const rojos = inf.observaciones.filter(o => o.semaforo === 'rojo');
    if (rojos.length) {
      B.push(titulo('Puntos fundamentales a corregir', 2));
      for (const o of rojos) B.push(vineta([run(`${o.numero}. ${o.ubicacion}: `, { b: true }), run(o.explicacion || o.documento_dice || '')]));
    }

    if (inf.seguimiento.length) {
      B.push(titulo('Seguimiento de la revisión anterior'));
      if (datos.anterior) B.push(par(run(`Comparado con: ${datos.anterior}`, { i: true })));
      const cuentas = {};
      for (const s of inf.seguimiento) cuentas[s.estado] = (cuentas[s.estado] || 0) + 1;
      B.push(par(run(Object.entries(SEGUIMIENTO).filter(([k]) => cuentas[k]).map(([k, v]) => `${v}: ${cuentas[k]}`).join(' · '), { b: true })));
      B.push(tabla([['Obs. anterior', 'Estado', 'Detalle'], ...inf.seguimiento.map(s => [`${s.numero_anterior}. ${s.ubicacion}\n${s.resumen}`, SEGUIMIENTO[s.estado] || s.estado, s.detalle])], [3300, 1900, 4100], { encabezado: true }));
    }

    B.push(titulo('Qué se revisó'));
    for (const r of inf.revisado) B.push(vineta(run(r)));
    if (inf.normas_consultadas.length) { B.push(par(run('Normativa contrastada:', { b: true }), { antes: 120 })); for (const n of inf.normas_consultadas) B.push(vineta(run(n))); }
    const conControles = datos.documentos.filter(d => d.controles && d.controles.analizadas);
    if (conControles.length) {
      B.push(par(run('Controles automáticos de tablas (realizados por la aplicación):', { b: true }), { antes: 120 }));
      for (const d of conControles) {
        B.push(vineta(run(`${d.nombre}: ${d.controles.analizadas} tablas con números, ${d.controles.correctos} cuentas sin diferencias, ${d.controles.errores.length} diferencias.`)));
        for (const e of d.controles.errores) B.push(par(run('⚠ ' + e), { sangria: 720, despues: 40 }));
      }
    }

    if (inf.correcto.length) { B.push(titulo('Lo que está correcto')); for (const t of inf.correcto) B.push(vineta(run('✓ ' + t))); }
    if (inf.ya_senalado.length) {
      B.push(titulo('Ya señalado y pendiente'));
      for (const y of inf.ya_senalado) B.push(vineta([run(`${y.referencia}${y.ubicacion ? ' (' + y.ubicacion + ')' : ''}: `, { b: true }), run(`${y.pedido}${y.falta ? ' — Falta: ' + y.falta : ''}`)]));
    }

    if (inf.observaciones.length) {
      B.push(titulo('Observaciones, correcciones y agregados'));
      for (const o of inf.observaciones) {
        const borde = (SEMAFORO[o.semaforo] || SEMAFORO.amarillo).fondo;
        B.push(par([etiqueta(o.semaforo), run(`  ${o.numero}. ${o.ubicacion}`, { b: true }), datos.documentos.length > 1 ? run(`  [${o.archivo}]`, { color: '5B6576' }) : ''], { antes: 200, despues: 60, juntoAlSiguiente: true, borde }));
        if (o.documento_dice) B.push(par([run('Dice: ', { i: true }), run(o.documento_dice)], { sangria: 284, despues: 40, borde }));
        if (o.norma) B.push(par([run('Norma: ', { i: true }), run(o.norma)], { sangria: 284, despues: 40, borde }));
        if (o.explicacion) B.push(par(run(o.explicacion), { sangria: 284, despues: 40, borde }));
        if (o.redaccion_propuesta) B.push(par(run(o.redaccion_propuesta), { estilo: 'Cita' }));
      }
    }

    if (inf.a_verificar.length) { B.push(titulo('Puntos a verificar')); for (const x of inf.a_verificar) B.push(vineta([run(x.ubicacion ? x.ubicacion + ': ' : '', { b: true }), run(x.texto)])); }
    if (inf.normativa_faltante.length) {
      B.push(titulo('Normativa que no se pudo verificar'));
      B.push(par(run('Estas normas se citan en el documento o harían falta para verificarlo, pero no estaban disponibles para la revisión. Conviene incorporarlas a la normativa de la aplicación.', { i: true })));
      B.push(tabla([['Norma', 'Dónde se cita', 'Qué no se pudo verificar'], ...inf.normativa_faltante.map(n => [n.norma, n.donde, n.que_no_se_verifico])], [2600, 2400, 4300], { encabezado: true }));
    }
    if (inf.requisitos_militares.items.length) {
      B.push(titulo('Requisitos propios de carrera militar (se señalan, no se observan)'));
      if (inf.requisitos_militares.contexto) B.push(par(run(inf.requisitos_militares.contexto, { i: true })));
      for (const x of inf.requisitos_militares.items) B.push(vineta([run(x.ubicacion ? x.ubicacion + ': ' : '', { b: true }), run(x.texto)]));
    }
    if (inf.no_aplica.length) { B.push(titulo('No aplica')); for (const n of inf.no_aplica) B.push(vineta([run(n.punto + ': ', { b: true }), run(n.motivo)])); }
    if (inf.siguiente_paso) { B.push(titulo('Siguiente paso')); B.push(par(run(inf.siguiente_paso))); }
    B.push(par(run('Revisión asistida por IA y controlada por la Secretaría Académica. El documento con control de cambios se entrega por separado.', { i: true }), { estilo: 'Nota', antes: 360 }));
    return docx(B.join(''));
  }

  function textoNota(datos) {
    const inf = datos.informe;
    const id = identificacion(inf, datos.documentos.map(d => d.nombre));
    const c = contar(inf);
    const rojos = inf.observaciones.filter(o => o.semaforo === 'rojo');
    const L = [];
    L.push(`Ref.: Observaciones al ${id.tipo || 'documento'}${id.carrera ? ' de la carrera ' + id.carrera : ''}`);
    L.push('');
    L.push(`Me dirijo a ${id.unidad ? 'esa ' + id.unidad : 'esa Unidad Académica'} a fin de remitir las observaciones formuladas por la Secretaría Académica al ${id.tipo || 'documento'} elevado${id.carrera ? ' para la carrera ' + id.carrera : ''}.`);
    L.push('');
    L.push('Se adjuntan el documento con las correcciones incorporadas mediante control de cambios (autor SA-UNDEF), que podrán aceptarse o rechazarse, y el informe de revisión con el detalle de cada observación y su fundamento normativo.');
    if (inf.resumen_devolucion) { L.push(''); L.push(inf.resumen_devolucion); }
    if (rojos.length) {
      L.push('');
      L.push('Se solicita atender en particular los siguientes puntos, que resultan necesarios para continuar con el trámite:');
      rojos.forEach((o, i) => L.push(`${i + 1}. ${o.ubicacion}: ${o.explicacion || o.documento_dice}${o.norma ? ' (' + o.norma + ')' : ''}.`.replace(/\.\.$/, '.')));
    }
    const resto = [];
    if (c.amarillo) resto.push(`${c.amarillo} ${c.amarillo === 1 ? 'omisión o dato a completar' : 'omisiones o datos a completar'}`);
    if (c.naranja) resto.push(`${c.naranja} ${c.naranja === 1 ? 'corrección de forma' : 'correcciones de forma'}`);
    if (c.verde) resto.push(`${c.verde} ${c.verde === 1 ? 'sugerencia' : 'sugerencias'}`);
    if (resto.length) { L.push(''); L.push(`Asimismo, el informe señala ${resto.join(', ').replace(/, ([^,]*)$/, ' y $1')}.`); }
    if (inf.seguimiento.length) {
      const pend = inf.seguimiento.filter(s => s.estado !== 'resuelta').length;
      L.push('');
      L.push(pend ? `Respecto de la revisión anterior, ${pend} de ${inf.seguimiento.length} observaciones no fueron resueltas o lo fueron parcialmente; se detallan en el informe.` : `Se deja constancia de que las ${inf.seguimiento.length} observaciones de la revisión anterior fueron atendidas.`);
    }
    L.push('');
    L.push('Una vez incorporadas las modificaciones, se solicita elevar la nueva versión para su consideración.');
    L.push('');
    L.push('Saludo a usted atentamente.');
    return L.join('\n');
  }

  async function notaDocx(texto) {
    const B = texto.split('\n').map((l, i) => (i === 0 ? par(run(l, { b: true }), { alinear: 'right' }) : par(run(l), { alinear: 'both' })));
    return docx(par(run(hoy(), { color: '5B6576' }), { alinear: 'right' }) + B.join(''));
  }

  // ---------- Excel ----------

  function columna(n) { let s = ''; n++; while (n) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }

  async function xlsx(nombreHoja, filas, anchos) {
    const celdas = filas.map((f, i) => `<row r="${i + 1}">${f.map((v, j) => {
      const ref = columna(j) + (i + 1);
      const s = i === 0 ? ' s="1"' : '';
      if (typeof v === 'number' && isFinite(v)) return `<c r="${ref}"${s}><v>${v}</v></c>`;
      return `<c r="${ref}" t="inlineStr"${s}><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
    }).join('')}</row>`).join('');
    const ultima = columna(filas[0].length - 1) + filas.length;
    const zip = new JSZip();
    zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>`);
    zip.file('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
    zip.file('xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
    zip.file('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${esc(nombreHoja)}" sheetId="1" r:id="rId1"/></sheets></workbook>`);
    zip.file('xl/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF1F4E8C"/><bgColor indexed="64"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"><alignment vertical="center" wrapText="1"/></xf></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`);
    zip.file('xl/worksheets/sheet1.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${anchos.map((a, i) => `<col min="${i + 1}" max="${i + 1}" width="${a}" customWidth="1"/>`).join('')}</cols><sheetData>${celdas}</sheetData><autoFilter ref="A1:${ultima}"/></worksheet>`);
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', compression: 'DEFLATE' });
  }

  async function planilla(revisiones) {
    const filas = [['Fecha', 'Carrera', 'Unidad académica', 'Documento', 'Archivo/s', 'Tipo de revisión', 'Rojo', 'Amarillo', 'Naranja', 'Verde', 'A verificar', 'Normativa faltante', 'Seguimiento anterior', 'Estado', 'Notas']];
    for (const r of revisiones) {
      const inf = r.informe || { observaciones: [], documentos: [], a_verificar: [], normativa_faltante: [], seguimiento: [] };
      const c = contar(inf);
      const id = identificacion(inf, (r.archivos || []).map(a => a.nombre));
      const seg = (inf.seguimiento || []).length ? `${inf.seguimiento.filter(s => s.estado === 'resuelta').length} resueltas de ${inf.seguimiento.length}` : '';
      filas.push([new Date(r.fecha).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' }), id.carrera, id.unidad, id.tipo, id.archivos, r.rapida ? 'Rápida' : 'Completa',
        c.rojo || 0, c.amarillo || 0, c.naranja || 0, c.verde || 0, (inf.a_verificar || []).length, (inf.normativa_faltante || []).map(n => n.norma).join('; '), seg, r.estadoTramite || '', r.notas || '']);
    }
    return xlsx('Seguimiento', filas, [16, 34, 26, 22, 40, 12, 7, 9, 9, 7, 10, 30, 20, 18, 40]);
  }

  return { SEMAFORO, ORDEN, SEGUIMIENTO, informeDocx, textoNota, notaDocx, planilla };
})();
