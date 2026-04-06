"use client";

import { Trash2, Pencil, Loader2, CheckCircle2, Undo2 } from "lucide-react";

interface FloatingSaveBarProps {
  deletedCount: number;
  editedCount: number;
  isSaving: boolean;
  onUndo: () => void;
  onSave: () => void;
}

export function FloatingSaveBar({
  deletedCount,
  editedCount,
  isSaving,
  onUndo,
  onSave,
}: FloatingSaveBarProps) {
  const hasDeletions = deletedCount > 0;

  return (
    <div className="fixed bottom-24 sm:bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div
        className="flex items-center gap-2 sm:gap-4 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl"
        style={{
          background: "white",
          border: "1px solid #e8ecf0",
          boxShadow: "0 8px 30px rgba(0,0,0,.12)",
        }}>
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background: hasDeletions
                ? "rgba(239,68,68,.1)"
                : "rgba(39,160,201,.1)",
            }}>
            {hasDeletions ? (
              <Trash2 className="w-4 h-4 text-red-500" />
            ) : (
              <Pencil className="w-4 h-4" style={{ color: "#27a0c9" }} />
            )}
          </div>
          <div>
            <p className="fc-sora text-xs sm:text-sm font-semibold text-gray-900 whitespace-nowrap">
              {hasDeletions
                ? `${deletedCount} ${deletedCount === 1 ? "eliminada" : "eliminadas"}`
                : `${editedCount} ${editedCount === 1 ? "editada" : "editadas"}`}
            </p>
            <p className="fc-sora text-[10px] sm:text-xs text-gray-400">Sin guardar</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onUndo}
            className="fc-sora p-2 sm:px-3.5 sm:py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-all cursor-pointer whitespace-nowrap"
            title="Deshacer">
            <Undo2 className="w-4 h-4 sm:hidden" />
            <span className="hidden sm:inline">Deshacer</span>
          </button>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="fc-sora inline-flex items-center gap-1.5 sm:gap-2 p-2 sm:px-4 sm:py-2 rounded-xl text-sm font-semibold text-white transition-all hover:brightness-110 cursor-pointer disabled:opacity-50 whitespace-nowrap"
            style={{ background: "#27a0c9" }}
            title="Guardar cambios">
            {isSaving ? (
              <Loader2 className="w-4 h-4 sm:w-3.5 sm:h-3.5 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            )}
            <span className="hidden sm:inline">
              {isSaving ? "Guardando..." : "Guardar cambios"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
