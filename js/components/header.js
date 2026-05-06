/* js/components/header.js */

const Header = {
  render(){
    const el = document.getElementById('app-header');
    if(!el) return;
    const session = Auth.getSession();
    const path = location.hash.replace('#','') || '/';
    const isAdmin = session?.rol === 'admin';

    el.innerHTML = `
    <header class="bg-corporate-900 text-white shadow-md sticky top-0 z-50">
      <div class="container mx-auto px-4 max-w-6xl">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a href="#/" class="flex items-center gap-2 group">
            <svg class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <rect x="2" y="7" width="20" height="12" rx="2" stroke-width="2"/>
              <path d="M2 11h20M7 19v2M17 19v2M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke-width="2" stroke-linecap="round"/>
              <circle cx="7" cy="15" r="1" fill="currentColor"/>
              <circle cx="17" cy="15" r="1" fill="currentColor"/>
            </svg>
            <span class="text-xl font-bold tracking-tight">Trans<span class="text-blue-400">Corp</span></span>
          </a>

          <!-- Nav desktop -->
          <nav class="hidden md:flex items-center gap-5 text-sm font-medium">
            <a href="#/" class="hover:text-blue-300 transition ${path==='/'?'text-blue-300':''}">Inicio</a>
            <a href="#/" class="hover:text-blue-300 transition">Rutas</a>
            ${isAdmin ? `<a href="#/admin" class="hover:text-blue-300 transition ${path.startsWith('/admin')?'text-blue-300':''}">Panel Admin</a>` : ''}
            <div class="h-5 w-px bg-white/20"></div>
            ${session
              ? `<div class="flex items-center gap-3">
                   <span class="text-slate-300 text-xs">Hola, <strong class="text-white">${session.nombre.split(' ')[0]}</strong></span>
                   <div class="relative group">
                     <button class="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition">
                       <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                       <svg class="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
                     </button>
                     <div class="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-xl border border-slate-100 py-1 hidden group-hover:block z-50 text-slate-700">
                       <a href="#/mis-reservas" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"><svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>Mis Reservas</a>
                       <a href="#/perfil" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"><svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>Mi Perfil</a>
                       ${isAdmin ? `<a href="#/admin" class="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-50"><svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>Admin</a>` : ''}
                       <hr class="my-1 border-slate-100">
                       <button onclick="Header.logout()" class="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-red-50 text-red-600"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>Cerrar Sesión</button>
                     </div>
                   </div>
                 </div>`
              : `<a href="#/login" class="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition text-sm font-bold">
                   <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/></svg>
                   Ingresar
                 </a>`
            }
          </nav>

          <!-- Hamburguesa móvil -->
          <button id="hamburger" class="md:hidden p-2 rounded-lg hover:bg-white/10 transition" aria-label="Menú">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>

        <!-- Menú móvil -->
        <div id="mobile-menu" class="md:hidden hidden pb-4 border-t border-white/10 pt-3 space-y-1">
          <a href="#/" class="block px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm">🏠 Inicio</a>
          ${session ? `
            <a href="#/mis-reservas" class="block px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm">🎟️ Mis Reservas</a>
            <a href="#/perfil" class="block px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm">👤 Mi Perfil</a>
            ${isAdmin ? `<a href="#/admin" class="block px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm">⚙️ Panel Admin</a>` : ''}
            <button onclick="Header.logout()" class="w-full text-left px-3 py-2 rounded-lg hover:bg-red-600/30 transition text-sm text-red-300">🚪 Cerrar Sesión</button>
          ` : `
            <a href="#/login" class="block px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm">🔐 Ingresar</a>
            <a href="#/registro" class="block px-3 py-2 rounded-lg hover:bg-white/10 transition text-sm">📝 Registrarse</a>
          `}
        </div>
      </div>
    </header>`;

    // Toggle hamburguesa
    const ham = document.getElementById('hamburger');
    const mob = document.getElementById('mobile-menu');
    if(ham && mob) ham.onclick = () => mob.classList.toggle('hidden');
  },

  logout(){
    Auth.logout();
    Header.render();
    Router.go('/');
    UI.toast('Sesión cerrada','Hasta pronto 👋','info');
  }
};
