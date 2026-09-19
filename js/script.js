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
