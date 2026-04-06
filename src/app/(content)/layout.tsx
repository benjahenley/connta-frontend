"use client";

import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";
import BottomNav from "@/components/navigation/BottomNav";
import PastDueBanner from "@/components/banners/PastDueBanner";
import { UpgradeProvider } from "@/components/providers/UpgradeProvider";
import { NavigationGuardProvider } from "@/components/providers/NavigationGuardProvider";

export default function FlowsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NavigationGuardProvider>
      <UpgradeProvider>
        <div className="min-h-screen flex flex-col">
          <PastDueBanner />
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <Layout>
              <div className="w-full min-w-0 mx-auto pb-16 sm:pb-0">{children}</div>
            </Layout>
          </div>
          <BottomNav />
        </div>
      </UpgradeProvider>
    </NavigationGuardProvider>
  );
}
