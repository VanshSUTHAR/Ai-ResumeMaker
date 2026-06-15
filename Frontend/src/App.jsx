import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BuilderPage from './pages/BuilderPage';
import Toast from './components/Toast';
import storage from './utils/storage';

const TOKENS = {
  light: {
    "--bg": "#F7F6F3",
    "--bg-2": "#EFEDE8",
    "--surface": "#FFFFFF",
    "--surface-2": "#F3F1EC",
    "--surface-3": "#E8E5DE",
    "--border": "#DDD9D0",
    "--border-focus": "#2C2C2C",
    "--text": "#1A1916",
    "--text-2": "#5C5A54",
    "--text-3": "#9C9A94",
    "--accent": "#2C2C2C",
    "--accent-2": "#C8A96E",
    "--accent-light": "rgba(200,169,110,0.10)",
    "--danger": "#C0392B",
    "--danger-light": "#FEF0EE",
    "--success": "#27AE60",
    "--success-light": "#EDFAF3",
    "--shadow-sm": "0 1px 3px rgba(26,25,22,0.06)",
    "--shadow-md": "0 4px 16px rgba(26,25,22,0.08)",
    "--shadow-lg": "0 12px 40px rgba(26,25,22,0.12)",
    "--radius": "10px",
    "--radius-lg": "16px",
    "--navbar": "rgba(247,246,243,0.92)",
  },
  dark: {
    "--bg": "#111110",
    "--bg-2": "#18171A",
    "--surface": "#1C1B1E",
    "--surface-2": "#242228",
    "--surface-3": "#2C2A32",
    "--border": "rgba(255,255,255,0.08)",
    "--border-focus": "#C8A96E",
    "--text": "#F4F2EE",
    "--text-2": "#9A9690",
    "--text-3": "#5A5852",
    "--accent": "#C8A96E",
    "--accent-2": "#C8A96E",
    "--accent-light": "rgba(200,169,110,0.12)",
    "--danger": "#E05C52",
    "--danger-light": "rgba(224,92,82,0.12)",
    "--success": "#3EC87A",
    "--success-light": "rgba(62,200,122,0.12)",
    "--shadow-sm": "0 1px 4px rgba(0,0,0,0.3)",
    "--shadow-md": "0 4px 20px rgba(0,0,0,0.4)",
    "--shadow-lg": "0 16px 48px rgba(0,0,0,0.5)",
    "--radius": "10px",
    "--radius-lg": "16px",
    "--navbar": "rgba(17,17,16,0.92)",
  }
};

const appCss = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,300;0,400;0,700;1,300;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&family=DM+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 16px; scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', -apple-system, sans-serif;
    background: var(--bg); color: var(--text);
    -webkit-font-smoothing: antialiased;
    line-height: 1.6;
    overflow-x: hidden;
  }
  .app-root {
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    transition: background-color 0.25s ease, color 0.25s ease;
  }

  /* Typography */
  .display { font-family: 'Fraunces', Georgia, serif; }
  .mono { font-family: 'DM Mono', monospace; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 99px; }

  /* Inputs */
  input, select, textarea {
    background: var(--surface);
    color: var(--text);
    border: 1.5px solid var(--border);
    border-radius: var(--radius);
    padding: 10px 14px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    line-height: 1.5;
    outline: none;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--border-focus);
    box-shadow: 0 0 0 3px var(--accent-light);
  }
  input::placeholder, textarea::placeholder { color: var(--text-3); }
  textarea { resize: vertical; min-height: 100px; }

  /* Animations */
  @keyframes fadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .fadeIn { animation: fadeIn 0.35s ease both; }
  .spin-anim { animation: spin 0.75s linear infinite; display: inline-block; }

  /* Drop zone */
  .drop-zone {
    border: 1.5px dashed var(--border);
    border-radius: var(--radius-lg);
    padding: 44px 28px;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative; overflow: hidden;
  }
  .drop-zone:hover, .drop-zone.active { border-color: var(--accent-2); background: var(--accent-light); }

  /* Nav pill */
  .nav-pill {
    display: flex; align-items: center; gap: 8px;
    padding: 9px 13px; border-radius: 8px; border: none;
    cursor: pointer; font-size: 13px; font-weight: 500;
    transition: all 0.15s ease; text-align: left;
    width: 100%; margin-bottom: 2px;
    background: transparent; color: var(--text-2);
    font-family: 'DM Sans', sans-serif;
  }
  .nav-pill:hover { background: var(--surface-2); color: var(--text); }
  .nav-pill.active { background: var(--surface-2); color: var(--text); font-weight: 600; }
  .nav-pill.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 2px; height: 18px; background: var(--accent-2); border-radius: 99px;
  }
  .nav-pill { position: relative; }

  /* Tag */
  .tag {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 99px;
    font-size: 11px; font-weight: 600;
    letter-spacing: 0.03em;
  }

  /* Builder layout */
  .builder-wrap { display: flex; height: 100vh; overflow: hidden; }
  .builder-side {
    width: 228px; flex-shrink: 0;
    border-right: 1px solid var(--border);
    background: var(--surface);
    display: flex; flex-direction: column;
    overflow: hidden;
  }
  .builder-body { flex: 1; overflow-y: auto; background: var(--bg); }

  /* Template card */
  .tpl-card {
    padding: 12px 10px; border-radius: 10px;
    border: 1.5px solid var(--border);
    background: var(--surface);
    cursor: pointer; text-align: center;
    transition: all 0.15s ease; outline: none;
  }
  .tpl-card:hover { border-color: var(--accent-2); }
  .tpl-card.selected { border-color: var(--accent-2); background: var(--accent-light); transform: translateY(-2px); box-shadow: var(--shadow-md); }

  /* Resume preview wrapper */
  #resume-preview, #resume-preview *, #resume-preview *::before, #resume-preview *::after { box-sizing: border-box !important; }
  #resume-preview { background: #fff; color: #1e293b; width: 210mm; min-height: 297mm; margin: 0 auto; overflow: hidden; }
  @media print {
    body * { visibility: hidden; }
    #resume-preview, #resume-preview * { visibility: visible; }
    #resume-preview { position: fixed; left: 0; top: 0; width: 100%; box-shadow: none; margin: 0; }
  }

  /* Grid helpers */
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .g3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  .g12 { display: grid; grid-template-columns: 1fr 2fr; gap: 14px; }
  @media (max-width: 580px) { .g2, .g3, .g12 { grid-template-columns: 1fr; } }

  /* Divider */
  .divider { height: 1px; background: var(--border); margin: 0; }

  /* Hover lift */
  .lift { transition: transform 0.2s ease, box-shadow 0.2s ease; }
  .lift:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg) !important; }

  /* Login Screen */
  .login-wrap { display: flex; min-height: 100vh; background: var(--bg); }
  .login-side {
    flex: 1;
    background: var(--text);
    color: var(--bg);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 52px 60px;
    position: relative;
    overflow: hidden;
  }
  .login-body {
    width: 460px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 52px 56px;
    background: var(--bg);
    position: relative;
  }

  /* Dashboard */
  .db-header {
    position: sticky; top: 0; z-index: 90;
    background: var(--navbar); backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex; justify-content: space-between; align-items: center;
    padding: 16px 40px;
  }
  .db-hero {
    max-width: 1100px; margin: 0 auto; padding: 60px 40px 32px;
  }
  .hero-row {
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-bottom: 40px;
  }
  .hero-title {
    font-size: 36px; font-weight: 300; margin-bottom: 8px; color: var(--text);
  }
  .hero-actions {
    display: flex; gap: 12px;
  }

  /* Builder section headers & content */
  .section-header-wrap {
    display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; gap: 12px;
  }
  .builder-content {
    max-width: 760px; margin: 0 auto; padding: 40px 40px;
  }

  /* Preview Section */
  .preview-frame-container {
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--surface-3);
    padding: 24px;
  }

  /* ATS Scanner Grid */
  .ats-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px;
  }

  /* Responsive Media Queries */
  @media (max-width: 900px) {
    .login-side { display: none; }
    .login-body { width: 100%; padding: 40px 24px; }
  }

  @media (max-width: 768px) {
    .db-header { padding: 16px 20px; }
    .db-hero { padding: 40px 20px 24px; }
    .hero-title { font-size: 28px; }
    .user-details { display: none; } /* Hide detailed text on small header widgets */
    
    .builder-wrap { flex-direction: column; }
    .builder-side { width: 100%; height: auto; border-right: none; border-bottom: 1px solid var(--border); }
    .builder-side > div:first-child { display: none !important; } /* Hide sidebar logo to save space */
    .builder-body { padding-bottom: 120px; }
    .builder-content { padding: 24px 16px; }
    
    .side-nav { display: flex; flex-direction: row; overflow-x: auto; padding: 8px 12px; gap: 6px; }
    .side-nav .nav-pill { width: auto; flex-shrink: 0; font-size: 12px; padding: 7px 11px; margin-bottom: 0; }
    .side-nav .nav-pill.active::before { display: none; } /* Disable the vertical active bar on horizontal pills */
    .side-footer { position: fixed; bottom: 0; left: 0; right: 0; z-index: 100; background: var(--surface); border-top: 1px solid var(--border); padding: 12px 16px; }
  }

  @media (max-width: 580px) {
    .section-header-wrap { flex-direction: column; align-items: stretch; }
    .section-header-wrap .btn-group { display: flex; justify-content: flex-end; gap: 8px; }
    .preview-frame-container { padding: 12px 8px; }
    .ats-grid { grid-template-columns: 1fr; }
  }

  /* SweetAlert2 Flat Professional Theme */
  .swal2-backdrop-show {
    background: rgba(0, 0, 0, 0.45) !important;
  }
  .swal2-popup {
    font-family: 'DM Sans', -apple-system, sans-serif !important;
    background: var(--surface) !important;
    color: var(--text) !important;
    border: 1.5px solid var(--border) !important;
    border-radius: var(--radius) !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
    padding: 24px !important;
    width: 360px !important;
  }
  .swal2-title {
    font-family: 'DM Sans', sans-serif !important;
    color: var(--text) !important;
    font-weight: 600 !important;
    font-size: 16px !important;
    margin-top: 8px !important;
    margin-bottom: 6px !important;
    text-align: center !important;
  }
  .swal2-html-container {
    color: var(--text-2) !important;
    font-size: 13.5px !important;
    line-height: 1.5 !important;
    margin: 0 0 20px 0 !important;
    text-align: center !important;
  }
  .swal2-actions {
    display: flex !important;
    justify-content: center !important;
    gap: 8px !important;
    width: 100% !important;
    margin-top: 0 !important;
  }
  .swal2-confirm.swal2-styled {
    background-color: var(--text);
    color: var(--bg);
    border: 1px solid transparent;
    border-radius: var(--radius) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-weight: 500 !important;
    padding: 8px 16px !important;
    font-size: 13px !important;
    box-shadow: none !important;
    transition: background-color 0.15s ease !important;
    margin: 0 !important;
  }
  .swal2-confirm.swal2-styled:hover {
    filter: brightness(0.9) !important;
    background-image: none !important;
  }
  .swal2-confirm.swal2-styled:focus {
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--border-focus) !important;
    outline: none !important;
  }
  .swal2-cancel.swal2-styled {
    background-color: transparent !important;
    color: var(--text) !important;
    border: 1px solid var(--border) !important;
    border-radius: var(--radius) !important;
    font-family: 'DM Sans', sans-serif !important;
    font-weight: 500 !important;
    padding: 8px 16px !important;
    font-size: 13px !important;
    box-shadow: none !important;
    transition: background-color 0.15s ease !important;
    margin: 0 !important;
  }
  .swal2-cancel.swal2-styled:hover {
    background-color: var(--surface-2) !important;
    background-image: none !important;
  }
  .swal2-cancel.swal2-styled:focus {
    box-shadow: 0 0 0 2px var(--surface), 0 0 0 4px var(--border-focus) !important;
    outline: none !important;
  }
  .swal2-icon {
    transform: scale(0.6) !important;
    transform-origin: center !important;
    margin: -10px auto 4px auto !important;
  }
  .swal2-icon.swal2-warning {
    border-color: var(--danger) !important;
    color: var(--danger) !important;
  }
  .swal2-icon.swal2-success {
    border-color: var(--success) !important;
    color: var(--success) !important;
  }
  .swal2-icon.swal2-success [class^='swal2-success-line'] {
    background-color: var(--success) !important;
  }
  .swal2-icon.swal2-success .swal2-success-ring {
    border: 3px solid var(--success-light) !important;
  }
  .swal2-icon.swal2-error {
    border-color: var(--danger) !important;
    color: var(--danger) !important;
  }
  .swal2-icon.swal2-error [class^='swal2-x-mark-line'] {
    background-color: var(--danger) !important;
  }

`;

export default function App() {
  const [dark, setDarkRaw] = useState(() => storage.get("app_dark", false));

  const setDark = (v) => {
    const next = typeof v === "function" ? v(dark) : v;
    setDarkRaw(next); 
    storage.set("app_dark", next);
  };

  const activeTheme = TOKENS[dark ? "dark" : "light"];

  const themeVarsCss = `
    :root {
      ${Object.entries(activeTheme).map(([key, val]) => `${key}: ${val};`).join('\n')}
    }
  `;

  return (
    <div className="app-root">
      <style>{themeVarsCss}</style>
      <style>{appCss}</style>
      <Toast />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage dark={dark} setDark={setDark} />} />
            
            <Route path="/" element={
              <ProtectedRoute>
                <DashboardPage dark={dark} setDark={setDark} />
              </ProtectedRoute>
            } />
            
            <Route path="/builder/:id" element={
              <ProtectedRoute>
                <BuilderPage dark={dark} setDark={setDark} />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}
