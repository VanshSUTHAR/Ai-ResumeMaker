import React from 'react';

export default function ProfessionalTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  return (
    <div id="resume-preview" style={{ display: "grid", gridTemplateColumns: "220px 1fr", minHeight: "297mm", width: "210mm", margin: "0 auto", background: "#fff", color: "#1e293b", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ background: "#f8fafc", padding: "40px 24px", borderRight: "1px solid #e2e8f0", display: "flex", flexDirection: "column", gap: 28 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", lineHeight: 1.2 }}>{p.fullName || "Your Name"}</h1>
          <p style={{ color: "#4f46e5", fontSize: 13, fontWeight: 600, marginTop: 6, letterSpacing: "0.02em" }}>{p.jobTitle || "Software Engineer"}</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 11.5, color: "#475569", wordBreak: "break-all" }}>
          <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: 6 }}>Contact</h3>
          {p.email && <div>✉ {p.email}</div>}
          {p.phone && <div>📞 {p.phone}</div>}
          {p.location && <div>📍 {p.location}</div>}
          {p.linkedin && <div>in {p.linkedin}</div>}
          {p.github && <div>⌥ {p.github}</div>}
          {p.website && <div>🌐 {p.website}</div>}
        </div>

        {skills?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: 6 }}>Skills</h3>
            {skills.map((s, i) => (
              <div key={i} style={{ fontSize: 11.5 }}>
                {s.category && <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{s.category}</div>}
                <div style={{ color: "#475569", lineHeight: 1.4 }}>{s.items?.join(", ")}</div>
              </div>
            ))}
          </div>
        )}
        {languages?.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "1px solid #e2e8f0", paddingBottom: 6 }}>Languages</h3>
            {languages.map((l, i) => (
              <div key={i} style={{ fontSize: 11.5, color: "#475569" }}>
                <strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main style={{ padding: "40px 36px", display: "flex", flexDirection: "column", gap: 28 }}>
        {p.summary && (
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: 6, marginBottom: 10 }}>Summary</h2>
            <p style={{ color: "#334155", fontSize: 12.5, lineHeight: 1.6 }}>{p.summary}</p>
          </div>
        )}

        {experience?.length > 0 && (
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: 6, marginBottom: 16 }}>Experience</h2>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4 style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{e.position}</h4>
                  <span style={{ fontSize: 11, color: "#64748b" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
                </div>
                {e.points?.filter(Boolean).length > 0 ? (
                  e.points.filter(Boolean).map((pt, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 11.5, color: "#334155" }}>
                      <span>•</span>
                      <span>{pt}</span>
                    </div>
                  ))
                ) : (
                  e.description && <p style={{ fontSize: 11.5, color: "#334155", marginTop: 4 }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {projects?.length > 0 && (
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: 6, marginBottom: 16 }}>Projects</h2>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <h4 style={{ fontWeight: 700, fontSize: 13.5, color: "#0f172a" }}>{pr.name}</h4>
                {pr.techStack?.length > 0 && <div style={{ fontSize: 11, color: "#4f46e5", marginTop: 2 }}><strong>Stack:</strong> {pr.techStack.join(", ")}</div>}
                {pr.description && <p style={{ fontSize: 11.5, color: "#475569", marginTop: 4 }}>{pr.description}</p>}
                {(pr.githubUrl || pr.liveUrl) && (
                  <div style={{ fontSize: 11, marginTop: 4, display: "flex", gap: 12 }}>
                    {pr.githubUrl && <span style={{ color: "#4f46e5" }}>GitHub: {pr.githubUrl}</span>}
                    {pr.liveUrl && <span style={{ color: "#4f46e5" }}>Live: {pr.liveUrl}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {education?.length > 0 && (
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: 6, marginBottom: 16 }}>Education</h2>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 12, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#0f172a" }}>{ed.degree} {ed.field && `in ${ed.field}`}</div>
                  <div style={{ color: "#475569", marginTop: 2 }}>{ed.institution} {ed.gpa && `• GPA: ${ed.gpa}`}</div>
                </div>
                <div style={{ color: "#64748b", fontStyle: "italic", fontSize: 11 }}>{ed.startDate} – {ed.endDate}</div>
              </div>
            ))}
          </div>
        )}

        {certifications?.length > 0 && (
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: 6, marginBottom: 12 }}>Certifications</h2>
            {certifications.map((c, i) => (
              <div key={i} style={{ fontSize: 11.5, color: "#334155", marginBottom: 6 }}>
                <strong>{c.name}</strong> – {c.issuer} {c.date && `(${c.date})`}
              </div>
            ))}
          </div>
        )}

        {achievements?.length > 0 && (
          <div>
            <h2 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "#0f172a", borderBottom: "2px solid #0f172a", paddingBottom: 6, marginBottom: 16 }}>Achievements</h2>
            <ul style={{ paddingLeft: 16, fontSize: 12, color: "#334155", lineHeight: 1.6 }}>
              {achievements.map((ach, i) => <li key={i} style={{ marginBottom: 4 }}>{ach}</li>)}
            </ul>
          </div>
        )}
      </main>
    </div>
  );
}
