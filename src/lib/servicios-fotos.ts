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
  taxi: { src: `${L}/taxi-en-el-taller-neumaticos-trivium-cordoba.webp`, alt: "Taxi en el taller de Neumáticos Trivium durante el cambio de cubiertas" },
} satisfies Record<string, FotoServicio>;

export const SERVICIOS_FOTOS: Record<string, { principal: FotoServicio; galeria: FotoServicio[] }> = {
  alineacion: {
    principal: { src: "/images/servicios/alineacion.webp", alt: "Alineación de un auto en el taller de Neumáticos Trivium, Córdoba" },
    galeria: [F.alineando, F.pickup, F.target],
  },
  balanceo: {
    principal: { src: "/images/servicios/balanceo.webp", alt: "Balanceo de una rueda en el taller de Neumáticos Trivium, Córdoba" },
    galeria: [F.balanceando, F.balanceadora, F.camionetas],
  },
  montaje: {
    principal: { src: "/images/servicios/arme-desarme.webp", alt: "Arme y desarme de un neumático en el taller de Neumáticos Trivium, Córdoba" },
    galeria: [F.perfilBajo, F.at, F.kingpro],
  },
  "rotacion-de-ruedas": {
    principal: F.camionetas,
    galeria: [F.rotacion, F.taxi, F.balanceando],
  },
};
