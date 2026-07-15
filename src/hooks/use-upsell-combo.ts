import { useEffect, useState } from "react";

export type ServicioPrecio = { id: string; nombre: string; precio: number };
type UpsellState = { combo: ServicioPrecio | null } | null;

export function useUpsellCombo() {
  const [combo, setCombo] = useState<ServicioPrecio | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/servicios-upsell")
      .then((res) => res.json())
      .then((data: UpsellState) => setCombo(data?.combo ?? null))
      .catch(() => setCombo(null));
  }, []);

  return combo;
}
