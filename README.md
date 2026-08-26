# FourG Solutions — experiencia inmersiva

Renovación de `fourgsolutions.com` con una narrativa por escenas, estética Art Déco negra y dorada, y Voltio como guía principal.

## Estado de la entrega

La primera versión funcional incluye:

- entrada cinematográfica con audio;
- hero protagonizado por Voltio;
- capítulos de servicios, método y contacto;
- galería horizontal con diez sitios reales de FourG;
- animaciones CSS, interacción con el puntero y versión responsive;
- masters de Voltio sobre fondo verde y recortes transparentes por separado.

Pendiente: generar los clips de Google Flow como capas independientes e integrarlos en la escena de portafolio. Los prompts, nombres y orden de composición están en [FLOW-ASSETS.md](./FLOW-ASSETS.md).

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
public/audio/chime.mp3  sonido de entrada
public/og.png           tarjeta social, no se usa dentro del sitio
FLOW-ASSETS.md          guía de generación e integración con Google Flow
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

1. integrar los videos indicados en `FLOW-ASSETS.md`;
2. revisar desktop y móvil;
3. confirmar el enlace definitivo del CTA;
4. conectar el repo al hosting elegido y apuntar `fourgsolutions.com`;
5. validar nuevamente los diez enlaces externos.
