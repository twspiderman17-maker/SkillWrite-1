# SkillWrite (demo site)

React + Vite + TypeScript + Tailwind. A practical academy site for teaching people how to integrate AI into their jobs. It includes four vertical tracks, **Graduate (4 weeks)** and **Masters (12 weeks)** syllabi, plus a **revision lab** per track:

- Mini quiz (multiple choice + explanations)
- Flashcards (flip, shuffle, mark confident)
- Study match game (term ↔ definition)
- **Integrations**: export/import progress JSON, download a 25-minute study `.ics` calendar block

## Run locally

```bash
cd ai-workflow-academy
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Build

```bash
npm run build
npm run preview
```

## Notes

- Progress is stored in `localStorage` under keys prefixed with `awa_v1_`.
- This is a **front-end demo**: add your own auth, lesson videos, user accounts, and certificate issuing when you go live.
- Vertical disclaimers appear on course and revision pages. Courses teach safe AI use and do not replace professional advice.
