/* js/pages/admin/reservas.js */
Pages.adminReservas = function(){
  if(!Auth.requireAdmin()) return;
  Pages._renderAdminReservas('');
  const searchInput = document.getElementById('reservas-search');
  if(searchInput) searchInput.oninput = () => Pages._renderAdminReservas(searchInput.value);
};

Pages._renderAdminReservas = function(query){
  let reservas = Store.all('reservas');
  if(query){
    const q = query.toLowerCase();
    reservas = reservas.filter(r =>
      r.codigoReserva.toLowerCase().includes(q) ||
      r.pasajero?.nombre?.toLowerCase().includes(q) ||
      r.estado?.toLowerCase().includes(q) ||
      r.metodoPago?.toLowerCase().includes(q)
    );
  }

  const container = document.getElementById('reservas-admin-body');
  if(!container) return;

  container.innerHTML = reservas.sort((a,b)=>b.fecha>a.fecha?1:-1).map(r => {
    const h  = Store.find('horarios', r.horarioId) || {};
    const rt = Store.find('rutas', h.rutaId) || {};
    return `<tr class="border-b border-slate-100 hover:bg-slate-50 text-sm">
      <td class="p-3 font-mono text-xs text-slate-500" data-label="Código">${r.codigoReserva}</td>
      <td class="p-3" data-label="Pasajero">${r.pasajero?.nombre||'-'}</td>
      <td class="p-3 text-xs" data-label="Ruta">${rt.origen||'?'} → ${rt.destino||'?'}</td>
      <td class="p-3" data-label="Fecha">${UI.dateShort(r.fecha)}</td>
      <td class="p-3 font-bold text-blue-600" data-label="Total">${UI.currency(r.total)}</td>
      <td class="p-3" data-label="Método">${r.metodoPago}</td>
      <td class="p-3" data-label="Estado">${UI.estadoBadge(r.estado)}</td>
      <td class="p-3" data-label="Acciones">
        <select onchange="Pages._cambiarEstadoReserva('${r.id}', this.value)" class="text-xs border border-slate-300 rounded px-2 py-1">
          ${['Pagado','Pendiente','Cancelado'].map(e => `<option value="${e}" ${e===r.estado?'selected':''}>${e}</option>`).join('')}
        </select>
      </td>
    </tr>`;
  }).join('');
};

Pages._cambiarEstadoReserva = function(id, nuevoEstado){
  Store.update('reservas', id, { estado: nuevoEstado });
  UI.toast('Estado actualizado', `Reserva marcada como ${nuevoEstado}.`, 'success');
};
