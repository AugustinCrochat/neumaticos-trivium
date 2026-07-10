import { Suspense } from "react";
import type { Metadata } from "next";
import { ShopPage } from "@/components/ui/ShopPage";
import { getProductosDesdePOS } from "@/lib/pos-api";

export const revalidate = 300;

type Props = { searchParams: Promise<{ medida?: string }> };

function parseMedida(medida: string) {
  const parts = medida.toLowerCase().split("-");
  const width = parts[0] ? Number(parts[0]) : null;
  const profile = parts[1] ? Number(parts[1]) : null;
  const rim = parts[2] && parts[2].startsWith("r") ? Number(parts[2].substring(1)) : null;
  if (!width && !profile && !rim) return null;
  return { width, profile, rim };
}

function formatSizeLabel(size: { width: number | null; profile: number | null; rim: number | null }) {
  const parts: (string | number)[] = [];
  if (size.width) parts.push(size.width);
  if (size.profile) parts.push(size.profile);
  const label = parts.join("/");
  if (size.rim) return label ? `${label} R${size.rim}` : `R${size.rim}`;
  return label || null;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { medida } = await searchParams;
  if (!medida) return { title: "Buscar neumáticos — Trivium" };
  const parsed = parseMedida(medida);
  if (!parsed) return { title: "Buscar neumáticos — Trivium" };
  const label = formatSizeLabel(parsed);
  return {
    title: `Neumáticos ${label} — Trivium`,
    description: `Encontrá neumáticos en medida ${label} al mejor precio. Outlet de neumáticos importados.`,
  };
}

export default async function BuscarPage() {
  const productos = await getProductosDesdePOS();
  return (
    <Suspense>
      <ShopPage products={productos} />
    </Suspense>
  );
}
