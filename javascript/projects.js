/* =============================================
   projects.js — Project cards data + render
   =============================================
   */

(function () {
const PROJECTS = [
  {
    emoji: '🛍️',
    title: 'AuRevia',
    desc: 'Collaborative team project — A full-featured e-commerce SPA with client-side routing, cart state management, an admin portal, and a canvas-animated landing page.A full CRUD, React Router v6, and Git collaboration',
    tags: ['React', 'React Router', 'JSON Server', 'Canvas API', 'CSS','Git','CRUD',],
    liveUrl: 'https://react-personal-projects-showcase-ap.vercel.app/',   
    repoUrl: 'https://github.com/Chariey-01/REACT-PERSONAL-PROJECTS-SHOWCASE-APP', 
  },
  {
    emoji: '🗺️',
    title: 'Learning Roadmap App',
    desc: 'Personal full-stack learning tracker with streak tracking, achievement badges, progress persistence, and a countdown timer.',
    tags: ['React', 'useState', 'useEffect', 'Tailwind', 'Vercel'],
    liveUrl: 'https://progress-tracking-app.vercel.app/',     
    repoUrl: 'https://github.com/Chariey-01/PROGRESS-TRACKING-APP', 
  },
  {
    emoji: '🤝',
    title: 'Dev Showcase App',
    desc: ' A first personal projects showcase To showcase my understanding of hardcoded css.Now I know how to use the styling frameworks',
    tags: ['HTML', 'CSS', 'REST API'],
    liveUrl:'https://wordly-hv64.vercel.app/',  
    repoUrl: 'https://github.com/Chariey-01/WORDLY', 
  },
  {
    emoji: '🐍',
    title: 'Python OOP Library',
    desc: 'Advanced OOP system built at Moringa covering __slots__, design patterns, and OOP-based data structures with full pytest coverage.',
    tags: ['Python', 'OOP', 'pytest', 'Design Patterns', 'Data Structures'],
    liveUrl: null,                                
    repoUrl: 'https://github.com/Chariey-01/Python-Project-Management-CLI', 
  },
  {
    emoji: '✨',
    title: 'Precious e-Resort',
    desc: 'Creative motivational video project — Nike-inspired voiceover script, HD/4K animal & nature footage, edited in CapCut.',
    tags: ['CapCut', 'Creative Direction', 'Canva', 'Storytelling'],
    liveUrl: null,
    repoUrl: null,
  },
  {
    emoji: '♟️',
    title: 'Chess Tactics Trainer',
    desc: 'Coming soon — an interactive chess puzzle trainer built with React, helping players sharpen tactical vision step by step.',
    tags: ['React', 'Chess.js', 'Algorithms', 'In Progress'],
    liveUrl: null,
    repoUrl: null,
  },
];

const projectsGrid = document.getElementById('projectsGrid');
if (!projectsGrid) return;

PROJECTS.forEach((proj, i) => {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.style.transitionDelay = `${i * 80}ms`;

  const tagsHTML = proj.tags.map(t => `<span class="tag">${t}</span>`).join('');

  const linksHTML = [
    proj.liveUrl ? `<a href="${proj.liveUrl}" target="_blank" class="project-link">↗ Live</a>` : '',
    proj.repoUrl ? `<a href="${proj.repoUrl}" target="_blank" class="project-link">⌥ Code</a>` : '',
    (!proj.liveUrl && !proj.repoUrl) ? `<span class="project-link" style="opacity:0.4">🔒 Private / WIP</span>` : '',
  ].filter(Boolean).join('');

  card.innerHTML = `
    <div class="project-card__header">
      <div class="project-card__emoji">${proj.emoji}</div>
      <div class="project-card__title">${proj.title}</div>
      <div class="project-card__desc">${proj.desc}</div>
    </div>
    <div class="project-card__body">
      <div class="project-card__tags">${tagsHTML}</div>
    </div>
    <div class="project-card__footer">
      ${linksHTML}
    </div>
  `;

  projectsGrid.appendChild(card);
});
})();
