# -*- coding: utf-8 -*-
"""capas.py — convierte los masters de las capas a WebM con transparencia para el sitio.

Uso:  python tools/capas.py <carpeta-con-masters>

Espera v1..v5.mp4 (el orden del inventario de FLOW-ASSETS.md) y escribe en
public/video/layers/ los archivos con sus nombres finales + un poster PNG por capa.

Difiere de la receta original de FLOW-ASSETS.md en una cosa deliberada: NO se asume
chroma 0x00FF00. Los modelos de video nunca devuelven el verde exacto, asi que el color
se MUESTREA de la esquina del primer frame y se recorta con ese valor (el mismo truco
del pipeline de reels). El haz (v4) no se recorta: va sobre negro y se compone con
mix-blend-mode: screen, que ya descarta el negro.
"""
import os, subprocess, sys

CAPAS = {  # master -> (nombre final, se recorta el chroma?, loopea?)
    "v1.mp4": ("voltio-presenta.webm", True, False),
    "v2.mp4": ("telon-abre.webm", True, False),
    "v3.mp4": ("proyector-loop.webm", True, True),
    "v4.mp4": ("haz-dorado-loop.webm", False, True),
    "v5.mp4": ("audiencia-loop.webm", True, True),
}
# colorkey, NO chromakey. chromakey compara solo crominancia (UV) y el negro lacado con
# rebote verde de la pantalla cae dentro del umbral: dejo al personaje entero a media alfa
# (medido: 91% transparente). colorkey usa distancia RGB, donde el negro esta lejos del
# verde. Es la receta probada del pipeline de reels (parallax_hook).
TOLERANCIA = "0.16:0.05"   # similarity:blend — subir a 0.22 si queda halo verde

# Recortes por capa, ANTES del chroma. El clip de Voltio es 16:9 pero el sale ocupando
# solo el 23% del ancho (bbox medido sobre el alfa: x 506..806): sin recorte, el CSS lo
# escala como paisaje y el personaje queda diminuto. Medir con el decoder libvpx-vp9 —
# el nativo IGNORA el canal alfa y el bbox da el cuadro entero.
CROPS = {"v1.mp4": "crop=348:720:482:0,"}


def sh(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise SystemExit(f"fallo: {cmd[:120]}\n{(r.stderr or '')[-400:]}")
    return r.stdout or ""


def color_esquina(master):
    """El verde real del clip, muestreado de la esquina superior izquierda del frame 0.

    OJO: la salida es RGB crudo — se captura como BYTES. Pasarla por un pipe de texto
    UTF-8 corrompe los valores y el recorte falla en silencio.
    """
    r = subprocess.run(
        f'ffmpeg -loglevel error -i "{master}" -vf "crop=20:20:4:4,scale=1:1" '
        f'-frames:v 1 -f rawvideo -pix_fmt rgb24 -',
        shell=True, capture_output=True)
    if r.returncode != 0 or len(r.stdout) < 3:
        raise SystemExit(f"no pude muestrear el color de {master}")
    b = r.stdout[:3]
    return "0x%02X%02X%02X" % (b[0], b[1], b[2])


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "."
    dst = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "public", "video", "layers")
    os.makedirs(dst, exist_ok=True)
    for master, (final, recortar, loopea) in CAPAS.items():
        m = os.path.join(src, master)
        if not os.path.exists(m):
            print(f"  falta {master} — se salta"); continue
        salida = os.path.join(dst, final)
        crop = CROPS.get(master, "")
        if recortar:
            color = color_esquina(m)
            # el recorte NO se re-escala: 348px nativos ~ el contenedor de 330px;
            # subirlo al doble solo emborrona el trazo
            escala = "" if crop else ",scale=1280:-2"
            filtro = f"{crop}colorkey={color}:{TOLERANCIA},format=yuva420p{escala}"
            print(f"  {master} -> {final}  (chroma muestreado {color})")
        else:
            filtro = "scale=1280:-2,format=yuv420p"
            print(f"  {master} -> {final}  (sin recorte: negro + blend screen)")
        sh(f'ffmpeg -y -loglevel error -i "{m}" -vf "{filtro}" -an '
           f'-c:v libvpx-vp9 -b:v 0 -crf 30 "{salida}"')
        # Poster: para los loops es el frame 0; para Voltio y el telon es el ULTIMO
        # cuadro — el estado en que la capa descansa, y lo que ve prefers-reduced-motion.
        pos = "" if loopea else "-sseof -0.2 "
        sh(f'ffmpeg -y -loglevel error {pos}-i "{salida}" -frames:v 1 '
           f'"{salida.replace(".webm", "-poster.png")}"')
    print("listo -> public/video/layers/")


if __name__ == "__main__":
    main()
