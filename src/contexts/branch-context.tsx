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
    const stored = readBranchCookie();
    if (stored) {
      const branch = BRANCHES.find((b) => b.id === stored);
      if (branch) {
        setSelectedBranchState(branch);
        setHasConfirmedBranch(true);
      }
    }
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
