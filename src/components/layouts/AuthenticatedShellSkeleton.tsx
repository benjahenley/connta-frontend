"use client";

function SkeletonBar({ className }: { className: string }) {
  return (
    <div className={`animate-pulse rounded-md bg-gray-200 ${className}`} />
  );
}

interface AuthenticatedShellSkeletonProps {
  variant?: "full" | "content";
}

function ContentSkeleton() {
  return (
    <main className="flex-1 min-w-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <SkeletonBar className="h-4 w-40" />
        <SkeletonBar className="h-12 w-72" />

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <SkeletonBar className="h-24 w-full rounded-xl" />
          <SkeletonBar className="h-24 w-full rounded-xl" />
          <SkeletonBar className="h-24 w-full rounded-xl" />
          <SkeletonBar className="h-24 w-full rounded-xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <SkeletonBar className="h-48 w-full rounded-xl" />
          <SkeletonBar className="h-48 w-full rounded-xl" />
          <SkeletonBar className="h-48 w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}

export default function AuthenticatedShellSkeleton({
  variant = "full",
}: AuthenticatedShellSkeletonProps) {
  if (variant === "content") {
    return <ContentSkeleton />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 w-full h-14 flex items-center bg-white border-b border-gray-100 flex-shrink-0 z-40">
        <div className="w-56 h-full border-r border-gray-100 px-5 flex items-center gap-2.5">
          <SkeletonBar className="h-6 w-6 rounded" />
          <SkeletonBar className="h-4 w-32" />
        </div>
        <div className="ml-3">
          <SkeletonBar className="h-8 w-8 rounded-lg" />
        </div>
        <div className="flex-1" />
        <div className="px-5">
          <div className="flex items-center gap-2">
            <SkeletonBar className="h-7 w-7 rounded-full" />
            <SkeletonBar className="h-4 w-28" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="sticky top-14 self-start h-[calc(100vh-3.5rem)] w-56 bg-white border-r border-gray-100 px-2 pt-5">
          <div className="space-y-2">
            <SkeletonBar className="h-10 w-full rounded-lg" />
            <SkeletonBar className="h-10 w-full rounded-lg" />
            <SkeletonBar className="h-10 w-full rounded-lg" />
            <SkeletonBar className="h-10 w-full rounded-lg" />
          </div>
        </aside>

        <ContentSkeleton />
      </div>
    </div>
  );
}
