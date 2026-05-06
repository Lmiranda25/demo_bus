/* js/pages/admin/rutas.js */
Pages.adminRutas = function(){
  if(!Auth.requireAdmin()) return;
  Pages._renderRutas();
};

Pages._renderRutas = function(){
  const rutas = Store.all('rutas');
  const container = document.getElementById('rutas-table-body');
  if(!container) return;

  container.innerHTML = rutas.map(r => `
    <tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="p-3 font-mono text-xs text-slate-500" data-label="ID">${r.id}</td>
      <td class="p-3 font-medium" data-label="Origen">${r.origen}</td>
      <td class="p-3 font-medium" data-label="Destino">${r.destino}</td>
      <td class="p-3" data-label="Distancia">${r.distanciaKm} km</td>
      <td class="p-3" data-label="Duración">${r.duracionH}h</td>
      <td class="p-3" data-label="Acciones">
        <div class="flex gap-2 flex-wrap">
          <button onclick="Pages._editRuta('${r.id}')" class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100">Editar</button>
          <button onclick="Pages._deleteRuta('${r.id}')" class="text-xs px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-100">Eliminar</button>
        </div>
      </td>
    </tr>`).join('');
};

Pages._editRuta = function(id){
  const r = id ? Store.find('rutas', id) : null;
  const ciudades = Store.all('ciudades');
  const opts = (selected='') => ciudades.map(c => `<option value="${c}" ${c===selected?'selected':''}>${c}</option>`).join('');

  UI.modal(
    r ? 'Editar Ruta' : 'Nueva Ruta',
    `<div class="grid grid-cols-2 gap-4">
      <div><label class="block text-sm text-slate-600 mb-1">Origen</label>
        <select id="r-origen" class="w-full border border-slate-300 rounded-lg px-3 py-2"><option value="">Seleccione...</option>${opts(r?.origen)}</select></div>
      <div><label class="block text-sm text-slate-600 mb-1">Destino</label>
        <select id="r-destino" class="w-full border border-slate-300 rounded-lg px-3 py-2"><option value="">Seleccione...</option>${opts(r?.destino)}</select></div>
      <div><label class="block text-sm text-slate-600 mb-1">Distancia (km)</label>
        <input id="r-dist" type="number" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${r?.distanciaKm||''}"></div>
      <div><label class="block text-sm text-slate-600 mb-1">Duración (horas)</label>
        <input id="r-dur" type="number" step="0.5" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${r?.duracionH||''}"></div>
    </div>`,
    `<button onclick="UI.closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancelar</button>
     <button onclick="Pages._saveRuta('${id||''}')" class="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Guardar</button>`
  );
};

Pages._saveRuta = function(id){
  const origen = UI.val('#r-origen');
  const destino = UI.val('#r-destino');
  const dist = parseFloat(document.getElementById('r-dist')?.value||0);
  const dur  = parseFloat(document.getElementById('r-dur')?.value||0);
  if(!origen||!destino){ UI.toast('Error','Completa origen y destino.','error'); return; }
  if(origen===destino){ UI.toast('Error','El origen y destino deben ser distintos.','error'); return; }

  if(id){ Store.update('rutas', id, { origen, destino, distanciaKm: dist, duracionH: dur }); }
  else   { Store.add('rutas', { id: Store.genId('r'), origen, destino, distanciaKm: dist, duracionH: dur }); }
  UI.closeModal();
  Pages._renderRutas();
  UI.toast('Guardado','Ruta actualizada.','success');
};

Pages._deleteRuta = function(id){
  UI.confirm('¿Eliminar esta ruta? Los horarios asociados podrían quedar huérfanos.', function(){
    Store.remove('rutas', id);
    Pages._renderRutas();
    UI.toast('Eliminado','Ruta eliminada.','info');
  });
};
