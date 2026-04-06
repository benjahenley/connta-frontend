import Image from "next/image";

export default function Loading() {
  return (
    <>
      <style>{`
        @keyframes connta-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.6; transform: scale(0.96); }
        }
        .connta-logo-pulse {
          animation: connta-pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: "#080f16" }}>
        <div className="connta-logo-pulse">
          <Image
            src="/favicon.svg"
            alt="Connta"
            width={140}
            height={140}
            priority
          />
        </div>
      </div>
    </>
  );
}
