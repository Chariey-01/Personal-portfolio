/* =============================================
   cursor.js — Custom cursor + trail
   ============================================= */

(function () {
const cursor = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

if (!cursor || !cursorTrail || !window.matchMedia('(pointer: fine)').matches) return;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let trailX = mouseX;
let trailY = mouseY;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
  cursor.classList.add('is-visible');
  cursorTrail.classList.add('is-visible');
});

// Trail follows with lerp
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;
  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';
  requestAnimationFrame(animateTrail);
}
animateTrail();

const hoverSelector = 'a, button, .skill-card, .project-card, .pill, .btn';

document.addEventListener('pointerover', (e) => {
  const target = e.target.closest(hoverSelector);
  const related = e.relatedTarget instanceof Node ? e.relatedTarget : null;
  if (target && !target.contains(related)) {
    cursor.classList.add('is-hovering');
    cursorTrail.classList.add('is-hovering');
  }
});

document.addEventListener('pointerout', (e) => {
  const target = e.target.closest(hoverSelector);
  const related = e.relatedTarget instanceof Node ? e.relatedTarget : null;
  if (target && !target.contains(related)) {
    cursor.classList.remove('is-hovering');
    cursorTrail.classList.remove('is-hovering');
  }
});
})();
