const $=(s,c=document)=>c.querySelector(s), $$=(s,c=document)=>[...c.querySelectorAll(s)];

const burger=$('#burger'), mobileMenu=$('#mobileMenu'), mobileClose=$('#mobileClose');
burger?.addEventListener('click',()=>mobileMenu?.classList.add('open'));
mobileClose?.addEventListener('click',()=>mobileMenu?.classList.remove('open'));
$$('.mobile-menu a').forEach(a=>a.addEventListener('click',()=>mobileMenu?.classList.remove('open')));

const drop=$('.nav-dropdown'), dropBtn=$('.drop-btn');
dropBtn?.addEventListener('click',(e)=>{e.preventDefault();drop?.classList.toggle('open')});
document.addEventListener('click',(e)=>{if(drop && !drop.contains(e.target)) drop.classList.remove('open')});

const revealObs=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObs.unobserve(e.target)}}),{threshold:.12});
$$('.reveal').forEach(el=>revealObs.observe(el));

$$('.faq-q').forEach(q=>q.addEventListener('click',()=>q.closest('.faq-item').classList.toggle('open')));

// testimonials
const testimonials=[
  {q:'“Excelente servicio, muy atentos, muy limpios, satisfacción al millón.”',n:'Opinión de cliente · Facebook'},
  {q:'“Excelente servicio, te explican súper bien todo el trabajo que hacen y de excelente calidad.”',n:'Katt Pastrana'},
  {q:'“Muy amables, me explicaron cada duda; sin duda un excelente servicio. Los recomiendo ampliamente.”',n:'LOnja LiBre'}
];
let ti=0; const tq=$('#testimonialQuote'), tn=$('#testimonialName'), dots=$('#testDots');
function renderTest(){if(!tq)return; tq.textContent=testimonials[ti].q; tn.textContent=testimonials[ti].n; if(dots){dots.innerHTML=testimonials.map((_,i)=>`<button class="${i===ti?'active':''}" aria-label="Testimonio ${i+1}"></button>`).join(''); [...dots.children].forEach((b,i)=>b.onclick=()=>{ti=i;renderTest()})}}
$('#testPrev')?.addEventListener('click',()=>{ti=(ti-1+testimonials.length)%testimonials.length;renderTest()});
$('#testNext')?.addEventListener('click',()=>{ti=(ti+1)%testimonials.length;renderTest()}); renderTest();

// WhatsApp quote form
$('#quoteForm')?.addEventListener('submit',e=>{
  e.preventDefault();
  const f=e.currentTarget;
  const service=f.querySelector('[name=service]')?.value||'Revisión general';
  const name=f.querySelector('[name=name]')?.value||'';
  const phone=f.querySelector('[name=phone]')?.value||'';
  const email=f.querySelector('[name=email]')?.value||'';
  const vehicle=f.querySelector('[name=vehicle]')?.value||'';
  const branch=f.querySelector('[name=branch]')?.value||'Sombrerete';
  const detail=f.querySelector('[name=detail]')?.value||'';
  const wa=branch==='Pie de la Cuesta'?'524428133715':'524421868438';
  const msg=`Hola MASTERBRAKES PREMIUM. Quiero solicitar una cotización.\n\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${email||'No proporcionado'}\nVehículo: ${vehicle}\nServicio: ${service}\nSucursal: ${branch}\nDetalle: ${detail||'Sin detalle adicional'}`;
  window.open(`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`,'_blank');
});


// v4 · Selector premium de sucursal para WhatsApp / llamada / Maps
(() => {
  const branches = {
    som: {
      key:'som',
      name:'Sombrerete',
      phone:'524421868438',
      display:'442 186 8438',
      address:'Av. Cerro Sombrerete 1150, Balcones de San Pablo, C.P. 76125, Santiago de Querétaro, Qro.',
      maps:'https://share.google/h0KJQbao4Z2PWzfot'
    },
    pie: {
      key:'pie',
      name:'Pie de la Cuesta',
      phone:'524428133715',
      display:'442 813 3715',
      address:'Av. Pie de la Cuesta 334, Nacional, C.P. 76148, a un costado de la UTEQ, Santiago de Querétaro, Qro.',
      maps:'https://share.google/veyZlv7FVN3zS64Zd'
    }
  };
  let active='som'; // Sombrerete por defecto, como se solicitó.
  let requestedService='información general';

  const modal=document.createElement('div');
  modal.className='branch-modal';
  modal.id='branchModal';
  modal.setAttribute('aria-hidden','true');
  modal.innerHTML=`
    <div class="branch-modal-backdrop" data-close-branch></div>
    <section class="branch-modal-panel" role="dialog" aria-modal="true" aria-labelledby="branchModalTitle">
      <button class="branch-modal-close" type="button" aria-label="Cerrar" data-close-branch>×</button>
      <span class="branch-modal-kicker">Atención directa</span>
      <h2 id="branchModalTitle">¿A qué sucursal quieres contactar?</h2>
      <p>Sombrerete está seleccionada por defecto. Puedes cambiar de sucursal antes de llamar o enviar WhatsApp.</p>
      <div class="branch-choice-grid">
        <button class="branch-choice active" type="button" data-branch="som">
          <span class="branch-choice-number">01</span>
          <strong>Sombrerete</strong>
          <small>442 186 8438</small>
          <span>Av. Cerro Sombrerete 1150</span>
        </button>
        <button class="branch-choice" type="button" data-branch="pie">
          <span class="branch-choice-number">02</span>
          <strong>Pie de la Cuesta</strong>
          <small>442 813 3715</small>
          <span>Av. Pie de la Cuesta 334</span>
        </button>
      </div>
      <div class="branch-modal-selected" id="branchModalSelected">Sucursal seleccionada: <b>Sombrerete</b></div>
      <div class="branch-modal-actions">
        <a class="btn btn-lime" id="branchWhatsapp" href="#" target="_blank" rel="noopener">WhatsApp</a>
        <a class="btn btn-dark" id="branchCall" href="#">Llamar</a>
        <a class="btn btn-outline" id="branchMaps" href="#" target="_blank" rel="noopener">Cómo llegar</a>
      </div>
    </section>`;
  document.body.appendChild(modal);

  const selectedText=modal.querySelector('#branchModalSelected');
  const whatsapp=modal.querySelector('#branchWhatsapp');
  const call=modal.querySelector('#branchCall');
  const maps=modal.querySelector('#branchMaps');
  const choices=[...modal.querySelectorAll('.branch-choice')];

  function updateBranch(key='som'){
    active=branches[key]?key:'som';
    const b=branches[active];
    choices.forEach(btn=>btn.classList.toggle('active',btn.dataset.branch===active));
    selectedText.innerHTML=`Sucursal seleccionada: <b>${b.name}</b> · ${b.display}`;
    whatsapp.href=`https://wa.me/${b.phone}?text=${encodeURIComponent(`Hola MASTERBRAKES PREMIUM. Me interesa ${requestedService} y quiero información para agendar en la sucursal ${b.name}.`)}`;
    call.href=`tel:+${b.phone}`;
    maps.href=b.maps;
  }
  function openBranchModal(service='información general'){
    requestedService=service||'información general';
    updateBranch('som');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('branch-modal-open');
  }
  function closeBranchModal(){
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('branch-modal-open');
  }
  choices.forEach(btn=>btn.addEventListener('click',()=>updateBranch(btn.dataset.branch)));
  modal.querySelectorAll('[data-close-branch]').forEach(el=>el.addEventListener('click',closeBranchModal));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeBranchModal()});
  document.querySelectorAll('.js-branch-contact').forEach(el=>el.addEventListener('click',e=>{e.preventDefault();openBranchModal(el.dataset.service||'información general')}));
  updateBranch('som');
})();


// v7 · interacción visual sutil en tarjetas (solo escritorio/puntero fino)
(() => {
  if (!window.matchMedia('(pointer:fine)').matches) return;
  const cards=[...document.querySelectorAll('.catalog-card,.related-card,.review-card-v7,.map-card')];
  cards.forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=(e.clientX-r.left)/r.width-.5;
      const y=(e.clientY-r.top)/r.height-.5;
      card.style.transform=`perspective(900px) rotateX(${(-y*2.8).toFixed(2)}deg) rotateY(${(x*3.4).toFixed(2)}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave',()=>{card.style.transform='';});
  });
})();


// v23 · Animaciones premium globales
(() => {
  const addClasses = (selector, classes) => {
    document.querySelectorAll(selector).forEach(el => classes.split(' ').forEach(c => c && el.classList.add(c)));
  };

  addClasses('.lead, .section-lead, .hero-lead-frena, .quote-copy p, .review-copy p, .service-hero p.lead, .booking-hero-copy p, .intro-copy p, .deep-detail-copy p', 'fx-observe fx-up');
  addClasses('.hero-actions, .hero-actions-v7, .booking-actions, .hero-mini-points, .hero-problem, .hero-problem-chips, .section-head .eyebrow, .service-badge, .crumbs', 'fx-observe fx-up');
  addClasses('.catalog-card, .commit, .process-card, .review-card-v7, .branch-premium, .quote-panel, .faq-item, .benefit-row, .included-card, .related-card, .booking-steps article, .booking-form, .booking-summary, .booking-branch-card, .stat, .mission-point, .quote-card, .map-card, .contact-card, .form-card', 'fx-observe fx-card');
  addClasses('.custom-cover-hero, .service-hero-img, .service-hero-img-custom, .gallery-card, .gallery-feature, .review-media, .booking-hero-card, .booking-photo, .media-card, .map-card, .branch-card-media', 'fx-observe fx-media tilt-hover');

  document.querySelectorAll('.catalog-grid, .commit-grid, .process-grid, .included-grid, .related-grid, .benefit-list, .stats-strip, .hero-problem-chips, .booking-steps, .branches-grid, .reviews-grid, .faq-list, .cards-grid, .contact-grid').forEach(group => {
    [...group.children].forEach((child, index) => {
      child.style.setProperty('--stagger', (index * 0.08).toFixed(2) + 's');
      child.classList.add('fx-observe');
    });
  });

  const fxObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fxObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('.fx-observe').forEach(el => fxObserver.observe(el));

  const isDesktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (isDesktop) {
    document.querySelectorAll('.tilt-hover').forEach(card => {
      let raf = null;
      const setTilt = (x, y) => {
        card.style.setProperty('--rx', y + 'deg');
        card.style.setProperty('--ry', x + 'deg');
      };
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const rx = (px - 0.5) * 8;
        const ry = (0.5 - py) * 8;
        if (raf) cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => setTilt(rx, ry));
      });
      card.addEventListener('mouseleave', () => {
        if (raf) cancelAnimationFrame(raf);
        card.style.setProperty('--rx', '0deg');
        card.style.setProperty('--ry', '0deg');
      });
    });
  }
})();


// v24 · títulos conservados + transición letra por letra
(() => {
  const selectors = [
    'h1',
    '.section-title',
    '.section-head h2',
    '.mission h2',
    '.process h2',
    '.quote-panel h2',
    '.deep-detail-title h2',
    '.booking-form-head h2',
    '.review-copy h2',
    '.quote-copy h2',
    '.catalog-card h3',
    '.included-card h3',
    '.related-card h3',
    '.benefit-row h3',
    '.booking-steps h3'
  ];

  const headings = [...new Set(selectors.flatMap(sel => [...document.querySelectorAll(sel)]))];

  const splitTextNode = (node, state) => {
    const frag = document.createDocumentFragment();
    const parts = node.nodeValue.split(/(\s+)/);
    parts.forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        return;
      }
      const word = document.createElement('span');
      word.className = 'letter-word';
      [...part].forEach(char => {
        const letter = document.createElement('span');
        letter.className = 'letter-char';
        letter.textContent = char;
        letter.style.setProperty('--letter-index', state.index++);
        word.appendChild(letter);
      });
      frag.appendChild(word);
    });
    node.parentNode.replaceChild(frag, node);
  };

  const splitHeading = el => {
    if (el.dataset.lettersReady === '1') return;
    el.dataset.lettersReady = '1';
    el.classList.add('letter-title');
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        if (node.parentElement?.closest('script,style')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    const state = { index: 0 };
    nodes.forEach(node => splitTextNode(node, state));
  };

  headings.forEach(splitHeading);

  const titleObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('letters-visible');
        titleObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });

  headings.forEach(el => titleObserver.observe(el));
})();
