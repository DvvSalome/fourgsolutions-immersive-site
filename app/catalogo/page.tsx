import Image from "next/image";
import Link from "next/link";
import { selectedWork } from "../trabajos";

export const metadata = {
  title: "La Cartelera — 4GS",
  description: "Todas las funciones: los sitios web creados por 4GS.",
};

/* LA CARTELERA: el vestibulo del cine. Cada sitio es un poster de estreno con su
   marquesina; al pasar el cursor, el poster se enciende y recorre el sitio entero. */
export default function Catalogo() {
  return (
    <main className="cartelera">
      <div className="deco-frame" aria-hidden="true">
        <i className="corner corner-tl" /><i className="corner corner-tr" />
        <i className="corner corner-bl" /><i className="corner corner-br" />
      </div>

      <header className="cartelera-topbar">
        <Link className="brand" href="/" aria-label="Volver al inicio">
          <Image src="/assets/4gs-logo.png" alt="4GS" width={104} height={52} priority />
        </Link>
        <Link className="nav-cta" href="/#contacto">Encender proyecto <span aria-hidden="true">↗</span></Link>
      </header>

      <div className="cartelera-head">
        <p className="chapter"><span>EL VESTÍBULO</span> / LA CARTELERA</p>
        <h1>Todas las <em>funciones.</em></h1>
        <p className="cartelera-sub">
          Cada sitio que construimos es un estreno. Pasa el cursor por un póster para
          recorrerlo completo, o abre la función en su propia sala.
        </p>
      </div>

      <div className="cartelera-grid">
        {selectedWork.map((item, i) => (
          <a
            className="poster"
            key={item.number}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Visitar ${item.name}`}
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <span className="poster-luces" aria-hidden="true" />
            <span className="poster-shot">
              <Image src={item.image} alt={`Vista previa del sitio ${item.name}`} fill sizes="(max-width: 680px) 92vw, 30vw" />
            </span>
            <span className="poster-placa">
              <small>Función {item.number} / {String(selectedWork.length).padStart(2, "0")}</small>
              <b>{item.name}</b>
              <span>{item.domain}</span>
            </span>
            <span className="poster-boleto" aria-hidden="true">VISITAR ↗</span>
          </a>
        ))}
      </div>

      <footer className="cartelera-pie">
        <Link href="/#trabajos">← Volver a la sala de cine</Link>
      </footer>
    </main>
  );
}
