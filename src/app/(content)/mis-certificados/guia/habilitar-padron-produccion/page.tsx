"use client";

import PadronGuide from "@/components/mis-certificados/PadronGuide";

export default function HabilitarPadronProduccion() {
  return <PadronGuide initialEnv="produccion" showToggle={false} />;
}
