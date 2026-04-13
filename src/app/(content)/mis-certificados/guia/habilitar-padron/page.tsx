"use client";

import PadronGuide from "@/components/mis-certificados/PadronGuide";

export default function HabilitarPadron() {
  return <PadronGuide initialEnv="produccion" showToggle={false} />;
}
