import { MdDashboard } from "react-icons/md";
import { Shield, BookOpen, Receipt, Crown } from "lucide-react";

export const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <MdDashboard size={20} />,
    requireAuth: true,
  },
  {
    name: "Certificados",
    href: "/mis-certificados",
    icon: <Shield size={20} />,
    requireAuth: true,
  },
  {
    name: "Guías",
    href: "/mis-certificados/guia",
    icon: <BookOpen size={20} />,
    requireAuth: true,
  },
  {
    name: "Facturación",
    href: "/facturacion",
    icon: <Receipt size={20} />,
    requireAuth: true,
  },
  {
    name: "Admin",
    href: "/admin",
    icon: <Crown size={20} />,
    requireAuth: true,
    requireAdmin: true,
  },
];
