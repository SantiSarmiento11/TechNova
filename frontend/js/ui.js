// TechNova IT Helpdesk - Utilidades visuales y componentes UI
export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

/** Escapa caracteres HTML para prevenir inyecciones XSS */
export function esc(value) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

// Estados del ciclo de vida del Ticket (RN-02)
export const STATUS_LABELS = {
  ABIERTA: 'Abierta',
  ASIGNADA: 'Asignada',
  EN_PROCESO: 'En Proceso',
  RESUELTA: 'Resuelta',
  CERRADA: 'Cerrada',
  // Compatibilidad alternativa
  OPEN: 'Abierta',
  ASSIGNED: 'Asignada',
  IN_PROGRESS: 'En Proceso',
  RESOLVED: 'Resuelta',
  CLOSED: 'Cerrada',
};

// Prioridades y SLAs (RN-03)
export const PRIORITY_LABELS = {
  BAJA: 'Baja',
  MEDIA: 'Media',
  ALTA: 'Alta',
  CRITICA: 'Crítica',
  LOW: 'Baja',
  MEDIUM: 'Media',
  HIGH: 'Alta',
  CRITICAL: 'Crítica',
};

// Categorías del catálogo
export const CATEGORY_LABELS = {
  HARDWARE: 'Hardware',
  SOFTWARE: 'Software',
  REDES: 'Redes',
  ACCESOS: 'Accesos',
  OTROS: 'Otros',
};

export const STATUS_FLOW = ['ABIERTA', 'ASIGNADA', 'EN_PROCESO', 'RESUELTA', 'CERRADA'];

export const statusBadge = (s) => `<span class="badge ${esc(s)}">${esc(STATUS_LABELS[s] || s)}</span>`;
export const priorityBadge = (p) => `<span class="badge ${esc(p)}">${esc(PRIORITY_LABELS[p] || p)}</span>`;
export const categoryLabel = (c) => CATEGORY_LABELS[c] || c;

const dateTime = new Intl.DateTimeFormat('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

export const formatDate = (iso) => {
  if (!iso) return '-';
  try {
    return dateTime.format(new Date(iso));
  } catch {
    return String(iso);
  }
};

export function toast(message, type = 'info') {
  let box = $('#toasts');
  if (!box) {
    box = document.createElement('div');
    box.id = 'toasts';
    box.setAttribute('aria-live', 'polite');
    document.body.append(box);
  }
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  box.append(el);
  setTimeout(() => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 260);
  }, type === 'error' ? 6000 : 3500);
}

/** Animación de conteo ascendente */
export function countUp(element, target, duration = 800) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || target === 0) {
    element.textContent = target;
    return;
  }
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    element.textContent = Math.round(target * (1 - (1 - t) ** 3));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/** Animación secuencial en CSS con variable --i */
export function stagger(root, selector) {
  $$(selector, root).forEach((el, i) => el.style.setProperty('--i', i));
}

export const skeletonStats = (count = 6) =>
  `<section class="stats" aria-hidden="true">${'<div class="skeleton stat-sk"></div>'.repeat(count)}</section>`;

export const skeletonRows = (count = 5) =>
  `<div aria-hidden="true">${'<div class="skeleton line"></div>'.repeat(count)}</div>`;

export const loadingHtml = (text = 'Cargando información...') =>
  `<div class="loading" role="status"><span class="spin"></span><span>${esc(text)}</span></div>`;

export const emptyHtml = (title, text = '') =>
  `<div class="empty"><strong>${esc(title)}</strong>${text ? `<span>${esc(text)}</span>` : ''}</div>`;

/** Deshabilita un botón y muestra spinner durante una operación asíncrona */
export async function withBusy(button, task) {
  if (!button) return task();
  const original = button.innerHTML;
  button.disabled = true;
  button.innerHTML = `<span class="spin"></span> ${original}`;
  try {
    return await task();
  } finally {
    button.disabled = false;
    button.innerHTML = original;
  }
}

/** Renderiza errores a nivel de campo */
export function showFieldErrors(form, fieldErrors) {
  $$('.field', form).forEach((f) => f.classList.remove('invalid'));
  $$('.field-error', form).forEach((e) => (e.textContent = ''));
  if (!fieldErrors) return false;
  let any = false;
  for (const [name, message] of Object.entries(fieldErrors)) {
    const input = form.elements[name];
    const field = input?.closest?.('.field');
    if (!field) continue;
    field.classList.add('invalid');
    const slot = $('.field-error', field);
    if (slot) slot.textContent = message;
    any = true;
  }
  return any;
}

export function setFormError(form, message) {
  let box = $('.form-error', form);
  if (!message) {
    box?.remove();
    return;
  }
  if (!box) {
    box = document.createElement('div');
    box.className = 'form-error';
    box.setAttribute('role', 'alert');
    form.prepend(box);
  }
  box.textContent = message;
}

export function openDialog(html) {
  const dialog = document.createElement('dialog');
  dialog.className = 'modal';
  dialog.innerHTML = `<div class="modal-body">${html}</div>`;
  document.body.append(dialog);
  dialog.addEventListener('close', () => dialog.remove());
  dialog.showModal();
  return dialog;
}

export function confirmDialog(title, message, confirmLabel = 'Confirmar', danger = false) {
  return new Promise((resolve) => {
    const dialog = openDialog(`
      <h2>${esc(title)}</h2>
      <p>${esc(message)}</p>
      <div class="form-actions">
        <button type="button" class="btn" data-answer="no">Cancelar</button>
        <button type="button" class="btn ${danger ? 'danger' : 'primary'}" data-answer="yes">${esc(confirmLabel)}</button>
      </div>`);
    let answer = false;
    dialog.addEventListener('click', (e) => {
      const choice = e.target.closest('[data-answer]')?.dataset.answer;
      if (!choice) return;
      answer = choice === 'yes';
      dialog.close();
    });
    dialog.addEventListener('close', () => resolve(answer));
  });
}

export function fieldHtml({ name, label, type = 'text', value = '', hint = '', required = true, autocomplete = 'off' }) {
  return `<div class="field">
    <label for="f-${esc(name)}">${esc(label)}</label>
    <input id="f-${esc(name)}" name="${esc(name)}" type="${esc(type)}" value="${esc(value)}" autocomplete="${esc(autocomplete)}" ${required ? 'required' : ''}>
    ${hint ? `<span class="hint">${esc(hint)}</span>` : ''}
    <span class="field-error"></span>
  </div>`;
}

export function selectHtml({ name, label, options, value = '' }) {
  const items = options.map(([v, text]) =>
    `<option value="${esc(v)}" ${String(v) === String(value) ? 'selected' : ''}>${esc(text)}</option>`).join('');
  return `<div class="field">
    <label for="f-${esc(name)}">${esc(label)}</label>
    <select id="f-${esc(name)}" name="${esc(name)}">${items}</select>
    <span class="field-error"></span>
  </div>`;
}
