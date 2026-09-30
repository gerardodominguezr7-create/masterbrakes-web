(() => {
  const form = document.querySelector('#bookingForm');
  if (!form) return;

  const branches = {
    sombrerete: {
      label: 'Sombrerete',
      phone: '524421868438',
      display: '442 186 8438',
      maps: 'https://share.google/h0KJQbao4Z2PWzfot'
    },
    'pie-de-la-cuesta': {
      label: 'Pie de la Cuesta',
      phone: '524428133715',
      display: '442 813 3715',
      maps: 'https://share.google/veyZlv7FVN3zS64Zd'
    }
  };

  const summaryBranch = document.querySelector('#summaryBranch');
  const summaryService = document.querySelector('#summaryService');
  const summaryDate = document.querySelector('#summaryDate');
  const summaryTime = document.querySelector('#summaryTime');
  const callBtn = document.querySelector('#bookingCall');
  const mapsBtn = document.querySelector('#bookingMaps');
  const dateInput = form.querySelector('[name="date"]');
  const serviceInput = form.querySelector('[name="service"]');
  const timeInput = form.querySelector('[name="time"]');
  const branchInputs = [...form.querySelectorAll('[name="branch"]')];
  const branchCards = [...document.querySelectorAll('[data-branch-card]')];

  const today = new Date();
  const isoToday = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'), String(today.getDate()).padStart(2,'0')].join('-');
  dateInput.min = isoToday;

  function cleanParam(v='') {
    return decodeURIComponent(String(v).replace(/\+/g, ' ')).trim();
  }

  function selectedBranchKey() {
    return branchInputs.find(i => i.checked)?.value || 'sombrerete';
  }

  function formatDate(value) {
    if (!value) return 'Por seleccionar';
    const [y,m,d] = value.split('-').map(Number);
    if (!y || !m || !d) return value;
    return new Intl.DateTimeFormat('es-MX', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(y,m-1,d));
  }

  function updateBranchUI() {
    const key = selectedBranchKey();
    const b = branches[key] || branches.sombrerete;
    branchCards.forEach(card => card.classList.toggle('active', card.dataset.branchCard === key));
    summaryBranch.textContent = b.label;
    callBtn.href = `tel:+${b.phone}`;
    mapsBtn.href = b.maps;
  }

  function updateSummary() {
    updateBranchUI();
    summaryService.textContent = serviceInput.value || 'Por seleccionar';
    summaryDate.textContent = formatDate(dateInput.value);
    summaryTime.textContent = timeInput.value || 'Por seleccionar';
  }

  branchInputs.forEach(input => input.addEventListener('change', updateSummary));
  [serviceInput, dateInput, timeInput].forEach(input => input.addEventListener('input', updateSummary));

  branchCards.forEach(card => {
    card.addEventListener('click', () => {
      const input = card.querySelector('input');
      if (input) {
        input.checked = true;
        updateSummary();
      }
    });
  });

  const params = new URLSearchParams(window.location.search);
  const branchParam = cleanParam(params.get('sucursal') || params.get('branch') || '').toLowerCase();
  const branchAliases = {
    sombrerete: 'sombrerete',
    som: 'sombrerete',
    'pie-de-la-cuesta': 'pie-de-la-cuesta',
    pie: 'pie-de-la-cuesta',
    'pie de la cuesta': 'pie-de-la-cuesta'
  };
  if (branchAliases[branchParam]) {
    const input = form.querySelector(`[name="branch"][value="${branchAliases[branchParam]}"]`);
    if (input) input.checked = true;
  }

  const serviceParam = cleanParam(params.get('servicio') || params.get('service') || '');
  if (serviceParam) {
    const option = [...serviceInput.options].find(o => o.value.toLowerCase() === serviceParam.toLowerCase() || o.textContent.trim().toLowerCase() === serviceParam.toLowerCase());
    if (option) serviceInput.value = option.value;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const key = String(data.get('branch') || 'sombrerete');
    const b = branches[key] || branches.sombrerete;
    const message = [
      'Hola MASTERBRAKES. Quiero solicitar una cita.',
      '',
      `Sucursal: ${b.label}`,
      `Servicio: ${data.get('service')}`,
      `Vehículo: ${data.get('vehicle')}`,
      `Fecha preferida: ${formatDate(String(data.get('date') || ''))}`,
      `Hora preferida: ${data.get('time')}`,
      `Nombre: ${data.get('name')}`,
      `Teléfono: ${data.get('phone')}`,
      `Detalle: ${data.get('detail') || 'Sin detalle adicional'}`,
      '',
      'Entiendo que la cita queda confirmada cuando la sucursal responda por WhatsApp.'
    ].join('\n');

    const url = `https://wa.me/${b.phone}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  });

  updateSummary();
})();
