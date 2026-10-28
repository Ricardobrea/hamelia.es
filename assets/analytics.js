/* Configured site token. Prior consent and exact HTTPS origin remain mandatory.
   Local preparation only: publication requires separate approval. */
(() => {
  if (window.__hameliaPrivacy) return;
  window.__hameliaPrivacy = true;
  const CONFIG = Object.freeze({enabled: true, token: '370e6ef8df4e4af2912b860940cb37e8', version: '2026-10-28'});
  const KEY = 'hamelia.statistics.choice';
  const LIFETIME = 180 * 24 * 60 * 60 * 1000;
  const TEXT = {"es": {"entry": "Preferencias de estadísticas", "title": "Estadísticas opcionales", "intro": "Si lo aceptas, Cloudflare Web Analytics nos ayuda a conocer visitas, páginas, países, fuentes de tráfico y rendimiento de esta web informativa. Según el proveedor, no utiliza cookies, identificadores persistentes ni fingerprinting para estas estadísticas. No recibe datos de embarazo de la app Android.", "choice": "Aceptar es opcional. Rechazar permite seguir usando toda la web. Puedes cambiar tu decisión aquí en cualquier momento.", "accept": "Aceptar estadísticas", "reject": "Rechazar / desactivar", "close": "Cerrar", "policy": "Política de privacidad", "inactive": "La analítica está desactivada en esta versión o en este entorno. No se carga Cloudflare.", "on": "Estadísticas permitidas en este navegador.", "off": "Estadísticas desactivadas en este navegador.", "unknown": "No has dado tu consentimiento: Cloudflare no se ha cargado.", "storage": "No se pudo guardar la preferencia. Sin una preferencia válida, las próximas visitas no cargarán la analítica.", "stored": "Recordamos tu elección durante seis meses en este navegador mediante almacenamiento local, solo para gestionar esta preferencia."}, "en": {"entry": "Statistics preferences", "title": "Optional statistics", "intro": "If you agree, Cloudflare Web Analytics helps us understand visits, pages, countries, traffic sources and performance on this informational website. According to the provider, it uses no cookies, persistent identifiers or fingerprinting for these statistics. It does not receive pregnancy data from the Android app.", "choice": "Acceptance is optional. Rejecting leaves the whole website available. You can change your choice here at any time.", "accept": "Accept statistics", "reject": "Reject / disable", "close": "Close", "policy": "Privacy policy", "inactive": "Analytics is disabled in this version or environment. Cloudflare is not loaded.", "on": "Statistics allowed in this browser.", "off": "Statistics disabled in this browser.", "unknown": "You have not consented: Cloudflare has not been loaded.", "storage": "The preference could not be saved. Without a valid preference, future visits will not load analytics.", "stored": "We remember your choice for six months in this browser using local storage solely to manage this preference."}, "pt-br": {"entry": "Preferências de estatísticas", "title": "Estatísticas opcionais", "intro": "Se você aceitar, o Cloudflare Web Analytics nos ajuda a entender visitas, páginas, países, fontes de tráfego e desempenho deste site informativo. Segundo o fornecedor, não utiliza cookies, identificadores persistentes nem fingerprinting para essas estatísticas. Não recebe dados da gravidez do aplicativo Android.", "choice": "Aceitar é opcional. Recusar mantém todo o site disponível. Você pode mudar sua escolha aqui a qualquer momento.", "accept": "Aceitar estatísticas", "reject": "Recusar / desativar", "close": "Fechar", "policy": "Política de privacidade", "inactive": "A análise está desativada nesta versão ou neste ambiente. O Cloudflare não é carregado.", "on": "Estatísticas permitidas neste navegador.", "off": "Estatísticas desativadas neste navegador.", "unknown": "Você não deu seu consentimento: o Cloudflare não foi carregado.", "storage": "Não foi possível salvar a preferência. Sem uma preferência válida, as próximas visitas não carregarão a análise.", "stored": "Lembramos sua escolha por seis meses neste navegador usando armazenamento local somente para gerenciar esta preferência."}, "ar": {"entry": "تفضيلات الإحصاءات", "title": "إحصاءات اختيارية", "intro": "لو وافقتي، Cloudflare Web Analytics بيساعدنا نفهم الزيارات والصفحات والبلدان ومصادر الزيارات وأداء الموقع التعريفي ده. حسب المزوّد، الإحصاءات دي مش بتستخدم ملفات تعريف ارتباط أو معرّفات دائمة أو بصمة رقمية. ومش بتستقبل بيانات الحمل من تطبيق أندرويد.", "choice": "الموافقة اختيارية. لو رفضتي، تقدري تستخدمي الموقع كله عادي. وتقدري تغيّري اختيارك من هنا في أي وقت.", "accept": "الموافقة على الإحصاءات", "reject": "رفض / إيقاف", "close": "إغلاق", "policy": "سياسة الخصوصية", "inactive": "الإحصاءات متوقفة في النسخة أو البيئة دي. Cloudflare مش بيتحمّل.", "on": "الإحصاءات مسموح بيها في المتصفح ده.", "off": "الإحصاءات متوقفة في المتصفح ده.", "unknown": "لسه مفيش موافقة: Cloudflare ما اتحمّلش.", "storage": "ما قدرناش نحفظ التفضيل. من غير تفضيل صالح، الإحصاءات مش هتتحمّل في الزيارات الجاية.", "stored": "بنفتكر اختيارك لمدة ست شهور في المتصفح ده، باستخدام التخزين المحلي لإدارة التفضيل ده بس."}};
  const lang = document.documentElement.lang.toLowerCase();
  const code = lang.startsWith('ar') ? 'ar' : lang.startsWith('pt') ? 'pt-br' : lang.startsWith('es') ? 'es' : 'en';
  const t = TEXT[code];
  const entry = document.querySelector('[data-statistics-preferences]');
  const eligible = location.protocol === 'https:' && ['hamelia.es', 'www.hamelia.es'].includes(location.hostname);
  const configured = CONFIG.enabled && /^[a-f0-9]{32}$/i.test(CONFIG.token);
  const available = eligible && configured;
  let choice = null, allowed = false, script = null, guarded = false, storageFailed = false;
  const inFlight = new Set();
  function read() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return null;
      const record = JSON.parse(raw);
      if (record.version !== CONFIG.version || !['accepted', 'rejected'].includes(record.choice) || !Number.isFinite(record.expires) || record.expires <= Date.now() || record.expires > Date.now() + LIFETIME + 60000) return null;
      // Do not restore an old opt-in if the preference can no longer be written.
      localStorage.setItem(KEY, raw);
      return record.choice;
    } catch { return null; }
  }
  function save(value) {
    choice = value;
    try {
      localStorage.setItem(KEY, JSON.stringify({choice:value, expires:Date.now() + LIFETIME, version:CONFIG.version}));
      storageFailed = false;
    } catch {
      storageFailed = true;
      // Best effort: remove any stale opt-in; blocked storage defaults to no load.
      try { localStorage.removeItem(KEY); } catch {}
    }
  }
  function target(url) {
    try { return ['cloudflareinsights.com','static.cloudflareinsights.com'].includes(new URL(url, location.href).hostname); }
    catch { return false; }
  }
  function guardTransport() {
    if (guarded) return; guarded = true;
    // Only gate the analytics provider. No effect on other website requests.
    // This also blocks late unload callbacks after withdrawal, before reloading.
    const nativeFetch = window.fetch.bind(window);
    window.fetch = function(input, init) {
      if (!target(typeof input === 'string' || input instanceof URL ? input : input.url)) return nativeFetch(input, init);
      if (!allowed) return Promise.reject(new DOMException('Analytics disabled', 'AbortError'));
      const controller = new AbortController(); inFlight.add(controller);
      const external = init?.signal || (input instanceof Request ? input.signal : null);
      if (external?.aborted) controller.abort();
      const abort = () => controller.abort();
      external?.addEventListener('abort', abort, {once:true});
      return nativeFetch(input, {...init, signal:controller.signal}).finally(() => { inFlight.delete(controller); external?.removeEventListener('abort', abort); });
    };
    if (navigator.sendBeacon) {
      const nativeBeacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = (url, data) => target(url) && !allowed ? false : nativeBeacon(url, data);
    }
    const open = XMLHttpRequest.prototype.open, send = XMLHttpRequest.prototype.send;
    const destinations = new WeakMap();
    XMLHttpRequest.prototype.open = function(method, url, ...rest) { destinations.set(this, target(url)); return open.call(this, method, url, ...rest); };
    XMLHttpRequest.prototype.send = function(body) { if (destinations.get(this) && !allowed) return; return send.call(this, body); };
  }
  function load() {
    if (!available || choice !== 'accepted' || script) return;
    allowed = true; guardTransport();
    script = document.createElement('script');
    script.id = 'hamelia-cloudflare-beacon'; script.defer = true;
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.dataset.cfBeacon = JSON.stringify({token:CONFIG.token});
    document.body.append(script);
  }
  function revoke() {
    allowed = false;
    inFlight.forEach(controller => controller.abort()); inFlight.clear();
    if (script) {
      script.remove();
      // Reload discards vendor listeners; the persisted rejection prevents reload.
      location.reload();
    }
  }
  const dialog = document.createElement('dialog');
  dialog.className = 'hamelia-privacy-dialog'; dialog.lang = code === 'pt-br' ? 'pt-BR' : code;
  dialog.dir = code === 'ar' ? 'rtl' : 'ltr';
  dialog.setAttribute('aria-labelledby','hamelia-privacy-title');
  dialog.setAttribute('aria-describedby','hamelia-privacy-intro');
  function node(tag, text, className) {
    const element = document.createElement(tag); element.textContent = text;
    if (className) element.className = className;
    return element;
  }
  const title = node('h2',t.title); title.id = 'hamelia-privacy-title';
  const intro = node('p',t.intro); intro.id = 'hamelia-privacy-intro';
  const status = node('p',''); status.setAttribute('role','status');
  const actions = node('div','','hamelia-privacy-actions');
  const accept = node('button',t.accept); accept.type = 'button'; accept.dataset.analyticsAccept = '';
  const reject = node('button',t.reject); reject.type = 'button'; reject.dataset.analyticsReject = '';
  accept.disabled = !available; actions.append(accept,reject);
  const bottom = node('div','','hamelia-privacy-bottom');
  const policy = node('a',t.policy); policy.href = lang === 'und' ? 'en/privacy.html' : 'privacy.html';
  const close = node('button',t.close,'hamelia-privacy-close'); close.type = 'button';
  bottom.append(policy,close);
  dialog.append(title,intro,node('p',t.choice),status,actions,node('p',t.stored,'hamelia-privacy-note'),bottom);
  document.body.append(dialog);
  function update() {
    status.textContent = storageFailed ? t.storage : !available ? t.inactive : choice === 'accepted' ? t.on : choice === 'rejected' ? t.off : t.unknown;
  }
  function show() { update(); if (!dialog.open) dialog.showModal(); }
  entry.addEventListener('click', show);
  close.addEventListener('click', () => dialog.close());
  accept.addEventListener('click', () => { if (!available) return; save('accepted'); load(); update(); dialog.close(); });
  reject.addEventListener('click', () => { save('rejected'); update(); dialog.close(); revoke(); });
  window.addEventListener('storage', event => {
    if (event.key !== KEY && event.key !== null) return;
    choice = read(); update();
    if (choice !== 'accepted') revoke();
    // A new opt-in is applied on navigation, not injected into other open tabs.
  });
  choice = read(); update();
  if (available && choice === 'accepted') load();
  else if (available && choice === null) show();
})();
