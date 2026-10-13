// TechNova IT Helpdesk - Gestión de sesión y autenticación
const TOKEN_KEY = 'technova.token';
const USER_KEY = 'technova.user';

export function normalizeUserData(data) {
  if (!data) return null;
  const firstName = data.firstName || '';
  const lastName = data.lastName || '';
  const fullName = data.fullName || `${firstName} ${lastName}`.trim() || data.email;
  const roles = Array.isArray(data.roles) ? data.roles : (data.role ? [data.role] : []);
  const permissions = Array.isArray(data.permissions) ? data.permissions : [];

  return {
    id: data.id,
    email: data.email,
    firstName,
    lastName,
    fullName,
    roles,
    primaryRole: roles[0] || 'USER',
    permissions,
  };
}

export function saveSession(authResponse) {
  if (!authResponse?.token) return;
  sessionStorage.setItem(TOKEN_KEY, authResponse.token);
  const user = normalizeUserData(authResponse);
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function updateUser(profile) {
  const user = normalizeUserData(profile);
  if (user) {
    sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return Boolean(getToken() && getUser());
}

export function hasRole(roleName) {
  const user = getUser();
  return Boolean(user?.roles?.includes(roleName));
}

export function hasAnyRole(...roleNames) {
  const user = getUser();
  return Boolean(user?.roles?.some((r) => roleNames.includes(r)));
}

/** Comprueba si el usuario tiene un permiso específico según los permisos del backend */
export function can(permission) {
  return Boolean(getUser()?.permissions?.includes(permission));
}

export function canAny(...permissions) {
  return permissions.some(can);
}

export function logout() {
  clearSession();
  window.location.href = 'index.html';
}

/** Redirige al login si no hay sesión activa */
export function requireSession() {
  if (!isLoggedIn()) {
    window.location.replace('index.html');
    return false;
  }
  return true;
}
