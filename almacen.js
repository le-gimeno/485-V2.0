// Guarda las revisiones en este navegador (IndexedDB): el informe, las decisiones
// (casillas, colores, textos editados) y una copia de los .docx para regenerar el Word
// sin volver a llamar a Claude. Nada sale de la computadora.

window.Almacen = (function () {
  let dbPromesa = null;
  function db() {
    if (!dbPromesa) {
      dbPromesa = new Promise((ok, mal) => {
        let r;
        try { r = indexedDB.open('revision-undef', 1); } catch (e) { mal(e); return; }
        r.onupgradeneeded = () => r.result.createObjectStore('revisiones', { keyPath: 'id' });
        r.onsuccess = () => ok(r.result);
        r.onerror = () => mal(r.error);
      });
    }
    return dbPromesa;
  }
  async function operar(modo, fn) {
    const d = await db();
    return new Promise((ok, mal) => {
      const t = d.transaction('revisiones', modo);
      const pedido = fn(t.objectStore('revisiones'));
      t.oncomplete = () => ok(pedido ? pedido.result : undefined);
      t.onerror = () => mal(t.error);
      t.onabort = () => mal(t.error || new Error('operación cancelada'));
    });
  }
  return {
    disponible: () => db().then(() => true, () => false),
    guardar: rev => operar('readwrite', s => s.put(rev)),
    obtener: id => operar('readonly', s => s.get(id)),
    listar: async () => ((await operar('readonly', s => s.getAll())) || []).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')),
    borrar: id => operar('readwrite', s => s.delete(id)),
  };
})();
