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
