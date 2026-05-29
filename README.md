# Ai-ResumeMaker

This repository is a small monorepo containing a React frontend and an Express backend for building, editing, and exporting AI-assisted resumes.

This README explains how to set up, run, and work on the project, plus where to change common behaviors (theme, templates, save behavior).

Prerequisites
 - Node.js (>=16) and npm installed

Quickstart (development)

1. Install dependencies at the repo root (installs nothing at root but ensures consistent tooling):

```powershell
npm install
```

2. Install subproject dependencies and start both servers concurrently (recommended):

```powershell
npm run dev
```

This runs the Backend dev server and the Frontend dev server in parallel using `concurrently`:
- Backend: `npm run dev --prefix Backend` (nodemon / watches)
- Frontend: `npm start --prefix Frontend` (Create React App)

You can also run them individually:

```powershell
cd Backend
npm install
npm run dev    # start backend (default PORT 5000)

cd ../Frontend
npm install
npm start      # start CRA frontend (default PORT 3000)
```

If you encounter `EADDRINUSE` errors, either stop the process using that port or change the port in the relevant project:
- Backend: set `PORT` environment variable or edit `Backend/index.js`.
- Frontend: set `PORT` environment variable before `npm start`.

Project structure (important files)
- `Backend/` — Express server, controllers and models.
	- `Backend/index.js` — server entry (change PORT here).
	- `Backend/controllers/*` — API handlers for AI, auth, resumes.
- `Frontend/` — React app (Create React App)
	- `Frontend/public/index.html` — app HTML (title, favicon)
	- `Frontend/src/App.js` — largest single-file UI: routing, dashboard, resume builder, ThemeSwitcher, templates
		- THEMES & THEME_META — theme definitions at top of file
		- `ThemeSwitcher` — component that renders the theme pill and dropdown; placement logic lives here
		- `ResumeBuilder` — left sidebar contains the `ThemeSwitcher`, autosave behavior, and `Save & Exit` / `Exit` buttons
		- Template components (ModernTemplate, MinimalTemplate, etc.) are implemented inside `App.js` as functions

How saving works
- Current behavior: saves are stored in client-side `storage` helper inside `Frontend/src/App.js` (localStorage wrapper). The `Save & Exit` button calls the `onSave` handler passed from `App` which currently navigates back to the dashboard after persisting to `storage`.
- To save to the backend instead: update the `onSave` handler passed to `ResumeBuilder` in `Frontend/src/App.js` to POST to your backend resume API (e.g., `fetch('/api/resume', { method: 'POST', body: JSON.stringify(resume) })`) and handle auth tokens.

Theme and UI notes
- Themes are defined in `THEMES` (colors & CSS variables). To add or edit a theme, modify `THEMES` and `THEME_META` in `Frontend/src/App.js`.
- `ThemeSwitcher` now computes whether to open the dropdown up or down depending on available viewport space — it opens below when used in the navbar and above when used in the sidebar/footer.
- To change the dropdown width or add a caret/animation, edit the inline styles in `ThemeSwitcher` or extract into a small CSS class in `App.css`.

Templates
- The app contains 10 template renderers as functions inside `Frontend/src/App.js` (e.g., `ModernTemplate`, `MinimalTemplate`). To add a new template:
	1. Implement the rendering function that accepts `data`.
	2. Add an entry to `TEMPLATE_LIST` and `TEMPLATE_COMPONENTS`.

Authentication & AI
- `AuthScreen` in `App.js` is a demo/local auth flow that stores a demo token in local storage. For production, replace it with real auth.
- The helper `askClaude(prompt)` is present and uses `API_URL` at the top of `App.js` — update the API integration or replace with your preferred AI provider. Keep any API keys out of source; use environment variables on the backend.

Development tips & troubleshooting
- Lint / Hook errors: If ESLint reports a React Hooks usage error, ensure hooks (useState/useEffect) are called at top-level in components, not inside callbacks.
- Port conflicts: change `PORT` environment variable or edit server startup.
- If you change `App.js`, the CRA dev server will hot-reload; a full restart may be needed for backend changes.

Testing
- Frontend tests live in `Frontend/src` (CRA `react-scripts test`). Run:

```powershell
cd Frontend
npm test
```

Git and contribution
- `.gitignore` at repo root excludes node_modules and build artifacts.
- When contributing: create a branch, make focused commits, and open a PR. Keep changes scoped (UI vs backend).

Next improvements you might add
- Move large `App.js` into smaller components (ThemeSwitcher, ResumeBuilder, templates) for maintainability.
- Add backend persistence for resumes and user auth.
- Add tests for key UI flows (save/export, theme switching, template rendering).

Contact / notes
- If you want, I can:
	- Wire the `Save` flow to the Backend API.
	- Extract `ThemeSwitcher` and templates into separate files.
	- Add a caret and flip animation to the theme dropdown to match the mockup.

---
Generated/updated by the development assistant.