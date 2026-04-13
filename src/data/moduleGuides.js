import { FileKey2 } from "lucide-react";

const moduleGuides = [
  {
    id: "certificados",
    title: "Certificados ARCA",
    icon: FileKey2,
    status: "available",
    steps: [
      {
        number: 1,
        title: "Adherir WSASS en ARCA",
        description:
          "Debes tener clave fiscal nivel 3 y habilitar los servicios necesarios en ARCA",
        tips: [
          "Accede a ARCA con tu clave fiscal nivel 3",
          "Ve a 'Administrador de Relaciones de Clave Fiscal'",
          "Habilitá el servicio WSFEv1 (Factura Electrónica)",
        ],
      },
      {
        number: 2,
        title: "Configurar Certificado",
        description:
          "Completa los datos requeridos: CUIT, usuario ARCA, clave fiscal y alias del certificado",
        tips: [
          "Ingresa tu CUIT completo",
          "Usuario ARCA (generalmente tu CUIT)",
          "Clave fiscal temporal",
          "Alias descriptivo para el certificado",
        ],
      },
      {
        number: 3,
        title: "Autorizar WSFE",
        description:
          "Habilita la autorización automática del web service de facturación electrónica",
        tips: [
          "Mantén el switch 'Autorizar WSFE' habilitado",
          "Esto permite emitir facturas inmediatamente",
          "No requiere pasos adicionales en ARCA",
        ],
      },
      {
        number: 4,
        title: "Verificar Configuración",
        description:
          "El sistema generará automáticamente tu certificado y lo configurará",
        tips: [
          "El proceso toma 2-3 minutos",
          "Recibirás confirmación cuando esté listo",
          "Ya puedes comenzar a facturar",
        ],
      },
    ],
  },
  // {
  //   id: "facturacion",
  //   title: "Facturación Electrónica",
  //   icon: Zap,
  //   status: "coming-soon",
  //   steps: [
  //     {
  //       number: 1,
  //       title: "Configurar Punto de Venta",
  //       description: "Establece los parámetros básicos de tu punto de venta",
  //       tips: [
  //         "Número de punto de venta",
  //         "Tipo de comprobante",
  //         "Condición frente al IVA",
  //       ],
  //     },
  //     {
  //       number: 2,
  //       title: "Cargar Productos",
  //       description: "Importa tu lista de productos desde Excel/CSV",
  //       tips: [
  //         "Formato específico requerido",
  //         "Códigos de producto únicos",
  //         "Precios y descripciones",
  //       ],
  //     },
  //     {
  //       number: 3,
  //       title: "Configurar Clientes",
  //       description: "Importa o crea tu base de datos de clientes",
  //       tips: [
  //         "Datos fiscales completos",
  //         "Condición frente al IVA",
  //         "Direcciones de entrega",
  //       ],
  //     },
  //     {
  //       number: 4,
  //       title: "Emitir Primera Factura",
  //       description: "Realiza tu primera emisión de comprobante electrónico",
  //       tips: [
  //         "Prueba con datos reales",
  //         "Verifica en ARCA",
  //         "Descarga el PDF",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "stock",
  //   title: "Gestión de Stock",
  //   icon: BarChart3,
  //   status: "coming-soon",
  //   steps: [
  //     {
  //       number: 1,
  //       title: "Configurar Inventario Inicial",
  //       description: "Establece el stock inicial de todos tus productos",
  //       tips: [
  //         "Cantidades actuales",
  //         "Ubicaciones de almacén",
  //         "Stock mínimo y máximo",
  //       ],
  //     },
  //     {
  //       number: 2,
  //       title: "Configurar Movimientos",
  //       description: "Define los tipos de movimientos de stock",
  //       tips: [
  //         "Entradas por compras",
  //         "Salidas por ventas",
  //         "Ajustes de inventario",
  //       ],
  //     },
  //     {
  //       number: 3,
  //       title: "Automatizar Alertas",
  //       description: "Configura alertas de stock bajo y reposición",
  //       tips: [
  //         "Niveles de stock mínimo",
  //         "Notificaciones automáticas",
  //         "Sugerencias de compra",
  //       ],
  //     },
  //   ],
  // },
  // {
  //   id: "clientes",
  //   title: "Gestión de Clientes",
  //   icon: Users,
  //   status: "coming-soon",
  //   steps: [
  //     {
  //       number: 1,
  //       title: "Importar Base de Datos",
  //       description: "Carga tu base de clientes existente desde Excel/CSV",
  //       tips: [
  //         "Formato de datos estandarizado",
  //         "Validación de CUITs",
  //         "Datos de contacto completos",
  //       ],
  //     },
  //     {
  //       number: 2,
  //       title: "Configurar Segmentación",
  //       description: "Organiza tus clientes por categorías y criterios",
  //       tips: [
  //         "Por tipo de cliente",
  //         "Por zona geográfica",
  //         "Por volumen de compras",
  //       ],
  //     },
  //     {
  //       number: 3,
  //       title: "Automatizar Comunicaciones",
  //       description: "Configura envíos automáticos de facturas y recordatorios",
  //       tips: [
  //         "Templates de email",
  //         "Horarios de envío",
  //         "Seguimiento de entregas",
  //       ],
  //     },
  //   ],
  // },
];

export { moduleGuides };
