/**
 * TechNova IT Helpdesk - Lumina Admin Reports & Metrics Controller
 * Visualiza el análisis consolidado, métricas SLA, MTTR y carga de trabajo técnica.
 */
import { get } from '../api.js';
import { mountShell } from '../layout.js';
import { hasRole } from '../session.js';
import { esc, emptyStateHtml, toast } from '../ui.js';

await mountShell('admin', 'Reportes y Métricas TI');

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('admin-view-container');

  // Control estricto de acceso RBAC
  if (!hasRole('ADMIN')) {
    if (container) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto py-16 text-center space-y-4">
          ${emptyStateHtml(
            'Acceso Restringido',
            'Este módulo analítico es exclusivo para usuarios con rol de Administrador TI.',
            'admin_panel_settings'
          )}
          <div class="pt-4">
            <a href="dashboard.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md hover:bg-primary-container transition-all">
              <span class="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>Regresar al Panel Principal</span>
            </a>
          </div>
        </div>
      `;
    }
    return;
  }

  try {
    const [metrics, technicians] = await Promise.all([
      get('/api/admin/dashboard'),
      get('/api/users/technicians').catch(() => []),
    ]);

    renderKpis(metrics);
    renderStateDistribution(metrics);
    renderCategoryDistribution(metrics);
    renderTechnicianWorkload(metrics, technicians || []);
  } catch (err) {
    console.error('Error cargando métricas ejecutivas:', err);
    toast('No se pudieron obtener las métricas del servidor.', 'error');
    if (container) {
      container.innerHTML = `
        <div class="max-w-xl mx-auto py-16 text-center space-y-4">
          ${emptyStateHtml('Error al cargar panel analítico', err.message, 'warning')}
        </div>
      `;
    }
  }

  function renderKpis(m) {
    const kpisContainer = document.getElementById('admin-kpis');
    if (!kpisContainer || !m) return;

    const total = m.totalTickets || 0;
    const slaPct = m.slaCompliancePercentage !== undefined ? `${m.slaCompliancePercentage.toFixed(1)}%` : '0.0%';
    const mttr = m.averageResolutionTimeHours !== undefined ? `${m.averageResolutionTimeHours.toFixed(1)} hrs` : '0.0 hrs';
    const breached = m.slaBreachedCount || 0;
    const compliant = m.slaCompliantCount || 0;

    kpisContainer.innerHTML = `
      <!-- Card 1: Total Incidencias -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Incidencias</span>
            <span class="text-3xl font-bold text-slate-800 tracking-tight">${total}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">dataset</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Registradas históricamente</span>
          <span class="text-primary font-semibold">100%</span>
        </div>
      </div>

      <!-- Card 2: Cumplimiento SLA -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cumplimiento SLA</span>
            <span class="text-3xl font-bold text-slate-800 tracking-tight text-emerald-600">${slaPct}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">verified</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>${compliant} resueltos a tiempo</span>
          <span class="text-emerald-600 font-semibold">Garantía</span>
        </div>
      </div>

      <!-- Card 3: Tiempo Medio MTTR -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tiempo Medio (MTTR)</span>
            <span class="text-3xl font-bold text-slate-800 tracking-tight text-indigo-600">${mttr}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">speed</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Promedio hasta resolución</span>
          <span class="text-indigo-600 font-semibold">Velocidad</span>
        </div>
      </div>

      <!-- Card 4: Casos Fuera de Plazo -->
      <div class="bg-white rounded-2xl p-5 border border-slate-200/70 shadow-sm flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div class="flex flex-col gap-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Fuera de Plazo</span>
            <span class="text-3xl font-bold ${breached > 0 ? 'text-rose-600' : 'text-slate-800'} tracking-tight">${breached}</span>
          </div>
          <div class="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <span class="material-symbols-outlined text-[20px]">warning</span>
          </div>
        </div>
        <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>SLA excedido o en riesgo</span>
          <span class="text-rose-600 font-semibold">Atención</span>
        </div>
      </div>
    `;
  }

  function renderStateDistribution(m) {
    const container = document.getElementById('state-distribution-bars');
    const badge = document.getElementById('admin-total-state-badge');
    if (!container || !m) return;

    const total = m.totalTickets || 1;
    if (badge) badge.textContent = `TOTAL: ${m.totalTickets || 0}`;

    const states = [
      { key: 'ABIERTA', label: 'Abiertas', count: m.openTickets || 0, color: 'bg-blue-600' },
      { key: 'ASIGNADA', label: 'Asignadas', count: m.assignedTickets || 0, color: 'bg-amber-600' },
      { key: 'EN_PROCESO', label: 'En Proceso', count: m.inProgressTickets || 0, color: 'bg-indigo-600' },
      { key: 'RESUELTA', label: 'Resueltas', count: m.resolvedTickets || 0, color: 'bg-emerald-600' },
      { key: 'CERRADA', label: 'Cerradas', count: m.closedTickets || 0, color: 'bg-slate-500' },
    ];

    container.innerHTML = states.map((s) => {
      const pct = Math.round((s.count / total) * 100) || 0;
      return `
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-semibold text-slate-700">${s.label}</span>
            <span class="font-mono text-slate-500">${s.count} (${pct}%)</span>
          </div>
          <div class="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div class="${s.color} h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderCategoryDistribution(m) {
    const container = document.getElementById('category-distribution-container');
    if (!container || !m) return;

    const categories = m.categoryDistribution || [];
    const total = m.totalTickets || 1;

    if (categories.length === 0) {
      container.innerHTML = '<p class="text-xs text-slate-400 italic">No hay datos de distribución por categoría.</p>';
      return;
    }

    container.innerHTML = categories.map((c) => {
      const name = c.categoryName || 'General';
      const count = c.count || 0;
      const pct = Math.round((count / total) * 100) || 0;

      return `
        <div class="p-3 rounded-xl bg-slate-50/80 border border-slate-200/50 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
            <span class="font-semibold text-xs text-slate-800">${esc(name)}</span>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-xs font-bold text-slate-700">${count}</span>
            <span class="text-[11px] text-slate-400 font-mono">(${pct}%)</span>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderTechnicianWorkload(m, technicians) {
    const tbody = document.getElementById('admin-technicians-tbody');
    const badge = document.getElementById('admin-techs-count-badge');
    if (!tbody) return;

    const workloads = m.technicianWorkloads || [];
    const workloadMap = new Map();
    workloads.forEach((w) => workloadMap.set(w.technicianId, w));

    // Consolidar lista con datos de /api/users/technicians
    const list = technicians.map((t) => {
      const w = workloadMap.get(t.id);
      return {
        id: t.id,
        name: `${t.firstName || ''} ${t.lastName || ''}`.trim() || t.email,
        email: t.email,
        activeTickets: w?.activeTickets ?? t.activeTicketsCount ?? 0,
        resolvedTickets: w?.resolvedTickets ?? 0,
      };
    });

    if (badge) badge.textContent = `${list.length} especialistas activos`;

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="p-6 text-center text-xs text-slate-400">
            No hay técnicos registrados en el sistema.
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = list.map((tech) => {
      const initials = (tech.name.split(' ').map((n) => n[0]).join('') || 'T').toUpperCase().slice(0, 2);
      const isHighLoad = tech.activeTickets >= 5;

      return `
        <tr class="hover:bg-slate-50/60 transition-colors">
          <td class="py-3 px-4 whitespace-nowrap">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                ${esc(initials)}
              </div>
              <span class="font-bold text-slate-800">${esc(tech.name)}</span>
            </div>
          </td>
          <td class="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">${esc(tech.email)}</td>
          <td class="py-3 px-4 text-center font-bold whitespace-nowrap">
            <span class="inline-flex items-center px-2 py-0.5 rounded-lg text-xs ${isHighLoad ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'}">
              ${tech.activeTickets}
            </span>
          </td>
          <td class="py-3 px-4 text-center font-bold text-emerald-600 whitespace-nowrap">${tech.resolvedTickets}</td>
          <td class="py-3 px-4 text-right whitespace-nowrap">
            <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              Disponible
            </span>
          </td>
        </tr>
      `;
    }).join('');
  }
});
