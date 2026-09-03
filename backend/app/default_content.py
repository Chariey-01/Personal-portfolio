DEFAULT_PROFILE = {
    "name": "Charity Jepkoech",
    "alias": "Chariey",
    "location": "Nairobi, Kenya",
    "role": "Full Stack Software Engineer",
    "email": "charityjepkoech007@gmail.com",
    "headline": "I am building toward full-stack product engineering.",
    "bio": "I build React interfaces, Flask APIs, and database-backed projects with a focus on readable systems I can keep improving.",
    "story": (
        "My path into engineering has not been perfectly linear, but I kept building. "
        "I first studied Computer Science at Egerton University, where I gained early foundations, "
        "even though that university path was interrupted before completion. I later chose a more "
        "deliberate software-engineering route through Moringa School and through the work that has "
        "taught me the most: building applications, breaking them, rebuilding them, and learning in public. "
        "I tend to aim higher than my current level, which means I am often working on projects that stretch me. "
        "That has made me persistent, practical, and serious about becoming a stronger full-stack engineer."
    ),
    "profile_image_url": "/images/profile/charity-jepkoech.png",
    "profile_image_alt": "Portrait of Charity Jepkoech",
    "availability": "Open to full-stack software engineering opportunities",
    "focus_stack": ["React", "TypeScript", "Flask", "SQLAlchemy", "pytest"],
    "links": [
        {"label": "GitHub", "href": "https://github.com/Chariey-01"},
        {"label": "LinkedIn", "href": "https://www.linkedin.com/in/charity-jepkoech-91b5b6330"},
        {"label": "Vercel", "href": "https://vercel.com/chariey-01s-projects"},
    ],
}

DEFAULT_PROJECTS = [
    {
        "title": "AuRevia",
        "slug": "aurevia",
        "status": "Live",
        "featured": True,
        "display_order": 1,
        "short_description": "Team e-commerce SPA with routed catalog, product, cart, and management screens.",
        "case_study": "My focus was frontend flow, shared UI consistency, and stateful shopping interactions.",
        "role": "Frontend engineer on a team project",
        "technologies": ["React", "React Router", "JSON Server", "Canvas API", "CSS", "Git"],
        "github_url": "https://github.com/Chariey-01/REACT-PERSONAL-PROJECTS-SHOWCASE-APP",
        "live_url": "https://react-personal-projects-showcase-ap.vercel.app/",
        "problem": "Build a product-shopping flow that keeps catalog browsing, cart behavior, and management screens understandable across routes.",
        "architecture": [
            "React Router separates landing, catalog, product, cart, and management views.",
            "JSON Server gives the frontend a REST-shaped data layer for CRUD practice.",
            "Shared components keep product cards, navigation, and forms consistent across team contributions.",
        ],
        "highlights": [
            "Cart-oriented interaction design",
            "Client-side CRUD workflow against a local API shape",
            "Canvas animation used as enhancement rather than core navigation",
        ],
        "technical_challenges": [
            "Keeping team contributions consistent across shared UI conventions",
            "Managing client state across routed flows without overcomplicating the app",
        ],
    },
    {
        "title": "Learning Roadmap App",
        "slug": "learning-roadmap-app",
        "status": "Live",
        "featured": True,
        "display_order": 2,
        "short_description": "Solo learning tracker for roadmap progress, streaks, achievements, and local persistence.",
        "case_study": "The project is strongest as a React state and responsive UI exercise.",
        "role": "Solo developer",
        "technologies": ["React", "Tailwind CSS", "Vercel", "local persistence"],
        "github_url": "https://github.com/Chariey-01/PROGRESS-TRACKING-APP",
        "live_url": "https://progress-tracking-app.vercel.app/",
        "problem": "Turn a long learning plan into daily progress a learner can actually see and update.",
        "architecture": [
            "Componentized React interface separates roadmap, progress, streak, and badge views.",
            "Stateful interactions keep learning progress visible without leaving the page.",
            "Vercel deployment keeps the project simple to share and review.",
        ],
        "highlights": ["Streak tracking", "Achievement badges", "Countdown-oriented motivation"],
        "technical_challenges": [
            "Balancing motivational UI with clear progress information",
            "Keeping the experience responsive across small screens",
        ],
    },
    {
        "title": "Python Project Management CLI",
        "slug": "python-project-management-cli",
        "status": "Completed",
        "featured": True,
        "display_order": 3,
        "short_description": "Python CLI focused on object-oriented modeling, data structures, and testable backend logic.",
        "case_study": "A backend-first project without a browser UI.",
        "role": "Backend-focused developer",
        "technologies": ["Python", "OOP", "pytest", "CLI", "data structures"],
        "github_url": "https://github.com/Chariey-01/Python-Project-Management-CLI",
        "problem": "Model project-management behavior in Python while keeping business rules separate from command-line interaction.",
        "architecture": [
            "Object-oriented modules separate domain logic from command-line interaction.",
            "pytest coverage validates important behavior without relying on manual CLI checks.",
            "Data structures represent project entities and relationships.",
        ],
        "highlights": ["OOP domain modeling", "pytest workflow", "CLI-first backend practice"],
        "technical_challenges": [
            "Designing classes that remain easy to test",
            "Keeping command interaction separate from core rules",
        ],
    },
]
