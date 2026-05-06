/* js/pages/admin/dashboard.js */
Pages.adminDashboard = function(){
  if(!Auth.requireAdmin()) return;

  const reservas = Store.all('reservas');
  const hoy      = new Date().toISOString().split('T')[0];
  const reservasHoy = reservas.filter(r => r.fecha === hoy && r.estado === 'Pagado');
  const ventasHoy   = reservasHoy.reduce((s,r) => s+r.total, 0);
  const totalVentas = reservas.filter(r=>r.estado==='Pagado').reduce((s,r)=>s+r.total,0);
  const rutas   = Store.all('rutas');
  const buses   = Store.all('buses');
  const horarios= Store.all('horarios');

  const set = (sel, txt) => { const el = document.querySelector(sel); if(el) el.textContent = txt; };
  set('#kpi-ventas-hoy', UI.currency(ventasHoy));
  set('#kpi-pasajes-hoy', reservasHoy.length);
  set('#kpi-ventas-total', UI.currency(totalVentas));
  set('#kpi-reservas-total', reservas.length);
  set('#kpi-rutas', rutas.length);
  set('#kpi-buses', buses.length);
  set('#kpi-pagadas', reservas.filter(r=>r.estado==='Pagado').length);
  set('#kpi-pendientes', reservas.filter(r=>r.estado==='Pendiente').length);

  // Top rutas
  const rutaCount = {};
  reservas.forEach(r => {
    const h = Store.find('horarios', r.horarioId);
    if(h){ rutaCount[h.rutaId] = (rutaCount[h.rutaId]||0)+1; }
  });
  const topRutas = Object.entries(rutaCount).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const topContainer = document.getElementById('top-rutas');
  if(topContainer){
    topContainer.innerHTML = topRutas.map(([rid, count]) => {
      const r = Store.find('rutas', rid) || {};
      const pct = Math.round((count / reservas.length) * 100) || 0;
      return `<div class="flex items-center gap-3">
        <span class="text-sm text-slate-700 w-36 shrink-0 truncate">${r.origen||'?'} → ${r.destino||'?'}</span>
        <div class="flex-1 bg-slate-100 rounded-full h-2.5">
          <div class="bg-blue-600 h-2.5 rounded-full" style="width:${pct}%"></div>
        </div>
        <span class="text-sm font-bold text-slate-700 w-8 text-right">${count}</span>
      </div>`;
    }).join('');
  }

  // Últimas transacciones
  const txContainer = document.getElementById('recent-tx');
  if(txContainer){
    const recientes = [...reservas].sort((a,b)=>b.fecha>a.fecha?1:-1).slice(0,8);
    txContainer.innerHTML = `<table class="w-full text-sm mob-card-table">
      <thead><tr class="bg-slate-50 text-slate-600 text-xs border-b-2 border-slate-200">
        <th class="p-3 text-left font-bold">Código</th>
        <th class="p-3 text-left font-bold">Pasajero</th>
        <th class="p-3 text-left font-bold">Ruta</th>
        <th class="p-3 text-left font-bold">Monto</th>
        <th class="p-3 text-left font-bold">Estado</th>
      </tr></thead>
      <tbody>
      ${recientes.map(r => {
        const h = Store.find('horarios', r.horarioId) || {};
        const rt = Store.find('rutas', h.rutaId) || {};
        return `<tr class="border-b border-slate-100 hover:bg-slate-50">
          <td class="p-3 font-mono text-slate-500 text-xs" data-label="Código">${r.codigoReserva}</td>
          <td class="p-3 font-medium" data-label="Pasajero">${r.pasajero?.nombre||'-'}</td>
          <td class="p-3" data-label="Ruta">${rt.origen||'?'} → ${rt.destino||'?'}</td>
          <td class="p-3 font-bold text-blue-600" data-label="Monto">${UI.currency(r.total)}</td>
          <td class="p-3" data-label="Estado">${UI.estadoBadge(r.estado)}</td>
        </tr>`;
      }).join('')}
      </tbody>
    </table>`;
  }

  // Sidebar activo
  document.querySelector('[data-admin-link="dashboard"]')?.classList.add('bg-blue-700');
};
