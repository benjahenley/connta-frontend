export function HistorySkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-20 rounded-2xl bg-white border border-gray-200" />
      <div className="h-20 rounded-2xl bg-white border border-gray-200" />
      <div className="h-20 rounded-2xl bg-white border border-gray-200" />
    </div>
  );
}

export function FacturacionContentSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-7 w-64 rounded-md bg-gray-200" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row border-b border-gray-200">
            <div className="h-14 sm:w-56 bg-gray-100" />
            <div className="h-14 sm:w-44 bg-gray-50" />
          </div>
          <div className="p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="h-28 rounded-xl bg-gray-100" />
            <div className="h-28 rounded-xl bg-gray-100" />
            <div className="h-28 rounded-xl bg-gray-100" />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-7 w-72 rounded-md bg-gray-200" />
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 mx-auto mb-5" />
          <div className="h-4 w-64 rounded bg-gray-200 mx-auto mb-2" />
          <div className="h-3 w-full max-w-[20rem] rounded bg-gray-100 mx-auto" />
        </div>
      </div>

      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
          <div className="h-7 w-52 rounded-md bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-100" />
        </div>
        <HistorySkeleton />
      </div>
    </div>
  );
}

export function FacturacionPreviewSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <div className="h-5 w-36 rounded bg-gray-200" />
          <div className="h-8 w-8 rounded-lg bg-gray-100" />
        </div>
        <div className="overflow-hidden">
          <div className="grid grid-cols-6 gap-3 px-4 py-3 border-b border-gray-100">
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-100" />
            <div className="h-4 rounded bg-gray-100" />
          </div>
          <div className="space-y-3 px-4 py-4">
            <div className="h-12 rounded-xl bg-gray-50" />
            <div className="h-12 rounded-xl bg-gray-50" />
            <div className="h-12 rounded-xl bg-gray-50" />
            <div className="h-12 rounded-xl bg-gray-50" />
            <div className="h-12 rounded-xl bg-gray-50" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="h-6 w-48 rounded-md bg-gray-200 mb-4" />
        <div className="rounded-xl border border-sky-100 bg-sky-50/40 p-4 mb-4">
          <div className="flex flex-wrap gap-4">
            <div className="h-4 w-40 rounded bg-gray-200" />
            <div className="h-4 w-36 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-28 rounded bg-gray-200 mb-2" />
            <div className="h-11 w-full rounded-xl bg-gray-100 border border-gray-200" />
          </div>
          <div>
            <div className="h-4 w-24 rounded bg-gray-200 mb-2" />
            <div className="h-11 w-full rounded-xl bg-gray-100 border border-gray-200" />
            <div className="h-3 w-56 rounded bg-gray-100 mt-2" />
          </div>
        </div>
        <div className="flex justify-end mt-5">
          <div className="h-12 w-44 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
