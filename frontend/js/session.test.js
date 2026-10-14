/**
 * Pruebas unitarias y de aserción para session.js y tokens
 * Se puede ejecutar en navegador o entorno Node con jsdom/mock.
 */
import { saveSession, getUser, hasRole, can, clearSession } from './session.js';

export function runSessionTests() {
  console.log('[Test Suite] Ejecutando pruebas de sesión...');
  clearSession();

  // Caso 1: Mock de LoginResponseDto con roles como Strings
  const mockAuth = {
    token: 'jwt.mock.token',
    id: 99,
    email: 'admin@technova.com',
    firstName: 'Admin',
    lastName: 'Principal',
    roles: ['ADMIN'],
    permissions: ['TICKET_CREATE', 'TICKET_ASSIGN'],
  };

  saveSession(mockAuth);
  const user = getUser();
  console.assert(user && user.id === 99, 'Test 1 Falló: ID de usuario');
  console.assert(hasRole('ADMIN') === true, 'Test 2 Falló: hasRole ADMIN');
  console.assert(hasRole('TECHNICIAN') === false, 'Test 3 Falló: hasRole TECHNICIAN debe ser false');
  console.assert(can('TICKET_ASSIGN') === true, 'Test 4 Falló: can TICKET_ASSIGN');

  // Limpieza
  clearSession();
  console.assert(getUser() === null, 'Test 5 Falló: clearSession');
  console.log('[Test Suite] Todas las aserciones de sesión pasaron correctamente.');
}
