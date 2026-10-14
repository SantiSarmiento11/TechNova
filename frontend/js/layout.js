/**
 * TechNova IT Helpdesk - Lumina Shell Layout
 * Administra el cascarón común de navegación: Sidebar lateral y Header superior.
 */
import { getUser, isLoggedIn, clearSession, hasRole } from './session.js';
import { get } from './api.js';
import { esc } from './ui.js';

export const LOGO_ICON = `
  <div class="w-8 h-8 rounded-xl bg-primary-container text-white flex items-center justify-center shadow-md font-bold text-sm tracking-wider">
    TN
  </div>
`;

/**
 * Monta el shell de Lumina Desk en el documento.
 * @param {'dashboard' | 'tickets' | 'admin' | 'ticket-detail'} activePage 
 * @param {string} pageTitle 
 */
export async function mountShell(activePage, pageTitle = '') {
  if (!isLoggedIn()) {
    window.location.replace('index.html');
    return null;
  }

  document.title = `${pageTitle ? pageTitle + ' • ' : ''}TechNova IT Helpdesk`;

  let user = getUser();
  // Refrescar perfil desde backend si es posible
  try {
    const profile = await get('/api/auth/me');
    if (profile) {
      user = { ...user, ...profile };
    }
  } catch (e) {
    console.warn('No se pudo refrescar perfil en línea:', e);
  }

  const isAdmin = hasRole('ADMIN');
  const userInitials = (user?.firstName?.[0] || 'U') + (user?.lastName?.[0] || '');
  const userDisplayName = user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email || 'Usuario';
  const userRoleLabel = isAdmin ? 'Administrador TI' : hasRole('TECHNICIAN') ? 'Especialista Técnico' : 'Solicitante';

  // Inyectar estructura del Shell
  const appContainer = document.getElementById('app') || document.body;

  // Insertar Sidebar
  const sidebarHtml = `
    <aside class="fixed left-0 top-0 h-full w-64 bg-surface-container-low/80 backdrop-blur-xl z-50 flex flex-col justify-between py-6 px-4 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-slate-200/60">
      <div class="flex flex-col gap-6">
        <!-- Brand Logo -->
        <div class="flex items-center gap-3 px-2">
          ${LOGO_ICON}
          <div class="flex flex-col">
            <span class="font-bold text-slate-900 tracking-tight text-lg leading-tight">TechNova</span>
            <span class="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">IT Helpdesk</span>
          </div>
        </div>

        <!-- Navigation Links -->
        <nav class="flex flex-col gap-1.5" id="sidebar-nav">
          <a href="dashboard.html" data-page="dashboard" class="nav-item flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${activePage === 'dashboard' ? 'bg-primary-container text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] font-semibold' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}">
            <span class="material-symbols-outlined text-[20px]">space_dashboard</span>
            <span>Panel Principal</span>
          </a>

          <a href="tickets.html" data-page="tickets" class="nav-item flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${activePage === 'tickets' || activePage === 'ticket-detail' ? 'bg-primary-container text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] font-semibold' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}">
            <span class="material-symbols-outlined text-[20px]">confirmation_number</span>
            <span>Tickets</span>
          </a>

          ${isAdmin ? `
            <a href="admin.html" data-page="admin" class="nav-item flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${activePage === 'admin' ? 'bg-primary-container text-white shadow-[0_4px_12px_rgba(79,70,229,0.25)] font-semibold' : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'}">
              <span class="material-symbols-outlined text-[20px]">insights</span>
              <span>Reportes y Métricas</span>
            </a>
          ` : ''}
        </nav>
      </div>

      <!-- User footer / Logout -->
      <div class="flex flex-col gap-2 pt-4 border-t border-slate-200/60 px-2">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
              ${esc(userInitials)}
            </div>
            <div class="flex flex-col min-w-0">
              <span class="text-xs font-bold text-slate-800 truncate">${esc(userDisplayName)}</span>
              <span class="text-[10px] text-slate-500 font-medium">${esc(userRoleLabel)}</span>
            </div>
          </div>
          <button id="btn-logout" title="Cerrar sesión" class="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors">
            <span class="material-symbols-outlined text-[18px]">logout</span>
          </button>
        </div>
      </div>
    </aside>
  `;

  // Insertar Topbar
  const headerHtml = `
    <header class="fixed top-0 left-64 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      <div class="h-16 w-full px-8 flex items-center justify-between gap-6">
        <div class="flex-1 max-w-lg">
          <div class="relative flex items-center">
            <span class="material-symbols-outlined absolute left-3 text-slate-400 text-[20px] pointer-events-none">search</span>
            <input id="global-search" class="w-full pl-10 pr-4 py-2 bg-slate-100/70 text-slate-800 placeholder:text-slate-400 text-sm rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-container outline-none transition-all" placeholder="Buscar por código (TK-XXXX) o título..." type="search">
          </div>
        </div>

        <div class="flex items-center gap-4">
          <div class="flex items-center gap-2 bg-slate-100/70 px-3 py-1.5 rounded-xl border border-slate-200/40">
            <span class="material-symbols-outlined text-slate-500 text-[18px]">badge</span>
            <span class="text-xs font-semibold text-slate-700">${esc(userRoleLabel)}</span>
          </div>

          <div class="h-6 w-px bg-slate-200"></div>

          <div class="flex items-center gap-3">
            <div class="flex flex-col text-right">
              <span class="text-xs font-bold text-slate-800 leading-tight">${esc(userDisplayName)}</span>
              <span class="text-[11px] text-slate-500">${esc(user?.email || '')}</span>
            </div>
            <div class="w-8 h-8 rounded-full bg-primary-container text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-200">
              ${esc(userInitials)}
            </div>
          </div>
        </div>
      </div>
    </header>
  `;

  // Renderizar envoltorios
  const existingAside = document.querySelector('aside');
  if (existingAside) existingAside.remove();
  const existingHeader = document.querySelector('header');
  if (existingHeader) existingHeader.remove();

  document.body.insertAdjacentHTML('afterbegin', sidebarHtml + headerHtml);

  // Escuchar logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    if (confirm('¿Desea cerrar la sesión actual de TechNova Helpdesk?')) {
      clearSession();
      window.location.replace('index.html');
    }
  });

  // Retornar contenedor principal
  let mainContent = document.querySelector('main');
  if (!mainContent) {
    mainContent = document.createElement('main');
    mainContent.className = 'w-full pl-64 pt-16 min-h-screen';
    document.body.appendChild(mainContent);
  }
  return mainContent;
}
