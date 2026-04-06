import { Receipt } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export function FacturacionHeader() {
  return (
    <div className="w-full bg-white">
      <div className="border-b border-gray-100 px-4 pt-6 pb-5 sm:px-6 sm:pt-8 sm:pb-6 md:px-8 lg:px-10 max-w-7xl mx-auto">
        <PageHeader
          eyebrow="WSFEv1 · ARCA"
          icon={Receipt}
          title="Facturación Electrónica"
          description="Seleccioná un certificado, subí el archivo de facturas y generá los CAEs automáticamente."
        />
      </div>
    </div>
  );
}
