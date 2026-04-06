"use client";

import NavbarPublic from "@/components/navigation/NavbarPublic";
import PricingPage from "@/components/pages/Pricing";

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavbarPublic />
      <PricingPage />
    </div>
  );
}
