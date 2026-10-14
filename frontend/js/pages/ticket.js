/**
 * TechNova IT Helpdesk - Lumina Ticket Detail Controller
 * Orquesta la máquina de estados, el stepper del ciclo de vida, comentarios y auditoría.
 */
import { get, post, put } from '../api.js';
import { mountShell } from '../layout.js';
import { getUser, hasRole } from '../session.js';
import {
  STATUS_FLOW, STATUS_LABELS,
  esc, formatDate, statusBadge, priorityBadge,
  emptyStateHtml, openModal, toast
} from '../ui.js';

await mountShell('tickets', 'Detalle de Incidencia');

document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const ticketId = Number(urlParams.get('id'));

  if (!ticketId || isNaN(ticketId)) {
    renderError('Identificador inválido', 'No se proporcionó un ID de ticket válido en la URL.');
    return;
  }

  let currentTicket = null;
  let commentsList = [];
  let historyList = [];

  await loadAll();

  async function loadAll() {
    try {
      const [ticketData, commentsData, historyData] = await Promise.all([
        get(`/api/tickets/${ticketId}`),
        get(`/api/tickets/${ticketId}/comments`).catch(() => []),
        get(`/api/tickets/${ticketId}/history`).catch(() => []),
      ]);

      currentTicket = ticketData;
      commentsList = commentsData || [];
      historyList = historyData || [];

      renderHeader();
      renderStepper();
      renderDetails();
      renderLifecycleActions();
      renderComments();
      renderHistory();
    } catch (err) {
      console.error('Error cargando detalle del ticket:', err);
      const title = err.status === 403
        ? 'Acceso Denegado'
        : err.status === 404
        ? 'Incidencia No Encontrada'
        : 'Error al consultar ticket';
      renderError(title, err.message || 'No se pudo cargar la información del ticket solicitado.');
    }
  }

  function renderHeader() {
    const code = currentTicket.code || `#${currentTicket.id}`;
    const codeBadge = document.getElementById('ticket-code-badge');
    const titleDisplay = document.getElementById('ticket-title-display');
    const badgesHeader = document.getElementById('ticket-badges-header');

    if (codeBadge) codeBadge.textContent = code;
    if (titleDisplay) titleDisplay.textContent = currentTicket.title;

    if (badgesHeader) {
      badgesHeader.innerHTML = `
        ${statusBadge(currentTicket.statusName)}
        ${priorityBadge(currentTicket.priorityName)}
      `;
    }
  }

  function renderStepper() {
    const currentStatus = (currentTicket.statusName || '').toUpperCase();
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const validIndex = currentIndex >= 0 ? currentIndex : 0;

    const progressBar = document.getElementById('stepper-progress-bar');
    const stepsContainer = document.getElementById('stepper-steps');

    if (progressBar) {
      const pct = (validIndex / (STATUS_FLOW.length - 1)) * 100;
      progressBar.style.width = `${pct}%`;
    }

    if (stepsContainer) {
      stepsContainer.innerHTML = STATUS_FLOW.map((s, idx) => {
        const isDone = idx < validIndex;
        const isCurrent = idx === validIndex;
        const label = STATUS_LABELS[s] || s;

        let circleClasses = 'bg-slate-100 text-slate-400 border border-slate-200';
        let labelClasses = 'text-slate-400 font-medium';

        if (isDone) {
          circleClasses = 'bg-primary-container text-white shadow-sm ring-2 ring-primary/20';
          labelClasses = 'text-primary font-bold';
        } else if (isCurrent) {
          circleClasses = 'bg-white text-primary ring-4 ring-primary-fixed shadow-md border-2 border-primary';
          labelClasses = 'text-slate-900 font-bold';
        }

        return `
          <div class="flex flex-col items-center gap-1.5 z-10">
            <div class="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${circleClasses}">
              ${isDone ? '<span class="material-symbols-outlined text-[16px]">check</span>' : idx + 1}
            </div>
            <span class="text-[11px] whitespace-nowrap ${labelClasses}">${esc(label)}</span>
          </div>
        `;
      }).join('');
    }
  }

  function renderDetails() {
    const descDisplay = document.getElementById('ticket-description-display');
    if (descDisplay) descDisplay.textContent = currentTicket.description || 'Sin descripción adicional.';

    const metaCode = document.getElementById('meta-code');
    const metaReqName = document.getElementById('meta-requester-name');
    const metaReqEmail = document.getElementById('meta-requester-email');
    const metaTechName = document.getElementById('meta-tech-name');
    const metaTechEmail = document.getElementById('meta-tech-email');
    const metaCat = document.getElementById('meta-category');
    const metaPri = document.getElementById('meta-priority');
    const metaDue = document.getElementById('meta-due-date');
    const metaCreated = document.getElementById('meta-created-at');
    const metaUpdated = document.getElementById('meta-updated-at');

    if (metaCode) metaCode.textContent = currentTicket.code || `#${currentTicket.id}`;
    if (metaReqName) metaReqName.textContent = currentTicket.requesterName || 'Usuario';
    if (metaReqEmail) metaReqEmail.textContent = currentTicket.requesterEmail || '';

    if (metaTechName) {
      if (currentTicket.assignedTechnicianName) {
        metaTechName.textContent = currentTicket.assignedTechnicianName;
        metaTechName.className = 'block font-semibold text-slate-800';
      } else {
        metaTechName.textContent = 'Pendiente de asignación';
        metaTechName.className = 'block font-semibold text-slate-400 italic';
      }
    }
    if (metaTechEmail) metaTechEmail.textContent = currentTicket.assignedTechnicianEmail || '';

    if (metaCat) metaCat.textContent = currentTicket.categoryName || 'General';
    if (metaPri) metaPri.innerHTML = priorityBadge(currentTicket.priorityName);
    if (metaDue) metaDue.textContent = currentTicket.dueDate ? formatDate(currentTicket.dueDate) : '-';
    if (metaCreated) metaCreated.textContent = formatDate(currentTicket.createdAt);
    if (metaUpdated) metaUpdated.textContent = formatDate(currentTicket.updatedAt || currentTicket.createdAt);
  }

  function renderLifecycleActions() {
    const actionsPanel = document.getElementById('lifecycle-actions-panel');
    if (!actionsPanel) return;

    const user = getUser();
    const isAdmin = hasRole('ADMIN');
    const isTech = hasRole('TECHNICIAN');
    const isAssignedTech = currentTicket.assignedTechnicianId === user?.id;
    const isRequester = currentTicket.requesterId === user?.id;
    const status = (currentTicket.statusName || '').toUpperCase();

    const buttons = [];

    // 1. Asignar especialista (ADMIN en ABIERTA o ASIGNADA)
    if (isAdmin && (status === 'ABIERTA' || status === 'ASIGNADA')) {
      const btnLabel = currentTicket.assignedTechnicianId ? 'Reasignar Especialista' : 'Asignar Especialista (ADMIN)';
      buttons.push(`
        <button id="act-assign" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]">
          <span class="material-symbols-outlined text-[18px]">person_add</span>
          <span>${btnLabel}</span>
        </button>
      `);
    }

    // 2. Iniciar Atención (ASIGNADA -> EN_PROCESO)
    if (status === 'ASIGNADA' && (isAssignedTech || isAdmin)) {
      buttons.push(`
        <button id="act-start" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]">
          <span class="material-symbols-outlined text-[18px]">play_arrow</span>
          <span>Iniciar Atención Técnica</span>
        </button>
      `);
    }

    // 3. Resolver Incidencia (EN_PROCESO -> RESUELTA)
    if (status === 'EN_PROCESO' && (isAssignedTech || isAdmin)) {
      buttons.push(`
        <button id="act-resolve" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]">
          <span class="material-symbols-outlined text-[18px]">check_circle</span>
          <span>Marcar Incidencia Resuelta</span>
        </button>
      `);
    }

    // 4. Confirmar Conformidad y Cerrar (RESUELTA -> CERRADA)
    if (status === 'RESUELTA' && (isRequester || isAdmin)) {
      buttons.push(`
        <button id="act-close" class="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs shadow-md transition-all active:scale-[0.98]">
          <span class="material-symbols-outlined text-[18px]">lock</span>
          <span>Dar Conformidad y Cerrar Ticket</span>
        </button>
      `);
    }

    if (buttons.length === 0) {
      const message = status === 'CERRADA'
        ? 'Incidencia cerrada formalmente. El ciclo de vida ha concluido y el estado es inmutable.'
        : 'No hay acciones disponibles para su perfil en el estado actual.';
      actionsPanel.innerHTML = `
        <div class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 leading-relaxed">
          ${message}
        </div>
      `;
      return;
    }

    actionsPanel.innerHTML = buttons.join('');

    // Asignar listeners
    document.getElementById('act-assign')?.addEventListener('click', openAssignModal);
    document.getElementById('act-start')?.addEventListener('click', () => updateStatus('EN_PROCESO'));
    document.getElementById('act-resolve')?.addEventListener('click', () => updateStatus('RESUELTA'));
    document.getElementById('act-close')?.addEventListener('click', () => updateStatus('CERRADA'));
  }

  async function updateStatus(nextStatus) {
    if (!confirm(`¿Confirma cambiar el estado de la incidencia a ${nextStatus}?`)) return;
    try {
      await put(`/api/tickets/${ticketId}/status`, { status: nextStatus });
      toast(`Estado actualizado a ${nextStatus} correctamente.`, 'success');
      await loadAll();
    } catch (err) {
      toast(err.message || 'Error al actualizar el estado del ticket.', 'error');
    }
  }

  async function openAssignModal() {
    let technicians = [];
    try {
      technicians = (await get('/api/users/technicians')) || [];
    } catch {
      toast('No se pudo consultar la lista de técnicos disponibles.', 'error');
      return;
    }

    const techOptions = technicians.map((t) => `
      <option value="${t.id}" ${t.id === currentTicket.assignedTechnicianId ? 'selected' : ''}>
        ${esc(t.firstName)} ${esc(t.lastName)} (${esc(t.email)}) — ${t.activeTicketsCount || 0} activos
      </option>
    `).join('');

    const modalBody = `
      <form id="assign-tech-form" class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-slate-700 mb-1" for="select-technician">
            Seleccionar Especialista Técnico *
          </label>
          <select id="select-technician" class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white cursor-pointer transition-all">
            ${techOptions || '<option value="">No hay técnicos activos registrados</option>'}
          </select>
          <span class="block text-[11px] text-slate-400 mt-1">
            Al asignar, la incidencia avanzará automáticamente al estado <strong>ASIGNADA</strong> y registrará auditoría.
          </span>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
          <button type="button" data-modal-close class="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all">
            Cancelar
          </button>
          <button id="btn-confirm-assign" type="submit" class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-semibold shadow-md transition-all active:scale-[0.98]">
            <span class="material-symbols-outlined text-[16px]">how_to_reg</span>
            <span>Confirmar Asignación</span>
          </button>
        </div>
      </form>
    `;

    const modal = openModal('Asignación de Especialista TI', modalBody);
    const form = modal.backdrop.querySelector('#assign-tech-form');
    const submitBtn = modal.backdrop.querySelector('#btn-confirm-assign');

    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const techId = Number(form.querySelector('#select-technician')?.value);
      if (!techId) {
        toast('Seleccione un técnico válido.', 'warning');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">sync</span> Asignando...';
      }

      try {
        await put(`/api/tickets/${ticketId}/assign`, { technicianId: techId });
        toast('Técnico asignado exitosamente.', 'success');
        modal.close();
        await loadAll();
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span>Confirmar Asignación</span>';
        }
        toast(err.message || 'Error al asignar especialista.', 'error');
      }
    });
  }

  function renderComments() {
    const commentsContainer = document.getElementById('comments-list');
    const countBadge = document.getElementById('comments-count-badge');
    const lockBadge = document.getElementById('comments-lock-badge');
    const formContainer = document.getElementById('comment-form-container');

    const isClosed = (currentTicket.statusName || '').toUpperCase() === 'CERRADA';

    if (countBadge) countBadge.textContent = `(${commentsList.length})`;

    if (isClosed) {
      if (lockBadge) {
        lockBadge.textContent = 'Ticket Cerrado';
        lockBadge.className = 'text-[11px] font-semibold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-lg';
      }
      if (formContainer) {
        formContainer.innerHTML = `
          <div class="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-500 flex items-center gap-2">
            <span class="material-symbols-outlined text-slate-400">lock</span>
            <span>Esta incidencia se encuentra cerrada definitivamente y no admite nuevos comentarios.</span>
          </div>
        `;
      }
    } else {
      bindCommentForm();
    }

    if (!commentsContainer) return;

    if (!commentsList || commentsList.length === 0) {
      commentsContainer.innerHTML = emptyStateHtml('Sin comentarios registrados', 'Inicie la conversación técnica o deje notas de seguimiento.', 'chat_bubble_outline');
      return;
    }

    commentsContainer.innerHTML = commentsList.map((c) => {
      const author = esc(c.userName || c.authorName || 'Usuario');
      const date = esc(formatDate(c.createdAt));
      const content = esc(c.content);

      return `
        <div class="p-4 rounded-xl bg-slate-50/80 border border-slate-200/60 flex flex-col gap-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-800">${author}</span>
            <span class="text-slate-400 text-[11px] font-mono">${date}</span>
          </div>
          <p class="text-xs text-slate-700 leading-relaxed whitespace-pre-line">${content}</p>
        </div>
      `;
    }).join('');
  }

  function bindCommentForm() {
    const commentForm = document.getElementById('comment-form');
    const commentInput = document.getElementById('comment-input');
    const submitBtn = document.getElementById('btn-submit-comment');

    commentForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const content = (commentInput?.value || '').trim();

      if (!content) {
        toast('El comentario no puede estar vacío.', 'warning');
        return;
      }
      if (content.length > 2000) {
        toast('El comentario no puede exceder 2000 caracteres.', 'warning');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="animate-spin material-symbols-outlined text-sm">sync</span>';
      }

      try {
        await post(`/api/tickets/${ticketId}/comments`, { content });
        toast('Comentario publicado correctamente.', 'success');
        if (commentInput) commentInput.value = '';
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">send</span><span>Publicar Comentario</span>';
        }
        // Recargar comentarios
        commentsList = (await get(`/api/tickets/${ticketId}/comments`)) || [];
        renderComments();
      } catch (err) {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<span class="material-symbols-outlined text-[16px]">send</span><span>Publicar Comentario</span>';
        }
        toast(err.message || 'Error al publicar comentario.', 'error');
      }
    });
  }

  function renderHistory() {
    const historyContainer = document.getElementById('audit-history-timeline');
    if (!historyContainer) return;

    if (!historyList || historyList.length === 0) {
      historyContainer.innerHTML = '<li class="text-slate-400 italic">Registro inicial del ticket</li>';
      return;
    }

    // Cronológico inverso
    const reversed = [...historyList].reverse();

    historyContainer.innerHTML = reversed.map((h) => {
      const prev = h.previousStatusName ? STATUS_LABELS[h.previousStatusName] || h.previousStatusName : null;
      const next = h.newStatusName ? STATUS_LABELS[h.newStatusName] || h.newStatusName : h.newStatusId;
      const text = prev
        ? `Transición de <strong>${esc(prev)}</strong> a <strong>${esc(next)}</strong>`
        : `Creado en estado <strong>${esc(next)}</strong>`;
      const who = esc(h.changedByName || 'Sistema');
      const when = esc(formatDate(h.changedAt));

      return `
        <li class="relative pl-5 pb-2 border-l border-slate-200 last:border-transparent">
          <span class="absolute -left-1.5 top-0.5 w-3 h-3 rounded-full bg-primary-container ring-4 ring-white"></span>
          <p class="text-slate-800 leading-tight">${text}</p>
          <span class="text-[11px] text-slate-400">${who} • ${when}</span>
        </li>
      `;
    }).join('');
  }

  function renderError(title, msg) {
    const container = document.getElementById('ticket-detail-container');
    if (!container) return;
    container.innerHTML = `
      <div class="max-w-xl mx-auto py-16 text-center space-y-4">
        ${emptyStateHtml(title, msg, 'error')}
        <div class="pt-4">
          <a href="tickets.html" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs shadow-md hover:bg-primary-container transition-all">
            <span class="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Volver a la lista de tickets</span>
          </a>
        </div>
      </div>
    `;
  }
});
