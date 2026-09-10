import React from 'react';
import { Edit2, Trash2, Mail, Phone, Stethoscope, UserX } from 'lucide-react';

export default function MedicoTable({ medicos, onEdit, onDelete, isAdmin = false }) {
  if (medicos.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-4">
        <div className="w-12 h-12 mx-auto bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-3">
          <UserX className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-800">No se encontraron médicos</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          No hay registros que coincidan con la búsqueda o la lista está vacía.
        </p>
      </div>
    );
  }

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'Disponible':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Ocupado':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3.5 px-6">ID</th>
              <th className="py-3.5 px-6">Médico / Especialidad</th>
              <th className="py-3.5 px-6">Contacto</th>
              <th className="py-3.5 px-6">Estado</th>
              {/* 🔒 Columna visible solo para Administrador */}
              {isAdmin && <th className="py-3.5 px-6 text-right">Acciones</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
            {medicos.map((medico) => (
              <tr key={medico.id} className="hover:bg-slate-50/60 transition-colors">
                
                <td className="py-4 px-6 text-slate-400 font-mono text-[11px]">
                  #{medico.id}
                </td>

                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs flex-shrink-0 border border-blue-100">
                      {medico.nombre[0]}{medico.apellido[0]}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm">
                        Dr. {medico.nombre} {medico.apellido}
                      </p>
                      <p className="text-[11px] text-blue-600 flex items-center space-x-1 mt-0.5 font-semibold">
                        <Stethoscope className="w-3 h-3" />
                        <span>{medico.especialidad}</span>
                      </p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-6 space-y-1">
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{medico.email || medico.correo}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-500 text-[11px]">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{medico.telefono || "No especificado"}</span>
                  </div>
                </td>

                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${getBadgeColor(medico.estado)}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
                    {medico.estado || "Disponible"}
                  </span>
                </td>

                {/* 🔒 Botones visibles únicamente para Administrador */}
                {isAdmin && (
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(medico)}
                        className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Editar médico"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(medico)}
                        className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Eliminar médico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                )}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
