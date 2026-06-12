import React from 'react';

export default function CreativeTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  return (
    <div id="resume-preview" style={{ display: "flex", flexDirection: "column", minHeight: "297mm", width: "210mm", margin: "0 auto", background: "#fff", color: "#1e293b", fontFamily: "'Inter', sans-serif" }}>
      {/* Top Header with a Gradient */}
      <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)", color: "#ffffff", padding: "40px 48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.02em" }}>{p.fullName || "Your Name"}</h1>
            <p style={{ color: "#c084fc", fontSize: 14, marginTop: 6, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.jobTitle || "Software Engineer"}</p>
          </div>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255, 255, 255, 0.15)", border: "1px solid rgba(255, 255, 255, 0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>
            {(p.fullName || "?").charAt(0)}
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px", fontSize: 11.5, color: "#e9d5ff", marginTop: 20, borderTop: "1px solid rgba(255, 255, 255, 0.2)", paddingTop: 16 }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📱 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.github && <span>⌥ {p.github}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 36, padding: "40px 48px", flex: 1 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {p.summary && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 12 }}>About Me</h3>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: "#334155" }}>{p.summary}</p>
            </div>
          )}

          {experience?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 16 }}>Experience</h3>
              {experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 18, borderLeft: "2px solid #ddd6fe", paddingLeft: 16, marginLeft: 2 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                    <h4 style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{e.position}</h4>
                    <span style={{ fontSize: 10.5, color: "#6b7280" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
                  </div>
                  <div style={{ color: "#7c3aed", fontWeight: 600, fontSize: 11.5, marginBottom: 4 }}>{e.company}{e.location && ` • ${e.location}`}</div>
                  {e.points?.filter(Boolean).length > 0 ? (
                    e.points.filter(Boolean).map((pt, j) => (
                      <p key={j} style={{ fontSize: 11.5, color: "#4b5563", marginTop: 3 }}>• {pt}</p>
                    ))
                  ) : (
                    e.description && <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 3 }}>{e.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {projects?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 16 }}>Projects</h3>
              {projects.map((pr, i) => (
                <div key={i} style={{ marginBottom: 16, padding: "14px", background: "#f5f3ff", borderRadius: 10, border: "1px solid #ddd6fe" }}>
                  <h4 style={{ fontWeight: 700, fontSize: 13, color: "#1e293b" }}>{pr.name}</h4>
                  {pr.techStack?.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
                      {pr.techStack.map((t, j) => (
                        <span key={j} style={{ background: "#ede9fe", color: "#6d28d9", fontSize: 9.5, padding: "2px 6px", borderRadius: 4, fontWeight: 500 }}>{t}</span>
                      ))}
                    </div>
                  )}
                  {pr.description && <p style={{ fontSize: 11.5, color: "#4b5563", marginTop: 8, lineHeight: 1.5 }}>{pr.description}</p>}
                  {(pr.githubUrl || pr.liveUrl) && (
                    <div style={{ fontSize: 10.5, color: "#6d28d9", marginTop: 8, display: "flex", gap: 12 }}>
                      {pr.githubUrl && <span>GitHub: {pr.githubUrl}</span>}
                      {pr.liveUrl && <span>Live: {pr.liveUrl}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {achievements?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 16 }}>Achievements</h3>
              <ul style={{ paddingLeft: 16, fontSize: 12.5, color: "#334155", lineHeight: 1.6 }}>
                {achievements.map((ach, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{ach}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {skills?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 14 }}>Skills</h3>
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  {s.category && <div style={{ fontSize: 10.5, fontWeight: 700, color: "#1e293b", marginBottom: 6 }}>{s.category}</div>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                    {s.items?.map((it, j) => (
                      <span key={j} style={{ background: "#f3f4f6", color: "#1f2937", fontSize: 11, padding: "3px 9px", borderRadius: 20 }}>{it}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {education?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 14 }}>Education</h3>
              {education.map((ed, i) => (
                <div key={i} style={{ marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#1e293b" }}>{ed.degree} {ed.field && `in ${ed.field}`}</div>
                  <div style={{ fontSize: 11.5, color: "#4b5563", marginTop: 2 }}>{ed.institution}</div>
                  <div style={{ fontSize: 10.5, color: "#6b7280" }}>{ed.startDate} – {ed.endDate} {ed.gpa && `• GPA: ${ed.gpa}`}</div>
                </div>
              ))}
            </div>
          )}

          {certifications?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 14 }}>Certifications</h3>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 10, fontSize: 11.5, color: "#4b5563" }}>
                  <strong>{c.name}</strong>
                  <div style={{ color: "#6b7280" }}>{c.issuer} {c.date && `(${c.date})`}</div>
                </div>
              ))}
            </div>
          )}

          {languages?.length > 0 && (
            <div>
              <h3 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#4f46e5", letterSpacing: "0.08em", marginBottom: 14 }}>Languages</h3>
              {languages.map((l, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 11.5, color: "#4b5563" }}>
                  <strong>{l.language}</strong> {l.proficiency && <span style={{ color: "#6b7280" }}>({l.proficiency})</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
