/* js/pages/home.js */
Pages.home = function(){
  const ciudades = Store.all('ciudades');

  // Poblar selects
  ['origen','destino'].forEach(id => {
    const sel = document.getElementById(id);
    if(!sel) return;
    sel.innerHTML = `<option value="">Seleccione ciudad...</option>` +
      ciudades.map(c => `<option value="${c}">${c}</option>`).join('');
  });

  // Fecha mínima = hoy
  const fechaInput = document.getElementById('fecha-ida');
  if(fechaInput) fechaInput.min = new Date().toISOString().split('T')[0];

  // Restaurar búsqueda previa
  if(AppState.busqueda.origen){
    const o = document.getElementById('origen');
    const d = document.getElementById('destino');
    const f = document.getElementById('fecha-ida');
    if(o) o.value = AppState.busqueda.origen;
    if(d) d.value = AppState.busqueda.destino;
    if(f) f.value = AppState.busqueda.fecha;
  }

  // Form submit
  const form = document.getElementById('search-form');
  if(form) form.onsubmit = (e) => {
    e.preventDefault();
    const origen  = UI.val('#origen');
    const destino = UI.val('#destino');
    const fecha   = UI.val('#fecha-ida');

    if(origen === destino){ UI.toast('Ruta inválida','El origen y destino no pueden ser iguales.','error'); return; }
    if(!fecha){ UI.toast('Fecha requerida','Selecciona una fecha de viaje.','error'); return; }

    AppState.busqueda = { origen, destino, fecha };
    Router.go('/resultados');
  };
};
