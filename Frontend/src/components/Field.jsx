import React from 'react';

export default function Field({ label, children, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <label style={{ fontSize: 12, fontWeight: 600, color: "var(--text-2)", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {label}
        </label>
        {hint && <span style={{ fontSize: 11, color: "var(--text-3)" }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}
