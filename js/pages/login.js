/* js/pages/login.js */
Pages.login = function(){
  if(Auth.isLoggedIn()){ Router.go('/'); return; }

  const form = document.getElementById('login-form');
  if(!form) return;

  // Demo credentials helper
  UI.qsa('.demo-fill').forEach(btn => {
    btn.onclick = () => {
      document.getElementById('email').value = btn.dataset.email;
      document.getElementById('password').value = btn.dataset.pass;
    };
  });

  form.onsubmit = (e) => {
    e.preventDefault();
    const email    = UI.val('#email');
    const password = UI.val('#password');
    const btn      = form.querySelector('button[type=submit]');

    UI.btnLoading(btn, 'Ingresando...');
    setTimeout(() => {
      const result = Auth.login(email, password);
      UI.btnReset(btn);
      if(result.ok){
        Header.render();
        UI.toast('¡Bienvenido!', `Hola ${result.session.nombre.split(' ')[0]} 👋`, 'success');
        Router.go(result.session.rol === 'admin' ? '/admin' : '/');
      } else {
        UI.toast('Error al ingresar', result.msg, 'error');
      }
    }, 600);
  };
};
