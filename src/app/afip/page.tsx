"use client";

import { RequirePermission } from "@/components/providers/AuthProvider";
import Layout from "@/components/layouts/Home";
import Navbar from "@/components/navigation/Navbar";
import Sidebar from "@/components/navigation/Sidebar";

export default function AfipPage() {
  return (
    <RequirePermission requirePremium>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex flex-1">
          <Sidebar />
          <Layout>
            <div className="p-6">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Configuración ARCA
                </h1>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    🎉 ¡Acceso Premium Confirmado!
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Esta página está protegida y solo es accesible para usuarios
                    premium.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-green-400"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">
                          Acceso Autorizado
                        </h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            El sistema ha verificado tu estado de cliente
                            premium y te permite acceder a las funcionalidades
                            ARCA.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">
                        Configurar Certificados
                      </h3>
                      <p className="text-sm text-blue-700">
                        Sube y configura tus certificados ARCA para comenzar a
                        facturar.
                      </p>
                      <button className="mt-2 bg-blue-600 text-white px-4 py-2 text-sm rounded">
                        Configurar
                      </button>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h3 className="font-medium text-purple-900 mb-2">
                        Generar Facturas
                      </h3>
                      <p className="text-sm text-purple-700">
                        Crea y envía facturas electrónicas directamente a ARCA.
                      </p>
                      <button className="mt-2 bg-purple-600 text-white px-4 py-2 text-sm rounded">
                        Facturar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Layout>
        </div>
      </div>
    </RequirePermission>
  );
}
