/* La Baita Lounge v4: wiring + motion. Reads everything from window.LA_BAITA (config.js). */
(() => {
  const C = window.LA_BAITA || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;

  // ?reduce and ?lite force the reduced-motion and data-saver paths for testing
  const q = location.search;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || /[?&]reduce\b/.test(q);
  const conn = navigator.connection || {};
  const slowNet = conn.saveData || /(^|-)(2g|3g)$/.test(conn.effectiveType || '') || /[?&]lite\b/.test(q);
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  const motion = hasGsap && !reduce;
  root.classList.add(motion ? 'js-motion' : 'no-motion');
  const isPhone = () => innerWidth <= 760;

  /* ---------- Config wiring ---------- */
  const app = C.appUrls || {};
  const wa = text => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text || C.whatsappText || '')}`;
  const waTexts = C.whatsappTexts || {};
  const ctaHref = kind => {
    if (kind === 'whatsapp') return wa();
    if (kind === 'call') return `tel:${C.phone}`;
    if (kind === 'delivery') return app.delivery || app.order || wa(waTexts.delivery);
    return app[kind] || wa(); // empty app URL falls back to WhatsApp
  };
  const menuCatHref = cat => app.menu ? (C.menuCategoryUrl || '{menu}').replace('{menu}', app.menu).replace('{cat}', cat) : wa();
  const openExternal = a => { if (/^https?:/.test(a.href) && !a.href.startsWith(location.origin)) { a.target = '_blank'; a.rel = 'noopener'; } };

  $$('[data-cta]').forEach(a => { a.href = ctaHref(a.dataset.cta); if (a.href.startsWith('https://wa.me')) openExternal(a); });
  $$('[data-wa]').forEach(a => { a.href = wa(waTexts[a.dataset.wa]); openExternal(a); });
  $$('[data-menu-cat]').forEach(a => { a.href = menuCatHref(a.dataset.menuCat); });
  $$('[data-link]').forEach(a => { const url = C[a.dataset.link]; if (url) a.href = url; else a.hidden = true; });
  $$('[data-text]').forEach(el => { if (C[el.dataset.text]) el.textContent = C[el.dataset.text]; });
  $('#yr').textContent = new Date().getFullYear();

  const watch = (el, cb, margin = '0px') => {
    if (!el) return;
    new IntersectionObserver(([e]) => cb(e.isIntersecting), { rootMargin: margin }).observe(el);
  };

  /* ---------- Floating header: always in place; a gold line fills as you scroll ---------- */
  const nav = $('#nav'), progress = $('.nav-progress');
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    nav.classList.toggle('scrolled', scrollY > 40);
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  /* ---------- Tickers: repeat the words so the loop never shows a gap ---------- */
  $$('.tick-track').forEach(track => {
    const base = track.innerHTML;
    let set = base;
    track.innerHTML = set;
    while (track.scrollWidth < innerWidth * 1.3 && set.length < base.length * 8) { set += base; track.innerHTML = set; }
    track.innerHTML = set + set; // two identical halves, animated by -50%
  });

  /* ---------- Tap feedback on both bars (a quick ripple from the touch point) ---------- */
  $$('.nav a, .nav button, .actionbar a, .actionbar button, .fab-wa').forEach(el => el.addEventListener('pointerdown', e => {
    const r = el.getBoundingClientRect(), dot = document.createElement('span');
    dot.className = 'ripple';
    dot.style.left = (e.clientX - r.left) + 'px'; dot.style.top = (e.clientY - r.top) + 'px';
    el.appendChild(dot);
    setTimeout(() => dot.remove(), 600);
  }));

  /* ---------- Header / dock design (config.navStyle, or ?nav=a|b|c|d to preview) ----------
     a = one gold bottom dock, no top bar        b = one white top bar + WhatsApp button
     c = clear top bar on the hero, swaps to a dark bottom dock after it
     d = one gold top bar + WhatsApp button      "" = original two bars */
  const navStyle = (q.match(/[?&]nav=([a-d])\b/) || [])[1] || C.navStyle || '';
  if (navStyle) root.dataset.nav = navStyle;
  const heroEl = $('.hero');
  const pastHero = () => root.classList.toggle('past-hero', scrollY > heroEl.offsetHeight - 140);
  addEventListener('scroll', pastHero, { passive: true });
  pastHero();

  /* ---------- Mobile menu (opened from the top bar or the dock) ---------- */
  const burgers = $$('.nav-burger, .ab-menu'), sheet = $('#mobileMenu');
  sheet.setAttribute('role', 'dialog'); sheet.setAttribute('aria-modal', 'true'); sheet.setAttribute('aria-label', 'Site menu');
  // While the menu is open, everything behind it is inert, so Tab and screen readers stay in the menu and its close buttons
  const behind = $$('#main, .footer, .fab-wa, .actionbar > :not(.ab-menu)');
  let menuOpen = false;
  const setMenu = open => {
    menuOpen = open;
    sheet.hidden = !open;
    root.classList.toggle('menu-open', open);
    behind.forEach(el => { el.inert = open; });
    burgers.forEach(b => { b.setAttribute('aria-expanded', String(open)); b.setAttribute('aria-label', open ? 'Close menu' : 'Open menu'); });
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) $('a', sheet).focus({ preventScroll: true });
  };
  burgers.forEach(b => b.addEventListener('click', () => setMenu(!menuOpen)));
  const burger = burgers[0];
  sheet.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && menuOpen) { setMenu(false); (burgers.find(b => b.offsetParent) || burger).focus(); } });

  /* ---------- Smooth in-page links (JS, not CSS scroll-behavior, which breaks ScrollTrigger) ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    const target = $(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + scrollY - (target.id === 'top' ? 0 : 76);
    scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', a.getAttribute('href'));
  });
  const navLinks = $$('.nav-links a');
  navLinks.forEach(a => {
    const sec = $(a.getAttribute('href'));
    if (sec) new IntersectionObserver(([e]) => { if (e.isIntersecting) navLinks.forEach(l => l.classList.toggle('active', l === a)); }, { rootMargin: '-45% 0px -50% 0px' }).observe(sec);
  });

  /* ---------- Hero video (after load; skipped on reduced motion / data saver) ---------- */
  const video = $('.hero-video');
  if (!reduce && !slowNet) {
    const start = () => {
      video.src = matchMedia('(min-width: 761px)').matches ? video.dataset.mp4Wide : video.dataset.mp4;
      video.addEventListener('playing', () => video.classList.add('playing'), { once: true });
      watch($('.hero'), vis => { vis ? video.play().catch(() => {}) : video.pause(); });
    };
    const idle = window.requestIdleCallback || (cb => setTimeout(cb, 300));
    if (document.readyState === 'complete') idle(start); else addEventListener('load', () => idle(start), { once: true });
  } else {
    video.remove();
  }

  /* ---------- Bar shelf labels ---------- */
  const shelfInner = $('#shelfInner'), card = $('#shelfCard'), bar = $('.bar');
  let openTag = null;
  $('.shelf-link', card).href = ctaHref('menu'); // QA ISSUE-004: never a dead "#" link, even before a label is tapped
  const closeCard = () => { card.hidden = true; if (openTag) { openTag.setAttribute('aria-expanded', 'false'); openTag = null; } };
  (C.barShelf || []).forEach(item => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'tag'; b.textContent = item.name;
    b.style.left = item.x + '%'; b.style.top = item.y + '%';
    b.setAttribute('aria-expanded', 'false'); b.setAttribute('aria-controls', 'shelfCard');
    b.addEventListener('click', e => {
      e.stopPropagation();
      if (openTag === b) { closeCard(); return; }
      closeCard();
      openTag = b; b.setAttribute('aria-expanded', 'true');
      $('#shelfCardTitle').textContent = item.name;
      $('.shelf-brands', card).textContent = item.brands;
      $('.shelf-link', card).href = menuCatHref(item.cat);
      card.hidden = false;
      if (!isPhone()) {
        const br = bar.getBoundingClientRect(), tr = b.getBoundingClientRect();
        const w = card.offsetWidth, h = card.offsetHeight;
        const left = Math.max(16, Math.min(tr.left - br.left + tr.width / 2 - w / 2, br.width - w - 16));
        let top = tr.top - br.top - h - 14;
        if (top < 16) top = tr.bottom - br.top + 14;
        card.style.left = left + 'px'; card.style.top = top + 'px';
      } else { card.style.left = card.style.top = ''; }
      $('.shelf-close', card).focus({ preventScroll: true });
    });
    shelfInner.appendChild(b);
  });
  // One label pings at a time, moving round the shelf while it's on screen
  const tags = $$('.tag', shelfInner);
  if (!reduce && tags.length) {
    let ti = 0, tt;
    watch($('.shelf'), vis => {
      clearInterval(tt);
      tags.forEach(t => t.classList.remove('pulse'));
      if (vis) { tags[ti].classList.add('pulse'); tt = setInterval(() => { tags[ti].classList.remove('pulse'); ti = (ti + 1) % tags.length; tags[ti].classList.add('pulse'); }, 2200); }
    });
  }
  $('.shelf-close', card).addEventListener('click', () => { const t = openTag; closeCard(); t && t.focus(); });
  document.addEventListener('click', e => { if (!card.hidden && !card.contains(e.target)) closeCard(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !card.hidden) { const t = openTag; closeCard(); t && t.focus(); } });

  /* ---------- Theme nights slider ---------- */
  const evTrack = $('#evTrack'), evDots = $('#evDots');
  const events = C.events || [];
  evTrack.innerHTML = events.map(ev => `
    <a class="ev" href="${ev.url}" target="_blank" rel="noopener">
      <div class="ev-img"><img src="${ev.img}" alt="${ev.title} poster" width="560" height="700" loading="lazy"><span class="ev-when">${ev.when}</span></div>
      <div class="ev-body"><h3>${ev.title}</h3><p>${ev.text}</p></div>
    </a>`).join('');
  evDots.innerHTML = events.map(() => '<i></i>').join('');
  const evCards = $$('.ev', evTrack), dots = $$('i', evDots);
  const evActive = () => {
    // The card nearest the left snap edge is "active"; the rest dim slightly
    const pad = parseFloat(getComputedStyle(evTrack).scrollPaddingLeft) || 0;
    let best = 0, bestD = Infinity;
    evCards.forEach((c, i) => { const d = Math.abs(c.offsetLeft - evTrack.scrollLeft - pad); if (d < bestD) { bestD = d; best = i; } });
    evCards.forEach((c, i) => c.classList.toggle('dim', isPhone() && i !== best));
    dots.forEach((d, i) => d.classList.toggle('is-on', i === best));
    return best;
  };
  let evRaf;
  evTrack.addEventListener('scroll', () => { cancelAnimationFrame(evRaf); evRaf = requestAnimationFrame(evActive); }, { passive: true });
  evActive();
  const evGo = dir => {
    const i = Math.max(0, Math.min(evCards.length - 1, evActive() + dir));
    evTrack.scrollTo({ left: evCards[i].offsetLeft - (parseFloat(getComputedStyle(evTrack).scrollPaddingLeft) || 0), behavior: reduce ? 'auto' : 'smooth' });
  };
  $$('.snav').forEach(b => b.addEventListener('click', () => evGo(+b.dataset.dir)));
  evTrack.addEventListener('keydown', e => { if (e.key === 'ArrowRight') evGo(1); if (e.key === 'ArrowLeft') evGo(-1); });
  // A gentle nudge on phones so people see it swipes
  if (!reduce) {
    const nudge = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || !isPhone()) return;
      nudge.disconnect();
      setTimeout(() => { evTrack.scrollBy({ left: 70, behavior: 'smooth' }); setTimeout(() => evTrack.scrollBy({ left: -70, behavior: 'smooth' }), 450); }, 400);
    }, { threshold: 0.6 });
    nudge.observe(evTrack);
  }

  /* ---------- Social tiles ---------- */
  const reelIcon = '<svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
  $('#socialGrid').innerHTML = (C.social || []).map(s => `
    <a class="tile" href="${s.url}" target="_blank" rel="noopener" aria-label="${s.alt} (opens Instagram)">
      <img src="${s.img}" alt="${s.alt}" width="360" height="360" loading="lazy">
      ${s.type === 'reel' ? `<span class="tile-type">${reelIcon}</span>` : ''}
    </a>`).join('');

  /* ---------- Review quotes ---------- */
  const quotes = $$('.quote');
  if (!reduce && quotes.length > 1) {
    let qi = 0, qt;
    watch($('.quotes'), vis => {
      clearInterval(qt);
      if (vis) qt = setInterval(() => { quotes[qi].classList.remove('is-on'); qi = (qi + 1) % quotes.length; quotes[qi].classList.add('is-on'); }, 4500);
    });
  } else {
    $('.quotes').style.cssText = 'display:grid;gap:24px;min-height:0';
    quotes.forEach(x => { x.classList.add('is-on'); x.style.position = 'static'; });
  }

  /* ---------- Map (lazy; tap-to-load on slow networks) ---------- */
  const map = $('#map');
  const loadMap = () => {
    if (map.querySelector('iframe')) return;
    const f = document.createElement('iframe');
    f.title = 'Map to La Baita Lounge'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    f.src = 'https://maps.google.com/maps?q=La%20Baita%20Lounge%2C%20Upper%20Hill%20Road%2C%20Nairobi&z=16&output=embed';
    map.appendChild(f); map.querySelector('.map-load').hidden = true;
  };
  if (slowNet) { const b = map.querySelector('.map-load'); b.hidden = false; b.addEventListener('click', loadMap); }
  else { const mo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { loadMap(); mo.disconnect(); } }, { rootMargin: '600px' }); mo.observe(map); }

  if (!motion) return;

  /* =================== GSAP motion =================== */
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  /* Butchery to table: pinned on desktop, photo changes with each step */
  const steps = $$('.step'), frames = $$('.frame-img'), bars = $$('.frame-progress i');
  const setStep = i => {
    steps.forEach((s, k) => s.classList.toggle('is-on', k === i));
    frames.forEach((f, k) => f.classList.toggle('is-on', k === i));
    bars.forEach((b, k) => b.classList.toggle('is-on', k <= i));
  };
  mm.add('(min-width: 761px)', () => {
    setStep(0);
    ScrollTrigger.create({
      trigger: '.choma', start: 'top top', end: '+=170%', pin: '.choma-pin',
      onUpdate: self => setStep(Math.min(steps.length - 1, Math.floor(self.progress * steps.length)))
    });
    return () => steps.forEach(s => s.classList.add('is-on'));
  });

  /* Menu: a deck of cards. Scrolling deals the top card away and the next one rises */
  const cards = $$('.card'), deckNo = $('#deckNo');
  cards.forEach((c, i) => gsap.set(c, { y: i * 14, scale: 1 - i * 0.05, rotation: i ? (i % 2 ? 2.5 : -2.5) : 0 }));
  const deal = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
  cards.slice(0, -1).forEach((c, i) => {
    const at = i;
    // Phones deal to the left (full-width deck); desktop deals right, away from the heading
    deal.to(c, { xPercent: () => isPhone() ? -125 : 125, yPercent: -6, rotation: () => isPhone() ? -16 : 16, opacity: 0, duration: 1 }, at);
    cards.slice(i + 1).forEach((n, k) => deal.to(n, { y: k * 14, scale: 1 - k * 0.05, rotation: k ? (k % 2 ? 2.5 : -2.5) : 0, duration: 1 }, at));
  });
  ScrollTrigger.create({
    trigger: '.menu', start: 'top top', end: () => '+=' + Math.round(innerHeight * (isPhone() ? 1.6 : 2)), pin: '.menu-pin',
    animation: deal, scrub: 0.6, invalidateOnRefresh: true,
    onUpdate: self => { deckNo.textContent = '0' + Math.min(cards.length, Math.floor(self.progress * (cards.length - 1) + 0.5) + 1); }
  });

  /* Cocktails: real pour, scrubbed frame by frame with scroll */
  const canvas = $('#pour'), ctx = canvas.getContext('2d');
  const set = isPhone() ? { dir: 'sm', n: 40, w: 360, h: 480 } : { dir: 'lg', n: 64, w: 540, h: 720 };
  canvas.width = set.w; canvas.height = set.h;
  const imgs = new Array(set.n);
  let lastDrawn = -1, want = 0;
  const draw = i => {
    for (let k = i; k >= 0; k--) {
      const im = imgs[k];
      if (im && im.complete && im.naturalWidth) { if (k !== lastDrawn) { ctx.drawImage(im, 0, 0, set.w, set.h); lastDrawn = k; } return; }
    }
  };
  const loadFrames = () => {
    for (let i = 0; i < set.n; i++) {
      const im = new Image(); im.decoding = 'async';
      im.src = `assets/img/pour/${set.dir}/f${String(i).padStart(3, '0')}.webp`;
      im.onload = () => { if (i === 0 || i === want) draw(want); };
      imgs[i] = im;
    }
  };
  const lo = new IntersectionObserver(([e]) => { if (e.isIntersecting) { loadFrames(); lo.disconnect(); } }, { rootMargin: '1200px' });
  lo.observe($('.mix'));
  const pourSteps = $$('.pour-steps li'), meter = $('.pour-meter i');
  ScrollTrigger.create({
    trigger: '.mix', start: 'top top', end: () => isPhone() ? '+=110%' : '+=160%', pin: '.mix-pin', scrub: true, invalidateOnRefresh: true,
    onUpdate: self => {
      const p = self.progress;
      want = Math.round(p * (set.n - 1));
      draw(want);
      meter.style.height = (p * 100) + '%';
      const k = p < 0.3 ? 0 : p < 0.85 ? 1 : 2;
      pourSteps.forEach((li, j) => li.classList.toggle('is-on', j === k));
    }
  });

  /* Tickers pause off-screen */
  $$('.tick').forEach(t => watch(t, vis => { t.firstElementChild.style.animationPlayState = vis ? 'running' : 'paused'; }));

  /* Gentle entrances (opacity + short rise only) */
  const rise = (targets, trigger, stagger = 0.08) => gsap.from(targets, { y: 28, opacity: 0, duration: 0.7, stagger, ease: 'power2.out', scrollTrigger: { trigger, start: 'top 85%' } });
  $$('.section-head, .bar-head').forEach(h => rise(h.children, h, 0.1));
  rise('.games-copy > *', '.games', 0.08);
  gsap.from('.games-poster', { y: 60, rotation: 12, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '.games', start: 'top 70%' } });
  rise('.svc', '.svc-grid');
  rise('.tile', '.social-grid', 0.05);
  rise('.tag', '.shelf', 0.06);
  gsap.fromTo('.games-bg', { scale: 1.12 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.games', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.fromTo('.shelf-inner > img', { scale: 1.08 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '.bar', start: 'top bottom', end: 'center center', scrub: true } });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
