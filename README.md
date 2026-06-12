# AI Resume Maker 🚀

A comprehensive, full-stack AI-assisted resume builder that allows users to create, optimize, preview, and export high-fidelity, professional resumes. Built with a React frontend and an Express/Node.js backend, it offers real-time editing, ATS score compatibility checking, and seamless responsive design.

---

## 🌟 Key Features & What You Can Do

### ✍️ Advanced Interactive Resume Editor
- **Multi-Section Coverage:** Create structured resumes containing Personal Info, Work Experience, Academic Education, Technical Skills, Software Projects, Certifications, Achievements, and Languages.
- **Auto-Saving debouncer:** Edits automatically sync and save to the database after 1.5 seconds of inactivity, preventing any progress loss.
- **Toggle Light & Dark Modes:** Instant, responsive dark/light theme switching with a sleek segmented control switch.

### 🎨 12 Premium Professional Templates
- **Modern Slate (`modern`):** Dark professional header with an elegant two-column layout.
- **Corporate (`professional`):** Structured and traditional corporate layout.
- **Clean Minimal (`minimal`):** Lightweight, clean, single-column design.
- **Violet Gradient (`creative`):** A creative, color-blocked layout featuring vibrant gradient accents.
- **Navy Sidebar (`vansh`):** Two-column split-page layout with a dark navy sidebar and headers.
- **Classic Serif (`classic`):** Academic-style Georgia serif layout with centered headings and traditional dividers.
- **Terminal Dark (`tech`):** Code-themed Courier console layout for developers with custom syntax highlighting tags.
- **Navy Single (`vansh_single`):** Navy header with a clean, single-column layout.
- **Minimal Blue (`minimal_blue`):** Centered layout with light blue accents.
- **Structured Grid (`vansh_grid`):** Structured grid layout with thin borders and serif titles.
- **Executive Emerald (`executive`):** Forest/emerald green theme with a sophisticated, professional layout and divider lines.
- **Clean Double-Column (`double_column`):** Space-saving split two-column format with a dark navy sidebar and clean white main body.

### 🤖 AI-Powered Assistant Engine
- **AI Summary Auto-Write:** Automatically generates a professional summary paragraph tailored to your target job title and skills.
- **AI Bullet Point Optimizer:** Re-writes experience bullet points using strong active verbs and impact-oriented sentences.
- **AI ATS Score Scanner:** Compares your resume details against a pasted job description, outputting a compatibility score (%), listing missing keywords, and suggesting layout/content improvements.

### 📄 Export & PDF Generation
- **Dynamic Scale Adjustments:** Border margins shrink and the scale coefficient recalculates dynamically to ensure the live PDF template fits mobile screens.
- **High-Fidelity PDF Export:** Save your resume as a clean, high-resolution A4 PDF using client-side `html2pdf.js`.
- **Direct Print Style:** Optimized print CSS stylesheets automatically strip out editor sidebars and controls when printing (`Ctrl+P`).

### 💾 Robust Caching & Fallbacks
- **MongoDB Database Persistence:** Full registration, authentication, and resume saving.
- **Local File Caching Fallback:** Automatically switches to `.cache/mock_users.json` and `.cache/mock_resumes.json` if MongoDB is offline, preserving user credentials and resume files across backend restarts.

---

## 📁 Repository Structure

```
├── Backend/                    # Node.js + Express API
│   ├── controllers/            # API Controllers (Auth, Resume, AI)
│   ├── middleware/             # Route Guards (Auth JWT Verification)
│   ├── models/                 # Database Schema (User, Resume)
│   ├── routes/                 # Express Router Endpoints
│   ├── index.js                # Server entry point
│   └── .env                    # Backend credentials and configuration
│
├── Frontend/                   # React Client
│   ├── public/                 # HTML templates and static assets
│   └── src/
│       ├── components/         # Reusable UI widgets (Btn, Card, Toast)
│       ├── context/            # Auth Session Context Provider
│       ├── hooks/              # Custom React hooks
│       ├── pages/              # View screens (Login, Dashboard, Builder)
│       ├── services/           # Axios service managers
│       ├── templates/          # PDF print layouts (Modern, Creative, etc.)
│       └── App.jsx             # Main Router and Theme Provider
│
└── .cache/                     # Git-ignored local database fallback folder
```

---

## 🛠️ Setup & Local Development

### 1. Prerequisites
Ensure you have **Node.js** (v16+) and **npm** installed on your system.

### 2. Quickstart Run
1. Install node modules in the workspace root:
   ```bash
   npm install
   ```
2. Start both Frontend and Backend development servers concurrently:
   ```bash
   npm run dev
   ```

*The frontend will boot on `http://localhost:3000` and the backend server on `http://localhost:5000`.*

---

## 🔒 Configuration & Environment Variables

Create a `.env` file inside the `Backend/` directory with the following keys:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_API_KEY=your_gemini_google_api_key
```

*If the `MONGODB_URI` database connection fails or times out, the backend gracefully switches to local file-based database storage automatically.*
