import React, { useState } from 'react';

export default function Btn({ children, onClick, variant = "primary", size = "md", disabled, style: sx, loading, type = "button" }) {
  const [hov, setHov] = useState(false);
  const base = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    borderRadius: "var(--radius)",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    whiteSpace: "nowrap",
    opacity: disabled ? 0.5 : 1,
    border: "1.5px solid transparent",
    letterSpacing: "0.01em",
  };
  const styles = {
    primary: { background: "var(--text)", color: "var(--bg)", borderColor: "var(--text)", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" },
    secondary: { background: "transparent", color: "var(--text)", borderColor: "var(--border)" },
    ghost: { background: "transparent", color: "var(--text-2)", borderColor: "transparent" },
    danger: { background: "var(--danger-light)", color: "var(--danger)", borderColor: "var(--danger)" },
    gold: { background: "var(--accent-2)", color: "#1A1916", borderColor: "var(--accent-2)", boxShadow: "0 2px 8px rgba(200,169,110,0.25)" },
  };
  const hover = {
    primary: { filter: "brightness(0.88)" },
    secondary: { background: "var(--surface-2)" },
    ghost: { background: "var(--surface-2)", color: "var(--text)" },
    danger: { filter: "brightness(0.95)" },
    gold: { filter: "brightness(0.94)", boxShadow: "0 4px 14px rgba(200,169,110,0.35)" },
  };
  const sizes = {
    sm: { padding: "7px 14px", fontSize: 12.5 },
    md: { padding: "9px 18px", fontSize: 13.5 },
    lg: { padding: "12px 24px", fontSize: 14.5 },
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{ ...base, ...(styles[variant] || styles.primary), ...(sizes[size] || sizes.md), ...(hov && !disabled ? (hover[variant] || {}) : {}), ...sx }}
    >
      {loading && <span className="spin-anim" style={{ fontSize: 12 }}>↻</span>}
      {children}
    </button>
  );
}
