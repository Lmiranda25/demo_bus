/* js/pages/checkout.js */
Pages.checkout = function(){
  if(!AppState.horarioSeleccionado || AppState.asientosSeleccionados.length === 0){
    Router.go('/'); return;
  }

  const session = Auth.getSession();
  const horario = AppState.horarioSeleccionado;
  const ruta    = Store.find('rutas', horario.rutaId) || {};
  const bus     = Store.find('buses', horario.busId) || {};
  const total   = AppState.asientosSeleccionados.length * horario.precio;

  // Autocompletar datos si hay sesión
  if(session){
    const s = (id, v) => { const el = document.getElementById(id); if(el && v) el.value = v; };
    s('nombre', session.nombre);
    s('email', session.email);
    s('telefono', session.telefono);
    s('dni', session.dni);
  }

  // Resumen
  const set = (sel, txt) => { const el = document.querySelector(sel); if(el) el.textContent = txt; };
  set('#pay-origen', ruta.origen || '-');
  set('#pay-destino', ruta.destino || '-');
  set('#pay-fecha', UI.dateShort(horario.fecha));
  set('#pay-hora', horario.horaSalida);
  set('#pay-bus', bus.tipo || 'Bus');
  set('#pay-asientos', AppState.asientosSeleccionados.join(', '));
  set('#pay-total', UI.currency(total));

  // Métodos de pago — mostrar/ocultar panel
  const metodos = document.querySelectorAll('input[name="metodo-pago"]');
  const panels  = document.querySelectorAll('.metodo-panel');
  metodos.forEach(radio => {
    radio.onchange = () => {
      panels.forEach(p => p.classList.add('hidden'));
      const target = document.getElementById('panel-' + radio.value);
      if(target) target.classList.remove('hidden');
    };
  });

  // Botón pagar
  const btnPagar = document.getElementById('btn-pagar');
  if(!btnPagar) return;

  btnPagar.onclick = () => {
    const nombre   = UI.val('#nombre');
    const email    = UI.val('#email');
    const dni      = UI.val('#dni');
    const telefono = UI.val('#telefono');
    const metodo   = document.querySelector('input[name="metodo-pago"]:checked')?.value || 'Tarjeta';

    if(!nombre || !email || !dni){
      UI.toast('Datos incompletos', 'Completa nombre, email y DNI.', 'error');
      return;
    }

    // Validación tarjeta
    if(metodo === 'Tarjeta'){
      const num = UI.val('#card-number').replace(/\s/g,'');
      const exp = UI.val('#card-exp');
      const cvc = UI.val('#card-cvc');
      if(num.length < 13 || !exp || !cvc){
        UI.toast('Datos de tarjeta','Completa todos los campos de la tarjeta.','error');
        return;
      }
    }

    // Yape/Plin — mostrar modal QR
    if(metodo === 'Yape' || metodo === 'Plin'){
      Pages._showQRModal(metodo, total, () => Pages._procesarPago(nombre, email, dni, telefono, metodo, total, horario));
      return;
    }

    // Culqi / MercadoPago — modal simulado
    if(metodo === 'Culqi' || metodo === 'MercadoPago'){
      Pages._showGatewayModal(metodo, total, () => Pages._procesarPago(nombre, email, dni, telefono, metodo, total, horario));
      return;
    }

    // Tarjeta: procesar directo
    UI.btnLoading(btnPagar, 'Procesando pago...');
    setTimeout(() => {
      Pages._procesarPago(nombre, email, dni, telefono, metodo, total, horario);
    }, 1800);
  };
};

Pages._showQRModal = function(metodo, total, onConfirm){
  const color = metodo === 'Yape' ? 'purple' : 'cyan';
  UI.modal(
    `Pago con ${metodo}`,
    `<div class="flex flex-col items-center gap-4">
       <p class="text-sm text-slate-600 text-center">Escanea el código QR con tu app de <strong>${metodo}</strong> y confirma el pago de <strong class="text-${color}-600">${UI.currency(total)}</strong>.</p>
       <div class="qr-placeholder"></div>
       <div class="bg-${color}-50 border border-${color}-200 rounded-lg px-5 py-3 text-center w-full">
         <p class="text-xs text-slate-500 mb-1">Número de celular</p>
         <p class="text-2xl font-bold text-slate-800">+51 999 000 123</p>
         <p class="text-xs text-slate-500 mt-1">TransCorp S.A.C.</p>
       </div>
       <div class="flex items-center gap-2 text-xs text-slate-500">
         <div class="animate-spin w-4 h-4 border-2 border-${color}-500 border-t-transparent rounded-full"></div>
         Esperando confirmación de pago...
       </div>
     </div>`,
    `<button onclick="UI.closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancelar</button>
     <button onclick="UI.closeModal(); Pages._procesarPago(...Pages._pendingPayArgs)" class="px-5 py-2 bg-${color}-600 text-white font-bold rounded-lg hover:bg-${color}-700">✅ Confirmar Pago</button>`
  );
  // Guardar args para el callback del modal
  Pages._pendingPayArgs = [
    document.getElementById('nombre')?.value || '',
    document.getElementById('email')?.value || '',
    document.getElementById('dni')?.value || '',
    document.getElementById('telefono')?.value || '',
    metodo, total, AppState.horarioSeleccionado
  ];
};

Pages._showGatewayModal = function(metodo, total, onConfirm){
  UI.modal(
    `${metodo} — Pasarela Segura`,
    `<div class="flex flex-col items-center gap-4">
       <div class="w-16 h-16 rounded-full ${metodo==='Culqi'?'bg-blue-600':'bg-yellow-400'} flex items-center justify-center text-white font-black text-xl">${metodo[0]}</div>
       <p class="font-bold text-slate-800">Total a pagar: ${UI.currency(total)}</p>
       <p class="text-sm text-slate-500 text-center">Serás redirigido a la pasarela segura de <strong>${metodo}</strong> para completar tu pago.</p>
       <div class="w-full bg-slate-100 rounded-lg p-3 text-xs text-slate-600">
         🔒 Conexión encriptada SSL 256-bit<br>
         🛡️ Protegido por ${metodo} Anti-fraude
       </div>
     </div>`,
    `<button onclick="UI.closeModal()" class="px-4 py-2 border border-slate-300 rounded-lg text-slate-700">Cancelar</button>
     <button onclick="UI.closeModal(); Pages._procesarPago(...Pages._pendingPayArgs)" class="px-5 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Pagar con ${metodo}</button>`
  );
  Pages._pendingPayArgs = [
    document.getElementById('nombre')?.value || '',
    document.getElementById('email')?.value || '',
    document.getElementById('dni')?.value || '',
    document.getElementById('telefono')?.value || '',
    metodo, total, AppState.horarioSeleccionado
  ];
};

Pages._procesarPago = function(nombre, email, dni, telefono, metodo, total, horario){
  // Crear reserva en localStorage
  const codigo = UI.genCodigo();
  const reservaId = Store.genId('rv');

  const reserva = {
    id: reservaId,
    usuarioId: Auth.getSession()?.userId || 'guest',
    horarioId: horario.id,
    asientos: [...AppState.asientosSeleccionados],
    total,
    metodoPago: metodo,
    estado: 'Pagado',
    codigoReserva: codigo,
    pasajero: { nombre, email, dni, telefono },
    fecha: new Date().toISOString().split('T')[0]
  };

  Store.add('reservas', reserva);

  // Actualizar asientos ocupados del horario
  const h = Store.find('horarios', horario.id);
  if(h){
    const nuevosOcupados = [...new Set([...h.asientosOcupados, ...AppState.asientosSeleccionados])];
    Store.update('horarios', horario.id, { asientosOcupados: nuevosOcupados });
  }

  AppState.reservaPendiente = reserva;

  // Navegar a confirmación
  Router.go(`/confirmacion/${reservaId}`);
};
