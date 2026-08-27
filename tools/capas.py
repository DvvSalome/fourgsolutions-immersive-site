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

# Mapas por escena: master -> (nombre final, se recorta el chroma?, loopea?).
# El mapa se elige por el nombre de la carpeta de masters (web/gen/<escena>).
ESCENAS = {
    "site": {
        "v1.mp4": ("voltio-presenta.webm", True, False),
        # despill FUERTE al telon: sobre el fondo oscuro del sitio, cualquier fleco
        # verde en el borde del terciopelo brilla (feedback, dos veces). Tol un poco
        # mas amplia por lo mismo; en tela vinotinto es seguro (no hay zonas crema).
        # poster=primero: antes del play debe verse CERRADO (el ultimo frame haria
        # que la entrada muestre el telon abierto y salte a cerrado al arrancar).
        "v2.mp4": ("telon-abre.webm", True, False,
                   {"tol": "0.17:0.06", "despill": ",despill=type=green:mix=0.78",
                    "poster": "primero"}),
        "v3.mp4": ("proyector-loop.webm", True, True),
        "v4.mp4": ("haz-dorado-loop.webm", False, True),
        "v5.mp4": ("audiencia-loop.webm", True, True),
        # Los Voltio animados de todas las escenas (feedback: "nada plano").
        # Sin despill, como v1: los guantes crema se rosarian. Crop al bbox del alfa
        # (medido a 2fps en TODOS los frames), como la leccion de v1.
        "v6.mp4": ("voltio-saluda.webm", True, True,
                   {"crop": "crop=704:636:292:40,"}),
        "v7.mp4": ("voltio-opera.webm", True, True,
                   {"crop": "crop=464:642:408:44,"}),
        "v8.mp4": ("voltio-pirata.webm", True, True,
                   {"crop": "crop=518:654:328:24,"}),
    },
    # El 4o campo (opcional) son ajustes por capa, aprendidos componiendo la escena:
    #   crop:    Veo le metio barras de cine SOLO al barco (74/72px) — fuera ANTES del key
    #   tol:     key mas fino para el barco; 0.16 le picaba las velas vinotinto
    #   despill: mata el tinte verde del aparejo fino; seguro en assets oscuros
    "pirata": {
        # alfa: Veo MEZCLO el verde dentro de las velas (el barco salia ~65% opaco,
        # feedback "se ve transparente"). Todo alfa > umbral se fuerza a 255; el
        # despill limpia el tinte verde que quedo horneado en el color. El aparejo
        # fino (alfa bajo) se conserva tal cual.
        # alfa 50, no 120: la mezcla de Veo deja REGIONES del casco/velas entre 50-119
        # (medido: YAVG 189 en la caja del casco con umbral 120 — seguia fantasma).
        # 50 solo respeta el antialias del contorno y los huecos reales del aparejo.
        # despill total + brightness: las velas CREMA traseras venian banadas de
        # rebote verde; mix alto las neutraliza y el -0.25 las entona con la noche
        "v1.mp4": ("barco-loop.webm", True, True,
                   {"crop": "crop=1280:572:0:74,", "tol": "0.13:0.03",
                    "alfa": 50, "cerrar": True,
                    "despill": ",despill=type=green:mix=0.95:expand=0.6:brightness=-0.25"}),
        "v2.mp4": ("olas-loop.webm", True, True),
        # cofre y bandera tambien llevan despill: las chispas doradas del cofre y el
        # borde de la tela quedaban con halo verde (feedback del usuario sobre la escena)
        # alfa: mismo mal del barco — Veo mezclo el verde en la madera y se veia
        # semitransparente (feedback: "el cofre se ve transparente")
        "v3.mp4": ("cofre-loop.webm", True, True,
                   {"tol": "0.14:0.04", "alfa": 50,
                    "despill": ",despill=type=green:mix=0.6"}),
        "v4.mp4": ("bandera-loop.webm", True, True,
                   {"despill": ",despill=type=green:mix=0.6"}),
    },
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
# bbox medido en TODOS los frames (2fps), no en 3 muestras: el saludo inicial
# estira los brazos hasta x 360..944 y el recorte viejo (482..830) cortaba la mano.
CROPS = {"v1.mp4": "crop=624:720:340:0,"}


def sh(cmd):
    r = subprocess.run(cmd, shell=True, capture_output=True, text=True,
                       encoding="utf-8", errors="replace")
    if r.returncode != 0:
        raise SystemExit(f"fallo: {cmd[:120]}\n{(r.stderr or '')[-400:]}")
    return r.stdout or ""


def color_esquina(master, y=8):
    """El verde real del clip, muestreado en el borde izquierdo a altura `y` del frame
    en t=1s. `y` alto esquiva el letterbox que Veo a veces mete arriba del cuadro.

    OJO: la salida es RGB crudo — se captura como BYTES. Pasarla por un pipe de texto
    UTF-8 corrompe los valores y el recorte falla en silencio.
    """
    r = subprocess.run(
        f'ffmpeg -loglevel error -ss 1 -i "{master}" -vf "crop=20:20:4:{y},scale=1:1" '
        f'-frames:v 1 -f rawvideo -pix_fmt rgb24 -',
        shell=True, capture_output=True)
    if r.returncode != 0 or len(r.stdout) < 3:
        raise SystemExit(f"no pude muestrear el color de {master}")
    b = r.stdout[:3]
    return "0x%02X%02X%02X" % (b[0], b[1], b[2])


def main():
    src = sys.argv[1] if len(sys.argv) > 1 else "."
    solo = sys.argv[2] if len(sys.argv) > 2 else None   # p.ej. v2.mp4: reconvierte solo esa capa
    escena = os.path.basename(os.path.normpath(src))
    capas = ESCENAS.get(escena)
    if not capas:
        raise SystemExit(f"escena desconocida '{escena}' — agregala al mapa ESCENAS")
    dst = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "public", "video", "layers")
    os.makedirs(dst, exist_ok=True)
    for master, entrada in capas.items():
        if solo and master != solo:
            continue
        final, recortar, loopea = entrada[0], entrada[1], entrada[2]
        ajustes = entrada[3] if len(entrada) > 3 else {}
        m = os.path.join(src, master)
        if not os.path.exists(m):
            print(f"  falta {master} — se salta"); continue
        salida = os.path.join(dst, final)
        crop = ajustes.get("crop") or (CROPS.get(master, "") if escena == "site" else "")
        if recortar:
            color = color_esquina(m, y=100 if ajustes.get("crop") else 8)
            tol = ajustes.get("tol", TOLERANCIA)
            despill = ajustes.get("despill", "")
            # endurecer alfa (ver barco): umbral -> opaco, debajo se respeta.
            # "cerrar": ademas rellena POROS (Veo deja moteado con alfa ~0 DENTRO de
            # las velas): blur SOLO del canal alfa + re-umbral = cierre morfologico.
            dura = ajustes.get("alfa")
            lut = f",format=yuva444p,lut=a='if(gt(val,{dura}),255,val)'" if dura else ""
            if dura and ajustes.get("cerrar"):
                lut += ",boxblur=0:0:0:0:3:2,lut=a='if(gt(val,110),255,val)'"
            # el recorte a bbox (voltio) NO se re-escala: 348px nativos ~ su contenedor;
            # los demas bajan a 1280 de ancho
            escala = "" if (crop and escena == "site") else ",scale=1280:-2"
            filtro = f"{crop}colorkey={color}:{tol}{lut}{despill},format=yuva420p{escala}"
            print(f"  {master} -> {final}  (chroma muestreado {color})")
        else:
            filtro = "scale=1280:-2,format=yuv420p"
            print(f"  {master} -> {final}  (sin recorte: negro + blend screen)")
        sh(f'ffmpeg -y -loglevel error -i "{m}" -vf "{filtro}" -an '
           f'-c:v libvpx-vp9 -b:v 0 -crf 30 "{salida}"')
        # Poster: para los loops (y el telon, ver arriba) es el frame 0; para Voltio
        # es el ULTIMO cuadro — el estado en que la capa descansa.
        # OJO: decodificar con libvpx-vp9 — el decoder nativo IGNORA el alfa y el
        # poster sale OPACO con el fondo del master (un panel gris tapando la escena).
        pos = "-sseof -0.2 " if (not loopea and ajustes.get("poster") != "primero") else ""
        sh(f'ffmpeg -y -loglevel error -c:v libvpx-vp9 {pos}-i "{salida}" -frames:v 1 '
           f'"{salida.replace(".webm", "-poster.png")}"')
    print("listo -> public/video/layers/")


if __name__ == "__main__":
    main()
