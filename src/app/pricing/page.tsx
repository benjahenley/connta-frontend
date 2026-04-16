"use client";

import { Suspense } from "react";
import NavbarPublic from "@/components/navigation/NavbarPublic";
import FooterPublic from "@/components/navigation/FooterPublic";
import PricingPage from "@/components/pages/Pricing";

export default function Pricing() {
  return (
    <Suspense fallback={null}>
      <div className="min-h-screen flex flex-col">
        <NavbarPublic />
        <PricingPage />
        <FooterPublic />
      </div>
    </Suspense>
  );
}
