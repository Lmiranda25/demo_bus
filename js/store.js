/* js/store.js — Wrapper localStorage con seed desde JSON */

const KEYS = { ciudades:'tc_ciudades', rutas:'tc_rutas', buses:'tc_buses', horarios:'tc_horarios', usuarios:'tc_usuarios', reservas:'tc_reservas' };

const Store = {
  get(key){ try{ return JSON.parse(localStorage.getItem(KEYS[key])||'null'); }catch{ return null; } },
  set(key, data){ localStorage.setItem(KEYS[key], JSON.stringify(data)); },
  all(key){ return Store.get(key) || []; },

  find(key, id){ return Store.all(key).find(x => x.id === id) || null; },

  add(key, item){
    const list = Store.all(key);
    list.push(item);
    Store.set(key, list);
    return item;
  },

  update(key, id, patch){
    const list = Store.all(key).map(x => x.id===id ? {...x,...patch} : x);
    Store.set(key, list);
    return list.find(x=>x.id===id);
  },

  remove(key, id){
    const list = Store.all(key).filter(x => x.id !== id);
    Store.set(key, list);
  },

  genId(prefix='id'){
    return prefix + Date.now() + Math.random().toString(36).slice(2,6);
  },

  async seed(){
    const SEED_V = '3'; // incrementar aquí para forzar re-seed global
    const files  = ['ciudades','rutas','buses','horarios','usuarios','reservas'];
    const base   = document.baseURI.replace(/#.*$/,'').replace(/[^/]*$/, '');

    // Si la versión del seed no coincide, limpiar todo y re-sembrar
    if(localStorage.getItem('tc_seed_v') !== SEED_V){
      Object.keys(KEYS).forEach(k => localStorage.removeItem(KEYS[k]));
      localStorage.setItem('tc_seed_v', SEED_V);
      console.log('Seed: nueva versión, limpiando localStorage...');
    }

    for(const f of files){
      if(Store.get(f) === null){
        try{
          const res = await fetch(`${base}data/${f}.json`);
          if(res.ok){ Store.set(f, await res.json()); }
          else { console.warn('Seed HTTP',res.status,f); }
        }catch(e){ console.warn('Seed failed:',f,e); }
      }
    }
  },

  clear(){
    Object.keys(KEYS).forEach(k => localStorage.removeItem(KEYS[k]));
  }
};
