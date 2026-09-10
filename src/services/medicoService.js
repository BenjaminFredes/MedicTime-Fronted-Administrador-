import { MOCK_MEDICOS } from '../data/mockMedicos';

// URL Base Temporal para desarrollo local (Cambiar posteriormente por AWS API Gateway URL)
const API_URL = "https://190iqie7ue.execute-api.us-east-1.amazonaws.com";
const USE_MOCK = false; // Cambiar a false para conectar con MS-Médicos

// Simulación de persistencia local en memoria para los mocks
let localMedicos = [...MOCK_MEDICOS];

/**
 * Obtener todos los médicos
 * @param {string} [accessToken] Token JWT opcional para Authorization Bearer
 */
export const getMedicos = async (accessToken = null) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...localMedicos]), 400);
    });
  }

  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(`${API_URL}/medicos`, { headers });
  if (!response.ok) throw new Error("Error al obtener el listado de médicos");
  return await response.json();
};

/**
 * Crear un nuevo médico
 * @param {Object} medicoRequest Datos del médico a crear
 * @param {string} [accessToken] Token JWT opcional para Authorization Bearer
 */
export const createMedico = async (medicoRequest, accessToken = null) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newMedico = {
          ...medicoRequest,
          id: Date.now(),
          estado: medicoRequest.estado || "Disponible"
        };
        localMedicos.unshift(newMedico);
        resolve(newMedico);
      }, 500);
    });
  }

  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(`${API_URL}/medicos`, {
    method: "POST",
    headers,
    body: JSON.stringify(medicoRequest)
  });
  if (!response.ok) throw new Error("Error al registrar el nuevo médico");
  return await response.json();
};

/**
 * Actualizar un médico existente
 * @param {number|string} id ID del médico
 * @param {Object} medicoRequest Datos modificados
 * @param {string} [accessToken] Token JWT opcional para Authorization Bearer
 */
export const updateMedico = async (id, medicoRequest, accessToken = null) => {
  if (USE_MOCK) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = localMedicos.findIndex(m => m.id === id);
        if (index !== -1) {
          localMedicos[index] = { ...localMedicos[index], ...medicoRequest };
          resolve(localMedicos[index]);
        } else {
          reject(new Error("Médico no encontrado"));
        }
      }, 500);
    });
  }

  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(`${API_URL}/medicos/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(medicoRequest)
  });
  if (!response.ok) throw new Error("Error al actualizar la información del médico");
  return await response.json();
};

/**
 * Eliminar un médico
 * @param {number|string} id ID del médico
 * @param {string} [accessToken] Token JWT opcional para Authorization Bearer
 */
export const deleteMedico = async (id, accessToken = null) => {
  if (USE_MOCK) {
    return new Promise((resolve) => {
      setTimeout(() => {
        localMedicos = localMedicos.filter(m => m.id !== id);
        resolve({ success: true, id });
      }, 400);
    });
  }

  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const response = await fetch(`${API_URL}/medicos/${id}`, {
    method: "DELETE",
    headers
  });
  if (!response.ok) throw new Error("Error al eliminar el médico");
  return true;
};
