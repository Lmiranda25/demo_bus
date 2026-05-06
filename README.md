# TransCorp — Demo de Venta de Pasajes 🚌

Demo completo de una plataforma de venta de pasajes de bus para Perú. Construido con **HTML + Tailwind CSS CDN + Vanilla JavaScript** puro. Sin backend. Sin build step. Todos los datos viven en `localStorage`.

## 🚀 Cómo ejecutar

> ⚠️ **IMPORTANTE**: Este proyecto usa `fetch()` para cargar las vistas HTML y los datos JSON. **No abrirlo directamente con `file://`** — el navegador bloqueará las peticiones.

### Opción 1: VS Code Live Server (recomendado)
1. Instala la extensión **Live Server** en VS Code.
2. Clic derecho en `index.html` → **Open with Live Server**.
3. Se abrirá en `http://127.0.0.1:5500`.

### Opción 2: Python
```bash
cd "demo - bus"
python -m http.server 8080
# Abrir http://localhost:8080
```

### Opción 3: Node.js
```bash
npx serve .
```

## 🔑 Credenciales de demo

| Rol | Email | Contraseña |
|-----|-------|-----------|
| **Admin** | `admin@demo.com` | `admin123` |
| **Cliente** | `carlos@demo.com` | `123456` |
| Cliente | `ana@demo.com` | `123456` |
| Cliente | `pedro@demo.com` | `123456` |

## 🌐 Desplegar en GitHub Pages

1. Sube el repositorio a GitHub.
2. Ve a **Settings → Pages**.
3. En *Source*, selecciona `main` branch, carpeta `/ (root)`.
4. GitHub Pages te dará una URL como `https://usuario.github.io/repo/`.
5. El archivo `.nojekyll` ya está incluido para que GitHub no ignore las carpetas que empiezan con `_`.

## 📁 Estructura del proyecto

```
├── index.html              # Shell SPA
├── 404.html                # Igual que index.html (para hash routing en GH Pages)
├── .nojekyll               # Evita procesamiento Jekyll
├── assets/
│   └── css/styles.css      # CSS personalizado (seats, toasts, modal, print...)
├── data/
│   ├── ciudades.json       # 12 ciudades peruanas
│   ├── rutas.json          # 20 rutas
│   ├── buses.json          # 12 buses (Económico, Ejecutivo, VIP, Cama...)
│   ├── horarios.json       # 35 horarios semilla
│   ├── usuarios.json       # 8 usuarios (1 admin + 7 clientes)
│   └── reservas.json       # 30 reservas semilla
├── js/
│   ├── store.js            # localStorage wrapper + carga de seeds
│   ├── auth.js             # Login / Registro / Sesión
│   ├── router.js           # Hash router (#/ruta)
│   ├── ui.js               # Toast, Modal, helpers
│   ├── main.js             # Bootstrap
│   ├── components/
│   │   ├── header.js       # Header dinámico con menú de usuario
│   │   └── footer.js       # Footer estático
│   └── pages/
│       ├── home.js         # Buscador principal
│       ├── login.js        # Inicio de sesión
│       ├── registro.js     # Registro de usuario
│       ├── resultados.js   # Lista de horarios disponibles
│       ├── asientos.js     # Mapa de asientos interactivo
│       ├── checkout.js     # Datos + métodos de pago
│       ├── confirmacion.js # Boleto + descarga PDF
│       ├── misReservas.js  # Historial de reservas del usuario
│       ├── perfil.js       # Datos personales + cambio de contraseña
│       └── admin/
│           ├── dashboard.js  # KPIs y estadísticas
│           ├── rutas.js      # CRUD rutas
│           ├── buses.js      # CRUD buses
│           ├── horarios.js   # CRUD horarios
│           ├── reservas.js   # Gestión de reservas
│           └── usuarios.js   # Gestión de usuarios
└── views/
    ├── home.html, login.html, registro.html, resultados.html
    ├── asientos.html, checkout.html, confirmacion.html
    ├── mis-reservas.html, perfil.html
    └── admin/
        ├── dashboard.html, rutas.html, buses.html
        ├── horarios.html, reservas.html, usuarios.html
```

## ✨ Funcionalidades

- **Búsqueda de rutas** por origen, destino y fecha
- **Mapa de asientos** interactivo (1 o 2 pisos, layouts 2/3/4 columnas)
- **5 métodos de pago** simulados: Tarjeta, Yape (QR), Plin (QR), Culqi, MercadoPago
- **Confirmación** con boleto imprimible (PDF vía `window.print()`)
- **Notificaciones** de correo y WhatsApp simuladas (toast)
- **Mis Reservas** con cancelación y reimpresión de boleto
- **Panel Admin** con CRUD completo de rutas, buses, horarios, reservas y usuarios
- **Mobile-first** responsive 100%

## 🎨 Paleta corporativa

| Token | Color |
|-------|-------|
| `corporate-50` | `#f0f4f8` |
| `corporate-100` | `#d9e2ec` |
| `corporate-500` | `#334e68` |
| `corporate-700` | `#243b53` |
| `corporate-900` | `#102a43` |
