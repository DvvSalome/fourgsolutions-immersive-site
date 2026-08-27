"use client";

import Image from "next/image";
import CapaVideo from "./CapaVideo";
import { selectedWork } from "./trabajos";
import { useEffect, useRef, useState } from "react";

/* Efectos de sonido de las escenas. Se crean una sola vez y se "desbloquean" con el
   clic de entrada (un play mudo): sin ese truco, Chrome bloquea los play() que llegan
   despues por scroll, que no cuentan como gesto del usuario. */
type Sfx = {
  telon: HTMLAudioElement; ooh: HTMLAudioElement; olas: HTMLAudioElement;
  riser: HTMLAudioElement; palanca: HTMLAudioElement; campana: HTMLAudioElement; cinta: HTMLAudioElement;
  trueno: HTMLAudioElement;
};
const crearSfx = (): Sfx => {
  const mk = (src: string, volume: number, loop = false) => {
    const a = new Audio(src);
    a.volume = volume; a.loop = loop; a.preload = "auto";
    return a;
  };
  return {
    telon: mk("/audio/sfx/telon-whoosh.mp3", 0.5),
    ooh: mk("/audio/sfx/publico-ooh.mp3", 0.35),
    olas: mk("/audio/sfx/olas.mp3", 0.22, true),
    riser: mk("/audio/sfx/proyector-riser.mp3", 0.26),
    palanca: mk("/audio/sfx/palanca-spark.mp3", 0.5),
    campana: mk("/audio/sfx/encendido-campana.mp3", 0.42),
    cinta: mk("/audio/sfx/fabrica-cinta.mp3", 0.14, true),
    trueno: mk("/audio/sfx/trueno.mp3", 0.45),
  };
};

const systems = [
  {
    number: "01",
    title: "Sitios que venden",
    copy: "Experiencias web con una historia clara, una oferta fuerte y recorridos diseñados para convertir atención en conversación.",
    tags: ["Estrategia", "Diseño", "Desarrollo"],
  },
  {
    number: "02",
    title: "Automatización que responde",
    copy: "Conectamos formularios, mensajes, CRM y seguimiento para que cada oportunidad llegue al lugar correcto sin trabajo repetitivo.",
    tags: ["CRM", "WhatsApp", "Integraciones"],
  },
  {
    number: "03",
    title: "IA que libera capacidad",
    copy: "Creamos asistentes, contenido y operaciones aumentadas por IA con un objetivo concreto: hacer mejor trabajo en menos pasos.",
    tags: ["Agentes", "Contenido", "Operaciones"],
  },
];


export default function Home() {
  const [entered, setEntered] = useState(false);
  // el gran encendido: la palanca de Voltio activa el skyline, las chispas y el CTA
  const [palancaLista, setPalancaLista] = useState(false);
  // la barra: arriba integrada; al bajar se esconde; al subir vuelve con fondo blur
  const [barra, setBarra] = useState<"top" | "visible" | "oculta">("top");
  const audioRef = useRef<HTMLAudioElement>(null);
  const sfxRef = useRef<Sfx | null>(null);
  const telonSono = useRef(false);
  const palancaTimer = useRef<number | null>(null);

  const sfx = () => (sfxRef.current ??= crearSfx());

  const enterExperience = () => {
    setEntered(true);
    audioRef.current?.play().catch(() => undefined);
    // el "encendido de proyector": riser mientras el iris cierra y la sala parpadea
    sfx().riser.play().catch(() => {});
    // desbloquear los sfx aprovechando el gesto (ver crearSfx)
    Object.values(sfx()).forEach((a) => {
      a.muted = true;
      a.play().then(() => { a.pause(); a.currentTime = 0; a.muted = false; })
        .catch(() => { a.muted = false; });
    });
  };

  // Sonidos de la travesia: olas mientras la escena esta en pantalla y los truenos
  // de la tormenta en los mismos puntos que los flashes CSS.
  useEffect(() => {
    if (!entered) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const voyage = document.querySelector(".voyage-story");
    if (!voyage) return;
    const s = sfx();
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) s.olas.play().catch(() => {}); else s.olas.pause(); },
      { threshold: 0.12 },
    );
    io.observe(voyage);
    // la fabrica traquetea mientras esta en pantalla
    const fabrica = document.querySelector(".systems-visual");
    const ioFabrica = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) s.cinta.play().catch(() => {}); else s.cinta.pause(); },
      { threshold: 0.3 },
    );
    if (fabrica) ioFabrica.observe(fabrica);
    let truenos = 0;
    const alScroll = () => {
      const r = voyage.getBoundingClientRect();
      const p = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      // los truenos de la tormenta, en los mismos puntos que los flashes CSS.
      // El guard importa: tras un hot-reload, sfxRef puede conservar un objeto
      // viejo sin esta clave y el scroll handler no debe reventar por eso.
      if (s.trueno && ((truenos === 0 && p >= 0.42) || (truenos === 1 && p >= 0.55))) {
        truenos += 1;
        s.trueno.currentTime = 0;
        s.trueno.play().catch(() => {});
      }
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      io.disconnect(); ioFabrica.disconnect();
      window.removeEventListener("scroll", alScroll);
      s.olas.pause(); s.cinta.pause();
    };
  }, [entered]);

  // hide-on-scroll-down / show-on-scroll-up, con rAF para no trabajar de mas
  useEffect(() => {
    if (!entered) return;
    let ultimo = window.scrollY;
    let raf = 0;
    const alScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY;
        if (y < 120) setBarra("top");
        else if (y > ultimo + 6) setBarra("oculta");
        else if (y < ultimo - 6) setBarra("visible");
        ultimo = y;
      });
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => { window.removeEventListener("scroll", alScroll); if (raf) cancelAnimationFrame(raf); };
  }, [entered]);

  const moveLight = (event: React.PointerEvent<HTMLElement>) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
  };

  // el foco de sala: el cursor es el reflector dentro del teatro
  const moverFoco = (event: React.PointerEvent<HTMLDivElement>) => {
    const r = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--sx", `${event.clientX - r.left}px`);
    event.currentTarget.style.setProperty("--sy", `${event.clientY - r.top}px`);
  };

  return (
    <main className="site-shell" onPointerMove={moveLight}>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      {/* Non-speech interface chime; captions are not applicable. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src="/audio/chime.mp3" preload="auto" />
      <div className="noise" aria-hidden="true" />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="deco-frame" aria-hidden="true">
        <i className="corner corner-tl" /><i className="corner corner-tr" />
        <i className="corner corner-bl" /><i className="corner corner-br" />
      </div>

      <div className={`intro ${entered ? "intro--hidden" : ""}`} aria-hidden={entered}>
        <div className="intro-rings" aria-hidden="true" />
        <Image src="/assets/4gs-logo.png" alt="4GS" width={182} height={91} priority />
        <p>Growth systems · Est. MMXXVI</p>
        <h2>Hay una forma más clara<br />de hacer crecer un negocio.</h2>
        <button type="button" onClick={enterExperience} tabIndex={entered ? -1 : 0}>
          Comenzar recorrido <span aria-hidden="true">↗</span>
        </button>
        <small>Una experiencia guiada por Voltio</small>
      </div>

      <div id="contenido" className={entered ? "experience experience--entered" : "experience"}>
        <header className={`topbar topbar--${barra}`}>
          <a className="brand" href="#inicio" aria-label="4GS, inicio">
            <Image src="/assets/4gs-logo.png" alt="4GS" width={104} height={52} priority />
          </a>
          <nav aria-label="Navegación principal">
            <a href="#sistemas">Sistemas</a>
            <a href="#trabajos">Trabajos</a>
            <a href="#metodo">Método</a>
            <a href="#nosotros">Nosotros</a>
            <a href="/catalogo">Cartelera</a>
          </nav>
          <a className="nav-cta" href="#contacto">Encender proyecto <span aria-hidden="true">↗</span></a>
        </header>

        <section className="hero" id="inicio">
          {/* nubes deco en parallax con el cursor (via --mx/--my de moveLight) */}
          <svg className="hero-nube hero-nube--lejos" viewBox="0 0 160 54" aria-hidden="true">
            <path d="M10 44 Q2 30 16 24 Q14 8 32 12 Q40 0 54 8 Q70 2 74 16 Q92 10 92 26 Q106 22 104 36 Q118 34 114 44 Z" fill="none" stroke="rgba(212,175,85,.4)" strokeWidth="1.4" />
          </svg>
          <svg className="hero-nube hero-nube--cerca" viewBox="0 0 160 54" aria-hidden="true">
            <path d="M10 44 Q2 30 16 24 Q14 8 32 12 Q40 0 54 8 Q70 2 74 16 Q92 10 92 26 Q106 22 104 36 Q118 34 114 44 Z" fill="none" stroke="rgba(212,175,85,.55)" strokeWidth="1.6" />
          </svg>
          <div className="hero-copy">
            <p className="eyebrow"><span /> Estrategia · Automatización · IA</p>
            <h1>Tu negocio no necesita más ruido.<em> Necesita un sistema.</em></h1>
            <p className="lede">Diseñamos experiencias digitales y automatizaciones que convierten ideas en operaciones claras, medibles y listas para crecer.</p>
            <div className="hero-actions">
              <a className="primary-cta" href="#sistemas">Explorar el sistema <span>→</span></a>
              <a className="text-link" href="#trabajos"><i aria-hidden="true" /> Ver capacidades</a>
            </div>
          </div>

          <div className="voltio-stage" aria-label="Voltio, robot guía de 4GS">
            <div className="orbit orbit-one" aria-hidden="true" />
            <div className="orbit orbit-two" aria-hidden="true" />
            <div className="stage-glow" aria-hidden="true" />
            {/* Voltio de verdad, en video (feedback: "nada plano"): saluda y abre los
                brazos en loop. El poster con alfa cubre la carga y reduced-motion. */}
            <CapaVideo className="voltio-host" src="/video/layers/voltio-saluda.webm" poster="/video/layers/voltio-saluda-poster.png" loop />
            <div className="guide-tag"><span>01</span> Tu guía por el sistema</div>
            <div className="status-tag"><i /> Sistema en línea</div>
          </div>
          <div className="scroll-cue" aria-hidden="true"><span>DESLIZA</span><i /></div>
        </section>

        <div className="signal-line" aria-label="Capacidades 4GS">
          <div><span>ESTRATEGIA</span><i>✦</i><span>SITIOS WEB</span><i>✦</i><span>AUTOMATIZACIÓN</span><i>✦</i><span>INTELIGENCIA ARTIFICIAL</span><i>✦</i><span>CONTENIDO</span><i>✦</i></div>
        </div>

        <section className="systems-section" id="sistemas">
          <div className="section-heading reveal">
            <p className="chapter"><span>CAPÍTULO 01</span> / EL SISTEMA</p>
            <h2>Tres piezas.<br /><em>Un solo motor.</em></h2>
            <p>Voltio no vende herramientas sueltas. Ensambla el sistema que tu operación realmente necesita.</p>
          </div>

          <div className="systems-layout">
            <div className="systems-visual" role="img" aria-label="Voltio operando un sistema de automatización 4GS">
              <div className="machine-grid" aria-hidden="true" />
              <div className="machine-halo" aria-hidden="true" />
              {/* LA FABRICA: banda de ensamblaje con engranajes girando tras Voltio */}
              <div className="fabrica-banda" aria-hidden="true">
                <CapaVideo src="/video/layers/fabrica-banda.webm" poster="/video/layers/fabrica-banda-poster.png" loop />
              </div>
              <CapaVideo src="/video/layers/voltio-opera.webm" poster="/video/layers/voltio-opera-poster.png" loop />
              <div className="machine-readout" aria-hidden="true"><b>4GS / CORE</b><span>OPERANDO</span></div>
            </div>

            <div className="system-cards">
              {systems.map((system) => (
                <article className="system-card reveal" key={system.number}>
                  <div className="system-number">{system.number}</div>
                  <h3>{system.title}</h3>
                  <p>{system.copy}</p>
                  <ul aria-label={`Incluye ${system.tags.join(", ")}`}>
                    {system.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <span className="card-arrow" aria-hidden="true">↗</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="work-section" id="trabajos">
          <div className="section-heading section-heading--center reveal">
            <p className="chapter"><span>CAPÍTULO 02</span> / EN CARTELERA</p>
            <h2>Trabajos seleccionados</h2>
            <p>Diez sitios reales creados por 4GS. Baja para recorrer la galería y abre cualquiera para visitarlo.</p>
          </div>

          <div className="portfolio-story">
            <div className="portfolio-stage" onPointerMove={moverFoco}>
              {/* Capas de FLOW-ASSETS.md, de atras hacia delante: proyector, haz (screen),
                  capturas (HTML), telon, Voltio, audiencia, cenefa. El telon abre DETRAS
                  del presentador y del publico, y abierto se queda de patas del escenario. */}
              <div className="capa-proyector" aria-hidden="true">
                <CapaVideo src="/video/layers/proyector-loop.webm" poster="/video/layers/proyector-loop-poster.png" loop />
              </div>
              <div className="projector-beam" aria-hidden="true">
                <CapaVideo src="/video/layers/haz-dorado-loop.webm" poster="/video/layers/haz-dorado-loop-poster.png" loop />
              </div>
              <div className="capa-telon" aria-hidden="true">
                <CapaVideo
                  src="/video/layers/telon-abre.webm?v=2"
                  poster="/video/layers/telon-abre-poster.png"
                  umbral={0.55}
                  unaVez
                  onPlay={() => {
                    // barrido de tela al abrir, una sola vez (onPlay tambien se
                    // dispara al reanudar tras una pausa por scroll)
                    if (telonSono.current) return;
                    telonSono.current = true;
                    sfx().telon.play().catch(() => {});
                  }}
                  onEnded={() => sfx().ooh.play().catch(() => {})}
                />
              </div>
              <div className="portfolio-voltio" aria-hidden="true">
                {/* loop: sin el, a los 8s el presentador quedaba congelado el resto
                    de la escena (feedback: "se pausa") */}
                <CapaVideo src="/video/layers/voltio-presenta.webm" poster="/video/layers/voltio-presenta-poster.png" loop />
                <span>Voltio presenta</span>
              </div>
              <div className="capa-audiencia" aria-hidden="true">
                <CapaVideo src="/video/layers/audiencia-loop.webm" poster="/video/layers/audiencia-loop-poster.png" loop />
              </div>
              <div className="telon-cenefa" aria-hidden="true" />
              {/* SALA DE CINE (feedback): una sola pantalla fija y los clientes se
                  PROYECTAN en ella — crossfade por scroll, cada uno ocupa 1/10 del
                  tramo fijado (animation-range inline). Nada de carrusel lateral. */}
              <div className="portfolio-screen" aria-label="Sitios web creados por 4GS">
                {selectedWork.map((item, i) => (
                  <article
                    className="site-frame"
                    key={item.number}
                    style={{ "--rango": `contain ${i * 10}% contain ${(i + 1) * 10}%` } as React.CSSProperties}
                  >
                    {/* A · Marquesina Palace: el nombre del cliente va EN el cartel */}
                    <header className="frame-marquesina">
                      <p><span>Función {item.number} / 10</span> · En proyección</p>
                      <h3>{item.name}</h3>
                    </header>
                    <div className="frame-bombillos" aria-hidden="true"><i /><i /></div>
                    <a className="site-shot" href={item.url} target="_blank" rel="noreferrer" aria-label={`Abrir sitio de ${item.name}`}>
                      <span className="dispositivo">
                        <span className="dispositivo-pantalla">
                          <Image src={item.image} alt={`Vista previa del sitio ${item.name}`} fill sizes="(max-width: 680px) 88vw, 60vw" />
                        </span>
                        <span className="dispositivo-base" aria-hidden="true" />
                      </span>
                      <b className="frame-url">{item.domain}</b>
                    </a>
                    <footer className="frame-base">
                      <a className="frame-boleto" href={item.url} target="_blank" rel="noreferrer" aria-label={`Visitar ${item.name}`}>VISITAR ↗</a>
                    </footer>
                  </article>
                ))}
              </div>
              {/* Rollo de pelicula: la cinta con los fotogramas del catalogo corre con
                  el scroll y el marco dorado marca el que esta proyectado. --n viene
                  de los datos: agregar un sitio a selectedWork alarga la cinta sola. */}
              <div className="film-strip" aria-hidden="true">
                <div className="film-cells" style={{ "--n": selectedWork.length } as React.CSSProperties}>
                  {selectedWork.map((item) => (
                    <span className="film-cell" key={item.number}>
                      <Image src={item.image} alt="" width={110} height={64} />
                    </span>
                  ))}
                </div>
                <span className="film-gate" />
              </div>
              <div className="stage-luz" aria-hidden="true" />
              <div className="portfolio-instruction" aria-hidden="true"><span>SCROLL PARA RECORRER</span><i /></div>
            </div>
          </div>
        </section>

        <section className="method-section" id="metodo">
          <div className="method-intro reveal">
            <p className="chapter"><span>CAPÍTULO 03</span> / LA TRAVESÍA</p>
            <h2>Primero entendemos.<br /><em>Después encendemos.</em></h2>
            <p className="voyage-sub">Cada proyecto es un viaje con destino claro. Baja y navégalo.</p>
          </div>

          {/* La travesía: escena pirata por capas (web/gen/pirata), scroll-driven como
              el capítulo 02. El barco cruza el mar mientras los cuatro pasos del método
              aparecen como puntos de la ruta; al final, la bandera y el tesoro. */}
          <div className="voyage-story">
            <div className="voyage-stage">
              {/* CONSTELACION: el scroll dibuja el rayo de Voltio conectando estrellas */}
              <svg className="voyage-constelacion" viewBox="0 0 400 300" aria-hidden="true">
                <path className="constelacion-trazo" d="M240 18 L152 118 L205 132 L128 262" fill="none" />
                <circle className="constelacion-estrella" cx="240" cy="18" r="3" />
                <circle className="constelacion-estrella" cx="152" cy="118" r="2.4" />
                <circle className="constelacion-estrella" cx="205" cy="132" r="2.4" />
                <circle className="constelacion-estrella" cx="128" cy="262" r="3.2" />
              </svg>
              {/* LA TORMENTA: vela oscura, relampago y rayo (truenos por JS) */}
              <div className="voyage-tormenta" aria-hidden="true" />
              <div className="voyage-relampago" aria-hidden="true" />
              <svg className="voyage-rayo" viewBox="0 0 220 320" aria-hidden="true">
                <path d="M120 8 L70 128 L108 136 L52 258 L142 118 L102 112 L158 8 Z" fill="rgba(246,240,214,.95)" />
              </svg>
              <div className="voyage-flag" aria-hidden="true">
                <CapaVideo src="/video/layers/bandera-loop.webm" poster="/video/layers/bandera-loop-poster.png" loop />
              </div>
              <div className="voyage-ship" aria-hidden="true">
                <CapaVideo src="/video/layers/barco-loop.webm?v=3" poster="/video/layers/barco-loop-poster.png" loop />
              </div>
              {/* Voltio pirata: el narrador de la travesia, catalejo al horizonte,
                  parado en su islote (feedback: "ponlo sobre tierra") */}
              <div className="voyage-isla" aria-hidden="true">
                <Image src="/img/isla-pirata.png" alt="" width={772} height={313} />
              </div>
              <div className="voyage-voltio" aria-hidden="true">
                <CapaVideo src="/video/layers/voltio-pirata.webm" poster="/video/layers/voltio-pirata-poster.png" loop />
              </div>
              <ol className="voyage-steps" aria-label="El método FourG en cuatro pasos">
                <li className="voyage-step" data-paso="1"><span>01</span><div><h3>Mapeamos</h3><p>Objetivo, cuello de botella, personas y recorrido real.</p></div></li>
                <li className="voyage-step" data-paso="2"><span>02</span><div><h3>Diseñamos</h3><p>La experiencia visible y el sistema que trabaja detrás.</p></div></li>
                <li className="voyage-step" data-paso="3"><span>03</span><div><h3>Construimos</h3><p>Una primera versión concreta, medible y lista para usar.</p></div></li>
                <li className="voyage-step" data-paso="4"><span>04</span><div><h3>Escalamos</h3><p>Medimos, afinamos y sumamos solo lo que produce valor.</p></div></li>
              </ol>
              <div className="voyage-waves" aria-hidden="true">
                <CapaVideo src="/video/layers/olas-loop.webm" poster="/video/layers/olas-loop-poster.png" loop />
              </div>
            </div>
          </div>
        </section>

        {/* NOSOTROS: el elenco de la funcion (los cinco Voltios del sitio como
            creditos de pelicula) + los principios de la casa */}
        <section className="nosotros-section" id="nosotros">
          <div className="section-heading section-heading--center reveal">
            <p className="chapter"><span>CAPÍTULO 04</span> / NOSOTROS</p>
            <h2>Detrás del telón,<br /><em>somos 4GS.</em></h2>
            <p>Un estudio de sistemas de crecimiento desde Colombia. Estrategia, automatización e inteligencia artificial puestas a trabajar en negocios reales — con un guía que ya conoces.</p>
          </div>
          <div className="elenco" aria-label="Voltio en todas sus funciones">
            {[
              { img: "voltio-saluda-poster.png", rol: "El anfitrión", escena: "La bienvenida" },
              { img: "voltio-opera-poster.png", rol: "El operador", escena: "Los sistemas" },
              { img: "voltio-presenta-poster.png", rol: "El presentador", escena: "La función" },
              { img: "voltio-pirata-poster.png", rol: "El vigía", escena: "La travesía" },
              { img: "voltio-palanca-poster.png", rol: "El que enciende", escena: "Tu proyecto" },
            ].map((p) => (
              <figure className="retrato reveal" key={p.rol}>
                <Image src={`/video/layers/${p.img}`} alt={`Voltio como ${p.rol}`} width={220} height={240} />
                <figcaption>
                  <b>{p.rol}</b>
                  <span>{p.escena}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <ul className="principios" aria-label="Los principios de la casa">
            <li className="reveal"><span>I</span><h3>Claridad primero</h3><p>Antes de construir entendemos el negocio: el objetivo, el cuello de botella y el recorrido real de tus clientes.</p></li>
            <li className="reveal"><span>II</span><h3>Sistemas, no ruido</h3><p>Cada pieza — sitio, automatización, IA — existe para que la operación trabaje sola, no para acumular herramientas.</p></li>
            <li className="reveal"><span>III</span><h3>Socios, no proveedores</h3><p>Medimos, afinamos y respondemos como parte de tu equipo. Si a tu negocio le va bien, a nosotros también.</p></li>
          </ul>
        </section>

        {/* EL GRAN ENCENDIDO: Voltio baja la palanca gigante, el skyline se ilumina
            ventana por ventana, llueven chispas y el CTA late. */}
        <section className="contact-story" id="contacto">
          <div className={palancaLista ? "contact-stage contact-stage--encendida" : "contact-stage"}>
            {/* el dirigible cruza el cielo nocturno del cierre (en el hero chocaba
                con la cabecera; aca tiene el cielo entero sobre la ciudad) */}
            <div className="encendido-dirigible" aria-hidden="true">
              <CapaVideo src="/video/layers/dirigible-loop.webm?v=2" poster="/video/layers/dirigible-loop-poster.png" loop />
            </div>
            <div className="encendido-skyline" aria-hidden="true">
              {palancaLista ? (
                <CapaVideo src="/video/layers/skyline-enciende.webm" poster="/video/layers/skyline-enciende-poster.png" unaVez />
              ) : (
                <Image src="/img/skyline-apagado.png" alt="" width={1242} height={622} />
              )}
            </div>
            <div className="chispas" aria-hidden="true" />
            <div className="encendido-palanca" aria-hidden="true">
              <CapaVideo
                src="/video/layers/voltio-palanca.webm"
                poster="/video/layers/voltio-palanca-poster.png"
                umbral={0.6}
                unaVez
                onPlay={() => {
                  sfx().palanca.play().catch(() => {});
                  // la ciudad enciende EN el momento del jalon (~2.6s del clip),
                  // no al final del video (feedback: quedaban 5s de pose con la
                  // ciudad apagada)
                  if (palancaTimer.current !== null) return;
                  palancaTimer.current = window.setTimeout(() => {
                    setPalancaLista(true);
                    sfx().campana.play().catch(() => {});
                  }, 2600);
                }}
              />
            </div>
            <div className="contact-copy">
              <div className="contact-spark" aria-hidden="true">ϟ</div>
              <p className="chapter"><span>ÚLTIMO CAPÍTULO</span> / TU PROYECTO</p>
              <h2>¿Qué debería estar haciendo<br />tu negocio <em>sin ti?</em></h2>
              <p>Cuéntanos dónde se atasca tu operación. Voltio y el equipo 4GS convierten ese punto en un sistema claro.</p>
              <a className="contact-cta" href="https://www.instagram.com/four.g.solutions/" target="_blank" rel="noreferrer">Hablar con 4GS <span>↗</span></a>
              <small>Respuesta humana. Sin formularios eternos.</small>
            </div>
          </div>
        </section>

        <footer>
          <Image src="/assets/4gs-logo.png" alt="4GS" width={84} height={42} />
          <p>Growth systems for ambitious businesses.</p>
          <a href="#inicio">Volver arriba ↑</a>
        </footer>
      </div>
    </main>
  );
}
