/**
 * TechNova IT Helpdesk - Inicializador Global y Navegación
 */

import { requireAuth } from './session.js';
import { syncUserInterface, showToast } from './ui.js';

document.addEventListener('DOMContentLoaded', () => {
  // Validar autenticación obligatoria para páginas internas
  const path = window.location.pathname.split('/').pop() || 'index.html';
  if (path !== 'index.html' && path !== '') {
    if (!requireAuth()) return;
  }

  // Sincronizar estado visual de navegación
  syncActiveNavigation();

  // Sincronizar datos del usuario autenticado en la interfaz
  syncUserInterface();

  // Notificaciones no intrusivas
  setupNotifications();
});

function syncActiveNavigation() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.sidebar-nav .sidebar-link');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'dashboard.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function setupNotifications() {
  const notifBtn = document.getElementById('topbarNotifBtn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      showToast('No hay alertas críticas pendientes en el sistema.', 'info');
      const badge = notifBtn.querySelector('.topbar-badge');
      if (badge) badge.style.display = 'none';
    });
  }
}
