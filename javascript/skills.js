/* =============================================
   skills.js — Tech stack data + render
   ============================================= */

(function () {
const SKILLS = [
  { icon: '⚛️',  name: 'React'       },
  { icon: '🐍',  name: 'Python'      },
  { icon: '🟨',  name: 'JavaScript'  },
  { icon: '🌐',  name: 'HTML & CSS'  },
  { icon: '🔷',  name: 'TypeScript'  },
  { icon: '🎨',  name: 'Tailwind'    },
  { icon: '🛠️',  name: 'Node.js'     },  
  { icon: '🧪',  name: 'pytest'      },
  { icon: '🐙',  name: 'Git & GitHub'},
  { icon: '▲',   name: 'Vercel'      },
  { icon: '📦',  name: 'npm / pip'   },
  { icon: '🖥️',  name: 'CLI / Bash'  },
  { icon: '🎯',  name: 'OOP'         },
];

const skillsGrid = document.getElementById('skillsGrid');
if (!skillsGrid) return;

SKILLS.forEach((skill, i) => {
  const card = document.createElement('div');
  card.className = 'skill-card';
  card.innerHTML = `
    <div class="skill-card__icon">${skill.icon}</div>
    <div class="skill-card__name">${skill.name}</div>
  `;
  // Stagger reveal via IntersectionObserver (set in scroll.js)
  card.style.transitionDelay = `${i * 40}ms`;
  skillsGrid.appendChild(card);
});
})();
