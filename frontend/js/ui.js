/**
 * TechNova IT Helpdesk - Lumina Support UI Helpers
 * Funciones de renderizado, sanitización, badges, modales y notificaciones.
 */
import { STATUS_LABELS, PRIORITY_LABELS } from './config.js';

export const $ = (selector, parent = document) => parent.querySelector(selector);
export const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

export function esc(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function formatDate(isoString) {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

/**
 * Renderiza el badge de estado según los tokens de color e iconos de Lumina Support
 */
export function statusBadge(status) {
  const normalized = (status || '').toUpperCase().trim();
  const label = STATUS_LABELS[normalized] || normalized || 'Desconocido';

  const config = {
    ABIERTA: {
      style: 'bg-blue-50 text-blue-700 ring-1 ring-blue-700/20',
      icon: 'radio_button_checked',
    },
    ASIGNADA: {
      style: 'bg-amber-50 text-amber-700 ring-1 ring-amber-700/20',
      icon: 'person_pin',
    },
    EN_PROCESO: {
      style: 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-700/20',
      icon: 'pending',
    },
    RESUELTA: {
      style: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-700/20',
      icon: 'check_circle',
    },
    CERRADA: {
      style: 'bg-slate-100 text-slate-700 ring-1 ring-slate-700/20',
      icon: 'lock',
    },
  };

  const current = config[normalized] || {
    style: 'bg-gray-100 text-gray-700 ring-1 ring-gray-700/20',
    icon: 'help_outline',
  };

  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${current.style}">
    <span class="material-symbols-outlined text-[14px]">${current.icon}</span>
    <span>${esc(label)}</span>
  </span>`;
}

/**
 * Renderiza el badge de prioridad con SLA asociado
 */
export function priorityBadge(priority) {
  const normalized = (priority || '').toUpperCase();
  const label = PRIORITY_LABELS[normalized] || normalized || 'Media';

  const styles = {
    BAJA: 'text-emerald-700 bg-emerald-50 ring-1 ring-emerald-700/20',
    MEDIA: 'text-blue-700 bg-blue-50 ring-1 ring-blue-700/20',
    ALTA: 'text-amber-700 bg-amber-50 ring-1 ring-amber-700/20',
    CRITICA: 'text-rose-700 bg-rose-50 ring-1 ring-rose-700/20 font-bold',
  };

  const styleClass = styles[normalized] || 'text-gray-700 bg-gray-50 ring-1 ring-gray-700/20';

  return `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${styleClass}">
    <span class="w-1.5 h-1.5 rounded-full ${normalized === 'CRITICA' ? 'bg-rose-600 animate-pulse' : 'bg-current'}"></span>
    ${esc(label)}
  </span>`;
}

/**
 * Notificaciones Flotantes (Toasts)
 */
export function toast(message, type = 'info') {
  let container = document.getElementById('lumina-toasts');
  if (!container) {
    container = document.createElement('div');
    container.id = 'lumina-toasts';
    container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none';
    document.body.appendChild(container);
  }

  const el = document.createElement('div');
  const typeStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-900/20',
    error: 'bg-rose-600 text-white shadow-rose-900/20',
    info: 'bg-primary-container text-white shadow-primary-900/20',
    warning: 'bg-amber-600 text-white shadow-amber-900/20',
  };

  el.className = `pointer-events-auto px-4 py-3 rounded-xl shadow-lg font-medium text-sm flex items-center gap-2 transform transition-all duration-300 translate-y-4 opacity-0 ${typeStyles[type] || typeStyles.info}`;
  el.innerHTML = `
    <span class="material-symbols-outlined text-[18px]">
      ${type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info'}
    </span>
    <span>${esc(message)}</span>
  `;

  container.appendChild(el);
  requestAnimationFrame(() => {
    el.classList.remove('translate-y-4', 'opacity-0');
  });

  setTimeout(() => {
    el.classList.add('opacity-0', 'translate-y-2');
    setTimeout(() => el.remove(), 300);
  }, 3500);
}

/**
 * Modal dinámico de diálogo
 */
export function openModal(titleHtml, bodyHtml) {
  const backdrop = document.createElement('div');
  backdrop.className = 'fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity';

  backdrop.innerHTML = `
    <div class="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden transform transition-all p-6 space-y-4">
      <div class="flex items-center justify-between pb-2 border-b border-slate-100">
        <h3 class="font-bold text-lg text-slate-800">${titleHtml}</h3>
        <button type="button" data-modal-close class="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100">
          <span class="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>
      <div class="modal-content">${bodyHtml}</div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const close = () => {
    backdrop.classList.add('opacity-0');
    setTimeout(() => backdrop.remove(), 200);
  };

  backdrop.querySelector('[data-modal-close]')?.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) close();
  });

  return { backdrop, close };
}
