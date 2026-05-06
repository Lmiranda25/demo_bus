/* js/pages/admin/usuarios.js */
Pages.adminUsuarios = function(){
  if(!Auth.requireAdmin()) return;
  Pages._renderUsuarios();
};

Pages._renderUsuarios = function(){
  const usuarios = Store.all('usuarios');
  const container = document.getElementById('usuarios-table-body');
  if(!container) return;

  container.innerHTML = usuarios.map(u => `
    <tr class="border-b border-slate-100 hover:bg-slate-50 text-sm">
      <td class="p-3 font-medium" data-label="Nombre">${u.nombre}</td>
      <td class="p-3 text-slate-600 text-xs" data-label="Email">${u.email}</td>
      <td class="p-3" data-label="Teléfono">${u.telefono||'-'}</td>
      <td class="p-3" data-label="Rol">
        <span class="px-2 py-0.5 rounded-full text-xs font-bold ${u.rol==='admin'?'bg-purple-100 text-purple-700':'bg-blue-100 text-blue-700'}">${u.rol}</span>
      </td>
      <td class="p-3" data-label="Estado">
        <span class="px-2 py-0.5 rounded-full text-xs font-bold ${u.activo?'bg-emerald-100 text-emerald-700':'bg-red-100 text-red-700'}">${u.activo?'Activo':'Inactivo'}</span>
      </td>
      <td class="p-3 text-xs" data-label="Registro">${UI.dateShort(u.fechaRegistro)}</td>
      <td class="p-3" data-label="Acciones">
        <div class="flex gap-2 flex-wrap">
          <button onclick="Pages._toggleRol('${u.id}')" class="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200 hover:bg-purple-100">
            ${u.rol==='admin'?'→ Cliente':'→ Admin'}
          </button>
          <button onclick="Pages._toggleActivo('${u.id}')" class="text-xs px-2 py-1 ${u.activo?'bg-red-50 text-red-700 border-red-200':'bg-emerald-50 text-emerald-700 border-emerald-200'} rounded border hover:opacity-80">
            ${u.activo?'Desactivar':'Activar'}
          </button>
        </div>
      </td>
    </tr>`).join('');
};

Pages._toggleRol = function(id){
  const u = Store.find('usuarios', id);
  if(!u) return;
  const nuevoRol = u.rol === 'admin' ? 'cliente' : 'admin';
  Store.update('usuarios', id, { rol: nuevoRol });
  Pages._renderUsuarios();
  UI.toast('Rol actualizado', `${u.nombre} ahora es ${nuevoRol}.`, 'success');
};

Pages._toggleActivo = function(id){
  const u = Store.find('usuarios', id);
  if(!u) return;
  Store.update('usuarios', id, { activo: !u.activo });
  Pages._renderUsuarios();
  UI.toast('Estado cambiado', `${u.nombre} ${!u.activo?'activado':'desactivado'}.`, 'info');
};
