"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { BRANCHES, DEFAULT_BRANCH_ID, type Branch } from "@/lib/config";

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

const STORAGE_KEY = "trivium-branch";

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<Branch>(
    BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID)!
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasConfirmedBranch, setHasConfirmedBranch] = useState(false);
  const [pendingAction, setPendingAction] = useState<((branch: Branch) => void) | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
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
    localStorage.setItem(STORAGE_KEY, branch.id);
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
