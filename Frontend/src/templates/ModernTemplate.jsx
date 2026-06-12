import React from 'react';

export default function ModernTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  return (
    <div id="resume-preview" style={{ background: "#fff", color: "#1e293b", width: "210mm", minHeight: "297mm", margin: "0 auto", overflow: "hidden", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: "#0f172a", color: "#f8fafc", padding: "44px 48px" }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em" }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: "#38bdf8", fontSize: 15, fontWeight: 600, marginTop: 4, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.jobTitle || "Software Engineer"}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px 24px", fontSize: 12, color: "#94a3b8", marginTop: 18, borderTop: "1px solid #1e293b", paddingTop: 16 }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📱 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>in {p.linkedin}</span>}
          {p.github && <span>⌥ {p.github}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>
      <div style={{ padding: "44px 48px", display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 40 }}>
        <div>
          {p.summary && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a" }}>Profile</h2>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </div>
              <p style={{ color: "#334155", lineHeight: 1.7, fontSize: 13 }}>{p.summary}</p>
            </div>
          )}
          {experience?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a" }}>Experience</h2>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </div>
              {experience.map((e, i) => (
                <div key={i} style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{e.position}</h4>
                    <span style={{ fontSize: 11, color: "#64748b" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
                  </div>
                  <div style={{ color: "#4f46e5", fontWeight: 600, fontSize: 12, marginBottom: 6 }}>{e.company}{e.location && ` • ${e.location}`}</div>
                  {e.points?.filter(Boolean).length > 0 ? (
                    e.points.filter(Boolean).map((pt, j) => (
                      <div key={j} style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 12, color: "#334155" }}>
                        <span style={{ color: "#4f46e5" }}>•</span>
                        <span>{pt}</span>
                      </div>
                    ))
                  ) : (
                    e.description && <p style={{ fontSize: 12, color: "#334155", marginTop: 4, lineHeight: 1.5 }}>{e.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          {projects?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a" }}>Projects</h2>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </div>
              {projects.map((pr, i) => (
                <div key={i} style={{ marginBottom: 16 }}>
                  <h4 style={{ fontWeight: 700, fontSize: 14, color: "#0f172a" }}>{pr.name}</h4>
                  {pr.techStack?.length > 0 && <div style={{ fontSize: 11, color: "#4f46e5", marginTop: 2 }}><strong>Stack:</strong> {pr.techStack.join(", ")}</div>}
                  {pr.description && <p style={{ fontSize: 12, color: "#475569", marginTop: 4, lineHeight: 1.6 }}>{pr.description}</p>}
                  {(pr.githubUrl || pr.liveUrl) && (
                    <div style={{ fontSize: 11, marginTop: 4 }}>
                      {pr.githubUrl && <span style={{ marginRight: 10 }}>GitHub: {pr.githubUrl}</span>}
                      {pr.liveUrl && <span>Live: {pr.liveUrl}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {achievements?.length > 0 && (
            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <h2 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a" }}>Achievements</h2>
                <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              </div>
              <ul style={{ paddingLeft: 16, fontSize: 12.5, color: "#334155", lineHeight: 1.6 }}>
                {achievements.map((ach, i) => <li key={i}>{ach}</li>)}
              </ul>
            </div>
          )}
        </div>
        <div>
          {skills?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a", borderBottom: "1px solid #0f172a", paddingBottom: 4, marginBottom: 10 }}>Skills</h2>
              {skills.map((s, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  {s.category && <div style={{ fontWeight: 700, fontSize: 10, marginBottom: 6, textTransform: "uppercase", color: "#0f172a" }}>{s.category}</div>}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {s.items?.map((it, j) => (
                      <span key={j} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#334155", fontSize: 10, padding: "2px 7px", borderRadius: 4 }}>{it}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {education?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a", borderBottom: "1px solid #0f172a", paddingBottom: 4, marginBottom: 10 }}>Education</h2>
              {education.map((ed, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: "#0f172a" }}>{ed.degree}</div>
                  <div style={{ color: "#475569", fontSize: 12 }}>{ed.institution} {ed.field && `in ${ed.field}`}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{ed.startDate} – {ed.endDate} {ed.gpa && `• GPA: ${ed.gpa}`}</div>
                </div>
              ))}
            </div>
          )}
          {certifications?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a", borderBottom: "1px solid #0f172a", paddingBottom: 4, marginBottom: 10 }}>Certifications</h2>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: 8, fontSize: 11, color: "#334155" }}>
                  <strong>{c.name}</strong> - {c.issuer} {c.date && `(${c.date})`}
                </div>
              ))}
            </div>
          )}
          {languages?.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", color: "#0f172a", borderBottom: "1px solid #0f172a", paddingBottom: 4, marginBottom: 10 }}>Languages</h2>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: 11, color: "#334155", marginBottom: 4 }}>
                  <strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
