import { API_BASE } from './config.js';
import { clearSession, getToken } from './session.js';

export class ApiError extends Error {
  constructor(status, message, validationErrors = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

/**
 * Cliente HTTP estandarizado para la API REST de TechNova IT Helpdesk.
 * - Inyecta token JWT en header Authorization: Bearer <token>.
 * - Transforma respuestas de error en ApiError con mensaje legible del backend.
 * - Redirige a index.html cuando la sesión expira o es inválida (401).
 */
export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'No se pudo conectar con el servidor backend (http://localhost:8080). Verifique que el servicio esté activo y la base de datos conectada.');
  }

  if (response.status === 204) return null;

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth) {
      clearSession();
      window.location.replace('index.html?expired=1');
    }
    const message = data?.message || data?.error || `Error en la solicitud (${response.status})`;
    throw new ApiError(response.status, message, data?.validationErrors || null);
  }
  return data;
}

export const get = (path) => api(path);
export const post = (path, body, options = {}) => api(path, { method: 'POST', body, ...options });
export const put = (path, body) => api(path, { method: 'PUT', body });
export const patch = (path, body) => api(path, { method: 'PATCH', body });
export const del = (path) => api(path, { method: 'DELETE' });
