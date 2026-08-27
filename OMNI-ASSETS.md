# Producción de capas con Vertex Omni

Esta escena se construye con piezas reutilizables. Voltio, telón, proyector, haz, audiencia y capturas de proyectos permanecen separados; no existe un video único con toda la composición horneada.

## Resultado entregado

| Capa | Archivo web | Master | Poster |
|---|---|---|---|
| Voltio presentador | `public/video/layers/voltio-presenta.webm` | `public/video/masters/voltio-presenta-green.mp4` | `public/assets/omni-posters/voltio-presenta.png` |
| Telón | `public/video/layers/telon-abre.webm` | `public/video/masters/telon-abre-green.mp4` | `public/assets/omni-posters/telon-abre.png` |
| Proyector | `public/video/layers/proyector-loop.webm` | `public/video/masters/proyector-loop-green.mp4` | `public/assets/omni-posters/proyector-loop.png` |
| Haz dorado | `public/video/layers/haz-dorado-loop.mp4` | `public/video/masters/haz-dorado-loop-black.mp4` | `public/assets/omni-posters/haz-dorado-loop.png` |
| Audiencia | `public/video/layers/audiencia-loop.webm` | `public/video/masters/audiencia-loop-green.mp4` | `public/assets/omni-posters/audiencia-loop.png` |

Los MP4 duran ocho segundos y están en 720p. Los cuatro WebM usan VP9 con alpha. El haz conserva fondo negro y se integra con `mix-blend-mode: screen` para no perder las partículas semitransparentes.

## Herramientas y autenticación

La producción se hizo desde el repo privado `FOURGSOLUTIONS-FGS/omni-studio`:

- imagen: `gemini-2.5-flash-image` en Vertex global;
- video: `gemini-omni-flash-preview` en `locations/global/interactions`;
- scripts: `pipeline/gen_img_vertex.mjs` y `pipeline/omni.mjs`;
- identidad: `omni-studio/voltio/brand/voltio.png`.

La Service Account nunca se copia a este repo. En cada equipo debe vivir en `omni-studio/.secrets/pool/` o en una ruta privada equivalente, con Vertex AI habilitado, billing activo y rol `roles/aiplatform.user`.

## Orden de producción

1. Generar y revisar los stills ancla.
2. Animar Voltio con dos referencias: ficha oficial + still aprobado.
3. Animar cada objeto restante solo con su propio ancla.
4. Esperar 60 segundos entre llamadas; ante `429`, aplicar backoff `45 → 90 → 180 → 300`.
5. Revisar ocho cuadros por clip antes de procesar chroma.
6. Conservar los MP4 originales y derivar los archivos web.

Nunca lanzar la tanda de video antes de aprobar los stills: los `video_tokens` son la parte costosa.

## Prompts de still

### Telón

```text
Create one isolated production asset for compositing into an immersive luxury website, not a complete scene. Wide 16:9 front view of a symmetrical 1930s theater curtain in deep burgundy velvet, with restrained antique-gold Art Deco piping and elegant heavy folds. The two curtain halves are fully closed at the center seam, with their full outer silhouette visible and small pure green margins around the fabric. Premium cinematic material detail, clean crisp edges, perfectly centered and geometrically symmetrical. Background is a perfectly flat, evenly lit chroma green #00FF00 from edge to edge, with no gradient, texture, floor, shadows or green spill. No stage, no audience, no projector, no character, no letters, no words, no typography, no watermark.
```

### Proyector

```text
Create one isolated production asset for compositing into an immersive luxury website, not a complete scene. A single vintage 1930s cinema projector made of polished black enamel and aged gold brass, two film reels, detailed mechanical housing and a warm glass lens. Three-quarter view facing camera right, entire object visible, centered slightly toward camera left, occupying about 65 percent of the frame height. Refined FourG black-and-gold Art Deco styling, realistic mechanical proportions, crisp clean silhouette. Wide 16:9. Background is a perfectly flat, evenly lit chroma green #00FF00 from edge to edge, with no gradient, texture, floor, cast shadow or green spill. Lens may glow softly but there is absolutely no projected beam. No loose film, no furniture, no people, no character, no letters, no words, no typography, no watermark.
```

### Haz

```text
Create one isolated light-effects production asset for Screen/Add compositing into an immersive website, not a complete scene. Wide 16:9 pure black canvas containing only a refined volumetric cone of warm golden projector light traveling from the lower left toward the center right. The beam has a soft luminous core, elegant falloff, subtle floating dust motes and restrained 1930s film-grain sparkle, with large areas of perfect black around it. High contrast, cinematic, luxurious antique-gold color. No projector, no screen, no curtain, no audience, no character, no objects, no letters, no words, no typography, no watermark.
```

### Audiencia

```text
Create one isolated production asset for compositing into an immersive luxury website, not a complete scene. One continuous row of elegant 1930s cinema audience silhouettes seen strictly from behind, shoulders and a few tasteful period hats visible, occupying only the bottom 38 percent of a wide 16:9 frame. Deep black silhouettes with extremely subtle warm gold rim light, no visible faces and no individual turning around. Clean lower-foreground silhouette with crisp separable edges. Everything above and between the silhouettes is a perfectly flat evenly lit chroma green #00FF00, with no gradient, texture, floor or green spill. No stage, no curtain, no projector, no screen, no character, no letters, no words, no typography, no watermark.
```

## Prompts de animación

### Voltio

```text
The FIRST image is the reference for the character's identity; the video starts EXACTLY at the SECOND image. Animate this single isolated full-body Voltio asset while preserving the exact 1930s ink-and-watercolor illustration style, proportions, polished black lacquer body, gold Art Deco trim, warm golden lightbulb eyes, white cartoon gloves, antenna spark and chest emblem.

[0-1.5s] Voltio comes gently to life from the exact supplied pose with subtle rubber-hose mechanical secondary motion and one clean antenna spark.
[1.5-4.5s] He takes one small confident step in place, turns slightly toward the viewer and gives one friendly wave.
[4.5-7s] He turns his torso slightly toward camera right and points with one hand to the empty space on camera right.
[7-8s] He holds the pointing pose cleanly for web compositing.

Locked-off camera. Full body and antenna always visible. Character scale and position remain stable. Perfectly flat chroma green background remains unchanged. No scenery, no floor shadow, no props, no other characters, no camera motion, no zoom, no morphing, no duplicated limbs, no speech and no music. The ONLY characters allowed are the gold '4GS' on the robot's chest — keep it CRISP and unchanged.
```

### Telón

```text
The video starts EXACTLY at the supplied image. Animate only this isolated burgundy Art Deco theater curtain.

[0-1s] The closed curtain settles with a subtle believable velvet movement.
[1-5s] Both halves open smoothly and symmetrically from the center, gathering toward the left and right edges with heavy realistic folds.
[5-8s] The curtain remains fully open and nearly still, with only minimal fabric breathing.

Locked-off front camera, fixed framing and fixed scale. The pure chroma green background behind the opening remains perfectly flat and unchanged. No stage, no audience, no projector, no character, no particles, no letters, no words, no typography, no watermark, no camera motion, no zoom, no new objects. Audio: silence only, no speech and no music.
```

El raw del telón empezó a derivar después del segundo cuatro. El master entregado conserva la apertura buena y congela la posición abierta:

```bash
ffmpeg -i telon-raw.mp4 \
  -vf "trim=0:4,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=4" \
  -an -r 30 -t 8 -c:v libx264 -crf 18 -pix_fmt yuv420p telon-abre-green.mp4
```

### Proyector

```text
The video starts EXACTLY at the supplied image. Animate only this single isolated vintage black-and-gold Art Deco cinema projector.

[0-1s] The machine wakes with a small precise mechanical shudder while remaining in place.
[1-2s] Both reels accelerate smoothly to a steady rotation and the internal mechanism begins moving.
[2-7s] The reels and small mechanical parts continue a refined stable loop; the lens gives a restrained warm amber flicker.
[7-8s] Motion returns naturally toward the opening rhythm for a seamless repeat.

Locked-off camera, fixed framing and fixed object scale. The projector never moves across the frame. The chroma green background stays perfectly flat and unchanged. Absolutely no projected beam, no loose flying film, no furniture, no people, no character, no letters, no words, no typography, no watermark, no camera movement, no zoom, no morphing. Audio: quiet mechanical room tone only, no speech and no music.
```

### Haz

```text
The video starts EXACTLY at the supplied image. Animate only the isolated golden volumetric projector-light cone over pure black.

[0-1.5s] The golden beam rises smoothly from dim to its intended luminous intensity.
[1.5-7s] Restrained film flicker, gentle volumetric breathing and small dust motes drift naturally inside the stable cone.
[7-8s] Light and particle positions ease back toward the opening state for a seamless repeat.

Locked-off camera, stable beam geometry and pure black background. No projector, no screen, no curtain, no audience, no character, no objects, no letters, no words, no typography, no watermark, no camera motion and no zoom. Audio: silence only.
```

### Audiencia

```text
The video starts EXACTLY at the supplied image. Animate only this isolated lower-foreground row of 1930s cinema audience silhouettes seen from behind.

[0-1s] The row settles naturally into the supplied composition.
[1-7s] Extremely subtle breathing, tiny shoulder shifts and restrained hat movement create a calm living audience; nobody turns around and no face becomes visible.
[7-8s] Motion returns naturally toward the opening pose for a seamless repeat.

Locked-off camera, fixed framing and fixed scale. The chroma green background remains perfectly flat and unchanged. No stage, no curtain, no projector, no screen, no character, no new people, no letters, no words, no typography, no watermark, no camera movement, no zoom and no morphing. Audio: quiet room tone only, no speech and no music.
```

## Comandos base

Imagen:

```bash
node pipeline/gen_img_vertex.mjs KEY prompt.txt salida.png 16:9 none
```

Voltio usa la ficha oficial y el still aprobado:

```bash
node pipeline/omni.mjs KEY video-voltio.txt voltio.mp4 9:16 \
  "voltio/brand/voltio.png,stills/voltio-presenta.png" none
```

Los demás clips usan solo su ancla:

```bash
node pipeline/omni.mjs KEY video-objeto.txt objeto.mp4 16:9 stills/objeto.png none
```

## Valores de chroma aprobados

Los fondos generados no quedaron en verde digital puro. Se muestreó cada master y se ajustó individualmente para no borrar los filetes dorados.

| Capa | Color | Similarity | Blend |
|---|---:|---:|---:|
| Voltio | `0x23A740` | `0.25` | `0.06` |
| Telón | `0x7DAF68` | `0.08` | `0.03` |
| Proyector | `0x8FA870` | `0.09` | `0.03` |
| Audiencia | `0x65AC62` | `0.10` | `0.03` |

Plantilla de WebM alpha:

```bash
ffmpeg -i master.mp4 \
  -vf "format=rgba,colorkey=COLOR:SIMILARITY:BLEND,format=yuva420p" \
  -an -c:v libvpx-vp9 -b:v 0 -crf 32 -deadline good -cpu-used 2 \
  -row-mt 1 -auto-alt-ref 0 -pix_fmt yuva420p salida.webm
```

`ffprobe` puede mostrar `pix_fmt=yuv420p`; confirmar además que el WebM tenga `alpha_mode=1`. Al validar con FFmpeg, forzar el decoder `-c:v libvpx-vp9` para que no descarte el alpha.

## Composición del sitio

Orden de atrás hacia delante:

1. fondo CSS;
2. proyector;
3. haz en modo `screen`;
4. capturas HTML de los proyectos;
5. audiencia;
6. Voltio;
7. telón;
8. navegación y enlaces.

La reproducción inicia cuando la escena entra al viewport y se pausa al salir. Telón y Voltio se reproducen una vez; proyector, haz y audiencia quedan en loop. Con `prefers-reduced-motion: reduce` no se reproducen y se muestran los posters finales.
