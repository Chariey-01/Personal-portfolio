# Charity Jepkoech Portfolio

A full-stack software engineering portfolio for Charity Jepkoech, also known as Chariey. The rebuild moves the site from static HTML/CSS/JavaScript to a maintainable React, TypeScript, Tailwind CSS, Three.js, and Flask architecture.

The design is inspired by modern 3D developer portfolios, but the implementation uses original geometry, verified personal content from this repository, and clearly identifies where real details are still needed.

## Architecture

```text
.
├── frontend/
│   └── src/
│       ├── components/
│       ├── data/
│       ├── sections/
│       ├── services/
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
- Lucide React icons
- Vitest, jsdom, and React Testing Library for frontend behavior tests
- TypeScript checks for frontend type validation in CI

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
- Experience and education timeline limited to verified facts
- Contact form with validation, loading, success, and error states
- Footer with professional positioning

### Changing the Profile Image

The profile image is configured in one place: `frontend/src/data/profile.ts`.

To replace the photo, add the new image to `public/images/profile/`, then update:

```ts
profileImage: "/images/profile/your-new-file-name.png",
```

No React component changes are needed. Keep the image web-friendly, avoid stretching it, and leave `profileImageAlt` as a short description of the portrait.

## Local Setup

Install frontend dependencies from the lockfile:

```bash
npm ci
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
| `ADMIN_USERNAME` | Single portfolio-owner login name for `/admin` |
| `ADMIN_PASSWORD_HASH` | Werkzeug password hash for the admin password; generate locally and never commit the plain password |
| `ADMIN_TOKEN_MAX_AGE_SECONDS` | Signed admin-token lifetime |
| `UPLOAD_FOLDER` | Local upload directory for development |
| `MAX_RESUME_BYTES` | Maximum PDF document upload size in bytes |
| `MAX_IMAGE_BYTES` | Maximum image upload size in bytes |
| `STORAGE_BACKEND` | `local` for development; use persistent object storage in production |
| `SMTP_HOST` | Optional SMTP host for owner contact notifications |
| `SMTP_PORT` | Optional SMTP port; defaults to `587` |
| `SMTP_USERNAME` | Optional SMTP username |
| `SMTP_PASSWORD` | Optional SMTP password; keep secret |
| `SMTP_USE_TLS` | Set to `false` only if your SMTP provider does not use STARTTLS |
| `CONTACT_NOTIFICATION_TO` | Owner email address that receives contact notifications |
| `CONTACT_NOTIFICATION_FROM` | Sender address for contact notifications; defaults to `CONTACT_NOTIFICATION_TO` |
| `VITE_API_BASE_URL` | Optional frontend API origin for production deployments |

Do not commit `.env` or real secret values.

To generate an admin password hash:

```bash
cd backend
../.venv/bin/python -c "from werkzeug.security import generate_password_hash; print(generate_password_hash('replace-this-password'))"
```

## Owner Maintenance

### Starting the admin panel locally

Run the Flask backend and Vite frontend, then visit `/admin` on the frontend URL. Log in with `ADMIN_USERNAME` and the password that matches `ADMIN_PASSWORD_HASH`.

### Adding a project

Open `/admin`, use the Projects form, add the title, short description, role/focus, stack, what you learned, architecture notes, repository URL, status, image URL, and display order, then save. The public Projects section reads from `GET /api/projects`, so the new project appears without editing React source.

### Updating a project

In `/admin`, choose Edit beside the project, update the fields, and save. Use statuses honestly: `In Progress`, `Completed`, `Live`, or `Archived`.

### Adding a live URL

Edit the project, paste the deployed URL into Live URL, change the status to `Live` when appropriate, and save. If Live URL is empty, the public card will not render a dead live-demo button.

### Adding a project image

After saving a project, edit it again and use Project image to upload a screenshot of the live application. You can also paste an Image URL. Public project cards show that image above the stack tags; if no image exists, the card shows a pending image state.

### Uploading professional documents

In `/admin`, use the Documents area to upload Resume, CV, Cover Letter, or Other PDFs. The backend validates the PDF signature and file size, stores metadata in the reusable `document` table, marks the selected upload as current, and lets you control whether each file is public. Resume and CV can appear publicly in the Documents dropdown when current/public. Cover letters default to private so application-specific files do not clutter the public portfolio.

### Changing my profile photo

Use the Profile / About image upload in `/admin`. The public portrait uses a square container with circular clipping, so the rendered photo stays truly circular. The original bundled source image remains `public/images/profile/charity-jepkoech.png`.

### Adding a testimonial

Create the testimonial in `/admin`. It will stay private until Approved for public site is checked. Only approved, non-archived testimonials appear publicly.

### Reviewing contact messages

Contact form submissions are stored in the database with name, email, inquiry type, message, and timestamp. Open `/admin`, review Contact Messages, reply from your mail client when appropriate, and archive messages you no longer need in the dashboard.

### Contact notifications

If `SMTP_HOST`, `CONTACT_NOTIFICATION_TO`, and a sender address are configured, the backend sends you an email after safely storing each contact message. If SMTP is missing or delivery fails, the message remains stored in the database and the visitor still receives a clear success response.

### Future Google contact prefill

Google contact prefill is not implemented yet. To add it later, connect a Google OAuth/OpenID Connect flow to the contact form identity hook in `frontend/src/sections/Contact.tsx`, request only basic profile/email scopes, and send the resulting name/email into the existing manual fields. Required future environment/config values would include a Google OAuth client ID for the frontend, a backend client secret if the authorization-code flow is used, and approved redirect origins in Google Cloud. Do not request Gmail mailbox or send-mail scopes for this portfolio contact form.

### Updating skills in code

Skills intentionally live in one typed file: `frontend/src/data/skills.ts`. Add or edit technology names, categories, and descriptions there.

### Changing the site theme

Visitors can choose System, Light, or Dark in the top navigation. System follows the visitor's device color-scheme preference, while Light and Dark force the selected mode and remember that choice locally in the browser.

### Required production environment variables

Set `SECRET_KEY`, `DATABASE_URL`, `FRONTEND_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `ADMIN_TOKEN_MAX_AGE_SECONDS`, `MAX_RESUME_BYTES`, `MAX_IMAGE_BYTES`, `STORAGE_BACKEND`, and `VITE_API_BASE_URL`. Configure SMTP variables if you want contact notifications. Keep `CONTACT_RATE_LIMIT_SECONDS` set to a sensible value for the contact form.

### Production storage requirement

Local filesystem uploads are fine for development. Do not rely on Render or similar ephemeral filesystems for production resume/profile/project uploads. Use persistent object storage such as Cloudinary or another provider, then extend `backend/app/services/storage.py` behind the existing storage boundary without changing the route contracts.

## Testing

Frontend:

```bash
npm run lint
npm test
npm run build
```

`npm run lint` runs TypeScript validation. `npm test` runs Vitest with React Testing Library and jsdom.

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
