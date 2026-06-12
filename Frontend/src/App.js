import { useState, useEffect, useRef, useCallback } from "react";

// Proxy AI requests through backend to avoid CORS and keep API keys server-side
const API_URL = process.env.REACT_APP_API_URL 
  ? `${process.env.REACT_APP_API_URL.replace(/\/$/, '')}/api/ai/raw` 
  : "/api/ai/raw";


const emptyResume = () => ({
  id: Date.now(),
  title: "Untitled Resume",
  template: "modern",
  updatedAt: new Date().toISOString(),
  personalInfo: {
    fullName: "", jobTitle: "", email: "", phone: "", location: "",
    linkedin: "", github: "", website: "", summary: ""
  },
  education: [],
  experience: [],
  skills: [],
  projects: [],
  certifications: [],
  achievements: [],
  languages: []
});

const storage = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

const ToastCtx = { listeners: [], notify(msg, type = "success") { this.listeners.forEach(fn => fn({ msg, type, id: Date.now() })); } };

function Toast() {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    const fn = (t) => {
      setToasts(p => [...p, t]);
      setTimeout(() => setToasts(p => p.filter(x => x.id !== t.id)), 3500);
    };
    ToastCtx.listeners.push(fn);
    return () => { ToastCtx.listeners = ToastCtx.listeners.filter(l => l !== fn); };
  }, []);
  return (
    <div style={{ position: "fixed", top: 24, right: 24, zIndex: 9999, display: "flex", flexDirection: "column", gap: 12 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          padding: "14px 22px", borderRadius: 12, fontSize: 14, fontWeight: 600,
          background: t.type === "error" ? "#fef2f2" : t.type === "info" ? "#eff6ff" : "#f0fdf4",
          color: t.type === "error" ? "#991b1b" : t.type === "info" ? "#1e40af" : "#166534",
          border: `1px solid ${t.type === "error" ? "#fee2e2" : t.type === "info" ? "#dbeafe" : "#dcfce7"}`,
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
          display: "flex", alignItems: "center", gap: 12, maxWidth: 360
        }}>
          <span>{t.type === "error" ? "✕" : t.type === "info" ? "ℹ" : "✓"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

async function askClaude(prompt, onChunk) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`AI request failed: ${res.status} ${text}`);
  }
  const json = await res.json();
  // backend returns { result } or { result: <object> }
  const result = (json.result && (typeof json.result === 'string' ? json.result : JSON.stringify(json.result))) || '';
  onChunk?.(result);
  return result;
}

const THEMES = {
  midnight: {
    label: "Midnight", swatch: "#6366f1",
    vars: {
      "--bg": "#090d16", "--card": "#111827", "--card-2": "#1f2937",
      "--border": "rgba(255,255,255,0.08)", "--border-light": "rgba(255,255,255,0.15)",
      "--text": "#f9fafb", "--text-muted": "#9ca3af", "--text-dim": "#6b7280",
      "--accent": "#4f46e5", "--accent-hover": "#4338ca", "--accent-light": "#818cf8",
      "--success": "#10b981", "--success-bg": "rgba(16,185,129,0.1)",
      "--warn": "#f59e0b", "--warn-bg": "rgba(245,158,11,0.1)",
      "--danger": "#ef4444", "--danger-bg": "rgba(239,68,68,0.1)",
      "--purple": "#8b5cf6", "--pink": "#ec4899", "--teal": "#14b8a6", "--cyan": "#06b6d4",
      "--app-bg": "radial-gradient(ellipse at top, rgba(99,102,241,0.15), transparent 50%), #090d16"
    }
  },
  graphite: {
    label: "Graphite", swatch: "#10b981",
    vars: {
      "--bg": "#0b0f19", "--card": "#161e2e", "--card-2": "#222f44",
      "--border": "rgba(255,255,255,0.06)", "--border-light": "rgba(255,255,255,0.12)",
      "--text": "#f3f4f6", "--text-muted": "#9ca3af", "--text-dim": "#4b5563",
      "--accent": "#10b981", "--accent-hover": "#059669", "--accent-light": "#34d399",
      "--success": "#10b981", "--success-bg": "rgba(16,185,129,0.1)",
      "--warn": "#d97706", "--warn-bg": "rgba(217,119,6,0.1)",
      "--danger": "#dc2626", "--danger-bg": "rgba(220,38,38,0.1)",
      "--purple": "#7c3aed", "--pink": "#db2777", "--teal": "#0d9488", "--cyan": "#0891b2",
      "--app-bg": "radial-gradient(ellipse at top, rgba(16,185,129,0.12), transparent 45%), #0b0f19"
    }
  },
  ivory: {
    label: "Ivory", swatch: "#2563eb",
    vars: {
      "--bg": "#f8fafc", "--card": "#ffffff", "--card-2": "#f1f5f9",
      "--border": "rgba(0,0,0,0.06)", "--border-light": "rgba(0,0,0,0.12)",
      "--text": "#0f172a", "--text-muted": "#475569", "--text-dim": "#94a3b8",
      "--accent": "#2563eb", "--accent-hover": "#1d4ed8", "--accent-light": "#3b82f6",
      "--success": "#16a34a", "--success-bg": "#dcfce7",
      "--warn": "#d97706", "--warn-bg": "#fef3c7",
      "--danger": "#dc2626", "--danger-bg": "#fee2e2",
      "--purple": "#7c3aed", "--pink": "#db2777", "--teal": "#0d9488", "--cyan": "#0891b2",
      "--app-bg": "linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)"
    }
  },
  executive: {
    label: "Executive", swatch: "#c89b3c",
    vars: {
      "--bg": "#121212", "--card": "#1a1a1a", "--card-2": "#262626",
      "--border": "rgba(255,255,255,0.05)", "--border-light": "rgba(255,255,255,0.12)",
      "--text": "#f4efe6", "--text-muted": "#a39e93", "--text-dim": "#59554f",
      "--accent": "#c89b3c", "--accent-hover": "#b0852f", "--accent-light": "#dfba6b",
      "--success": "#65a30d", "--success-bg": "rgba(101,163,13,0.1)",
      "--warn": "#d97706", "--warn-bg": "rgba(217,119,6,0.1)",
      "--danger": "#dc2626", "--danger-bg": "rgba(220,38,38,0.1)",
      "--purple": "#a78bfa", "--pink": "#f472b6", "--teal": "#2dd4bf", "--cyan": "#22d3ee",
      "--app-bg": "radial-gradient(circle at 0% 0%, rgba(200,155,60,0.1), transparent 35%), #121212"
    }
  }
};

const themeStyle = (theme) => THEMES[theme]?.vars || THEMES.midnight.vars;

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=Playfair+Display:ital,wght@0,700;1,400&family=DM+Sans:wght@400;500;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--text); -webkit-font-smoothing: antialiased; }
  .app-shell { background: var(--app-bg); color: var(--text); min-height: 100vh; }
  @keyframes slideIn { from { transform: translateY(8px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fadeUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes spin { to { transform: rotate(360deg); } }
  .fadeUp { animation: fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both; }
  .spin { animation: spin 0.8s linear infinite; display: inline-block; }
  input, select, textarea {
    background: var(--card-2); color: var(--text); border: 1px solid var(--border);
    border-radius: 10px; padding: 12px 16px; font-family: inherit; font-size: 14px;
    outline: none; transition: all 0.2s; width: 100%;
  }
  input:focus, select:focus, textarea:focus {
    border-color: var(--accent-light);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 15%, transparent);
    background: var(--card);
  }
  textarea { resize: vertical; min-height: 100px; line-height: 1.5; }
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border-light); border-radius: 99px; }
  button { font-family: 'Plus Jakarta Sans', sans-serif; }
  #resume-preview { background: #fff; color: #1e293b; width: 210mm; min-height: 297mm; margin: 0 auto; overflow: hidden; }
  @media print {
    body * { visibility: hidden; }
    #resume-preview, #resume-preview * { visibility: visible; }
    #resume-preview { position: fixed; left: 0; top: 0; width: 100%; box-shadow: none; margin: 0; }
  }
`;

function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: sx, loading }) {
  const styles = {
    primary: { background: "var(--text)", color: "var(--bg)", border: "none" },
    secondary: { background: "var(--card-2)", color: "var(--text)", border: "1px solid var(--border)" },
    ghost: { background: "transparent", color: "var(--text-muted)", border: "1px solid transparent" },
    danger: { background: "var(--danger-bg)", color: "var(--danger)", border: "1px solid var(--border)" },
    success: { background: "var(--success-bg)", color: "var(--success)", border: "1px solid var(--border)" },
    ai: { background: "linear-gradient(135deg, #4f46e5, #7c3aed)", color: "#fff", border: "none", boxShadow: "0 4px 12px rgba(79,70,229,0.25)" }
  };
  const pad = size === "sm" ? "8px 14px" : size === "lg" ? "14px 28px" : "11px 20px";
  const fsize = size === "sm" ? 13 : size === "lg" ? 16 : 14;
  return (
    <button onClick={onClick} disabled={disabled || loading} style={{
      ...styles[variant], padding: pad, fontSize: fsize, borderRadius: 10,
      cursor: disabled || loading ? "not-allowed" : "pointer", fontWeight: 600,
      transition: "all 0.2s", opacity: disabled ? 0.4 : 1,
      display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap", ...sx
    }}
    onMouseEnter={e => { if (!disabled && variant !== "ghost") e.currentTarget.style.filter = "brightness(1.15)"; }}
    onMouseLeave={e => { if (!disabled) e.currentTarget.style.filter = "none"; }}>
      {loading && <span className="spin" style={{ fontSize: 14 }}>⟳</span>}
      {children}
    </button>
  );
}

function Card({ children, style: sx }) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)",
      borderRadius: 16, padding: 28, boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)", ...sx
    }}>{children}</div>
  );
}

function Field({ label, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>{label}</label>
        {hint && <span style={{ color: "var(--text-dim)", fontSize: 12 }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

function Badge({ color, children }) {
  const map = { blue: ["#3b82f6", "rgba(59,130,246,0.1)"], amber: ["#f59e0b", "rgba(245,158,11,0.1)"], green: ["#10b981", "rgba(16,185,129,0.1)"], purple: ["#8b5cf6", "rgba(139,92,246,0.1)"], teal: ["#14b8a6", "rgba(20,136,166,0.1)"] };
  const [fg, bg] = map[color] || map.blue;
  return <span style={{ background: bg, color: fg, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>{children}</span>;
}

const THEME_META = {
  midnight:  { icon: "🌙", label: "Midnight",  desc: "Dark · Indigo"   },
  graphite:  { icon: "🌿", label: "Graphite",  desc: "Dark · Emerald"  },
  ivory:     { icon: "☀️",  label: "Ivory",     desc: "Light · Blue"    },
  executive: { icon: "👑", label: "Executive", desc: "Dark · Gold"     },
};

function ThemeSwitcher({ theme, setTheme, compact = false }) {
  const [open, setOpen] = useState(false);
  const [openDown, setOpenDown] = useState(true);
  const ref = useRef(null);

  const computePlacement = () => {
    if (!ref.current) return true;
    const rect = ref.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    // prefer opening down if there's more space below, else open up
    return spaceBelow > spaceAbove;
  };

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onChange = () => setOpenDown(computePlacement());
    window.addEventListener("resize", onChange);
    window.addEventListener("scroll", onChange, true);
    // ensure correct placement initially
    onChange();
    return () => {
      window.removeEventListener("resize", onChange);
      window.removeEventListener("scroll", onChange, true);
    };
  }, [open]);

  const active = THEME_META[theme] || THEME_META.midnight;
  const swatch = THEMES[theme]?.swatch || "#6366f1";

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <button
        onClick={() => setOpen(o => {
          const willOpen = !o;
          if (willOpen) setOpenDown(computePlacement());
          return willOpen;
        })}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: compact ? "6px 12px" : "8px 14px",
          background: "var(--card-2)", border: `1px solid ${open ? swatch : "var(--border-light)"}`,
          borderRadius: 99, cursor: "pointer", transition: "all 0.2s",
          boxShadow: open ? `0 0 0 3px ${swatch}33` : "none", outline: "none"
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = swatch; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.borderColor = "var(--border-light)"; }}
      >
        <span style={{
          width: 10, height: 10, borderRadius: "50%", background: swatch, flexShrink: 0,
          boxShadow: `0 0 7px ${swatch}bb`, transition: "all 0.3s"
        }} />
        <span style={{ fontSize: compact ? 12 : 13, fontWeight: 700, color: "var(--text)" }}>
          {active.icon} {active.label}
        </span>
        <span style={{ fontSize: 9, color: "var(--text-dim)", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</span>
      </button>

      {open && (
        (() => {
          const placementStyle = openDown ? { top: "calc(100% + 8px)" } : { bottom: "calc(100% + 8px)" };
          return (
            <div style={{
              position: "absolute", right: 0, zIndex: 1000,
              background: "var(--card)", border: "1px solid var(--border-light)",
              borderRadius: 16, padding: 6, minWidth: 280,
              boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
              animation: "fadeUp 0.15s cubic-bezier(0.16,1,0.3,1)",
              ...placementStyle
            }}>
              {Object.entries(THEME_META).map(([id, meta]) => {
                const sw = THEMES[id]?.swatch || "#888";
                const isActive = theme === id;
                return (
                  <button key={id} onClick={() => { setTheme(id); setOpen(false); }} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 12,
                    padding: "10px 12px", borderRadius: 10, border: "none",
                    background: isActive ? `${sw}1a` : "transparent",
                    cursor: "pointer", transition: "all 0.15s", outline: "none"
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "var(--card-2)"; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                    <span style={{
                      width: 30, height: 30, borderRadius: 9, background: sw, flexShrink: 0,
                      boxShadow: isActive ? `0 0 12px ${sw}99` : "none",
                      border: `2px solid ${isActive ? sw : "transparent"}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, transition: "all 0.2s"
                    }}>{isActive ? "✓" : ""}</span>
                    <div style={{ flex: 1, textAlign: "left" }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? sw : "var(--text)" }}>{meta.icon} {meta.label}</div>
                      <div style={{ fontSize: 11, color: "var(--text-dim)", marginTop: 1 }}>{meta.desc}</div>
                    </div>
                    {isActive && <span style={{ fontSize: 10, fontWeight: 700, color: sw, background: `${sw}1a`, padding: "2px 8px", borderRadius: 99, border: `1px solid ${sw}44`, whiteSpace: "nowrap" }}>Active</span>}
                  </button>
                );
              })}
            </div>
          );
        })()
      )}
      
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// 10 RESUME TEMPLATES
// ═══════════════════════════════════════════════════════════

// 1. MODERN — Dark header, two-column
function ModernTemplate({ data }) {
  const { personalInfo: p, education, experience, skills, projects, certifications } = data;
  return (
    <div id="resume-preview">
      <div style={{ background: "#0f172a", color: "#f8fafc", padding: "44px 48px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Instrument Serif', serif", fontStyle: "italic", letterSpacing: "-0.02em" }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: "#38bdf8", fontSize: 15, fontWeight: 600, marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.jobTitle || "Software Engineer"}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px", fontSize: 12, color: "#94a3b8", marginTop: 18, borderTop: "1px solid #1e293b", paddingTop: 16 }}>
          {p.email && <span>✉ {p.email}</span>}{p.phone && <span>📱 {p.phone}</span>}{p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}{p.github && <span>⌥ {p.github}</span>}
        </div>
      </div>
      <div style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40 }}>
        <div>
          {p.summary && <TplSection title="Profile"><p style={{ color: "#334155", lineHeight: 1.7, fontSize: 13 }}>{p.summary}</p></TplSection>}
          {experience?.length > 0 && <TplSection title="Experience">
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <h4 style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{e.position}</h4>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
                </div>
                <div style={{ color: "#4f46e5", fontWeight: 600, fontSize: 12, marginBottom: 6 }}>{e.company}{e.location && ` • ${e.location}`}</div>
                {e.points?.filter(Boolean).map((pt, j) => <div key={j} style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 12, color: "#334155" }}><span style={{ color: "#4f46e5" }}>•</span><span>{pt}</span></div>)}
              </div>
            ))}
          </TplSection>}
          {projects?.length > 0 && <TplSection title="Projects">
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: 13 }}>{pr.name}</span>
                {pr.description && <p style={{ color: "#475569", fontSize: 12, marginTop: 4 }}>{pr.description}</p>}
              </div>
            ))}
          </TplSection>}
        </div>
        <div>
          {skills?.length > 0 && <TplSide title="Skills">
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                {s.category && <div style={{ fontWeight: 700, fontSize: 10, color: "#0f172a", marginBottom: 6, textTransform: "uppercase" }}>{s.category}</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {s.items?.map((it, j) => <span key={j} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#334155", fontSize: 10, padding: "2px 7px", borderRadius: 4 }}>{it}</span>)}
                </div>
              </div>
            ))}
          </TplSide>}
          {education?.length > 0 && <TplSide title="Education">
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, color: "#0f172a", fontSize: 12 }}>{ed.degree}</div>
                <div style={{ color: "#475569", fontSize: 12 }}>{ed.institution}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{ed.startDate} – {ed.endDate}</div>
              </div>
            ))}
          </TplSide>}
          {certifications?.length > 0 && <TplSide title="Certifications">
            {certifications.map((c, i) => <div key={i} style={{ marginBottom: 8, fontSize: 12 }}><div style={{ fontWeight: 600 }}>{c.name}</div><div style={{ color: "#64748b", fontSize: 11 }}>{c.issuer}</div></div>)}
          </TplSide>}
        </div>
      </div>
    </div>
  );
}

// 2. MINIMAL — Clean single column
function MinimalTemplate({ data }) {
  const { personalInfo: p, education, experience, skills, projects } = data;
  return (
    <div id="resume-preview" style={{ padding: "60px", fontFamily: "'DM Sans', sans-serif", color: "#1c1917" }}>
      <header style={{ borderBottom: "1px solid #e7e5e4", paddingBottom: 24, marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 300, letterSpacing: "-0.03em" }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: "#78716c", fontSize: 14, marginTop: 4 }}>{p.jobTitle}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 12, color: "#78716c", marginTop: 12 }}>
          {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}
        </div>
      </header>
      {p.summary && <p style={{ fontSize: 13, lineHeight: 1.8, color: "#44403c", marginBottom: 32 }}>{p.summary}</p>}
      {experience?.length > 0 && <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 16 }}>Experience</h3>
        {experience.map((e, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 20, marginBottom: 20 }}>
            <span style={{ fontSize: 11, color: "#78716c", paddingTop: 2 }}>{e.startDate} — {e.current ? "Now" : e.endDate}</span>
            <div>
              <h4 style={{ fontWeight: 600, fontSize: 14 }}>{e.position} <span style={{ color: "#a8a29e", fontWeight: 400 }}>@ {e.company}</span></h4>
              {e.points?.map((pt, j) => <p key={j} style={{ fontSize: 12, color: "#44403c", marginTop: 5 }}>— {pt}</p>)}
            </div>
          </div>
        ))}
      </section>}
      {skills?.length > 0 && <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 14 }}>Skills</h3>
        {skills.map((s, i) => (
          <div key={i} style={{ marginBottom: 10 }}>
            {s.category && <span style={{ fontSize: 11, fontWeight: 600, color: "#57534e", marginRight: 12 }}>{s.category}:</span>}
            <span style={{ fontSize: 12, color: "#44403c" }}>{s.items?.join(", ")}</span>
          </div>
        ))}
      </section>}
    </div>
  );
}

// 3. PROFESSIONAL — Sidebar layout
function ProfessionalTemplate({ data }) {
  const { personalInfo: p, experience = [], education = [], skills = [], certifications = [] } = data;
  return (
    <div id="resume-preview" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "297mm", fontFamily: "'Inter', sans-serif" }}>
      <aside style={{ background: "#1e3a5f", color: "#fff", padding: "40px 24px" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#2d5a9e", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, marginBottom: 20, border: "3px solid rgba(255,255,255,0.2)" }}>
          {(p.fullName || "?").charAt(0)}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{p.fullName || "Your Name"}</h1>
        <p style={{ fontSize: 12, color: "#93c5fd", marginBottom: 28 }}>{p.jobTitle}</p>
        <div style={{ marginBottom: 28 }}>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#60a5fa", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6 }}>Contact</h3>
          {p.email && <div style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 6 }}>{p.email}</div>}
          {p.phone && <div style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 6 }}>{p.phone}</div>}
          {p.location && <div style={{ fontSize: 11, color: "#cbd5e1", marginBottom: 6 }}>{p.location}</div>}
        </div>
        {skills?.length > 0 && <div>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.1em", color: "#60a5fa", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6 }}>Skills</h3>
          {skills.flatMap(s => s.items || []).slice(0, 16).map((it, i) => (
            <div key={i} style={{ fontSize: 11, color: "#cbd5e1", padding: "4px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>{it}</div>
          ))}
        </div>}
      </aside>
      <main style={{ padding: "40px 36px", background: "#fff" }}>
        {p.summary && <div style={{ marginBottom: 28, paddingBottom: 20, borderBottom: "1px solid #e2e8f0" }}>
          <p style={{ fontSize: 13, lineHeight: 1.75, color: "#475569" }}>{p.summary}</p>
        </div>}
        {experience?.length > 0 && <section style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16, paddingBottom: 6, borderBottom: "2px solid #1e3a5f" }}>Experience</h2>
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{e.position}</h4>
                <span style={{ fontSize: 11, color: "#64748b" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
              </div>
              <div style={{ fontSize: 12, color: "#2d5a9e", fontWeight: 600, marginBottom: 6 }}>{e.company}</div>
              {e.points?.map((pt, j) => <div key={j} style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>• {pt}</div>)}
            </div>
          ))}
        </section>}
        {education?.length > 0 && <section>
          <h2 style={{ fontSize: 13, fontWeight: 700, color: "#1e3a5f", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 16, paddingBottom: 6, borderBottom: "2px solid #1e3a5f" }}>Education</h2>
          {education.map((ed, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>{ed.degree}</div>
              <div style={{ fontSize: 12, color: "#475569" }}>{ed.institution} • {ed.startDate} – {ed.endDate}</div>
            </div>
          ))}
        </section>}
      </main>
    </div>
  );
}

// 4. CREATIVE — Gradient header, bold
function CreativeTemplate({ data }) {
  const { personalInfo: p, projects = [], skills = [], experience = [] } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 50%, #0ea5e9 100%)", color: "#fff", padding: "44px 48px" }}>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: "-0.03em", margin: 0 }}>{p.fullName || "Your Name"}</h1>
        <p style={{ opacity: 0.85, fontSize: 16, marginTop: 6, fontWeight: 500 }}>{p.jobTitle}</p>
        <div style={{ display: "flex", gap: 20, marginTop: 20, fontSize: 12, opacity: 0.8 }}>
          {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, background: "#fff" }}>
        <div style={{ padding: "36px 36px 36px 48px", borderRight: "1px solid #f1f5f9" }}>
          {p.summary && <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7c3aed", marginBottom: 10 }}>About</h3>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#374151" }}>{p.summary}</p>
          </div>}
          {experience?.length > 0 && <div>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7c3aed", marginBottom: 14 }}>Experience</h3>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 18, paddingLeft: 12, borderLeft: "2px solid #e0e7ff" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{e.position}</div>
                <div style={{ fontSize: 12, color: "#7c3aed", marginBottom: 4 }}>{e.company} · {e.startDate}–{e.current ? "Now" : e.endDate}</div>
                {e.points?.map((pt, j) => <p key={j} style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>→ {pt}</p>)}
              </div>
            ))}
          </div>}
        </div>
        <div style={{ padding: "36px 48px 36px 36px" }}>
          {projects?.length > 0 && <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7c3aed", marginBottom: 14 }}>Projects</h3>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 16, padding: "12px 14px", background: "#f8f7ff", borderRadius: 8, border: "1px solid #ede9fe" }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: "#1f2937" }}>{pr.name}</div>
                {pr.description && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 4 }}>{pr.description}</p>}
                {pr.techStack?.length > 0 && <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
                  {pr.techStack.map((t, j) => <span key={j} style={{ background: "#ede9fe", color: "#5b21b6", fontSize: 10, padding: "2px 6px", borderRadius: 4 }}>{t}</span>)}
                </div>}
              </div>
            ))}
          </div>}
          {skills?.length > 0 && <div>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#7c3aed", marginBottom: 14 }}>Skills</h3>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                {s.category && <div style={{ fontSize: 11, fontWeight: 700, color: "#1f2937", marginBottom: 6 }}>{s.category}</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                  {s.items?.map((it, j) => <span key={j} style={{ background: "#f3f4f6", color: "#374151", fontSize: 11, padding: "3px 8px", borderRadius: 20 }}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}

// 5. CLASSIC — Serif, traditional
function ClassicTemplate({ data }) {
  const { personalInfo: p, education = [], experience = [], skills = [] } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Crimson Pro', serif", color: "#1a1a1a", padding: "52px 60px" }}>
      <header style={{ textAlign: "center", paddingBottom: 24, marginBottom: 28, borderBottom: "2px solid #1a1a1a" }}>
        <h1 style={{ fontSize: 38, fontWeight: 600, letterSpacing: "0.02em" }}>{p.fullName || "Your Name"}</h1>
        {p.jobTitle && <p style={{ fontSize: 15, fontStyle: "italic", color: "#555", marginTop: 6 }}>{p.jobTitle}</p>}
        <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12, fontSize: 12, color: "#555", fontFamily: "'Inter', sans-serif" }}>
          {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}
        </div>
      </header>
      {p.summary && <div style={{ marginBottom: 28, textAlign: "center" }}>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: "#333", fontStyle: "italic", maxWidth: "80%", margin: "0 auto" }}>{p.summary}</p>
      </div>}
      {experience?.length > 0 && <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Professional Experience</h2>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < experience.length - 1 ? "1px solid #e5e7eb" : "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{e.position}</h3>
              <span style={{ fontSize: 12, color: "#666", fontFamily: "'Inter', sans-serif" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
            </div>
            <p style={{ fontSize: 13, color: "#555", fontStyle: "italic", marginBottom: 8 }}>{e.company}{e.location && `, ${e.location}`}</p>
            {e.points?.map((pt, j) => <p key={j} style={{ fontSize: 13, color: "#333", marginTop: 4, paddingLeft: 12 }}>– {pt}</p>)}
          </div>
        ))}
      </section>}
      {education?.length > 0 && <section>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontFamily: "'Inter', sans-serif", fontWeight: 600 }}>Education</h2>
        {education.map((ed, i) => (
          <div key={i} style={{ textAlign: "center", marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{ed.degree}</div>
            <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>{ed.institution} · {ed.startDate} – {ed.endDate}</div>
          </div>
        ))}
      </section>}
    </div>
  );
}

// 6. ELEGANT — Gold accent, luxury feel
function ElegantTemplate({ data }) {
  const { personalInfo: p, experience = [], education = [], skills = [], certifications = [] } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Playfair Display', 'Georgia', serif", background: "#fafaf8" }}>
      <div style={{ background: "#1a1a1a", padding: "48px 56px", color: "#faf8f4" }}>
        <div style={{ borderBottom: "1px solid #c89b3c", paddingBottom: 24, marginBottom: 24 }}>
          <h1 style={{ fontSize: 40, fontWeight: 700, letterSpacing: "0.01em" }}>{p.fullName || "Your Name"}</h1>
          <p style={{ color: "#c89b3c", fontSize: 14, marginTop: 8, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "'Inter', sans-serif", fontWeight: 500 }}>{p.jobTitle}</p>
        </div>
        <div style={{ display: "flex", gap: 32, fontSize: 12, color: "#a39e93", fontFamily: "'Inter', sans-serif" }}>
          {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 260px", minHeight: "60mm" }}>
        <div style={{ padding: "44px 48px", borderRight: "1px solid #e8e4dc" }}>
          {p.summary && <div style={{ marginBottom: 32 }}>
            <p style={{ fontSize: 14, lineHeight: 1.85, color: "#44403c", fontStyle: "italic" }}>{p.summary}</p>
          </div>}
          {experience?.length > 0 && <div>
            <h2 style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.15em", color: "#c89b3c", marginBottom: 20, fontFamily: "'Inter', sans-serif" }}>Experience</h2>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < experience.length - 1 ? "1px solid #f0ece4" : "none" }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a" }}>{e.position}</h3>
                <div style={{ color: "#c89b3c", fontFamily: "'Inter', sans-serif", fontSize: 12, marginBottom: 8 }}>{e.company} · {e.startDate}–{e.current ? "Present" : e.endDate}</div>
                {e.points?.map((pt, j) => <p key={j} style={{ fontSize: 13, color: "#57534e", marginTop: 5 }}>• {pt}</p>)}
              </div>
            ))}
          </div>}
        </div>
        <aside style={{ padding: "44px 32px", background: "#f5f4f0" }}>
          {education?.length > 0 && <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#c89b3c", marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>Education</h2>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>{ed.degree}</div>
                <div style={{ fontSize: 12, color: "#78716c", fontFamily: "'Inter', sans-serif" }}>{ed.institution}</div>
                <div style={{ fontSize: 11, color: "#a8a29e", fontFamily: "'Inter', sans-serif" }}>{ed.startDate}–{ed.endDate}</div>
              </div>
            ))}
          </div>}
          {skills?.length > 0 && <div>
            <h2 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", color: "#c89b3c", marginBottom: 14, fontFamily: "'Inter', sans-serif" }}>Skills</h2>
            {skills.flatMap(s => s.items || []).map((it, i) => (
              <div key={i} style={{ fontSize: 12, color: "#44403c", padding: "5px 0", borderBottom: "1px solid #e8e4dc", fontFamily: "'Inter', sans-serif" }}>{it}</div>
            ))}
          </div>}
        </aside>
      </div>
    </div>
  );
}

// 7. TECH — Developer focused, monospace accents
function TechTemplate({ data }) {
  const { personalInfo: p, experience = [], skills = [], projects = [], education = [] } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Inter', monospace", background: "#0d1117", color: "#e6edf3", padding: "40px 48px" }}>
      <div style={{ borderBottom: "1px solid #21262d", paddingBottom: 28, marginBottom: 32 }}>
        <div style={{ color: "#58a6ff", fontSize: 13, marginBottom: 8, fontFamily: "'Courier New', monospace" }}>{"// resume.json"}</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", color: "#e6edf3" }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: "#8b949e", fontSize: 14, marginTop: 6, fontFamily: "'Courier New', monospace" }}>{"<"}<span style={{ color: "#7ee787" }}>{p.jobTitle || "Engineer"}</span>{" />"}</p>
        <div style={{ display: "flex", gap: 20, marginTop: 16, fontSize: 12, color: "#8b949e", fontFamily: "'Courier New', monospace" }}>
          {p.email && <span style={{ color: "#58a6ff" }}>{p.email}</span>}
          {p.github && <span style={{ color: "#58a6ff" }}>{p.github}</span>}
          {p.location && <span>{p.location}</span>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40 }}>
        <div>
          {p.summary && <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#7ee787", marginBottom: 8, fontFamily: "'Courier New', monospace" }}>/* about */</div>
            <p style={{ fontSize: 13, lineHeight: 1.7, color: "#8b949e" }}>{p.summary}</p>
          </div>}
          {experience?.length > 0 && <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16, fontFamily: "'Courier New', monospace" }}>/* experience */</div>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 20, paddingLeft: 16, borderLeft: "2px solid #21262d" }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>{e.position}</div>
                <div style={{ fontSize: 12, color: "#58a6ff", marginBottom: 6 }}>{e.company} · {e.startDate}–{e.current ? "now" : e.endDate}</div>
                {e.points?.map((pt, j) => <div key={j} style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>{"→"} {pt}</div>)}
              </div>
            ))}
          </div>}
          {projects?.length > 0 && <div>
            <div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16, fontFamily: "'Courier New', monospace" }}>/* projects */</div>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 14, padding: "12px 14px", background: "#161b22", borderRadius: 6, border: "1px solid #21262d" }}>
                <div style={{ fontWeight: 700, fontSize: 13 }}>{pr.name}</div>
                {pr.description && <p style={{ fontSize: 11, color: "#8b949e", marginTop: 4 }}>{pr.description}</p>}
              </div>
            ))}
          </div>}
        </div>
        <div>
          {skills?.length > 0 && <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16, fontFamily: "'Courier New', monospace" }}>/* skills */</div>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                {s.category && <div style={{ fontSize: 11, color: "#f8849a", marginBottom: 6, fontFamily: "'Courier New', monospace" }}>{s.category}:</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {s.items?.map((it, j) => <span key={j} style={{ background: "#161b22", border: "1px solid #30363d", color: "#e6edf3", fontSize: 10, padding: "3px 7px", borderRadius: 4 }}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>}
          {education?.length > 0 && <div>
            <div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16, fontFamily: "'Courier New', monospace" }}>/* education */</div>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 12, padding: "10px 12px", background: "#161b22", border: "1px solid #21262d", borderRadius: 6 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{ed.degree}</div>
                <div style={{ fontSize: 11, color: "#8b949e" }}>{ed.institution} · {ed.startDate}–{ed.endDate}</div>
              </div>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}

// 8. COMPACT — Tight layout, fits max content
function CompactTemplate({ data }) {
  const { personalInfo: p, experience = [], education = [], skills = [], projects = [], certifications = [] } = data;
  const allSkills = skills.flatMap(s => s.items || []);
  return (
    <div id="resume-preview" style={{ fontFamily: "'Inter', sans-serif", padding: "32px 40px", background: "#fff", color: "#111827" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: 14, marginBottom: 18, borderBottom: "2px solid #111827" }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>{p.fullName || "Your Name"}</h1>
          <p style={{ color: "#4b5563", fontSize: 13, fontWeight: 500, marginTop: 3 }}>{p.jobTitle}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "#6b7280", lineHeight: 1.7 }}>
          {p.email && <div>{p.email}</div>}{p.phone && <div>{p.phone}</div>}{p.location && <div>{p.location}</div>}
          {p.linkedin && <div>{p.linkedin}</div>}{p.github && <div>{p.github}</div>}
        </div>
      </header>
      {p.summary && <p style={{ fontSize: 12, lineHeight: 1.7, color: "#374151", marginBottom: 16 }}>{p.summary}</p>}
      {allSkills.length > 0 && <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginRight: 8 }}>Skills:</span>
        <span style={{ fontSize: 12, color: "#374151" }}>{allSkills.join(" • ")}</span>
      </div>}
      {experience?.length > 0 && <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, color: "#111827" }}>Experience</h2>
        {experience.map((e, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, fontWeight: 700 }}>{e.position} — {e.company}</span>
              <span style={{ fontSize: 11, color: "#6b7280" }}>{e.startDate}–{e.current ? "Present" : e.endDate}</span>
            </div>
            {e.points?.map((pt, j) => <div key={j} style={{ fontSize: 11, color: "#4b5563", marginTop: 3 }}>• {pt}</div>)}
          </div>
        ))}
      </div>}
      {education?.length > 0 && <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Education</h2>
        {education.map((ed, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600 }}>{ed.degree} — {ed.institution}</span>
            <span style={{ fontSize: 11, color: "#6b7280" }}>{ed.startDate}–{ed.endDate}</span>
          </div>
        ))}
      </div>}
      {projects?.length > 0 && <div>
        <h2 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Projects</h2>
        {projects.map((pr, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>{pr.name}:</span>
            <span style={{ fontSize: 12, color: "#4b5563", marginLeft: 6 }}>{pr.description}</span>
          </div>
        ))}
      </div>}
    </div>
  );
}

// 9. INFOGRAPHIC — Colorful, visual skills bars
function InfographicTemplate({ data }) {
  const { personalInfo: p, experience = [], education = [], skills = [], projects = [] } = data;
  const accentColors = ["#6366f1", "#8b5cf6", "#0ea5e9", "#10b981", "#f59e0b"];
  return (
    <div id="resume-preview" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff" }}>
      <div style={{ display: "grid", gridTemplateColumns: "200px 1fr" }}>
        <aside style={{ background: "#f8f7ff", padding: "40px 20px", borderRight: "1px solid #ede9fe" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 22, fontWeight: 800, marginBottom: 16 }}>
            {(p.fullName || "?").charAt(0)}
          </div>
          <h1 style={{ fontSize: 16, fontWeight: 800, color: "#1e1b4b", lineHeight: 1.3 }}>{p.fullName || "Your Name"}</h1>
          <p style={{ fontSize: 11, color: "#6366f1", marginTop: 4, fontWeight: 600 }}>{p.jobTitle}</p>
          <div style={{ marginTop: 20, fontSize: 11, color: "#6b7280", lineHeight: 2 }}>
            {p.email && <div>✉ {p.email}</div>}{p.phone && <div>☎ {p.phone}</div>}{p.location && <div>📍 {p.location}</div>}
          </div>
          {skills?.length > 0 && <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6366f1", marginBottom: 12, fontWeight: 700 }}>Skills</h3>
            {skills.flatMap(s => (s.items || []).map(it => ({ it, cat: s.category }))).slice(0, 12).map(({ it }, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#374151", marginBottom: 3 }}>
                  <span>{it}</span>
                </div>
                <div style={{ height: 4, background: "#e0e7ff", borderRadius: 99 }}>
                  <div style={{ height: 4, background: accentColors[i % accentColors.length], borderRadius: 99, width: `${70 + (i * 7) % 30}%` }} />
                </div>
              </div>
            ))}
          </div>}
        </aside>
        <main style={{ padding: "40px 36px" }}>
          {p.summary && <div style={{ marginBottom: 28, padding: "16px 20px", background: "#f5f3ff", borderRadius: 10, borderLeft: "4px solid #6366f1" }}>
            <p style={{ fontSize: 12, lineHeight: 1.7, color: "#374151" }}>{p.summary}</p>
          </div>}
          {experience?.length > 0 && <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6366f1", marginBottom: 16, fontWeight: 700 }}>Experience</h2>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 18, display: "flex", gap: 14 }}>
                <div style={{ width: 8, minWidth: 8, height: 8, borderRadius: "50%", background: accentColors[i % accentColors.length], marginTop: 5 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{e.position}</div>
                  <div style={{ fontSize: 11, color: "#6366f1", marginBottom: 4 }}>{e.company} · {e.startDate}–{e.current ? "Present" : e.endDate}</div>
                  {e.points?.map((pt, j) => <p key={j} style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>• {pt}</p>)}
                </div>
              </div>
            ))}
          </div>}
          {education?.length > 0 && <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6366f1", marginBottom: 14, fontWeight: 700 }}>Education</h2>
            {education.map((ed, i) => (
              <div key={i} style={{ padding: "10px 14px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0", marginBottom: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 12 }}>{ed.degree}</div>
                <div style={{ fontSize: 11, color: "#64748b" }}>{ed.institution} · {ed.startDate}–{ed.endDate}</div>
              </div>
            ))}
          </div>}
          {projects?.length > 0 && <div>
            <h2 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#6366f1", marginBottom: 14, fontWeight: 700 }}>Projects</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {projects.map((pr, i) => (
                <div key={i} style={{ padding: "12px", background: "#f8f7ff", borderRadius: 8, border: "1px solid #ede9fe" }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#1e1b4b" }}>{pr.name}</div>
                  {pr.description && <p style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>{pr.description}</p>}
                </div>
              ))}
            </div>
          </div>}
        </main>
      </div>
    </div>
  );
}

// 10. BOLD — Strong typography, high contrast
function BoldTemplate({ data }) {
  const { personalInfo: p, experience = [], education = [], skills = [], projects = [] } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "#fff" }}>
      <div style={{ padding: "48px 56px 36px", borderBottom: "4px solid #111827" }}>
        <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, color: "#111827" }}>
          {(p.fullName || "Your Name").split(" ")[0]}<br />
          <span style={{ color: "#e5e7eb" }}>{(p.fullName || "Your Name").split(" ").slice(1).join(" ")}</span>
        </h1>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 24 }}>
          <p style={{ fontSize: 18, color: "#6b7280", fontWeight: 500 }}>{p.jobTitle}</p>
          <div style={{ fontSize: 12, color: "#9ca3af", textAlign: "right", lineHeight: 1.8 }}>
            {p.email && <div>{p.email}</div>}{p.phone && <div>{p.phone}</div>}{p.location && <div>{p.location}</div>}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px" }}>
        <div style={{ padding: "36px 48px 36px 56px", borderRight: "1px solid #f3f4f6" }}>
          {p.summary && <p style={{ fontSize: 14, lineHeight: 1.8, color: "#4b5563", marginBottom: 32, paddingBottom: 28, borderBottom: "1px solid #f3f4f6" }}>{p.summary}</p>}
          {experience?.length > 0 && <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 20, color: "#111827" }}>Experience</h2>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 24 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{e.position}</h3>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>{e.company} · {e.startDate}–{e.current ? "Present" : e.endDate}</div>
                {e.points?.map((pt, j) => <div key={j} style={{ fontSize: 13, color: "#4b5563", marginTop: 5, paddingLeft: 14, borderLeft: "2px solid #e5e7eb" }}>{pt}</div>)}
              </div>
            ))}
          </div>}
        </div>
        <aside style={{ padding: "36px 36px 36px 32px", background: "#f9fafb" }}>
          {skills?.length > 0 && <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, letterSpacing: "-0.01em", marginBottom: 16, color: "#111827" }}>Skills</h2>
            {skills.map((s, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                {s.category && <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#9ca3af", marginBottom: 6 }}>{s.category}</div>}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                  {s.items?.map((it, j) => <span key={j} style={{ background: "#111827", color: "#fff", fontSize: 10, padding: "3px 8px", borderRadius: 4, fontWeight: 600 }}>{it}</span>)}
                </div>
              </div>
            ))}
          </div>}
          {education?.length > 0 && <div style={{ marginBottom: 28 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: "#111827" }}>Education</h2>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{ed.degree}</div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>{ed.institution}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{ed.startDate}–{ed.endDate}</div>
              </div>
            ))}
          </div>}
          {projects?.length > 0 && <div>
            <h2 style={{ fontSize: 14, fontWeight: 800, marginBottom: 14, color: "#111827" }}>Projects</h2>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 12, padding: "10px 12px", background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{pr.name}</div>
                {pr.description && <p style={{ fontSize: 11, color: "#6b7280", marginTop: 3 }}>{pr.description}</p>}
              </div>
            ))}
          </div>}
        </aside>
      </div>
    </div>
  );
}

function TplSection({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a", whiteSpace: "nowrap" }}>{title}</h2>
        <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
      </div>
      {children}
    </div>
  );
}

function TplSide({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a", marginBottom: 10, borderBottom: "1px solid #0f172a", paddingBottom: 4 }}>{title}</h2>
      {children}
    </div>
  );
}

const TEMPLATE_LIST = [
  { id: "modern", label: "Modern", icon: "✦", desc: "Dark header, two-column" },
  { id: "minimal", label: "Minimal", icon: "▫", desc: "Clean single column" },
  { id: "professional", label: "Professional", icon: "⚙", desc: "Blue sidebar layout" },
  { id: "creative", label: "Creative", icon: "🎨", desc: "Gradient, bold style" },
  { id: "classic", label: "Classic", icon: "📜", desc: "Serif, traditional" },
  { id: "elegant", label: "Elegant", icon: "✶", desc: "Gold accent, luxury" },
  { id: "tech", label: "Tech", icon: "⌨", desc: "Dark, dev-focused" },
  { id: "compact", label: "Compact", icon: "⊞", desc: "Dense, info-rich" },
  { id: "infographic", label: "Infographic", icon: "◈", desc: "Visual skill bars" },
  { id: "bold", label: "Bold", icon: "◼", desc: "Strong typography" },
];

const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  minimal: MinimalTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  classic: ClassicTemplate,
  elegant: ElegantTemplate,
  tech: TechTemplate,
  compact: CompactTemplate,
  infographic: InfographicTemplate,
  bold: BoldTemplate,
};

// ═══════════════════════════════════════════════════════════
// AUTH
// ═══════════════════════════════════════════════════════════
function AuthScreen({ onAuth, theme, setTheme }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.email || !form.password) return ToastCtx.notify("Please complete all inputs", "error");
    setLoading(true);
    setTimeout(() => {
      const user = { id: Date.now(), name: form.name || form.email.split("@")[0], email: form.email };
      storage.set("auth_token", "demo_jwt");
      storage.set("auth_user", user);
      ToastCtx.notify(mode === "register" ? "Welcome aboard! 🎉" : "Welcome back!");
      onAuth(user);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="app-shell" style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 24, minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: 24, right: 24 }}><ThemeSwitcher theme={theme} setTheme={setTheme} compact /></div>
      <div style={{ width: "100%", maxWidth: 420 }} className="fadeUp">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 32, background: "linear-gradient(135deg, var(--accent-light), var(--purple))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 800 }}>✦</span>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 8 }}>ResumeAI</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 6 }}>Build stunning resumes with 10 professional templates.</p>
        </div>
        <Card>
          <div style={{ display: "flex", marginBottom: 24, background: "var(--card-2)", borderRadius: 10, padding: 4, border: "1px solid var(--border)" }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: 10, borderRadius: 8, border: "none", cursor: "pointer",
                background: mode === m ? "var(--card)" : "transparent",
                color: mode === m ? "var(--text)" : "var(--text-muted)",
                fontWeight: 600, fontSize: 13, transition: "all 0.2s"
              }}>{m === "login" ? "Sign In" : "Register"}</button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {mode === "register" && <Field label="Full Name"><input placeholder="Alex Mercer" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} /></Field>}
            <Field label="Email"><input type="email" placeholder="alex@domain.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></Field>
            <Field label="Password"><input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))} onKeyDown={e => e.key === "Enter" && handleSubmit()} /></Field>
            <Btn onClick={handleSubmit} loading={loading} size="lg" style={{ width: "100%", justifyContent: "center", marginTop: 6 }}>
              {mode === "login" ? "Continue" : "Create Account"}
            </Btn>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════════════════════
function Dashboard({ user, onEdit, onNew, onLogout, theme, setTheme }) {
  const [resumes, setResumes] = useState(() => storage.get("resumes", []));
  const [deleting, setDeleting] = useState(null);

  const deleteResume = (id) => {
    const updated = resumes.filter(r => r.id !== id);
    setResumes(updated);
    storage.set("resumes", updated);
    ToastCtx.notify("Resume deleted");
    setDeleting(null);
  };

  return (
    <div className="app-shell" style={{ padding: "40px 24px" }}>
      <div style={{ maxWidth: 1140, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>✦ Workspace</h1>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Hello, {user.name} — manage your resumes.</p>
          </div>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <ThemeSwitcher theme={theme} setTheme={setTheme} compact />
            <Btn onClick={onNew} variant="ai">✦ New Resume</Btn>
            <Btn onClick={onLogout} variant="ghost" size="sm">Log Out</Btn>
          </div>
        </div>

        {resumes.length === 0 ? (
          <Card style={{ textAlign: "center", padding: "80px 40px", borderStyle: "dashed", borderWidth: 2 }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>📄</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No resumes yet</h3>
            <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 24 }}>Create your first resume with AI assistance and 10 beautiful templates.</p>
            <Btn onClick={onNew} variant="ai">Create Resume</Btn>
          </Card>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {resumes.map(resume => {
              const tpl = TEMPLATE_LIST.find(t => t.id === resume.template) || TEMPLATE_LIST[0];
              return (
                <Card key={resume.id} style={{ position: "relative" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>{resume.title}</h3>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontSize: 16 }}>{tpl.icon}</span>
                        <Badge color="purple">{tpl.label}</Badge>
                      </div>
      
                    </div>
                    <span style={{ fontSize: 28 }}>📄</span>
                  </div>
                  <p style={{ fontSize: 12, color: "var(--text-dim)", marginBottom: 18 }}>Edited {new Date(resume.updatedAt).toLocaleDateString()}</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    <Btn onClick={() => onEdit(resume)} variant="secondary" size="sm" style={{ flex: 1, justifyContent: "center" }}>Edit</Btn>
                    <Btn onClick={() => setDeleting(resume.id)} variant="danger" size="sm">✕</Btn>
                  </div>
                  {deleting === resume.id && (
                    <div style={{ position: "absolute", inset: 0, background: "var(--card)", borderRadius: 16, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, padding: 20, border: "1px solid var(--danger)" }}>
                      <p style={{ fontWeight: 600 }}>Delete this resume?</p>
                      <div style={{ display: "flex", gap: 10 }}>
                        <Btn onClick={() => deleteResume(resume.id)} variant="danger" size="sm">Delete</Btn>
                        <Btn onClick={() => setDeleting(null)} variant="secondary" size="sm">Cancel</Btn>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// RESUME BUILDER
// ═══════════════════════════════════════════════════════════
function ResumeBuilder({ resume: initResume, onSave, onExit, theme, setTheme }) {
  const [resume, setResume] = useState(initResume || emptyResume());
  const [activeSection, setActiveSection] = useState("personal");
  const [saving, setSaving] = useState(false);
  const autoRef = useRef(null);

  const update = useCallback((path, value) => {
    setResume(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      next.updatedAt = new Date().toISOString();
      return next;
    });
  }, []);

  useEffect(() => {
    clearTimeout(autoRef.current);
    autoRef.current = setTimeout(() => {
      const resumes = storage.get("resumes", []);
      const idx = resumes.findIndex(r => r.id === resume.id);
      if (idx >= 0) resumes[idx] = resume; else resumes.unshift(resume);
      storage.set("resumes", resumes);
      setSaving(true);
      setTimeout(() => setSaving(false), 1000);
    }, 1500);
    return () => clearTimeout(autoRef.current);
  }, [resume]);

  const SECTIONS = [
    { id: "personal", label: "Personal Info", icon: "👤" },
    { id: "summary", label: "Summary", icon: "✍" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "certifications", label: "Certifications", icon: "🏆" },
    { id: "preview", label: "Preview & Export", icon: "👁" },
  ];

  return (
    <div className="app-shell" style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside style={{ width: 240, background: "var(--card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: "-0.02em" }}>✦ ResumeAI</div>
          <input value={resume.title} onChange={e => update("title", e.target.value)} style={{ marginTop: 10, fontSize: 13, height: 36 }} placeholder="Resume title" />
        </div>
        <nav style={{ flex: 1, overflow: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
              width: "100%", padding: "10px 12px", borderRadius: 8, border: "none",
              background: activeSection === s.id ? "var(--card-2)" : "transparent",
              color: activeSection === s.id ? "var(--text)" : "var(--text-muted)",
              cursor: "pointer", display: "flex", alignItems: "center", gap: 10,
              fontSize: 13, fontWeight: activeSection === s.id ? 600 : 400, transition: "all 0.15s", textAlign: "left"
            }}>
              <span>{s.icon}</span> {s.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: 14, borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
          <ThemeSwitcher theme={theme} setTheme={setTheme} />
          {saving && <p style={{ fontSize: 11, color: "var(--success)", textAlign: "center" }}>✓ Autosaved</p>}
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={() => { onSave?.(resume); ToastCtx.notify("Saved!"); }} size="sm" style={{ justifyContent: "center", flex: 1 }}>Save & Exit</Btn>
            <Btn onClick={onExit} size="sm" variant="ghost" style={{ justifyContent: "center", flex: 1 }}>Exit</Btn>
          </div>
        </div>
      </aside>

      <main style={{ flex: 1, overflow: "auto", padding: "36px", background: "rgba(0,0,0,0.02)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }} className="fadeUp">
          {activeSection === "personal" && <PersonalSection resume={resume} update={update} />}
          {activeSection === "summary" && <SummarySection resume={resume} update={update} />}
          {activeSection === "experience" && <ExperienceSection resume={resume} update={update} />}
          {activeSection === "education" && <EducationSection resume={resume} update={update} />}
          {activeSection === "skills" && <SkillsSection resume={resume} update={update} />}
          {activeSection === "projects" && <ProjectsSection resume={resume} update={update} />}
          {activeSection === "certifications" && <CertificationsSection resume={resume} update={update} />}
          {activeSection === "preview" && <PreviewSection resume={resume} update={update} />}
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ icon, title, desc }) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 20 }}>
      <div style={{ fontSize: 22, marginTop: 2 }}>{icon}</div>
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.01em" }}>{title}</h2>
        {desc && <p style={{ color: "var(--text-muted)", fontSize: 13, marginTop: 3 }}>{desc}</p>}
      </div>
    </div>
  );
}

function PersonalSection({ resume, update }) {
  const p = resume.personalInfo;
  const f = (k) => ({ value: p[k] || "", onChange: e => update(`personalInfo.${k}`, e.target.value) });
  return (
    <div>
      <SectionHeader icon="👤" title="Personal Info" desc="Your contact details and identity." />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
          <Field label="Full Name"><input placeholder="John Doe" {...f("fullName")} /></Field>
          <Field label="Job Title"><input placeholder="Senior Full-Stack Engineer" {...f("jobTitle")} /></Field>
          <Field label="Email"><input type="email" placeholder="john@domain.com" {...f("email")} /></Field>
          <Field label="Phone"><input placeholder="+91 99999 99999" {...f("phone")} /></Field>
          <Field label="Location"><input placeholder="Ahmedabad, India" {...f("location")} /></Field>
          <Field label="Website"><input placeholder="johndoe.dev" {...f("website")} /></Field>
          <Field label="LinkedIn"><input placeholder="linkedin.com/in/user" {...f("linkedin")} /></Field>
          <Field label="GitHub"><input placeholder="github.com/user" {...f("github")} /></Field>
        </div>
      </Card>
    </div>
  );
}

function SummarySection({ resume, update }) {
  const [aiLoading, setAiLoading] = useState(false);

  const generate = async () => {
    setAiLoading(true);
    try {
      const { personalInfo: p, skills } = resume;
      const skillsList = skills?.flatMap(s => s.items || []).slice(0, 6).join(", ");
      const prompt = `Write a concise 3-sentence professional summary for ${p?.fullName || "a developer"} (${p?.jobTitle || "Engineer"}). Skills: ${skillsList || "software development"}. Be direct and impactful. No intro phrases.`;
      const result = await askClaude(prompt);
      update("personalInfo.summary", result.trim());
      ToastCtx.notify("Summary generated!");
    } catch {
      ToastCtx.notify("AI error", "error");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionHeader icon="✍" title="Professional Summary" desc="Your elevator pitch." />
        <Btn onClick={generate} loading={aiLoading} variant="ai" size="sm">✦ AI Generate</Btn>
      </div>
      <Card>
        <textarea placeholder="A results-driven engineer with expertise in..." value={resume.personalInfo.summary || ""} onChange={e => update("personalInfo.summary", e.target.value)} style={{ minHeight: 140 }} />
      </Card>
    </div>
  );
}

function ExperienceSection({ resume, update }) {
  const items = resume.experience || [];
  const add = () => update("experience", [...items, { company: "", position: "", location: "", startDate: "", endDate: "", current: false, points: [""] }]);
  const remove = (i) => update("experience", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("experience", arr); };
  const setPoint = (i, j, v) => { const arr = [...items]; arr[i].points[j] = v; update("experience", arr); };
  const addPoint = (i) => { const arr = [...items]; arr[i].points = [...(arr[i].points || []), ""]; update("experience", arr); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionHeader icon="💼" title="Work Experience" desc="Your professional history." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add Role</Btn>
      </div>
      {items.map((exp, i) => (
        <Card key={i} style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <h4 style={{ fontWeight: 700 }}>Experience #{i + 1}</h4>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Field label="Company"><input placeholder="Acme Corp" value={exp.company} onChange={e => set(i, "company", e.target.value)} /></Field>
            <Field label="Position"><input placeholder="Senior Developer" value={exp.position} onChange={e => set(i, "position", e.target.value)} /></Field>
            <Field label="Start Date"><input placeholder="Jan 2022" value={exp.startDate} onChange={e => set(i, "startDate", e.target.value)} /></Field>
            <Field label="End Date"><input placeholder="Present" value={exp.endDate} onChange={e => set(i, "endDate", e.target.value)} /></Field>
            <Field label="Location"><input placeholder="Ahmedabad, India" value={exp.location || ""} onChange={e => set(i, "location", e.target.value)} /></Field>
          </div>
          <div style={{ marginTop: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", display: "block", marginBottom: 8 }}>Bullet Points</label>
            {(exp.points || [""]).map((pt, j) => (
              <input key={j} placeholder={`Bullet ${j + 1}...`} value={pt} onChange={e => setPoint(i, j, e.target.value)} style={{ marginBottom: 8 }} />
            ))}
            <Btn onClick={() => addPoint(i)} variant="ghost" size="sm">+ Add Bullet</Btn>
          </div>
        </Card>
      ))}
      {items.length === 0 && <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", border: "1px dashed var(--border)", borderRadius: 16 }}>No experience added yet. Click "+ Add Role"</div>}
    </div>
  );
}

function EducationSection({ resume, update }) {
  const items = resume.education || [];
  const add = () => update("education", [...items, { institution: "", degree: "", startDate: "", endDate: "", gpa: "" }]);
  const remove = (i) => update("education", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("education", arr); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionHeader icon="🎓" title="Education" desc="Academic credentials." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add</Btn>
      </div>
      {items.map((ed, i) => (
        <Card key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <h4 style={{ fontWeight: 700 }}>Education #{i + 1}</h4>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
            <Field label="Institution"><input placeholder="Gujarat Technological University" value={ed.institution} onChange={e => set(i, "institution", e.target.value)} /></Field>
            <Field label="Degree"><input placeholder="B.E. Computer Science" value={ed.degree} onChange={e => set(i, "degree", e.target.value)} /></Field>
            <Field label="Start Year"><input placeholder="2020" value={ed.startDate} onChange={e => set(i, "startDate", e.target.value)} /></Field>
            <Field label="End Year"><input placeholder="2024" value={ed.endDate} onChange={e => set(i, "endDate", e.target.value)} /></Field>
            <Field label="GPA (optional)"><input placeholder="8.5" value={ed.gpa || ""} onChange={e => set(i, "gpa", e.target.value)} /></Field>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SkillsSection({ resume, update }) {
  const items = resume.skills || [];
  const add = () => update("skills", [...items, { category: "", items: [] }]);
  const remove = (i) => update("skills", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("skills", arr); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionHeader icon="⚡" title="Skills" desc="Technologies and competencies." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add Category</Btn>
      </div>
      {items.map((sk, i) => (
        <Card key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Category #{i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 14 }}>
            <input placeholder="e.g. Frontend" value={sk.category} onChange={e => set(i, "category", e.target.value)} />
            <input placeholder="React, Next.js, TailwindCSS (comma-separated)" value={sk.items?.join(", ")} onChange={e => set(i, "items", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProjectsSection({ resume, update }) {
  const items = resume.projects || [];
  const add = () => update("projects", [...items, { name: "", description: "", techStack: [], liveUrl: "", githubUrl: "" }]);
  const remove = (i) => update("projects", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("projects", arr); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionHeader icon="🚀" title="Projects" desc="Notable work and side projects." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add Project</Btn>
      </div>
      {items.map((pr, i) => (
        <Card key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <h4 style={{ fontWeight: 700 }}>Project #{i + 1}</h4>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Project Name"><input placeholder="My Awesome App" value={pr.name} onChange={e => set(i, "name", e.target.value)} /></Field>
            <Field label="Description"><textarea placeholder="What it does, your role, impact..." value={pr.description} onChange={e => set(i, "description", e.target.value)} style={{ minHeight: 80 }} /></Field>
            <Field label="Tech Stack"><input placeholder="React, Node.js, MongoDB" value={pr.techStack?.join(", ")} onChange={e => set(i, "techStack", e.target.value.split(",").map(x => x.trim()).filter(Boolean))} /></Field>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CertificationsSection({ resume, update }) {
  const items = resume.certifications || [];
  const add = () => update("certifications", [...items, { name: "", issuer: "", date: "" }]);
  const remove = (i) => update("certifications", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("certifications", arr); };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SectionHeader icon="🏆" title="Certifications" desc="Professional certifications." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add</Btn>
      </div>
      {items.map((c, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontWeight: 600 }}>Cert #{i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <input placeholder="AWS Solutions Architect" value={c.name} onChange={e => set(i, "name", e.target.value)} />
            <input placeholder="Amazon Web Services" value={c.issuer} onChange={e => set(i, "issuer", e.target.value)} />
            <input placeholder="Dec 2024" value={c.date} onChange={e => set(i, "date", e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function PreviewSection({ resume, update }) {
  const handleDownload = async () => {
    try {
      const el = document.getElementById("resume-preview");
      if (!window.html2pdf) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js";
          s.onload = res; s.onerror = rej; document.head.appendChild(s);
        });
      }
      window.html2pdf().set({ margin: 0, filename: "resume.pdf", image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: "in", format: "a4", orientation: "portrait" } }).from(el).save();
    } catch {
      ToastCtx.notify("PDF export error", "error");
    }
  };

  const SelectedTemplate = TEMPLATE_COMPONENTS[resume.template] || ModernTemplate;

  return (
    <div>
      <SectionHeader icon="👁" title="Preview & Export" desc="Choose a template and export your resume." />
      
      {/* Template Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 8, marginBottom: 24 }}>
        {TEMPLATE_LIST.map(t => (
          <button key={t.id} onClick={() => update("template", t.id)} style={{
            padding: "12px 8px", borderRadius: 12, border: `2px solid ${resume.template === t.id ? "var(--accent-light)" : "var(--border)"}`,
            background: resume.template === t.id ? "color-mix(in srgb, var(--accent) 10%, var(--card))" : "var(--card)",
            cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
            transition: "all 0.2s", transform: resume.template === t.id ? "translateY(-2px)" : "none",
            boxShadow: resume.template === t.id ? "0 4px 12px rgba(0,0,0,0.15)" : "none"
          }}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: resume.template === t.id ? "var(--accent-light)" : "var(--text-muted)" }}>{t.label}</span>
            <span style={{ fontSize: 10, color: "var(--text-dim)", textAlign: "center" }}>{t.desc}</span>
          </button>
        ))}
      </div>

      {/* Export buttons */}
      <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
        <Btn onClick={() => window.print()} variant="ai">🖨 Print</Btn>
        <Btn onClick={handleDownload} variant="secondary">⬇ Export PDF</Btn>
      </div>

      {/* Preview */}
      <div style={{ border: "1px solid var(--border)", borderRadius: 16, overflow: "hidden", background: "#e2e8f0", padding: "32px 0" }}>
        <div style={{ transform: "scale(0.75)", transformOrigin: "top center", width: "100%", margin: "0 auto", minHeight: 400 }}>
          <SelectedTemplate data={resume} />
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [user, setUser] = useState(() => storage.get("auth_user", null));
  const [view, setView] = useState("dashboard");
  const [editingResume, setEditingResume] = useState(null);
  const [theme, setThemeState] = useState(() => storage.get("app_theme", "midnight"));

  const setTheme = (t) => { setThemeState(t); storage.set("app_theme", t); };

  return (
    <div style={themeStyle(theme)}>
      <style>{css}</style>
      <Toast />
      {!user && <AuthScreen onAuth={setUser} theme={theme} setTheme={setTheme} />}
      {user && view === "dashboard" && (
        <Dashboard
          user={user}
          onEdit={(r) => { setEditingResume(r); setView("builder"); }}
          onNew={() => { setEditingResume(emptyResume()); setView("builder"); }}
          onLogout={() => { storage.set("auth_user", null); setUser(null); }}
          theme={theme} setTheme={setTheme}
        />
      )}
      {user && view === "builder" && (
        <ResumeBuilder
          resume={editingResume}
          onSave={() => setView("dashboard")}
          onExit={() => setView("dashboard")}
          theme={theme} setTheme={setTheme}
        />
      )}
    </div>
  );
}