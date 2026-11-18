/* =============================================================
   Shared behaviour for every page: chrome (header / footer /
   RFQ drawer / modal / toast), catalogue rendering, batch
   verification and the institutional inquiry form.
   Data comes from assets/data.js (window.CONFIG / PRODUCTS / …).
   ============================================================= */

(function () {
  'use strict';

  const { CONFIG, PRODUCTS, CATEGORIES, LOT_DATA } = window;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
    })[c]);

  const PAGE = document.body.dataset.page || 'home';
  const ACTIVE = PAGE === 'product' ? 'catalog' : PAGE;

  /* ------------------------------------------------------------
     Small UI helpers
     ------------------------------------------------------------ */
  let toastTimer;
  function toast(message, type = 'info') {
    const el = $('#toast');
    if (!el) return;
    el.textContent = message;
    el.className =
      'fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full px-5 py-2.5 text-sm font-medium text-white shadow-lg ' +
      (type === 'error' ? 'bg-red-600' : 'bg-slate-900');
    el.classList.remove('hidden');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2600);
  }

  function copyText(text) {
    if (!navigator.clipboard) {
      toast('Copy not supported — select the text manually.', 'error');
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => toast('Copied to clipboard'),
      () => toast('Copy failed — select the text manually.', 'error')
    );
  }

  /* ------------------------------------------------------------
     Page chrome
     ------------------------------------------------------------ */
  const NAV = [
    ['index.html', 'Home', 'home'],
    ['catalog.html', 'Catalogue', 'catalog'],
    ['verify.html', 'Verify a Batch', 'verify'],
    ['quality.html', 'Quality', 'quality'],
    ['about.html', 'Company', 'about'],
    ['faq.html', 'FAQ', 'faq'],
    ['contact.html', 'Contact', 'contact'],
  ];

  function navLink([href, label, key], mobile = false) {
    const active = ACTIVE === key;
    const base = mobile
      ? 'block rounded-lg px-3 py-2 text-sm font-medium'
      : 'rounded-lg px-3 py-2 text-sm font-medium transition';
    const state = active
      ? ' bg-brand-500 text-slate-950'
      : ' text-slate-300 hover:bg-slate-800 hover:text-white';
    return `<a href="${href}" class="${base}${state}">${label}</a>`;
  }

  function headerHTML() {
    return `
    <div class="sticky top-0 z-40">
      <div class="bg-slate-950 px-4 py-1.5 text-center text-[11px] font-medium tracking-wide text-slate-400 sm:text-xs">
        <span class="text-emerald-400">●</span>
        For In-Vitro Laboratory Research Use Only · Not for human or veterinary use · Not for diagnostic or therapeutic use
      </div>
      <header class="border-b border-slate-800 bg-slate-900/95 backdrop-blur">
        <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <a href="index.html" class="flex items-center gap-2.5">
            <span class="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-sm font-extrabold text-slate-950">PS</span>
            <span class="leading-tight">
              <span class="block text-sm font-bold tracking-tight text-white">${esc(CONFIG.brand)}</span>
              <span class="block text-[10px] uppercase tracking-[0.18em] text-slate-400">B2B Research Supply</span>
            </span>
          </a>
          <div class="hidden items-center gap-1 lg:flex">${NAV.map((n) => navLink(n)).join('')}</div>
          <div class="flex items-center gap-2">
            <button type="button" data-open-rfq class="relative inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand-500 hover:text-white">
              <i data-lucide="clipboard-list" class="h-4 w-4"></i>
              <span class="hidden sm:inline">RFQ</span>
              <span id="rfqCount" class="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-slate-950 opacity-0 transition">0</span>
            </button>
            <button type="button" data-open-rfq class="hidden rounded-lg bg-brand-500 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-brand-400 sm:inline-flex">
              Request a Quote
            </button>
            <button type="button" data-nav-toggle class="rounded-lg p-2 text-slate-300 lg:hidden" aria-label="Toggle menu">
              <i data-lucide="menu" class="h-5 w-5"></i>
            </button>
          </div>
        </nav>
        <div id="mobileNav" class="hidden border-t border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
          <div class="flex flex-col gap-1">${NAV.map((n) => navLink(n, true)).join('')}</div>
        </div>
      </header>
    </div>`;
  }

  function footerHTML() {
    return `
    <footer class="bg-slate-950 py-12 text-slate-400">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="grid gap-10 md:grid-cols-3">
          <div>
            <div class="flex items-center gap-2.5">
              <span class="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-sm font-extrabold text-slate-950">PS</span>
              <span class="text-sm font-bold text-white">${esc(CONFIG.brand)}</span>
            </div>
            <p class="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">
              Research-grade peptides, custom synthesis and analytical services for institutional laboratories.
            </p>
          </div>
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">Site</h3>
            <ul class="mt-3 space-y-2 text-sm">
              <li><a href="catalog.html" class="hover:text-white">Catalogue</a></li>
              <li><a href="verify.html" class="hover:text-white">Verify a batch</a></li>
              <li><a href="quality.html" class="hover:text-white">Quality &amp; documentation</a></li>
              <li><a href="faq.html" class="hover:text-white">FAQ</a></li>
              <li><a href="contact.html" class="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xs font-bold uppercase tracking-widest text-slate-500">Compliance</h3>
            <p class="mt-3 text-xs leading-relaxed text-slate-400">
              Products are supplied for in-vitro laboratory research only. Not for human or
              veterinary use. Not for diagnostic or therapeutic use. Institutional supply only.
            </p>
            <p class="mt-3 text-[11px] text-slate-500">
              Machine-readable index: <span class="font-mono text-slate-400">/llms.txt</span>
            </p>
          </div>
        </div>
        <div class="mt-10 flex flex-col justify-between gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row">
          <span>© <span id="year"></span> ${esc(CONFIG.brand)}. All rights reserved.</span>
          <span>For in-vitro research use only.</span>
        </div>
      </div>
    </footer>`;
  }

  function chromeHTML() {
    return `
    <div id="rfqOverlay" class="fixed inset-0 z-40 hidden bg-slate-900/50 backdrop-blur-sm"></div>
    <aside id="rfqDrawer" class="fixed inset-y-0 right-0 z-50 flex w-full max-w-md translate-x-full flex-col bg-white shadow-2xl transition-transform duration-300">
      <div class="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 class="text-base font-bold text-slate-900">Quotation request</h2>
          <p class="text-xs text-slate-500">Add items, then send an RFQ to our sales desk.</p>
        </div>
        <button type="button" data-close-rfq class="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <i data-lucide="x" class="h-5 w-5"></i>
        </button>
      </div>
      <div id="rfqItems" class="flex-1 overflow-y-auto px-6 py-4"></div>
      <div class="border-t border-slate-200 px-6 py-4">
        <div class="mb-3 flex items-center justify-between text-sm">
          <span class="text-slate-500">Requested items</span>
          <span id="rfqLines" class="font-mono font-bold text-slate-900">0</span>
        </div>
        <button type="button" id="submitRfq" class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-700">
          <i data-lucide="clipboard-check" class="h-4 w-4"></i> Review &amp; send RFQ
        </button>
        <p class="mt-2 text-center text-[11px] text-slate-500">For in-vitro research use only. Pricing is quoted per project.</p>
      </div>
    </aside>
    <div id="modal" class="fixed inset-0 z-[60] hidden overflow-y-auto bg-slate-900/60 p-4 backdrop-blur-sm">
      <div id="modalPanel" class="relative mx-auto my-10 w-full max-w-xl rounded-2xl bg-white shadow-2xl"></div>
    </div>
    <div id="toast" class="hidden fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-lg"></div>`;
  }

  /* Inject chrome around the page's static <main> content. */
  document.body.insertAdjacentHTML('afterbegin', headerHTML());
  document.body.insertAdjacentHTML('beforeend', footerHTML());
  document.body.insertAdjacentHTML('beforeend', chromeHTML());

  /* ------------------------------------------------------------
     RFQ cart (quotation request — NOT a checkout)
     ------------------------------------------------------------ */
  const state = { category: 'all', query: '', cart: [] };

  function findProduct(id) {
    return PRODUCTS.find((p) => p.id === id);
  }

  function addToRfq(id, variant) {
    const product = findProduct(id);
    if (!product) return;
    const key = `${id}::${variant}`;
    const line = state.cart.find((l) => l.key === key);
    if (line) line.qty += 1;
    else state.cart.push({ key, id, variant, qty: 1 });
    renderRfq();
    toast(`${product.name} · ${variant} added to RFQ`);
  }

  function changeQty(key, delta) {
    const line = state.cart.find((l) => l.key === key);
    if (!line) return;
    line.qty += delta;
    if (line.qty <= 0) state.cart = state.cart.filter((l) => l.key !== key);
    renderRfq();
  }

  function removeLine(key) {
    state.cart = state.cart.filter((l) => l.key !== key);
    renderRfq();
  }

  function renderRfq() {
    const count = state.cart.reduce((n, l) => n + l.qty, 0);
    const badge = $('#rfqCount');
    if (badge) {
      badge.textContent = count;
      badge.style.opacity = count ? '1' : '0';
    }
    const lines = $('#rfqLines');
    if (lines) lines.textContent = String(state.cart.length);

    const box = $('#rfqItems');
    if (!box) return;

    if (!state.cart.length) {
      box.innerHTML = `
        <div class="flex h-full flex-col items-center justify-center py-16 text-center">
          <i data-lucide="clipboard-list" class="h-10 w-10 text-slate-300"></i>
          <p class="mt-3 font-semibold text-slate-700">No items yet</p>
          <p class="mt-1 max-w-[16rem] text-sm text-slate-500">Browse the catalogue and add items to request a quotation.</p>
        </div>`;
    } else {
      box.innerHTML = state.cart
        .map((line) => {
          const p = findProduct(line.id);
          return `
          <div class="mb-3 rounded-xl border border-slate-200 p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-sm font-bold text-slate-900">${esc(p.name)}</p>
                <p class="mt-0.5 font-mono text-[11px] text-slate-500">${esc(line.variant)}</p>
              </div>
              <button type="button" data-rm="${esc(line.key)}" class="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove">
                <i data-lucide="trash-2" class="h-4 w-4"></i>
              </button>
            </div>
            <div class="mt-3 flex items-center gap-2">
              <button type="button" data-q="${esc(line.key)}" data-d="-1" class="grid h-8 w-8 place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50" aria-label="Decrease">
                <i data-lucide="minus" class="h-3.5 w-3.5"></i>
              </button>
              <span class="w-8 text-center font-mono text-sm font-bold text-slate-900">${line.qty}</span>
              <button type="button" data-q="${esc(line.key)}" data-d="1" class="grid h-8 w-8 place-items-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-50" aria-label="Increase">
                <i data-lucide="plus" class="h-3.5 w-3.5"></i>
              </button>
            </div>
          </div>`;
        })
        .join('');
    }
    if (window.lucide) lucide.createIcons();
  }

  function openDrawer() {
    $('#rfqOverlay')?.classList.remove('hidden');
    $('#rfqDrawer')?.classList.remove('translate-x-full');
    document.body.classList.add('no-scroll');
    renderRfq();
  }

  function closeDrawer() {
    $('#rfqOverlay')?.classList.add('hidden');
    $('#rfqDrawer')?.classList.add('translate-x-full');
    if ($('#modal')?.classList.contains('hidden')) document.body.classList.remove('no-scroll');
  }

  function buildRfqText() {
    const lines = state.cart.map((line, i) => {
      const p = findProduct(line.id);
      return `${i + 1}. ${p.name} — ${line.variant} — qty ${line.qty}`;
    });
    return [
      `Quotation request — ${CONFIG.brand}`,
      `Date: ${new Date().toISOString().slice(0, 10)}`,
      '',
      'Items:',
      ...lines,
      '',
      'Please provide unit pricing, lead time, and the batch-specific COA & SDS for each line.',
      '',
      'Institution:',
      'Research use only — not for human or veterinary use.',
    ].join('\n');
  }

  function submitRfq() {
    if (!state.cart.length) {
      toast('Add at least one item to request a quotation.', 'error');
      return;
    }
    const text = buildRfqText();
    const mailto = `mailto:${CONFIG.email}?subject=${encodeURIComponent(`RFQ — ${CONFIG.brand}`)}&body=${encodeURIComponent(text)}`;
    const wa = `https://wa.me/${CONFIG.phoneIntl}?text=${encodeURIComponent(text)}`;

    openModal(`
      <div class="p-6 sm:p-8">
        <p class="text-[11px] font-bold uppercase tracking-widest text-brand-700">Review</p>
        <h3 class="mt-1 text-xl font-bold text-slate-900">Your quotation request</h3>
        <p class="mt-1 text-sm text-slate-500">Send this to our sales desk, or copy it into your own email.</p>
        <textarea readonly rows="10" class="mt-4 w-full rounded-xl border border-slate-300 bg-slate-50 p-4 font-mono text-xs text-slate-700">${esc(text)}</textarea>
        <div class="mt-5 flex flex-wrap gap-3">
          <button type="button" data-copy="${esc(text)}" class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <i data-lucide="copy" class="h-4 w-4"></i> Copy
          </button>
          <a href="${mailto}" class="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <i data-lucide="mail" class="h-4 w-4"></i> Send by email
          </a>
          <a href="${wa}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            <i data-lucide="message-circle" class="h-4 w-4"></i> Send via WhatsApp
          </a>
        </div>
      </div>`);
  }

  /* ------------------------------------------------------------
     Catalogue grid (rendered from PRODUCTS)
     ------------------------------------------------------------ */
  function productCardHTML(p) {
    const meta = [
      p.cas ? `CAS ${esc(p.cas)}` : '',
      p.mw ? `MW ${esc(p.mw)}` : '',
    ].filter(Boolean).join(' · ');
    const options = p.variants.map((v) => `<option value="${esc(v)}">${esc(v)}</option>`).join('');
    const href = p.category === 'standards' ? `product-${p.id}.html` : 'contact.html';
    return `
    <article class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-slate-200/70">
      <a href="${href}" class="relative block aspect-[4/3] bg-gradient-to-br from-slate-100 to-slate-200">
        <img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy" class="h-full w-full object-cover"
             onerror="this.style.display='none'; this.nextElementSibling.classList.add('is-shown')" />
        <div class="img-fallback absolute inset-0 place-items-center text-slate-300">
          <i data-lucide="${esc(p.icon || 'flask-conical')}" class="h-14 w-14"></i>
        </div>
        <span class="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-600 backdrop-blur">${esc(CATEGORIES[p.category] || p.category)}</span>
        ${p.purity ? `<span class="absolute right-3 top-3 rounded-full bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">${esc(p.purity)}</span>` : ''}
      </a>
      <div class="flex flex-1 flex-col p-5">
        <h3 class="text-base font-bold leading-snug text-slate-900">
          <a href="${href}" class="hover:text-brand-700">${esc(p.name)}</a>
        </h3>
        <p class="mt-1.5 font-mono text-[11px] text-slate-500">${meta || '&nbsp;'}</p>
        <p class="mt-2 flex-1 text-sm text-slate-600">${esc(p.summary)}</p>
        <div class="mt-4 flex items-center gap-2">
          <select id="variant-${esc(p.id)}" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100">
            ${options}
          </select>
          <button type="button" data-add="${esc(p.id)}" class="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700">
            <i data-lucide="plus" class="h-4 w-4"></i><span class="hidden sm:inline">RFQ</span>
          </button>
        </div>
      </div>
    </article>`;
  }

  function renderCatalog() {
    const grid = $('#catalogGrid');
    if (!grid) return;
    const q = state.query.trim().toLowerCase();
    const items = PRODUCTS.filter((p) => {
      const matchCat = state.category === 'all' || p.category === state.category;
      const hay = `${p.name} ${p.cas} ${p.summary} ${CATEGORIES[p.category] || ''}`.toLowerCase();
      return matchCat && (!q || hay.includes(q));
    });

    if (!items.length) {
      grid.innerHTML = `
        <div class="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
          <i data-lucide="search-x" class="mx-auto h-8 w-8 text-slate-300"></i>
          <p class="mt-3 font-semibold text-slate-700">No entries match your search.</p>
          <p class="mt-1 text-sm text-slate-500">Try a different term, or contact us for a custom sequence.</p>
        </div>`;
    } else {
      grid.innerHTML = items.map(productCardHTML).join('');
    }
    if (window.lucide) lucide.createIcons();
  }

  /* ------------------------------------------------------------
     Batch verification + COA modal
     ------------------------------------------------------------ */
  function verifyBatch() {
    const input = $('#lotInput');
    const result = $('#verifyResult');
    if (!input || !result) return;
    const lot = input.value.trim().toUpperCase();
    if (!lot) {
      toast('Enter a lot code to verify.', 'error');
      return;
    }
    const record = LOT_DATA[lot];
    if (!record) {
      result.className = 'mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700';
      result.innerHTML = `No record found for <span class="font-mono font-bold">${esc(lot)}</span>. Contact QC at <a class="underline" href="mailto:${esc(CONFIG.email)}">${esc(CONFIG.email)}</a>.`;
      result.classList.remove('hidden');
      return;
    }
    result.classList.add('hidden');
    openModal(batchResultHTML(lot));
  }

  function batchResultHTML(lot) {
    const d = LOT_DATA[lot];
    const rows = [
      ['HPLC purity', d.hplc],
      ['LC-MS observed MW', `${d.msObserved} Da`],
      ['Theoretical MW', `${d.msTheoretical} Da`],
      ['Mass delta', d.msDelta],
      ['Net content', d.netContent],
      ['Testing laboratory', d.lab],
      ['Test date', d.tested],
      ['Method', d.method],
    ].map(([k, v]) => `
      <div class="rounded-xl border border-slate-200 bg-slate-50 p-3">
        <dt class="text-[10px] font-bold uppercase tracking-wider text-slate-500">${esc(k)}</dt>
        <dd class="mt-1 font-mono text-sm font-semibold text-slate-900">${esc(v)}</dd>
      </div>`).join('');

    return `
      <div class="p-6 sm:p-8">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Batch verified</p>
            <h3 class="mt-1 text-xl font-bold text-slate-900">${esc(d.product)}</h3>
            <p class="mt-1 font-mono text-xs text-slate-500">Lot ${esc(d.lot)} · CAS ${esc(d.cas)}</p>
          </div>
          <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">${esc(d.status)}</span>
        </div>
        <dl class="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">${rows}</dl>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" data-open-coa="${esc(d.lot)}" class="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
            <i data-lucide="file-text" class="h-4 w-4"></i> Open full COA
          </button>
          <button type="button" data-close-modal class="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button>
        </div>
      </div>`;
  }

  function coaHTML(lot) {
    const d = LOT_DATA[lot];
    const rows = [
      ['Identity', 'ESI-LC-MS', `${d.msObserved} Da (theoretical ${d.msTheoretical} Da)`],
      ['Purity', 'RP-HPLC (214 nm)', d.hplc],
      ['Net content', 'Gravimetric', d.netContent],
      ['Appearance', 'Visual', 'White lyophilised powder'],
      ['Storage', '—', '−20 °C, protected from light'],
    ].map(([p, m, r]) => `
      <tr class="border-b border-slate-100">
        <td class="py-2.5 pr-3 text-slate-600">${esc(p)}</td>
        <td class="py-2.5 pr-3 font-mono">${esc(m)}</td>
        <td class="py-2.5 font-semibold text-slate-900">${esc(r)}</td>
      </tr>`).join('');

    return `
      <div class="p-6 sm:p-8">
        <div class="flex items-start justify-between border-b border-slate-200 pb-4">
          <div>
            <p class="text-[11px] font-bold uppercase tracking-widest text-slate-500">Certificate of Analysis</p>
            <h3 class="mt-1 text-lg font-bold text-slate-900">${esc(d.product)}</h3>
          </div>
          <div class="text-right font-mono text-[11px] text-slate-500">
            <div>Lot ${esc(d.lot)}</div>
            <div>${esc(d.tested)}</div>
          </div>
        </div>
        <table class="mt-4 w-full text-left text-sm">
          <thead>
            <tr class="border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500">
              <th class="py-2 font-bold">Parameter</th>
              <th class="py-2 font-bold">Method</th>
              <th class="py-2 font-bold">Result</th>
            </tr>
          </thead>
          <tbody class="font-mono text-xs text-slate-700">${rows}</tbody>
        </table>
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-[11px] text-amber-800">
          Template preview — replace with your laboratory's released certificate before publishing.
        </p>
        <div class="mt-6 flex flex-wrap gap-3">
          <button type="button" data-close-modal class="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Close</button>
        </div>
      </div>`;
  }

  /* ------------------------------------------------------------
     Modal
     ------------------------------------------------------------ */
  let modalReturnFocus = null;
  function openModal(html) {
    const modal = $('#modal');
    const panel = $('#modalPanel');
    if (!modal || !panel) return;
    panel.innerHTML = `
      <button type="button" data-close-modal class="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Close">
        <i data-lucide="x" class="h-5 w-5"></i>
      </button>
      ${html}`;
    modalReturnFocus = document.activeElement;
    modal.classList.remove('hidden');
    document.body.classList.add('no-scroll');
    if (window.lucide) lucide.createIcons();
    panel.querySelector('button')?.focus();
  }

  function closeModal() {
    $('#modal')?.classList.add('hidden');
    if ($('#rfqDrawer')?.classList.contains('translate-x-full')) {
      document.body.classList.remove('no-scroll');
    }
    modalReturnFocus?.focus?.();
  }

  /* ------------------------------------------------------------
     Institutional inquiry form
     ------------------------------------------------------------ */
  function submitInquiry(event) {
    event.preventDefault();
    const form = event.target;
    const data = new FormData(form);
    if (!data.get('researchOnly')) {
      toast('Please confirm the research-use declaration.', 'error');
      return;
    }
    const fields = ['name', 'organization', 'email', 'country', 'message']
      .map((k) => `${k}: ${data.get(k) || '—'}`)
      .join('\n');
    const subject = `Institutional inquiry — ${data.get('organization') || 'Website'}`;
    const body = `${fields}\n\nDeclaration: for in-vitro laboratory research use only.`;

    if (CONFIG.formEndpoint) {
      fetch(CONFIG.formEndpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: form })
        .then((r) => {
          if (r.ok) {
            form.reset();
            toast('Inquiry sent — we will reply within one business day.');
          } else {
            toast('Could not send. Please email us directly.', 'error');
          }
        })
        .catch(() => toast('Could not send. Please email us directly.', 'error'));
      return;
    }

    window.location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast('Opening your email client…');
  }

  /* ------------------------------------------------------------
     Global event delegation
     ------------------------------------------------------------ */
  document.addEventListener('click', (event) => {
    const target = event.target;

    const closeModalBtn = target.closest('[data-close-modal]');
    if (closeModalBtn) return closeModal();

    const openCoa = target.closest('[data-open-coa]');
    if (openCoa) return openModal(coaHTML(openCoa.dataset.openCoa));

    const copy = target.closest('[data-copy]');
    if (copy) return copyText(copy.dataset.copy);

    const openRfq = target.closest('[data-open-rfq]');
    if (openRfq) return openDrawer();

    const closeRfq = target.closest('[data-close-rfq]');
    if (closeRfq) return closeDrawer();

    const qty = target.closest('[data-q]');
    if (qty) return changeQty(qty.dataset.q, Number(qty.dataset.d));

    const remove = target.closest('[data-rm]');
    if (remove) return removeLine(remove.dataset.rm);

    const add = target.closest('[data-add]');
    if (add) {
      const id = add.dataset.add;
      const select = document.getElementById(`variant-${id}`);
      return addToRfq(id, select ? select.value : '');
    }

    const addProduct = target.closest('[data-add-product]');
    if (addProduct) {
      const select = document.querySelector('[data-variant-select]');
      return addToRfq(addProduct.dataset.addProduct, select ? select.value : '');
    }

    const navToggle = target.closest('[data-nav-toggle]');
    if (navToggle) {
      $('#mobileNav')?.classList.toggle('hidden');
      return;
    }

    if (target.closest('#mobileNav a')) $('#mobileNav')?.classList.add('hidden');
  });

  $('#rfqOverlay')?.addEventListener('click', closeDrawer);
  $('#modal')?.addEventListener('click', (e) => {
    if (e.target === $('#modal')) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if ($('#modal') && !$('#modal').classList.contains('hidden')) closeModal();
    else if ($('#rfqDrawer') && !$('#rfqDrawer').classList.contains('translate-x-full')) closeDrawer();
  });

  /* ------------------------------------------------------------
     Init
     ------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', () => {
    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();

    renderRfq();
    if (PAGE === 'catalog') renderCatalog();

    $('#catalogSearch')?.addEventListener('input', (e) => {
      state.query = e.target.value;
      renderCatalog();
    });

    $('#categoryFilters')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-cat]');
      if (!btn) return;
      state.category = btn.dataset.cat;
      $$('#categoryFilters [data-cat]').forEach((b) => {
        const active = b === btn;
        b.className =
          'cat-btn rounded-full border px-4 py-1.5 text-sm font-semibold transition ' +
          (active
            ? 'border-slate-900 bg-slate-900 text-white'
            : 'border-slate-300 bg-white text-slate-700 hover:border-slate-900');
      });
      renderCatalog();
    });

    $('#verifyBtn')?.addEventListener('click', verifyBatch);
    $('#lotInput')?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyBatch();
    });

    $('#inquiryForm')?.addEventListener('submit', submitInquiry);
    $('#submitRfq')?.addEventListener('click', submitRfq);

    if (window.lucide) lucide.createIcons();
  });
})();
