import { useEffect, useState } from "react";
import type { Accessory } from "@/lib/types";

export function useAccesorios() {
  const [accesorios, setAccesorios] = useState<Accessory[]>([]);

  useEffect(() => {
    fetch("/api/accesorios")
      .then((res) => res.json())
      .then((data: { accesorios: Accessory[] }) => setAccesorios(data.accesorios ?? []))
      .catch(() => setAccesorios([]));
  }, []);

  return accesorios;
}
