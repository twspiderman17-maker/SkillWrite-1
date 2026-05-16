# SkillWrite — Framer UI/UX Prompt

Copy everything below the line into Framer AI (or your design brief).

---

## Project

Design a **marketing + product UI system** for **SkillWrite** — a B2C/B2B learning platform that teaches **safe, job-specific AI workflows** (not generic “prompt engineering”). Tagline direction: *“Practical AI training for real jobs.”*

**Audience:** Working professionals in regulated or detail-heavy roles — insurance claims/FNOL, construction estimating, clinical operations (admin only, non-diagnostic), and accounting practices. Secondary audience: team leads buying training for staff.

**Tone:** Trustworthy, calm, professional — like Stripe or Linear meets Coursera. No hype, no “10x your career” bro-marketing. Emphasize **safety, review habits, and real workplace tasks**.

---

## Brand & visual language

**Personality:** Clear, competent, approachable. Feels like workplace training, not a crypto startup or kids’ edtech.

**Color palette (match existing app):**
- Background: `#FAFAFA` with subtle dot-grid texture (24px radial dots, slate-300 at low opacity)
- Primary text: slate-900 (`#0F172A`)
- Body text: slate-600
- Primary accent: blue-600 (`#2563EB`) → hover blue-700
- Soft accent surfaces: blue-50, blue-200 borders
- Success/unlocked: emerald-50 / emerald-200 / emerald-700
- Cards: white, border slate-200, rounded-2xl to rounded-3xl, light shadow-sm, hover border blue-200

**Typography:**
- **Inter** (or Framer equivalent: clean geometric sans)
- Headlines: extrabold, tight tracking (`tracking-tight`)
- Labels: uppercase, wide tracking (`tracking-widest`), semibold, blue-600 or slate-400
- Body: relaxed line-height (leading-7/8 on hero)

**Shape language:** Generous radius (xl–3xl), pill badges, circular step numbers, small blue checkmarks in circles for feature lists.

**Logo mark:** Square rounded-lg tile, blue-600 background, white bold “S”. Wordmark: **SkillWrite** in bold slate-900.

**Do not use:** Gradients on everything, neon purple AI clichés, robot mascots, stock “person at laptop smiling” hero clichés unless subtle and professional.

---

## Pages to design (desktop 1440px + mobile 390px)

### 1. Marketing homepage
Sections in order:
1. **Sticky nav** — logo, Home / Courses / Certification, Login CTA (primary blue button)
2. **Hero** — eyebrow pill: “Practical AI training for real jobs”; H1: “Master AI workflows for your specific career.”; subcopy about studying with any AI assistant (ChatGPT, Gemini, Copilot, Claude) beside job-shaped scenarios; CTAs: “Explore Courses” (primary), “How Certificates Work” (secondary outline)
3. **Two paths** — side-by-side cards: **Graduate** (4 weeks) vs **Masters** (12 weeks) with feature bullets; large faded “4” / “12” watermark numbers in card corners
4. **How learning works** — 4-step horizontal cards: Learn basics → Apply to your job → Revise (quizzes/flashcards) → Get assessed
5. **Courses by job area** — 2×2 grid of track cards (see tracks below) with Syllabus + Revision Lab links
6. **Footer** — disclaimer: demo learning site; does not replace professional advice; © SkillWrite

### 2. Courses catalog
Grid of 4 industry tracks with icon or abstract industry visual per card (insurance doc, blueprint, clinic clipboard, ledger — abstract/minimal, not cheesy clipart).

### 3. Course detail (syllabus + paywall)
- Track hero: industry label, title, tagline
- Tabs or sections: **Overview** | **Graduate** | **Masters** | **Certificate**
- Week syllabus list (Week 1–4 or 1–12) with bullet outcomes
- Lesson list rows: week badge, “X min guided”, title, description, Locked/Unlocked pill
- **Pricing cards** (2 tiers + certificate add-on):
  - Graduate: **$15** / 1 month
  - Masters: **$45** / 3 months  
  - Certificate add-on: **$5**
  - Include checkmark feature lists; primary CTA “Unlock for $X”
- Callout: “Open your AI assistant beside the lesson” (Gemini, ChatGPT, etc.)

### 4. Lesson player (learning UI)
Split or stacked layout:
- Left/main: lesson title, week badge, guided time, content blocks (headings + body), **prompt template** in monospace/code-style card, workplace checklist, practice task
- Video area: YouTube embed placeholder with segment label (e.g. “12:00–18:00 — theme”)
- **AI Practice callout** — encouraging learner to try prompt in their own tool
- Bottom: **Previous lesson** / **Next lesson** navigation
- Sidebar optional: progress, revision link

### 5. Revision lab
Tabbed interface: **Quiz** | **Flashcards** | **Match game** — playful but still professional; card flip animation for flashcards.

### 6. Checkout
Simple 2-column: order summary (track, tier, price) + demo checkout form; trust badges (secure, money-back placeholder).

### 7. Certification
Explain practical final test, rubric table (Clear prompt / Safe answer / Human review / Job fit), list of 4 track certificates.

### 8. Certificate awarded (celebration screen)
Minimal certificate card: “SkillWrite certifies that [Name] completed…” — printable, dignified, not gimmicky.

### 9. Login / account
Clean auth card: email, name, sign in — “SkillWrite account” label in blue uppercase tracking.

### 10. B2B teaser section (optional homepage band)
“Train your team” — seats, completion tracking, policy-aligned AI use — CTA “Contact for teams” (for future enterprise positioning).

---

## Content — four course tracks

| Industry | Title | Tagline |
|----------|-------|---------|
| Insurance | AI for Insurance Claims & FNOL | Organise claim notes, draft first responses, cleaner handovers |
| Construction | AI for Construction Estimating | RFIs, takeoffs admin, site communication, estimate support docs |
| Clinical | AI for Clinical Operations (Admin) | Scheduling, patient comms templates, ops docs — **not medical diagnosis** |
| Accounting | AI for Accounting Practices | Client emails, reconciliation prep, engagement letters — review-first |

---

## UX principles

1. **Trust first** — visible disclaimers, “human review required”, redaction reminders
2. **Scannable hierarchy** — week badges, time estimates, locked state always obvious
3. **Low cognitive load** — one primary CTA per section; plenty of whitespace
4. **Progress feels real** — completion states, unlocked green, locked gray
5. **Mobile** — stack cards, sticky bottom CTA on course detail, collapsible lesson nav
6. **Accessibility** — 4.5:1 contrast on body text, focus rings on interactive elements, 44px touch targets

---

## Component library to include

- Buttons: primary (blue-600), secondary (white border), ghost text link
- Pills/badges: eyebrow, week, locked/unlocked, industry
- Cards: course, pricing, lesson row, week syllabus
- Tables: certification rubric
- Code/prompt block component
- Checklist with circular check icons
- Nav header (blur backdrop), footer
- Empty states: “Sign in to save progress”, “Unlock Graduate to access lessons”

---

## Deliverables

1. **Design system page** — colors, type scale, buttons, cards, badges
2. **Homepage** — full marketing page (desktop + mobile)
3. **Course detail + pricing** — one track example (Insurance) with locked lesson list
4. **Lesson page** — content + video + prev/next
5. **Revision lab** — one tab shown (flashcards)
6. **Optional:** dark mode variant (secondary priority)

**Framer specifics:** Use auto-layout, components with variants (locked/unlocked, primary/secondary), responsive breakpoints, subtle hover transitions (150–200ms), prototype nav between Home → Course → Lesson → Checkout.

**Reference mood:** Linear.app clarity + Coursera structure + healthcare/finance sobriety. Avoid Duolingo gamification excess.

---

## Hero copy (use verbatim or tighten slightly)

**Eyebrow:** Practical AI training for real jobs  
**H1:** Master AI workflows for your specific career.  
**Subhead:** SkillWrite teaches you how to integrate AI safely and efficiently into your daily tasks. Study with a free AI assistant open beside the course and practise on real job-shaped scenarios — not generic prompt engineering alone.  
**CTA 1:** Explore Courses  
**CTA 2:** How Certificates Work

---

## What success looks like

A visitor in insurance or accounting should think within 5 seconds: *“This is for my job, it takes safety seriously, I know what I’m buying ($15 vs $45), and I trust the certificate means I can prove I review AI output.”*
