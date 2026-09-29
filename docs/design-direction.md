# Charity Jepkoech Portfolio: Visual Direction

## Intent

The public portfolio becomes an editorial engineering profile, not a dark dashboard or generic product landing page. It should feel composed, grounded, and human: high-contrast reading surfaces, deliberate type, project artwork with controlled color, and enough playfulness to be memorable without becoming performative.

## Typography

- **Display:** an editorial serif stack (`Iowan Old Style`, `Baskerville`, `Times New Roman`) for large section and project titles. This makes narrative and project work feel intentional without relying on a remote font.
- **Body:** Inter/system sans for paragraphs, controls, and navigation.
- **Utility labels:** compact monospace for status, dates, stack labels, and engineering metadata.
- **Scale:** hero name is large but bounded; section titles are distinctly smaller; card headings never mimic hero scale. Letter spacing remains normal except for small utility labels.
- **Hierarchy:** labels orient, headlines explain, body text provides evidence, and links move visitors forward.

## Layout

- **Container:** `min(1180px, calc(100vw - 2rem))` for standard sections.
- **Hero:** asymmetric two-column composition at desktop: identity and actions on the left; portrait/status note and a small technical record on the right. It collapses cleanly to one reading column on mobile.
- **Sections:** full-width paper bands, separated by rules and spacing rather than floating section cards.
- **Project gallery:** one dominant featured project with a wide art panel, then a deliberately uneven secondary grid. Projects are not six equal boxes.
- **Case study:** narrow readable prose column paired with a sticky metadata rail on large screens.

## Color

- **Background:** warm off-white paper (`#f6f0e8`) with pale sand bands (`#eee5d7`).
- **Foreground:** ink (`#172033`) and softened charcoal (`#495166`).
- **Accent:** deep coral (`#c34d3f`) for focus, actions, and restrained emphasis.
- **Project gradients:** only artwork frames, project hover states, and occasional section rules use color. Proposed initial directions are warm ember for CharityOS, lake/data blue for CampusPulse, indigo/charcoal for DevCrypt, and citrus/rust for delivery work.
- **No default glass, neon, or gradient text.**

## Component Language

- **Navigation:** thin bordered header, plain text links, a small resume link, and no visible owner/admin entry point.
- **Buttons:** compact editorial actions with one filled primary and quiet text or underlined secondary actions. Icon-only controls use accessible labels.
- **Links:** underlined on hover/focus; external links include an arrow icon when useful.
- **Project cards:** asymmetrical image-first stories with metadata anchored to edges. Cards use small radii and a tangible border, never a generic frosted panel.
- **Tags:** simple inline labels separated by dots or rules, not pills scattered throughout the page.
- **Section headers:** small mono label, large serif title, optional short body copy, and a thin rule.

## Motion

- Hover lifts are subtle and only on actionable project/media surfaces.
- Page/section entrance motion is optional and limited to opacity/translation.
- The hero portrait has no decorative floating animation.
- `prefers-reduced-motion` removes transitions and smooth scrolling.

## Project Gallery

- The featured project is a horizontal editorial composition: project identity and evidence beside a sizable screenshot or purpose-built gradient artwork.
- Secondary projects use varied grid spans at desktop, one-column chronological reading order on mobile.
- A project with no supplied screenshot receives an intentional art direction panel, clearly labelled as a project overview rather than pretending to be product media.
- Project cards link to dedicated `/projects/:slug` case studies and surface source/live links only when configured.

## Mobile

- The navigation becomes a labeled menu button with a predictable panel; its tap targets are at least 44px.
- Hero actions wrap in logical importance order and never become four equal large buttons.
- Project art remains above content, with metadata and links below for a comfortable reading order.
- Case-study metadata moves above prose and screenshot galleries preserve aspect ratio.
- Admin forms remain single-column at narrow widths with persistent save feedback.

## Accessibility Checks

- Every navigation and action control has keyboard focus, readable contrast, and a semantic role.
- Project images require descriptive alt text in the CMS.
- Decorative gradient art is hidden from assistive technology.
- Headings remain sequential and landmarks identify navigation, main content, and footer.
