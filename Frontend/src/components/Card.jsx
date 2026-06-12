import React from 'react';

export default function Card({ children, style: sx, className = "" }) {
  return (
    <div
      className={className}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: 24,
        ...sx
      }}
    >
      {children}
    </div>
  );
}
