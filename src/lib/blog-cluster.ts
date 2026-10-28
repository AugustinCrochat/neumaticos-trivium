/**
 * Clúster "marca vs. alternativas": notas para quien duda entre un neumático de
 * marca premium y uno importado/económico. La primera es el pilar; las demás
 * responden una búsqueda puntual y se enlazan entre sí (ver ClusterLinks).
 */
export const CLUSTER_PILAR = "neumaticos-de-marca-vs-importados-cual-conviene";

export const CLUSTER: { slug: string; title: string; short: string }[] = [
  { slug: CLUSTER_PILAR, title: "Neumáticos de marca vs. importados: ¿cuál conviene?", short: "La guía completa" },
  { slug: "son-malos-los-neumaticos-chinos", title: "¿Son malos los neumáticos chinos?", short: "Mitos y realidad" },
  { slug: "cuanto-duran-los-neumaticos-economicos", title: "¿Cuánto duran los neumáticos económicos?", short: "Qué define la vida útil" },
  { slug: "neumaticos-economicos-para-uso-urbano", title: "Neumáticos económicos para uso urbano", short: "Cuándo no necesitás premium" },
  { slug: "diferencia-neumatico-caro-y-barato", title: "Neumático caro vs. barato: qué cambia de verdad", short: "Lo que sí y lo que no" },
  { slug: "cuatro-economicos-o-dos-de-marca", title: "¿4 económicos o 2 de marca?", short: "La cuenta y el eje" },
  { slug: "como-elegir-neumatico-importado-seguro", title: "Cómo elegir un neumático importado seguro", short: "Checklist de 8 puntos" },
  { slug: "marca-o-importado-camioneta-at-carga", title: "Marca o importado en camioneta, A/T y carga", short: "Uso exigente" },
  { slug: "alternativas-a-michelin-y-pirelli", title: "Alternativas a Michelin y Pirelli", short: "Qué marcas comparar" },
];

/**
 * Clúster "ahorrar en neumáticos": la guía completa es el pilar y las demás
 * notas lo desarrollan en cuatro frentes (comprar, hacer durar, cuidar, evitar
 * problemas). Ver AhorroLinks.
 */
export const AHORRO_PILAR = "como-ahorrar-en-neumaticos-guia-completa";

export const AHORRO: { grupo: string; notas: { slug: string; title: string }[] }[] = [
  {
    grupo: "Comprar mejor",
    notas: [
      { slug: "precio-calidad-neumaticos-costo-por-km", title: "Precio y calidad: cuánto sale cada kilómetro" },
      { slug: "que-incluye-el-presupuesto-de-neumaticos", title: "Qué incluye el presupuesto" },
      { slug: "cuatro-economicos-o-dos-de-marca", title: "¿4 económicos o 2 de marca?" },
      { slug: "neumaticos-usados-conviene-comprarlos", title: "Neumáticos usados: ¿conviene?" },
      { slug: "como-comparar-neumaticos-antes-de-comprar", title: "Cómo comparar antes de comprar" },
    ],
  },
  {
    grupo: "Hacer que duren",
    notas: [
      { slug: "presion-de-neumaticos", title: "Presión: cuánto inflar" },
      { slug: "alineacion-y-balanceo", title: "Alineado y balanceado" },
      { slug: "rotacion-de-neumaticos", title: "Rotación" },
      { slug: "habitos-de-manejo-que-gastan-los-neumaticos", title: "Hábitos de manejo que los gastan" },
    ],
  },
  {
    grupo: "Cuidar y mantener",
    notas: [
      { slug: "revision-mensual-de-neumaticos-en-5-minutos", title: "Revisión mensual en 5 minutos" },
      { slug: "como-guardar-neumaticos", title: "Cómo guardar neumáticos" },
      { slug: "limpiar-neumaticos-brillo-y-productos", title: "Limpieza y brillos" },
      { slug: "cambio-de-valvulas-de-neumaticos", title: "Cambio de válvulas" },
    ],
  },
  {
    grupo: "Evitar problemas",
    notas: [
      { slug: "pozo-o-golpe-que-revisar-en-el-neumatico", title: "Pozos y golpes: qué revisar" },
      { slug: "burbuja-en-el-flanco-del-neumatico", title: "Burbuja en el flanco" },
      { slug: "neumatico-que-pierde-aire-solo-causas", title: "Pierde aire solo: causas" },
      { slug: "aquaplaning-que-es-y-como-evitarlo", title: "Aquaplaning" },
      { slug: "como-cambiar-una-rueda-paso-a-paso", title: "Cambiar una rueda paso a paso" },
    ],
  },
];
