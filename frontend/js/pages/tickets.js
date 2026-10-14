/**
 * TechNova IT Helpdesk - Lumina Tickets Controller
 * Manejo de catálogo de incidencias, filtros dinámicos y modal de nueva solicitud.
 */
import { get, post } from '../api.js';
import { mountShell } from '../layout.js';
import { getUser, hasRole } from '../session.js';
import {
  esc, formatDate, statusBadge, priorityBadge,
  skeletonTableRows, emptyStateHtml, openModal, toast
} from '../ui.js';

await mountShell('tickets', 'Gestión de Tickets');

document.addEventListener('DOMContentLoaded', async () => {
  const scopeSubtitle = document.getElementById('tickets-scope-subtitle');
  const filtersForm = document.getElementById('filters-form');
  const filterQ = document.getElementById('filter-q');
  const filterStatus = document.getElementById('filter-status');
  const filterPriority = document.getElementById('filter-priority');
  const filterCategory = document.getElementById('filter-category');
  const btnClearFilters = document.getElementById('btn-clear-filters');
  const tableBody = document.getElementById('tickets-table-body');
  const countLabel = document.getElementById('tickets-count-label');
  const btnOpenCreate = document.getElementById('btn-open-create-modal');

  const isAdmin = hasRole('ADMIN');
  const isTech = hasRole('TECHNICIAN');

  if (scopeSubtitle) {
    scopeSubtitle.textContent = isAdmin
      ? 'Supervisión integral de todas las incidencias registradas en TechNova Solutions.'
      : isTech
      ? 'Incidencias asignadas a su atención técnica y solicitudes registradas.'
      : 'Sus solicitudes de soporte y requerimientos tecnológicos reportados.';
  }

  let tickets = [];
  let categories = [];
  let priorities = [];

  // 1. Cargar catálogos auxiliares y poblar selects
  await loadCatalogs();

  // 2. Cargar tickets iniciales
  await loadTickets();

  // 3. Revisar si la URL solicita abrir el modal de nuevo ticket (?new=1)
  if (new URLSearchParams(window.location.search).get('new') === '1') {
    openCreateTicketModal();
  }

  // Event Listeners de Filtros
  filterStatus?.addEventListener('change', () => filterAndRender());
  filterPriority?.addEventListener('change', () => filterAndRender());
  filterCategory?.addEventListener('change', () => filterAndRender());
  filterQ?.addEventListener('input', () => filterAndRender());

  btnClearFilters?.addEventListener('click', () => {
    if (filtersForm) filtersForm.reset();
    filterAndRender();
  });

  btnOpenCreate?.addEventListener('click', openCreateTicketModal);

  async function loadCatalogs() {
    try {
      const [cats, pris] = await Promise.all([
        get('/api/categories').catch(() => []),
        get('/api/priorities').catch(() => []),
      ]);

      categories = cats || [];
      priorities = pris || [];

      if (filterCategory) {
        categories.forEach((c) => {
          const opt = document.createElement('option');
          opt.value = c.id;
          opt.textContent = c.name;
          filterCategory.appendChild(opt);
        });
      }

      if (filterPriority) {
        priorities.forEach((p) => {
          const opt = document.createElement('option');
          opt.value = p.id;
          opt.textContent = `${p.name} (${p.slaHours}h)`;
          filterPriority.appendChild(opt);
        });
      }
    } catch (e) {
      console.warn('Error precargando catálogos:', e);
    }
  }

  async function loadTickets() {
    if (tableBody) tableBody.innerHTML = skeletonTableRows(9, 6);
    try {
      tickets = (await get('/api/tickets')) || [];
      filterAndRender();
    } catch (err) {
      console.error('Error cargando tickets:', err);
      if (tableBody) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="9" class="p-6">
              ${emptyStateHtml('No se pudieron cargar los tickets', err.message, 'error')}
            </td>
          </tr>
        `;
      }
      if (countLabel) countLabel.textContent = 'Error de conexión';
      toast('No se pudieron obtener los tickets del servidor.', 'error');
    }
  }

  function filterAndRender() {
    const q = (filterQ?.value || '').toLowerCase().trim();
    const st = filterStatus?.value || '';
    const prId = filterPriority?.value ? Number(filterPriority.value) : null;
    const catId = filterCategory?.value ? Number(filterCategory.value) : null;

    let result = tickets.filter((t) => {
      if (st && (t.statusName || '').toUpperCase() !== st.toUpperCase()) return false;
      if (prId && t.priorityId !== prId) return false;
      if (catId && t.categoryId !== catId) return false;

      if (q) {
        const code = (t.code || `#${t.id}`).toLowerCase();
        const title = (t.title || '').toLowerCase();
        const requester = (t.requesterName || '').toLowerCase();
        const tech = (t.assignedTechnicianName || '').toLowerCase();
        if (!code.includes(q) && !title.includes(q) && !requester.includes(q) && !tech.includes(q)) {
          return false;
        }
      }
      return true;
    });

    renderTable(result);
  }

  function renderTable(list) {
    if (!tableBody) return;

    if (!list || list.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="9" class="p-8">
            ${emptyStateHtml('No se encontraron tickets', 'Intente modificando los criterios de búsqueda o limpiando los filtros.', 'search_off')}
          </td>
        </tr>
      `;
      if (countLabel) countLabel.textContent = '0 ticket(s) encontrado(s)';
      return;
    }

    if (countLabel) {
      countLabel.textContent = `${list.length} ticket(s) encontrado(s)`;
    }

    tableBody.innerHTML = list.map((t) => {
      const code = t.code || `#${t.id}`;
      const tech = t.assignedTechnicianName
        ? esc(t.assignedTechnicianName)
        : '<span class="text-slate-400 italic">Sin asignar</span>';
      const dueDate = t.dueDate ? esc(formatDate(t.dueDate)) : '-';
      const updated = esc(formatDate(t.updatedAt || t.createdAt));

      return `
        <tr class="hover:bg-slate-50/70 transition-colors cursor-pointer group" onclick="window.location.href='ticket-detail.html?id=${t.id}'">
          <td class="py-4 px-4 font-bold text-primary whitespace-nowrap">${esc(code)}</td>
          <td class="py-4 px-4 font-semibold text-slate-800 max-w-xs group-hover:text-primary transition-colors">${esc(t.title)}</td>
          <td class="py-4 px-4 text-slate-600 whitespace-nowrap">${esc(t.categoryName || 'General')}</td>
          <td class="py-4 px-4 whitespace-nowrap">${priorityBadge(t.priorityName)}</td>
          <td class="py-4 px-4 whitespace-nowrap">${statusBadge(t.statusName)}</td>
          <td class="py-4 px-4 text-slate-700 whitespace-nowrap font-medium">${esc(t.requesterName || '-')}</td>
          <td class="py-4 px-4 whitespace-nowrap">${tech}</td>
          <td class="py-4 px-4 text-slate-600 whitespace-nowrap font-mono text-[11px]">${dueDate}</td>
          <td class="py-4 px-4 text-slate-500 whitespace-nowrap font-mono text-[11px]">${updated}</td>
        </tr>
      `;
    }).join('');
  }

  function openCreateTicketModal() {
    const catOptions = categories.map((c) => `<option value="${c.id}">${esc(c.name)}</option>`).join('');
    const priOptions = priorities.map((p) => `<option value="${p.id}">${esc(p.name)} — SLA: ${p.slaHours} hora(s)</option>`).join('');

    const modalBody = `
      <form id="create-ticket-form" class="space-y-4" novalidate>
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="modal-title">
            Título del Incidente *
          </label>
          <input id="modal-title" name="title" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all" placeholder="Resumen conciso del problema técnico..." required maxlength="200">
        </div>

        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="modal-description">
            Descripción Detallada *
          </label>
          <textarea id="modal-description" name="description" rows="4" class="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all resize-y" placeholder="Explique la falla, mensajes de error, equipo afectado y pasos previos realizados..." required maxlength="4000"></textarea>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1" for="modal-category">
              Categoría *
            </label>
            <select id="modal-category" name="categoryId" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white cursor-pointer transition-all">
              ${catOptions || '<option value="1">HARDWARE</option><option value="2">SOFTWARE</option>'}
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1" for="modal-priority">
              Prioridad *
            </label>
            <select id="modal-priority" name="priorityId" class="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white cursor-pointer transition-all">
              ${priOptions || '<option value="2">MEDIA (8h)</option>'}
            </select>
          </div>
        </div>

        <div class="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-[11px] text-blue-800 flex items-center gap-2">
          <span class="material-symbols-outlined text-sm">schedule</span>
          <span>El tiempo máximo de atención (SLA) se calculará automáticamente al crear la solicitud.</span>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button type="button" data-modal-close class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">
            Cancelar
          </button>
          <button id="modal-submit-btn" type="submit" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined text-[16px]">send</span>
            <span>Registrar Solicitud</span>
          </button>
        </div>
      </form>
    `;

    const modal = openModal('Nueva Solicitud de Soporte', modalBody);
    const form = modal.backdrop.querySelector('#create-ticket-form');
    const submitBtn = modal.backdrop.querySelector('#modal-submit-btn');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = (form.querySelector('#modal-title')?.value || '').trim();
      const description = (form.querySelector('#modal-description')?.value || '').trim();
      const categoryId = Number(form.querySelector('#modal-category')?.value);
      const priorityId = Number(form.querySelector('#modal-priority')?.value);

      if (!title) {
        toast('El título es obligatorio.', 'warning');
        return;
      }
      if (!description) {
        toast('La descripción detallada es obligatoria.', 'warning');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">sync</span> Enviando...';
      }

      try {
        const created = await post('/api/tickets', {
          title,
          description,
          categoryId,
          priorityId,
        });

        toast(`Incidencia ${created.code || 'creada'} registrada con éxito.`, 'success');
        modal.close();
        await loadTickets();
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Registrar Solicitud</span>';
        }
        toast(err.message || 'Error al crear la solicitud.', 'error');
      }
    });
  }
});
