/**
 * TechNova IT Helpdesk - Lumina Dashboard Controller
 * Renderiza métricas operativas (SLA, MTTR, distribución) e incidencias recientes.
 */
import { get } from '../api.js';
import { mountShell } from '../layout.js';
import { getUser, hasRole } from '../session.js';
import { esc, formatDate, statusBadge, priorityBadge, skeletonTableRows, emptyStateHtml, toast } from '../ui.js';

await mountShell('dashboard', 'Panel Principal');

document.addEventListener('DOMContentLoaded', async () => {
  const user = getUser();
  const isAdmin = hasRole('ADMIN');
  const userFirst = user?.firstName || user?.fullName?.split(' ')[0] || 'Usuario';

  // Saludo dinámico según hora local
  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Buenos días' : currentHour < 18 ? 'Buenas tardes' : 'Buenas noches';
  const greetingTitle = document.getElementById('greeting-title');
  const greetingSubtitle = document.getElementById('greeting-subtitle');
  const currentDateStr = document.getElementById('current-date-str');

  if (greetingTitle) greetingTitle.textContent = `${greeting}, ${userFirst}`;
  if (greetingSubtitle) {
    greetingSubtitle.textContent = isAdmin
      ? 'Visión analítica consolidada y gestión operativa de TechNova Solutions.'
      : 'Resumen del estado y progreso de sus solicitudes de soporte técnico.';
  }
  if (currentDateStr) {
    currentDateStr.textContent = new Intl.DateTimeFormat('es-CO', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());
  }

  // Redirigir botón de nuevo ticket
  document.getElementById('btn-quick-new-ticket')?.addEventListener('click', () => {
    window.location.href = 'tickets.html?new=1';
  });

  const kpisContainer = document.getElementById('kpis-container');
  const ticketsTbody = document.getElementById('dashboard-tickets-tbody');
  const ticketsCountSpan = document.getElementById('dashboard-tickets-count');
  const searchInput = document.getElementById('dashboard-search');

  if (ticketsTbody) ticketsTbody.innerHTML = skeletonTableRows(9, 5);

  let ticketsList = [];

  try {
    let metrics = null;

    if (isAdmin) {
      const [dashMetrics, ticketsRes] = await Promise.all([
        get('/api/admin/dashboard').catch(() => null),
        get('/api/tickets').catch(() => []),
      ]);
      metrics = dashMetrics;
      ticketsList = ticketsRes || [];
    } else {
      ticketsList = (await get('/api/tickets')) || [];
      metrics = calculateClientMetrics(ticketsList);
    }

    renderKpis(metrics, isAdmin);
    renderRecentTickets(ticketsList);

    // Filtro reactivo en tabla
    searchInput?.addEventListener('input', (e) => {
      const q = (e.target.value || '').toLowerCase().trim();
      if (!q) {
        renderRecentTickets(ticketsList);
        return;
      }
      const filtered = ticketsList.filter((t) => {
        const code = (t.code || `#${t.id}`).toLowerCase();
        const title = (t.title || '').toLowerCase();
        const requester = (t.requesterName || '').toLowerCase();
        const tech = (t.assignedTechnicianName || '').toLowerCase();
        return code.includes(q) || title.includes(q) || requester.includes(q) || tech.includes(q);
      });
      renderRecentTickets(filtered);
    });

  } catch (err) {
    console.error('Error cargando dashboard:', err);
    toast('No se pudieron cargar todos los datos del panel.', 'error');
    if (kpisContainer) {
      kpisContainer.innerHTML = `
        <div class="col-span-full">
          ${emptyStateHtml('Error al cargar métricas', err.message, 'warning')}
        </div>
      `;
    }
  }

  function calculateClientMetrics(tickets) {
    const total = tickets.length;
    const open = tickets.filter((t) => t.statusName === 'ABIERTA').length;
    const inProcess = tickets.filter((t) => t.statusName === 'EN_PROCESO' || t.statusName === 'ASIGNADA').length;
    const resolved = tickets.filter((t) => t.statusName === 'RESUELTA' || t.statusName === 'CERRADA').length;

    return {
      totalTickets: total,
      openTickets: open,
      inProgressTickets: inProcess,
      resolvedTickets: resolved,
      averageResolutionTimeHours: null,
      slaCompliancePercentage: null,
    };
  }

  function renderKpis(m, adminUser) {
    if (!kpisContainer) return;
    if (!m) {
      kpisContainer.innerHTML = '';
      return;
    }

    const total = m.totalTickets || 0;
    const open = m.openTickets || 0;
    const inProgress = m.inProgressTickets || m.assignedTickets || 0;
    const resolved = m.resolvedTickets || 0;

    const slaPct = adminUser && m.slaCompliancePercentage !== undefined
      ? `${m.slaCompliancePercentage.toFixed(1)}%`
      : 'En meta';

    const mttr = adminUser && m.averageResolutionTimeHours !== undefined
      ? `${m.averageResolutionTimeHours.toFixed(1)} hrs`
      : `${resolved} listos`;

    kpisContainer.innerHTML = `
      <!-- Card 1: Tickets Abiertos -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tickets Abiertos</span>
            <span class="text-3xl font-bold text-slate-800 tracking-tight">${open}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">inbox</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Requieren atención</span>
          <span class="text-blue-600 font-semibold">Pendientes</span>
        </div>
      </div>

      <!-- Card 2: En Proceso / Asignadas -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">En Atención Activa</span>
            <span class="text-3xl font-bold text-slate-800 tracking-tight">${inProgress}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">engineering</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Técnicos trabajando</span>
          <span class="text-indigo-600 font-semibold">En curso</span>
        </div>
      </div>

      <!-- Card 3: Cumplimiento SLA -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cumplimiento SLA</span>
            <span class="text-3xl font-bold text-slate-800 tracking-tight">${slaPct}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>${m.slaCompliantCount ? `${m.slaCompliantCount} en plazo` : 'Monitoreo de tiempos'}</span>
          <span class="text-emerald-600 font-semibold">Garantizado</span>
        </div>
      </div>

      <!-- Card 4: Total Registradas / MTTR -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiempo Medio (MTTR)</span>
            <span class="text-3xl font-bold text-slate-800 tracking-tight">${mttr}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">timer</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total: ${total} incidencias</span>
          <span class="text-amber-600 font-semibold">Promedio</span>
        </div>
      </div>
    `;
  }

  function renderRecentTickets(tickets) {
    if (!ticketsTbody) return;

    if (!tickets || tickets.length === 0) {
      ticketsTbody.innerHTML = `
        <tr>
          <td colspan="9" class="p-6">
            ${emptyStateHtml('No hay incidencias para mostrar', 'No se encontraron tickets con los criterios seleccionados.')}
          </td>
        </tr>
      `;
      if (ticketsCountSpan) ticketsCountSpan.textContent = '0 incidencias';
      return;
    }

    if (ticketsCountSpan) {
      ticketsCountSpan.textContent = `${tickets.length} incidencia(s) disponible(s)`;
    }

    // Mostrar los primeros 8 ordenados por fecha descendente
    const displayList = tickets.slice(0, 8);

    ticketsTbody.innerHTML = displayList.map((t) => {
      const code = t.code || `#${t.id}`;
      const techName = t.assignedTechnicianName
        ? esc(t.assignedTechnicianName)
        : '<span class="text-slate-400 italic">Sin asignar</span>';
      const dueDate = t.dueDate ? esc(formatDate(t.dueDate)) : '-';

      return `
        <tr class="hover:bg-slate-50/70 transition-colors cursor-pointer" onclick="window.location.href='ticket-detail.html?id=${t.id}'">
          <td class="py-3 px-4 font-bold text-primary whitespace-nowrap">${esc(code)}</td>
          <td class="py-3 px-4 font-semibold text-slate-800 max-w-xs truncate" title="${esc(t.title)}">${esc(t.title)}</td>
          <td class="py-3 px-4 text-slate-600 whitespace-nowrap">${esc(t.categoryName || 'General')}</td>
          <td class="py-3 px-4 whitespace-nowrap">${priorityBadge(t.priorityName)}</td>
          <td class="py-3 px-4 whitespace-nowrap">${statusBadge(t.statusName)}</td>
          <td class="py-3 px-4 text-slate-700 whitespace-nowrap">${esc(t.requesterName || 'Usuario')}</td>
          <td class="py-3 px-4 whitespace-nowrap">${techName}</td>
          <td class="py-3 px-4 text-slate-600 whitespace-nowrap">${dueDate}</td>
          <td class="py-3 px-4 text-right whitespace-nowrap" onclick="event.stopPropagation()">
            <a href="ticket-detail.html?id=${t.id}" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-primary hover:bg-primary/10 font-semibold transition-colors">
              <span>Ver</span>
              <span class="material-symbols-outlined text-[16px]">chevron_right</span>
            </a>
          </td>
        </tr>
      `;
    }).join('');
  }
});
