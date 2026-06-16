/* =============================================
   particles.js — Hero canvas particle field
   ============================================= */

const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');

let W, H, particles = [];
const COUNT = 90;

function resize() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x    = Math.random() * W;
    this.y    = Math.random() * H;
    this.vx   = (Math.random() - 0.5) * 0.4;
    this.vy   = (Math.random() - 0.5) * 0.4;
    this.r    = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '#6c63ff' : '#00d4aa';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

for (let i = 0; i < COUNT; i++) particles.push(new Particle());

// Mouse influence
let mx = -9999, my = -9999;
document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
});

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108,99,255,${0.08 * (1 - dist / 120)})`;
        ctx.lineWidth   = 0.6;
        ctx.stroke();
      }
    }
    // Connect to mouse
    const dx   = particles[i].x - mx;
    const dy   = particles[i].y - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 150) {
      ctx.beginPath();
      ctx.moveTo(particles[i].x, particles[i].y);
      ctx.lineTo(mx, my);
      ctx.strokeStyle = `rgba(0,212,170,${0.15 * (1 - dist / 150)})`;
      ctx.lineWidth   = 0.8;
      ctx.stroke();
    }
  }
}

function loop() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(loop);
}
loop();