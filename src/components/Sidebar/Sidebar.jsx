import React from 'react';
import { Users, LayoutDashboard, Settings, Shield, Stethoscope } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'medicos', label: 'Gestión de Médicos', icon: Stethoscope },
    { id: 'dashboard', label: 'Resumen General', icon: LayoutDashboard, disabled: true },
    { id: 'config', label: 'Configuración', icon: Settings, disabled: true },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-slate-200/80 p-4 flex flex-col justify-between flex-shrink-0">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-3">
            Menú Principal
          </p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <button
                  key={item.id}
                  disabled={item.disabled}
                  onClick={() => !item.disabled && setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100'
                      : item.disabled
                      ? 'text-slate-300 cursor-not-allowed opacity-60'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.disabled && (
                    <span className="ml-auto text-[9px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded">Próx</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-slate-100 hidden md:block">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 flex items-center space-x-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="text-[11px] leading-tight text-slate-600">
          </div>
        </div>
      </div>
    </aside>
  );
}
