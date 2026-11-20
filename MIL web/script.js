// Basic carousel
const slides = document.querySelectorAll('.slide');
const dotsBox = document.getElementById('dots');
const count = document.getElementById('count');
const nextNum = document.getElementById('nextNum');
const nextTitle = document.getElementById('nextTitle');

let current = 0;

// make the diamond dots
slides.forEach((s, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot';
  dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
  dot.onclick = () => show(i);
  dotsBox.appendChild(dot);
});
const dots = document.querySelectorAll('.dot');

function show(n) {
  current = (n + slides.length) % slides.length;

  slides.forEach((s, i) => s.classList.toggle('active', i === current));
  dots.forEach((d, i) => d.classList.toggle('active', i === current));

  count.textContent = (current + 1) + ' / ' + slides.length;

  // update the "Next" card
  const nextIndex = (current + 1) % slides.length;
  nextNum.textContent = nextIndex + 1;
  nextTitle.textContent = slides[nextIndex].querySelector('h1').textContent;
}

// buttons
document.getElementById('prev').onclick = () => show(current - 1);
document.getElementById('nextBtn').onclick = () => show(current + 1);
document.getElementById('nextCard').onclick = () => show(current + 1);

// navbar links
document.querySelectorAll('[data-go]').forEach(link => {
  link.onclick = e => {
    e.preventDefault();
    show(Number(link.dataset.go));
  };
});

// keyboard arrows
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') show(current + 1);
  if (e.key === 'ArrowLeft') show(current - 1);
});

// swipe on phones
let startX = 0;
document.querySelector('.stage').addEventListener('touchstart', e => startX = e.touches[0].clientX);
document.querySelector('.stage').addEventListener('touchend', e => {
  const diff = e.changedTouches[0].clientX - startX;
  if (Math.abs(diff) > 50) show(diff < 0 ? current + 1 : current - 1);
});

// ---------- Document viewer (multi-page documents) ----------
const modal = document.getElementById('modal');
const docFrame = document.getElementById('docFrame');

const docLink = document.getElementById('docLink');

function openDoc(path) {
  // browsers that can't show PDFs inline (many phones): open in a new tab
  if (navigator.pdfViewerEnabled === false) {
    window.open(path, '_blank');
    return;
  }
  docFrame.src = path;
  docLink.href = path;
  modal.classList.add('open');
}
function closeDoc() {
  modal.classList.remove('open');
  docFrame.src = '';
}

document.querySelectorAll('.read-btn').forEach(btn => {
  btn.onclick = () => openDoc(btn.dataset.doc);
});
document.getElementById('modalClose').onclick = closeDoc;
modal.onclick = e => { if (e.target === modal) closeDoc(); };

// Esc closes the viewer; arrow keys won't flip slides while it is open
document.addEventListener('keydown', e => {
  if (!modal.classList.contains('open')) return;
  if (e.key === 'Escape') closeDoc();
  if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') e.stopImmediatePropagation();
}, true);

show(0);
