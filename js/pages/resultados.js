/* js/pages/resultados.js */
Pages.resultados = function(){
  const { origen, destino, fecha } = AppState.busqueda;
  if(!origen || !destino || !fecha){ Router.go('/'); return; }

  // Encabezado
  const titleEl = document.getElementById('results-title');
  const dateEl  = document.getElementById('results-date');
  if(titleEl) titleEl.textContent = `${origen} → ${destino}`;
  if(dateEl)  dateEl.textContent  = UI.date(fecha);

  // Obtener rutas que coincidan
  const rutas = Store.all('rutas').filter(r => r.origen === origen && r.destino === destino);
  const rutaIds = rutas.map(r => r.id);

  let horarios = Store.all('horarios').filter(h => rutaIds.includes(h.rutaId) && h.fecha === fecha);
  const buses  = Store.all('buses');

  // Si no hay horarios para esta fecha, generar dinámicamente clonando plantillas de esa ruta
  if(horarios.length === 0 && rutas.length > 0){
    const plantillas = Store.all('horarios').filter(h => rutaIds.includes(h.rutaId));
    const vistoBus = new Set();
    plantillas.forEach(t => {
      if(vistoBus.has(t.busId)) return;
      vistoBus.add(t.busId);
      const idVirtual = 'v_' + t.rutaId + '_' + t.busId + '_' + fecha.replace(/-/g,'');
      const existe = Store.find('horarios', idVirtual);
      if(existe){
        horarios.push(existe);
      } else {
        const clone = {
          id: idVirtual,
          rutaId: t.rutaId,
          busId: t.busId,
          fecha: fecha,
          horaSalida: t.horaSalida,
          horaLlegada: t.horaLlegada,
          precio: t.precio,
          asientosOcupados: [],
          virtual: true
        };
        Store.add('horarios', clone);
        horarios.push(clone);
      }
    });
  }

  // Renderizar filtros por tipo
  const tiposUnicos = [...new Set(horarios.map(h => {
    const b = buses.find(b => b.id === h.busId);
    return b ? b.tipo : 'Otro';
  }))];

  const filterContainer = document.getElementById('filter-tipos');
  if(filterContainer){
    filterContainer.innerHTML = `<button class="filter-btn active px-3 py-1.5 rounded-full text-sm font-medium border border-blue-600 bg-blue-600 text-white transition" data-tipo="Todos">Todos</button>` +
      tiposUnicos.map(t => `<button class="filter-btn px-3 py-1.5 rounded-full text-sm font-medium border border-slate-300 text-slate-600 hover:border-blue-600 hover:text-blue-600 transition" data-tipo="${t}">${t}</button>`).join('');

    filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => {
        filterContainer.querySelectorAll('.filter-btn').forEach(b => {
          b.classList.remove('active','bg-blue-600','text-white','border-blue-600');
          b.classList.add('border-slate-300','text-slate-600');
        });
        btn.classList.add('active','bg-blue-600','text-white','border-blue-600');
        btn.classList.remove('border-slate-300','text-slate-600');
        renderList(btn.dataset.tipo);
      };
    });
  }

  function renderList(tipoFiltro = 'Todos'){
    const container = document.getElementById('horarios-list');
    if(!container) return;

    let lista = horarios;
    if(tipoFiltro !== 'Todos'){
      lista = horarios.filter(h => {
        const b = buses.find(b => b.id === h.busId);
        return b && b.tipo === tipoFiltro;
      });
    }

    if(lista.length === 0){
      container.innerHTML = `<div class="text-center py-16 text-slate-400">
        <p class="text-5xl mb-3">🚌</p>
        <p class="font-bold text-lg text-slate-600">No hay salidas disponibles</p>
        <p class="text-sm mt-1">Prueba otra fecha o tipo de servicio.</p>
      </div>`;
      return;
    }

    const ruta = rutas[0];
    container.innerHTML = lista.map(h => {
      const bus = buses.find(b => b.id === h.busId) || {};
      const libres = bus.capacidad - h.asientosOcupados.length;
      const tipoColors = {
        'VIP Plus': 'bg-purple-100 text-purple-700',
        'VIP': 'bg-blue-100 text-blue-700',
        'Cama': 'bg-indigo-100 text-indigo-700',
        'Ejecutivo': 'bg-slate-100 text-slate-700',
        'Económico': 'bg-green-100 text-green-700',
      };
      const badgeClass = tipoColors[bus.tipo] || 'bg-slate-100 text-slate-700';
      const pisos = bus.pisos > 1 ? `<span class="ml-1 bg-amber-100 text-amber-700 text-xs font-bold px-1.5 py-0.5 rounded">2 Pisos</span>` : '';

      return `
      <div class="bg-white border border-slate-200 rounded-xl p-5 card-lift cursor-pointer" onclick="Pages._selectHorario('${h.id}')">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Horario y ruta -->
          <div class="flex items-center gap-4 flex-1">
            <div class="text-center">
              <p class="text-2xl font-bold text-slate-800">${h.horaSalida}</p>
              <p class="text-xs text-slate-500">${origen}</p>
            </div>
            <div class="flex-1 flex flex-col items-center text-xs text-slate-400">
              <span>${ruta ? Math.floor(ruta.duracionH)+'h'+((ruta.duracionH%1)*60?Math.round((ruta.duracionH%1)*60)+'min':'') : ''}</span>
              <div class="w-full flex items-center gap-1 my-1">
                <div class="flex-1 h-px bg-slate-300"></div>
                <svg class="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11h2v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/></svg>
                <div class="flex-1 h-px bg-slate-300"></div>
              </div>
              <span>Directo</span>
            </div>
            <div class="text-center">
              <p class="text-2xl font-bold text-slate-800">${h.horaLlegada}</p>
              <p class="text-xs text-slate-500">${destino}</p>
            </div>
          </div>

          <!-- Info bus + precio -->
          <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:border-l sm:border-slate-200 sm:pl-5 sm:min-w-[140px]">
            <div class="flex flex-col items-start sm:items-end gap-1">
              <span class="text-xs font-bold px-2 py-0.5 rounded-full ${badgeClass}">${bus.tipo||'Bus'}${pisos}</span>
              <span class="text-xs text-slate-500">${bus.nombre||''}</span>
              <span class="text-xs ${libres <= 5 ? 'text-red-500 font-bold' : 'text-emerald-600'}">${libres} asientos libres</span>
            </div>
            <div class="text-right">
              <p class="text-2xl font-bold text-blue-600">${UI.currency(h.precio)}</p>
              <button class="mt-1 bg-corporate-700 hover:bg-corporate-900 text-white text-sm font-bold px-5 py-2 rounded-lg transition w-full">Seleccionar</button>
            </div>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  // Contador resultados
  const countEl = document.getElementById('results-count');
  if(countEl) countEl.textContent = `${horarios.length} salida${horarios.length!==1?'s':''} encontrada${horarios.length!==1?'s':''}`;

  renderList();
};

Pages._selectHorario = function(horarioId){
  AppState.horarioSeleccionado = Store.find('horarios', horarioId);
  AppState.asientosSeleccionados = [];
  Router.go(`/asientos/${horarioId}`);
};
