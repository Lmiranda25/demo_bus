/* js/pages/admin/buses.js */
Pages.adminBuses = function(){
  if(!Auth.requireAdmin()) return;
  Pages._renderBuses();
};

Pages._renderBuses = function(){
  const buses = Store.all('buses');
  const container = document.getElementById('buses-table-body');
  if(!container) return;

  const tipoColors = {'VIP Plus':'purple','VIP':'blue','Cama':'indigo','Ejecutivo':'slate','Económico':'green'};

  container.innerHTML = buses.map(b => {
    const c = tipoColors[b.tipo] || 'slate';
    return `<tr class="border-b border-slate-100 hover:bg-slate-50">
      <td class="p-3 font-mono text-xs" data-label="Placa">${b.placa}</td>
      <td class="p-3 font-medium" data-label="Nombre">${b.nombre}</td>
      <td class="p-3" data-label="Tipo"><span class="px-2 py-0.5 rounded-full text-xs font-bold bg-${c}-100 text-${c}-700">${b.tipo}</span></td>
      <td class="p-3" data-label="Capacidad">${b.capacidad} asientos</td>
      <td class="p-3" data-label="Pisos">${b.pisos}</td>
      <td class="p-3" data-label="Acciones">
        <div class="flex gap-2 flex-wrap">
          <button onclick="Pages._editBus('${b.id}')" class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100">Editar</button>
          <button onclick="Pages._deleteBus('${b.id}')" class="text-xs px-2 py-1 bg-red-50 text-red-700 rounded border border-red-200 hover:bg-red-100">Eliminar</button>
        </div>
      </td>
    </tr>`;
  }).join('');
};

Pages._editBus = function(id){
  const b = id ? Store.find('buses', id) : null;
  const tipos = ['Económico','Ejecutivo','VIP','VIP Plus','Cama'];
  const layouts = { 'Económico':'4col','Ejecutivo':'4col','VIP':'3col','VIP Plus':'3col','Cama':'2col' };

  UI.modal(
    b ? 'Editar Bus' : 'Nuevo Bus',
    `<div class="grid grid-cols-2 gap-4">
      <div><label class="block text-sm text-slate-600 mb-1">Placa</label>
        <input id="b-placa" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${b?.placa||''}" placeholder="ABC-123"></div>
      <div><label class="block text-sm text-slate-600 mb-1">Nombre</label>
        <input id="b-nombre" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${b?.nombre||''}"></div>
      <div><label class="block text-sm text-slate-600 mb-1">Tipo</label>
        <select id="b-tipo" class="w-full border border-slate-300 rounded-lg px-3 py-2">
          ${tipos.map(t => `<option value="${t}" ${t===b?.tipo?'selected':''}>${t}</option>`).join('')}
        </select></div>
      <div><label class="block text-sm text-slate-600 mb-1">Capacidad</label>
        <input id="b-capacidad" type="number" class="w-full border border-slate-300 rounded-lg px-3 py-2" value="${b?.capacidad||40}"></div>
      <div><label class="block text-sm text-slate-600 mb-1">N° de Pisos</label>
        <select id="b-pisos" class="w-full border border-slate-300 rounded-lg px-3 py-2">
          <option value="1" ${b?.pisos===1||!b?'selected':''}>1 piso</option>
          <option value="2" ${b?.pisos===2?'selected':''}>2 pisos</option>
        </select></div>
    </div>`,
    `<button onclick="UI.closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancelar</button>
     <button onclick="Pages._saveBus('${id||''}')" class="px-5 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700">Guardar</button>`
  );
};

Pages._saveBus = function(id){
  const placa    = UI.val('#b-placa');
  const nombre   = UI.val('#b-nombre');
  const tipo     = UI.val('#b-tipo');
  const capacidad= parseInt(document.getElementById('b-capacidad')?.value||40);
  const pisos    = parseInt(document.getElementById('b-pisos')?.value||1);
  const layoutMap= {'Económico':'4col','Ejecutivo':'4col','VIP':'3col','VIP Plus':'3col','Cama':'2col'};
  const layout   = layoutMap[tipo] || '4col';

  if(!placa||!nombre){ UI.toast('Error','Completa placa y nombre.','error'); return; }

  if(id){ Store.update('buses', id, { placa, nombre, tipo, capacidad, layout, pisos }); }
  else   { Store.add('buses', { id: Store.genId('b'), placa, nombre, tipo, capacidad, layout, pisos }); }
  UI.closeModal();
  Pages._renderBuses();
  UI.toast('Guardado','Bus actualizado.','success');
};

Pages._deleteBus = function(id){
  UI.confirm('¿Eliminar este bus?', function(){
    Store.remove('buses', id);
    Pages._renderBuses();
    UI.toast('Eliminado','Bus eliminado.','info');
  });
};
