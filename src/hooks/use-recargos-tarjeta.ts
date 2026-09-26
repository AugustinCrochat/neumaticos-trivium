import { useEffect, useState } from "react";
import type { RecargoTarjeta } from "@/lib/pos-api";

export function useRecargosTarjeta() {
  const [recargos, setRecargos] = useState<RecargoTarjeta[] | null>(null);

  useEffect(() => {
    fetch("/api/recargos-tarjeta")
      .then((res) => res.json())
      .then((data: { recargos?: RecargoTarjeta[] }) => setRecargos(data.recargos ?? []))
      .catch(() => setRecargos([]));
  }, []);

  return recargos;
}
