/**
 * TechNova IT Helpdesk - Lumina Login Controller
 * Gestiona el formulario de acceso, autenticación con JWT y validaciones.
 */
import { post } from '../api.js';
import { isLoggedIn, saveSession } from '../session.js';
import { $, esc, toast } from '../ui.js';

// Si ya tiene sesión activa, redirigir al panel
if (isLoggedIn()) {
  window.location.replace('dashboard.html');
}

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  const emailInput = document.getElementById('work-email');
  const passwordInput = document.getElementById('work-password');
  const togglePasswordBtn = document.getElementById('toggle-password-btn');
  const errorBanner = document.getElementById('error-banner');
  const errorMessage = document.getElementById('error-message');
  const infoBanner = document.getElementById('info-banner');
  const infoMessage = document.getElementById('info-message');
  const submitBtn = document.getElementById('submit-btn');

  // Evaluar parámetros de la URL (?expired=1 o ?logged_out=1)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('expired')) {
    showInfo('Su sesión ha expirado por inactividad. Por favor inicie sesión nuevamente.');
  } else if (urlParams.has('logged_out')) {
    showInfo('Ha cerrado su sesión correctamente.');
  }

  // Toggler de visibilidad de contraseña
  togglePasswordBtn?.addEventListener('click', () => {
    const isPassword = passwordInput.type === 'password';
    passwordInput.type = isPassword ? 'text' : 'password';
    const icon = togglePasswordBtn.querySelector('.material-symbols-outlined');
    if (icon) {
      icon.textContent = isPassword ? 'visibility_off' : 'visibility';
    }
  });

  // Envío del formulario
  loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideAlerts();

    const email = (emailInput?.value || '').trim();
    const password = passwordInput?.value || '';

    // Validaciones del cliente
    if (!email) {
      showError('Por favor ingrese su correo electrónico institucional.');
      emailInput?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showError('El formato de correo no es válido. Ejemplo: usuario@technova.com');
      emailInput?.focus();
      return;
    }

    if (!password) {
      showError('Por favor ingrese su contraseña corporativa.');
      passwordInput?.focus();
      return;
    }

    // Estado visual de carga
    setLoading(true);

    try {
      const response = await post('/api/auth/login', { email, password }, { auth: false });
      saveSession(response);
      toast('Autenticación exitosa. Bienvenido al sistema.', 'success');
      window.location.replace('dashboard.html');
    } catch (err) {
      setLoading(false);
      const msg = err.status === 401
        ? 'Credenciales inválidas. Verifique su correo o contraseña.'
        : err.message || 'Error al comunicarse con el servidor de autenticación.';
      showError(msg);
    }
  });

  function showError(msg) {
    if (errorBanner && errorMessage) {
      errorMessage.textContent = msg;
      errorBanner.classList.remove('hidden');
    } else {
      toast(msg, 'error');
    }
  }

  function showInfo(msg) {
    if (infoBanner && infoMessage) {
      infoMessage.textContent = msg;
      infoBanner.classList.remove('hidden');
    }
  }

  function hideAlerts() {
    errorBanner?.classList.add('hidden');
    infoBanner?.classList.add('hidden');
  }

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    if (loading) {
      submitBtn.innerHTML = `
        <span class="inline-block animate-spin mr-2 material-symbols-outlined text-lg">sync</span>
        <span>Verificando credenciales...</span>
      `;
    } else {
      submitBtn.innerHTML = `
        <span>Iniciar Sesión</span>
        <span class="material-symbols-outlined text-lg">arrow_forward</span>
      `;
    }
  }
});
