# Charity Jepkoech Portfolio

A full-stack software engineering portfolio for Charity Jepkoech, also known as Chariey. The rebuild moves the site from static HTML/CSS/JavaScript to a maintainable React, TypeScript, Tailwind CSS, Three.js, and Flask architecture.

The design is inspired by modern 3D developer portfolios, but the implementation uses original geometry, verified personal content from this repository, and structured placeholders where real details are still needed.

## Architecture

```text
.
├── frontend/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── sections/
│       ├── services/
│       ├── three/
│       └── types/
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── config.py
│   │   ├── extensions.py
│   │   └── models.py
│   ├── tests/
│   ├── requirements.txt
│   └── wsgi.py
└── .github/workflows/ci.yml
```

## Frontend

- React and TypeScript through Vite
- Tailwind CSS for responsive styling
- React Three Fiber and Drei for a lightweight original 3D hero scene
- Framer Motion dependency reserved for future section animation polish
- Lucide React icons
- TypeScript checks for frontend validation in CI

## Backend

- Flask application factory
- Flask-SQLAlchemy model for contact messages
- Flask-Migrate-ready extension setup
- CORS configured from `FRONTEND_URL`
- Contact endpoint with validation and database persistence
- pytest API coverage

## Portfolio Sections

- Hero with name, positioning, CTAs, and 3D system visual
- About section with verified training and engineering focus
- Technology groups organized by frontend, backend, data, and engineering
- Featured projects written as engineering case studies
- Deeper case-study section for architecture, highlights, and challenges
- Experience and education timeline with placeholders where facts are missing
- Contact form with validation, loading, success, and error states
- Footer with professional positioning

## Local Setup

Install frontend dependencies:

```bash
npm install
```

Run the frontend:

```bash
npm run dev
```

Create and activate a Python virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Run the backend:

```bash
cd backend
flask --app wsgi run
```

Create local database tables before testing the contact form manually:

```bash
cd backend
flask --app wsgi cli init-db
```

## Environment Variables

Copy `.env.example` to `.env` for local backend configuration.

| Variable | Purpose |
| --- | --- |
| `SECRET_KEY` | Flask signing secret |
| `DATABASE_URL` | SQLAlchemy database URL; PostgreSQL is recommended for production |
| `FRONTEND_URL` | Comma-separated allowed frontend origins |
| `CONTACT_RATE_LIMIT_SECONDS` | Reserved rate-limit window for contact submissions |

Do not commit `.env` or real secret values.

## Testing

Frontend:

```bash
npm run lint
npm test
npm run build
```

`npm run lint` and `npm test` currently run TypeScript validation. Full component tests can be added once the dependency set is expanded.

Backend:

```bash
cd backend
pytest
```

## Deployment

Recommended deployment split:

- Frontend: Vercel
- Backend: Render or another Python host
- Database: Neon PostgreSQL or managed PostgreSQL

Frontend build command:

```bash
npm run build
```

Frontend output directory:

```text
dist
```

Backend start command:

```bash
gunicorn wsgi:app
```

Before production backend deployment, set real environment variables, run database migrations, and configure `FRONTEND_URL` to the production frontend URL.

## Manual Content Still Needed

The repository did not contain enough verified detail for these requested flagship projects:

- Delivaroo / Send It
- CAMPUSPULSE
- DevCrypt

Add real project details for:

- GitHub repositories
- live deployments
- problem solved
- role
- architecture
- features
- authentication and database design
- deployment notes
- screenshots
- technical challenges

Also add verified details for employment, education, certifications, and any metrics. None were invented in this rebuild.

## Design Inspiration

The requested YouTube 3D developer portfolio was used only as directional inspiration for polish, interaction, and 3D presence. This implementation does not copy its branding, text, project data, or assets.
