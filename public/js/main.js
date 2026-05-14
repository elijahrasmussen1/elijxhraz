/* handle missing optional icons gracefully */
const robloxIcon = document.getElementById('roblox-icon');
if (robloxIcon) {
  robloxIcon.addEventListener('error', function () {
    const text = document.createTextNode('⬛');
    robloxIcon.replaceWith(text);
  });
}

/* ─────────────────────────────────────────
   PARTICLE GENERATOR
───────────────────────────────────────── */
(function spawnParticles() {
  const container = document.getElementById('particles');
  const count = 28;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const size  = Math.random() * 4 + 2;          // 2–6 px
    const left  = Math.random() * 100;             // % across screen
    const delay = Math.random() * 12;              // seconds offset
    const dur   = Math.random() * 14 + 10;         // 10–24 s

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
    `;

    container.appendChild(p);
  }
})();

/* ─────────────────────────────────────────
   MUSIC PLAYER
───────────────────────────────────────── */
const TOTAL_SECONDS = 109;   // 1:49

let currentSeconds = 20;     // start at 0:20
let isPlaying = true;
let ticker = null;

const fill    = document.getElementById('progress-fill');
const thumb   = document.getElementById('progress-thumb');
const timeCur = document.getElementById('time-current');
const timeEnd = document.getElementById('time-total');
const btnPlay = document.getElementById('btn-play');
const btnVol  = document.getElementById('btn-vol');
const track   = document.getElementById('progress-track');

function formatTime(s) {
  const m = Math.floor(s / 60);
  const sec = String(s % 60).padStart(2, '0');
  return `${m}:${sec}`;
}

function updateUI() {
  const pct = (currentSeconds / TOTAL_SECONDS) * 100;
  fill.style.width    = pct + '%';
  thumb.style.left    = pct + '%';
  timeCur.textContent = formatTime(currentSeconds);
  timeEnd.textContent = formatTime(TOTAL_SECONDS);
}

function startTicker() {
  if (ticker) return;
  ticker = setInterval(() => {
    if (currentSeconds < TOTAL_SECONDS) {
      currentSeconds++;
      updateUI();
    } else {
      currentSeconds = 0;
      updateUI();
    }
  }, 1000);
}

function stopTicker() {
  clearInterval(ticker);
  ticker = null;
}

/* play / pause button */
btnPlay.addEventListener('click', () => {
  isPlaying = !isPlaying;
  btnPlay.textContent = isPlaying ? '⏸' : '▶';
  if (isPlaying) startTicker(); else stopTicker();
});

/* previous button */
document.getElementById('btn-prev').addEventListener('click', () => {
  currentSeconds = 0;
  updateUI();
});

/* volume toggle */
let muted = false;
btnVol.addEventListener('click', () => {
  muted = !muted;
  btnVol.textContent = muted ? '🔇' : '🔊';
});

/* click-to-seek on progress track */
track.addEventListener('click', (e) => {
  const rect  = track.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  currentSeconds = Math.round(ratio * TOTAL_SECONDS);
  updateUI();
});

/* drag-to-seek */
let dragging = false;
thumb.addEventListener('mousedown', (e) => { dragging = true; e.preventDefault(); });
document.addEventListener('mousemove', (e) => {
  if (!dragging) return;
  const rect  = track.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  currentSeconds = Math.round(ratio * TOTAL_SECONDS);
  updateUI();
});
document.addEventListener('mouseup', () => { dragging = false; });

/* touch drag */
thumb.addEventListener('touchstart', (e) => { dragging = true; }, { passive: true });
document.addEventListener('touchmove', (e) => {
  if (!dragging) return;
  const rect  = track.getBoundingClientRect();
  const ratio = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width));
  currentSeconds = Math.round(ratio * TOTAL_SECONDS);
  updateUI();
}, { passive: true });
document.addEventListener('touchend', () => { dragging = false; });

/* kick it off */
updateUI();
startTicker();
