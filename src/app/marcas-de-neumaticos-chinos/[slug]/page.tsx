import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DEFAULT_BRANCH_ID } from "@/lib/config";
import { BRANDS } from "@/lib/data";
import { getProductosDesdePOS } from "@/lib/pos-api";
import { canonical, SITE_NAME } from "@/lib/seo";
import { OTRAS_MARCAS, getOtraMarca } from "@/lib/marcas-chinas";
import { poolShare } from "@/lib/share-image";
import { CategoryLanding } from "../../neumaticos/CategoryLanding";
import { OtraMarcaExtra } from "./OtraMarcaExtra";

// Como el resto de las landings de SEO usa DEFAULT_BRANCH_ID y no lee la cookie
// de sucursal (ver memoria seo-architecture): tiene que seguir siendo estática.
type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return OTRAS_MARCAS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const marca = getOtraMarca(slug);
  if (!marca) return {};
  const path = `/marcas-de-neumaticos-chinos/${marca.slug}`;
  const share = poolShare(`marca-${marca.slug}`);
  return {
    title: `Neumáticos ${marca.name}: quién la fabrica, dónde se consigue y alternativas`,
    description: `Qué se sabe de la marca ${marca.name} (${marca.empresa}), cómo comparar neumáticos chinos y las marcas chinas que tenemos en stock en Córdoba, con precio publicado, garantía y colocación sin cargo.`,
    alternates: canonical(path),
    openGraph: { title: `Neumáticos ${marca.name} y alternativas — ${SITE_NAME}`, url: path, ...share.openGraph },
    twitter: share.twitter,
  };
}

export default async function OtraMarcaPage({ params }: Props) {
  const { slug } = await params;
  const marca = getOtraMarca(slug);
  if (!marca) notFound();

  const productos = await getProductosDesdePOS(DEFAULT_BRANCH_ID);
  const chinas = new Set(BRANDS.filter((b) => b.origin === "China").map((b) => b.id));
  // Auto y camioneta de las marcas chinas que tenemos: la carga tiene su propia landing.
  const lista = productos.filter((p) => chinas.has(p.brandId) && !p.isCarga);
  const mismaFabrica = marca.mismoFabricante ? BRANDS.find((b) => b.id === marca.mismoFabricante)?.name : undefined;

  const faqs = [
    {
      question: `¿${marca.name} es una marca china?`,
      answer: `Sí. ${marca.name} es una marca de origen chino de ${marca.empresa}${marca.sede ? `, con sede en ${marca.sede}` : ""}.`,
    },
    {
      question: `¿Quién fabrica ${marca.name}?`,
      answer: `Según los datos públicos, la marca pertenece a ${marca.empresa}.${marca.hermanas ? ` Del mismo grupo son ${marca.hermanas.join(", ")}.` : ""}`,
    },
    {
      question: `¿Venden neumáticos ${marca.name}?`,
      answer: `No, ${marca.name} no está en nuestro catálogo. ${
        mismaFabrica
          ? `Sí tenemos ${mismaFabrica}, que es del mismo fabricante, y otras marcas chinas nuevas, con garantía y colocación sin cargo.`
          : "Sí tenemos otras marcas chinas nuevas, con precio publicado, garantía por defecto de fabricación y colocación sin cargo."
      } Podés verlas más arriba, filtrando por medida.`,
    },
    {
      question: `¿${marca.name} es buena?`,
      answer: `No la vendemos ni la probamos, así que no podemos opinar sobre su desempeño. Para comparar cualquier neumático conviene mirar la etiqueta europea registrada en EPREL, la fecha de fabricación (DOT), los índices de carga y velocidad y la garantía.`,
    },
    {
      question: "¿Cómo sé qué medida necesito?",
      answer:
        "Está en el flanco del neumático que tenés puesto, con el formato 185/65 R15 (ancho, perfil y rodado), y también en la calcomanía de la puerta del conductor. Si no la encontrás, buscá tu auto en la sección Por vehículo.",
    },
    ...(marca.mismoFabricante
      ? [
          {
            question: `¿${marca.name} y ${mismaFabrica} son lo mismo?`,
            answer: `Son marcas del mismo fabricante, ${marca.empresa}. En el registro europeo EPREL hay modelos, como el FM601 175/70 R14 84H, que figuran con los mismos datos de etiqueta y el mismo proveedor en las dos marcas, lo que indica que es el mismo neumático con otro nombre. Conviene confirmarlo en el flanco.`,
          },
        ]
      : []),
  ];

  return (
    <CategoryLanding
      crumbLabel={`Neumáticos ${marca.name}`}
      path={`/marcas-de-neumaticos-chinos/${marca.slug}`}
      title={`Neumáticos ${marca.name}`}
      productos={lista}
      faqs={faqs}
      extra={<OtraMarcaExtra marca={marca} productos={lista} />}
      hero={{
        headline: `¿Buscás ${marca.name}?`,
        accent: "Mirá estas opciones.",
        bajada: mismaFabrica
          ? `${marca.name} es del mismo fabricante que ${mismaFabrica}, que sí tenemos. Mirá las marcas chinas en stock, por medida y con precio publicado.`
          : `${marca.name} no está en nuestro catálogo, pero tenemos neumáticos nuevos de otras marcas chinas, con precio publicado, garantía y colocación sin cargo.`,
        highlights: [
          { titulo: "Precio publicado", detalle: "El de la web es el del mostrador, con IVA incluido y por unidad." },
          { titulo: "Garantía", detalle: "Un año por defecto de fabricación." },
          { titulo: "Colocación sin cargo", detalle: "Colocación y válvulas sin cargo si comprás en el local de Córdoba." },
        ],
        idealPara: [
          "Quien ya compara marcas chinas de entrada y quiere ver precios en su medida",
          "Cambiar el juego completo con un presupuesto ajustado",
          "Autos y camionetas de uso urbano y de ruta",
        ],
        noIdealPara: [
          "Furgones y utilitarios cargados: mirá los neumáticos de carga",
          "Uso fuera de ruta frecuente: mirá los neumáticos A/T",
        ],
      }}
    />
  );
}
