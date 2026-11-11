/* ==========================================================================
   MASTERBRAKES · Motion layer v25
   Animaciones premium: progreso de scroll, header inteligente, parallax,
   contadores, haz de luz en tarjetas, línea de proceso, franja en movimiento,
   revelado de imágenes, botones magnéticos y más.
   Todo es progresivo: si algo falla, el contenido sigue visible.
   ========================================================================== */
(() => {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const introOn = root.classList.contains('mb-intro-on');
  root.classList.add('mb-js');
  try { sessionStorage.setItem('mbIntro', '1'); } catch (e) {}
  setTimeout(() => root.classList.remove('mb-intro-on'), 1400);

  // Observador genérico: añade .mb-in cuando el elemento entra en pantalla
  const onView = (els, cb, opts = {}) => {
    if (!('IntersectionObserver' in window)) { els.forEach(el => cb(el)); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); } });
    }, { threshold: opts.threshold ?? 0.2, rootMargin: opts.rootMargin ?? '0px 0px -8% 0px' });
    els.forEach(el => io.observe(el));
  };
  const markIn = el => el.classList.add('mb-in');

  /* ---------- Barra de progreso ---------- */
  const bar = document.createElement('div');
  bar.className = 'mb-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  /* ---------- Header inteligente ---------- */
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;

  /* ---------- Hero ---------- */
  const heroFig = document.querySelector('.hero-photo-frena, .custom-cover-hero');
  const heroImgs = $$('.hero-photo-frena img, .custom-cover-hero img, .service-hero-img img');
  requestAnimationFrame(() => setTimeout(() => document.body.classList.add('mb-ready'), 60));

  $$('.hero-word--lime').forEach(w => w.setAttribute('data-mb-text', w.textContent.trim()));

  if (heroFig) {
    heroFig.classList.add('mb-spot-host');
    const spot = document.createElement('span');
    spot.className = 'mb-spot';
    spot.setAttribute('aria-hidden', 'true');
    heroFig.appendChild(spot);
    if (fine) {
      heroFig.addEventListener('mousemove', e => {
        const r = heroFig.getBoundingClientRect();
        heroFig.style.setProperty('--mb-mx', (e.clientX - r.left) + 'px');
        heroFig.style.setProperty('--mb-my', (e.clientY - r.top) + 'px');
      });
    }
    if (heroFig.classList.contains('hero-photo-frena') && !reduce) {
      const cue = document.createElement('span');
      cue.className = 'mb-scroll-cue';
      cue.setAttribute('aria-hidden', 'true');
      heroFig.appendChild(cue);
    }
  }

  /* ---------- Eyebrows con línea ---------- */
  const eyebrows = $$('.eyebrow').filter(el => !el.closest('.hero-copy-frena'));
  eyebrows.forEach(el => {
    const line = document.createElement('i');
    line.className = 'mb-line';
    line.setAttribute('aria-hidden', 'true');
    el.prepend(line);
    el.classList.add('mb-eyebrow');
  });
  onView(eyebrows, markIn, { threshold: 0.6 });

  /* ---------- Contadores en métricas ---------- */
  const strip = document.querySelector('.stats-strip');
  if (strip) {
    onView([strip], el => {
      el.classList.add('mb-in');
      $$('.stat', el).forEach((stat, i) => {
        const b = stat.querySelector('b');
        if (!b) return;
        const m = b.textContent.trim().match(/^(\d+)(\+?)$/);
        setTimeout(() => {
          stat.classList.add('mb-pop');
          if (!m || reduce) return;
          const target = +m[1], suffix = m[2], dur = 1400, t0 = performance.now();
          const tick = now => {
            const p = Math.min(1, (now - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 4);
            b.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }, i * 140 + (introOn ? 900 : 0));
      });
    }, { threshold: 0.4 });
  }

  /* ---------- Tarjetas: haz + reflejo ---------- */
  const cardSel = '.catalog-card, .related-card, .included-card, .review-card-v7, .process-card, .benefit-row, .booking-branch-card, .map-card, .quote-card';
  $$(cardSel).forEach(card => {
    card.classList.add('mb-card');
    if (getComputedStyle(card).position === 'static') card.style.position = 'relative';
    const beam = document.createElement('span'); beam.className = 'mb-beam'; beam.setAttribute('aria-hidden', 'true');
    const glare = document.createElement('span'); glare.className = 'mb-glare'; glare.setAttribute('aria-hidden', 'true');
    card.append(glare, beam);
    if (fine) {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mb-mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--mb-my', (e.clientY - r.top) + 'px');
      });
    }
  });

  /* ---------- Línea de proceso ---------- */
  const track = document.querySelector('.process-track');
  const procCards = $$('.process-card');
  let trackSection = null;
  if (track && !reduce) {
    const originalBg = getComputedStyle(track).backgroundImage;
    const fill = document.createElement('span');
    fill.className = 'mb-track-fill';
    fill.style.backgroundImage = originalBg && originalBg !== 'none' ? originalBg : 'linear-gradient(90deg,#c8f500,#e9ff7a)';
    const pill = document.createElement('span');
    pill.className = 'mb-track-pill';
    track.append(fill, pill);
    track.classList.add('mb-track');
    trackSection = track.closest('section');
  }

  /* ---------- Franja de servicios en movimiento (solo inicio) ---------- */
  const catalog = document.querySelector('#servicios');
  let marqueeTrack = null, marqueeX = 0, marqueeW = 0;
  if (catalog) {
    const words = [...new Set($$('.catalog-card h3', catalog).map(h => h.textContent.trim()))];
    if (words.length) {
      const mq = document.createElement('div');
      mq.className = 'mb-marquee';
      mq.setAttribute('aria-hidden', 'true');
      const group = () => '<div class="mb-marquee-group">' +
        words.map((w, i) => `<span class="mb-marquee-item${i % 2 ? ' mb-solid' : ''}">${w}</span><span class="mb-marquee-dot"></span>`).join('') +
        '</div>';
      mq.innerHTML = `<div class="mb-marquee-track">${group()}${group()}</div>`;
      catalog.after(mq);
      marqueeTrack = mq.firstElementChild;
      const measure = () => { marqueeW = marqueeTrack.firstElementChild.offsetWidth; };
      measure();
      window.addEventListener('resize', measure);
      document.fonts?.ready?.then(measure);
    }
  }

  /* ---------- Imágenes: revelado tipo cortina ---------- */
  const wipeEls = $$('.gallery-preview-grid a, .custom-image, .review-media, .gallery-card, .media-card, .booking-photo');
  wipeEls.forEach(el => el.classList.add('mb-wipe'));
  $$('.gallery-preview-grid a').forEach((a, i) => { a.querySelector('img')?.style.setProperty('transition-delay', (i * 0.12) + 's'); });
  onView(wipeEls, markIn, { threshold: 0.15 });

  /* ---------- Desenfoque de entrada en bloques oscuros ---------- */
  const blurEls = $$('.custom-copy p, .custom-list > div, .deep-detail-copy p, .custom-cover-content .hero-problem');
  blurEls.forEach((el, i) => { el.classList.add('mb-blur'); el.style.setProperty('--i', i % 4); el.style.transitionDelay = ((i % 4) * 0.12) + 's'; });
  onView(blurEls, markIn, { threshold: 0.2 });

  /* ---------- Estrellas ---------- */
  const starBoxes = $$('.stars');
  starBoxes.forEach(box => {
    const txt = box.textContent;
    if (!/★/.test(txt)) return;
    box.setAttribute('aria-label', (txt.match(/★/g) || []).length + ' estrellas');
    box.innerHTML = [...txt].map((c, i) => c === '★' ? `<span class="mb-star" style="--i:${i}" aria-hidden="true">★</span>` : c).join('');
  });
  onView(starBoxes, el => el.classList.add('mb-stars-in'), { threshold: 0.5 });
  onView($$('.quote-card'), markIn, { threshold: 0.4 });

  /* ---------- Footer ---------- */
  const footer = document.querySelector('.site-footer');
  if (footer) {
    $$('.footer-grid > *', footer).forEach((c, i) => c.style.setProperty('--i', i));
    onView([footer], markIn, { threshold: 0.12, rootMargin: '0px' });
  }

  /* ---------- Botones magnéticos (escritorio) ---------- */
  if (fine && !reduce) {
    $$('.btn').forEach(btn => {
      btn.classList.add('mb-magnet');
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.setProperty('--mb-bx', x.toFixed(1) + 'px');
        btn.style.setProperty('--mb-by', y.toFixed(1) + 'px');
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.setProperty('--mb-bx', '0px');
        btn.style.setProperty('--mb-by', '0px');
      });
    });
  }

  /* ---------- Bucle de scroll (un solo rAF) ---------- */
  const parallaxImgs = [...heroImgs, ...$$('.custom-image img')];
  let ticking = false, velocity = 0, prevY = window.scrollY;

  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    bar.style.setProperty('--mb-p', max > 0 ? (y / max).toFixed(4) : 0);

    if (header) {
      header.classList.toggle('mb-scrolled', y > 24);
      const menuOpen = document.querySelector('.mobile-menu.open, .nav-dropdown.open, .branch-modal.open');
      if (y > lastY + 6 && y > 220 && !menuOpen) header.classList.add('mb-hide');
      else if (y < lastY - 6 || y < 120) header.classList.remove('mb-hide');
      lastY = y;
    }

    if (!reduce) {
      parallaxImgs.forEach(img => {
        const r = img.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const center = r.top + r.height / 2 - vh / 2;
        img.style.setProperty('--mb-py', (center * -0.08).toFixed(1) + 'px');
      });

      if (trackSection) {
        const r = track.getBoundingClientRect();
        const start = vh * 0.85, end = vh * 0.25;
        const t = Math.max(0, Math.min(1, (start - r.top) / (start - end)));
        track.style.setProperty('--mb-t', t.toFixed(3));
        procCards.forEach((c, i) => c.classList.toggle('mb-on', t >= (i + 0.5) / procCards.length));
      }
    }
  };
  const requestUpdate = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener('scroll', requestUpdate, { passive: true });
  window.addEventListener('resize', requestUpdate);
  update();

  // La franja corre siempre y acelera con la velocidad del scroll
  if (marqueeTrack && !reduce) {
    const loop = () => {
      const y = window.scrollY;
      velocity = velocity * 0.9 + (y - prevY) * 0.1;
      prevY = y;
      const speed = 0.6 + Math.min(6, Math.abs(velocity) * 0.25);
      marqueeX -= speed;
      if (marqueeW && -marqueeX >= marqueeW) marqueeX += marqueeW;
      marqueeTrack.style.transform = `translate3d(${marqueeX.toFixed(2)}px,0,0)`;
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
})();

/* ==========================================================================
   v26 · Secciones PRO
   ========================================================================== */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const io = (els, cb, opts) => {
    if (!('IntersectionObserver' in window)) { els.forEach(el => cb(el, true)); return; }
    const o = new IntersectionObserver(es => es.forEach(e => cb(e.target, e.isIntersecting, o)), opts || { threshold: .25 });
    els.forEach(el => o.observe(el));
  };

  /* ---------- Anatomía interactiva ---------- */
  const stage = document.querySelector('[data-anatomy]');
  if (stage) {
    const section = stage.closest('section');
    const spots = $$('.mb-hotspot', stage), parts = $$('.mb-part', section);
    let auto = null, userTouched = false, idx = -1;
    const activate = i => {
      idx = i;
      spots.forEach(s => s.classList.toggle('active', +s.dataset.part === i));
      parts.forEach(p => p.classList.toggle('active', +p.dataset.part === i));
      stage.classList.toggle('mb-has-active', i >= 0);
    };
    const pick = i => { userTouched = true; clearInterval(auto); activate(idx === i ? -1 : i); };
    spots.forEach(s => s.addEventListener('click', () => pick(+s.dataset.part)));
    parts.forEach(p => {
      p.addEventListener('click', () => pick(+p.dataset.part));
      p.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(+p.dataset.part); } });
      if (fine) p.addEventListener('mouseenter', () => { userTouched = true; clearInterval(auto); activate(+p.dataset.part); });
    });
    io([stage], (el, vis, o) => {
      if (!vis) return;
      el.classList.add('mb-in'); o.unobserve(el);
      if (reduce) return;
      let k = 0;
      setTimeout(() => {
        if (userTouched) return;
        activate(0);
        auto = setInterval(() => { if (userTouched) return clearInterval(auto); k = (k + 1) % spots.length; activate(k); }, 2600);
      }, 1400);
    });
  }

  /* ---------- Proyectos en scroll horizontal ---------- */
  const show = document.querySelector('.mb-showcase');
  if (show) {
    const track = show.querySelector('[data-showcase]');
    const cur = show.querySelector('[data-showcase-current]');
    const shots = $$('.mb-shot', track);
    const desktop = () => window.matchMedia('(min-width: 901px) and (hover: hover)').matches && !reduce;
    let dist = 0;
    const measure = () => {
      if (!desktop()) { show.style.removeProperty('--mb-h'); track.style.transform = ''; return; }
      const last = track.lastElementChild;
      dist = Math.max(0, last.offsetLeft + last.offsetWidth + window.innerWidth * 0.06 - window.innerWidth);
      show.style.setProperty('--mb-h', dist + 'px');
    };
    const setCount = p => {
      const total = shots.filter(s => !s.classList.contains('mb-shot-cta')).length;
      const n = Math.min(total, Math.max(1, Math.round(p * (total - 1)) + 1));
      if (cur) cur.textContent = String(n).padStart(2, '0');
    };
    const onScroll = () => {
      if (!desktop()) return;
      const r = show.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, -r.top / (show.offsetHeight - window.innerHeight || 1)));
      track.style.transform = `translate3d(${(-dist * p).toFixed(1)}px,0,0)`;
      show.style.setProperty('--mb-sp', p.toFixed(3));
      setCount(p);
      shots.forEach(s => {
        const b = s.getBoundingClientRect();
        const c = (b.left + b.width / 2 - window.innerWidth / 2) / window.innerWidth;
        const img = s.querySelector('img');
        if (img) img.style.setProperty('--mb-sx', (c * -40).toFixed(1) + 'px');
      });
    };
    track.addEventListener('scroll', () => {
      if (desktop()) return;
      setCount(track.scrollLeft / Math.max(1, track.scrollWidth - track.clientWidth));
    }, { passive: true });
    measure(); onScroll();
    window.addEventListener('resize', () => { measure(); onScroll(); });
    window.addEventListener('load', () => { measure(); onScroll(); });
    window.addEventListener('scroll', () => requestAnimationFrame(onScroll), { passive: true });
  }

  /* ---------- Videos del taller: se cargan y reproducen solo al verse ---------- */
  const vids = $$('video[data-src]');
  io(vids, (v, vis) => {
    if (vis) {
      if (!v.src) { v.src = v.dataset.src; }
      if (!reduce) v.play?.().catch(() => {});
    } else v.pause?.();
  }, { threshold: .35 });

  /* ---------- Cursor personalizado ---------- */
  if (fine && !reduce) {
    const ring = document.createElement('div'); ring.className = 'mb-cursor'; ring.innerHTML = '<em>Ver</em>';
    const dot = document.createElement('div'); dot.className = 'mb-cursor-dot';
    ring.setAttribute('aria-hidden', 'true'); dot.setAttribute('aria-hidden', 'true');
    document.body.append(ring, dot);
    let mx = -100, my = -100, rx = -100, ry = -100;
    window.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      document.documentElement.classList.add('mb-cursor-on');
      const t = e.target;
      const view = t.closest?.('.mb-shot:not(.mb-shot-cta), .gallery-preview-grid a, .mb-phone');
      const link = !view && t.closest?.('a, button, [role=button], .mb-part, input, select, textarea, label');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !!link);
    }, { passive: true });
    document.addEventListener('mouseleave', () => document.documentElement.classList.remove('mb-cursor-on'));
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
      requestAnimationFrame(loop);
    };
    loop();
  }

  /* ---------- Transición entre páginas ---------- */
  if (!reduce) {
    if (document.documentElement.classList.contains('mb-arrive')) setTimeout(() => document.documentElement.classList.remove('mb-arrive'), 900);
    const wipe = document.createElement('div'); wipe.className = 'mb-wipe-page'; wipe.setAttribute('aria-hidden', 'true');
    document.body.appendChild(wipe);
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.target === '_blank' || a.hasAttribute('download') || a.classList.contains('js-branch-contact')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
      if (url.pathname === location.pathname && url.hash) return;
      e.preventDefault();
      try { sessionStorage.setItem('mbNav', '1'); } catch (err) {}
      wipe.classList.add('is-out');
      setTimeout(() => { location.href = url.href; }, 520);
    });
    window.addEventListener('pageshow', e => { if (e.persisted) wipe.classList.remove('is-out'); });
  }
})();
