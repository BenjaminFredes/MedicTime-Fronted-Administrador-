import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, medico, isLoading }) {
  if (!isOpen || !medico) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center space-y-4">
        
        <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto border border-rose-100">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <div className="space-y-1">
          <h3 className="text-base font-bold text-slate-900">¿Eliminar médico?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            ¿Está seguro de que desea eliminar al <strong className="text-slate-800">Dr. {medico.nombre} {medico.apellido}</strong> del sistema? Esta acción eliminará su registro de la vista.
          </p>
        </div>

        <div className="flex items-center space-x-3 pt-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="w-1/2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition-all"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>

      </div>
    </div>
  );
}
