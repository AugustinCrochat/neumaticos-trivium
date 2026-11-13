/**
 * Fotos reales del taller de Argüello por servicio: una principal (4:3, va en
 * el encabezado) y tres de galería. Los textos alternativos describen lo que se
 * ve, no repiten la keyword.
 */
export type FotoServicio = { src: string; alt: string };

const L = "/images/local";

const F = {
  alineando: { src: `${L}/tecnicos-alineando-auto-elevador-gomeria-trivium-cordoba.webp`, alt: "Técnicos alineando un auto en el elevador del taller de Neumáticos Trivium, Córdoba" },
  pickup: { src: `${L}/pickup-4x4-en-elevador-alineacion-neumaticos-trivium-cordoba.webp`, alt: "Pick-up 4x4 en el elevador para alineación en el taller de Trivium" },
  target: { src: `${L}/target-alineadora-rueda-auto-elevador-trivium-cordoba.webp`, alt: "Target de la alineadora 3D colocado en la rueda de un auto sobre el elevador" },
  balanceando: { src: `${L}/tecnico-balanceando-rueda-balanceadora-trivium-cordoba.webp`, alt: "Técnico balanceando una rueda en la balanceadora del taller de Trivium" },
  balanceadora: { src: `${L}/balanceadora-y-alineadora-utilitario-taller-trivium-cordoba.webp`, alt: "Balanceadora y alineadora con un utilitario en el taller de Trivium en Córdoba" },
  camionetas: { src: `${L}/camionetas-en-elevador-taller-neumaticos-trivium-cordoba.webp`, alt: "Camionetas sobre los elevadores del taller de Neumáticos Trivium en Argüello" },
  perfilBajo: { src: `${L}/cubierta-perfil-bajo-grenlander-colocada-neumaticos-trivium.webp`, alt: "Cubierta de perfil bajo Grenlander recién colocada en una llanta" },
  at: { src: `${L}/neumatico-at-grenlander-maga-at-two-camioneta-clasica-trivium.webp`, alt: "Neumático A/T Grenlander Maga A/T Two colocado en una camioneta clásica" },
  kingpro: { src: `${L}/neumatico-grenlander-kingpro-one-pickup-trivium.webp`, alt: "Neumático Grenlander Kingpro One colocado en una pick-up" },
  rotacion: { src: `${L}/rotacion-de-neumaticos-pirelli-rueda-desmontada-trivium.webp`, alt: "Rueda Pirelli desmontada durante una rotación de neumáticos" },
  alineadora3d: { src: `${L}/alineadora-3d-hofmann-geoliner-630-con-target-en-la-rueda-trivium-cordoba.webp`, alt: "Alineadora 3D Hofmann Geoliner 630 con el monitor, las cámaras en el travesaño y el target en la rueda de un auto" },
  colocandoTarget: { src: `${L}/tecnico-colocando-target-de-alineacion-3d-en-auto-trivium-cordoba.webp`, alt: "Técnico colocando el target de la alineadora 3D en la rueda de un auto sobre el elevador" },
  autoRojoTarget: { src: `${L}/alineacion-3d-de-auto-rojo-target-en-la-rueda-trivium-cordoba.webp`, alt: "Auto rojo en el elevador con el target de la alineadora 3D colocado en la rueda delantera" },
  balanceandoCamioneta: { src: `${L}/balanceadora-hofmann-geodyna-7800p-balanceando-rueda-de-camioneta-trivium-cordoba.webp`, alt: "Técnico balanceando una rueda de camioneta A/T en la balanceadora Hofmann Geodyna 7800P" },
  cambioCamioneta: { src: `${L}/cambio-de-cubiertas-en-camioneta-pickup-con-balanceadora-hofmann-trivium-cordoba.webp`, alt: "Cambio de cubiertas de una camioneta en el taller de Neumáticos Trivium, con la balanceadora Hofmann al lado" },
  antirrobo: { src: `${L}/tuerca-antirrobo-de-seguridad-en-llanta-de-aleacion-trivium-cordoba.webp`, alt: "Llanta de aleación con una tuerca antirrobo entre las tuercas comunes" },
  antirroboFord: { src: `${L}/tuerca-antirrobo-en-llanta-de-ford-con-cubierta-grenlander-kingpro-trivium-cordoba.webp`, alt: "Tuerca antirrobo colocada en la llanta de un Ford, con una cubierta nueva Grenlander Kingpro One 175/65 R14" },
  sacandoTuerca: { src: `${L}/tecnico-sacando-tuerca-de-seguridad-con-pistola-neumatica-trivium-cordoba.webp`, alt: "Técnico sacando una tuerca de seguridad de la rueda de un auto con pistola neumática, con el kit de extracción en el piso" },
  kitExtraccion: { src: `${L}/kit-de-extraccion-de-tuercas-de-seguridad-en-el-taller-trivium-cordoba.webp`, alt: "Kit de extracción de tuercas de seguridad abierto en el piso del taller, junto a la rueda de un auto" },
  tallerCuatroAutos: { src: `${L}/taller-de-gomeria-con-cuatro-autos-neumaticos-trivium-arguello-cordoba.webp`, alt: "Taller de Neumáticos Trivium en Argüello con cuatro autos en servicio" },
  remis: { src: `${L}/remis-cambio-de-cuatro-neumaticos-con-alineacion-y-balanceo-trivium-cordoba.webp`, alt: "Remis en el elevador durante el cambio de las cuatro cubiertas, con la balanceadora al fondo" },
  taxi: { src: `${L}/taxi-en-el-taller-neumaticos-trivium-cordoba.webp`, alt: "Taxi en el taller de Neumáticos Trivium durante el cambio de cubiertas" },
} satisfies Record<string, FotoServicio>;

export const SERVICIOS_FOTOS: Record<string, { principal: FotoServicio; galeria: FotoServicio[] }> = {
  "combo-alineado-y-balanceado": {
    principal: { src: "/images/servicios/alineacion.webp", alt: "Alineado de un auto en el taller de Neumáticos Trivium, Córdoba" },
    galeria: [F.alineadora3d, F.balanceandoCamioneta, F.tallerCuatroAutos],
  },
  alineacion: {
    principal: { src: "/images/servicios/alineacion.webp", alt: "Alineación de un auto en el taller de Neumáticos Trivium, Córdoba" },
    galeria: [F.alineadora3d, F.colocandoTarget, F.autoRojoTarget],
  },
  balanceo: {
    principal: { src: "/images/servicios/balanceo.webp", alt: "Balanceo de una rueda en el taller de Neumáticos Trivium, Córdoba" },
    galeria: [F.balanceandoCamioneta, F.balanceando, F.balanceadora],
  },
  montaje: {
    principal: { src: "/images/servicios/arme-desarme.webp", alt: "Arme y desarme de un neumático en el taller de Neumáticos Trivium, Córdoba" },
    galeria: [F.cambioCamioneta, F.perfilBajo, F.at],
  },
  "rotacion-de-ruedas": {
    principal: F.camionetas,
    galeria: [F.rotacion, F.tallerCuatroAutos, F.balanceando],
  },
  "reparacion-de-pinchaduras": {
    principal: F.taxi,
    galeria: [F.rotacion, F.remis, F.cambioCamioneta],
  },
  "tuercas-de-seguridad": {
    principal: F.kitExtraccion,
    galeria: [F.sacandoTuerca, F.antirrobo, F.antirroboFord],
  },
};
