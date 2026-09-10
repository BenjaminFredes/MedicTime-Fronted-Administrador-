import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { loginRequest } from "../auth/msalConfig";
import Header from '../components/Header/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import SearchBar from '../components/SearchBar/SearchBar';
import MedicoTable from '../components/MedicoTable/MedicoTable';
import MedicoFormModal from '../components/MedicoForm/MedicoFormModal';
import ConfirmDialog from '../components/ConfirmDialog/ConfirmDialog';
import { getMedicos, createMedico, updateMedico, deleteMedico } from '../services/medicoService';
import { Plus, Users, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react';

// Helper para inspeccionar los claims del JWT en consola
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

export default function AdminDashboard() {
  const { instance, inProgress } = useMsal();
  const [activeTab, setActiveTab] = useState('medicos');
  const [medicos, setMedicos] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedMedico, setSelectedMedico] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 🔑 Captura de token y usuario transmitidos desde URL o almacenamiento local
  const checkUrlToken = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get('token');
    const userFromUrl = urlParams.get('user');

    if (tokenFromUrl) {
      sessionStorage.setItem('accessToken', tokenFromUrl);
      localStorage.setItem('accessToken', tokenFromUrl);

      if (userFromUrl) {
        try {
          const decodedUser = JSON.parse(decodeURIComponent(userFromUrl));
          localStorage.setItem('userData', JSON.stringify(decodedUser));
        } catch (e) {
          console.error("Error al decodificar información de usuario:", e);
        }
      }

      // Limpiar la URL por seguridad sin recargar la página
      window.history.replaceState({}, document.title, window.location.pathname);
      return tokenFromUrl;
    }
    return sessionStorage.getItem('accessToken') || localStorage.getItem('accessToken');
  }, []);

  // 🔑 Obtención de token con validación de cuenta activa
  const getAccessToken = useCallback(async () => {
    const urlOrStoredToken = checkUrlToken();
    let account = instance.getActiveAccount();

    if (!account) {
      const currentAccounts = instance.getAllAccounts();
      if (currentAccounts.length > 0) {
        account = currentAccounts[0];
        instance.setActiveAccount(account);
      }
    }

    if (!account && urlOrStoredToken) {
      return urlOrStoredToken;
    }

    if (!account) {
      console.warn("⚠️ [MSAL] No se encontró cuenta activa. Redirigiendo a inicio de sesión...");
      window.location.href = 'https://benjaminfredes.github.io/MedicTime-Fronted/#/login';
      return null;
    }

    const request = {
      ...loginRequest,
      account: account
    };

    try {
      const response = await instance.acquireTokenSilent(request);
      return response.accessToken;
    } catch (e) {
      console.warn("⚠️ [MSAL] acquireTokenSilent falló. Usando token almacenado...", e);
      if (urlOrStoredToken) return urlOrStoredToken;

      window.location.href = 'https://benjaminfredes.github.io/MedicTime-Fronted/#/login';
      return null;
    }
  }, [instance, checkUrlToken]);

  // 🛡️ Detección Reactiva de Rol de Administrador
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminRole = useCallback(() => {
    // 1. Intentar por cuenta activa de MSAL
    let account = instance.getActiveAccount();
    
    // 2. Si no hay activa, buscar en la lista de cuentas MSAL
    if (!account) {
      const allAccounts = instance.getAllAccounts();
      if (allAccounts.length > 0) {
        account = allAccounts[0];
        instance.setActiveAccount(account);
      }
    }

    let roles = account?.idTokenClaims?.roles || [];

    // 3. Si MSAL aún no tiene roles en la cuenta, decodificar el JWT almacenado en URL/Storage
    if (roles.length === 0) {
      const storedToken = checkUrlToken();
      if (storedToken) {
        const decoded = parseJwt(storedToken);
        roles = decoded?.roles || [];
      }
    }

    const hasAdminRole = roles.includes("Administrador");
    setIsAdmin(hasAdminRole);
  }, [instance, checkUrlToken]);

  // Ejecutar verificación de rol al montar y cada vez que inProgress o la instancia cambien
  useEffect(() => {
    checkAdminRole();
  }, [checkAdminRole, inProgress]);

  // 🔄 Cargar médicos sincronizado con inProgress
  const fetchMedicos = useCallback(async () => {
    if (inProgress !== InteractionStatus.None) {
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = await getAccessToken();

      if (!token) {
        setError("Sesión no encontrada. Por favor, vuelva a iniciar sesión.");
        setLoading(false);
        return;
      }

      const decodedToken = parseJwt(token);
      console.log("✅ [JWT Payload]:", decodedToken);

      // Re-verificar roles una vez obtenido el token exitosamente
      checkAdminRole();

      const data = await getMedicos(token);
      setMedicos(data);
    } catch (err) {
      console.error("❌ Error en fetchMedicos:", err);
      setError("Error al cargar la lista de médicos. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [getAccessToken, inProgress, checkAdminRole]);

  useEffect(() => {
    fetchMedicos();
  }, [fetchMedicos]);

  const showFeedback = (text, type = "success") => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const filteredMedicos = medicos.filter(m => {
    const term = searchTerm.toLowerCase();
    return (
      m.nombre.toLowerCase().includes(term) ||
      m.apellido.toLowerCase().includes(term) ||
      m.especialidad.toLowerCase().includes(term)
    );
  });

  const handleOpenCreate = () => {
    if (!isAdmin) {
      showFeedback("Acceso denegado: No tienes permisos para agregar registros.", "error");
      return;
    }
    setSelectedMedico(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (medico) => {
    if (!isAdmin) {
      showFeedback("Acceso denegado: No tienes permisos para modificar registros.", "error");
      return;
    }
    setSelectedMedico(medico);
    setIsFormOpen(true);
  };

  const handleSaveMedico = async (medicoData) => {
    setActionLoading(true);
    try {
      const token = await getAccessToken();
      if (selectedMedico) {
        const updated = await updateMedico(selectedMedico.id, medicoData, token);
        setMedicos(prev => prev.map(m => m.id === selectedMedico.id ? updated : m));
        showFeedback("Médico actualizado correctamente.");
      } else {
        const newMedico = await createMedico(medicoData, token);
        setMedicos(prev => [newMedico, ...prev]);
        showFeedback("Médico registrado exitosamente.");
      }
      setIsFormOpen(false);
    } catch (err) {
      showFeedback("Ocurrió un error al guardar los datos.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenDelete = (medico) => {
    if (!isAdmin) {
      showFeedback("Acceso denegado: No tienes permisos para eliminar registros.", "error");
      return;
    }
    setSelectedMedico(medico);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMedico) return;
    setActionLoading(true);
    try {
      const token = await getAccessToken();
      await deleteMedico(selectedMedico.id, token);
      setMedicos(prev => prev.filter(m => m.id !== selectedMedico.id));
      showFeedback("Médico eliminado del sistema.");
      setIsDeleteOpen(false);
    } catch (err) {
      showFeedback("No se pudo eliminar el registro.", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      <Header />

      <div className="flex-1 max-w-7xl w-full mx-auto flex flex-col md:flex-row">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
          {feedbackMsg && (
            <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-semibold shadow-sm transition-all ${
              feedbackMsg.type === 'error' 
                ? 'bg-rose-50 text-rose-700 border-rose-200' 
                : 'bg-emerald-50 text-emerald-800 border-emerald-200'
            }`}>
              <div className="flex items-center space-x-2">
                {feedbackMsg.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{feedbackMsg.text}</span>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gestión de Médicos</h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {isAdmin 
                  ? "Administra los profesionales de la salud registrados en la clínica." 
                  : "Modo de solo lectura: Consulta la lista de médicos autorizados."}
              </p>
            </div>

            {/* 🔒 Botón visible únicamente para usuarios con Rol Administrador */}
            {isAdmin && (
              <button
                onClick={handleOpenCreate}
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar médico</span>
              </button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Total registrado: <strong className="text-slate-900 font-extrabold">{medicos.length}</strong></span>
              <button 
                onClick={fetchMedicos} 
                className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg transition-colors ml-2" 
                title="Actualizar datos"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading || inProgress !== InteractionStatus.None ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center my-4">
              <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold text-slate-600">Autenticando y cargando médicos...</p>
            </div>
          ) : error ? (
            <div className="bg-rose-50 rounded-2xl border border-rose-200 p-8 text-center my-4 text-rose-700">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              <p className="text-xs font-bold">{error}</p>
              <button onClick={fetchMedicos} className="mt-3 text-xs underline font-semibold">Intentar de nuevo</button>
            </div>
          ) : (
            <MedicoTable 
              medicos={filteredMedicos} 
              onEdit={handleOpenEdit} 
              onDelete={handleOpenDelete} 
              isAdmin={isAdmin}
            />
          )}

        </main>
      </div>

      <MedicoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSaveMedico}
        medicoToEdit={selectedMedico}
        isLoading={actionLoading}
      />

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
        medico={selectedMedico}
        isLoading={actionLoading}
      />

    </div>
  );
}