import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Política de privacidad — 4GS",
  description: "Política de privacidad del sitio de FourG Solutions.",
};

export default function Privacidad() {
  return (
    <main className="legal">
      <div className="cartelera-topbar">
        <Link className="brand" href="/" aria-label="Volver al inicio">
          <Image src="/assets/4gs-logo.png" alt="4GS" width={104} height={52} priority />
        </Link>
        <Link className="nav-cta" href="/#contacto">Encender proyecto <span aria-hidden="true">↗</span></Link>
      </div>
      <article className="legal-cuerpo">
        <h1>Política de privacidad</h1>
        <p className="legal-fecha">Última actualización: agosto de 2026</p>

        <h2>1. Lo esencial</h2>
        <p>
          Este sitio es una vitrina: <strong>no tiene formularios, no crea cuentas y no pide datos personales</strong>.
          Puedes recorrerlo completo sin entregarnos información tuya.
        </p>

        <h2>2. Qué se procesa técnicamente</h2>
        <ul>
          <li>
            Como cualquier sitio web, nuestro proveedor de alojamiento registra datos técnicos básicos de cada
            visita (dirección IP, tipo de navegador, páginas solicitadas) en sus registros de servidor, por
            razones de seguridad y operación.
          </li>
          <li>El sitio no instala cookies propias de rastreo ni herramientas de publicidad.</li>
        </ul>

        <h2>3. Enlaces externos</h2>
        <p>
          Al abrir un sitio del catálogo o nuestras redes sociales (por ejemplo Instagram), pasas a plataformas de
          terceros con sus propias políticas de privacidad; te recomendamos revisarlas.
        </p>

        <h2>4. Si nos escribes</h2>
        <p>
          Si nos contactas por correo o redes, usamos tus datos de contacto únicamente para responderte y gestionar
          la relación comercial. No vendemos ni compartimos esa información con terceros.
        </p>

        <h2>5. Tus derechos</h2>
        <p>
          Puedes pedirnos en cualquier momento conocer, actualizar o eliminar los datos que nos hayas compartido
          por los canales de contacto, conforme a la normativa colombiana de protección de datos (Ley 1581 de 2012).
        </p>

        <h2>6. Contacto</h2>
        <p>
          Escríbenos a <a href="mailto:cuenta@fourgsolutions.com">cuenta@fourgsolutions.com</a> para cualquier
          solicitud sobre esta política.
        </p>
      </article>
    </main>
  );
}
