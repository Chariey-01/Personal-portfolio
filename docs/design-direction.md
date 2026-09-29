# Charity Jepkoech Portfolio: Visual Direction

## Intent

The public portfolio is a project-first engineering profile: modern, technical, youthful, confident, and polished. It retains the asymmetric hierarchy and case-study reading flow, but uses a dark modern interface rather than an editorial-print treatment.

## Theme Tokens

- **Background:** `#09090f`
- **Elevated surface:** `#11111a`
- **Raised surface:** `#171722`
- **Primary text:** `#f7f5ff`
- **Muted text:** `#a8a3b5`
- **Borders:** `rgba(255, 255, 255, .1)`
- **Violet:** `#7c3aed`
- **Purple:** `#a855f7`
- **Pink:** `#ec4899`
- **Soft pink:** `#f472b6`
- **Brand gradient:** `linear-gradient(120deg, #7c3aed, #a855f7, #ec4899)`

The brand gradient is an accent for the primary CTA, the display-name treatment, and selected project artwork. It is not a page background, a default card treatment, or a substitute for hierarchy.

## Typography And Layout

- **Display and body:** a contemporary Inter/system sans stack; no traditional serif display treatment.
- **Utility labels:** compact monospace for dates, stacks, and status metadata.
- **Hero:** a strong two-line `Charity Jepkoech` composition with one controlled violet/pink accent; role and body copy stay near-white for contrast.
- **Sections:** full-width dark bands with rules, spacing, and readable type rather than floating-card-heavy layouts.
- **Projects:** one dominant project plus an uneven secondary gallery. Each project owns its own art direction while the site keeps its violet/pink identity.
- **Case study:** a readable prose column and evidence-first image gallery; action links remain quiet except for the primary path.

## Component Language

- **Navigation:** minimal, dark, and calm with subtle violet/pink hover and focus accents.
- **Surfaces:** dark layers separated by border, spacing, and modest elevation, never broad glassmorphism.
- **Actions:** only the primary CTA uses the brand gradient. Supporting actions are underlined text links or quiet icon controls.
- **Project art:** project-specific gradients remain allowed: CharityOS may use violet/magenta, CampusPulse indigo/violet, DevCrypt deep purple with controlled pink, and delivery work can retain orange.
- **Motion:** a small hover lift, image scale, and link transition only. `prefers-reduced-motion` disables nonessential transitions and smooth scrolling.

## Accessibility

- Body content uses near-white or tested muted text, not purple/pink, for normal reading.
- Every interactive element has an obvious keyboard focus state.
- Images supplied through the CMS require useful alternative text.
- Mobile navigation has predictable touch targets; public layouts must not introduce horizontal scrolling.
