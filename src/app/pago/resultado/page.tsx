import type { Metadata } from "next";
import { PaymentResult } from "./PaymentResult";
import { NOINDEX } from "@/lib/seo";

// Resultado de un pago concreto: no hay nada que indexar y no queremos que
// una URL de confirmación quede accesible desde una búsqueda.
export const metadata: Metadata = { title: "Resultado del pago", ...NOINDEX };

type Props = { searchParams: Promise<{ estado?: string }> };

export default async function PaymentResultPage({ searchParams }: Props) {
  const { estado } = await searchParams;
  return <PaymentResult status={estado} />;
}
