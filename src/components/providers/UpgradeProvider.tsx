"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { SubscriptionTier } from "@/types/auth";
import UpgradeModal from "@/components/upgrade/UpgradeModal";

interface UpgradeContextType {
  openUpgradeModal: (targetTier?: SubscriptionTier) => void;
}

const UpgradeContext = createContext<UpgradeContextType | undefined>(undefined);

export function UpgradeProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [targetTier, setTargetTier] = useState<SubscriptionTier | undefined>();

  const openUpgradeModal = (tier?: SubscriptionTier) => {
    setTargetTier(tier);
    setIsOpen(true);
  };

  return (
    <UpgradeContext.Provider value={{ openUpgradeModal }}>
      {children}
      <UpgradeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        initialTier={targetTier}
      />
    </UpgradeContext.Provider>
  );
}

export function useUpgrade() {
  const ctx = useContext(UpgradeContext);
  if (!ctx) throw new Error("useUpgrade must be used within UpgradeProvider");
  return ctx;
}
