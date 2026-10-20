"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { BRANCHES, DEFAULT_BRANCH_ID, BRANCH_COOKIE, type Branch } from "@/lib/config";

type BranchContextType = {
  selectedBranch: Branch;
  setSelectedBranch: (branch: Branch) => void;
  hasConfirmedBranch: boolean;
  isModalOpen: boolean;
  openModal: () => void;
  openModalForAction: (cb: (branch: Branch) => void) => void;
  closeModal: () => void;
};

const BranchContext = createContext<BranchContextType | null>(null);

// Cookie (no localStorage): las páginas piden el catálogo de la sucursal
// elegida en el servidor (ver src/lib/branch-server.ts), que no tiene acceso
// a localStorage — la cookie la lee tanto el cliente como el servidor.
function readBranchCookie(): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${BRANCH_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Cookie de sesión (sin max-age) para la sucursal sugerida por IP: las páginas
// del servidor leen la misma cookie, pero una sugerencia aproximada no debe
// quedar fija un año — la próxima visita se vuelve a estimar.
function writeSessionBranchCookie(branchId: string) {
  document.cookie = `${BRANCH_COOKIE}=${branchId}; path=/; SameSite=Lax`;
}

function writeBranchCookie(branchId: string) {
  document.cookie = `${BRANCH_COOKIE}=${branchId}; path=/; max-age=31536000; SameSite=Lax`;
}

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<Branch>(
    BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID)!
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasConfirmedBranch, setHasConfirmedBranch] = useState(false);
  const [pendingAction, setPendingAction] = useState<((branch: Branch) => void) | null>(null);

  useEffect(() => {
    // ?sucursal=<id> en la URL (para links de campañas, ej. Google Ads local)
    // pisa la cookie: es una elección explícita del link que llevó a la
    // visita, y evita el paso de fricción de elegir sucursal en el modal.
    const fromQuery = new URLSearchParams(window.location.search).get("sucursal");
    const queryBranch = fromQuery ? BRANCHES.find((b) => b.id === fromQuery) : undefined;
    if (queryBranch) {
      setSelectedBranchState(queryBranch);
      writeBranchCookie(queryBranch.id);
      setHasConfirmedBranch(true);
      return;
    }

    const stored = readBranchCookie();
    if (stored) {
      const branch = BRANCHES.find((b) => b.id === stored);
      if (branch) {
        setSelectedBranchState(branch);
        setHasConfirmedBranch(true);
      }
      return;
    }

    // Primera visita sin elección previa: se preselecciona la sucursal más
    // cercana por IP. Si el usuario elige otra, setSelectedBranch pisa esto.
    let cancelado = false;
    fetch("/api/sucursal-cercana", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json: { branchId: string | null } | null) => {
        const branch = json?.branchId ? BRANCHES.find((b) => b.id === json.branchId) : undefined;
        if (!branch || cancelado || readBranchCookie()) return;
        setSelectedBranchState(branch);
        writeSessionBranchCookie(branch.id);
        setHasConfirmedBranch(true);
      })
      .catch(() => {});
    return () => {
      cancelado = true;
    };
  }, []);

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    writeBranchCookie(branch.id);
    setHasConfirmedBranch(true);
    setIsModalOpen(false);
    if (pendingAction) {
      pendingAction(branch);
      setPendingAction(null);
    }
  };

  const openModalForAction = (cb: (branch: Branch) => void) => {
    setPendingAction(() => cb);
    setIsModalOpen(true);
  };

  return (
    <BranchContext.Provider
      value={{
        selectedBranch,
        setSelectedBranch,
        hasConfirmedBranch,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
        openModalForAction,
        closeModal: () => setIsModalOpen(false),
      }}
    >
      {children}
    </BranchContext.Provider>
  );
}

export function useBranch() {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error("useBranch must be used inside BranchProvider");
  return ctx;
}
