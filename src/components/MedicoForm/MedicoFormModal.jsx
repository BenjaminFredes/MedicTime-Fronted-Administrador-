import React, { useState, useEffect } from 'react';
import { X, Save, UserPlus } from 'lucide-react';

export default function MedicoFormModal({ isOpen, onClose, onSave, medicoToEdit, isLoading }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    especialidad: '',
    correo: '',
    telefono: '',
    estado: 'Disponible'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (medicoToEdit) {
      setFormData({
        nombre: medicoToEdit.nombre || '',
        apellido: medicoToEdit.apellido || '',
        especialidad: medicoToEdit.especialidad || '',
        correo: medicoToEdit.email || medicoToEdit.correo || '',
        telefono: medicoToEdit.telefono || '',
        estado: medicoToEdit.estado || 'Disponible'
      });
    } else {
      setFormData({
        nombre: '',
        apellido: '',
        especialidad: '',
        correo: '',
        telefono: '',
        estado: 'Disponible'
      });
    }
    setErrors({});
  }, [medicoToEdit, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";
    if (!formData.apellido.trim()) newErrors.apellido = "El apellido es obligatorio";
    if (!formData.especialidad.trim()) newErrors.especialidad = "La especialidad es obligatoria";
    if (!formData.correo.trim()) {
      newErrors.correo = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "Ingrese un correo electrónico válido";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Mapeo automático de 'correo' a 'email' para compatibilidad con el backend
      const medicoPayload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        especialidad: formData.especialidad,
        email: formData.correo,
        telefono: formData.telefono,
        estado: formData.estado
      };

      onSave(medicoPayload);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/80 flex justify-between items-center">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {medicoToEdit ? "Editar Médico" : "Agregar Nuevo Médico"}
              </h3>
              <p className="text-[11px] text-slate-500">
                {medicoToEdit ? "Modifica los datos del profesional" : "Completa los campos requeridos"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-700">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-slate-700 font-semibold">Nombre *</label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej. Carlos"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.nombre ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {errors.nombre && <p className="text-[10px] text-rose-500 mt-1">{errors.nombre}</p>}
            </div>

            <div>
              <label className="block mb-1 text-slate-700 font-semibold">Apellido *</label>
              <input
                type="text"
                value={formData.apellido}
                onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                placeholder="Ej. Mendoza"
                className={`w-full px-3.5 py-2.5 rounded-xl border ${
                  errors.apellido ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
                } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
              />
              {errors.apellido && <p className="text-[10px] text-rose-500 mt-1">{errors.apellido}</p>}
            </div>
          </div>

          <div>
            <label className="block mb-1 text-slate-700 font-semibold">Especialidad *</label>
            <input
              type="text"
              value={formData.especialidad}
              onChange={(e) => setFormData({ ...formData, especialidad: e.target.value })}
              placeholder="Ej. Cardiología, Pediatría..."
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.especialidad ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.especialidad && <p className="text-[10px] text-rose-500 mt-1">{errors.especialidad}</p>}
          </div>

          <div>
            <label className="block mb-1 text-slate-700 font-semibold">Correo Electrónico *</label>
            <input
              type="email"
              value={formData.correo}
              onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
              placeholder="carlos.mendoza@medictime.cl"
              className={`w-full px-3.5 py-2.5 rounded-xl border ${
                errors.correo ? 'border-rose-500 ring-1 ring-rose-500' : 'border-slate-200'
              } focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
            />
            {errors.correo && <p className="text-[10px] text-rose-500 mt-1">{errors.correo}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-slate-700 font-semibold">Teléfono</label>
              <input
                type="text"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                placeholder="+56 9 1234 5678"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-700 font-semibold">Estado</label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Disponible">Disponible</option>
                <option value="Ocupado">Ocupado</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              {isLoading ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{medicoToEdit ? "Guardar Cambios" : "Guardar Médico"}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}