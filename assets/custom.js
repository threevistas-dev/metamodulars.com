document.addEventListener('DOMContentLoaded', () => {
  /* ---------------------------------------------------------
     Building families.
  --------------------------------------------------------- */
  const MODELS = [
    {
      id: 'c', series: 'C-Series', name: 'Classroom', cat: 'learning', cols: 2, rows: 1,
      blurb: 'Permanent classroom buildings that replace aging portables for good. Clerestory daylight, exposed timber ceiling, and full ceiling height.',
      sizes: ['1 room', '2 rooms', '4 rooms', '8 rooms'],
      sf: '960 – 7,680', cap: '30 – 240', dims: '24–96 × 40 ft', lead: '16 – 26 wks',
      rest: 'Optional', hvac: 'Zoned heat pump', plans: '4 layouts'
    },
    {
      id: 'a', series: 'A-Series', name: 'Admin & front office', cat: 'campus', cols: 2, rows: 1,
      blurb: 'Reception, administration, and staff space with a welcoming public face — the first room a parent walks into, treated like it.',
      sizes: ['Compact', 'Standard', 'Extended'],
      sf: '1,440 – 3,840', cap: '8 – 24 staff', dims: '36–96 × 40 ft', lead: '16 – 22 wks',
      rest: 'Included', hvac: 'Zoned heat pump', plans: '3 layouts'
    },
    {
      id: 'm', series: 'M-Series', name: 'Multipurpose', cat: 'campus', cols: 3, rows: 1,
      blurb: 'MPR, dining, and gathering space sized to your enrollment, with a stage option, serving line, and acoustic treatment built in.',
      sizes: ['Small', 'Medium', 'Large'],
      sf: '3,600 – 9,600', cap: '150 – 500', dims: '60–120 × 60 ft', lead: '22 – 30 wks',
      rest: 'Included', hvac: 'Packaged rooftop', plans: '3 layouts'
    },
    {
      id: 'l', series: 'L-Series', name: 'Labs & STEM', cat: 'learning', cols: 2, rows: 1,
      blurb: 'Specialized, fully serviced learning environments — science, CTE, robotics — with upgraded power, gas and water, and a roll-up door option.',
      sizes: ['Single lab', 'Double lab', 'Lab + prep'],
      sf: '1,200 – 3,600', cap: '24 – 72', dims: '30–90 × 40 ft', lead: '18 – 26 wks',
      rest: 'Optional', hvac: 'Lab exhaust + make-up air', plans: '3 layouts'
    },
    {
      id: 'x', series: 'Campus', name: 'Full campus', cat: 'campus', cols: 4, rows: 2,
      blurb: 'The families combined into a whole school: classroom wings, admin, multipurpose, and labs, phased so the site stays open throughout.',
      sizes: ['Phased', 'Single delivery'],
      sf: '20,000+', cap: '400+', dims: 'To site', lead: 'By phase',
      rest: 'Included', hvac: 'Zoned by wing', plans: 'To site'
    }
  ];

  /* Scaled plan blocks — one bay = 24 × 40 ft at 2.2px/ft */
  window.plan = function (cols, rows, label) {
    const S = 2.2, W = 24 * S, D = 40 * S, p = 12;
    const w = cols * W + p * 2, h = rows * D + p * 2 + (rows > 1 ? 14 : 0);
    let g = '';
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = p + c * W, y = p + r * (D + (rows > 1 ? 14 : 0));
      g += `<rect x="${x}" y="${y}" width="${W}" height="${D}" fill="var(--white)" stroke="var(--ink)" stroke-width="1.5"/>`;
      g += `<line x1="${x + 7}" y1="${y}" x2="${x + W - 14}" y2="${y}" stroke="var(--aqua)" stroke-width="3.4"/>`;
      g += `<path d="M${x + W - 12} ${y + D} a12 12 0 0 0 12 -12" fill="none" stroke="var(--grey)" stroke-width="1"/>`;
    }
    g += `<line x1="${p}" y1="${h - 5}" x2="${p + cols * W}" y2="${h - 5}" stroke="var(--grey)" stroke-width="1"/>`;
    g += `<line x1="${p}" y1="${h - 9}" x2="${p}" y2="${h - 1}" stroke="var(--grey)" stroke-width="1"/>`;
    g += `<line x1="${p + cols * W}" y1="${h - 9}" x2="${p + cols * W}" y2="${h - 1}" stroke="var(--grey)" stroke-width="1"/>`;
    return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Typical plan, ${label}">${g}</svg>`;
  };

  /* compare section */
  const cmpBody = document.getElementById('cmp-body');
  const cmpSelects = [...document.querySelectorAll('.cmp select')];
  if (cmpBody && cmpSelects.length) {
    const ROWS = [
      ['Building family', 'series'],
      ['Floor area (sq ft)', 'sf'],
      ['Capacity', 'cap'],
      ['Footprint', 'dims'],
      ['Typical schedule', 'lead'],
      ['Restrooms', 'rest'],
      ['Mechanical', 'hvac'],
      ['Plan options', 'plans']
    ];
    const picks = ['c', 'l', 'm'];
    cmpSelects.forEach((s, i) => {
      s.innerHTML = MODELS.map(m => `<option value="${m.id}">${m.series} — ${m.name}</option>`).join('');
      s.value = picks[i] || MODELS[0].id;
      s.addEventListener('change', () => {
        picks[i] = s.value;
        drawCompare();
      });
    });
    function drawCompare() {
      const ch = picks.map(id => MODELS.find(m => m.id === id));
      cmpBody.innerHTML = ROWS.map(([l, k]) =>
        `<tr><th scope="row">${l}</th>${ch.map(m => `<td class="tnum">${m[k]}</td>`).join('')}</tr>`).join('');
    }
    drawCompare();
  }




  /* ---------------------------------------------------------
     Dropdown menus. Opens on hover above 920px, on click at
     any width, closes on Escape, outside click, or focus leaving.
  --------------------------------------------------------- */
  const desktop = window.matchMedia('(min-width:921px)');
  const items = [...document.querySelectorAll('.navitem')];
  let hoverTimer;

  function setOpen(item, on) {
    item.classList.toggle('open', on);
    const trigger = item.querySelector('.navtrigger');
    const panel = item.querySelector('.panel');
    if (trigger) trigger.setAttribute('aria-expanded', on);
    if (panel) panel.hidden = !on;
  }

  function closeAll(except) {
    items.forEach(i => {
      if (i !== except) setOpen(i, false);
    });
  }

  items.forEach(item => {
    const trigger = item.querySelector('.navtrigger');
    if (!trigger) return;

    trigger.addEventListener('click', e => {
      e.preventDefault();
      const willOpen = !item.classList.contains('open');
      closeAll(item);
      setOpen(item, willOpen);
    });

    item.addEventListener('mouseenter', () => {
      if (!desktop.matches) return;
      clearTimeout(hoverTimer);
      closeAll(item);
      setOpen(item, true);
    });

    item.addEventListener('mouseleave', () => {
      if (!desktop.matches) return;
      hoverTimer = setTimeout(() => setOpen(item, false), 140);
    });

    item.addEventListener('focusout', e => {
      if (!desktop.matches) return;
      if (!item.contains(e.relatedTarget)) setOpen(item, false);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = document.querySelector('.navitem.open');
    if (open) {
      setOpen(open, false);
      const trigger = open.querySelector('.navtrigger');
      if (trigger) trigger.focus();
    }
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.navitem')) closeAll();
  });

  desktop.addEventListener('change', () => closeAll());

  /* mobile nav */
  const mb = document.querySelector('.menu-btn');
  const nv = document.getElementById('nav');
  if (mb && nv) {
    mb.addEventListener('click', () => {
      const o = nv.classList.toggle('open');
      mb.setAttribute('aria-expanded', o);
      mb.textContent = o ? 'Close' : 'Menu';
      if (!o) closeAll();
    });
    nv.addEventListener('click', e => {
      if (e.target.closest('a')) {
        nv.classList.remove('open');
        mb.setAttribute('aria-expanded', 'false');
        mb.textContent = 'Menu';
        closeAll();
      }
    });
  }

  /* ---------------------------------------------------------
     Sticky Contact Button & Slide-over Drawer
  --------------------------------------------------------- */
  const contactBtn = document.getElementById('open-contact-drawer');
  const contactDrawer = document.getElementById('contact-drawer');
  const contactBackdrop = document.getElementById('contact-drawer-backdrop');
  const closeDrawerBtn = document.getElementById('close-contact-drawer');

  function openDrawer() {
    if (!contactDrawer || !contactBackdrop) return;
    contactDrawer.classList.add('active');
    contactBackdrop.classList.add('active');
    contactDrawer.setAttribute('aria-hidden', 'false');
    contactBackdrop.setAttribute('aria-hidden', 'false');
    if (contactBtn) contactBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const firstInput = contactDrawer.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 300);
  }

  function closeDrawer() {
    if (!contactDrawer || !contactBackdrop) return;
    contactDrawer.classList.remove('active');
    contactBackdrop.classList.remove('active');
    contactDrawer.setAttribute('aria-hidden', 'true');
    contactBackdrop.setAttribute('aria-hidden', 'true');
    if (contactBtn) {
      contactBtn.setAttribute('aria-expanded', 'false');
      contactBtn.focus();
    }
    document.body.style.overflow = '';
  }

  if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  }
  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }
  if (contactBackdrop) {
    contactBackdrop.addEventListener('click', (e) => {
      e.preventDefault();
      closeDrawer();
    });
  }

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && contactDrawer && contactDrawer.classList.contains('active')) {
      closeDrawer();
    }
  });


});
