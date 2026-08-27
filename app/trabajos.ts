// La fuente UNICA del catalogo: el teatro (/) y la cartelera (/catalogo) leen de
// aca. Agregar un sitio nuevo = agregar una linea; el rollo, las proyecciones y
// los posters crecen solos.
export type Trabajo = {
  number: string;
  name: string;
  domain: string;
  url: string;
  image: string;
};

export const selectedWork: Trabajo[] = [
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
