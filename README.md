# Revisión de carreras UNDEF

Página para revisar Formularios A, B y C, reglamentos de carrera y reglamentos generales de Facultad contra la RR 485/25 y la normativa vigente. Devuelve:

- un **informe**, en este orden: lo que está correcto, lo ya señalado y pendiente, las observaciones nuevas, los puntos a verificar, los requisitos propios de carrera militar y lo que no aplica;
- el **.docx original con control de cambios real**, firmado **SA-UNDEF**. Las correcciones aparecen tachadas o subrayadas para aceptarlas o rechazarlas, y van con sus comentarios. Las marcas y comentarios de otros revisores quedan intactos y pendientes.

La revisión la hace Claude con **la suscripción de quien la usa**. No hay API ni costos extra. Cada revisión cuenta para los límites de uso del plan, igual que una conversación larga.

## Dos formas de usarla

### 1. Modo automático (en tu computadora)
1. Doble clic en **`iniciar.bat`**. Se abre una ventana negra (el servidor) y la página en el navegador.
   - La primera vez te pide iniciar sesión con tu cuenta de Claude en el navegador. Es una sola vez.
   - Usa Claude Code: el que trae la app de escritorio de Claude o uno instalado aparte.
2. Arrastrá el .docx → **Revisar**. Tarda unos minutos. Claude puede leer los PDF de normativa de la carpeta cuando necesita verificar un artículo.
3. Revisá el informe, tildá o destildá y editá cada observación → **Generar .docx con control de cambios** → Descargar.

Dejá abierta la ventana del servidor mientras uses la página; cerrala para apagarla.

### 2. Modo copiar y pegar (en la web, por ejemplo Vercel)
1. Abrí la página publicada y arrastrá el .docx.
2. **Copiar pedido** (o "Descargar pedido" si es largo) → pegalo o adjuntalo en un chat nuevo de claude.ai.
3. Copiá la respuesta de Claude (si se cortó, escribile "continuá" y copiá todas las partes) → pegala en la página → **Mostrar informe**.
4. **Generar .docx con control de cambios**.

La página detecta sola en qué modo está.

## Qué ofrece el informe
- **Semáforo:** 🔴 rojo (lo fundamental y las omisiones graves), 🟡 amarillo (omisiones y datos a completar), 🟠 naranja (puntuación, gramática y cuestiones editoriales) y 🟢 verde (sugerencias).
  - Tocando cada número se filtra por color, y desde cada color se tildan o destildan juntas las observaciones que van al Word.
  - El color de cada observación se puede cambiar a mano.
  - El semáforo aparece solo en el informe, no en los comentarios del Word.
- **Informe descargable (.docx):** conclusión, semáforo, puntos fundamentales, qué se revisó y con qué normativa, controles automáticos, lo correcto, lo ya señalado, todas las observaciones con su color, puntos a verificar y normativa faltante.
- **Normativa que no se pudo verificar:** lista lo que la revisión necesitó y no tenía.
  - En tu PC, para sumarla, copiá el PDF en esta carpeta.
  - En la web, subilo a GitHub y agregalo a `normativa.json`.
- **Controles automáticos de tablas:** la app suma totales y subtotales y verifica teóricas + prácticas, horas semanales × semanas, porcentajes y correlatividades (que existan y que no estén en la misma cursada). Se los pasa a Claude y los muestra en el informe.
- **Unificar autores:** casilla, tildada por defecto. En el Word entregado, las marcas y comentarios de otros revisores pasan a figurar como SA-UNDEF, sin aceptar, rechazar ni borrar nada.
- **Revisión rápida:** busca solo los puntos rojos; gasta menos cupo y tarda menos.
- **Comparar con una revisión anterior:** marca cada observación previa como resuelta, resuelta a medias, pendiente o vuelta a aparecer.
- **Nota de devolución:** borrador editable para la unidad académica, que se puede copiar o descargar en .docx.
- **Revisiones guardadas:** cada revisión se guarda sola en el navegador, con sus documentos.
  - Se puede reabrir y volver a generar el Word sin consultar a Claude.
  - Se puede exportar o importar en .json.
  - Desde ahí se descarga la **planilla de seguimiento (.xlsx)**, con el estado del trámite y notas.
- **Progreso en vivo** (modo automático): muestra qué está haciendo Claude, por ejemplo qué norma está consultando.

## Archivos (todos en la misma carpeta)

| Archivo | Para qué |
|---|---|
| `index.html`, `estilos.css`, `app.js` | La página |
| `docx-motor.js` | Lee el Word y escribe las marcas y los comentarios. Antes de entregar verifica que, rechazando las marcas SA-UNDEF, el documento vuelva al original |
| `metodo.md` | Método de revisión (skill *revision-carreras-undef*). **Para cambiar criterios, editá este archivo** |
| `controles.js` | Controles automáticos de las tablas |
| `almacen.js` | Guardado de revisiones en el navegador |
| `exportar.js` | Informe y nota (.docx) y planilla de seguimiento (.xlsx) |
| `iniciar.bat`, `servidor.ps1` | Modo automático (solo en tu PC; en Vercel no se usan) |
| `*.pdf`, `normativa.json` | Normativa de referencia y sus nombres |

La única biblioteca externa es JSZip, que se carga desde cdnjs. No hay que instalar nada más.

## Publicar en GitHub y Vercel
1. GitHub: **New repository** (puede ser privado) → **uploading an existing file** → arrastrá todos los archivos → **Commit changes**.
2. Vercel: **Add New… → Project** → importá el repositorio → *Framework Preset*: **Other**, sin comando de build → **Deploy**.
3. Para actualizar, subí el archivo cambiado con el mismo nombre. Vercel vuelve a publicar solo.

Los documentos nunca se suben a GitHub ni a Vercel: se procesan en el navegador y van solo a Claude.
