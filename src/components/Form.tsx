import { useState } from "react";

export default function Form() {
  const [afipConfig, setAfipConfig] = useState({
    cuit: "",
    certificate: null as File | null,
    privateKey: null as File | null,
  });
  const [isLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(afipConfig);
  };

  return (
    <div className="w-full h-full rounded-xl shadow-soft">
      <form onSubmit={handleSubmit} className="space-y-4 ">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            CUIT
          </label>
          <input
            type="text"
            value={afipConfig.cuit}
            onChange={(e) =>
              setAfipConfig({ ...afipConfig, cuit: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="20-12345678-9"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certificado Digital (.crt)
          </label>
          <input
            type="file"
            accept=".crt"
            onChange={(e) =>
              setAfipConfig((prev) => ({
                ...prev,
                certificate: e.target.files?.[0] || null,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clave Privada (.key)
          </label>
          <input
            type="file"
            accept=".key"
            onChange={(e) =>
              setAfipConfig((prev) => ({
                ...prev,
                privateKey: e.target.files?.[0] || null,
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary-dark text-white font-medium px-5 py-2 rounded-lg transition-colors shadow-soft disabled:opacity-50 disabled:cursor-not-allowed">
          {isLoading ? "Configurando..." : "Configurar ARCA"}
        </button>
      </form>

      <div className="mt-6 text-sm text-gray-600">
        <h3 className="font-medium mb-2">
          Pasos para obtener las credenciales:
        </h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>
            Ingresa a{" "}
            <a
              href="https://www.afip.gob.ar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline">
              www.afip.gob.ar
            </a>
          </li>
          <li>Accede con tu CUIT y Clave Fiscal</li>
          <li>Ve a &quot;Administrador de Relaciones de Clave Fiscal&quot;</li>
          <li>Selecciona &quot;Nueva Relación&quot;</li>
          <li>Busca y selecciona &quot;Web Services&quot;</li>
          <li>
            Genera el Certificado Digital (.crt) y la Clave Privada (.key)
          </li>
        </ol>
      </div>
    </div>
  );
}
