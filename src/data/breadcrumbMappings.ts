interface BreadcrumbItem {
  url: string | null;
  title: string;
}

interface BreadcrumbMappings {
  [path: string]: BreadcrumbItem[];
}

export const breadcrumbMappings: BreadcrumbMappings = {
  "/dashboard": [{ url: "/dashboard", title: "Dashboard" }],
  "/mis-certificados": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/mis-certificados", title: "Mis Certificados" },
  ],
  "/mis-certificados/configurar": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/mis-certificados", title: "Mis Certificados" },
    { url: null, title: "Configurar CSR" },
  ],
  "/mis-certificados/guia": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/mis-certificados", title: "Mis Certificados" },
    { url: null, title: "Guías" },
  ],
  "/mis-certificados/guia/habilitar-testing": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/mis-certificados", title: "Mis Certificados" },
    { url: "/mis-certificados/guia", title: "Guías" },
    { url: null, title: "Habilitar certificado de testing" },
  ],
  "/mis-certificados/guia/habilitar-produccion": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/mis-certificados", title: "Mis Certificados" },
    { url: "/mis-certificados/guia", title: "Guías" },
    { url: null, title: "Habilitar certificado de producción" },
  ],
  "/mis-certificados/guia/facturacion": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/mis-certificados/guia", title: "Guías" },
    { url: null, title: "Cómo generar facturas electrónicas" },
  ],
  "/facturacion": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/facturacion", title: "Facturación Electrónica" },
  ],
  "/facturacion/preview": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/facturacion", title: "Facturación Electrónica" },
    { url: null, title: "Revisar y Generar" },
  ],
  "/facturacion/historial/[id]": [
    { url: "/dashboard", title: "Dashboard" },
    { url: "/facturacion", title: "Facturación Electrónica" },
    { url: null, title: "Detalle de carga" },
  ],
  "/pricing": [{ url: "/pricing", title: "Precios" }],
};
