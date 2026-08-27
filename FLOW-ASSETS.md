# Guía de assets separados para Google Flow

## Objetivo

Construir la experiencia por capas reutilizables. No generar una escena completa aplastada en una sola imagen o video. Voltio, telón, proyector, luz, audiencia y capturas de sitios deben poder moverse y ordenarse de manera independiente en la web.

## Ajustes de generación

- Modelo: Veo 3.1 Quality/Pro.
- Duración: 8 segundos por clip.
- Cámara: fija, sin zoom, paneo ni cambio de lente.
- Fondo: verde chroma uniforme (`#00FF00`), sin textura ni sombras.
- Audio: desactivado; el sitio controla su propio audio.
- Salidas: dos variantes por prompt y seleccionar la más estable.
- Formatos: 16:9 para desktop y 9:16 para móvil cuando el encuadre no admita un recorte seguro.
- Referencia de personaje: subir `public/assets/voltio-character-sheet.png` y, cuando ayude al encuadre, `public/assets/voltio-host-master-green.png`.

Regla central: cada clip contiene un solo elemento visual. Nada de tipografía, escenarios, marcos, público o utilería adicional si no pertenecen al asset solicitado.

## Inventario y nombres finales

Guardar los masters descargados sin editar fuera de `public/`. Los archivos optimizados para la web van en `public/video/layers/`.

| Capa | Desktop | Móvil | Repetición |
|---|---|---|---|
| Voltio presentador | `voltio-presenta.webm` | `voltio-presenta-mobile.webm` | no; mantener último cuadro |
| Telón | `telon-abre.webm` | `telon-abre-mobile.webm` | no; mantener abierto |
| Proyector | `proyector-loop.webm` | mismo desktop | sí |
| Haz de luz | `haz-dorado-loop.webm` | `haz-dorado-loop-mobile.webm` | sí |
| Audiencia | `audiencia-loop.webm` | `audiencia-loop-mobile.webm` | sí |

## Prompts

### 1. Voltio presentador

```text
Use the supplied Voltio character reference as an exact identity reference. One isolated full-body retro-futurist robot named Voltio, polished black lacquer body, refined gold Art Deco trim, warm golden lightbulb eyes, white cartoon gloves, tiny antenna spark, and a crisp readable gold 4GS chest emblem. Voltio takes two small rubber-hose animation steps into position, turns toward camera, gives one friendly wave, then points confidently to the empty space on camera right and holds the final pose. Locked-off camera, full body always visible, consistent proportions, clean silhouette, subtle mechanical secondary motion, premium 1930s animation-meets-luxury-technology finish. Perfectly flat evenly lit chroma green background #00FF00. No floor shadow, no green spill, no scenery, no props, no other characters, no captions, no extra text, no camera motion, no morphing, no duplicated limbs, no logo distortion. 8 seconds.
```

### 2. Telón que abre

```text
One isolated symmetrical deep burgundy red velvet theater curtain with elegant black and antique-gold Art Deco trim. The two curtain halves begin fully closed, open smoothly from the center with believable heavy fabric folds, then remain fully open for the final two seconds. Locked-off front camera, centered, full curtain visible, premium cinematic lighting contained only on the fabric. Perfectly flat chroma green background #00FF00 visible behind it. No stage, no audience, no projector, no character, no typography, no particles, no camera motion. Clean separable edges. 8 seconds.
```

### 3. Proyector en loop

```text
One isolated vintage 1930s cinema projector, polished black enamel and aged gold brass, matching a luxurious Art Deco technology brand. The two film reels rotate steadily, tiny mechanical parts move naturally, and the lens warms from dim amber to a stable golden glow. End state matches the opening motion for a seamless loop. Three-quarter view, locked-off camera, entire projector visible. Perfectly flat chroma green background #00FF00. No projected beam, no film flying through the air, no furniture, no people, no typography, no camera motion. 8 seconds seamless loop.
```

### 4. Haz dorado y partículas

```text
One isolated volumetric cone of warm golden projector light traveling from camera left toward camera right, with restrained floating dust motes and subtle film flicker. The cone keeps a stable shape and produces a seamless eight-second loop. Locked-off camera. Perfectly flat pure black background, no projector, no screen, no objects, no people, no typography, no camera movement. High contrast edges suitable for Screen/Add compositing on a website. 8 seconds seamless loop.
```

Este asset usa negro, no verde, porque se integra con `mix-blend-mode: screen` y conserva mejor la luz semitransparente.

### 5. Audiencia en silueta

```text
One isolated row of elegant 1930s cinema audience silhouettes seen only from behind, shoulders and period hats visible. Very subtle natural head movement and breathing, no one turns toward camera. Locked-off centered camera, clean lower-foreground silhouette, seamless ending. Perfectly flat evenly lit chroma green background #00FF00. No faces, no stage, no curtains, no projector, no screen, no text, no extra props, no camera motion. 8 seconds seamless loop.
```

## Control de calidad antes de descargar

- Voltio conserva exactamente colores, ojos, guantes, antena y emblema `4GS`.
- No aparecen dedos, brazos, objetos o letras extra.
- La cámara no se mueve y el tamaño del elemento no cambia.
- El chroma es plano de borde a borde.
- Los loops no saltan de posición o iluminación.
- El último cuadro de Voltio y del telón puede sostenerse sin verse accidental.
- Se descargan y conservan los MP4 originales de las variantes aprobadas.

## Recorte y optimización

Ejemplo para convertir un master verde a WebM con transparencia:

```bash
ffmpeg -i master.mp4 \
  -vf "chromakey=0x00FF00:0.20:0.08,format=yuva420p" \
  -an -c:v libvpx-vp9 -b:v 0 -crf 30 salida.webm
```

El valor `0.20` se puede ajustar entre `0.16` y `0.28` según el borde. Revisar siempre guantes blancos, reflejos dorados y contorno negro antes de aprobar.

Si el navegador o el hosting no reproduce alpha WebM de forma confiable, exportar una secuencia WebP:

```bash
ffmpeg -y -i master.mp4 -vf "fps=12" -c:v libwebp -q:v 82 -f image2 frames/f_%03d.webp
```

No convertir a secuencia por defecto: los videos en loop pesan menos y bastan para la primera integración. Usar cuadros solo si el scroll necesita controlar cada instante con precisión.

## Composición de la escena de trabajos

Orden recomendado de atrás hacia delante:

| z-index | Elemento |
|---:|---|
| 0 | fondo negro Art Déco construido con CSS |
| 10 | proyector |
| 20 | haz dorado con modo `screen` |
| 30 | captura del proyecto activo |
| 40 | audiencia |
| 50 | Voltio presentador |
| 60 | telón, solo durante entrada/salida |
| 70 | navegación y textos HTML accesibles |

Las capturas de los diez proyectos ya están separadas en `public/assets/sites/`. Deben seguir siendo imágenes y enlaces HTML; no se deben hornear dentro del video.

## Secuencia al hacer scroll

1. Se abre el telón.
2. Se encienden proyector y haz.
3. Entra Voltio, saluda y apunta al marco del proyecto.
4. Cada tramo de scroll cambia únicamente la captura y sus textos.
5. Proyector, haz y audiencia continúan en loop suave.
6. Al salir del capítulo, Voltio sostiene la pose y la escena baja de intensidad.

Mantener los textos y botones fuera del video. Así los enlaces siguen siendo clicables, traducibles, legibles por buscadores y accesibles.

## Rendimiento y accesibilidad

- Cargar los clips con `preload="metadata"`; dar prioridad solo al clip visible.
- Usar `poster` para evitar cuadros negros mientras carga.
- Pausar video fuera del viewport.
- En pantallas pequeñas usar los clips móviles o una imagen estática si la conexión es lenta.
- Con `prefers-reduced-motion: reduce`, mostrar el cuadro final y desactivar loops/scrubbing.
- Mantener una sola pista de audio iniciada después de una interacción del usuario.


---

## Escena 2 · LA TRAVESIA (capitulo 03, EL METODO)

Generada 2026-08-30 con el pipeline propio (no Flow UI): stills en verde -> Veo ->
`tools/capas.py web/gen/pirata` -> WebM alfa. Masters en `omni-studio/web/gen/pirata/`.

| Capa | Archivo | Loop | Nota |
|---|---|---|---|
| Galeon pirata | `barco-loop.webm` | 8s | Veo le metio letterbox 74/72px: se recorta ANTES del key. Key fino 0.13 + despill (las velas vinotinto se picaban a 0.16) |
| Olas art-deco | `olas-loop.webm` | 8s | banda inferior, borde superior limpio |
| Cofre del tesoro | `cofre-loop.webm` | 8s | brillo pulsante |
| Bandera robot-pirata | `bandera-loop.webm` | 8s | Jolly Roger 4GS: calavera robot + llaves cruzadas |

Scroll-driven con `view-timeline` (rangos **cover**, no entry: un sujeto mas alto que el
viewport nunca "termina de entrar" y los rangos entry se disparan de golpe). El barco
cruza el mar, los 4 pasos del metodo aparecen como bitacora, y el destino es la bandera
con el tesoro. Fallback sin soporte: escena estatica con todo visible.

---

## Teatro v2 · integracion del telon + sonido (2026-08-26)

Auditoria tras feedback ("mal integrado, pantalla verde, se ve basico"):

- **Orden teatral**: telon z5 DETRAS de Voltio (z6) y del publico (z7). El presentador
  sale al frente del telon cerrado y el publico lo mira; abierto, las cortinas se QUEDAN
  como patas del escenario (nada de fade-out). `.capa-telon` desborda `-7vw` para que
  las patas solo asomen por los bordes y los frames entren/salgan por bambalinas.
- **Cenefa CSS** (`.telon-cenefa`): proscenio de terciopelo con festones y filete dorado;
  ancla el borde superior del video. Candilejas (`.portfolio-stage::after`) llenan la
  boca del escenario.
- **Posters con alfa**: generarlos SIEMPRE decodificando con `-c:v libvpx-vp9` — el
  decoder nativo ignora el alfa y el PNG sale opaco con el fondo del master (el "flash
  verde/gris" antes del play). El poster del telon es el PRIMER frame (cerrado); con
  `prefers-reduced-motion` el telon se oculta por CSS o taparia la galeria para siempre.
- **Pan del carrusel**: `animation-range: contain 0% contain 100%` — con entry/exit el
  track ya llevaba ~87vw recorridos al fijarse el sticky y el cliente 01 llegaba de
  salida. `contain` = exactamente el tramo fijado.
- **Arranque del telon**: `umbral={0.55}` en CapaVideo (threshold de IntersectionObserver)
  para que no se abra mientras la escena apenas asoma. play() sobre un video terminado
  REBOBINA: CapaVideo lo bloquea para no re-abrir el telon al reentrar.
- **Sonido** (`public/audio/sfx/`): whoosh al abrir el telon + "ooh" del publico al
  terminar; olas en loop mientras la travesia esta en pantalla y cofre.mp3 al 74% del
  recorrido (mismo punto que la animacion CSS). Los Audio se desbloquean con un play
  mudo en el clic de entrada — sin eso Chrome bloquea los play() por scroll.
- Olas de la travesia con `mask-image` degradado arriba (el master llena su cuadro y
  cortaba la cresta en una linea recta).

### Teatro v3 · SALA DE CINE (feedback: "no que hiciera scroll a la derecha")

El carrusel horizontal murio: ahora hay UNA pantalla fija (`.portfolio-screen`) entre la
cenefa y el publico, y los 10 clientes se PROYECTAN en ella con crossfade por scroll —
cada uno ocupa 1/10 del tramo fijado via `animation-range` inline por slide, con
`visibility` acompanando al `opacity` para que los slides invisibles no roben clics.
La pantalla se estira al alto disponible (flex; el pantallazo es `flex: 1`), asi no se
recorta abajo en ninguna altura de ventana. El telon va con `object-fit: fill`: con
cover, en ventanas cortas y anchas las patas recogidas se comian 20vw de pantalla.
Fallback sin animation-timeline: galeria plana sin capas de teatro.

### Voltios de escena (feedback: "en todas las escenas un Voltio con movimiento")

Tres capas nuevas, generadas con la fabrica omni (web/gen/voltios.py: mismos prompts
endurecidos, identidad + first-frame en dos imagenes) y recortadas al bbox del alfa:

| Capa | Archivo | Donde | Nota |
|---|---|---|---|
| Voltio saluda | `voltio-saluda.webm` | hero (reemplaza el PNG) | saluda y abre brazos, vuelve a la pose inicial para loopear |
| Voltio opera | `voltio-opera.webm` | sistemas (reemplaza el PNG) | consola art-deco de palancas y medidores |
| Voltio pirata | `voltio-pirata.webm` | travesia, esquina de proa | tricornio + catalejo hacia el barco |

Sin despill (los guantes crema se rosarian) — la leccion inversa del telon.

### Afinado final de la ronda (feedback en vivo)

- **Alfa endurecido** (`"alfa": N` + `"cerrar"` en capas.py): Veo mezcla el verde
  DENTRO de telas y maderas (barco ~65% opaco, cofre igual) y deja POROS granulares
  con alfa ~0 dentro de las velas. Umbral -> opaco + cierre morfologico (blur solo
  del canal alfa + re-umbral). Las velas crema venian banadas de rebote verde:
  despill mix alto + brightness negativo las entona. Sintoma: "se ve transparente".
- **Cine-recorrido**: mientras un cliente esta proyectado su pantallazo baja de top a
  bottom con el scroll (mismo --rango inline del slide) — el sitio se ve COMPLETO.
- **Rollo 35mm** (.film-strip): miniaturas del catalogo con perforaciones, sincronizadas
  por --paso/--n; agregar un sitio a selectedWork alarga la cinta sola.
- **Telon**: bottom -13% + mask degradado inferior (la tela se funde con el piso, sin
  corte duro) + despill 0.78. El presentador va en loop (sin loop quedaba congelado a
  los 8s). Islotes: e9 keyeado como PNG, uno para el pirata y otro (flip) para el cofre.

---

## Ronda de escenas por seccion (2026-08-26, tarde)

Cuatro escenas nuevas sobre el mismo metodo (verde -> capas -> scroll/IO):

- **Encendido de proyector** (intro->hero): iris-out de cine mudo (clip-path circle
  hacia el boton) + parpadeo de sala (filter brightness, fill backwards para no dejar
  capa de composicion) + riser. Cero assets.
- **Foco de sala** (.stage-luz): el cursor es el reflector del teatro — radial calido
  + vineta siguiendo --sx/--sy, solo @media (hover: hover).
- **La fabrica** (sistemas): banda de engranajes en loop (v12) tras el Voltio operador,
  tarjetas entrando de lado como piezas (card-ensamble) y traqueteo (feet-cinta) por IO.
- **El gran encendido** (cierre): contact-section ahora es escena sticky. Skyline
  art-deco keyeado del still e10 (PNG apagado, mismo bbox que el video para no saltar
  encuadre); Voltio baja la palanca (v11, umbral .6 + unaVez, spark al play) y al
  terminar monta el video del skyline encendiendose (v10, CORTADO en el pico t=6 —
  Veo hizo ciclo y re-apagaba: `"dur"` en capas.py), campanazo, chispas CSS en loop
  (background-position desplaza exactamente su size-y) y el CTA late.
- e11 (Voltio + palanca) costo TRES intentos: toda pose con brazos cruzando el pecho
  le deforma el 4GS. La que funciona: FRONTAL, una sola mano en la palanca a un lado.
