/**
 * TechNova IT Helpdesk - Pruebas Unitarias para el Módulo de Sesión y RBAC
 */

import { saveSession, getUser, getToken, isLoggedIn, hasRole, can, clearSession } from './session.js';

export function runSessionTests() {
  const results = [];

  const assert = (condition, description) => {
    results.push({ description, passed: Boolean(condition) });
    if (!condition) {
      console.error(`[FAIL] ${description}`);
    } else {
      console.log(`[PASS] ${description}`);
    }
  };

  clearSession();

  // Test 1: Estado inicial sin sesión
  assert(getUser() === null, 'Estado inicial: getUser() debe ser null');
  assert(getToken() === null, 'Estado inicial: getToken() debe ser null');
  assert(isLoggedIn() === false, 'Estado inicial: isLoggedIn() debe ser false');

  // Test 2: Guardado de sesión con rol ADMIN
  const mockAdminAuth = {
    token: 'jwt.mock.token.123',
    type: 'Bearer',
    id: 1,
    email: 'admin@technova.com',
    firstName: 'Admin',
    lastName: 'TechNova',
    roles: ['ADMIN'],
  };

  const mockAdminProfile = {
    id: 1,
    email: 'admin@technova.com',
    firstName: 'Admin',
    lastName: 'TechNova',
    roles: [{ name: 'ROLE_ADMIN' }],
    permissions: [{ name: 'TICKET_VIEW_ALL' }, { name: 'TICKET_ASSIGN' }],
  };

  saveSession(mockAdminAuth, mockAdminProfile);

  assert(isLoggedIn() === true, 'isLoggedIn() es true tras login');
  assert(getToken() === 'jwt.mock.token.123', 'getToken() retorna token almacenado');

  const adminUser = getUser();
  assert(adminUser && adminUser.id === 1, 'getUser() retorna ID correcto');
  assert(adminUser.fullName === 'Admin TechNova', 'fullName se construye adecuadamente');
  assert(hasRole('ADMIN') === true, 'hasRole("ADMIN") es true para administrador');
  assert(hasRole('ROLE_ADMIN') === true, 'hasRole("ROLE_ADMIN") normaliza prefijo ROLE_');
  assert(hasRole('TECHNICIAN') === false, 'hasRole("TECHNICIAN") es false para administrador');
  assert(can('TICKET_ASSIGN') === true, 'can("TICKET_ASSIGN") retorna true');
  assert(can('CUALQUIER_PERMISO') === true, 'ADMIN tiene acceso universal con can()');

  // Test 3: Guardado de sesión con rol USER
  clearSession();
  const mockUserAuth = {
    token: 'jwt.user.token.456',
    id: 3,
    email: 'usuario@technova.com',
    firstName: 'Santiago',
    lastName: 'Usuario',
    roles: ['USER'],
  };

  const mockUserProfile = {
    id: 3,
    email: 'usuario@technova.com',
    firstName: 'Santiago',
    lastName: 'Usuario',
    roles: ['USER'],
    permissions: ['TICKET_CREATE', 'TICKET_VIEW_OWN', 'TICKET_COMMENT_OWN'],
  };

  saveSession(mockUserAuth, mockUserProfile);
  assert(hasRole('USER') === true, 'hasRole("USER") es true para usuario solicitante');
  assert(hasRole('ADMIN') === false, 'hasRole("ADMIN") es false para usuario solicitante');
  assert(can('TICKET_CREATE') === true, 'can("TICKET_CREATE") es true');
  assert(can('TICKET_ASSIGN') === false, 'can("TICKET_ASSIGN") es false para USER');

  // Test 4: Limpieza de sesión
  clearSession();
  assert(getUser() === null, 'clearSession() elimina datos del usuario');
  assert(getToken() === null, 'clearSession() elimina token');
  assert(isLoggedIn() === false, 'isLoggedIn() es false tras clearSession()');

  return results;
}
