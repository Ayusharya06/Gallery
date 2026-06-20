// =============================================
//  script.js — Lumina Image Gallery
// =============================================

// ── Image Data ──
const IMAGES = [
  { id:1,  src:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', thumb:'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', title:'Mountain Serenity', cat:'nature',   location:'Swiss Alps' },
  { id:2,  src:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800', thumb:'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=200', title:'City Geometry',   cat:'urban',    location:'New York' },
  { id:3,  src:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800', thumb:'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200', title:'Golden Light',    cat:'portrait', location:'Studio' },
  { id:4,  src:'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800', thumb:'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=200', title:'Chromatic Flow',  cat:'abstract', location:'Digital' },
  { id:5,  src:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', thumb:'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200', title:'Forest Path',    cat:'nature',   location:'Oregon' },
  { id:6,  src:'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800', thumb:'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=200', title:'Night Streets',  cat:'urban',    location:'Tokyo' },
  { id:7,  src:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=800', thumb:'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=200', title:'Silent Gaze',    cat:'portrait', location:'Paris' },
  { id:8,  src:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', thumb:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200', title:'Neon Geometry',  cat:'abstract', location:'Digital' },
  { id:9,  src:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800', thumb:'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=200', title:'Santorini Dawn', cat:'travel',   location:'Greece' },
  { id:10, src:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', thumb:'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=200', title:'Aerial Meadow',  cat:'nature',   location:'Iceland' },
  { id:11, src:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800', thumb:'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200', title:'Steel & Glass',  cat:'urban',    location:'Chicago' },
  { id:12, src:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800', thumb:'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', title:'Soft Focus',     cat:'portrait', location:'Milan' },
  { id:13, src:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800', thumb:'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=200', title:'Liquid Color',   cat:'abstract', location:'Digital' },
  { id:14, src:'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=800', thumb:'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=200', title:'Kyoto Temples',  cat:'travel',   location:'Japan' },
  { id:15, src:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', thumb:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200', title:'Contemplation',  cat:'portrait', location:'Berlin' },
  { id:16, src:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800', thumb:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', title:'Circuit Mind',   cat:'abstract', location:'Digital' },
];

// ── DOM References ──
const grid      = document.getElementById('galleryGrid');
const lightbox  = document.getElementById('lightbox');
const lbImg     = document.getElementById('lbImg');
const lbTitle   = document.getElementById('lbTitle');
const lbSubtitle= document.getElementById('lbSubtitle');
const lbCounter = document.getElementById('lbCounter');
const lbThumbs  = document.getElementById('lbThumbs');

// ── State ──
let currentIndex   = 0;
let visibleImages  = [...IMAGES];
let currentFilter  = 'none';


// =============================================
//  CATEGORY COUNTS
// =============================================
const cats = ['nature', 'urban', 'portrait', 'abstract', 'travel'];
document.getElementById('count-all').textContent = IMAGES.length;
cats.forEach(c => {
  const el = document.getElementById('count-' + c);
  if (el) el.textContent = IMAGES.filter(i => i.cat === c).length;
});


// =============================================
//  BUILD GRID
// =============================================
function buildGrid(images) {
  // Remove old items (keep no-results div)
  grid.querySelectorAll('.gallery-item').forEach(el => el.remove());

  images.forEach((img, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.id  = img.id;
    item.dataset.idx = idx;
    item.style.animationDelay = (idx * 0.04) + 's';

    item.innerHTML = `
      <img src="${img.src}" alt="${img.title}" loading="lazy">
      <div class="item-overlay">
        <div class="item-title">${img.title}</div>
        <div class="item-meta">${img.location} · ${img.cat}</div>
      </div>
      <div class="item-index">${String(idx + 1).padStart(2, '0')}</div>
    `;

    item.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(item);
  });

  // Show/hide empty state
  const noRes = document.getElementById('noResults');
  noRes.style.display = images.length === 0 ? 'block' : 'none';
}


// =============================================
//  CATEGORY FILTER
// =============================================
document.getElementById('filterBar').addEventListener('click', e => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const cat = btn.dataset.cat;
  visibleImages = cat === 'all' ? [...IMAGES] : IMAGES.filter(i => i.cat === cat);
  buildGrid(visibleImages);
});


// =============================================
//  LIGHTBOX — OPEN / CLOSE
// =============================================
function openLightbox(idx) {
  currentIndex = idx;
  updateLightbox();
  buildThumbs();
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function updateLightbox(fade = false) {
  const img = visibleImages[currentIndex];
  if (!img) return;

  if (fade) {
    lbImg.classList.add('fading');
    setTimeout(() => {
      lbImg.src = img.src;
      lbImg.alt = img.title;
      lbImg.classList.remove('fading');
    }, 200);
  } else {
    lbImg.src = img.src;
    lbImg.alt = img.title;
  }

  // Apply current image filter
  lbImg.style.filter = currentFilter === 'none' ? '' : currentFilter;

  lbTitle.textContent    = img.title;
  lbSubtitle.textContent = img.location + ' · ' + img.cat.toUpperCase();
  lbCounter.textContent  = (currentIndex + 1) + ' / ' + visibleImages.length;

  updateThumbHighlight();
}


// =============================================
//  LIGHTBOX — NAVIGATION
// =============================================
document.getElementById('lbPrev').addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length;
  updateLightbox(true);
});

document.getElementById('lbNext').addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % visibleImages.length;
  updateLightbox(true);
});

document.getElementById('lbClose').addEventListener('click', closeLightbox);

// Click outside image to close
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'ArrowLeft')  { currentIndex = (currentIndex - 1 + visibleImages.length) % visibleImages.length; updateLightbox(true); }
  if (e.key === 'ArrowRight') { currentIndex = (currentIndex + 1) % visibleImages.length; updateLightbox(true); }
  if (e.key === 'Escape')     closeLightbox();
});


// =============================================
//  THUMBNAILS
// =============================================
function buildThumbs() {
  lbThumbs.innerHTML = '';
  visibleImages.forEach((img, idx) => {
    const t = document.createElement('img');
    t.src       = img.thumb;
    t.alt       = img.title;
    t.className = 'lb-thumb' + (idx === currentIndex ? ' active' : '');
    t.addEventListener('click', () => {
      currentIndex = idx;
      updateLightbox(true);
    });
    lbThumbs.appendChild(t);
  });
  scrollThumbIntoView();
}

function updateThumbHighlight() {
  lbThumbs.querySelectorAll('.lb-thumb').forEach((t, i) => {
    t.classList.toggle('active', i === currentIndex);
  });
  scrollThumbIntoView();
}

function scrollThumbIntoView() {
  const thumb = lbThumbs.children[currentIndex];
  if (thumb) thumb.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
}


// =============================================
//  IMAGE FILTERS (in lightbox)
// =============================================
document.querySelectorAll('.lb-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lb-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter       = btn.dataset.filter;
    lbImg.style.filter  = currentFilter === 'none' ? '' : currentFilter;
  });
});


// =============================================
//  INIT
// =============================================
buildGrid(IMAGES);