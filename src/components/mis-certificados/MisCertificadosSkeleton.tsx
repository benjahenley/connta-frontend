function SkeletonBlock({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-xl bg-gray-200 ${className}`} />
  );
}

function StatSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <SkeletonBlock className="h-8 w-14 rounded-md" />
      <SkeletonBlock className="h-3 w-20 rounded-md mt-2" />
    </div>
  );
}

function CertCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <SkeletonBlock className="w-10 h-10 rounded-xl" />
          <div>
            <SkeletonBlock className="h-5 w-32 rounded-md" />
            <SkeletonBlock className="h-3 w-24 rounded-md mt-2" />
          </div>
        </div>
        <SkeletonBlock className="w-8 h-8 rounded-lg" />
      </div>

      <div className="flex items-center gap-3 mb-4">
        <SkeletonBlock className="h-3 w-20 rounded-md" />
        <SkeletonBlock className="h-3 w-24 rounded-md" />
      </div>

      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-2.5 w-16 rounded-md mb-2" />
          <SkeletonBlock className="h-4 w-24 rounded-md" />
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-lg" />
      </div>
    </div>
  );
}

export function MisCertificadosSkeleton() {
  return (
    <div className="w-full max-w-7xl mx-auto animate-pulse">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
        <StatSkeleton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <CertCardSkeleton />
        <CertCardSkeleton />
        <CertCardSkeleton />
        <CertCardSkeleton />
        <CertCardSkeleton />
        <CertCardSkeleton />
      </div>
    </div>
  );
}
