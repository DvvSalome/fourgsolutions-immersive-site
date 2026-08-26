"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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

const selectedWork = [
  { number: "01", name: "Gestiones Eléctricas", domain: "gestioneselectricas.com", url: "https://gestioneselectricas.com", image: "/assets/sites/gestioneselectricas-com.jpg" },
  { number: "02", name: "Turnkey Clothing", domain: "turnkey-clothing.vercel.app", url: "https://turnkey-clothing.vercel.app", image: "/assets/sites/turnkey-clothing-vercel-app.jpg" },
  { number: "03", name: "Certitradición", domain: "certitradicion.com", url: "https://certitradicion.com", image: "/assets/sites/certitradicion-com.jpg" },
  { number: "04", name: "Barbas y Bigotes", domain: "barbasybigotes.com", url: "https://barbasybigotes.com", image: "/assets/sites/barbasybigotes-com.jpg" },
  { number: "05", name: "Adiós Vellos", domain: "adiosvellos-web.vercel.app", url: "https://adiosvellos-web.vercel.app", image: "/assets/sites/adiosvellos-web-vercel-app.jpg" },
  { number: "06", name: "Tapi Cascos", domain: "tapicascos-next.vercel.app", url: "https://tapicascos-next.vercel.app", image: "/assets/sites/tapicascos-next-vercel-app.jpg" },
  { number: "07", name: "Plethora Consulting", domain: "plethora-consulting.com", url: "https://plethora-consulting.com", image: "/assets/sites/plethora-consulting-com.jpg" },
  { number: "08", name: "Indubienes", domain: "indubienes.com", url: "https://indubienes.com", image: "/assets/sites/indubienes-com.jpg" },
  { number: "09", name: "Indubienes Tower", domain: "indubienes-tower.vercel.app", url: "https://indubienes-tower.vercel.app", image: "/assets/sites/indubienes-tower-vercel-app.jpg" },
  { number: "10", name: "Luup", domain: "luup-web-site-one.vercel.app", url: "https://luup-web-site-one.vercel.app", image: "/assets/sites/luup-web-site-one-vercel-app.jpg" },
];

export default function Home() {
  const [entered, setEntered] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const enterExperience = () => {
    setEntered(true);
    audioRef.current?.play().catch(() => undefined);
  };

  const moveLight = (event: React.PointerEvent<HTMLElement>) => {
    const x = (event.clientX / window.innerWidth - 0.5) * 18;
    const y = (event.clientY / window.innerHeight - 0.5) * 18;
    event.currentTarget.style.setProperty("--mx", `${x}px`);
    event.currentTarget.style.setProperty("--my", `${y}px`);
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
        <header className="topbar">
          <a className="brand" href="#inicio" aria-label="4GS, inicio">
            <Image src="/assets/4gs-logo.png" alt="4GS" width={104} height={52} priority />
          </a>
          <nav aria-label="Navegación principal">
            <a href="#sistemas">Sistemas</a>
            <a href="#trabajos">Trabajos</a>
            <a href="#metodo">Método</a>
          </nav>
          <a className="nav-cta" href="#contacto">Encender proyecto <span aria-hidden="true">↗</span></a>
        </header>

        <section className="hero" id="inicio">
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
            <Image className="voltio-host" src="/assets/voltio-host.png" alt="Voltio, robot negro y dorado de 4GS, dando la bienvenida" width={1072} height={1467} priority />
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
            <div className="systems-visual">
              <div className="machine-grid" aria-hidden="true" />
              <div className="machine-halo" aria-hidden="true" />
              <Image src="/assets/voltio-system.png" alt="Voltio operando un sistema de automatización 4GS" width={1073} height={1466} />
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
            <div className="portfolio-stage">
              <div className="projector-beam" aria-hidden="true" />
              <div className="portfolio-voltio" aria-hidden="true">
                <Image src="/assets/voltio-host.png" alt="" width={1072} height={1467} />
                <span>Voltio presenta</span>
              </div>
              <div className="portfolio-track" aria-label="Sitios web creados por 4GS">
                {selectedWork.map((item) => (
                  <article className="site-frame" key={item.number}>
                    <div className="site-browserbar">
                      <span className="traffic-lights" aria-hidden="true"><i /><i /><i /></span>
                      <b>{item.domain}</b>
                      <a href={item.url} target="_blank" rel="noreferrer" aria-label={`Visitar ${item.name}`}>VISITAR ↗</a>
                    </div>
                    <a className="site-shot" href={item.url} target="_blank" rel="noreferrer" aria-label={`Abrir sitio de ${item.name}`}>
                      <Image src={item.image} alt={`Vista previa del sitio ${item.name}`} fill sizes="(max-width: 680px) 88vw, 72vw" />
                    </a>
                    <div className="site-caption"><div><span>{item.number} / 10</span><h3>{item.name}</h3></div><p>{item.domain}</p></div>
                  </article>
                ))}
              </div>
              <div className="portfolio-instruction" aria-hidden="true"><span>SCROLL PARA RECORRER</span><i /></div>
            </div>
          </div>
        </section>

        <section className="method-section" id="metodo">
          <div className="method-intro reveal">
            <p className="chapter"><span>CAPÍTULO 03</span> / EL MÉTODO</p>
            <h2>Primero entendemos.<br /><em>Después encendemos.</em></h2>
          </div>
          <ol className="method-steps">
            <li className="reveal"><span>01</span><div><h3>Mapeamos</h3><p>Objetivo, cuello de botella, personas y recorrido real.</p></div></li>
            <li className="reveal"><span>02</span><div><h3>Diseñamos</h3><p>La experiencia visible y el sistema que trabaja detrás.</p></div></li>
            <li className="reveal"><span>03</span><div><h3>Construimos</h3><p>Una primera versión concreta, medible y lista para usar.</p></div></li>
            <li className="reveal"><span>04</span><div><h3>Escalamos</h3><p>Medimos, afinamos y sumamos solo lo que produce valor.</p></div></li>
          </ol>
        </section>

        <section className="contact-section" id="contacto">
          <div className="contact-spark" aria-hidden="true">ϟ</div>
          <p className="chapter"><span>ÚLTIMO CAPÍTULO</span> / TU PROYECTO</p>
          <h2>¿Qué debería estar haciendo<br />tu negocio <em>sin ti?</em></h2>
          <p>Cuéntanos dónde se atasca tu operación. Voltio y el equipo 4GS convierten ese punto en un sistema claro.</p>
          <a className="contact-cta" href="https://www.instagram.com/four.g.solutions/" target="_blank" rel="noreferrer">Hablar con 4GS <span>↗</span></a>
          <small>Respuesta humana. Sin formularios eternos.</small>
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
