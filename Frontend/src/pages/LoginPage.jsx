import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Btn from '../components/Btn';
import Field from '../components/Field';
import { toast } from '../components/Toast';

export default function LoginPage({ dark, setDark }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async () => {
    if (!form.email || !form.password || (mode === "register" && !form.name)) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back!");
      } else {
        await register(form.name, form.email, form.password);
        toast.success("Account created successfully!");
      }
      navigate('/', { replace: true });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Authentication failed. Check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap app-root">
      {/* Left panel */}
      <div className="login-side">
        {/* Decorative elements */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 300, height: 300, borderRadius: "50%", border: "1px solid rgba(200,169,110,0.2)" }} />
        <div style={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", border: "1px solid rgba(200,169,110,0.12)" }} />
        <div style={{ position: "absolute", bottom: 100, left: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(200,169,110,0.06)" }} />

        <div style={{ position: "relative", zIndex: 2 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 72 }}>
            <img src="/image.png" alt="AI Resume Maker Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain' }} />
            <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: "0.02em" }}>AI Resume Maker</span>
          </div>
          <h1 className="display" style={{ fontSize: 52, fontWeight: 300, lineHeight: 1.15, letterSpacing: "-0.02em", marginBottom: 20 }}>
            Your next<br />
            <em style={{ color: "#C8A96E" }}>best role</em><br />
            starts here.
          </h1>
          <p style={{ fontSize: 15, opacity: 0.6, lineHeight: 1.7, maxWidth: 380 }}>
            Build professional resumes from scratch or convert your existing PDF/DOCX resume — AI does the heavy lifting.
          </p>
        </div>

        {/* Footer stats */}
        <div style={{ display: "flex", gap: 40, position: "relative", zIndex: 2 }}>
          {[["7+", "Templates"], ["∞", "Sections"], ["AI", "Powered"]].map(([num, label]) => (
            <div key={label}>
              <div className="display" style={{ fontSize: 28, fontWeight: 400, color: "#C8A96E" }}>{num}</div>
              <div style={{ fontSize: 12, opacity: 0.5, marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="login-body">
        <div style={{ position: "absolute", top: 20, right: 24, display: 'flex', background: "var(--surface-2)", borderRadius: "8px", padding: "3px", border: "1px solid var(--border)" }}>
          <button className={`mode-toggle-btn ${!dark ? "on" : "off"}`} onClick={() => setDark(false)} style={{ border: 'none', background: !dark ? 'var(--surface)' : 'transparent', padding: '6px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer', color: !dark ? 'var(--text)' : 'var(--text-3)' }}>Light</button>
          <button className={`mode-toggle-btn ${dark ? "on" : "off"}`} onClick={() => setDark(true)} style={{ border: 'none', background: dark ? 'var(--surface)' : 'transparent', padding: '6px 12px', fontSize: 12, borderRadius: 6, cursor: 'pointer', color: dark ? 'var(--text)' : 'var(--text-3)' }}>Dark</button>
        </div>

        <div className="fadeUp">
          <h2 style={{ fontFamily: "'Fraunces', Georgia, serif", fontSize: 28, fontWeight: 400, marginBottom: 6, color: "var(--text)" }}>
            {mode === "login" ? "Sign in" : "Create account"}
          </h2>
          <p style={{ color: "var(--text-3)", fontSize: 13.5, marginBottom: 32 }}>
            {mode === "login" ? "Don't have an account? " : "Already have one? "}
            <button onClick={() => setMode(mode === "login" ? "register" : "login")} style={{ background: "none", border: "none", color: "var(--accent-2)", cursor: "pointer", fontWeight: 600, fontSize: 13.5 }}>
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {mode === "register" && (
              <Field label="Full Name">
                <input placeholder="Jane Doe" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} style={{ width: '100%' }} />
              </Field>
            )}
            <Field label="Email">
              <input type="email" placeholder="jane@company.com" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={{ width: '100%' }} />
            </Field>
            <Field label="Password">
              <input type="password" placeholder="••••••••" value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleSubmit()} style={{ width: '100%' }} />
            </Field>
            <Btn onClick={handleSubmit} loading={loading} size="lg" style={{ width: "100%", marginTop: 6 }}>
              {mode === "login" ? "Sign in" : "Create account"} →
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
