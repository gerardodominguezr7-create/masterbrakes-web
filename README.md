# MASTERBRAKES · Brakes System & Solutions

Versión multipágina optimizada para experiencia premium, conversión y uso móvil.

## Cambios principales
- Hero principal rediseñado con mensaje orientado a problema/solución.
- CTA principal a Servicios y CTA directo a WhatsApp con selector de sucursal.
- Sombrerete queda seleccionada por defecto en la automatización de WhatsApp.
- 5 reseñas visibles y bloque de tipos de vehículos atendidos.
- Botones de galería unificados como “Ver galería”.
- Enlaces oficiales de ubicación proporcionados por el cliente:
  - Sombrerete: https://share.google/h0KJQbao4Z2PWzfot
  - Pie de la Cuesta: https://share.google/veyZlv7FVN3zS64Zd
- Footer con llamada, WhatsApp, Maps y redes sociales.
- Secciones “También te puede interesar” reescritas desde el problema del cliente.
- Correcciones visuales de Frenos Custom, dropdown y FAQs.
- Fondo con isotipos sutiles e interacción ligera en tarjetas.
- Ajustes específicos para celular, tablet y escritorio.

## Contacto
- Sombrerete: 442 186 8438
- Pie de la Cuesta: 442 813 3715
- Correo configurado en footer: masterbrakes.12@gmail.com

- Correo oficial confirmado: masterbrakes.12@gmail.com


## v9 ajustes finales
- Hero simplificado sin texto descriptivo redundante.
- Acciones: Ver servicios, Ver galería y Cotiza ya (selector de sucursal por WhatsApp).
- Eliminados indicadores repetidos del hero; se conservan los 4 cuadrantes de métricas.
- Eliminada etiqueta “Trabajo real · Atención premium”.
- Identidad actualizada para usar el isotipo proporcionado por el cliente con texto MASTERBRAKES / Brakes System & Solutions.


## Ajuste v12
- Se eliminaron del contenido principal las tarjetas repetidas de sucursales y los mapas embebidos.
- Toda la información de Sombrerete y Pie de la Cuesta queda concentrada en el pie de página, con teléfono, WhatsApp y Maps.


Ajuste final v12: menú SERVICIOS en mayúsculas y nuevo mensaje principal propio de MASTERBRAKES.


## v14
- WhatsApp flotante visible en PC y móvil; enlace directo a Sombrerete 442 186 8438.
- Correcciones de compatibilidad para navegadores integrados (incluido WhatsApp).
- Frenos Custom conserva fondo oscuro, textos y componentes en móvil.
- Contenido `.reveal` visible en móvil aunque fallen animaciones JS.
- Responsive reforzado para servicios, FAQ, formularios, tarjetas y footer.


## v25 · Capa de animaciones premium (motion)
Archivos nuevos: `css/motion.css` y `js/motion.js` (cargados en todas las páginas después de `styles.css` / `script.js`).
- Intro de marca con cortina y línea lima (solo la primera vez por sesión).
- Barra de progreso de lectura en lima y header que se oculta al bajar y aparece al subir.
- Hero: zoom cinematográfico, parallax, reflector lima que sigue el cursor, brillo metálico sobre "seguro." e indicador de scroll.
- Eyebrows con línea que se dibuja; métricas con contador animado.
- Tarjetas con haz de luz giratorio en el borde y reflejo que sigue el cursor (Frenos Custom lo tiene siempre activo).
- "Cómo trabajamos": la línea se llena con el scroll y enciende cada paso.
- Franja en movimiento con los servicios (acelera con el scroll).
- Imágenes con revelado tipo cortina; galería con etiqueta al pasar el cursor.
- Botones con efecto magnético y CTA principal con pulso; WhatsApp flotante con onda.
- Estrellas de reseñas que destellan en secuencia; footer escalonado.
- Respeta `prefers-reduced-motion` y no oculta contenido si el JS falla.

SEO: canonical, Open Graph y Twitter Card en todas las páginas; datos estructurados `AutoRepair` con las dos sucursales en el inicio.


## v26 · Versión PRO
Secciones nuevas en el inicio (con material real del taller):
- **Anatomía del frenado** (`#anatomia`): imagen con puntos interactivos (disco, balatas, cáliper) que se recorren solos y responden al toque/clic.
- **Proyectos reales** (`#proyectos`): carrusel horizontal que avanza con el scroll en escritorio (deslizable en celular), contador 01/04 y tarjeta final con CTA.
- **El taller en movimiento** (`#taller`): dos videos verticales del taller en marcos de celular; se cargan y reproducen solo al verse.
Extras globales: cursor personalizado en escritorio (anillo lima con "Ver" sobre fotos/videos) y transición con cortina entre páginas.
Medios nuevos optimizados: `assets/pro/*.webp` y `videos/web/*.mp4` (H.264, sin audio, ~1.4–2.3 MB).
Nota técnica: `html, body` usan `overflow-x: clip` para permitir secciones sticky.
