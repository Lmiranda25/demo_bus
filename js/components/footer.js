/* js/components/footer.js */

const Footer = {
  render(){
    const el = document.getElementById('app-footer');
    if(!el) return;
    el.innerHTML = `
    <footer class="bg-corporate-900 text-slate-400 mt-auto">
      <div class="container mx-auto px-4 max-w-6xl py-10">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div class="flex items-center gap-2 mb-3">
              <svg class="h-7 w-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <rect x="2" y="7" width="20" height="12" rx="2" stroke-width="2"/>
                <path d="M2 11h20M7 19v2M17 19v2M6 7V5a2 2 0 012-2h8a2 2 0 012 2v2" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <span class="text-white font-bold text-lg">Trans<span class="text-blue-400">Corp</span></span>
            </div>
            <p class="text-sm leading-relaxed">Tu empresa de transporte terrestre de confianza. Conectando el Perú desde 1998.</p>
          </div>
          <div>
            <h4 class="text-white font-bold mb-3 text-sm uppercase tracking-wider">Servicios</h4>
            <ul class="space-y-2 text-sm">
              <li><a href="#/" class="hover:text-blue-300 transition">Comprar Pasajes</a></li>
              <li><a href="#/mis-reservas" class="hover:text-blue-300 transition">Mis Reservas</a></li>
              <li><span class="cursor-default">Encomiendas</span></li>
              <li><span class="cursor-default">Buses Charter</span></li>
            </ul>
          </div>
          <div>
            <h4 class="text-white font-bold mb-3 text-sm uppercase tracking-wider">Contacto</h4>
            <ul class="space-y-2 text-sm">
              <li>📞 (01) 234-5678</li>
              <li>📱 +51 999 000 123</li>
              <li>✉️ soporte@transcorp.pe</li>
              <li>🕐 24 horas, 7 días</li>
            </ul>
          </div>
        </div>
        <div class="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs">
          <p>&copy; 2026 TransCorp S.A.C. — Demo de Sistema de Venta de Pasajes</p>
          <p class="text-slate-500">HTML + Tailwind CSS + JavaScript Vanilla · GitHub Pages</p>
        </div>
      </div>
    </footer>`;
  }
};
