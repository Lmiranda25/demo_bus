/* js/ui.js — Helpers de UI */

const UI = {
  /* ── Formatters ─────────────────────────────────────── */
  currency(n){ return 'S/ ' + Number(n).toFixed(2); },

  date(str){
    if(!str) return '-';
    const d = new Date(str+'T12:00:00');
    return d.toLocaleDateString('es-PE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
  },

  dateShort(str){
    if(!str) return '-';
    const d = new Date(str+'T12:00:00');
    return d.toLocaleDateString('es-PE', { year:'numeric', month:'short', day:'numeric' });
  },

  /* ── Loading ─────────────────────────────────────────── */
  spinner(){ return `<div class="flex justify-center py-20"><div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>`; },

  btnLoading(btn, text='Procesando...'){
    btn.disabled = true;
    btn._orig = btn.innerHTML;
    btn.innerHTML = `<span class="inline-block animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2 align-middle"></span>${text}`;
  },

  btnReset(btn){
    btn.disabled = false;
    if(btn._orig) btn.innerHTML = btn._orig;
  },

  /* ── Toast ───────────────────────────────────────────── */
  toast(title, msg='', type='info', duration=6000){
    const icons = { success:'✅', error:'❌', info:'ℹ️', warning:'⚠️' };
    const container = document.getElementById('toast-container');
    if(!container) return;
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `
      <span class="toast-icon">${icons[type]||'ℹ️'}</span>
      <div class="toast-body" style="flex:1">
        <span class="toast-title">${title}</span>
        ${msg?`<span class="toast-msg">${msg}</span>`:''}
      </div>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:inherit;opacity:0.6;cursor:pointer;font-size:1.2rem;line-height:1;padding:0 0 0 8px;flex-shrink:0" title="Cerrar">&times;</button>`;
    container.appendChild(el);
    const t = setTimeout(() => el.remove(), duration);
    el.querySelector('button').addEventListener('click', () => clearTimeout(t));
  },

  /* ── Modal ───────────────────────────────────────────── */
  modal(title, bodyHTML, footerHTML=''){
    // Eliminar modal previo
    document.getElementById('modal-overlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'modal-overlay';
    overlay.innerHTML = `
      <div id="modal-box">
        <div class="flex items-center justify-between p-5 border-b border-slate-200">
          <h3 class="font-bold text-slate-800 text-lg">${title}</h3>
          <button onclick="UI.closeModal()" class="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
        </div>
        <div class="p-5">${bodyHTML}</div>
        ${footerHTML ? `<div class="p-5 border-t border-slate-200 flex justify-end gap-3">${footerHTML}</div>` : ''}
      </div>`;
    overlay.addEventListener('click', e => { if(e.target === overlay) UI.closeModal(); });
    document.body.appendChild(overlay);
  },

  closeModal(){
    document.getElementById('modal-overlay')?.remove();
  },

  /* ── Badge de estado ─────────────────────────────────── */
  estadoBadge(estado){
    const map = {
      'Pagado':    'bg-emerald-100 text-emerald-700',
      'Pendiente': 'bg-amber-100 text-amber-700',
      'Cancelado': 'bg-red-100 text-red-700',
    };
    return `<span class="px-2 py-0.5 rounded text-xs font-bold ${map[estado]||'bg-slate-100 text-slate-600'}">${estado}</span>`;
  },

  /* ── Confirm dialog ─────────────────────────────────── */
  confirm(msg, onOk){
    UI.modal('¿Confirmar acción?',
      `<p class="text-slate-700">${msg}</p>`,
      `<button onclick="UI.closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50">Cancelar</button>
       <button onclick="UI.closeModal();(${onOk.toString()})()" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Confirmar</button>`
    );
  },

  /* ── Generar código reserva ─────────────────────────── */
  genCodigo(){
    return 'TRX-' + Math.random().toString(36).slice(2,8).toUpperCase();
  },

  /* ── Helpers DOM ────────────────────────────────────── */
  qs(sel, ctx=document){ return ctx.querySelector(sel); },
  qsa(sel, ctx=document){ return [...ctx.querySelectorAll(sel)]; },
  on(el, ev, fn){ el && el.addEventListener(ev, fn); },
  val(sel, ctx=document){ return (ctx.querySelector(sel)||{}).value?.trim()||''; },
};
