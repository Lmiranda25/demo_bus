/* js/pages/registro.js */
Pages.registro = function(){
  if(Auth.isLoggedIn()){ Router.go('/'); return; }

  const form = document.getElementById('register-form');
  if(!form) return;

  form.onsubmit = (e) => {
    e.preventDefault();
    const nombre   = UI.val('#nombre');
    const email    = UI.val('#email');
    const password = UI.val('#password');
    const confirm  = UI.val('#confirm-password');
    const telefono = UI.val('#telefono');
    const dni      = UI.val('#dni');
    const btn      = form.querySelector('button[type=submit]');

    if(password !== confirm){ UI.toast('Error','Las contraseñas no coinciden.','error'); return; }
    if(password.length < 6){ UI.toast('Error','La contraseña debe tener al menos 6 caracteres.','error'); return; }

    UI.btnLoading(btn, 'Registrando...');
    setTimeout(() => {
      const result = Auth.register({ nombre, email, password, telefono, dni });
      UI.btnReset(btn);
      if(result.ok){
        Header.render();
        UI.toast('¡Cuenta creada!', 'Bienvenido a TransCorp 🎉', 'success');
        Router.go('/');
      } else {
        UI.toast('Error al registrar', result.msg, 'error');
      }
    }, 700);
  };
};
