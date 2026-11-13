# Revisión de documentos de carrera UNDEF

Skill para revisar proyectos de carrera (nuevas o modificaciones) que presentan las unidades académicas de UNDEF: Formulario A (plan de estudios), Formulario B (modificación de plan), Formulario C (reglamento de carrera), anexos (p. ej. Anexo II de reglamento común de tecnicaturas ESSA) y **reglamentos generales de Facultad** (ver §10). Responder siempre en castellano, dirigiéndose a Leandro.

## REGLA CRÍTICA: control de cambios

**1. Nunca eliminar el control de cambios existente.** Todo .docx que se devuelva conserva intactas las marcas de revisión del original (inserciones `w:ins`, eliminaciones `w:del`/`w:delText`, movimientos `w:moveFrom`/`w:moveTo`, cambios de formato `w:rPrChange`, `w:pPrChange`, `w:tcPrChange`, `w:trPrChange`, etc.), con sus autores y fechas, y todos los comentarios existentes. Se dejan **pendientes**: no se aceptan ni se rechazan (no usar `accept_changes.py` ni `pandoc --track-changes=accept` sobre el entregable) salvo pedido expreso de Leandro.

**2. Las correcciones propias van como control de cambios real, no solo como comentarios.** Cuando Leandro pide una "versión con control de cambios", las correcciones se escriben en el texto como marcas de revisión firmadas "SA-UNDEF": lo que se quita aparece tachado (`w:del`) y lo que se agrega subrayado (`w:ins`), para que el próximo corrector pueda **aceptar o rechazar** cada una. Los comentarios explican; el control de cambios corrige.

**3. Nunca regenerar el documento** desde texto extraído (pandoc, python-docx) ni reescribirlo con docx-js: siempre se edita una copia del XML original (unzip → editar `word/document.xml` → zip).

**4. Verificar antes de entregar** (script en §8): si se rechazan las marcas "SA-UNDEF", el documento debe volver exactamente al original, con todas sus marcas previas. Si no, no entregar.

## REGLA CRÍTICA: solo se exige lo que se puede verificar

- Un hallazgo es **"falta" / "debe decir"** solo si se apoya en un artículo o punto de formulario verificado en los PDF del proyecto (o en los datos verificados de §9 y §11). Citar siempre esa fuente.
- Si la fuente es una nota interna de este skill, un antecedente de otra carrera o una norma que **no está en el proyecto**, va a **Puntos a verificar**, nunca como faltante ni como corrección.
- Las mejoras de redacción o precisión sin norma detrás se presentan como **"se sugiere"**, con opciones si hay más de una lectura posible, y se cargan como comentario, no como corrección. Antes de proponer una redacción, comprobar que no duplique otro punto del mismo documento (p. ej. dos objetivos que terminan diciendo lo mismo).

## 1. Marco normativo de referencia

Usar los PDF del proyecto "485 y leyes" como fuente. No citar de memoria: verificar el artículo en el texto. Para la RR 485/25, la transcripción de §9 reemplaza el OCR del anexo escaneado; para la RR 169/22 y el Estatuto, ver los datos verificados de §11. Ante una duda puntual de redacción, confirmar en el PDF.

- **RR 485/2025** – aprueba el "Reglamento para la presentación de proyectos de creación y modificación de carreras de Pregrado, Grado y Posgrado" (art. 1° de la resolución; título oficial: corregir variantes como "Reglamento para la Creación y Modificación de Planes de Estudios"). Se cita como "Resolución Rectoral UNDEF N.º 485/2025". Ver §9: artículos clave y Formularios A, B y C. Reemplaza el Anexo I de la RR 117/22 (art. 2°). **Art. 3° de la resolución**: es vinculante para las presentaciones posteriores a su aprobación, sin afectar los proyectos en trámite; **no fija plazo de adecuación** de reglamentos ni planes vigentes (no usarlo como base de plazos tipo "180 días"). Los artículos de la resolución y del Anexo se citan en arábigos ("art. 3°", no "Art. III").
- **CRE – normas nacionales**: RESOL-2023-2598-APN-ME (SACAU), RESOL-2023-2600-APN-ME y **RESOL-2025-556-APN-SE#MCH** (de la **Secretaría de Educación**, no "RM 556/2025"): obligatoriedad desde el 1/1/2027. La RM 2599/23 es la de educación a distancia.
- **RR 427/2025** – actualiza el Reglamento General de Enseñanza de **Posgrado** (Expte. 57/2018): aplica solo a posgrados; en pregrado/grado va como N/A. Señalar citas erróneas (p. ej. "RR 277/2025" en lugar de 427/2025).
- **RR 305/2023** – calificación mínima para aprobar asignaturas y trabajos finales de especializaciones y maestrías (Expte. 06/2020): solo **posgrado**; en pregrado/grado va como N/A.
- **RR 169/2022** (Expte. 74/2019; el Anexo está escaneado) – Reglamento de Regularidad de los y las estudiantes. Contenido verificado en §11.1. No aceptar redacciones que la eliminen de un reglamento de pregrado/grado. **No regula licencias**: si un reglamento la cita para licencias, corregir hacia las causales de readmisión automática (Anexo, art. 5) y el reconocimiento de materias (art. 8).
- **Archivo "260002023"** – no es una RR UNDEF: es la **RESOL-2023-2600-APN-ME** (estándares de acreditación de **posgrado**). En pregrado/grado va como N/A.
- **Reglamento de Educación a Distancia** (RESOL-2026-88-APN-R#UDN) – deroga las RR 79/2018, 49/2021 y 253/22. El PDF del proyecto trae solo la resolución, **sin el Anexo**: su contenido no se puede verificar; citarlo, pero no atribuirle requisitos concretos. Corregir "RR UNDEF 88/2026" por el número GDE.
- **Estatuto UNDEF 2017** – el órgano superior de gobierno es el **Consejo de Dirección** (art. 14). Ver §11.2 (aprobación de reglamentos y designación de docentes). **Ley 24.521** (LES; art. 36 para requisitos docentes; art. 43 cuando corresponda; cláusula de dependencia según Disp. DNGU 3049/19).
- **RR 52/26** (RESOL-2026-52-APN-R#UDN, equivalencias) – según revisores, reemplaza a la RR 170/19. **No está en el proyecto**: citarla como la señalan los revisores y dejar su contenido como punto a verificar.
- **OP 06/18** – aparece citada en reglamentos de tecnicaturas ESSA anteriores, pero **no está en el proyecto y no se conoce su contenido**. No exigirla ni marcarla como faltante: si no está citada, a lo sumo va a Puntos a verificar ("confirmar si aplica a esta carrera").
- **Sistema de créditos (CRE)** – obligatorio desde el 1/1/2027 (art. 4 RR 485/25): señalar si falta.
- Otras normas que suelen aparecer y no están en el proyecto (p. ej. RR UNDEF 60/2018 de creación del SIED, Ley 17.409): Puntos a verificar.

Normas que suelen aparecer desactualizadas o mal citadas: RR 117/22 (reemplazar por 485/25), RR 66/2022 (quitar en reglamentos ESSA; en otros contextos, verificar vigencia), RR 253/22 (derogada), RR 170/19 (reemplazada por RR 52/26, a verificar), "RM 556/2025" (→ RESOL-2025-556-APN-SE#MCH), **Ley 24.848 → la de Reestructuración de las FF.AA. es la Ley 24.948**. Si un revisor pide citar una ley cuyo objeto no se puede verificar (p. ej. Ley 17.409/1967), dejarlo como punto a verificar, no incorporarla.

**Citas textuales de revisores**: cuando un comentario atribuye una frase entre comillas a una norma, buscarla en el PDF antes de darla por buena. Si no figura, decirlo en las observaciones nuevas ("amplía #…") e indicar qué dice realmente la norma.

## 2. Flujo de trabajo

1. **Identificar** tipo de documento (A/B/C/anexo/reglamento general de Facultad), carrera, unidad académica, si es nueva o modificación, versión, modalidad (presencial / a distancia) y qué pide Leandro (revisión completa, comparar versiones, elegir modelo, compatibilidad, verificar observaciones previas, versión con control de cambios).
2. **Extraer texto** (ver §5). Siempre extraer control de cambios y comentarios de revisores: cambian el diagnóstico (p. ej. una tabla completa puede estar marcada como eliminada). **Comparar siempre el texto con todas las marcas aceptadas contra el texto con todas rechazadas** (`pandoc --track-changes=accept` vs. `--track-changes=reject`) y **revisar una por una las marcas de otros revisores**: detecta artículos que quedan vacíos (inserción de un revisor anidada dentro del borrado de otro), restos de puntuación (",,"), oraciones sin verbo, caracteres sueltos ("N|"), **espacios que desaparecen** al borrar o insertar ("navalesy", "laFacultad", "elSistema") y **puntos finales que se pierden** al reemplazar una cita ("…R#UDN Los estudiantes").
3. **Contrastar con el formulario exigido** usando la lista de control de §9 (A, B o C según corresponda): recorrer cada punto y marcar correcto / incompleto / ausente / mal ubicado / no aplica. Aplicar también los artículos clave de §9.1. Para reglamentos generales de Facultad, usar §10.
4. **Cruzar documentos de la misma carrera.** Si en la conversación o en el envío hay Formulario A y Formulario C (o B y C) de la misma carrera, cruzarlos siempre: destinatarios, régimen de cursada, PPS (en el A: qué espacios curriculares la integran y con qué contenidos; en el C: ámbito, supervisión, acreditación), TFI, asignaturas con promoción, requisitos del título (4.b del A vs. Cap. 3/4 del C) y terminología. Las contradicciones van como observación en ambos documentos.
5. **Verificar aritmética**: carga horaria total, horas semanales × semanas, teóricas + prácticas, suma por áreas, porcentajes (base y redondeo), totales por cuatrimestre, **horas semanales por cuatrimestre (distribución)**, duración mínima, cantidad de materias ofrecidas vs. obligatorias.
6. **Verificar coherencia interna**: correlatividades (que existan los códigos, sin ciclos, no en el mismo cuatrimestre), numeración de secciones (renderizando, ver §5), remisiones internas, actores definidos antes de usarse, mismo nombre de órganos en todo el texto, títulos de normas citados igual en todas partes, mismo término para la misma figura (p. ej. "Práctica Profesionalizante" vs. "Prácticas Profesionales"; "tribunal ad hoc" vs. "comisión"), objetivos/perfil/alcances respaldados por asignaturas (ver §3, "Coherencia título–contenidos").
7. **Clasificar hallazgos** (ver §4): separar primero lo ya señalado por revisores previos (resuelto → va en ✅; pendiente → sección "Ya señalado y pendiente") de lo nuevo o ampliado propio. Si la unidad académica **volvió a poner algo que un revisor ya había corregido** (lo dicen comentarios tipo "en el envío anterior corregimos X y volvieron a poner Y"), destacarlo en la sección de pendientes. Aplicar la regla de "solo se exige lo que se puede verificar". Separar los requisitos que vienen del mundo militar o exceden lo académico a la sección "🎖️ Requisitos propios de carrera militar" (§3, §4).
8. **Ofrecer el siguiente paso** (una sola opción concreta): comentarios en el .docx, versión con control de cambios (§8), listado de incidencias (skill `incidencias-carreras-undef`) o modelo limpio.

## 3. Checklist de errores recurrentes

**Formato y estructura**
- Uso del formato viejo de formulario en lugar del de la RR 485/25; tablas propias de la RR 117/22.
- Falta CRE (encabezado y caja Tipo 2) o el punto 6 Pautas Presupuestarias (Formulario A); 1.b Definición incompleto (suele limitarse al enfoque por competencias y omitir objeto de estudio, estructura curricular, integración teórico-práctica y estrategias de enseñanza).
- Numeración duplicada o faltante (p. ej. dos "4.2", falta 1.2 Opción Pedagógica, capítulo que empieza en x.2). En el Formulario C, si no hay TFI, se sugiere conservar la numeración del formulario ("Capítulo 6 – No corresponde") para que la PPS quede como Cap. 7.
- **Formulario A, punto 4**: si todas las asignaturas tienen la misma modalidad (100 % presencial o 100 % a distancia), se omite la tabla de modalidad pero el 4.c igual existe (una línea que lo aclare). Si la PPS es presencial en una carrera a distancia, sí hace falta la tabla. Error frecuente: rotular "4.c" a la tabla de cargas por áreas, que es el **4.d**.
- Tablas vacías o colgadas; campos incompletos (CPRES, escalafón, ámbitos de PPS).
- CPRES que no coincide con la localización de la sede (p. ej. sede en Puerto Belgrano/Punta Alta → Bonaerense, no Metropolitano): marcar como punto a verificar.
- Notas internas visibles ("No ponen", etc.); siglas sin definir.
- Plan de estudios sin división por año/cuatrimestre o sin códigos que permitan leer las correlatividades; asignaturas anuales listadas bajo el rótulo "Primer cuatrimestre"; asignaturas cuatrimestrales sin cuatrimestre asignado.
- Inconsistencias menores de forma: régimen "Cuatrim."/"Cuatrim"/"Cuatrimestral." (unificar "Cuatrimestral"); guiones variables ("--", "---", "----"); total de horas semanales que suma años distintos; "-" en la caja vs. "0" en la tabla por áreas; misma norma citada dos veces en un contenido mínimo; "Campo de formación" (4.d) vs. "Bloque de conocimiento" (fichas del 5) con nombres distintos; números escritos de dos formas ("DOS (2)" vs. "2 (DOS)"); letra "O" en lugar del cero; "alumno" y "estudiante" mezclados; "Funciones" vs. "Responsabilidades"; formato de artículos variable ("Artículo 1°." vs. "Artículo 43 º:"); "Ley N º" (→ "Ley N.º"); "Técnico Universitario" sin "/a" cuando el encabezado usa "Técnico/a Universitario/a".

**Restos de copiar y pegar y de marcas de revisores**
- Nombre de otra carrera, componente u órgano ("Componente naval" en materia terrestre, "Director del IIFA", "Tecnicatura en Interpretación Naval").
- Referencias a una carrera específica dentro de un reglamento que se quiere usar como común.
- Figuras inexistentes (p. ej. "Suboficial Universitario" → "técnico universitario").
- Marcas de otros revisores que, aceptadas, dejan texto roto (ver §2, paso 2): señalarlo en observaciones nuevas como "amplía #…" o "corrige marca de …", con la redacción correcta.

**Coherencia título–contenidos (art. 6)**
- Descomponer la denominación del título en sus componentes y buscar, para cada uno, asignaturas que lo desarrollen (p. ej. "Electromecánica" = mecánica + eléctrica; "Gestión de Recursos" = materiales, informáticos, humanos y financieros/presupuestarios: si no hay presupuesto ni contrataciones y el 1.a promete "administración de los recursos del Estado", el título no se sostiene del todo).
- Recorrer antecedentes, objetivos, perfil y alcances: cada sistema o competencia mencionada debe tener asignatura o contenido mínimo que lo respalde. Y a la inversa: asignaturas sin ningún ítem de perfil que las justifique (p. ej. Derecho Internacional en una tecnicatura de gestión).
- Si falta respaldo: comentario (no corrección), con dos opciones para la unidad académica: incorporar asignaturas o ajustar objetivos/perfil/alcances/denominación. Señalar que el ajuste puede aumentar la superposición con otra oferta (art. 1).
- Objetivos específicos que repiten el general; objetivo general con verbos que exceden el alcance supervisado (p. ej. "gestionar" en un técnico que actúa bajo supervisión).

**Perfil y alcances (Formulario A)**
- 2.a sin áreas u organismos de futuro desempeño.
- Ítems del perfil que no coinciden con el alcance equivalente (p. ej. "operación de componentes" vs. "mecanizado y confección de componentes"); fórmulas distintas para lo mismo ("grado, escalafón y destino" vs. "escalafón y orientación").
- Cláusula de dependencia art. 43 (Disp. DNGU 3049/19) cuando el título actúa bajo responsabilidad de un título con actividades reservadas; identificar de qué título depende (punto a verificar si no está claro).

**Gobierno de la carrera (Formulario C y reglamentos generales)**
- Comisión Académica ausente, optativa ("en caso de que se considere necesario") o sin artículo propio; fuera de 3–5 miembros (p. ej. "mínimo 5 y máximo 7", "mínimo 5, impar"); proporciones que no dan números enteros (dos tercios / un tercio con 3 o 5 miembros). "Impar, de 3 a 5" = 3 o 5 miembros. Modelo en §12.2.
- **Integrantes "designados por el Cuerpo Docente"** o por cualquier actor distinto del Decano: contradice la Disposición Decanal (art. 13) y es circular (el cuerpo docente no es un órgano). Los docentes, a lo sumo, eligen o proponen. Señalarlo como punto propio, con la redacción completa (quién elige o propone, cuántos son, requisito de título universitario de nivel igual o superior al de la carrera, función de enlace separada de los requisitos). Miembros externos con requisito solo de jerarquía militar y sin título: señalarlo.
- Coordinador presentado como obligatorio: es optativo (art. 13): "podrá designar". Coordinador sin forma de designación.
- Falta duración en funciones de Director, Comisión Académica, Coordinador; rangos imprecisos ("de 1 a 5 años") o sin límite de reelecciones.
- Falta designación por Disposición Decanal.
- **Docentes "nombrados por la Sede"**, por el Director o "conforme a la normativa vigente" sin más: precisar con el Estatuto (ordinarios e interinos los designa el Rector, arts. 60 y 62; suplentes el Decano ad referéndum del Rector, art. 63). Corrección: "serán designados conforme a los arts. 60 a 63 del Estatuto, a propuesta del Director de Carrera". Verificar también que se mencionen los tutores en EaD (Form. C, pto. 2.4) con requisitos propios.
- Funciones duplicadas (p. ej. Co-Director y Coordinador programando exámenes); Comisión Académica que "coordina la asignación de docentes" (invade la designación del Estatuto: debe "emitir opinión sobre los antecedentes").
- Funciones residuales abiertas ("todas aquellas tareas…"): acotar a contingencias de gestión conforme a normativa.
- **Órganos que deciden sin estar definidos**, en especial un "Consejo de Dirección" de la Sede (SEU) que resuelve regularidad, reincorporación o promedios: no es órgano de la carrera, lleva el mismo nombre que el órgano superior de gobierno de la UNDEF (Estatuto, art. 14) y la RR 169/22 asigna la regularidad a la Facultad (Disposición Decanal, elevación al Rectorado: Anexo, arts. 4 y 7). Corrección: dictamen de la Comisión Académica y resolución del Decano.
- Jurisdicción mal planteada ("a nivel Decanal, la carrera está bajo la jurisdicción de la SEU"): la carrera depende de la Facultad y se dicta en la Sede; la Sede tiene Director, no Decano.
- Distintas autoridades decisoras para lo mismo en capítulos diferentes.
- Frases ambiguas sobre quién designa a quién; voz pasiva sin sujeto ("serán consideradas", "se deben elegir").
- Aprobación "por la UNDEF": corresponde "por Resolución Rectoral" (Estatuto, art. 25, incs. 7–9). Convenios: el Director solo puede proponerlos.

**Estudiantes y evaluación**
- **Requisitos propios de carrera militar** (criterio de Leandro): en carreras cerradas dirigidas a personal militar, las Facultades pueden fijar requisitos de ingreso no académicos (edad, rango o jerarquía militar, examen de ingreso, aptitud psicofísica, selección y vacantes asignadas por la Fuerza, estado militar, escalafón, etc.). **No se observan como error ni se corrigen**: se listan aparte, en la sección "🎖️ Requisitos propios de carrera militar" (§4), con su ubicación y lo que dicen. Lo mismo para todo requisito que parezca venir del mundo militar o exceda lo académico: "requerimientos particulares exigidos por la Sede", condiciones de permanencia ligadas a "normas internas" o "condiciones militares", bajas por causas de la Fuerza. Lo que sí sigue observándose: el requisito académico básico (secundario completo) debe estar; las remisiones internas mal numeradas; y las **competencias académicas** (p. ej. que la pérdida de regularidad la dictamine la Comisión Académica y la resuelva el Decano conforme a la RR 169/22), aunque el párrafo también mencione causas militares.
- **4.b "Otros requisitos para acceder al título"** (Form. A): si trae condiciones que la Fuerza fija para el personal de cuadro o de permanencia, se señalan en la sección de requisitos propios de carrera militar. Se puede agregar como sugerencia que el 4.b admite requisitos académicos que no suman carga (p. ej. idioma) o "No se establecen otros requisitos".
- Condiciones de permanencia: van en el Formulario C, no en el 4.b del Formulario A.
- **Regularidad en la carrera**: debe citar la RR 169/22 y fijar el número de asignaturas (entre 2 y 4 cada 2 años) que el Anexo deja a la Facultad; aplazos ≤ 33 % (con la excepción de las últimas 6 materias); plazo ≤ doble de la duración (§11.1). Exigir "la totalidad de las asignaturas por año" no se ajusta a ese esquema. Carreras de formación militar: remitir al Reglamento de Regularidad Específico del art. 3° de la RR 169/22 (si la carrera es de capacitación para personal en actividad, que encuadre como "formación militar" es punto a verificar). Modelo en §12.1.
- **Readmisión/reincorporación** ausente o sin causales de readmisión automática (Form. C, pto. 4.1; RR 169/22, Anexo, arts. 5 y 8).
- Regularidad de asignatura confundida con aprobación (incisos de promoción dentro del artículo de regularidad); paréntesis que atribuyen la regularidad solo a los parciales cuando también se exige asistencia.
- Asistencia regulada solo para presenciales en un reglamento que también abarca EaD; en EaD, porcentaje mínimo de "actividades obligatorias" (contradicción: si son obligatorias, son todas; distinguir evaluaciones obligatorias de actividades programadas con mínimo).
- "Calificación final" sin definir (promedio de parciales vs. examen final).
- Promoción directa sin prever qué pasa con promedio ≥ 4 y < 7, con promedio < 4 (recursar) ni tras agotar las oportunidades de examen final; "materias que cuenten con este régimen" sin decir cuáles; sin turnos de examen ni vigencia de la regularidad.
- Examen libre que no excluye la PPS.
- Regularidad y promoción: calificación mínima, recuperatorios, nota final donde lo pide el Formulario C; escala de calificación con conceptos incoherentes (p. ej. 0 "Insuficiente" y 1–3 "Reprobado").
- Remisiones a secciones eliminadas (p. ej. Reincorporación → 4.3.2 Licencias borrada).
- TFI/Proyecto integrador: procedimiento del cuerpo del texto vs. apéndices, destinatario del dictamen.

**PPS**
- Ámbitos, objetivos, evaluadores y nota de aprobación definidos (y para qué carreras rige esa nota); "sujeta al régimen de promoción" sin aclarar en qué sentido.
- Aclarar si se requieren convenios (punto 7.2 del Formulario C). Si la PPS se hace en destinos de la Fuerza, verificar si existe convenio marco UNDEF–Fuerza.
- EaD: supervisor en el ámbito (quién certifica in situ) y cómo se garantiza la presencialidad (Form. C, pto. 7.2).
- Instructores militares que evalúan o acreditan la PPS cuando el propio reglamento dice que no sustituyen al docente en la evaluación.
- PPS que se cursa en simultáneo con las asignaturas que integra (comparar sus contenidos mínimos con las asignaturas del mismo cuatrimestre).
- PPS cuyos contenidos mínimos reiteran los de asignaturas previas, o "campo de PPS" formado por asignaturas con más horas teóricas que prácticas y prácticas solo simuladas: parece una asignatura más que una práctica en ámbito real.
- PPS planteada de forma distinta en el Formulario A y en el C (ver §2, paso 4).

**EaD (Formulario C, cap. 8)**
- 1.1 sin sedes ni unidades de apoyo.
- 8.3 que enumera funciones sin nombrar roles (contenidista, tutor docente, tutor tecnológico, tutor administrativo) ni quién los ejerce.
- 8.4 sin relación tutor/estudiante (sugerida: hasta 25) ni planificación del seguimiento.
- 8.5 sin nombre de la plataforma ni previsión de videoconferencia; 8.6 sin responsable de revisión de materiales.

**Datos**
- Cargas horarias con errores de tipeo (p. ej. "276220").
- Correlatividades con asignaturas del mismo cuatrimestre; mismo código con distintos contenidos entre planes de la unidad.
- **Distribución de carga semanal**: calcular horas semanales por cuatrimestre y compararlas con el promedio (total ÷ cantidad de cuatrimestres). Una diferencia grande (p. ej. 34 h vs. 20 h) no viola la RR 485/25 (no fija máximo) pero va como punto a verificar: considerar instrucción militar en ESSA, personal en actividad que cursa a distancia, el peso del trabajo autónomo cuando se incorpore el CRE y el efecto de cuello de botella si el cuatrimestre cargado concentra correlatividades. Proponer movimientos concretos de asignaturas **sin correlativas**, verificando que no rompan ninguna correlatividad, o pedir que se fundamente en el 1.b si es intencional.
- Denominación del título sin respaldo en contenidos (art. 6); superposición con otra oferta UNDEF (art. 1), sobre todo entre tecnicaturas de la misma sede que comparten asignaturas: el 1.a debe fundamentar la no superposición.
- Modificación mal clasificada como estructural/no estructural.
- Falta de plan de transición/equivalencias entre plan viejo y nuevo (Formulario B).
- Relación tutor/estudiante en EaD por encima de lo sugerido.

## 4. Formato de respuesta

Conciso y estructurado, **en este orden fijo** (pedido expreso de Leandro): primero lo que está bien, después lo que ya se señaló y sigue faltando, y recién después lo nuevo.

1. **Conclusión en una o dos líneas** (¿se puede presentar?, ¿cuál sirve de modelo?, ¿es compatible?).
2. **✅ Lo que está correcto** — siempre primero entre los hallazgos. Cada ítem con tilde verde (✅) y lo verificado en concreto (números, puntos del formulario, artículos), para que se lea como chequeado y aprobado. Incluir aquí, con ✅, las observaciones previas ya resueltas por la unidad académica o por otro revisor (aunque la marca esté pendiente de aceptar), indicando el n.° de comentario o el autor de la marca.
3. **Ya señalado y pendiente** — sección aparte, solo con lo que **ya fue observado** en comentarios o correcciones (control de cambios) de revisores previos (UNDEF, SA, Secretaría Académica, etc.) y **sigue sin resolverse** o está resuelto a medias. Por cada ítem: n.° de comentario o autor de la marca, qué se pidió y qué falta. **No agregar acá opiniones, ampliaciones ni correcciones propias**: se transcribe el estado de lo ya señalado. Ordenar los ítems **según su ubicación en el texto**.
4. **Observaciones, correcciones y agregados nuevos** — numerado **en el orden en que aparecen en el texto revisado** (pedido expreso de Leandro): de la primera a la última ubicación (encabezado, art. 1, art. 2…, o punto 1.a, 1.b… del formulario), no por gravedad ni por tema. Cada punto empieza indicando su ubicación (artículo, punto o tabla). Si una observación toca artículos distantes, dividirla y ubicar cada parte donde corresponde; lo que falta (p. ej. un artículo ausente) se ubica donde debería ir; las observaciones generales sobre todo el texto (forma, terminología) van al final. Cada punto con: qué dice el documento → qué exige la norma (con artículo o punto del formulario) → **redacción propuesta lista para pegar** (en cita, con números en el formato "TRES (3)" y marcadores `[COMPLETAR – …]` donde la decisión es de la unidad académica). Para correcciones de una o dos palabras basta "debe decir: …" **solo si hay norma o error objetivo detrás**; si es mejora de redacción, "se sugiere: …". Un problema de redacción de fondo (circularidad, falta de sujeto, ambigüedad sobre quién designa) va como punto propio con la explicación completa, no en media línea dentro de otro punto. Incluye:
   - hallazgos propios que ningún revisor señaló;
   - **ampliaciones o correcciones a lo ya señalado** (p. ej. un comentario previo que se queda corto, una marca de otro revisor con un error o una cita equivocada): van en esta sección, no en la anterior, remitiendo al n.° de comentario o marca de origen ("amplía #105").
5. **Puntos a verificar** (dudas normativas o de datos, no errores seguros; incluye normas citadas o sugeridas que no están en el proyecto).
6. **🎖️ Requisitos propios de carrera militar** (no se observan, se señalan aparte) — requisitos de ingreso o permanencia que vienen del mundo militar o exceden lo académico (ver §3, "Estudiantes y evaluación"): ubicación + qué dicen, en una línea cada uno, en el orden del texto. Abrir con una línea que indique por qué corresponden (p. ej. "Carrera cerrada, dirigida a postulantes al cuadro de Suboficiales (3.1)"). Si el mismo párrafo plantea además un problema académico (quién decide la regularidad, remisión mal numerada), ese aspecto queda en Observaciones y aquí se aclara en una línea. Omitir la sección si no hay requisitos de este tipo.
7. **N/A (no aplica)** — normas, puntos del formulario o requisitos que no corresponden al tipo de carrera, con el motivo en pocas palabras (p. ej. "RR 427/25 – N/A: posgrado", "RESOL-2023-2600-APN-ME – N/A: posgrado", "Tipo de plan – N/A: solo posgrado", "4.c tabla de modalidad – N/A: 100 % presencial", "Cap. 8 Form. C – N/A: no es EaD", "Cap. 6 Form. C – N/A: sin TFI"). No mezclarlos con los puntos a verificar.
8. Ofrecer un siguiente paso concreto.

Si el documento no trae comentarios ni marcas de revisores previos, omitir la sección 3 (o dejar una línea: "Sin observaciones previas").

No inventar artículos ni requisitos: si algo no se pudo verificar en la norma, decirlo. Si un hallazgo propio resulta erróneo o estaba sobredimensionado, corregirlo explícitamente (retirarlo, pasarlo a sugerencia o a punto a verificar) y decir de dónde había salido.

Si Leandro pide que se explique un hallazgo, responder con: qué exige la norma (cita) → qué promete o dice el documento (con ubicación) → qué muestra el plan (datos verificados, tablas si ayudan) → por qué importa → opciones concretas.

Si Leandro pregunta "cómo se mejora" o "cómo se expresa" un punto: dar la redacción completa del artículo (o artículos nuevos con "bis"/"ter" para no renumerar), una breve justificación por decisión, las cuestiones que debe definir la unidad académica y cómo se cargaría en el .docx (inserción "SA-UNDEF" + respuesta en el hilo del comentario). Si hay dos variantes razonables, darlas y recomendar una.

## 5. Extracción técnica (solo lectura)

- **.docx con control de cambios:** `pandoc archivo.docx --track-changes=all -t plain --wrap=none` (sin `--track-changes=all` se pierde el texto borrado). Esta salida sirve solo para leer, nunca para generar el entregable. Ojo: pandoc intercala el texto de los comentarios dentro del cuerpo; no confundirlos con el texto del documento.
- **Texto aceptado vs. rechazado:** `pandoc --track-changes=accept` y `--track-changes=reject` a texto plano y `diff` entre ambos: muestra de un vistazo todo lo que cambiaron los revisores y cómo queda el texto final (solo lectura).
- **Numeración:** pandoc pierde la numeración automática de Word; antes de observarla, renderizar (`soffice --convert-to pdf` + `pdftotext -layout`).
- **Tablas de .docx:** `python-docx` recorriendo `doc.tables`.
- **Comentarios con su texto anclado:** leer `word/comments.xml` y `word/document.xml` con `zipfile` + `xml.etree` (o regex), emparejando `commentRangeStart`/`commentRangeEnd` por id (pandoc no exporta los anclajes). Registrar autor y fecha. Si el anclaje es un solo carácter (".", "a"), leer el texto previo para entender a qué se refiere. Los comentarios vacíos de un revisor también se registran (p. ej. tres comentarios vacíos de SA sobre el CPRES señalan una duda). Las respuestas en hilo se ven en `commentsExtended.xml` (`w15:paraIdParent`).
- **Marcas previas:** listar `w:ins`/`w:del` con autor y el texto inmediatamente anterior (para detectar espacios o puntos perdidos). Pueden ser de la misma sigla "SA" que firma comentarios. Una `w:del` de párrafo (`<w:del/>` dentro de `w:pPr/w:rPr`) solo une párrafos: no confundirla con el borrado del texto. Ojo con regex no anidadas: un `<w:ins …/>` vacío seguido de un `</w:ins>` lejano da falsos bloques enormes.
- **PDF con texto:** `pdftotext -layout`.
- **PDF escaneado** (solo si hace falta confirmar la redacción exacta de la RR 485/25 o leer otra norma escaneada, p. ej. el Anexo de la RR 169/22): `pdftoppm -r 200 -gray -png` y luego `tesseract --tessdata-dir td -l spa --psm 6`. Si falta el idioma español, descargar `spa.traineddata` de `raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/` a una carpeta local `td/`. Un `grep` sin resultados sobre un PDF escaneado no prueba que la norma no diga algo.
- **PDF que en realidad es un zip de JPEG:** probar `unzip -l`; si trae imágenes, extraerlas y aplicar OCR.
- Para comparar entre documentos, pasar todo a texto plano y usar `grep -i -E` con los términos clave (reglamento, Comisión, PPS, modalidad, regularidad, número de norma).

## 6. Tecnicaturas ESSA: modelo común y particularidades de escalafón

Modelo base de reglamento: el de **Electromecánica Naval (FO_C_ANEM)**, corregido; tomar de Interpretación Musical la designación por Disposición Decanal del Director.

Rasgos comunes de las tecnicaturas presenciales (permiten un reglamento común): presenciales, por competencias, cerradas a aspirantes a Suboficial, dos años, cuatrimestrales, tres asignaturas de PPS. **Excepción**: Gestión de Recursos de la Armada es a distancia y está dirigida a suboficiales en actividad (no a aspirantes): no usar el modelo común sin adaptar.

Campos que varían por escalafón (dejar como marcadores `[COMPLETAR – ESCALAFÓN]`):
- Composición de la Comisión Académica.
- Perfil del Coordinador.
- Requisitos/credenciales docentes.
- Objetivos y ámbitos de la PPS (p. ej. Arsenal Naval Puerto Belgrano).
- Organismo que asigna vacantes (DGED, DGPN o DIAP).

Normas a citar en todos: RR 169/2022 y RR 485/2025. Quitar RR 66/2022; reemplazar RR 117/22. La OP 06/18 figura en reglamentos anteriores pero no está verificada (ver §1): no exigirla.

Carreras ya trabajadas como referencia: Interpretación Musical (Músico), Electromecánica Naval (Arsenal Electromecánico), Mantenimiento Naval y Operación de Dique, Control de Daños, Gestión de Recursos de la Armada (EaD). Otras: Especialización en Estrategia Operacional y Planeamiento Militar Conjunto (ESGC), Licenciatura en Gestión Tecnológica – CCC (EaD).

**Antecedentes – Formulario A de Electromecánica Naval (versión 30-10-2026):** 21 asignaturas, 1664 h, aritmética correcta (522 T + 1142 P; 6/27/44/23 %); carga semanal 24/34/26/20 h. Hallazgos principales: plan casi exclusivamente mecánico frente a un título, perfil y alcances con componente eléctrico, de propulsión y de armas (art. 6); sin CRE; 1.b incompleto; sin fundamentación de no superposición con Mantenimiento Naval y Operación de Dique (asignaturas compartidas con contenidos distintos, ya observado por SA y M. J. Ganem); 4.b condicionado a reglamentación de la Armada; 4.c/4.d mal numerados; Ley 24.848 por 24.948. En nuevas versiones, verificar primero si se resolvió el punto del área eléctrica.

**Antecedentes – Gestión de Recursos de la Armada (EaD; revisión 5-11-2026):**
- *Formulario A* (con marcas de SA, M. L. Pereyra, María José): 12 asignaturas, 1440 h, aritmética correcta (768 T + 672 P; 13,33/33,33/31,11/22,22 %; el documento pone 22,23 %); carga semanal 26/20/22/22 h. Hallazgos: sin CRE ni CPRES; título de la RR 485 mal citado; sin fundamentación de no superposición; 1.b incompleto; 2.a sin áreas de desempeño; 4.b con condición de permanencia (hoy: va como requisito propio de carrera militar, §3); falta 4.c (tabla de áreas rotulada "c"); Reglamentación sin cuatrimestre y anuales bajo "Primer cuatrimestre" (#28 SA); "campo de PPS" = Didáctica y Liderazgo, con más teoría que práctica y prácticas simuladas; título con poco respaldo en recursos financieros/presupuestarios (art. 6); marca de SA que deja "navalesy".
- *Formulario C* (con comentarios de Gazpio, María José, Gabriela, SA): Comisión Académica de 5 a 7 miembros (contra art. 14) y representantes "designados por el Cuerpo Docente"; regularidad sin RR 169/22 y con "totalidad de las asignaturas por año"; el "Consejo de Dirección de la SEU ESSA" decide regularidad, reincorporación y promedios (SA ya lo había corregido por Comisión Académica y la unidad lo repuso); RR 169/22 citada para licencias; instructores que evalúan la PPS; PPS como acreditación de actividades del destino, distinta de la del Formulario A; sin relación tutor/estudiante; marcas que dejan "laFacultad", "elSistema" y un punto perdido en 8.1. En nuevas versiones, verificar primero Comisión Académica, regularidad, Consejo de Dirección y la alineación de la PPS entre A y C.

## 7. Entregables posibles

- Observaciones cargadas como comentarios en el .docx original, firmados "SA-UNDEF", con el control de cambios y los comentarios originales intactos.
- **Versión con control de cambios** (§8): correcciones como marcas de revisión "SA-UNDEF" que el próximo corrector acepta o rechaza, más marcas previas pendientes y comentarios.
- Listado de incidencias priorizado en Google Sheets (skill `incidencias-carreras-undef`).
- Modelo limpio de reglamento con marcadores por escalafón (solo si Leandro pide expresamente una versión limpia).
- Planilla de seguimiento de planes recibidos (carrera, tipo, unidad académica, fecha, contacto, responsable, versión, estado, observaciones).

## 8. Versión con control de cambios (procedimiento)

### 8.1 Qué se corrige y qué no

Antes de editar, si no está claro el alcance, preguntarlo en una línea. Por defecto:
- **Se corrige con marcas**: lo que UNDEF puede resolver sin datos de la unidad académica (correlatividades imposibles, redacción de alcances, párrafos que van en otro apartado, textos que corresponden a otro formulario, restos de copiar y pegar, citas normativas desactualizadas o mal numeradas, numeración, unificación de rótulos como "Cuatrimestral", duplicaciones evidentes, artículos que quedan vacíos o rotos al aceptar marcas previas, espacios y puntos perdidos por marcas ajenas).
- **Se inserta un marcador** `[COMPLETAR – …]` (en cursiva, como inserción) donde falta información que solo la unidad académica puede dar: CRE, CPRES, vacancia/no superposición, 1.b, áreas de desempeño del 2.a, Pautas Presupuestarias, ámbitos de PPS, datos de escalafón, número de asignaturas para la regularidad (2 a 4), duración en funciones, cantidad de representantes docentes, unidades de apoyo EaD, roles EaD. Cada marcador cita el artículo o punto del formulario que lo exige.
- **No se corrige, solo se comenta**: decisiones de fondo de la unidad académica (p. ej. coherencia título–contenidos, cambiar la denominación del título o agregar asignaturas, redefinir el 4.b, reubicar asignaturas por carga semanal o simultaneidad con PPS, alinear la PPS entre A y C), reestructuraciones grandes de tablas (salvo pedido expreso), celdas que ya son inserciones de otro revisor, sugerencias pedagógicas menores y toda mejora de redacción sin norma detrás.
- **Requisitos propios de carrera militar** (§3): no se corrigen ni se borran. Si se deja constancia en el .docx, va como comentario neutro "SA-UNDEF": "Requisito propio de carrera militar – se señala, no se observa".
- **Responder comentarios previos** cuando se amplía o matiza una observación de otro revisor: como respuesta en el mismo hilo (`comment.py --parent <id>`), no como comentario suelto.
- Las marcas previas de otros revisores quedan pendientes; nunca se editan, aceptan ni rechazan. Si al aceptarlas el texto queda vacío o roto, la redacción correcta se **inserta** como marca "SA-UNDEF" a continuación, sin tocar las marcas ajenas.

### 8.2 Cómo escribir las marcas (XML)

Trabajar sobre la copia ya comentada (o el original): unzip → borrar symlinks → `merge_runs.py` → editar `word/document.xml` → zip. Atributos de cada marca: `w:id` único (tomar un número mayor que el máximo `w:id` de revisiones existente, p. ej. desde 9001), `w:author="SA-UNDEF"`, `w:date` ISO actual. Copiar siempre el `w:rPr` de la corrida original (sin su `w:rPrChange`).

- **Borrar parte de una corrida**: partirla en tres — `<w:r>` con el texto previo, `<w:del …><w:r>rPr<w:delText xml:space="preserve">texto borrado</w:delText></w:r></w:del>`, `<w:r>` con el texto posterior.
- **Reemplazar**: la `w:del` anterior seguida de `<w:ins …><w:r>rPr<w:t xml:space="preserve">texto nuevo</w:t></w:r></w:ins>`. Preferir el cambio mínimo cuando la celda es angosta (p. ej. "Cuatrim." → borrar "." e insertar "estral").
- **Borrar una corrida entera**: envolverla en `<w:del>` y cambiar `w:t` por `w:delText`.
- **Insertar texto**: `<w:ins>` con una corrida nueva, después del `</w:r>` correspondiente.
- **Insertar un párrafo nuevo**: `<w:p>` después del párrafo de referencia, clonando su `w:pPr` (sin `w:pPrChange` ni marcas previas; quitar `w:numPr` si no debe llevar viñeta) y agregando `<w:ins …/>` dentro de `w:pPr/w:rPr`; el texto va en `<w:ins><w:r>…</w:r></w:ins>`. Sirve también para agregar una línea dentro de una celda (p. ej. "CRE: [COMPLETAR…]" en el encabezado) sin tocar la estructura de la tabla.
- **Borrar un párrafo entero**: cada corrida con texto dentro de `<w:del>` (`w:delText`) y `<w:del …/>` como primer hijo de `w:pPr/w:rPr`.
- Nunca tocar corridas que ya están dentro de un `w:del` o `w:ins` de otro autor; si el texto a corregir aparece en una tabla ya marcada como eliminada, corregir solo la versión vigente (p. ej. la caja 4.a).
- No mover ni borrar marcadores de comentarios (`commentRangeStart`, `commentRangeEnd`, `commentReference`).
- **Cambios repetidos en muchas celdas**: primero recolectar todas las corridas que coinciden (posición y texto) y después aplicar los cambios recorriéndolas **en orden inverso**. No usar un bucle "mientras haya coincidencias": la corrida que queda tras una inserción sigue coincidiendo y el bucle no termina (o duplica la corrección).

**Comentarios en documentos que vienen de Google Docs** (tienen `w:sdt` con `w:tag w:val="goog_rdk_…"` que envuelven `commentRangeStart`):
- No poner el `commentReference` de un comentario nuevo justo antes de un `w:sdt` que abre el rango de otro comentario: anclar el comentario en otra corrida cercana (p. ej. el título del apartado).
- En **respuestas** a un comentario previo: poner el `commentRangeStart` de la respuesta antes del `w:sdt` del padre, y el `commentRangeEnd` + `commentReference` de la respuesta **después** de la corrida `commentReference` del padre (no entre el `commentRangeEnd` del padre y su referencia).
- Si no se respeta esto, LibreOffice no abre el archivo ("Unspecified Application Error"). Para encontrar el comentario culpable: armar el .docx con el `document.xml` editado y el `comments.xml` original (debe abrir), y luego agregar los comentarios nuevos de a uno.

### 8.3 Verificación obligatoria

1. `scripts/office/validate.py entregable.docx --original orig.docx --author "SA-UNDEF"` (del skill `docx`): debe pasar; confirma que todo cambio de texto propio está marcado.
2. Comprobar que, rechazando las marcas "SA-UNDEF", el documento vuelve al original con todas sus marcas previas:

```python
import zipfile, re
TAGS = ['<w:ins ', '<w:del ', '<w:delText', '<w:moveFrom ', '<w:moveTo ', '<w:rPrChange', '<w:pPrChange', '<w:tcPrChange', '<w:trPrChange', '<w:sectPrChange', '<w:tblPrChange']
def marks(f, rechazar_propias=False, autor='SA-UNDEF'):
    x = zipfile.ZipFile(f).read('word/document.xml').decode('utf8')
    if rechazar_propias:
        a = re.escape(autor)
        x = re.sub(r'<w:ins [^>]*w:author="'+a+r'"[^>]*>.*?</w:ins>', '', x, flags=re.S)
        x = re.sub(r'<w:(ins|del) [^>]*w:author="'+a+r'"[^>]*/>', '', x)
        x = re.sub(r'<w:del [^>]*w:author="'+a+r'"[^>]*>(.*?)</w:del>', lambda m: m.group(1).replace('w:delText', 'w:t'), x, flags=re.S)
    counts = {t: x.count(t) for t in TAGS}
    deleted = ''.join(re.findall(r'<w:delText[^>]*>([^<]*)', x))
    inserted = ''.join(''.join(re.findall(r'<w:t[^>]*>([^<]*)', m)) for m in re.findall(r'<w:ins [^>]*>(.*?)</w:ins>', x, re.S))
    return counts, deleted, inserted
assert marks('orig.docx') == marks('entregable.docx', rechazar_propias=True), 'Se alteraron marcas previas: NO entregar'
```

3. Comprobar que todos los comentarios originales siguen en `comments.xml` y que cada comentario nuevo tiene exactamente un `commentRangeStart` y un `commentReference` en `document.xml`; las respuestas deben tener `w15:paraIdParent` en `commentsExtended.xml`.
4. Renderizar a PDF (`soffice --convert-to pdf`, `pdftoppm`) y mirar las páginas con cambios: tachados e inserciones deben verse donde corresponde. **Si soffice falla, no entregar**: diagnosticar según §8.2 (comentarios en documentos de Google Docs).
5. Comprobar con `pandoc --track-changes=accept` que, aceptando todo, ningún artículo queda vacío ni con restos de puntuación, espacios faltantes o puntos perdidos.
6. Si solo se agregaron comentarios (sin marcas propias), basta con `marks('orig.docx') == marks('entregable.docx')`.

### 8.4 Entrega

- Enviar el .docx con SendUserFile (nombre sugerido: `<archivo>_UNDEF_SA_control_de_cambios.docx`).
- Resumir en pocas líneas: correcciones aplicadas como marcas, marcadores `[COMPLETAR]`, lo que quedó solo como comentario y por qué, respuestas a comentarios previos, y la confirmación de que las marcas previas siguen pendientes y los comentarios completos.

## 9. RR 485/2025 transcripta: artículos clave y listas de control de los Formularios

Transcripción del Anexo de la RR UNDEF 485/2025 (Expte. UNDEF 87/2017), obtenida por OCR y revisada. Usarla como lista de control punto por punto. Citar como "RR 485/25, art. X" o "RR 485/25, Formulario A, pto. X".

Estructura del Anexo: **Capítulo I** – Disposiciones generales (arts. 1–2); **Capítulo II** – De los planes de estudio (arts. 3–8); **Capítulo III** – De los reglamentos de funcionamiento de las carreras (arts. 9–14); **Capítulo IV** – De la presentación y los procedimientos (arts. 15–19); Apéndices I a III (Formularios A, B y C). Resolución: art. 1° aprueba el Anexo; art. 2° reemplaza el Anexo I de la RR 117/22; art. 3° carácter vinculante para presentaciones posteriores, sin afectar proyectos en trámite.

### 9.1 Artículos clave del Anexo

- **Art. 1** – Los proyectos de carreras nuevas deben estar fundamentados y responder a áreas de vacancia, **evitando toda superposición** con propuestas vigentes en la UNDEF.
- **Art. 2** – Los proyectos de modificación deben especificar cada modificación con su fundamentación académica y acompañarse de **planes de transición** entre el plan vigente y el propuesto.
- **Art. 3** – Deben atender este Reglamento y los criterios curriculares de la normativa nacional.
- **Art. 4** – Duración mínima: **pregrado 2 años**; pregrado regulado por el Estado 3 años; **grado 4 años**. No fija cargas horarias mínimas (si un reglamento las fija, p. ej. 1400 h o 2600 h, pedir que cite la norma nacional de origen). Los planes pueden incorporar el **CRE** (Crédito de Referencia del Estudiante): **25 a 30 horas** de trabajo total del estudiante; cada Facultad fija un valor único para todas sus carreras y el decano lo eleva al Rectorado **por disposición decanal** antes de presentar planes con CRE. Para cada actividad académica se especifican: carga de interacción pedagógica semanal y total, horas de trabajo autónomo, carga horaria total y CRE (RESOL-2023-2598-APN-ME, RESOL-2023-2600-APN-ME y RESOL-2025-556-APN-SE#MCH). **Desde el 1/1/2027 el sistema de créditos es obligatorio.** No fija un máximo de horas semanales.
- **Art. 5** – Carreras de grado del art. 43 LES: cumplir además los estándares y procedimientos de acreditación nacionales.
- **Art. 6** – La **denominación de la titulación y los alcances** deben guardar coherencia con los saberes y prácticas de la trayectoria formativa del plan.
- **Art. 7** – Títulos intermedios en carreras de grado: trayecto no menor a 2 años y alcances diferenciados del título final.
- **Art. 8** – Libertad de organización curricular (áreas, ciclos, módulos, ejes, asignaturas) que favorezca la articulación vertical y horizontal.
- **Art. 9** – El reglamento debe expedirse sobre: autoridades y órganos de gobierno (selección y funciones), selección y funciones de los docentes, condiciones de admisión, condiciones de permanencia, régimen de promoción y metodología de evaluación.
- **Art. 10** – EaD: además, opción pedagógica, enfoque y estrategias didácticas, sistema tutorial, roles docentes/tecnológicos/administrativos, recursos tecnológicos y materiales.
- **Art. 11** – Práctica profesional, pasantía, residencia o similar: capítulo con ámbito de desarrollo, modo de supervisión y evaluación y actores intervinientes.
- **Art. 12** – Trabajo Final Integrador, Tesis o similar: capítulo con designación y funciones de directores y tutores, plazos de presentación, características del órgano evaluador y modalidad de evaluación.
- **Art. 13** – Autoridades obligatorias: **Director de carrera y Comisión Académica**. Otras figuras (Co-director, Coordinador, Comisiones Asesoras) a criterio de la unidad académica. **Todos se designan por Disposición Decanal**, salvo lo previsto para doctorados.
- **Art. 14** – Todo órgano colegiado: **número impar**, **mínimo 3 y máximo 5** miembros.
- **Art. 15** – Las propuestas se elevan al Rector por disposición decanal; en modificaciones, la disposición indica fecha de entrada en vigencia del plan nuevo y de caducidad del anterior.
- **Art. 16** – Carreras nuevas: Formulario A (Apéndice I). Modificaciones: Formulario B (Apéndice II).
- **Art. 17** – Reglamentos: Formulario C (Apéndice III), ampliable con información complementaria.
- **Art. 18–19** – Aprobada por el Rector, la Secretaría Académica tramita reconocimiento oficial y validez nacional; art. 43 y posgrados requieren acreditación previa.

### 9.2 Formulario A – Presentación de Carreras Nuevas (Plan de estudios)

**Encabezado**: Universidad de la Defensa Nacional · (Unidad Académica) · (Sede Educativa) · (CPRES) · Carrera · Título que otorga · Nivel (Pregrado/Grado/Posgrado) · Modalidad (Presencial/A distancia) · Tipo de plan (**solo posgrado**: Estructurado/Semiestructurado/Personalizado) · Carga horaria total · Duración en años · **CRE**.

**1 – Fundamentación y objetivos de la carrera**
- **1.a Antecedentes que avalan la propuesta**: propósitos y motivos de creación; área de vacancia (nacional, CPRES y/o institucional) si existe; pertinencia del dictado por la Unidad Académica y la Sede; antecedentes en la disciplina (carreras o cursos afines, extensión, I+D). En carreras militares o de formación para la Defensa puede centrarse en necesidades de la Fuerza o del Ministerio de Defensa.
- **1.b Definición de la carrera**: área disciplinar y objeto de estudio; estructura curricular; características y fundamentación de las orientaciones (si existen); criterios de integración teórico-práctica; estrategias de enseñanza.
- **1.c Objetivos de la carrera**: un objetivo general expresado en función de la carrera, con su aporte al graduado, la disciplina, la sociedad y la institución; pueden agregarse objetivos específicos. Verbos sugeridos: Formar, Brindar, Capacitar, Desarrollar.

**2 – Perfil del Graduado**
- **2.a Perfil del graduado**: conocimientos, aptitudes y capacidades adquiridas; **áreas y/u organismos de futuro desempeño**.
- **2.b Alcances del título** (solo pregrado y grado): actividades para las que resulta competente según perfil y contenidos. Art. 43 LES: consignar además las actividades reservadas.

**3 – Condiciones de Ingreso**
- **3.a Destinatarios**: si es cerrada a la formación militar, abierta a la comunidad o dirigida a un grupo determinado.
- **3.b Requisitos académicos de ingreso**: condiciones académicas. CCC: título/s de origen con mínimo de años y carga horaria. Posgrado: áreas disciplinares de los títulos de grado requeridos.

**4 – Estructura y organización curricular**
- **4.a Caja curricular**. *Tipo 1* (sin CRE): asignatura, horas semanales, horas totales, régimen de cursada (anual, cuatrimestral, trimestral o bimestral), correlatividades; horas teóricas y prácticas totales **solo obligatorias para art. 43 y posgrados**; electivas listadas al pie. *Tipo 2* (con CRE): régimen, horas de interacción pedagógica semanal y total, horas de trabajo autónomo, horas totales, **CRE**, teóricas/prácticas (art. 43 y posgrado) y correlatividades. Horas en **horas reloj**; fila de total.
- **4.b Otros requisitos para acceder al título**: instancias que **no suman** a la carga horaria de la caja.
- **4.c Modalidad de dictado de las asignaturas**: presencial/a distancia y distribución de cargas (subtotales y %). **Si todas las asignaturas tienen la misma modalidad, no se requiere la tabla** (pero el punto 4.c se mantiene con una línea que lo aclare).
- **4.d Cargas horarias por áreas curriculares, bloques o campos de formación** (**obligatorio para art. 43 y posgrado**): cantidad de asignaturas, horas teóricas, prácticas, totales y % sobre el total. En art. 43, áreas según la resolución de estándares; en el resto, coherentes con los requisitos disciplinares y las asignaturas.

**5 – Contenidos mínimos de cada asignatura**: nombre, área curricular/bloque de conocimiento, contenidos mínimos (conocimientos indispensables para los objetivos y el perfil; extensión acorde a complejidad y carga horaria; **orden pedagógico**: coherencia jerárquica, secuencia cronológica y/o complejidad creciente). El formulario **no pide código** en la ficha.

**6 – Pautas Presupuestarias**: origen del financiamiento de la carrera (en EaD, considerar tutores y plataforma).

### 9.3 Formulario B – Modificación de planes de estudio vigentes

**Encabezado**: igual que el Formulario A (incluye **CRE**).

**1 – Fundamentación y objetivos**
- **1.a Marco normativo**: resolución de creación de la carrera; resolución que aprueba el plan vigente; último dictamen/resolución CONEAU (si corresponde); última resolución de reconocimiento oficial y validez nacional.
- **1.b Definición de la carrera** y **1.c Objetivos**: iguales que en el Formulario A.

**2 – Perfil del Graduado** (2.a Perfil con áreas/organismos de desempeño; 2.b Alcances) y **3 – Condiciones de Ingreso** (3.a Destinatarios; 3.b Requisitos académicos): iguales que en el Formulario A.

**4 – Modificaciones realizadas**
- **4.a Tipo de modificación** (Estructural / No estructural) y descripción. **Estructural**: reformula la denominación de la carrera o del título, modifica los alcances, el perfil del graduado y/o **aumenta o disminuye la carga horaria total en más del 20 %**. **No estructural**: toda otra reformulación. Explicar si afecta orientaciones o requisitos para el título.
- **4.b Fundamentación de los cambios**.
- **Cuadro comparativo con el plan vigente**: asignaturas que se modifican (contenidos, carga horaria, etc.); que continúan sin cambios; que se eliminan; nuevas (incluye desdobladas y fusionadas).

**5 – Estructura y organización curricular**: 5.a Caja curricular (Tipo 1 o Tipo 2, igual que 4.a del Form. A); 5.b Otros requisitos; 5.c Modalidad de dictado (tabla no requerida si todo es igual); 5.d Cargas por áreas (**solo art. 43 y posgrado**).

**6 – Datos de cada asignatura**: nombre, área/bloque, contenidos mínimos (mismos criterios que Form. A pto. 5).

**7 – Planes de transición**: plan de transición entre plan nuevo y vigente, con **fecha de caducidad del plan vigente**, **tablas de equivalencias** entre ambos planes y **fecha de entrada en vigencia** del nuevo.

**8 – Pautas Presupuestarias**: origen del financiamiento.

### 9.4 Formulario C – Reglamento de Carrera (lineamientos mínimos obligatorios; pueden agregarse capítulos)

**Capítulo 1. De la carrera**
- **1.1 Marco normativo e institucional general**: inserción institucional; marco normativo nacional, rectoral y decanal. EaD: sedes y unidades de apoyo.
- **1.2 Opción pedagógica elegida**: presencial o a distancia.

**Capítulo 2. Autoridades de la carrera y cuerpo docente**
- **2.1 Director**: forma de selección y designación, requisitos, funciones y **duración en funciones**.
- **2.2 Comisión Académica**: forma de selección y designación, requisitos, funciones y **duración en funciones** (3 a 5 miembros, impar: art. 14).
- **2.3 Otras autoridades y órganos de gobierno** (no obligatorios: Comisiones asesoras, Co-director, Coordinador): si existen, selección y designación, requisitos, funciones y duración.
- **2.4 Cuerpo docente**: cómo se designan, funciones y requisitos para la planta docente y de tutores (tutores en EaD y en presenciales con más de 30 % de actividades a distancia).

**Capítulo 3. De las condiciones de admisión**
- **3.1 Requisitos de admisión**: documentación a presentar por el aspirante para inscribirse.
- **3.2 Inscripción**: si se requieren conocimientos previos, titulaciones u otros requisitos.
  (Así figuran en el texto de la norma, aunque el contenido de 3.1 y 3.2 parece invertido respecto de sus títulos; no observarlo como error del proyecto si sigue ese orden.)

**Capítulo 4. De las condiciones de cursado**
- **4.1 Regularidad en la carrera**: requisitos por año para mantener la regularidad; procedimiento de **reincorporación** y reconocimiento de la trayectoria. EaD: requisitos acordes a la modalidad.
- **4.2 Regularidad y régimen de promoción de asignaturas**: requisitos de regularidad en asignaturas; **sistema de calificaciones**; **régimen de promoción**; plazo para presentar Trabajos Finales o Tesis (si hay).

**Capítulo 5. De la evaluación de los aprendizajes**
- **5.1 Metodología de evaluación**: formas de evaluación. EaD: cómo se garantiza la **indelegabilidad de la autoría**.

**Capítulo 6. De la Tesis o Trabajo Integrador Final** (solo si la carrera lo requiere)
- **6.1 Plan de Tesis o TIF**: definición del espacio, objetivos de aprendizaje, correlatividades. EaD: evaluación final con participación virtual o presencial de todos los actores y recursos tecnológicos.
- **6.2 Presentación del plan o proyecto**: plazos, requisitos (correlatividades), documentación y circuito.
- **6.3 Director de Tesis o Tutor de TIF**: requisitos, selección, designación, funciones y **número máximo de tesistas** por director/tutor.
- **6.4 Presentación de la Tesis o TIF**: plazos, requisitos y documentación (puede haber apéndices con formato).
- **6.5 Jurado u órgano evaluador**: requisitos, forma de designación, **recusación** y normas de funcionamiento.
- **6.6 Evaluación final / defensa**: modalidad e instancias, sistema de calificación y pasos ante una **recomendación de reelaboración**.

**Capítulo 7. De la Práctica Profesional Supervisada** (solo si la carrera la requiere)
- **7.1 Objetivos y definición**: fundamentación, descripción y objetivos de aprendizaje.
- **7.2 Ámbitos de desarrollo**: ámbitos de las prácticas; si se necesitan **convenios** (obligatorios si la práctica es fuera del ámbito de la UNDEF). EaD: cómo se garantiza la presencialidad en las PPS.
- **7.3 Evaluación y acreditación**: formas de supervisión y evaluación por los docentes de la carrera.

**Capítulo 8. De la modalidad de Educación a Distancia** (solo EaD)
- **8.1 Condiciones de admisión: capacitación en recursos tecnológicos**: si hay cursos de introducción/inducción a la modalidad; describirlos.
- **8.2 Estrategias didácticas**: modelo y enfoque pedagógico; estrategias.
- **8.3 Roles docentes, tecnológicos y administrativos**: contenidistas/autores, tutor tecnológico, tutor docente, tutor administrativo, con sus funciones (pueden recaer en la misma persona).
- **8.4 Sistema tutorial**: planificación del seguimiento, consulta periódica, interacción tutor-estudiante y entre estudiantes. Relación sugerida: **hasta 25 estudiantes por tutor docente**.
- **8.5 Recursos tecnológicos y TIC**: accesibilidad, interactividad y multimedia de la plataforma; soportes y lenguajes; tecnología adoptada (entornos virtuales, videoconferencia, etc.).
- **8.6 Materiales didácticos**: modo de empleo y diseño de materiales de contenido, materiales que orientan el contenido (guías, tutoriales) y materiales de construcción colaborativa.

## 10. Reglamentos generales de Facultad (p. ej. Reglamento General de Pregrado y Grado de la FE)

No es un Formulario C de una carrera: es el marco común de la Facultad. Criterios de revisión:
- **Aprobación**: lo propone el Decano (Estatuto, art. 53.d) y lo aprueba el Rector, que aprueba los regímenes académicos y el régimen general de las carreras (art. 25, incs. 7 y 8). Corregir "aprobado por la UNDEF" → "por Resolución Rectoral".
- **Formulario C**: no se aplica punto por punto; se verifica que el reglamento general cubra lo común (autoridades, docentes, admisión, regularidad, promoción, evaluación: RR 485, art. 9) y **remita** a los reglamentos de cada carrera para PPS (art. 11; Form. C, cap. 7), Trabajo Final (art. 12; cap. 6) y EaD (art. 10; cap. 8).
- **Autoridades**: Director y Comisión Académica obligatorios, Coordinador optativo, todos por Disposición Decanal, con duración en funciones (arts. 13 y 14). Docentes según Estatuto (arts. 60–63).
- **Regularidad**: debe citar la RR 169/22, fijar el número de asignaturas (2 a 4) y prever readmisión (§11.1). Formación militar: Reglamento de Regularidad Específico (art. 3° de la RR 169/22).
- **Presentación de carreras**: remitir a la RR 485/25 (Formularios A, B y C; art. 15 para fechas de vigencia y caducidad en modificaciones; art. 2 planes de transición). La adecuación de reglamentos vigentes no surge del art. 3° de la RR 485: si se fija un plazo, es decisión de la Facultad.
- **EaD**: citar RESOL-2026-88-APN-R#UDN y RM 2599/23; prever asistencia e indelegabilidad de la autoría.
- **Equivalencias**: RR 52/26 (a verificar) y disposiciones decanales propias; unificar el nombre del órgano que dictamina.
- Formularios A/B como lista de control: N/A.

**Antecedentes – Reglamento General de Pregrado y Grado de la FE, v3.0 (revisión 4-11-2026):** con comentarios de UNDEF, SA, SA - UNDEF, M. D. Gazpio y M. J. Ganem. Hallazgos principales: art. 20 vacío al aceptar las marcas y sin RR 169/22; art. 21 con cita de la RR 169/22 inexistente (#102); sin readmisión; Comisión Académica sin regular y ",," en el art. 35; docentes "nombrados por la Sede" (art. 41, contra el Estatuto); CRE ausente; "RM 556/2025"; art. 26 todavía con RR 170/19; "N|" en el art. 25; "Art. III" de la RR 485 en el art. 43. En nuevas versiones, verificar primero los arts. 20, 21, 35 y 41.

## 11. Otras normas: datos verificados

### 11.1 RR 169/2022 – Reglamento de Regularidad (Expte. 74/2019)

Resolución:
- **Art. 2°**: las Facultades ajustan sus reglamentos internos de regularidad en 6 meses.
- **Art. 3°**: encomienda a las Facultades del Ejército, de la Armada y de la Fuerza Aérea un **Reglamento de Regularidad Específico** para estudiantes de carreras de formación militar, elevado al Rectorado previo a la aprobación del **Consejo de Dirección**.

Anexo I (habla de "carreras de grado"; los considerandos mencionan pregrado y grado: si un reglamento lo extiende a pregrado, pedir que lo diga expresamente):
- **Art. 1**: derechos (inscribirse y cursar, presentarse a mesas, servicios de apoyo, becas).
- **Art. 2**: para mantener la regularidad: a) aprobar entre **2 y 4 asignaturas en 2 años académicos consecutivos** (el número lo fija cada Facultad); b) aplazos **≤ 33 %** del total de asignaturas del plan, salvo en el trámite de las **últimas 6** materias; c) completar el plan en no más del **doble** de la duración.
- **Art. 3**: cada Facultad establece las condiciones de regularidad en la carrera y en cada asignatura, y el tratamiento para quien pierde la regularidad.
- **Art. 4**: esas condiciones se fijan por **Disposición Decanal** elevada al Rectorado para su aprobación.
- **Art. 5**: **readmisión automática** por enfermedad o discapacidad; otros estudios universitarios justificados; comisiones o viajes de estudio de más de 4 meses; traslado familiar, laboral, misión diplomática, investigación u otras similares; embarazo.
- **Art. 6**: certificado de materias aprobadas a quien pierde la regularidad.
- **Art. 7**: las disposiciones de pérdida de regularidad se elevan al Rectorado.
- **Art. 8**: al readmitido se le reconocen las materias aprobadas; la Facultad fija el plan al que se adscribe.
- **Art. 9**: cómputos desde el ciclo lectivo 2023.
- No contiene un régimen de **licencias**.

### 11.2 Estatuto UNDEF 2017 – artículos de uso frecuente

- **Art. 14**: Consejo de Dirección, órgano superior de gobierno.
- **Art. 25** (funciones del Rector): inc. 7 aprueba los regímenes académico y de disciplina; inc. 8 el régimen general de las carreras de pregrado, grado y posgrado; inc. 9 los planes de estudio; inc. 13 dicta los reglamentos de concursos docentes; inc. 14 designa a los docentes interinos y contratados.
- **Art. 41**: Decano y Vicedecano duran 3 años (referencia útil si se pide una duración para autoridades de carrera; no es obligatoria para ellas).
- **Art. 53** (funciones del Decano): d) propone la normativa de la Unidad Académica para aprobación del Rectorado; h) propone los planes de estudio.
- **Arts. 59–64**: docentes ordinarios (designa el Rector, previo concurso: art. 60), interinos (designa el Rector: art. 62), suplentes (designa el Decano ad referéndum del Rector: art. 63), extraordinarios (art. 64).

## 12. Modelos de redacción reutilizables

Adaptar al caso; los marcadores `[COMPLETAR]` son decisiones de la unidad académica.

### 12.1 Regularidad en la carrera

> **Artículo X°.** Para conservar la condición de alumno regular en la carrera, el estudiante deberá cumplir con las obligaciones académicas y administrativas establecidas en la Resolución Rectoral UNDEF N° 169/22, en el presente Reglamento y en el reglamento de la carrera correspondiente, o en las normas que en el futuro los reemplacen. A tal efecto, y en el marco del art. 2° del Anexo I de la citada Resolución, deberá:
> a. Aprobar como mínimo [COMPLETAR: entre DOS (2) y CUATRO (4)] asignaturas de su plan de estudios en el lapso de DOS (2) años académicos consecutivos.
> b. No registrar un número de aplazos superior al TREINTA Y TRES POR CIENTO (33 %) del total de asignaturas del plan de estudios. Esta condición no se aplicará a los aplazos que se produzcan en el trámite de aprobación de las últimas SEIS (6) asignaturas de la carrera.
> c. Completar la totalidad de las obligaciones del plan de estudios en un plazo que no exceda el doble de los años de duración teórica de la carrera.
> Lo dispuesto en el presente artículo se aplica sin perjuicio del régimen específico previsto para las carreras de formación militar.

Formación militar: "Las carreras de formación militar se regirán, en materia de regularidad, por el Reglamento de Regularidad Específico previsto en el art. 3° de la RR UNDEF N° 169/22. Hasta su aprobación, el reglamento de cada carrera explicitará las pautas para mantener la condición de regular." Agregar un artículo de readmisión con las causales del art. 5 y el reconocimiento del art. 8 del Anexo.

Decisión sobre la pérdida de regularidad: "La situación será analizada por la Comisión Académica, que elevará su dictamen al Decano para su resolución, conforme a la RR UNDEF N.º 169/2022."

### 12.2 Autoridades y Comisión Académica

> **Estructura.** La estructura de gestión de cada carrera estará conformada por el Director de Carrera y la Comisión Académica, de conformidad con el art. 13 del Anexo de la Resolución Rectoral UNDEF N° 485/2025. La Facultad podrá designar, además, UNO (1) o más Coordinadores de Carrera.
>
> **Designación y duración.** Las autoridades de la carrera serán designadas por el Decano mediante Disposición Decanal. El Director, los integrantes de la Comisión Académica y el/los Coordinadores durarán [COMPLETAR: p. ej. TRES (3)] años en sus funciones y podrán ser designados nuevamente.
>
> **Comisión Académica.** La Comisión Académica de cada carrera estará integrada por un número impar de miembros, no menor de TRES (3) ni mayor de CINCO (5) (RR UNDEF N° 485/2025, Anexo, art. 14), uno de los cuales será el Director de Carrera, quien la presidirá. Sus integrantes serán designados por Disposición Decanal, a propuesta del Director de Carrera, y deberán poseer título igual o superior al que otorga la carrera, preferentemente con experiencia docente o de gestión en el área disciplinar. La Comisión sesionará con la mayoría de sus miembros y adoptará sus decisiones por mayoría simple. Cada reglamento de carrera establecerá su composición específica.
>
> **Representantes del Cuerpo Docente** (si se prevén). [COMPLETAR – UNO (1) o DOS (2)] docentes de la carrera, propuestos por el Director de Carrera (o elegidos por sus pares y propuestos por el Director) para su designación por Disposición Decanal. Deberán poseer título universitario de nivel igual o superior al que otorga la carrera y experiencia docente en el área disciplinar. Actuarán como enlace entre el Cuerpo Docente y la Comisión Académica.
>
> **Funciones de la Comisión Académica.** a. Asesorar al Director en el seguimiento, la evaluación y la actualización del plan de estudios. b. Emitir opinión sobre las propuestas de modificación del plan y del reglamento de la carrera antes de su elevación. c. Analizar y dictaminar sobre las solicitudes de equivalencias, de readmisión y demás situaciones académicas de los estudiantes que le remita el Director. d. Evaluar los antecedentes de los docentes propuestos para la carrera. e. Proponer los integrantes de los tribunales de Trabajo Final y los ámbitos de Práctica Profesional, cuando la carrera los prevea.

Funciones de asesoramiento y dictamen, para no superponerse con las del Director ni con las del Coordinador. Si la Comisión dictamina sobre equivalencias, ajustar el artículo que asigna ese análisis a un "tribunal ad hoc".

### 12.3 Docentes

> Los docentes serán designados conforme a los arts. 60 a 63 del Estatuto de la UNDEF, a propuesta del Director de Carrera elevada por la Sede Educativa.

### 12.4 EaD (Formulario C, cap. 8)

> **Roles.** Docente contenidista: elabora y actualiza los materiales de su espacio curricular. Tutor docente: acompaña, orienta y evalúa a los estudiantes. Tutor tecnológico: [COMPLETAR – área o personal] asiste en el uso del entorno virtual. Tutor administrativo: [COMPLETAR] gestiona inscripciones, registros y comunicaciones. Estos roles podrán recaer en una misma persona.
>
> **Relación tutor-estudiante.** Cada tutor docente tendrá a su cargo hasta VEINTICINCO (25) estudiantes (RR 485/25, Formulario C, pto. 8.4).
>
> **PPS en EaD.** En cada destino o ámbito, un supervisor designado por la Unidad académica certificará las actividades realizadas; el docente responsable realizará el seguimiento a distancia y la evaluación y acreditación.