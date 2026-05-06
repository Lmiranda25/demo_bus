/* js/pages/asientos.js */
Pages.asientos = function({ id }){
  const horario = AppState.horarioSeleccionado || Store.find('horarios', id);
  if(!horario){ Router.go('/'); return; }
  AppState.horarioSeleccionado = horario;

  const bus   = Store.find('buses', horario.busId) || {};
  const ruta  = Store.find('rutas', horario.rutaId) || {};

  // Info encabezado
  const set = (sel, txt) => { const el = document.querySelector(sel); if(el) el.textContent = txt; };
  set('#info-servicio', bus.tipo || 'Bus');
  set('#info-ruta', `${ruta.origen} → ${ruta.destino}`);
  set('#info-fecha', UI.dateShort(horario.fecha));
  set('#info-hora', horario.horaSalida);
  set('#info-precio', UI.currency(horario.precio));
  set('#info-bus', `${bus.nombre} (${bus.placa})`);

  // Render mapa de asientos
  const renderPiso = (containerId, totalSeats, ocupados) => {
    const container = document.getElementById(containerId);
    if(!container) return;
    container.innerHTML = '';

    const layout = bus.layout || '4col';
    const gridClass = layout === '2col' ? 'seat-grid-2col' : layout === '3col' ? 'seat-grid-3col' : 'seat-grid-4col';
    const cols = layout === '2col' ? 2 : layout === '3col' ? 3 : 4;
    const seatsPerRow = cols; // cols de asientos (sin pasillo)

    container.className = gridClass + ' mt-4';

    for(let i = 1; i <= totalSeats; i++){
      const occupied = ocupados.includes(i);
      const selected = AppState.asientosSeleccionados.includes(i);

      const seat = document.createElement('div');
      seat.className = `seat ${occupied ? 'occupied' : selected ? 'selected' : 'available'}`;
      seat.textContent = i;
      seat.dataset.num = i;

      if(!occupied){
        seat.onclick = () => Pages._toggleSeat(seat, i);
      }

      container.appendChild(seat);

      // Insertar pasillo: después del asiento 2 en 4col/3col, después del 1 en 2col
      const aisleAfter = layout === '2col' ? 1 : 2;
      if(i % cols === aisleAfter){
        const aisle = document.createElement('div');
        aisle.className = 'seat-aisle';
        container.appendChild(aisle);
      }
    }
  };

  const totalSeats = bus.capacidad || 40;
  const pisos = bus.pisos || 1;

  if(pisos === 2){
    // Mostrar tabs de piso
    const tabsEl = document.getElementById('pisos-tabs');
    if(tabsEl) tabsEl.classList.remove('hidden');

    const mitad = Math.floor(totalSeats / 2);
    const ocupP1 = horario.asientosOcupados.filter(n => n <= mitad);
    const ocupP2 = horario.asientosOcupados.filter(n => n > mitad).map(n => n - mitad);

    renderPiso('seat-map-p1', mitad, ocupP1);
    renderPiso('seat-map-p2', totalSeats - mitad, ocupP2);

    // Switch tabs
    document.querySelectorAll('.tab-piso').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.tab-piso').forEach(b => b.classList.remove('bg-blue-600','text-white'));
        btn.classList.add('bg-blue-600','text-white');
        document.querySelectorAll('.piso-panel').forEach(p => p.classList.add('hidden'));
        document.getElementById('piso-' + btn.dataset.piso)?.classList.remove('hidden');
      };
    });
  } else {
    const tabsEl = document.getElementById('pisos-tabs');
    if(tabsEl) tabsEl.classList.add('hidden');
    renderPiso('seat-map-p1', totalSeats, horario.asientosOcupados);
  }

  Pages._updateResumen();
};

Pages._toggleSeat = function(seatEl, num){
  const idx = AppState.asientosSeleccionados.indexOf(num);
  if(idx > -1){
    AppState.asientosSeleccionados.splice(idx, 1);
    seatEl.classList.replace('selected', 'available');
  } else {
    if(AppState.asientosSeleccionados.length >= 4){
      UI.toast('Límite alcanzado','Máximo 4 asientos por transacción.','warning');
      return;
    }
    AppState.asientosSeleccionados.push(num);
    seatEl.classList.replace('available', 'selected');
  }
  Pages._updateResumen();
};

Pages._updateResumen = function(){
  const n = AppState.asientosSeleccionados.length;
  const precio = AppState.horarioSeleccionado?.precio || 0;
  const total = n * precio;

  const setT = (sel, txt) => { const el = document.querySelector(sel); if(el) el.textContent = txt; };
  setT('#res-asientos', n > 0 ? AppState.asientosSeleccionados.sort((a,b)=>a-b).join(', ') : 'Ninguno');
  setT('#res-total', UI.currency(total));

  const btn = document.getElementById('btn-continue');
  if(!btn) return;
  if(n > 0){
    btn.disabled = false;
    btn.className = 'w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center gap-2';
  } else {
    btn.disabled = true;
    btn.className = 'w-full bg-slate-200 text-slate-400 font-bold py-3 px-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2';
  }
};
