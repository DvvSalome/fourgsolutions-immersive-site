# FourG Solutions — experiencia inmersiva

Renovación de `fourgsolutions.com` con una narrativa por escenas, estética Art Déco negra y dorada, y Voltio como guía principal.

## Estado de la entrega

La primera versión funcional incluye:

- entrada cinematográfica con audio;
- hero protagonizado por Voltio;
- capítulos de servicios, método y contacto;
- galería horizontal con diez sitios reales de FourG;
- escena de portafolio compuesta con cinco videos independientes generados en Vertex Omni;
- animaciones CSS, interacción con el puntero y versión responsive;
- masters de Voltio sobre fondo verde y recortes transparentes por separado.

La producción, prompts, comandos de regeneración y valores de chroma están documentados en [OMNI-ASSETS.md](./OMNI-ASSETS.md).

> `public/og.png` es únicamente la portada para compartir el enlace en redes. No es un asset de ninguna escena.

## Ejecutar en otro equipo

Requisito: Node.js 22.13 o superior.

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`.

Antes de publicar:

```bash
npm run lint
npm run build
```

## Archivos principales

```text
app/page.tsx            contenido y estructura de escenas
app/globals.css         dirección visual, responsive y animaciones
app/layout.tsx          SEO y tarjeta social
public/assets/          logo, Voltio y capturas de trabajos
public/assets/omni-*    stills ancla y posters transparentes
public/audio/chime.mp3  sonido de entrada
public/video/layers/    videos web separados
public/video/masters/   masters originales para reprocesar
public/og.png           tarjeta social, no se usa dentro del sitio
OMNI-ASSETS.md          guía de generación e integración con Vertex Omni
```

## Assets actuales de Voltio

| Archivo | Uso |
|---|---|
| `voltio-character-sheet.png` | referencia oficial de identidad |
| `voltio-host-master-green.png` | master del anfitrión sobre chroma verde |
| `voltio-host.png` | anfitrión con transparencia |
| `voltio-system-master-green.png` | master de Voltio operando el sistema |
| `voltio-system.png` | operador con transparencia |

La identidad que no debe cambiar: cuerpo negro lacado, detalles dorados Art Déco, ojos-bombillo dorados, guantes blancos, chispa de antena y emblema `4GS` legible en el pecho.

## Referencias de dirección

- [Shopify Editions Winter 2026](https://www.shopify.com/editions/winter2026): ritmo por capítulos y escenas al hacer scroll.
- [Motion Sites](https://motionsites.ai/): lenguaje de sitios cinematográficos.
- [AGrowth Systems](https://agrowthsystemss.com/): fuente visual de los trabajos reales de FourG.

## Publicación

El proyecto usa `vinext`, el plugin de OpenAI Sites y Cloudflare. No requiere base de datos ni almacenamiento: `.openai/hosting.json` mantiene `d1` y `r2` en `null`.

Para la salida final:

1. revisar desktop y móvil en el hosting definitivo;
2. confirmar el enlace definitivo del CTA;
3. conectar el repo al hosting elegido y apuntar `fourgsolutions.com`;
4. validar nuevamente los diez enlaces externos.
