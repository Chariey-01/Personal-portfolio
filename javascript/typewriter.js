/* =============================================
   typewriter.js — Animated name typewriter
   ============================================= */

const el    = document.getElementById('typedName');
const names = ['Charity.', 'a Builder.', 'a Creator.', 'Jepkoech.'];
let nameIdx = 0, charIdx = 0, deleting = false;

function type() {
  const current = names[nameIdx];

  if (!deleting) {
    el.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      // Pause at full word before deleting
      deleting = true;
      setTimeout(type, nameIdx === names.length - 1 ? 99999 : 1800);
      return;
    }
    setTimeout(type, 80);
  } else {
    el.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      nameIdx  = (nameIdx + 1) % names.length;
      setTimeout(type, 300);
      return;
    }
    setTimeout(type, 45);
  }
}

// Start after a short delay so page loads first
setTimeout(type, 600);