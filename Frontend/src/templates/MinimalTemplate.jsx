import React from 'react';

export default function MinimalTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  return (
    <div id="resume-preview" style={{ padding: "60px", fontFamily: "'Inter', sans-serif", color: "#1c1917", width: "210mm", minHeight: "297mm", margin: "0 auto", background: "#fff" }}>
      <header style={{ borderBottom: "1px solid #e7e5e4", paddingBottom: 24, marginBottom: 32 }}>
        <h1 style={{ fontSize: 34, fontWeight: 300, letterSpacing: "-0.03em" }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: "#78716c", fontSize: 14, marginTop: 4 }}>{p.jobTitle || "Software Engineer"}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 12, color: "#78716c", marginTop: 12 }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>LinkedIn: {p.linkedin}</span>}
          {p.github && <span>GitHub: {p.github}</span>}
          {p.website && <span>Website: {p.website}</span>}
        </div>
      </header>

      {p.summary && <p style={{ fontSize: 13, lineHeight: 1.8, color: "#44403c", marginBottom: 32 }}>{p.summary}</p>}

      {experience?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 16 }}>Experience</h3>
          {experience.map((e, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: "#78716c", paddingTop: 2 }}>{e.startDate} — {e.current ? "Present" : e.endDate}</span>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: 14 }}>{e.position} <span style={{ color: "#a8a29e", fontWeight: 400 }}>@ {e.company}</span></h4>
                {e.points?.filter(Boolean).length > 0 ? (
                  e.points.filter(Boolean).map((pt, j) => (
                    <p key={j} style={{ fontSize: 12, color: "#44403c", marginTop: 5 }}>— {pt}</p>
                  ))
                ) : (
                  e.description && <p style={{ fontSize: 12, color: "#44403c", marginTop: 5 }}>{e.description}</p>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {projects?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 16 }}>Projects</h3>
          {projects.map((pr, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 20 }}>
              <span style={{ fontSize: 11, color: "#78716c", paddingTop: 2 }}>{pr.techStack?.join(", ") || "Stack"}</span>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: 14 }}>{pr.name}</h4>
                {pr.description && <p style={{ fontSize: 12, color: "#44403c", marginTop: 5 }}>{pr.description}</p>}
                {(pr.githubUrl || pr.liveUrl) && (
                  <div style={{ fontSize: 11, color: "#78716c", marginTop: 5, display: "flex", gap: 12 }}>
                    {pr.githubUrl && <span>GitHub: {pr.githubUrl}</span>}
                    {pr.liveUrl && <span>Live: {pr.liveUrl}</span>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>
      )}

      {skills?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 14 }}>Skills</h3>
          {skills.map((s, i) => (
            <div key={i} style={{ marginBottom: 10, fontSize: 12 }}>
              {s.category && <span style={{ fontSize: 11, fontWeight: 600, color: "#57534e", marginRight: 12 }}>{s.category}:</span>}
              <span style={{ color: "#44403c" }}>{s.items?.join(", ")}</span>
            </div>
          ))}
        </section>
      )}

      {education?.length > 0 && (
        <section style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 16 }}>Education</h3>
          {education.map((ed, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 16 }}>
              <span style={{ fontSize: 11, color: "#78716c" }}>{ed.startDate} — {ed.endDate}</span>
              <div>
                <h4 style={{ fontWeight: 600, fontSize: 14 }}>{ed.degree} {ed.field && `in ${ed.field}`}</h4>
                <p style={{ fontSize: 12, color: "#57534e", marginTop: 4 }}>{ed.institution} {ed.gpa && `| GPA: ${ed.gpa}`}</p>
              </div>
            </div>
          ))}
        </section>
      )}

        {certifications?.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 16 }}>Certifications</h3>
            {certifications.map((c, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#78716c" }}>{c.date || "Date"}</span>
                <div>
                  <h4 style={{ fontWeight: 600, fontSize: 13, color: "#1c1917" }}>{c.name}</h4>
                  <p style={{ fontSize: 11.5, color: "#57534e" }}>{c.issuer}</p>
                </div>
              </div>
            ))}
          </section>
        )}

        {achievements?.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 16 }}>Achievements</h3>
            {achievements.map((ach, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#78716c" }}>Achievement {i + 1}</span>
                <p style={{ fontSize: 12.5, color: "#44403c" }}>{ach}</p>
              </div>
            ))}
          </section>
        )}

        {languages?.length > 0 && (
          <section>
            <h3 style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#a8a29e", marginBottom: 16 }}>Languages</h3>
            {languages.map((l, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 20, marginBottom: 10 }}>
                <span style={{ fontSize: 11, color: "#78716c" }}>Language</span>
                <p style={{ fontSize: 12.5, color: "#44403c" }}>
                  <strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}
                </p>
              </div>
            ))}
          </section>
        )}
    </div>
  );
}
