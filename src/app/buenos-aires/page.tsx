import type { Metadata } from "next";
import { RegionHub } from "@/components/region/RegionHub";
import { getRegion } from "@/lib/regiones";
import { canonical } from "@/lib/seo";

export const dynamic = "force-static";

const region = getRegion("buenos-aires")!;

export const metadata: Metadata = {
  title: region.titulo,
  description: region.descripcion,
  alternates: canonical("/buenos-aires"),
};

export default function Page() {
  return <RegionHub region={region} />;
}
