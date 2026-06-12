import ModernTemplate from './ModernTemplate';
import ProfessionalTemplate from './ProfessionalTemplate';
import MinimalTemplate from './MinimalTemplate';
import CreativeTemplate from './CreativeTemplate';

// Define the supplementary layouts inline to keep files clean

// Vansh Navy Sidebar Layout
function VanshTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  const navy = "#1b2a47";
  return (
    <div id="resume-preview" style={{ display: "flex", flexDirection: "column", minHeight: "297mm", width: "210mm", background: "#fff", color: "#1e293b", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ background: navy, color: "#fff", padding: "32px 40px" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", textTransform: "uppercase" }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: "#93c5fd", fontSize: 14, fontWeight: 600, marginTop: 4, letterSpacing: "0.05em" }}>{p.jobTitle || "Software Engineer"}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 24px", fontSize: 11.5, color: "#cbd5e1", marginTop: 16, borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 14 }}>
          {p.phone && <span>■ {p.phone}</span>}{p.email && <span>✉ {p.email}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.github && <span>⌥ {p.github}</span>}{p.linkedin && <span>in {p.linkedin}</span>}
          {p.website && <span>🌐 {p.website}</span>}
        </div>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: "33%", background: navy, color: "#fff", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {skills?.length > 0 && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 6, marginBottom: 12 }}>Technical Skills</h3>
            {skills.map((s, i) => <div key={i} style={{ marginBottom: 10 }}>
              {s.category && <div style={{ fontWeight: 700, fontSize: 10.5, color: "#fff", marginBottom: 3, textTransform: "uppercase" }}>{s.category}</div>}
              <div style={{ color: "#94a3b8", fontSize: 11, lineHeight: 1.4 }}>{s.items?.join(", ")}</div>
            </div>)}
          </div>}
          {education?.length > 0 && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 6, marginBottom: 12 }}>Education</h3>
            {education.map((ed, i) => <div key={i} style={{ fontSize: 11, marginBottom: 12 }}>
              <div style={{ fontWeight: 700, color: "#fff" }}>{ed.degree} {ed.field && `in ${ed.field}`}</div>
              <div style={{ color: "#cbd5e1", marginTop: 2 }}>{ed.institution}</div>
              <div style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{ed.startDate} – {ed.endDate} {ed.gpa && `• GPA: ${ed.gpa}`}</div>
            </div>)}
          </div>}
          {certifications?.length > 0 && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 6, marginBottom: 12 }}>Certifications</h3>
            {certifications.map((c, i) => <div key={i} style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.4, marginBottom: 6 }}><strong>{c.issuer}</strong> – {c.name} {c.date && `(${c.date})`}</div>)}
          </div>}
          {languages?.length > 0 && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", borderBottom: "1px solid rgba(255,255,255,0.15)", paddingBottom: 6, marginBottom: 12 }}>Languages</h3>
            {languages.map((l, i) => <div key={i} style={{ fontSize: 11, color: "#cbd5e1", lineHeight: 1.4, marginBottom: 6 }}><strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}</div>)}
          </div>}
        </div>
        <div style={{ width: "67%", padding: "28px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
          {p.summary && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navy, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 10 }}>Summary</h3>
            <p style={{ color: "#334155", fontSize: 11.5, lineHeight: 1.6 }}>{p.summary}</p>
          </div>}
          {experience?.length > 0 && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navy, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 14 }}>Work Experience</h3>
            {experience.map((e, i) => <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h4 style={{ fontWeight: 700, fontSize: 13 }}>{e.position}</h4>
                <span style={{ fontSize: 10.5, color: "#64748b" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
              </div>
              <div style={{ color: "#475569", fontWeight: 600, fontSize: 11.5, marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`}</div>
              {e.points?.filter(Boolean).length > 0 ? (
                e.points.filter(Boolean).map((pt, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 11, color: "#334155" }}>
                    <span style={{ color: navy }}>•</span>
                    <span>{pt}</span>
                  </div>
                ))
              ) : (
                e.description && <p style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{e.description}</p>
              )}
            </div>)}
          </div>}
          {projects?.length > 0 && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navy, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 14 }}>Projects</h3>
            {projects.map((pr, i) => <div key={i} style={{ marginBottom: 16 }}>
              <h4 style={{ fontWeight: 700, fontSize: 13 }}>{pr.name}</h4>
              {pr.techStack?.length > 0 && <div style={{ fontSize: 10.5, color: "#4b5563", marginTop: 2 }}><strong>Stack:</strong> {pr.techStack.join(", ")}</div>}
              {pr.description && <p style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>{pr.description}</p>}
              {(pr.githubUrl || pr.liveUrl) && (
                <div style={{ fontSize: 10.5, color: "#475569", marginTop: 4, display: "flex", gap: 12 }}>
                  {pr.githubUrl && <span>GitHub: {pr.githubUrl}</span>}
                  {pr.liveUrl && <span>Live: {pr.liveUrl}</span>}
                </div>
              )}
            </div>)}
          </div>}
          {achievements?.length > 0 && <div><h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navy, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 14 }}>Achievements</h3>
            <ul style={{ paddingLeft: 16, fontSize: 11, color: "#334155", lineHeight: 1.5 }}>
              {achievements.map((ach, i) => <li key={i} style={{ marginBottom: 4 }}>{ach}</li>)}
            </ul>
          </div>}
        </div>
      </div>
    </div>
  );
}

function ClassicTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Georgia', serif", color: "#1a1a1a", padding: "52px 60px", width: "210mm", minHeight: "297mm", margin: "0 auto", background: "#fff" }}>
      <header style={{ textAlign: "center", paddingBottom: 24, marginBottom: 28, borderBottom: "2px solid #1a1a1a" }}>
        <h1 style={{ fontSize: 38, fontWeight: 600, letterSpacing: "0.02em" }}>{p.fullName || "Your Name"}</h1>
        {p.jobTitle && <p style={{ fontSize: 15, fontStyle: "italic", color: "#555", marginTop: 6 }}>{p.jobTitle}</p>}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "8px 16px", marginTop: 12, fontSize: 12, color: "#555" }}>
          {p.email && <span>{p.email}</span>}
          {p.phone && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span>LinkedIn: {p.linkedin}</span>}
          {p.github && <span>GitHub: {p.github}</span>}
          {p.website && <span>Website: {p.website}</span>}
        </div>
      </header>
      {p.summary && <div style={{ marginBottom: 28, textAlign: "center" }}><p style={{ fontSize: 14, lineHeight: 1.8, color: "#333", fontStyle: "italic", maxWidth: "80%", margin: "0 auto" }}>{p.summary}</p></div>}
      
      {experience?.length > 0 && <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>Professional Experience</h2>
        {experience.map((e, i) => <div key={i} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: i < experience.length - 1 ? "1px solid #e5e7eb" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ fontSize: 16, fontWeight: 600 }}>{e.position}</h3>
            <span style={{ fontSize: 12, color: "#666" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
          </div>
          <p style={{ fontSize: 13, color: "#555", fontStyle: "italic", marginBottom: 8 }}>{e.company}{e.location && `, ${e.location}`}</p>
          {e.points?.filter(Boolean).length > 0 ? (
            e.points.filter(Boolean).map((pt, j) => <p key={j} style={{ fontSize: 13, color: "#333", marginTop: 4, paddingLeft: 12 }}>– {pt}</p>)
          ) : (
            e.description && <p style={{ fontSize: 13, color: "#333", marginTop: 4, paddingLeft: 12 }}>{e.description}</p>
          )}
        </div>)}
      </section>}

      {projects?.length > 0 && <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>Key Projects</h2>
        {projects.map((pr, i) => <div key={i} style={{ marginBottom: 16, paddingBottom: i < projects.length - 1 ? 16 : 0, borderBottom: i < projects.length - 1 ? "1px dashed #e5e7eb" : "none" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <h3 style={{ fontSize: 15, fontWeight: 600 }}>{pr.name}</h3>
            {pr.techStack?.length > 0 && <span style={{ fontSize: 11.5, color: "#666", fontStyle: "italic" }}>{pr.techStack.join(", ")}</span>}
          </div>
          {pr.description && <p style={{ fontSize: 13, color: "#333", marginTop: 4 }}>{pr.description}</p>}
          {(pr.githubUrl || pr.liveUrl) && (
            <div style={{ fontSize: 11.5, color: "#555", marginTop: 4, display: "flex", gap: 12 }}>
              {pr.githubUrl && <span>GitHub: {pr.githubUrl}</span>}
              {pr.liveUrl && <span>Live: {pr.liveUrl}</span>}
            </div>
          )}
        </div>)}
      </section>}

      {skills?.length > 0 && <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>Skills</h2>
        {skills.map((s, i) => <div key={i} style={{ marginBottom: 8, fontSize: 13 }}>
          {s.category && <strong>{s.category}: </strong>}
          <span>{s.items?.join(", ")}</span>
        </div>)}
      </section>}

      {education?.length > 0 && <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>Education</h2>
        {education.map((ed, i) => <div key={i} style={{ textAlign: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 600 }}>{ed.degree} {ed.field && `in ${ed.field}`}</div>
          <div style={{ fontSize: 13, color: "#555", fontStyle: "italic" }}>{ed.institution} · {ed.startDate} – {ed.endDate} {ed.gpa && `· GPA: ${ed.gpa}`}</div>
        </div>)}
      </section>}

      {certifications?.length > 0 && <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>Certifications</h2>
        {certifications.map((c, i) => <div key={i} style={{ fontSize: 13, marginBottom: 6 }}>
          <strong>{c.name}</strong> – {c.issuer} {c.date && `(${c.date})`}
        </div>)}
      </section>}

      {achievements?.length > 0 && <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>Honors & Achievements</h2>
        <ul style={{ paddingLeft: 24, fontSize: 13, color: "#333", lineHeight: 1.6 }}>
          {achievements.map((ach, i) => <li key={i} style={{ marginBottom: 4 }}>{ach}</li>)}
        </ul>
      </section>}

      {languages?.length > 0 && <section style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.12em", textAlign: "center", marginBottom: 16, fontWeight: 600 }}>Languages</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 13, color: "#333" }}>
          {languages.map((l, i) => <span key={i}><strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}</span>)}
        </div>
      </section>}
    </div>
  );
}

// Terminal Tech Layout
function TechTemplate({ data }) {
  const { personalInfo: p = {}, experience = [], skills = [], education = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  return (
    <div id="resume-preview" style={{ fontFamily: "'Courier New', monospace", background: "#0d1117", color: "#e6edf3", padding: "40px 48px", width: "210mm", minHeight: "297mm", margin: "0 auto" }}>
      <div style={{ borderBottom: "1px solid #21262d", paddingBottom: 28, marginBottom: 32 }}>
        <div style={{ color: "#58a6ff", fontSize: 13, marginBottom: 8 }}>{"// resume.json"}</div>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em" }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: "#8b949e", fontSize: 14, marginTop: 6 }}>{"<"}<span style={{ color: "#7ee787" }}>{p.jobTitle || "Engineer"}</span>{" />"}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px 20px", marginTop: 16, fontSize: 12, color: "#58a6ff" }}>
          {p.email && <span>email: "{p.email}"</span>}
          {p.phone && <span>phone: "{p.phone}"</span>}
          {p.location && <span>location: "{p.location}"</span>}
          {p.github && <span>github: "{p.github}"</span>}
          {p.linkedin && <span>linkedin: "{p.linkedin}"</span>}
          {p.website && <span>website: "{p.website}"</span>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 40 }}>
        <div>
          {p.summary && <div style={{ marginBottom: 28 }}><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 8 }}>{"/* about */"}</div><p style={{ fontSize: 13, lineHeight: 1.7, color: "#8b949e" }}>{p.summary}</p></div>}
          
          {experience?.length > 0 && <div style={{ marginBottom: 28 }}><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16 }}>{"/* experience */"}</div>
            {experience.map((e, i) => <div key={i} style={{ marginBottom: 20, paddingLeft: 16, borderLeft: "2px solid #21262d" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{e.position}</div>
              <div style={{ fontSize: 12, color: "#58a6ff", marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`} · {e.startDate}–{e.current ? "now" : e.endDate}</div>
              {e.points?.filter(Boolean).length > 0 ? (
                e.points.filter(Boolean).map((pt, j) => <div key={j} style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>{"→"} {pt}</div>)
              ) : (
                e.description && <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>{e.description}</div>
              )}
            </div>)}</div>}

          {projects?.length > 0 && <div style={{ marginBottom: 28 }}><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16 }}>{"/* projects */"}</div>
            {projects.map((pr, i) => <div key={i} style={{ marginBottom: 20, paddingLeft: 16, borderLeft: "2px solid #21262d" }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>{pr.name}</div>
              {pr.techStack?.length > 0 && <div style={{ fontSize: 11, color: "#58a6ff", marginTop: 2 }}>[ {pr.techStack.join(", ")} ]</div>}
              {pr.description && <div style={{ fontSize: 12, color: "#8b949e", marginTop: 4 }}>{pr.description}</div>}
              {(pr.githubUrl || pr.liveUrl) && (
                <div style={{ fontSize: 11, color: "#58a6ff", marginTop: 4, display: "flex", gap: 12 }}>
                  {pr.githubUrl && <span>github: {pr.githubUrl}</span>}
                  {pr.liveUrl && <span>live: {pr.liveUrl}</span>}
                </div>
              )}
            </div>)}</div>}

          {achievements?.length > 0 && <div style={{ marginBottom: 28 }}><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16 }}>{"/* achievements */"}</div>
            {achievements.map((ach, i) => <div key={i} style={{ fontSize: 12, color: "#8b949e", marginBottom: 6 }}>{`• ${ach}`}</div>)}
          </div>}
        </div>
        <div>
          {skills?.length > 0 && <div style={{ marginBottom: 28 }}><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16 }}>{"/* skills */"}</div>
            {skills.map((s, i) => <div key={i} style={{ marginBottom: 14 }}>
              {s.category && <div style={{ fontSize: 11, color: "#f8849a", marginBottom: 6 }}>{s.category}:</div>}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                {s.items?.map((it, j) => <span key={j} style={{ background: "#161b22", border: "1px solid #30363d", color: "#e6edf3", fontSize: 10, padding: "3px 7px", borderRadius: 4 }}>{it}</span>)}
              </div>
            </div>)}</div>}

          {education?.length > 0 && <div style={{ marginBottom: 28 }}><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16 }}>{"/* education */"}</div>
            {education.map((ed, i) => <div key={i} style={{ marginBottom: 12, padding: "10px 12px", background: "#161b22", border: "1px solid #21262d", borderRadius: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{ed.degree} {ed.field && `in ${ed.field}`}</div>
              <div style={{ fontSize: 11, color: "#8b949e" }}>{ed.institution} · {ed.startDate}–{ed.endDate} {ed.gpa && `· GPA: ${ed.gpa}`}</div>
            </div>)}</div>}

          {certifications?.length > 0 && <div style={{ marginBottom: 28 }}><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16 }}>{"/* certifications */"}</div>
            {certifications.map((c, i) => <div key={i} style={{ marginBottom: 12, padding: "10px 12px", background: "#161b22", border: "1px solid #21262d", borderRadius: 6 }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
              <div style={{ fontSize: 11, color: "#8b949e" }}>{c.issuer} {c.date && `(${c.date})`}</div>
            </div>)}</div>}

          {languages?.length > 0 && <div><div style={{ fontSize: 11, color: "#7ee787", marginBottom: 16 }}>{"/* languages */"}</div>
            {languages.map((l, i) => <div key={i} style={{ fontSize: 12, color: "#8b949e", marginBottom: 6 }}>
              <span style={{ color: "#58a6ff" }}>{l.language}</span>{l.proficiency && ` (${l.proficiency})`}
            </div>)}</div>}
        </div>
      </div>
    </div>
  );
}

// Vansh Single Template — Navy header & single-column layout
function VanshSingleTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  const navyColor = "#1b2a47";

  return (
    <div id="resume-preview" style={{ display: "flex", flexDirection: "column", minHeight: "297mm", width: "210mm", background: "#fff", color: "#1e293b", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: navyColor, color: "#fff", padding: "28px 36px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: 30, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em", textTransform: "uppercase", margin: 0, lineHeight: 1.1 }}>{p.fullName || "Your Name"}</h1>
          <p style={{ color: "#93c5fd", fontSize: 13, fontWeight: 600, marginTop: 4, letterSpacing: "0.05em" }}>{p.jobTitle || "Software Engineer"}</p>
        </div>
        <div style={{ textAlign: "right", fontSize: 11, color: "#cbd5e1", lineHeight: 1.5 }}>
          <div>{[p.phone, p.email].filter(Boolean).join("  |  ")}</div>
          <div>{[p.github, p.linkedin, p.website].filter(Boolean).join("  |  ")}</div>
        </div>
      </div>

      {/* Body Section */}
      <div style={{ padding: "28px 36px", display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Professional Summary */}
        {p.summary && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</h3>
            <p style={{ color: "#334155", fontSize: 11, lineHeight: 1.55, textAlign: "justify" }}>{p.summary}</p>
          </div>
        )}

        {/* Technical Skills */}
        {skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 10 }}>Technical Skills</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, fontSize: 11 }}>
                  <div style={{ width: 110, fontWeight: 700, color: "#1e293b", flexShrink: 0 }}>{s.category}</div>
                  <div style={{ color: "#334155", flex: 1, lineHeight: 1.4 }}>{s.items?.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 12 }}>Work Experience</h3>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4 style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{e.position}</h4>
                  <span style={{ fontSize: 10.5, color: "#64748b", fontWeight: 500, fontStyle: "italic" }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
                </div>
                <div style={{ color: "#64748b", fontWeight: 500, fontSize: 11, marginTop: 1, marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`}</div>
                {e.points?.filter(Boolean).length > 0 ? (
                  e.points.filter(Boolean).map((pt, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 11, color: "#334155", lineHeight: 1.5 }}>
                      <span>•</span>
                      <span>{pt}</span>
                    </div>
                  ))
                ) : (
                  e.description && <p style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 12 }}>Projects</h3>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <h4 style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{pr.name}</h4>
                {pr.liveUrl && <a href={`https://${pr.liveUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: "#2563eb", textDecoration: "none", display: "inline-block", marginTop: 1, marginBottom: 4 }}>{pr.liveUrl}</a>}
                {pr.techStack?.length > 0 && (
                  <div style={{ fontSize: 10.5, color: "#4b5563", marginBottom: 4 }}>
                    <strong>Stack:</strong> {pr.techStack.join(", ")}
                  </div>
                )}
                {pr.description && <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>{pr.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 12 }}>Education</h3>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11 }}>
                <div>
                  <div style={{ fontWeight: 700, color: "#1e293b" }}>{ed.degree}</div>
                  <div style={{ color: "#475569", marginTop: 1 }}>{ed.institution} {ed.gpa && `• GPA: ${ed.gpa}`}</div>
                </div>
                <div style={{ color: "#64748b", fontStyle: "italic", fontSize: 10.5 }}>{ed.startDate} – {ed.endDate}</div>
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 10 }}>Certifications</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px", fontSize: 11, color: "#334155" }}>
              {certifications.map((c, i) => (
                <div key={i}>
                  • <strong>{c.issuer}</strong> – {c.name} {c.date && `(${c.date})`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 10 }}>Honors & Achievements</h3>
            <ul style={{ paddingLeft: 16, fontSize: 11, color: "#334155", lineHeight: 1.5 }}>
              {achievements.map((ach, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: navyColor, borderBottom: `2px solid ${navyColor}`, paddingBottom: 4, marginBottom: 10 }}>Languages</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 11, color: "#334155" }}>
              {languages.map((l, i) => (
                <div key={i}>
                  • <strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Minimal Blue Template — Centered layout, light blue accents, single column
function MinimalBlueTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  const accentColor = "#2563eb";

  return (
    <div id="resume-preview" style={{ display: "flex", flexDirection: "column", minHeight: "297mm", width: "210mm", background: "#fff", color: "#1e293b", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "36px 40px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
        <h1 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: "-0.02em", textTransform: "uppercase", color: "#0f172a", margin: 0, lineHeight: 1.1 }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: accentColor, fontSize: 13, fontWeight: 700, marginTop: 6, letterSpacing: "0.06em", textTransform: "uppercase" }}>{p.jobTitle || "Software Engineer"}</p>

        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 14px", fontSize: 11, color: "#64748b", marginTop: 14 }}>
          {[p.phone, p.email, p.github, p.linkedin, p.website].filter(Boolean).map((c, idx, arr) => (
            <span key={idx} style={{ display: "inline-flex", alignItems: "center" }}>
              {c}
              {idx < arr.length - 1 && <span style={{ margin: "0 10px", color: "#cbd5e1" }}>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Body Section */}
      <div style={{ padding: "16px 40px 36px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Professional Summary */}
        {p.summary && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 10 }}>Professional Summary</h3>
            <p style={{ color: "#334155", fontSize: 11, lineHeight: 1.55, textAlign: "justify" }}>{p.summary}</p>
          </div>
        )}

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 10 }}>Education</h3>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontSize: 11 }}>
                <div>
                  <span style={{ fontWeight: 700, color: "#1e293b" }}>{ed.degree}</span>
                  <div style={{ color: "#64748b", marginTop: 2 }}>{ed.institution} {ed.gpa && `| GPA: ${ed.gpa}`}</div>
                </div>
                <div style={{ color: "#64748b", fontStyle: "italic", fontSize: 10.5 }}>{ed.startDate} – {ed.endDate}</div>
              </div>
            ))}
          </div>
        )}

        {/* Technical Skills */}
        {skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 10 }}>Skills</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {skills.map((s, i) => (
                <div key={i} style={{ display: "flex", gap: 16, fontSize: 11 }}>
                  <div style={{ width: 100, fontWeight: 700, color: "#1e293b", flexShrink: 0 }}>{s.category}:</div>
                  <div style={{ color: "#334155", flex: 1, lineHeight: 1.4 }}>{s.items?.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Experience */}
        {experience?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 12 }}>Work Experience</h3>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4 style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{e.position}</h4>
                  <span style={{ fontSize: 10.5, color: "#64748b", fontWeight: 500 }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
                </div>
                <div style={{ color: "#64748b", fontWeight: 500, fontSize: 11, marginTop: 1, marginBottom: 6 }}>{e.company}{e.location && ` | ${e.location}`}</div>
                {e.points?.filter(Boolean).length > 0 ? (
                  e.points.filter(Boolean).map((pt, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 11, color: "#334155", lineHeight: 1.5 }}>
                      <span>•</span>
                      <span>{pt}</span>
                    </div>
                  ))
                ) : (
                  e.description && <p style={{ fontSize: 11, color: "#334155", marginTop: 4 }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 12 }}>Projects</h3>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <h4 style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{pr.name}</h4>
                {pr.liveUrl && <a href={`https://${pr.liveUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: 10.5, color: "#2563eb", textDecoration: "none", display: "inline-block", marginTop: 1, marginBottom: 4 }}>{pr.liveUrl}</a>}
                {pr.techStack?.length > 0 && (
                  <div style={{ fontSize: 10.5, color: "#4b5563", marginBottom: 4 }}>
                    <strong>Stack:</strong> {pr.techStack.join(", ")}
                  </div>
                )}
                {pr.description && <p style={{ fontSize: 11, color: "#475569", lineHeight: 1.5 }}>{pr.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 10 }}>Certifications</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11, color: "#334155" }}>
              {certifications.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <span>•</span>
                  <span><strong>{c.issuer}</strong> – {c.name} {c.date && `(${c.date})`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 10 }}>Honors & Achievements</h3>
            <ul style={{ paddingLeft: 16, fontSize: 11, color: "#334155", lineHeight: 1.5 }}>
              {achievements.map((ach, i) => (
                <li key={i} style={{ marginBottom: 4 }}>{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accentColor, borderBottom: `2px solid ${accentColor}`, paddingBottom: 4, marginBottom: 10 }}>Languages</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 20px", fontSize: 11, color: "#334155" }}>
              {languages.map((l, i) => (
                <div key={i} style={{ display: "flex", gap: 8 }}>
                  <span>•</span>
                  <span><strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Grid Box Template — Structured grid layout with thin borders and serif titles
function VanshGridTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  const gridBorder = "1px solid #cbd5e1";

  return (
    <div id="resume-preview" style={{ display: "flex", flexDirection: "column", minHeight: "297mm", width: "210mm", background: "#fff", color: "#111827", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ padding: "36px 40px 18px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", borderBottom: gridBorder }}>
        <h1 style={{ fontSize: 36, fontWeight: 700, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#111827", margin: 0, fontFamily: "'Inter', sans-serif" }}>
          {p.fullName || "Your Name"}
        </h1>
        {p.jobTitle && (
          <p style={{ color: "#111827", fontSize: 13, fontWeight: 700, marginTop: 8, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {p.jobTitle}
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "6px 14px", fontSize: 11, color: "#4b5563", marginTop: 10 }}>
          {[p.phone, p.email, p.github, p.linkedin, p.website].filter(Boolean).map((c, idx, arr) => (
            <span key={idx} style={{ display: "inline-flex", alignItems: "center" }}>
              {c}
              {idx < arr.length - 1 && <span style={{ margin: "0 10px", color: "#cbd5e1" }}>|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Grid Body */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Row 1: Education | Summary */}
        <div style={{ display: "flex", borderBottom: gridBorder }}>
          {/* Left Column: Education */}
          <div style={{ width: "38%", borderRight: gridBorder, padding: "18px 20px 18px 40px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
              Education:
            </h2>
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 10.5, color: "#111827", textTransform: "uppercase" }}>{ed.degree}</span>
                  <span style={{ fontSize: 10, color: "#111827", fontWeight: 700 }}>{ed.startDate}–{ed.endDate}</span>
                </div>
                <div style={{ fontSize: 10.5, color: "#4b5563", marginTop: 2 }}>{ed.institution}</div>
              </div>
            ))}
          </div>

          {/* Right Column: Summary */}
          <div style={{ width: "62%", padding: "18px 40px 18px 24px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
              Summary:
            </h2>
            <p style={{ fontSize: 11, color: "#374151", lineHeight: 1.55, textAlign: "justify", margin: 0 }}>
              {p.summary || "Summary text goes here..."}
            </p>
          </div>
        </div>

        {/* Row 2: Skills | Experience */}
        <div style={{ display: "flex", borderBottom: gridBorder }}>
          {/* Left Column: Skills */}
          <div style={{ width: "38%", borderRight: gridBorder, padding: "18px 20px 18px 40px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
              Skills:
            </h2>
            {skills.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: "#374151", marginBottom: 10, lineHeight: 1.4 }}>
                <span style={{ fontSize: 11, color: "#111827" }}>•</span>
                <span>
                  <strong>{s.category} :- </strong>
                  {s.items?.join(", ")}
                </span>
              </div>
            ))}
          </div>

          {/* Right Column: Experience */}
          <div style={{ width: "62%", padding: "18px 40px 18px 24px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
              Experience:
            </h2>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <span style={{ fontWeight: 700, fontSize: 11, color: "#111827", textTransform: "uppercase" }}>{e.position}</span>
                  <span style={{ fontSize: 10.5, color: "#111827", fontWeight: 700 }}>{e.startDate} - {e.current ? "PRESENT" : e.endDate?.toUpperCase()}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 11, color: "#111827", marginTop: 2, marginBottom: 6 }}>
                  {e.company}
                </div>
                {e.points?.filter(Boolean).length > 0 ? (
                  e.points.filter(Boolean).map((pt, j) => (
                    <div key={j} style={{ display: "flex", gap: 6, marginTop: 4, fontSize: 11, color: "#374151", lineHeight: 1.45 }}>
                      <span>•</span>
                      <span>{pt}</span>
                    </div>
                  ))
                ) : (
                  e.description && <p style={{ fontSize: 11, color: "#374151", marginTop: 4 }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Row 3: Online Certificate | Projects */}
        <div style={{ display: "flex" }}>
          {/* Left Column: Certifications */}
          <div style={{ width: "38%", borderRight: gridBorder, padding: "18px 20px 36px 40px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
              Online Certificate:
            </h2>
            {certifications.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: "#374151", marginBottom: 8, lineHeight: 1.45 }}>
                <span>•</span>
                <span>
                  {c.name} – {c.issuer}
                </span>
              </div>
            ))}
            {languages?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
                  Languages:
                </h2>
                {languages.map((l, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: "#374151", marginBottom: 8, lineHeight: 1.45 }}>
                    <span>•</span>
                    <span>
                      <strong>{l.language}</strong> {l.proficiency && ` (${l.proficiency})`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Projects */}
          <div style={{ width: "62%", padding: "18px 40px 36px 24px" }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
              Projects:
            </h2>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 11, color: "#111827", textTransform: "uppercase", marginBottom: 6 }}>
                  {pr.name}
                </div>
                {(pr.liveUrl || pr.githubUrl) && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 4 }}>
                    {pr.liveUrl && (
                      <div style={{ display: "flex", gap: 6, fontSize: 11 }}>
                        <span>•</span>
                        <span><strong>Live:</strong> <a href={`https://${pr.liveUrl.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>{pr.liveUrl.replace(/^https?:\/\//, '')}</a></span>
                      </div>
                    )}
                    {pr.githubUrl && (
                      <div style={{ display: "flex", gap: 6, fontSize: 11 }}>
                        <span>•</span>
                        <span><strong>GitHub:</strong> <a href={`https://${pr.githubUrl.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: "#2563eb", textDecoration: "underline" }}>{pr.githubUrl.replace(/^https?:\/\//, '')}</a></span>
                      </div>
                    )}
                  </div>
                )}
                {pr.description && (
                  <div style={{ display: "flex", gap: 6, fontSize: 11, color: "#374151", lineHeight: 1.45, marginBottom: 4 }}>
                    <span>•</span>
                    <span>{pr.description}</span>
                  </div>
                )}
                {pr.techStack?.length > 0 && (
                  <div style={{ display: "flex", gap: 6, fontSize: 11, color: "#374151", lineHeight: 1.45 }}>
                    <span>•</span>
                    <span><strong>Stack:</strong> {pr.techStack.join(", ")}</span>
                  </div>
                )}
              </div>
            ))}
            {achievements?.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#111827", fontFamily: "'Crimson Pro', Georgia, serif", marginBottom: 14 }}>
                  Achievements:
                </h2>
                {achievements.map((ach, i) => (
                  <div key={i} style={{ display: "flex", gap: 6, fontSize: 11, color: "#374151", marginBottom: 8, lineHeight: 1.45 }}>
                    <span>•</span>
                    <span>{ach}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Executive Emerald Layout
function ExecutiveTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  const green = "#065f46";
  const darkSlate = "#0f172a";

  const renderSectionHeader = (title) => (
    <div style={{ borderBottom: `2.5px solid ${green}`, paddingBottom: 4, marginBottom: 14, marginTop: 24 }}>
      <h3 style={{ fontSize: 13, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: darkSlate, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
        {title}
      </h3>
    </div>
  );

  return (
    <div id="resume-preview" style={{ display: "flex", flexDirection: "column", minHeight: "297mm", width: "210mm", background: "#fff", color: "#334155", padding: "44px 48px", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: 20, marginBottom: 10 }}>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: darkSlate, fontFamily: "'Plus Jakarta Sans', sans-serif", margin: 0 }}>{p.fullName || "Your Name"}</h1>
        <p style={{ color: green, fontSize: 14, fontWeight: 700, marginTop: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.jobTitle || "Software Engineer"}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 11.5, color: "#64748b", marginTop: 14 }}>
          {p.email && <span>✉ {p.email}</span>}
          {p.phone && <span>📱 {p.phone}</span>}
          {p.location && <span>📍 {p.location}</span>}
          {p.linkedin && <span>LinkedIn: {p.linkedin}</span>}
          {p.github && <span>GitHub: {p.github}</span>}
          {p.website && <span>Website: {p.website}</span>}
        </div>
      </div>

      {/* Profile/Summary */}
      {p.summary && (
        <div>
          {renderSectionHeader("Professional Profile")}
          <p style={{ fontSize: 11.5, lineHeight: 1.6, textAlign: "justify" }}>{p.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div>
          {renderSectionHeader("Professional History")}
          {experience.map((e, i) => (
            <div key={i} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h4 style={{ fontWeight: 700, fontSize: 13, color: darkSlate }}>{e.position}</h4>
                <span style={{ fontSize: 11, color: green, fontWeight: 700 }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
              </div>
              <div style={{ color: "#475569", fontWeight: 600, fontSize: 12, marginTop: 2, marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`}</div>
              {e.points?.filter(Boolean).length > 0 ? (
                e.points.filter(Boolean).map((pt, j) => (
                  <div key={j} style={{ display: "flex", gap: 8, marginTop: 4, fontSize: 11, lineHeight: 1.5 }}>
                    <span style={{ color: green }}>•</span>
                    <span>{pt}</span>
                  </div>
                ))
              ) : (
                e.description && <p style={{ fontSize: 11, marginTop: 4 }}>{e.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div>
          {renderSectionHeader("Selected Projects")}
          {projects.map((pr, i) => (
            <div key={i} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <h4 style={{ fontWeight: 700, fontSize: 13, color: darkSlate }}>{pr.name}</h4>
                {pr.liveUrl && <a href={`https://${pr.liveUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: green, textDecoration: "none", fontWeight: 600 }}>{pr.liveUrl}</a>}
              </div>
              {pr.techStack?.length > 0 && (
                <div style={{ fontSize: 10.5, color: "#4b5563", marginTop: 2 }}>
                  <strong>Technology:</strong> {pr.techStack.join(", ")}
                </div>
              )}
              {pr.description && <p style={{ fontSize: 11, marginTop: 4, lineHeight: 1.5 }}>{pr.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div>
          {renderSectionHeader("Expertise & Skills")}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 24px" }}>
            {skills.map((s, i) => (
              <div key={i}>
                {s.category && <div style={{ fontWeight: 700, fontSize: 11, color: darkSlate, marginBottom: 3, textTransform: "uppercase" }}>{s.category}</div>}
                <div style={{ fontSize: 11, color: "#475569" }}>{s.items?.join(", ")}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 4: Education & Certifications */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        {education?.length > 0 && (
          <div>
            {renderSectionHeader("Academic Credentials")}
            {education.map((ed, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: darkSlate }}>{ed.degree}</div>
                <div style={{ fontSize: 11, color: "#475569", marginTop: 2 }}>{ed.institution}</div>
                <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 2 }}>{ed.startDate} – {ed.endDate} {ed.gpa && `• GPA: ${ed.gpa}`}</div>
              </div>
            ))}
          </div>
        )}

        {(certifications?.length > 0 || languages?.length > 0 || achievements?.length > 0) && (
          <div>
            {certifications?.length > 0 && (
              <>
                {renderSectionHeader("Certifications")}
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {certifications.map((c, i) => (
                    <div key={i} style={{ fontSize: 11 }}>
                      <strong>{c.issuer}</strong> – {c.name} {c.date && `(${c.date})`}
                    </div>
                  ))}
                </div>
              </>
            )}

            {languages?.length > 0 && (
              <>
                {renderSectionHeader("Languages")}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px" }}>
                  {languages.map((l, i) => (
                    <div key={i} style={{ fontSize: 11 }}>
                      • <strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}
                    </div>
                  ))}
                </div>
              </>
            )}

            {achievements?.length > 0 && (
              <>
                {renderSectionHeader("Achievements")}
                <ul style={{ paddingLeft: 16, fontSize: 11, color: "#475569", lineHeight: 1.5 }}>
                  {achievements.map((ach, i) => (
                    <li key={i} style={{ marginBottom: 2 }}>{ach}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Clean Double-Column Layout
function DoubleColumnTemplate({ data }) {
  const { personalInfo: p = {}, education = [], experience = [], skills = [], projects = [], certifications = [], achievements = [], languages = [] } = data;
  const sidebarBg = "#1e293b";
  const accent = "#6366f1";

  return (
    <div id="resume-preview" style={{ display: "flex", minHeight: "297mm", width: "210mm", background: "#fff", color: "#1e293b", fontFamily: "'Inter', sans-serif", boxSizing: "border-box" }}>
      {/* Sidebar (Left Column) */}
      <div style={{ width: "35%", flex: "0 0 35%", boxSizing: "border-box", background: sidebarBg, color: "#f8fafc", padding: "36px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Name and Job Title */}
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: 0 }}>{p.fullName || "Your Name"}</h1>
          <p style={{ color: "#a5b4fc", fontSize: 13, fontWeight: 600, marginTop: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>{p.jobTitle || "Software Engineer"}</p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6, marginBottom: 10 }}>Contact</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 10.5, color: "#cbd5e1" }}>
            {p.email && <div style={{ wordBreak: "break-all" }}>✉ {p.email}</div>}
            {p.phone && <div>📱 {p.phone}</div>}
            {p.location && <div>📍 {p.location}</div>}
            {p.linkedin && <div style={{ wordBreak: "break-all" }}>in: {p.linkedin}</div>}
            {p.github && <div style={{ wordBreak: "break-all" }}>git: {p.github}</div>}
            {p.website && <div style={{ wordBreak: "break-all" }}>site: {p.website}</div>}
          </div>
        </div>

        {/* Education */}
        {education?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6, marginBottom: 10 }}>Education</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {education.map((ed, i) => (
                <div key={i} style={{ fontSize: 10.5 }}>
                  <div style={{ fontWeight: 700, color: "#fff" }}>{ed.degree}</div>
                  <div style={{ color: "#cbd5e1", marginTop: 2 }}>{ed.institution}</div>
                  <div style={{ fontSize: 9.5, color: "#94a3b8", marginTop: 2 }}>{ed.startDate} – {ed.endDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6, marginBottom: 10 }}>Skills</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {skills.map((s, i) => (
                <div key={i}>
                  {s.category && <div style={{ fontWeight: 700, fontSize: 9.5, color: "#fff", textTransform: "uppercase", marginBottom: 3 }}>{s.category}</div>}
                  <div style={{ color: "#94a3b8", fontSize: 10, lineHeight: 1.3 }}>{s.items?.join(", ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.1em", color: "#94a3b8", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: 6, marginBottom: 10 }}>Languages</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 10.5, color: "#cbd5e1" }}>
              {languages.map((l, i) => (
                <div key={i}>
                  • <strong>{l.language}</strong> {l.proficiency && `(${l.proficiency})`}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content (Right Column) */}
      <div style={{ width: "65%", flex: "0 0 65%", boxSizing: "border-box", padding: "36px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Professional Summary */}
        {p.summary && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 10 }}>Summary</h3>
            <p style={{ color: "#334155", fontSize: 11, lineHeight: 1.6, textAlign: "justify" }}>{p.summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 14 }}>Experience</h3>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4 style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{e.position}</h4>
                  <span style={{ fontSize: 10, color: "#64748b", fontWeight: 600 }}>{e.startDate} – {e.current ? "Present" : e.endDate}</span>
                </div>
                <div style={{ color: "#475569", fontWeight: 600, fontSize: 11, marginTop: 1, marginBottom: 6 }}>{e.company}{e.location && ` · ${e.location}`}</div>
                {e.points?.filter(Boolean).length > 0 ? (
                  e.points.filter(Boolean).map((pt, j) => (
                    <div key={j} style={{ display: "flex", gap: 8, marginTop: 3, fontSize: 10.5, color: "#334155", lineHeight: 1.45 }}>
                      <span style={{ color: accent }}>•</span>
                      <span>{pt}</span>
                    </div>
                  ))
                ) : (
                  e.description && <p style={{ fontSize: 10.5, color: "#334155", marginTop: 3 }}>{e.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 14 }}>Projects</h3>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <h4 style={{ fontWeight: 700, fontSize: 12.5, color: "#0f172a" }}>{pr.name}</h4>
                {pr.liveUrl && <a href={`https://${pr.liveUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: accent, textDecoration: "none", display: "inline-block", marginTop: 1, marginBottom: 3 }}>{pr.liveUrl}</a>}
                {pr.techStack?.length > 0 && (
                  <div style={{ fontSize: 10, color: "#4b5563", marginBottom: 3 }}>
                    <strong>Stack:</strong> {pr.techStack.join(", ")}
                  </div>
                )}
                {pr.description && <p style={{ fontSize: 10.5, color: "#475569", lineHeight: 1.4 }}>{pr.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Certifications */}
        {certifications?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 10 }}>Certifications</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 10.5, color: "#334155" }}>
              {certifications.map((c, i) => (
                <div key={i}>
                  • <strong>{c.issuer}</strong> – {c.name} {c.date && `(${c.date})`}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements?.length > 0 && (
          <div>
            <h3 style={{ fontSize: 12, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, borderBottom: "1.5px solid #e2e8f0", paddingBottom: 4, marginBottom: 10 }}>Achievements</h3>
            <ul style={{ paddingLeft: 16, fontSize: 10.5, color: "#334155", lineHeight: 1.5 }}>
              {achievements.map((ach, i) => (
                <li key={i} style={{ marginBottom: 3 }}>{ach}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export const TEMPLATE_LIST = [
  { id: "modern", label: "Modern Slate", icon: "✦" },
  { id: "professional", label: "Corporate", icon: "⚙" },
  { id: "minimal", label: "Clean Minimal", icon: "▫" },
  { id: "creative", label: "Violet Gradient", icon: "◈" },
  { id: "vansh", label: "Navy Sidebar", icon: "⚏" },
  { id: "classic", label: "Classic Serif", icon: "📜" },
  { id: "tech", label: "Terminal Dark", icon: "⌨" },
  { id: "vansh_single", label: "Navy Single", icon: "☰" },
  { id: "minimal_blue", label: "Minimal Blue", icon: "🔹" },
  { id: "vansh_grid", label: "Structured Grid", icon: "⏃" },
  { id: "executive", label: "Executive Emerald", icon: "💼" },
  { id: "double_column", label: "Clean Double-Column", icon: "📁" },
];

export const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  minimal: MinimalTemplate,
  creative: CreativeTemplate,
  vansh: VanshTemplate,
  classic: ClassicTemplate,
  tech: TechTemplate,
  vansh_single: VanshSingleTemplate,
  minimal_blue: MinimalBlueTemplate,
  vansh_grid: VanshGridTemplate,
  executive: ExecutiveTemplate,
  double_column: DoubleColumnTemplate,
};

export default TEMPLATE_COMPONENTS;
