(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      toggle.textContent = open ? '×' : '☰';
    });
    nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); toggle.textContent='☰';
    }));
    const page = document.body.dataset.page;
    nav.querySelectorAll('[data-link]').forEach(a => {
      if (a.dataset.link === page) { a.classList.add('active'); a.setAttribute('aria-current','page'); }
    });
  }

  const messages = [
    '“You can begin again in the middle of an ordinary day.”',
    '“Make a little room for the thing that makes you curious.”',
    '“A pause can be part of moving forward.”',
    '“Connection sometimes begins with a small hello.”',
    '“You are allowed to notice the good things already here.”',
    '“Let today be a little softer around the edges.”',
    '“A small kindness can change the feeling of a whole day.”',
    '“Not every good thing needs to be hurried.”'
  ];
  const jarBtn = document.querySelector('#jar-draw');
  const jarMessage = document.querySelector('#jar-message');
  let lastMessage = -1;
  if (jarBtn && jarMessage) jarBtn.addEventListener('click', () => {
    let n; do { n = Math.floor(Math.random() * messages.length); } while (messages.length > 1 && n === lastMessage);
    lastMessage = n; jarMessage.classList.add('is-changing');
    window.setTimeout(() => { jarMessage.textContent = messages[n]; jarMessage.classList.remove('is-changing'); }, 130);
  });

  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const menuItems = [...document.querySelectorAll('.menu-item-card[data-category]')];
  const empty = document.querySelector('.filter-empty');
  if (filterButtons.length && menuItems.length) {
    filterButtons.forEach(btn => btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      filterButtons.forEach(b => { const active = b === btn; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
      let visible = 0;
      menuItems.forEach(card => {
        const tags = card.dataset.category.split(/\s+/);
        const show = filter === 'all' || tags.includes(filter);
        card.classList.toggle('is-hidden', !show); if (show) visible++;
      });
      if (empty) empty.hidden = visible !== 0;
    }));
  }

  const wallForm = document.querySelector('#wall-form');
  const wallInput = document.querySelector('#wall-input');
  const wallNotes = document.querySelector('#wall-notes');
  const wallFeedback = document.querySelector('#wall-feedback');
  if (wallForm && wallInput && wallNotes) {
    const colours = ['sticky-sun','sticky-pink','sticky-blue','sticky-green','sticky-user'];
    wallForm.addEventListener('submit', event => {
      event.preventDefault();
      const text = wallInput.value.trim();
      if (!text) { wallFeedback.textContent = 'Write a short note before pinning it.'; return; }
      const card = document.createElement('div');
      card.className = `sticky-note ${colours[Math.floor(Math.random() * colours.length)]}`;
      const symbol = document.createElement('span'); symbol.textContent = '✳';
      const noteText = document.createElement('p'); noteText.textContent = text;
      const stamp = document.createElement('small'); stamp.textContent = 'YOUR PREVIEW NOTE';
      card.append(symbol, noteText, stamp); wallNotes.prepend(card); wallInput.value = '';
      wallFeedback.textContent = 'Pinned in this browser preview. It has not been submitted to Café Miracle.';
    });
  }

  const copyButton = document.querySelector('#copy-address');
  const copyFeedback = document.querySelector('#copy-feedback');
  if (copyButton) copyButton.addEventListener('click', async () => {
    const value = copyButton.dataset.copy || '';
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        if (copyFeedback) copyFeedback.textContent = 'Address copied.';
      } else {
        const field = document.createElement('textarea'); field.value = value; field.setAttribute('readonly',''); field.style.position='absolute'; field.style.left='-9999px'; document.body.appendChild(field); field.select();
        const ok = document.execCommand('copy'); field.remove();
        if (copyFeedback) copyFeedback.textContent = ok ? 'Address copied.' : value;
      }
    } catch (_) { if (copyFeedback) copyFeedback.textContent = value; }
  });
})();
