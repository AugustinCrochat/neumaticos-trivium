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

/**
 * Clúster "medidas de neumáticos": una nota por medida popular con los autos
 * que la usan, equivalencias y cómo elegir. Ver MedidasLinks.
 */
export const MEDIDAS: { slug: string; size: string }[] = [
  { slug: "neumaticos-205-55-r16-autos-que-la-usan", size: "205/55 R16" },
  { slug: "neumaticos-185-65-r15-autos-que-la-usan", size: "185/65 R15" },
  { slug: "neumaticos-175-70-r14-autos-que-la-usan", size: "175/70 R14" },
  { slug: "neumaticos-195-55-r16-autos-que-la-usan", size: "195/55 R16" },
  { slug: "neumaticos-205-60-r16-autos-que-la-usan", size: "205/60 R16" },
  { slug: "neumaticos-175-65-r14-autos-que-la-usan", size: "175/65 R14" },
  { slug: "neumaticos-195-65-r15-autos-que-la-usan", size: "195/65 R15" },
  { slug: "neumaticos-185-60-r15-autos-que-la-usan", size: "185/60 R15" },
  { slug: "neumaticos-265-65-r17-autos-que-la-usan", size: "265/65 R17" },
];

/**
 * Clúster "alineado y balanceado": el pilar explica qué es cada cosa y las demás
 * responden una búsqueda puntual (síntomas, cada cuánto, equipos, camionetas).
 * Ver TallerLinks.
 */
export const TALLER_PILAR = "alineacion-y-balanceo";

export const TALLER: { grupo: string; notas: { slug: string; title: string }[] }[] = [
  {
    grupo: "Síntomas: qué le pasa a mi auto",
    notas: [
      { slug: "auto-tira-para-un-lado-causas", title: "El auto tira para un lado" },
      { slug: "volante-vibra-causas-y-solucion", title: "El volante vibra" },
      { slug: "sintomas-alineacion-balanceo-o-rotacion", title: "¿Alineación, balanceo o rotación?" },
      { slug: "desgaste-irregular-de-neumaticos", title: "Desgaste irregular" },
      { slug: "pozo-o-golpe-que-revisar-en-el-neumatico", title: "Después de un pozo o un golpe" },
    ],
  },
  {
    grupo: "Cada cuánto y para qué",
    notas: [
      { slug: "cada-cuantos-km-alinear-y-balancear", title: "Cada cuántos km alinear y balancear" },
      { slug: "alineado-y-balanceado-en-camionetas-y-4x4", title: "En camionetas y 4x4" },
      { slug: "cuanto-tarda-alineado-y-balanceado", title: "Cuánto tarda el servicio" },
      { slug: "revision-antes-de-viajar-neumaticos", title: "Revisión antes de viajar" },
      { slug: "rotacion-de-neumaticos", title: "Rotación de neumáticos" },
    ],
  },
  {
    grupo: "Cómo se hace",
    notas: [
      { slug: "que-mide-una-alineadora-convergencia-caida-avance", title: "Qué mide una alineadora" },
      { slug: "alineacion-3d-vs-alineacion-tradicional", title: "Alineación 3D vs. tradicional" },
      { slug: "pesas-de-balanceo-por-que-se-caen", title: "Pesas de balanceo" },
      { slug: "geoliner-630-geodyna-7800p-alineacion-balanceo", title: "Los equipos del taller" },
      { slug: "gomeria-en-cordoba", title: "Qué hace una gomería" },
    ],
  },
];

/**
 * Clúster "código del flanco": la guía madre muestra la foto de un 195/65 R15 95T XL con
 * cada dato numerado y cada nota explica uno. Ver FlancoLinks.
 */
export const FLANCO_PILAR = "como-leer-medida-neumatico";

export const FLANCO: { slug: string; title: string; numero: number }[] = [
  { slug: "ancho-del-neumatico-que-significa", title: "El ancho: qué significa el 195", numero: 1 },
  { slug: "perfil-del-neumatico-que-significa", title: "El perfil: qué significa el 65", numero: 2 },
  { slug: "neumatico-radial-que-significa-la-r", title: "La R: neumático radial", numero: 3 },
  { slug: "rodado-del-neumatico-que-significa", title: "El rodado: qué significa el 15", numero: 4 },
  { slug: "indice-de-carga-y-velocidad", title: "Índice de carga y velocidad: el 95 y la T", numero: 5 },
  { slug: "xl-extra-load-que-significa-en-el-neumatico", title: "XL (Extra Load): neumático reforzado", numero: 7 },
  { slug: "m-s-barro-y-nieve-que-significa-en-el-neumatico", title: "M+S: barro y nieve", numero: 8 },
];
