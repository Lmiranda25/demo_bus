/* js/main.js — Bootstrap: seed → layout → router */

// Estado global compartido entre páginas
const AppState = {
  busqueda: { origen:'', destino:'', fecha:'' },
  horarioSeleccionado: null,
  asientosSeleccionados: [],
  reservaPendiente: null,
};

async function init(){
  // 1. Seed datos si es primera vez
  await Store.seed();

  // 2. Render layout estático (header + footer)
  Header.render();
  Footer.render();

  // 3. Registrar rutas del router
  Router.register('/', Pages.home);
  Router.register('/login', Pages.login);
  Router.register('/registro', Pages.registro);
  Router.register('/resultados', Pages.resultados);
  Router.register('/asientos/:id', Pages.asientos);
  Router.register('/checkout', Pages.checkout);
  Router.register('/confirmacion/:id', Pages.confirmacion);
  Router.register('/mis-reservas', Pages.misReservas);
  Router.register('/perfil', Pages.perfil);
  Router.register('/admin', Pages.adminDashboard);
  Router.register('/admin/rutas', Pages.adminRutas);
  Router.register('/admin/buses', Pages.adminBuses);
  Router.register('/admin/horarios', Pages.adminHorarios);
  Router.register('/admin/reservas', Pages.adminReservas);
  Router.register('/admin/usuarios', Pages.adminUsuarios);

  // 4. Arrancar router
  Router.start();
}

document.addEventListener('DOMContentLoaded', init);
