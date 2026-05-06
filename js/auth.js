/* js/auth.js — Gestión de sesión */

const Auth = {
  SESSION_KEY: 'tc_session',

  getSession(){
    try{ return JSON.parse(localStorage.getItem(this.SESSION_KEY)||'null'); }catch{ return null; }
  },

  isLoggedIn(){ return !!this.getSession(); },

  isAdmin(){ return this.getSession()?.rol === 'admin'; },

  login(email, password){
    const usuarios = Store.all('usuarios');
    const user = usuarios.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if(!user) return { ok: false, msg: 'Correo o contraseña incorrectos.' };
    if(!user.activo) return { ok: false, msg: 'Cuenta desactivada. Contacta al soporte.' };
    const session = { userId: user.id, nombre: user.nombre, email: user.email, rol: user.rol, telefono: user.telefono, dni: user.dni };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  },

  register(data){
    const usuarios = Store.all('usuarios');
    if(usuarios.find(u => u.email.toLowerCase() === data.email.toLowerCase())){
      return { ok: false, msg: 'Ya existe una cuenta con ese correo.' };
    }
    const newUser = {
      id: Store.genId('u'),
      nombre: data.nombre,
      email: data.email,
      password: data.password,
      telefono: data.telefono || '',
      dni: data.dni || '',
      rol: 'cliente',
      activo: true,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };
    Store.add('usuarios', newUser);
    const session = { userId: newUser.id, nombre: newUser.nombre, email: newUser.email, rol: newUser.rol, telefono: newUser.telefono, dni: newUser.dni };
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    return { ok: true, session };
  },

  logout(){
    localStorage.removeItem(this.SESSION_KEY);
  },

  requireLogin(){
    if(!this.isLoggedIn()){ Router.go('/login'); return false; }
    return true;
  },

  requireAdmin(){
    if(!this.isLoggedIn()){ Router.go('/login'); return false; }
    if(!this.isAdmin()){ Router.go('/'); return false; }
    return true;
  }
};
