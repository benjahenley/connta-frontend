"use client";

import PadronGuide from "@/components/mis-certificados/PadronGuide";

export default function HabilitarPadronTesting() {
  return <PadronGuide initialEnv="testing" showToggle={false} />;
}
