// Controles automáticos sobre las tablas del Word (los hace la app, no Claude):
// sumas y totales, teóricas + prácticas = totales, horas semanales × semanas,
// porcentajes y correlatividades. Lee el texto vigente (sin lo tachado por otros revisores).
// Son reglas automáticas: con tablas muy irregulares pueden no aplicarse o equivocarse.

(function () {
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const esW = (n, l) => n && n.nodeType === 1 && n.namespaceURI === W && n.localName === l;
  const masCercano = (n, l) => { for (let p = n.parentNode; p; p = p.parentNode) if (esW(p, l)) return p; return null; };

  function borrado(n, tope) {
    for (let p = n.parentNode; p && p !== tope; p = p.parentNode) if (p.namespaceURI === W && (p.localName === 'del' || p.localName === 'moveFrom')) return true;
    return false;
  }

  function textoCelda(tc) {
    const partes = [];
    for (const p of Array.from(tc.getElementsByTagNameNS(W, 'p'))) {
      let s = '';
      const walker = tc.ownerDocument.createTreeWalker(p, NodeFilter.SHOW_ELEMENT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        if (esW(n, 't') && !borrado(n, tc)) s += n.textContent;
        else if (esW(n, 'tab')) s += ' ';
      }
      if (s.trim()) partes.push(s.trim());
    }
    return partes.join(' ').replace(/\s+/g, ' ').trim();
  }

  function filaBorrada(tr) {
    const trPr = Array.from(tr.childNodes).find(c => esW(c, 'trPr'));
    return !!(trPr && Array.from(trPr.childNodes).some(c => esW(c, 'del')));
  }

  // Devuelve las filas como arreglos de texto alineados a la grilla (respeta celdas combinadas)
  function leerTabla(tbl) {
    const filas = [];
    for (const tr of Array.from(tbl.getElementsByTagNameNS(W, 'tr')).filter(tr => masCercano(tr, 'tbl') === tbl)) {
      if (filaBorrada(tr)) continue;
      const fila = [];
      for (const tc of Array.from(tr.getElementsByTagNameNS(W, 'tc')).filter(tc => masCercano(tc, 'tr') === tr)) {
        const tcPr = Array.from(tc.childNodes).find(c => esW(c, 'tcPr'));
        let span = 1, continuaVertical = false;
        if (tcPr) {
          const gs = Array.from(tcPr.childNodes).find(c => esW(c, 'gridSpan'));
          if (gs) span = parseInt(gs.getAttributeNS(W, 'val'), 10) || 1;
          const vm = Array.from(tcPr.childNodes).find(c => esW(c, 'vMerge'));
          if (vm && vm.getAttributeNS(W, 'val') !== 'restart') continuaVertical = true;
        }
        fila.push(continuaVertical ? '' : textoCelda(tc));
        for (let i = 1; i < span; i++) fila.push('');
      }
      filas.push(fila);
    }
    return filas;
  }

  function numero(s) {
    if (!s) return null;
    const t = s.replace(/\s/g, '').replace(/(hs?\.?|horas)$/i, '');
    const pct = /%$/.test(t);
    const u = t.replace(/%$/, '');
    if (/^\d{1,3}(\.\d{3})+$/.test(u)) return { v: parseFloat(u.replace(/\./g, '')), pct };
    if (/^\d+([.,]\d+)?$/.test(u)) return { v: parseFloat(u.replace(',', '.')), pct };
    return null;
  }
  const fmt = v => (Math.round(v * 100) / 100).toLocaleString('es-AR');
  const primerTexto = f => (f.find(c => c && c.trim()) || '').trim();
  const corto = s => (s.length > 45 ? s.slice(0, 45) + '…' : s);

  function analizarTabla(filas, nTabla) {
    const errores = [];
    let correctos = 0;
    if (filas.length < 3) return { errores, correctos };
    const nums = f => f.map(numero);
    const esSeccion = f => { const ll = f.filter(c => c && c.trim()); return ll.length > 0 && new Set(ll).size === 1 && !nums(f).some(Boolean); };
    // La segunda fila es parte del encabezado solo si no tiene números ni es una fila de sección
    const filasEnc = filas[1] && !nums(filas[1]).some(Boolean) && !esSeccion(filas[1]) ? [filas[0], filas[1]] : [filas[0]];
    const encabezado = (c) => filasEnc.map(f => f[c] || '').join(' ').trim();
    const nombreTabla = `Tabla ${nTabla} («${corto(filas[0].filter(Boolean).join(' · '))}»)`;
    const nombreCol = c => `columna «${corto(encabezado(c) || String(c + 1))}»`;
    const nombreFila = f => `«${corto(f.filter(c => c && c.trim() && !numero(c)).slice(0, 2).join(' – ') || primerTexto(f))}»`;
    const esTotal = f => /^(total|totales|carga horaria total)\b/i.test(primerTexto(f));
    const esSub = f => /subtotal/i.test(f.join(' '));
    const datos = [];
    filas.forEach((f, i) => { if (i > 0 && nums(f).some(Boolean) && !esTotal(f) && !esSub(f)) datos.push(i); });
    const valor = (r, c) => numero(filas[r][c] || '');
    const suma = (rs, c) => rs.reduce((a, r) => { const y = valor(r, c); return y ? a + y.v : a; }, 0);
    const cuenta = (rs, c) => rs.filter(r => valor(r, c)).length;

    // 1. Totales y subtotales
    let inicio = 1;
    const previos = [];
    filas.forEach((f, i) => {
      if (i === 0 || !(esTotal(f) || esSub(f))) return;
      const bloque = datos.filter(d => d >= inicio && d < i);
      const todos = datos.filter(d => d < i);
      nums(f).forEach((x, c) => {
        if (!x || (cuenta(bloque, c) < 2 && cuenta(todos, c) < 2)) return;
        const tol = x.pct ? 0.6 : 0.5;
        const candidatos = [suma(bloque, c), suma(todos, c), suma(previos, c)];
        if (candidatos.some(s => Math.abs(s - x.v) <= tol)) correctos++;
        else errores.push(`${nombreTabla}, fila ${nombreFila(f)}, ${nombreCol(c)}: dice ${fmt(x.v)}${x.pct ? ' %' : ''}, pero la suma de las filas da ${fmt(suma(bloque.length ? bloque : todos, c))}${x.pct ? ' %' : ''}.`);
      });
      previos.push(i);
      inicio = i + 1;
    });

    const nCols = Math.max(...filas.map(f => f.length));
    const buscarCol = re => { for (let c = 0; c < nCols; c++) if (re.test(encabezado(c))) return c; return -1; };

    // 2. Teóricas + prácticas = totales
    const cT = buscarCol(/te[oó]r/i), cP = buscarCol(/pr[aá]ct/i);
    let cTot = -1;
    for (let c = nCols - 1; c >= 0; c--) if (/total/i.test(encabezado(c)) && c !== cT && c !== cP) { cTot = c; break; }
    if (cT >= 0 && cP >= 0 && cTot >= 0) {
      for (const r of [...datos, ...previos]) {
        const t = valor(r, cT), p = valor(r, cP), tot = valor(r, cTot);
        if (!t || !p || !tot || t.pct || p.pct || tot.pct) continue;
        if (Math.abs(t.v + p.v - tot.v) <= 0.5) correctos++;
        else errores.push(`${nombreTabla}, fila ${nombreFila(filas[r])}: teóricas (${fmt(t.v)}) + prácticas (${fmt(p.v)}) = ${fmt(t.v + p.v)}, pero el total dice ${fmt(tot.v)}.`);
      }
    }

    // 3. Horas semanales × semanas = horas totales (detecta la cantidad de semanas más frecuente)
    const cSem = buscarCol(/seman/i);
    if (cSem >= 0 && cTot >= 0 && cSem !== cTot) {
      const pares = datos.map(r => ({ r, s: valor(r, cSem), t: valor(r, cTot) })).filter(x => x.s && x.t && x.s.v > 0);
      const frec = {};
      for (const x of pares) { const k = Math.round((x.t.v / x.s.v) * 100) / 100; frec[k] = (frec[k] || 0) + 1; }
      const [semanas, veces] = Object.entries(frec).sort((a, b) => b[1] - a[1])[0] || [];
      if (veces >= 3 && veces >= pares.length / 2 && Number.isInteger(+semanas)) {
        for (const x of pares) {
          if (Math.abs(x.s.v * +semanas - x.t.v) <= 0.5) correctos++;
          else if (Math.abs(x.s.v * +semanas * 2 - x.t.v) > 0.5) // las anuales duplican las semanas
            errores.push(`${nombreTabla}, fila ${nombreFila(filas[x.r])}: ${fmt(x.s.v)} h semanales × ${semanas} semanas = ${fmt(x.s.v * +semanas)}, pero el total dice ${fmt(x.t.v)} (verificar si la asignatura es anual o tiene otra duración).`);
        }
      }
    }

    // 4. Porcentajes: cada % debe corresponder a las horas de la fila sobre el total
    for (let c = 0; c < nCols; c++) {
      const conPct = datos.filter(r => { const y = valor(r, c); return y && (y.pct || /%/.test(encabezado(c))); });
      if (conPct.length < 2) continue;
      let mejor = null;
      for (let b = 0; b < nCols; b++) {
        if (b === c) continue;
        const filaTotal = previos.length ? previos[previos.length - 1] : null;
        const base = filaTotal != null && valor(filaTotal, b) ? valor(filaTotal, b).v : suma(datos, b);
        if (!base || cuenta(datos, b) < 2) continue;
        const coinciden = conPct.filter(r => valor(r, b) && Math.abs((valor(r, b).v / base) * 100 - valor(r, c).v) <= 0.6);
        if (!mejor || coinciden.length > mejor.coinciden.length) mejor = { b, base, coinciden };
      }
      if (mejor && mejor.coinciden.length >= conPct.length / 2) {
        for (const r of conPct) {
          if (mejor.coinciden.includes(r)) { correctos++; continue; }
          if (!valor(r, mejor.b)) continue;
          errores.push(`${nombreTabla}, fila ${nombreFila(filas[r])}, ${nombreCol(c)}: dice ${fmt(valor(r, c).v)} %, pero ${fmt(valor(r, mejor.b).v)} sobre ${fmt(mejor.base)} da ${fmt((valor(r, mejor.b).v / mejor.base) * 100)} %.`);
        }
      }
      if (!previos.length) {
        const s = suma(conPct, c);
        if (Math.abs(s - 100) <= 0.6) correctos++;
        else errores.push(`${nombreTabla}, ${nombreCol(c)}: los porcentajes suman ${fmt(s)} %, no 100 %.`);
      }
    }

    // 5. Correlatividades: que existan y que no estén en la misma cursada
    const cCor = buscarCol(/correlativ/i);
    if (cCor >= 0) {
      const esCodigo = s => /^[A-Za-z]{0,6}[\s.\-]?\d{1,4}[A-Za-z]?$/.test(s.trim());
      let cCod = buscarCol(/^c[oó]d|c[oó]digo/i);
      if (cCod < 0 && datos.filter(r => esCodigo(filas[r][0] || '')).length >= Math.max(3, datos.length * 0.6)) cCod = 0;
      let cNom = buscarCol(/asignatura|materia|espacio curricular|unidad curricular/i);
      if (cNom < 0) cNom = cCod === 0 ? 1 : 0;
      const norm = s => s.toLowerCase().replace(/[\s.\-]/g, '');
      const codigos = new Map(), nombres = new Map();
      let seccion = '';
      const seccionDe = new Map();
      filas.forEach((f, i) => {
        if (i === 0) return;
        const llenas = f.filter(c => c && c.trim());
        const unicas = new Set(llenas);
        if (!nums(f).some(Boolean) && unicas.size === 1 && /(año|cuatrimestre|semestre|trimestre|ciclo)/i.test(llenas[0])) { seccion = llenas[0]; return; }
        if (cCod >= 0 && f[cCod] && esCodigo(f[cCod])) codigos.set(norm(f[cCod]), i);
        if (f[cNom]) nombres.set(f[cNom].toLowerCase().trim(), i);
        seccionDe.set(i, seccion);
      });
      if (codigos.size >= 3 || nombres.size >= 3) {
        for (const r of datos) {
          const celda = (filas[r][cCor] || '').trim();
          if (!celda || /^(-+|—|–|no (posee|tiene)|ninguna?|sin correlativ|n\/?a)\.?$/i.test(celda)) continue;
          const tokens = celda.split(/[,;\/]|\s+y\s+|\s+e\s+|\n/).map(t => t.trim()).filter(Boolean);
          for (const tok of tokens) {
            let destino = null;
            if (esCodigo(tok)) {
              destino = codigos.get(norm(tok));
              if (destino == null && codigos.size >= 3) { errores.push(`${nombreTabla}, fila ${nombreFila(filas[r])}: la correlativa «${tok}» no corresponde a ningún código de la tabla.`); continue; }
            } else destino = nombres.get(tok.toLowerCase());
            if (destino == null) continue;
            if (destino === r) errores.push(`${nombreTabla}, fila ${nombreFila(filas[r])}: la asignatura figura como correlativa de sí misma.`);
            else if (/cuatrimestre|semestre|trimestre/i.test(seccionDe.get(r) || '') && seccionDe.get(r) === seccionDe.get(destino))
              errores.push(`${nombreTabla}, fila ${nombreFila(filas[r])}: su correlativa «${tok}» está en la misma cursada (${seccionDe.get(r)}).`);
            else if (destino > r && seccionDe.get(r) && seccionDe.get(r) !== seccionDe.get(destino))
              errores.push(`${nombreTabla}, fila ${nombreFila(filas[r])}: su correlativa «${tok}» se cursa después (${seccionDe.get(destino)}).`);
            else correctos++;
          }
        }
      }
    }
    return { errores, correctos };
  }

  function analizar(xmlDocumento) {
    const doc = new DOMParser().parseFromString(xmlDocumento, 'application/xml');
    const tablas = Array.from(doc.getElementsByTagNameNS(W, 'tbl')).filter(t => !masCercano(t, 'tbl'));
    const errores = [];
    let correctos = 0, analizadas = 0;
    tablas.forEach((tbl, i) => {
      const r = analizarTabla(leerTabla(tbl), i + 1);
      if (r.errores.length || r.correctos) analizadas++;
      errores.push(...r.errores);
      correctos += r.correctos;
    });
    return { tablas: tablas.length, analizadas, correctos, errores };
  }

  function textoParaClaude(nombre, c) {
    if (!c || !c.analizadas) return '';
    return [`Controles automáticos de la app sobre ${nombre}: ${c.analizadas} tablas con números, ${c.correctos} cuentas sin diferencias.`,
      c.errores.length ? 'Diferencias detectadas (verificalas en el documento antes de observarlas; son reglas automáticas):\n' + c.errores.map(e => '- ' + e).join('\n') : 'No se detectaron diferencias en sumas, porcentajes ni correlatividades.'].join('\n');
  }

  window.Controles = { analizar, textoParaClaude };
})();
