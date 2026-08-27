import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Términos de servicio — 4GS",
  description: "Términos de servicio del sitio de FourG Solutions.",
};

export default function Terminos() {
  return (
    <main className="legal">
      <div className="cartelera-topbar">
        <Link className="brand" href="/" aria-label="Volver al inicio">
          <Image src="/assets/4gs-logo.png" alt="4GS" width={104} height={52} priority />
        </Link>
        <Link className="nav-cta" href="/#contacto">Encender proyecto <span aria-hidden="true">↗</span></Link>
      </div>
      <article className="legal-cuerpo">
        <h1>Términos de servicio</h1>
        <p className="legal-fecha">Última actualización: agosto de 2026</p>

        <h2>1. Quiénes somos</h2>
        <p>
          Este sitio es operado por <strong>FourG Solutions</strong> (&quot;4GS&quot;, &quot;nosotros&quot;), un estudio
          de sistemas de crecimiento — estrategia, automatización e inteligencia artificial — con base en Colombia.
          Al navegar este sitio aceptas estos términos.
        </p>

        <h2>2. Uso del sitio</h2>
        <p>
          El sitio existe para presentar nuestro trabajo y facilitar el contacto comercial. Te comprometes a usarlo
          de manera legítima: sin intentar vulnerar su seguridad, extraer su contenido de forma masiva ni usarlo
          para fines ilícitos.
        </p>

        <h2>3. Propiedad intelectual</h2>
        <p>
          La marca 4GS, el personaje Voltio, las ilustraciones, animaciones, textos y el diseño de este sitio son
          propiedad de FourG Solutions. No pueden reproducirse ni usarse comercialmente sin autorización escrita.
          Las marcas y sitios de clientes mostrados en el catálogo pertenecen a sus respectivos titulares y se
          exhiben como muestra de trabajo realizado.
        </p>

        <h2>4. Enlaces a terceros</h2>
        <p>
          El catálogo enlaza a sitios de clientes y plataformas externas. No controlamos ese contenido y no nos
          hacemos responsables de él; cada sitio enlazado se rige por sus propios términos.
        </p>

        <h2>5. Sin garantías sobre el contenido</h2>
        <p>
          La información de este sitio es de carácter comercial y puede cambiar sin aviso. Los alcances, tiempos y
          condiciones de un proyecto se acuerdan siempre por escrito en la propuesta correspondiente — nada de lo
          publicado aquí constituye por sí solo una oferta vinculante.
        </p>

        <h2>6. Contacto</h2>
        <p>
          Para cualquier consulta sobre estos términos escríbenos a{" "}
          <a href="mailto:cuenta@fourgsolutions.com">cuenta@fourgsolutions.com</a> o por{" "}
          <a href="https://www.instagram.com/four.g.solutions/" target="_blank" rel="noreferrer">Instagram</a>.
        </p>
      </article>
    </main>
  );
}
