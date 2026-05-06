/* js/router.js — Hash router */

const ROUTES = {};

const Router = {
  register(path, initFn){ ROUTES[path] = initFn; },

  go(path, replace=false){
    const hash = '#' + path;
    if(replace) history.replaceState(null,'',hash);
    else history.pushState(null,'',hash);
    Router._resolve(path);
  },

  start(){
    window.addEventListener('popstate', () => Router._resolve(Router._currentPath()));
    Router._resolve(Router._currentPath());
  },

  _currentPath(){
    const hash = location.hash.replace('#','') || '/';
    return hash;
  },

  async _resolve(fullPath){
    // Separar path base de params: /asientos/h1 → route=/asientos/:id, params={id:'h1'}
    let matched = null;
    let params = {};
    for(const pattern of Object.keys(ROUTES)){
      const m = Router._match(pattern, fullPath);
      if(m){ matched = pattern; params = m; break; }
    }

    if(!matched){
      matched = '/404';
      if(!ROUTES[matched]) matched = '/';
    }

    // Cargar template HTML de la vista
    const viewMap = {
      '/': 'home',
      '/login': 'login',
      '/registro': 'registro',
      '/resultados': 'resultados',
      '/asientos/:id': 'asientos',
      '/checkout': 'checkout',
      '/confirmacion/:id': 'confirmacion',
      '/mis-reservas': 'mis-reservas',
      '/perfil': 'perfil',
      '/admin': 'admin/dashboard',
      '/admin/rutas': 'admin/rutas',
      '/admin/buses': 'admin/buses',
      '/admin/horarios': 'admin/horarios',
      '/admin/reservas': 'admin/reservas',
      '/admin/usuarios': 'admin/usuarios',
    };

    const viewName = viewMap[matched];
    if(!viewName) return;

    const root = document.getElementById('app-root');
    root.innerHTML = '<div class="flex justify-center py-20"><div class="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>';

    try{
      const base = document.querySelector('base')?.href || location.href.replace(/[^/]*$/, '');
      const res = await fetch(`${base}views/${viewName}.html?v=${Date.now()}`);
      if(!res.ok) throw new Error('View not found');
      const html = await res.text();
      root.innerHTML = html;
      root.firstElementChild?.classList.add('view-enter');
    }catch(e){
      root.innerHTML = `<div class="text-center py-20 text-slate-500"><p class="text-6xl mb-4">🚌</p><p class="text-xl font-bold">Página no encontrada</p><button onclick="Router.go('/')" class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg">Volver al inicio</button></div>`;
    }

    // Ejecutar init de la página
    if(ROUTES[matched]) await ROUTES[matched](params);

    // Actualizar header con estado de sesión
    if(window.Header) Header.render();

    // Scroll top
    window.scrollTo(0,0);
  },

  _match(pattern, path){
    const patParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);
    if(patParts.length !== pathParts.length) return null;
    const params = {};
    for(let i=0; i<patParts.length; i++){
      if(patParts[i].startsWith(':')){
        params[patParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
      } else if(patParts[i] !== pathParts[i]){
        return null;
      }
    }
    return params;
  }
};
