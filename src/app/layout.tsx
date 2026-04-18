import type { Metadata } from "next";
import { Suspense } from "react";
import { Barlow_Condensed, Inter, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { RouteScrollManager } from "@/components/providers/RouteScrollManager";

const inter = Inter({ subsets: ["latin"] });
const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["700", "900"],
  display: "swap",
  variable: "--font-condensed",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sora",
});

export const metadata: Metadata = {
  title: "Connta AR - Flujos Contables",
  description: "Automatización de comprobantes ARCA",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} ${barlowCondensed.variable} ${sora.variable}`}>
        <AuthProvider>
          <Suspense fallback={null}>
            <RouteScrollManager />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
