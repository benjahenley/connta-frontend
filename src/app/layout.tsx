import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { RouteScrollManager } from "@/components/providers/RouteScrollManager";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <AuthProvider>
          <RouteScrollManager />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
