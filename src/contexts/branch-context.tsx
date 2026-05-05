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
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const BranchContext = createContext<BranchContextType | null>(null);

const STORAGE_KEY = "trivium-branch";

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranchState] = useState<Branch>(
    BRANCHES.find((b) => b.id === DEFAULT_BRANCH_ID)!
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const branch = BRANCHES.find((b) => b.id === stored);
      if (branch) setSelectedBranchState(branch);
    }
  }, []);

  const setSelectedBranch = (branch: Branch) => {
    setSelectedBranchState(branch);
    localStorage.setItem(STORAGE_KEY, branch.id);
    setIsModalOpen(false);
  };

  return (
    <BranchContext.Provider
      value={{
        selectedBranch,
        setSelectedBranch,
        isModalOpen,
        openModal: () => setIsModalOpen(true),
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
