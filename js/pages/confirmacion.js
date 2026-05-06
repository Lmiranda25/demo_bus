/* js/pages/confirmacion.js */
Pages.confirmacion = function({ id }){
  const reserva = AppState.reservaPendiente || Store.find('reservas', id);
  if(!reserva){ Router.go('/'); return; }

  const horario = Store.find('horarios', reserva.horarioId) || {};
  const ruta    = Store.find('rutas', horario.rutaId) || {};

  const set = (sel, txt) => { const el = document.querySelector(sel); if(el) el.textContent = txt; };
  set('#conf-codigo',   reserva.codigoReserva);
  set('#conf-origen',   ruta.origen || '-');
  set('#conf-destino',  ruta.destino || '-');
  set('#conf-pasajero', reserva.pasajero?.nombre || '-');
  set('#conf-ruta',     `${ruta.origen || '-'} → ${ruta.destino || '-'}`);
  set('#conf-fecha',    `${UI.dateShort(horario.fecha)} ${horario.horaSalida || ''}`);
  set('#conf-asientos', reserva.asientos?.join(', ') || '-');
  set('#conf-metodo',   reserva.metodoPago || '-');
  set('#conf-total',    UI.currency(reserva.total));
  set('#conf-bus',      (() => { const b = Store.find('buses', horario.busId); return b ? `${b.tipo} — ${b.nombre}` : '-'; })());

  // Toasts simulando email y WhatsApp (con delay)
  setTimeout(() => {
    UI.toast('📧 Correo enviado', `Tu boleto fue enviado a ${reserva.pasajero?.email || 'tu correo'}.`, 'success', 6000);
  }, 1000);
  setTimeout(() => {
    UI.toast('💬 WhatsApp enviado', `Confirmación enviada al ${reserva.pasajero?.telefono || 'tu número'}.`, 'success', 6000);
  }, 2500);

  // Botón PDF
  const btnPdf = document.getElementById('btn-pdf');
  if(btnPdf) btnPdf.onclick = () => window.print();

  // Botón nueva búsqueda
  const btnNew = document.getElementById('btn-nueva');
  if(btnNew) btnNew.onclick = () => {
    AppState.busqueda = { origen:'', destino:'', fecha:'' };
    AppState.horarioSeleccionado = null;
    AppState.asientosSeleccionados = [];
    AppState.reservaPendiente = null;
    Router.go('/');
  };
};
