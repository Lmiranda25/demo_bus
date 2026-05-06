/* js/pages/perfil.js */
Pages.perfil = function(){
  if(!Auth.requireLogin()) return;
  const session = Auth.getSession();
  const user    = Store.find('usuarios', session.userId);
  if(!user) return;

  const s = (id, v) => { const el = document.getElementById(id); if(el) el.value = v || ''; };
  s('p-nombre',   user.nombre);
  s('p-email',    user.email);
  s('p-telefono', user.telefono);
  s('p-dni',      user.dni);

  // Avatar initials
  const av = document.getElementById('avatar-initials');
  if(av) av.textContent = user.nombre.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase();

  // Stats
  const reservas = Store.all('reservas').filter(r => r.usuarioId === user.id);
  const set = (sel, txt) => { const el = document.querySelector(sel); if(el) el.textContent = txt; };
  set('#p-stat-reservas', reservas.length);
  set('#p-stat-pagadas', reservas.filter(r=>r.estado==='Pagado').length);
  set('#p-stat-gastado', UI.currency(reservas.filter(r=>r.estado==='Pagado').reduce((s,r)=>s+r.total,0)));
  set('#p-miembro-desde', UI.dateShort(user.fechaRegistro));

  // Guardar perfil
  const form = document.getElementById('perfil-form');
  if(form) form.onsubmit = (e) => {
    e.preventDefault();
    const nombre   = UI.val('#p-nombre');
    const telefono = UI.val('#p-telefono');
    const dni      = UI.val('#p-dni');
    const btn      = form.querySelector('button[type=submit]');

    UI.btnLoading(btn, 'Guardando...');
    setTimeout(() => {
      Store.update('usuarios', user.id, { nombre, telefono, dni });
      // Actualizar sesión
      const newSession = { ...session, nombre, telefono, dni };
      localStorage.setItem(Auth.SESSION_KEY, JSON.stringify(newSession));
      Header.render();
      UI.btnReset(btn);
      UI.toast('Perfil actualizado','Tus datos fueron guardados.','success');
    }, 600);
  };

  // Cambiar contraseña
  const formPass = document.getElementById('password-form');
  if(formPass) formPass.onsubmit = (e) => {
    e.preventDefault();
    const actual  = UI.val('#p-pass-actual');
    const nueva   = UI.val('#p-pass-nueva');
    const confirmar = UI.val('#p-pass-confirmar');
    const btn     = formPass.querySelector('button[type=submit]');

    if(actual !== user.password){ UI.toast('Error','Contraseña actual incorrecta.','error'); return; }
    if(nueva !== confirmar){ UI.toast('Error','Las contraseñas nuevas no coinciden.','error'); return; }
    if(nueva.length < 6){ UI.toast('Error','Mínimo 6 caracteres.','error'); return; }

    UI.btnLoading(btn, 'Actualizando...');
    setTimeout(() => {
      Store.update('usuarios', user.id, { password: nueva });
      UI.btnReset(btn);
      formPass.reset();
      UI.toast('Contraseña cambiada','Tu contraseña fue actualizada.','success');
    }, 600);
  };
};
