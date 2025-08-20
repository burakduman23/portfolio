const state = {
  theme: 'auto',
  data: null
};

initTheme();
wireEvents();
loadData();

function initTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    document.documentElement.setAttribute('data-theme', saved);
    state.theme = saved;
  }
}

function wireEvents() {
  const themeToggle = document.getElementById('themeToggle');
  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    let next;
    if (!current || current === 'auto') {
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      next = prefersDark ? 'light' : 'dark';
    } else {
      next = current === 'dark' ? 'light' : 'dark';
    }
    document.documentElement.setAttribute('data-theme', next);
    state.theme = next;
    localStorage.setItem('theme', next);
  });

  const toLatest = document.getElementById('toLatest');
  toLatest?.addEventListener('click', () => scrollToBottom(true));
  window.addEventListener('scroll', () => toggleFabVisibility());
}

async function loadData() {
  try {
    const res = await fetch('data/entries.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load data: ${res.status}`);
    state.data = await res.json();
    render(state.data);
    requestAnimationFrame(() => scrollToBottom(false));
  } catch (err) {
    console.error(err);
  }
}

function render(data) {
  const nameEl = document.getElementById('name');
  const siteName = document.getElementById('siteName');
  const taglineEl = document.getElementById('tagline');
  const linksEl = document.getElementById('links');
  const itemsEl = document.getElementById('timelineItems');

  if (data.name) {
    nameEl.textContent = data.name;
    siteName.textContent = data.name;
    document.title = `${data.name} — Portfolio`;
  }
  if (data.tagline) taglineEl.textContent = data.tagline;
  if (Array.isArray(data.links)) {
    linksEl.innerHTML = '';
    data.links.forEach(l => {
      const a = document.createElement('a');
      a.href = l.url;
      a.textContent = l.label || l.url;
      a.target = '_blank';
      a.rel = 'noopener';
      linksEl.appendChild(a);
    });
  }

  const entries = Array.isArray(data.entries) ? [...data.entries] : [];
  entries.sort((a, b) => new Date(a.date) - new Date(b.date));
  itemsEl.innerHTML = '';

  const fmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short' });
  entries.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'item';

    const leftCol = document.createElement('div');
    leftCol.className = 'col left';
    const centerCol = document.createElement('div');
    centerCol.className = 'center';
    const rightCol = document.createElement('div');
    rightCol.className = 'col right';

    const dot = document.createElement('span');
    dot.className = 'dot';
    const time = document.createElement('div');
    time.className = 'time';
    const d = entry.date ? new Date(entry.date) : null;
    time.textContent = d ? fmt.format(d) : '';
    centerCol.appendChild(dot);
    centerCol.appendChild(time);

    const card = document.createElement('article');
    card.className = 'card';
    if (entry.title) {
      const h3 = document.createElement('h3');
      h3.textContent = entry.title;
      card.appendChild(h3);
    }
    if (entry.description) {
      const p = document.createElement('p');
      p.textContent = entry.description;
      card.appendChild(p);
    }
    if (Array.isArray(entry.tags) && entry.tags.length) {
      const tags = document.createElement('div');
      tags.className = 'tags';
      entry.tags.forEach(t => {
        const tag = document.createElement('span');
        tag.className = 'tag';
        tag.textContent = t;
        tags.appendChild(tag);
      });
      card.appendChild(tags);
    }
    if (entry.link && entry.link.url) {
      const a = document.createElement('a');
      a.className = 'cta';
      a.href = entry.link.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.innerHTML = `${entry.link.label || 'Learn more'} →`;
      card.appendChild(a);
    }

    const gallery = (Array.isArray(entry.images) && entry.images.length)
      ? buildGallery(entry.images) : null;

    const isEven = index % 2 === 0; // alternating: content left for even rows
    if (isEven) {
      leftCol.appendChild(card);
      if (gallery) rightCol.appendChild(gallery);
    } else {
      rightCol.appendChild(card);
      if (gallery) leftCol.appendChild(gallery);
    }

    item.appendChild(leftCol);
    item.appendChild(centerCol);
    item.appendChild(rightCol);
    itemsEl.appendChild(item);
  });
}

function scrollToBottom(smooth) {
  const top = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  window.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
}

function toggleFabVisibility() {
  const fab = document.getElementById('toLatest');
  const nearBottom = (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 80);
  fab.style.opacity = nearBottom ? '0.2' : '1';
}

function resolveImageSrc(src) {
  if (!src) return '';
  const isAbsolute = /^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:');
  if (isAbsolute) return src;
  if (src.startsWith('images/')) return src;
  return `images/${src}`;
}

function normalizeImage(imgData) {
  if (typeof imgData === 'string') return { src: imgData };
  if (imgData && typeof imgData === 'object') return {
    src: imgData.src,
    alt: imgData.alt,
    caption: imgData.caption,
    width: imgData.width,
    height: imgData.height
  };
  return { src: '' };
}

function buildGallery(images) {
  // Use the carousel for 1+ images so size/behavior stays consistent.
  return buildCarousel(images);
}

function buildCarousel(images) {
  const container = document.createElement('div');
  container.className = 'carousel';
  container.setAttribute('tabindex', '0');
  const viewport = document.createElement('div');
  viewport.className = 'carousel-viewport';
  container.appendChild(viewport);

  const items = [];
  images.forEach(imgData => {
    const { src, alt } = normalizeImage(imgData);
    const resolved = resolveImageSrc(src);
    if (!resolved) return;
    const fig = document.createElement('figure');
    fig.className = 'carousel-item';
    const img = document.createElement('img');
    img.loading = 'lazy';
    img.src = resolved;
    img.alt = alt || '';
    fig.appendChild(img);
    viewport.appendChild(fig);
    items.push(fig);
  });

  let active = 0;
  const total = items.length;

  const prev = document.createElement('button');
  prev.className = 'arrow left';
  prev.setAttribute('aria-label', 'Previous image');
  prev.textContent = '‹';
  const next = document.createElement('button');
  next.className = 'arrow right';
  next.setAttribute('aria-label', 'Next image');
  next.textContent = '›';
  container.appendChild(prev);
  container.appendChild(next);

  if (total <= 1) {
    prev.style.display = 'none';
    next.style.display = 'none';
  }

  function layout() {
    items.forEach((el, i) => {
      const rel = ((i - active) % total + total) % total; // 0..total-1
      let tx = 0;
      let scale = 1;
      let rotate = 0;
      let opacity = 1;
      let z = 3;
      if (rel === 0) {
        tx = 0; scale = 1; rotate = 0; opacity = 1; z = 3;
      } else if (rel === 1) {
        tx = 40; scale = 0.9; rotate = -12; opacity = 0.9; z = 2;
      } else if (rel === total - 1) {
        tx = -40; scale = 0.9; rotate = 12; opacity = 0.9; z = 2;
      } else if (rel <= Math.floor(total / 2)) {
        tx = 80; scale = 0.8; rotate = -16; opacity = 0.6; z = 1;
      } else {
        tx = -80; scale = 0.8; rotate = 16; opacity = 0.6; z = 1;
      }
      el.style.transform = `translateX(calc(-50% + ${tx}%)) perspective(900px) rotateY(${rotate}deg) scale(${scale})`;
      el.style.zIndex = String(z);
      el.style.opacity = String(opacity);
    });
  }

  function step(delta) {
    active = (active + delta + total) % total;
    layout();
  }

  prev.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  container.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });

  // Click to open if active; otherwise bring clicked image to front.
  items.forEach((el, i) => {
    el.addEventListener('click', (ev) => {
      ev.preventDefault();
      if (i !== active) {
        active = i;
        layout();
      } else {
        const img = el.querySelector('img');
        if (img && img.src) window.open(img.src, '_blank', 'noopener');
      }
    });
  });

  layout();
  return container;
}


