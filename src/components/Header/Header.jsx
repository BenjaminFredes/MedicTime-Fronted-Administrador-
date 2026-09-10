import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, LogOut } from 'lucide-react';
import { useMsal } from '@azure/msal-react';

export default function Header() {
  const navigate = useNavigate();
  const { instance } = useMsal();

  const activeAccount = instance.getActiveAccount() || instance.getAllAccounts()[0];
  const storedUserData = JSON.parse(localStorage.getItem('userData') || '{}');

  const displayName = activeAccount?.name || storedUserData?.name || 'Administrador';
  const displayEmail = activeAccount?.username || storedUserData?.username || 'admin@medictime.cl';

  const TARGET_LOGIN_URL = "https://benjaminfredes.github.io/MedicTime-Fronted/#/login";

  const handleLogout = async () => {
    console.log("🔐 Cerrando sesión...");

    // 1. Limpiar storages locales
    localStorage.clear();
    sessionStorage.clear();

    // 2. Destruir sesión en MSAL y regresar al Login principal
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: TARGET_LOGIN_URL,
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      window.location.href = TARGET_LOGIN_URL;
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex justify-between items-center">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <Activity className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight">MEDICTIME</span>
            <span className="text-[10px] text-blue-400 font-semibold tracking-wider uppercase -mt-1">
              Panel de Administración
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center space-x-3 bg-slate-800/80 px-3.5 py-1.5 rounded-xl border border-slate-700">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold text-xs border border-blue-500/30">
              {displayName.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-200">{displayName}</span>
              <span className="text-[10px] text-slate-400">{displayEmail}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-rose-600/20 text-slate-300 hover:text-rose-400 px-3.5 py-2 rounded-xl border border-slate-700 hover:border-rose-500/40 text-xs font-medium transition-all cursor-pointer"
            title="Cerrar Sesión"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </header>
  );
}