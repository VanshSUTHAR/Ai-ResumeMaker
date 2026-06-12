# AI-ResumeMaker 🚀

This repository is a monorepo containing a React frontend and an Express backend for building, editing, and exporting stunning AI-assisted resumes.

## 🌟 Features We Have Built

### 🎨 Stunning Visuals & UI
- **Live Preview:** See changes to your resume in real-time as you type.
- **Multiple Professional Templates:** Choose from a wide variety of sleek templates including Modern, Professional, Minimal, Infographic, and the highly-structured Grid templates.
- **Theme Customization:**
  - Dynamic **Light & Dark Mode** with a sleek segmented control switch.
  - Accent color selection to instantly recolor your entire resume.
  - "Ghost" and "Secondary" button styles for a polished, balanced UI.

### ✍️ Advanced Resume Editor
- **Rich Data Fields:** Support for Personal Info, Experience, Education, Certifications, and AI-assisted Summaries.
- **Dynamic Skills & Projects:** 
  - Smart comma-separated inputs that allow for seamless typing (trailing commas perfectly supported!).
  - Project entries support custom **GitHub Links** and live **Website Links**, which are automatically hyperlinked in the generated resume.

### 📄 Export & PDF Generation
- **High-Fidelity PDF Export:** We completely fixed the scaling issues that plague most web-based resume builders. Our PDF export intelligently strips visual scaling, ensuring your resume exports at maximum resolution and perfectly fills an A4 page without awkward white space or cut-off text.
- **Direct Print:** Print styles are perfectly optimized so you can hit `Ctrl+P` and print exactly what matters—just the resume, no UI.

---

## 🛠️ Prerequisites
- Node.js (>=16) and npm installed

## 🚀 Quickstart (Development)

1. Install dependencies at the repo root:
```powershell
npm install
```

2. Start both servers concurrently:
```powershell
npm run dev
```

This runs the Backend dev server and the Frontend dev server in parallel:
- **Backend:** `npm run dev --prefix Backend` (nodemon watches, default PORT 5000)
- **Frontend:** `npm start --prefix Frontend` (Create React App, default PORT 3000)

You can also run them individually:
```powershell
# Start backend
cd Backend
npm install
npm run dev    

# Start frontend
cd ../Frontend
npm install
npm start      
```

*Note: If you encounter `EADDRINUSE` errors, either stop the process using that port or change the port in the relevant project by setting the `PORT` environment variable.*

## 📁 Project Structure
- `Backend/` — Express server, controllers and models.
  - `Backend/index.js` — server entry (change PORT here).
  - `Backend/controllers/*` — API handlers for AI, auth, resumes.
- `Frontend/` — React app (Create React App)
  - `Frontend/public/index.html` — app HTML (title, favicon)
  - `Frontend/src/App.js` — largest single-file UI: routing, dashboard, resume builder, ThemeSwitcher, templates.
    - **THEMES & THEME_META** — theme definitions at top of file.
    - **Template components** (`ModernTemplate`, `VanshGridTemplate`, etc.) are implemented inside `App.js` as functions.

## 💾 How Saving Works
- **Current behavior:** Saves are stored in client-side `storage` helper inside `Frontend/src/App.js` (localStorage wrapper). The `Save & Exit` button calls the `onSave` handler.
- **To save to the backend instead:** Update the `onSave` handler passed to `ResumeBuilder` in `Frontend/src/App.js` to POST to your backend resume API (e.g., `fetch('/api/resume', { method: 'POST', body: JSON.stringify(resume) })`).

## 🤖 Authentication & AI
- `AuthScreen` in `App.js` is a demo/local auth flow that stores a demo token in local storage. For production, replace it with real auth.
- The helper `askClaude(prompt)` is present and uses `API_URL` at the top of `App.js` — update the API integration or replace with your preferred AI provider. Keep any API keys out of source code; use environment variables on the backend.

---
*Built with ❤️ focusing on beautiful aesthetics and seamless user experience.*
