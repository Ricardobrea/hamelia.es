/* Add future languages here and as ordinary links in index.html. */
(() => {
  const phrases = [
    {lang:'es', dir:'ltr', text:'Acompaña tu embarazo semana a semana'},
    {lang:'en', dir:'ltr', text:'Your pregnancy, week by week'},
    {lang:'pt-BR', dir:'ltr', text:'Acompanhe sua gravidez semana a semana'},
    {lang:'ar', dir:'rtl', text:'رافقي حملك أسبوعًا بعد أسبوع'}
  ];
  const stage = document.querySelector('.phrase-stage');
  const first = stage.querySelector('.phrase');
  const second = first.cloneNode(false);
  stage.append(second);
  const labels = [first, second];
  const toggle = document.querySelector('.motion-toggle');
  const menu = document.querySelector('.selector-controls details');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animations = [], paused = false, resizeTimer, generation = 0, previousPair = '', bag = [];
  const random = (min, max) => min + Math.random() * (max - min);
  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }
  function pair() {
    if (bag.length < 2) bag = shuffle(phrases.map((_, i) => i));
    let picked = bag.splice(0, 2);
    if ([...picked].sort().join() === previousPair) {
      // Exchange one item with the bag instead of repeating the same couple.
      [picked[1], bag[0]] = [bag[0], picked[1]];
    }
    previousPair = [...picked].sort().join();
    return shuffle(picked);
  }
  function syncPlayback() {
    for (const animation of animations) {
      if (paused || document.hidden) animation.pause(); else animation.play();
    }
  }
  function show() {
    const current = ++generation;
    animations.forEach(animation => animation.cancel()); animations = [];
    toggle.hidden = reduced.matches;
    const picked = pair(), area = stage.clientWidth;
    labels.forEach((label, lane) => {
      const item = phrases[picked[lane]];
      label.textContent = item.text; label.lang = item.lang; label.dir = item.dir;
      label.style.cssText = '';
      label.dataset.lane = lane;
      label.style.fontSize = `${parseFloat(getComputedStyle(label).fontSize) * random(.88, 1.04)}px`;
      // Two independent bands with a measured safe gap, even for Arabic diacritics.
      const maximum = 118;
      if (label.offsetHeight > maximum) {
        label.style.fontSize = `${parseFloat(label.style.fontSize) * maximum / label.offsetHeight}px`;
      }
      const top = lane * 143 + random(5, 15);
      label.style.top = `${top}px`;
      if (reduced.matches) {
        label.style.top = `${lane * 143 + 10}px`;
        label.style.visibility = 'visible';
        return;
      }
      const width = label.getBoundingClientRect().width;
      const distance = random(.35, .72) * area + Math.min(width, area) * .22;
      const start = item.dir === 'rtl'
        ? area * random(.3, .8) - width
        : area * random(.08, .65);
      const end = item.dir === 'rtl'
        ? Math.min(start + distance, area - width * .12)
        : Math.max(start - distance, -width * .88);
      const duration = random(7600, 10300);
      const delay = lane ? random(550, 950) : 0;
      const frames = [
        {transform:`translateX(${start}px)`, opacity:0, offset:0},
        {transform:`translateX(${start + (end - start) * .15}px)`, opacity:1, offset:.15},
        {transform:`translateX(${start + (end - start) * .78}px)`, opacity:1, offset:.78},
        {transform:`translateX(${end}px)`, opacity:0, offset:1}
      ];
      animations.push(label.animate(frames, {duration, delay, easing:'linear', fill:'both'}));
      label.style.visibility = 'visible';
    });
    if (!reduced.matches) {
      syncPlayback();
      Promise.all(animations.map(animation => animation.finished)).then(() => {
        if (generation === current) show();
      }).catch(() => {}); // Cancelled by resize or a change in motion preference.
    }
  }
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play animation / Reanudar animación' : 'Pause animation / Pausar animación');
    toggle.firstElementChild.textContent = paused ? '▷' : 'Ⅱ';
    syncPlayback();
  });
  document.addEventListener('visibilitychange', syncPlayback);
  reduced.addEventListener('change', show);
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(show, 150); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); }
  });
  document.addEventListener('click', event => { if (!menu.contains(event.target)) menu.open = false; });
  labels.forEach(label => { label.style.visibility = 'hidden'; });
  Promise.all([
    document.fonts.load('500 96px HameliaCaveat'),
    document.fonts.load('400 80px HameliaQuicksand'),
    document.fonts.load('500 91px HameliaCormorant'),
    document.fonts.load('500 88px HameliaNaskh')
  ]).then(show, show);
})();
