import React, { useState, useEffect } from 'react';

const ToastCtx = {
  listeners: [],
  notify(msg, type = "success") {
    this.listeners.forEach(fn => fn({ msg, type, id: Date.now() }));
  }
};

export const toast = {
  success: (msg) => ToastCtx.notify(msg, 'success'),
  error: (msg) => ToastCtx.notify(msg, 'error'),
  info: (msg) => ToastCtx.notify(msg, 'info'),
};

export default function Toast() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleAdd = (t) => {
      setToasts((prev) => [...prev, t]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((x) => x.id !== t.id));
      }, 3500);
    };
    
    ToastCtx.listeners.push(handleAdd);
    return () => {
      ToastCtx.listeners = ToastCtx.listeners.filter((l) => l !== handleAdd);
    };
  }, []);

  const colors = {
    success: ["#EDFAF3", "#27AE60", "#27AE60"],
    error: ["#FEF0EE", "#C0392B", "#C0392B"],
    info: ["#F0F4FF", "#2563EB", "#2563EB"]
  };

  return (
    <div className="toast-container" style={{ position: "fixed", bottom: "28px", right: "28px", zIndex: 9999, display: "flex", flexDirection: "column", gap: "10px" }}>
      {toasts.map((t) => {
        const [bg, fg, bd] = colors[t.type] || colors.success;
        return (
          <div
            key={t.id}
            className="toast-item"
            style={{
              padding: "13px 20px",
              borderRadius: "var(--radius)",
              fontSize: "13.5px",
              fontWeight: 500,
              boxShadow: "var(--shadow-lg)",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: bg,
              color: fg,
              borderLeft: `3px solid ${bd}`,
              maxWidth: "360px",
              animation: "fadeUp 0.3s ease",
              backdropFilter: "blur(12px)",
            }}
          >
            <span style={{ fontSize: 15 }}>
              {t.type === "error" ? "✕" : t.type === "info" ? "→" : "✓"}
            </span>
            {t.msg}
          </div>
        );
      })}
    </div>
  );
}
