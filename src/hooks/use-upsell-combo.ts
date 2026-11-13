import { useEffect, useState } from "react";

export type ServicioPrecio = { id: string; nombre: string; precio: number };
type UpsellState = { combo: ServicioPrecio | null; comboCamioneta?: ServicioPrecio | null } | null;

/** `camioneta`: devuelve el combo de camioneta si el POS lo tiene; si no, el de auto. */
export function useUpsellCombo(camioneta = false) {
  const [data, setData] = useState<UpsellState | undefined>(undefined);

  useEffect(() => {
    fetch("/api/servicios-upsell")
      .then((res) => res.json())
      .then((d: UpsellState) => setData(d ?? null))
      .catch(() => setData(null));
  }, []);

  if (data === undefined) return undefined;
  return (camioneta ? data?.comboCamioneta : null) ?? data?.combo ?? null;
}
