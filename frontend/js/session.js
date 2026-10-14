const TOKEN_KEY = 'technova_token';
const USER_KEY = 'technova_user';

export function saveSession(auth) {
  if (!auth?.token) return;
  localStorage.setItem(TOKEN_KEY, auth.token);

  // Normalizar estructura de roles y permisos
  const rawRoles = auth.roles || [];
  const normalizedRoles = rawRoles.map((r) => (typeof r === 'string' ? r : r.name || r.authority || ''));

  const user = {
    id: auth.id,
    email: auth.email,
    firstName: auth.firstName || '',
    lastName: auth.lastName || '',
    fullName: `${auth.firstName || ''} ${auth.lastName || ''}`.trim() || auth.email,
    roles: normalizedRoles,
    permissions: auth.permissions || [],
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const data = localStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return Boolean(getToken());
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function hasRole(roleName) {
  const user = getUser();
  if (!user || !user.roles) return false;
  return user.roles.includes(roleName) || user.roles.includes(`ROLE_${roleName}`);
}

export function can(permissionName) {
  const user = getUser();
  if (!user) return false;
  // Un ADMIN tiene acceso a todo por defecto
  if (hasRole('ADMIN')) return true;
  return Array.isArray(user.permissions) && user.permissions.includes(permissionName);
}
