/* js/pages/admin/horarios.js */
Pages.adminHorarios = function(){
  if(!Auth.requireAdmin()) return;
  Pages._renderHorarios();
};

Pages._renderHorarios = function(){
  const horarios = Store.all('horarios');
  const container = document.getElementById('horarios-table-body');
  if(!container) return;

  container.innerHTML = horarios.map(h => {
    const r = Store.find('rutas', h.rutaId) || {};
    const b = Store.find('buses', h.busId) || {};
    const libres = (b.capacidad||0) - h.asientosOcupados.length;
    return `<tr class="border-b border-slate-100 hover:bg-slate-50 text-sm">
      <td class="p-3 font-mono text-xs text-slate-500" data-label="ID">${h.id}</td>
      <td class="p-3" data-label="Ruta">${r.origen||'?'} → ${r.destino||'?'}</td>
      <td class="p-3" data-label="Bus">${b.nombre||'?'}</td>
      <td class="p-3" data-label="Fecha">${UI.dateShort(h.fecha)}</td>
      <td class="p-3" data-label="Salida">${h.horaSalida}</td>
      <td class="p-3 font-bold text-blue-600" data-label="Precio">${UI.currency(h.precio)}</td>
      <td class="p-3" data-label="Asientos">${libres} / ${b.capacidad||0}</td>
      <td class="p-3" data-label="Acciones">
        <div class="flex gap-2 flex-wrap">
          <button onclick="Pages._editHorario('${h.id}')" class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100">Editar</button>
          <button onclick="Pages._deleteHorario('${h.id}')" class="text-xs px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-100">Eliminar</button>
        </div>
      </td>
    </tr>`;
  }).join('');
};

Pages._editHorario = function(id){
  const h     = id ? Store.find('horarios', id) : null;
  const rutas = Store.all('rutas');
  const buses = Store.all('buses');

  const rutaOpts = rutas.map(r => `<option value="${r.id}" ${r.id===h?.rutaId?'selected':''}>${r.origen} → ${r.destino}</option>`).join('');
  const busOpts  = buses.map(b => `<option value="${b.id}" ${b.id===h?.busId?'selected':''}>${b.nombre} (${b.tipo})</option>`).join('');

  UI.modal(
    h ? 'Editar Horario' : 'Nuevo Horario',
    `<div class="grid grid-cols-2 gap-4">
      <div class="col-span-2"><label class="block text-sm text-slate-600 mb-1">Ruta</label>
        <select id="h-ruta" class="w-full border border-slate-300 rounded-lg px-3 py-2"><option value="">Seleccione...</option>${rutaOpts}</select></div>
      <div class="col-span-2"><label class="block text-sm text-slate-600 mb-1">Bus</label>
        <select id="h-bus" class="w-full border border-slate-300 rounded-lg px-3 py-2"><option value="">Seleccione...</option>${busOpts}</select></div>
      <div><label class="block text-sm text-slate-600 mb-1">Fecha</label>
        <input id="h-fecha" type="date" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${h?.fecha||''}"></div>
      <div><label class="block text-sm text-slate-600 mb-1">Hora Salida</label>
        <input id="h-salida" type="time" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${h?.horaSalida||''}"></div>
      <div><label class="block text-sm text-slate-600 mb-1">Hora Llegada</label>
        <input id="h-llegada" type="time" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${h?.horaLlegada||''}"></div>
      <div><label class="block text-sm text-slate-600 mb-1">Precio (S/)</label>
        <input id="h-precio" type="number" step="0.50" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${h?.precio||''}"></div>
    </div>`,
    `<button onclick="UI.closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancelar</button>
     <button onclick="Pages._saveHorario('${id||''}')" class="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Guardar</button>`
  );
};

Pages._saveHorario = function(id){
  const rutaId    = UI.val('#h-ruta');
  const busId     = UI.val('#h-bus');
  const fecha     = UI.val('#h-fecha');
  const horaSalida= UI.val('#h-salida');
  const horaLlegada= UI.val('#h-llegada');
  const precio    = parseFloat(document.getElementById('h-precio')?.value||0);

  if(!rutaId||!busId||!fecha||!horaSalida){ UI.toast('Error','Completa todos los campos requeridos.','error'); return; }

  if(id){
    Store.update('horarios', id, { rutaId, busId, fecha, horaSalida, horaLlegada, precio });
  } else {
    Store.add('horarios', { id: Store.genId('h'), rutaId, busId, fecha, horaSalida, horaLlegada, precio, asientosOcupados: [] });
  }
  UI.closeModal();
  Pages._renderHorarios();
  UI.toast('Guardado','Horario actualizado.','success');
};

Pages._deleteHorario = function(id){
  UI.confirm('¿Eliminar este horario?', function(){
    Store.remove('horarios', id);
    Pages._renderHorarios();
    UI.toast('Eliminado','Horario eliminado.','info');
  });
};
