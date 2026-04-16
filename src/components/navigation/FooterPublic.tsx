"use client";

import Image from "next/image";

export default function FooterPublic() {
  return (
    <footer
      className="py-10 px-6 text-center"
      style={{ background: "#05090e" }}>
      <div className="flex items-center justify-center gap-3 mb-3">
        <Image src="/favicon.svg" alt="Connta" width={26} height={26} />
        <span className="font-semibold text-white tracking-tight">Connta</span>
      </div>
      <p className="text-sm" style={{ color: "#3d5566" }}>
        © {new Date().getFullYear()} Connta. Todos los derechos reservados.
      </p>
    </footer>
  );
}
