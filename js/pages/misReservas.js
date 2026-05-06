/* js/pages/misReservas.js */
Pages.misReservas = function(){
  if(!Auth.requireLogin()) return;
  const session = Auth.getSession();
  const todas   = Store.all('reservas').filter(r => r.usuarioId === session.userId);

  const container = document.getElementById('reservas-list');
  if(!container) return;

  if(todas.length === 0){
    container.innerHTML = `<div class="text-center py-16 text-slate-400">
      <p class="text-5xl mb-3">🎟️</p>
      <p class="font-bold text-lg text-slate-600">No tienes reservas aún</p>
      <a href="#/" class="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium">Buscar pasajes</a>
    </div>`;
    return;
  }

  // Totales
  const totalGastado = todas.filter(r=>r.estado==='Pagado').reduce((s,r)=>s+r.total,0);
  const setT = (sel, txt) => { const el = document.querySelector(sel); if(el) el.textContent = txt; };
  setT('#stat-total', todas.length);
  setT('#stat-pagadas', todas.filter(r=>r.estado==='Pagado').length);
  setT('#stat-gastado', UI.currency(totalGastado));

  container.innerHTML = todas.sort((a,b)=> b.fecha > a.fecha ? 1 : -1).map(r => {
    const horario = Store.find('horarios', r.horarioId) || {};
    const ruta    = Store.find('rutas', horario.rutaId) || {};
    const bus     = Store.find('buses', horario.busId) || {};

    return `
    <div class="bg-white border border-slate-200 rounded-xl p-5 card-lift">
      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div class="flex-1">
          <div class="flex items-center gap-2 flex-wrap mb-2">
            <span class="font-mono text-sm text-slate-500">${r.codigoReserva}</span>
            ${UI.estadoBadge(r.estado)}
            <span class="text-xs text-slate-400">${UI.dateShort(r.fecha)}</span>
          </div>
          <h3 class="font-bold text-slate-800 text-lg">${ruta.origen||'?'} → ${ruta.destino||'?'}</h3>
          <p class="text-sm text-slate-500 mt-1">
            📅 ${UI.dateShort(horario.fecha)} · 🕐 ${horario.horaSalida||'-'} · 🚌 ${bus.tipo||''} ${bus.nombre||''} · 💺 Asientos: ${r.asientos?.join(', ')||'-'}
          </p>
          <p class="text-sm text-slate-500 mt-0.5">💳 Pagado con ${r.metodoPago}</p>
        </div>
        <div class="flex flex-col items-start sm:items-end gap-2">
          <span class="text-xl font-bold text-blue-600">${UI.currency(r.total)}</span>
          <div class="flex gap-2 flex-wrap">
            ${r.estado !== 'Cancelado' ? `
              <button onclick="Pages._cancelarReserva('${r.id}')" class="text-xs px-3 py-1.5 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition font-medium">Cancelar</button>
            ` : ''}
            <button onclick="Pages._verTicket('${r.id}')" class="text-xs px-3 py-1.5 border border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium">Ver Boleto</button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
};

Pages._cancelarReserva = function(id){
  UI.confirm(
    '¿Deseas cancelar esta reserva? Los asientos quedarán disponibles para otros pasajeros.',
    function(){
      const r = Store.find('reservas', id);
      if(!r) return;
      Store.update('reservas', id, { estado: 'Cancelado' });
      // Liberar asientos
      const h = Store.find('horarios', r.horarioId);
      if(h){
        const libres = h.asientosOcupados.filter(n => !r.asientos.includes(n));
        Store.update('horarios', r.horarioId, { asientosOcupados: libres });
      }
      UI.toast('Reserva cancelada', 'Los asientos fueron liberados.', 'info');
      Pages.misReservas();
    }
  );
};

Pages._verTicket = function(id){
  const r = Store.find('reservas', id);
  if(!r) return;
  const horario = Store.find('horarios', r.horarioId) || {};
  const ruta    = Store.find('rutas', horario.rutaId) || {};

  UI.modal('🎟️ Tu Boleto',
    `<div class="relative bg-slate-50 border border-slate-200 rounded-lg p-5 overflow-hidden">
       <div class="ticket-punch-l"></div>
       <div class="ticket-punch-r"></div>
       <div class="border-b-2 border-dashed border-slate-300 pb-4 mb-4">
         <p class="text-xs text-slate-500 uppercase tracking-wider mb-1">Código de Reserva</p>
         <p class="text-xl font-mono font-bold text-slate-800">${r.codigoReserva}</p>
       </div>
       <div class="grid grid-cols-2 gap-3 text-sm">
         <div><span class="text-slate-500 block text-xs">Pasajero</span><strong>${r.pasajero?.nombre||'-'}</strong></div>
         <div><span class="text-slate-500 block text-xs">DNI</span><strong>${r.pasajero?.dni||'-'}</strong></div>
         <div><span class="text-slate-500 block text-xs">Ruta</span><strong>${ruta.origen||'?'} → ${ruta.destino||'?'}</strong></div>
         <div><span class="text-slate-500 block text-xs">Asientos</span><strong>${r.asientos?.join(', ')||'-'}</strong></div>
         <div><span class="text-slate-500 block text-xs">Fecha/Hora</span><strong>${UI.dateShort(horario.fecha)} ${horario.horaSalida||''}</strong></div>
         <div><span class="text-slate-500 block text-xs">Total</span><strong class="text-blue-600">${UI.currency(r.total)}</strong></div>
       </div>
     </div>`,
    `<button onclick="UI.closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cerrar</button>
     <button onclick="window.print()" class="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">🖨️ Imprimir</button>`
  );
};
