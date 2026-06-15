import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import resumeService from '../services/resumeService';
import aiService from '../services/aiService';
import Btn from '../components/Btn';
import Card from '../components/Card';
import Field from '../components/Field';
import { toast } from '../components/Toast';
import TEMPLATE_COMPONENTS, { TEMPLATE_LIST } from '../templates/templateRegistry';

function SectionHeader({ icon, title, desc }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <h2 className="display" style={{ fontSize: 22, fontWeight: 400, color: "var(--text)", letterSpacing: "-0.01em" }}>{title}</h2>
      </div>
      {desc && <p style={{ color: "var(--text-3)", fontSize: 13, marginLeft: 28 }}>{desc}</p>}
    </div>
  );
}

function PersonalSection({ resume, update }) {
  const p = resume.personalInfo || {};
  const f = (k) => ({
    value: p[k] || "",
    onChange: (e) => update(`personalInfo.${k}`, e.target.value)
  });
  return (
    <div>
      <SectionHeader icon="👤" title="Personal Info" desc="Your contact details and identity." />
      <Card>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px,1fr))", gap: 16 }}>
          <Field label="Full Name"><input placeholder="Jane Doe" {...f("fullName")} /></Field>
          <Field label="Job Title"><input placeholder="Senior Engineer" {...f("jobTitle")} /></Field>
          <Field label="Email"><input type="email" placeholder="jane@company.com" {...f("email")} /></Field>
          <Field label="Phone"><input placeholder="+91 99999 99999" {...f("phone")} /></Field>
          <Field label="Location"><input placeholder="Ahmedabad, India" {...f("location")} /></Field>
          <Field label="Website"><input placeholder="janedoe.dev" {...f("website")} /></Field>
          <Field label="LinkedIn"><input placeholder="linkedin.com/in/janedoe" {...f("linkedin")} /></Field>
          <Field label="GitHub"><input placeholder="github.com/janedoe" {...f("github")} /></Field>
        </div>
      </Card>
    </div>
  );
}

function SummarySection({ resume, update }) {
  const [aiLoading, setAiLoading] = useState(false);
  const [improveLoading, setImproveLoading] = useState(false);

  const generate = async () => {
    setAiLoading(true);
    try {
      const { personalInfo: p, skills } = resume;
      const skillsList = skills?.flatMap(s => s.items || []).slice(0, 6);
      const result = await aiService.generateSummary(
        p?.fullName || "a developer",
        skillsList || [],
        "2 years",
        p?.jobTitle || "Software Engineer"
      );
      update("personalInfo.summary", result.trim());
      toast.success("Summary generated!");
    } catch {
      toast.error("AI service is currently busy.", "error");
    } finally {
      setAiLoading(false);
    }
  };

  const improve = async () => {
    const summaryText = resume.personalInfo?.summary;
    if (!summaryText) {
      toast.error("Please enter a summary first before optimizing.");
      return;
    }
    setImproveLoading(true);
    try {
      const result = await aiService.improveResume("summary", summaryText, resume.personalInfo?.jobTitle || "Software Engineer");
      update("personalInfo.summary", result.trim());
      toast.success("Summary enhanced for ATS!");
    } catch {
      toast.error("Could not reach optimization engine.");
    } finally {
      setImproveLoading(false);
    }
  };

  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="✍" title="Summary" desc="Write a brief professional summary." />
        <div className="btn-group" style={{ display: "flex", gap: 8 }}>
          <Btn onClick={improve} loading={improveLoading} variant="secondary" size="sm">AI Improve</Btn>
          <Btn onClick={generate} loading={aiLoading} variant="gold" size="sm">AI Auto-Write</Btn>
        </div>
      </div>
      <Card>
        <textarea placeholder="Results-driven engineer with expertise in…" value={resume.personalInfo?.summary || ""} onChange={e => update("personalInfo.summary", e.target.value)} style={{ minHeight: 140, width: '100%' }} />
      </Card>
    </div>
  );
}

function ExperienceSection({ resume, update }) {
  const items = resume.experience || [];
  const add = () => update("experience", [...items, { company: "", position: "", location: "", startDate: "", endDate: "", current: false, points: [""] }]);
  const remove = i => update("experience", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("experience", arr); };
  const setPoint = (i, j, v) => { const arr = [...items]; arr[i].points[j] = v; update("experience", arr); };
  const addPoint = i => { const arr = [...items]; arr[i].points = [...(arr[i].points || []), ""]; update("experience", arr); };
  
  const [optLoading, setOptLoading] = useState(null);
  
  const optimizePoints = async (idx) => {
    const rawText = items[idx].points?.join('\n');
    if (!rawText) {
      toast.error("No bullets found to optimize.");
      return;
    }
    setOptLoading(idx);
    try {
      const result = await aiService.improveResume("experience", rawText, resume.personalInfo?.jobTitle || "Software Engineer");
      const optimizedBullets = result.split('\n').map(l => l.replace(/^[•\-*\s]+/, '').trim()).filter(Boolean);
      const arr = [...items];
      arr[idx].points = optimizedBullets;
      update("experience", arr);
      toast.success("Experience bullets rewritten using active verbs!");
    } catch {
      toast.error("Could not optimize text.");
    } finally {
      setOptLoading(null);
    }
  };

  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="💼" title="Experience" desc="Detail your employment history." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add role</Btn>
      </div>
      {items.length === 0 && <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--text-3)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)", fontSize: 14 }}>No experience added yet.</div>}
      {items.map((exp, i) => (
        <Card key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--text)" }}>Role {i + 1}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn onClick={() => optimizePoints(i)} loading={optLoading === i} variant="gold" size="sm">AI Improve</Btn>
              <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14, marginBottom: 14 }}>
            <Field label="Company"><input placeholder="Acme Corp" value={exp.company} onChange={e => set(i, "company", e.target.value)} /></Field>
            <Field label="Position"><input placeholder="Senior Developer" value={exp.position} onChange={e => set(i, "position", e.target.value)} /></Field>
            <Field label="Start"><input placeholder="Jan 2022" value={exp.startDate} onChange={e => set(i, "startDate", e.target.value)} /></Field>
            <Field label="End"><input placeholder="Present" value={exp.endDate} onChange={e => set(i, "endDate", e.target.value)} /></Field>
            <Field label="Location"><input placeholder="Ahmedabad" value={exp.location || ""} onChange={e => set(i, "location", e.target.value)} /></Field>
          </div>
          <Field label="Bullet Points">
            {(exp.points || [""]).map((pt, j) => (
              <input key={j} placeholder={`Bullet point ${j + 1}…`} value={pt} onChange={e => setPoint(i, j, e.target.value)} style={{ marginBottom: 8, width: '100%' }} />
            ))}
            <div style={{ marginTop: 4 }}><Btn onClick={() => addPoint(i)} variant="ghost" size="sm">+ Add bullet</Btn></div>
          </Field>
        </Card>
      ))}
    </div>
  );
}

function EducationSection({ resume, update }) {
  const items = resume.education || [];
  const add = () => update("education", [...items, { institution: "", degree: "", startDate: "", endDate: "", gpa: "" }]);
  const remove = i => update("education", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("education", arr); };
  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="🎓" title="Education" desc="Add your academic degrees." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add</Btn>
      </div>
      {items.map((ed, i) => (
        <Card key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>Education {i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
            <Field label="Institution"><input placeholder="Gujarat Technological University" value={ed.institution} onChange={e => set(i, "institution", e.target.value)} /></Field>
            <Field label="Degree"><input placeholder="B.E. Computer Science" value={ed.degree} onChange={e => set(i, "degree", e.target.value)} /></Field>
            <Field label="Start"><input placeholder="2020" value={ed.startDate} onChange={e => set(i, "startDate", e.target.value)} /></Field>
            <Field label="End"><input placeholder="2024" value={ed.endDate} onChange={e => set(i, "endDate", e.target.value)} /></Field>
            <Field label="GPA"><input placeholder="8.5" value={ed.gpa || ""} onChange={e => set(i, "gpa", e.target.value)} /></Field>
          </div>
        </Card>
      ))}
    </div>
  );
}

function SkillsSection({ resume, update }) {
  const items = resume.skills || [];
  const add = () => update("skills", [...items, { category: "", items: [], rawItems: "" }]);
  const remove = i => update("skills", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("skills", arr); };
  const handleItems = (i, val) => { const arr = [...items]; arr[i] = { ...arr[i], rawItems: val, items: val.split(",").map(x => x.trim()).filter(Boolean) }; update("skills", arr); };
  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="⚡" title="Skills" desc="Categorize your technical skills." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add category</Btn>
      </div>
      {items.map((sk, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>Category {i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div className="g12">
            <input placeholder="Frontend" value={sk.category} onChange={e => set(i, "category", e.target.value)} />
            <input placeholder="React, Next.js, TailwindCSS" value={sk.rawItems !== undefined ? sk.rawItems : sk.items?.join(", ") || ""} onChange={e => handleItems(i, e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function ProjectsSection({ resume, update }) {
  const items = resume.projects || [];
  const add = () => update("projects", [...items, { name: "", description: "", techStack: [], rawTechStack: "", liveUrl: "", githubUrl: "" }]);
  const remove = i => update("projects", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("projects", arr); };
  const handleTech = (i, val) => { const arr = [...items]; arr[i] = { ...arr[i], rawTechStack: val, techStack: val.split(",").map(x => x.trim()).filter(Boolean) }; update("projects", arr); };
  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="🚀" title="Projects" desc="Showcase your software projects." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add project</Btn>
      </div>
      {items.map((pr, i) => (
        <Card key={i} style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>Project {i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field label="Name"><input placeholder="My Awesome App" value={pr.name} onChange={e => set(i, "name", e.target.value)} /></Field>
            <Field label="Description"><textarea placeholder="What it does, your role, impact…" value={pr.description} onChange={e => set(i, "description", e.target.value)} style={{ minHeight: 80, width: '100%' }} /></Field>
            <Field label="Tech Stack"><input placeholder="React, Node.js, MongoDB" value={pr.rawTechStack !== undefined ? pr.rawTechStack : pr.techStack?.join(", ") || ""} onChange={e => handleTech(i, e.target.value)} style={{ width: '100%' }} /></Field>
            <div className="g2">
              <Field label="GitHub"><input placeholder="github.com/user/repo" value={pr.githubUrl || ""} onChange={e => set(i, "githubUrl", e.target.value)} /></Field>
              <Field label="Live URL"><input placeholder="my-app.vercel.app" value={pr.liveUrl || ""} onChange={e => set(i, "liveUrl", e.target.value)} /></Field>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CertificationsSection({ resume, update }) {
  const items = resume.certifications || [];
  const add = () => update("certifications", [...items, { name: "", issuer: "", date: "" }]);
  const remove = i => update("certifications", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("certifications", arr); };
  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="🏆" title="Certifications" desc="Your technical credentials." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add</Btn>
      </div>
      {items.map((c, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>Cert {i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div className="g3">
            <input placeholder="AWS Solutions Architect" value={c.name} onChange={e => set(i, "name", e.target.value)} />
            <input placeholder="Amazon Web Services" value={c.issuer} onChange={e => set(i, "issuer", e.target.value)} />
            <input placeholder="Dec 2024" value={c.date} onChange={e => set(i, "date", e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function AchievementsSection({ resume, update }) {
  const items = resume.achievements || [];
  const add = () => update("achievements", [...items, ""]);
  const remove = i => update("achievements", items.filter((_, j) => j !== i));
  const set = (i, v) => { const arr = [...items]; arr[i] = v; update("achievements", arr); };
  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="🏅" title="Achievements" desc="Your professional achievements and honors." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add Achievement</Btn>
      </div>
      {items.length === 0 && <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--text-3)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)", fontSize: 14 }}>No achievements added yet.</div>}
      {items.map((ach, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>Achievement {i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <input placeholder="Won first place at CodeHack 2024 out of 500 participants" value={ach} onChange={e => set(i, e.target.value)} style={{ width: '100%' }} />
        </Card>
      ))}
    </div>
  );
}

function LanguagesSection({ resume, update }) {
  const items = resume.languages || [];
  const add = () => update("languages", [...items, { language: "", proficiency: "" }]);
  const remove = i => update("languages", items.filter((_, j) => j !== i));
  const set = (i, k, v) => { const arr = [...items]; arr[i] = { ...arr[i], [k]: v }; update("languages", arr); };
  return (
    <div>
      <div className="section-header-wrap">
        <SectionHeader icon="🗣" title="Languages" desc="Languages you speak and your proficiency levels." />
        <Btn onClick={add} variant="secondary" size="sm">+ Add Language</Btn>
      </div>
      {items.length === 0 && <div style={{ textAlign: "center", padding: "40px 24px", color: "var(--text-3)", border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)", fontSize: 14 }}>No languages added yet.</div>}
      {items.map((l, i) => (
        <Card key={i} style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontWeight: 600, fontSize: 13.5 }}>Language {i + 1}</span>
            <Btn onClick={() => remove(i)} variant="danger" size="sm">Remove</Btn>
          </div>
          <div className="g2">
            <input placeholder="English" value={l.language} onChange={e => set(i, "language", e.target.value)} />
            <input placeholder="Full Professional / Native" value={l.proficiency} onChange={e => set(i, "proficiency", e.target.value)} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function AtsCheckerPanel({ resumeData }) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleCheck = async () => {
    if (!jobDescription.trim()) {
      toast.error("Please enter a target job description to match.");
      return;
    }
    setLoading(true);
    try {
      const res = await aiService.checkAtsScore(resumeData, jobDescription);
      setResults(res);
      toast.success("ATS keyword match scan complete!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to run ATS scanner.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text)' }}>🔍 AI ATS Score Checker</h3>
      <p style={{ fontSize: 13, color: 'var(--text-2)', marginBottom: 16 }}>Paste the target job description below to scan your resume for keyword alignment.</p>
      
      <textarea
        placeholder="Paste job description here..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        style={{ minHeight: 120, width: '100%', marginBottom: 16 }}
      />
      
      <Btn onClick={handleCheck} loading={loading} variant="gold" size="md">
        Analyze ATS Score
      </Btn>

      {results && (
        <div style={{ marginTop: 20, borderTop: '1px solid var(--border)', paddingTop: 16 }} className="fadeUp">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%', 
              background: results.atsScore >= 70 ? 'var(--success-light)' : 'var(--danger-light)',
              color: results.atsScore >= 70 ? 'var(--success)' : 'var(--danger)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 800, border: `2px solid`
            }}>
              {results.atsScore}%
            </div>
            <div>
              <h4 style={{ fontWeight: 700 }}>ATS Compatibility Score</h4>
              <p style={{ fontSize: 12, color: 'var(--text-3)' }}>Aim for 75% or higher for optimal filtering chances.</p>
            </div>
          </div>

          <div className="ats-grid">
            <div>
              <h5 style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 6 }}>Missing Keywords:</h5>
              {results.missingKeywords?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {results.missingKeywords.map((kw, i) => (
                    <span key={i} style={{ background: 'var(--danger-light)', color: 'var(--danger)', fontSize: 11, padding: '3px 8px', borderRadius: 4 }}>
                      {kw}
                    </span>
                  ))}
                </div>
              ) : <p style={{ fontSize: 12, color: 'var(--text-3)' }}>None detected.</p>}
            </div>

            <div>
              <h5 style={{ fontWeight: 600, fontSize: 12, textTransform: 'uppercase', color: 'var(--text-2)', marginBottom: 6 }}>Improvements:</h5>
              <ul style={{ paddingLeft: 16, fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                {results.improvements?.map((imp, i) => <li key={i} style={{ marginBottom: 4 }}>{imp}</li>)}
              </ul>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function PreviewSection({ resume, update }) {
  const [scale, setScale] = useState(0.75);
  const [previewHeight, setPreviewHeight] = useState(1123);
  const containerRef = useRef(null);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const padding = window.innerWidth < 580 ? 16 : 48;
    const w = containerRef.current.offsetWidth - padding;
    const s = w < 794 ? w / 794 : 0.75;
    setScale(s);
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    
    let containerObserver;
    if (containerRef.current) {
      containerObserver = new ResizeObserver(updateScale);
      containerObserver.observe(containerRef.current);
    }

    const t = setTimeout(updateScale, 500);

    return () => {
      window.removeEventListener("resize", updateScale);
      if (containerObserver) containerObserver.disconnect();
      clearTimeout(t);
    };
  }, [updateScale]);

  useEffect(() => {
    const el = document.getElementById("resume-preview");
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setPreviewHeight(entry.target.offsetHeight || 1123);
      }
    });
    observer.observe(el);
    setPreviewHeight(el.offsetHeight || 1123);
    
    const t = setTimeout(() => {
      if (el) setPreviewHeight(el.offsetHeight || 1123);
    }, 300);

    return () => {
      observer.disconnect();
      clearTimeout(t);
    };
  }, [resume.template, resume]);

  const handleDownload = async () => {
    try {
      const el = document.getElementById("resume-preview");
      if (!window.html2pdf) {
        await new Promise((res, rej) => { const s = document.createElement("script"); s.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.9.3/html2pdf.bundle.min.js"; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
      }
      const wrap = el.parentElement;
      const old = wrap.style.transform;
      wrap.style.transform = "none"; wrap.style.height = "auto";
      await window.html2pdf().set({ margin: 0, filename: `${resume.title || 'resume'}.pdf`, image: { type: "jpeg", quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: "in", format: "a4", orientation: "portrait" } }).from(el).save();
      wrap.style.transform = old;
      toast.success("PDF exported!");
    } catch (err) { 
      console.error(err);
      toast.error("Export error"); 
    }
  };

  const SelectedTemplate = TEMPLATE_COMPONENTS[resume.template] || TEMPLATE_COMPONENTS.modern;

  return (
    <div>
      <SectionHeader icon="👁" title="Preview & Export" desc="Choose a template and export." />

      {/* Template grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 8, marginBottom: 24 }}>
        {TEMPLATE_LIST.map(t => (
          <button key={t.id} className={`tpl-card ${resume.template === t.id ? "selected" : ""}`} onClick={() => update("template", t.id)}>
            <span style={{ fontSize: 20, color: resume.template === t.id ? "var(--accent-2)" : "var(--text-3)" }}>{t.icon}</span>
            <span style={{ fontSize: 11.5, fontWeight: 600, color: resume.template === t.id ? "var(--accent-2)" : "var(--text-2)", display: "block", marginTop: 4 }}>{t.label}</span>
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <Btn onClick={() => window.print()} variant="secondary">Print</Btn>
        <Btn onClick={handleDownload} variant="primary">↓ Export PDF</Btn>
      </div>

      {/* Preview frame */}
      <div ref={containerRef} className="preview-frame-container">
        <div style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "100%", display: "flex", justifyContent: "center", height: `${previewHeight * scale}px`, transition: "transform 0.2s ease, height 0.2s ease" }}>
          <div style={{ display: "inline-block", width: "794px", textAlign: "left", flexShrink: 0 }}>
            <SelectedTemplate data={resume} />
          </div>
        </div>
      </div>

      {/* ATS Checker */}
      <AtsCheckerPanel resumeData={resume} />
    </div>
  );
}

export default function BuilderPage({ dark, setDark }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [activeSection, setActiveSection] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const autoRef = useRef(null);

  useEffect(() => {
    const loadResume = async () => {
      try {
        const data = await resumeService.getById(id);
        setResume(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load resume details.");
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    loadResume();
  }, [id, navigate]);

  const update = useCallback((path, value) => {
    setResume(prev => {
      if (!prev) return prev;
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  }, []);

  // Auto-save debouncer
  useEffect(() => {
    if (!resume || loading) return;
    clearTimeout(autoRef.current);
    autoRef.current = setTimeout(async () => {
      try {
        await resumeService.update(id, resume);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      } catch (err) {
        console.error("Auto-save error:", err);
      }
    }, 1500);
    return () => clearTimeout(autoRef.current);
  }, [resume, id, loading]);

  const SECTIONS = [
    { id: "personal", label: "Personal", icon: "👤" },
    { id: "summary", label: "Summary", icon: "✍" },
    { id: "experience", label: "Experience", icon: "💼" },
    { id: "education", label: "Education", icon: "🎓" },
    { id: "skills", label: "Skills", icon: "⚡" },
    { id: "projects", label: "Projects", icon: "🚀" },
    { id: "certifications", label: "Certifications", icon: "🏆" },
    { id: "achievements", label: "Achievements", icon: "🏅" },
    { id: "languages", label: "Languages", icon: "🗣" },
    { id: "preview", label: "Preview & Export", icon: "👁" },
  ];

  const sectionComponents = {
    personal: resume ? <PersonalSection resume={resume} update={update} /> : null,
    summary: resume ? <SummarySection resume={resume} update={update} /> : null,
    experience: resume ? <ExperienceSection resume={resume} update={update} /> : null,
    education: resume ? <EducationSection resume={resume} update={update} /> : null,
    skills: resume ? <SkillsSection resume={resume} update={update} /> : null,
    projects: resume ? <ProjectsSection resume={resume} update={update} /> : null,
    certifications: resume ? <CertificationsSection resume={resume} update={update} /> : null,
    achievements: resume ? <AchievementsSection resume={resume} update={update} /> : null,
    languages: resume ? <LanguagesSection resume={resume} update={update} /> : null,
    preview: resume ? <PreviewSection resume={resume} update={update} /> : null,
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', color: 'var(--text)' }}>
        <div className="spin-anim" style={{ fontSize: 24 }}>↻</div>
        <span style={{ marginLeft: 10, fontSize: 16 }}>Loading resume content...</span>
      </div>
    );
  }

  return (
    <div className="builder-wrap app-root">
      {/* Sidebar */}
      <aside className="builder-side">
        {/* Logo */}
        <div style={{ padding: "18px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/image.png" alt="AI Resume Maker Logo" style={{ width: 20, height: 20, borderRadius: 4, objectFit: 'contain' }} />
          <span className="display" style={{ fontWeight: 400, fontSize: 16, color: "var(--text)" }}>Resume Builder</span>
        </div>

        {/* Title input */}
        <div style={{ padding: "12px 14px", borderBottom: "1px solid var(--border)" }}>
          <input value={resume?.title || ""} onChange={e => update("title", e.target.value)}
            style={{ fontSize: 12.5, height: 34, fontWeight: 500, padding: "7px 11px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 8, width: '100%' }}
            placeholder="Resume title" />
        </div>

        {/* Nav */}
        <nav className="side-nav" style={{ flex: 1, overflowY: "auto", padding: "10px" }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActiveSection(s.id)} className={`nav-pill ${activeSection === s.id ? "active" : ""}`}>
              <span style={{ fontSize: 13 }}>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="side-footer" style={{ padding: "14px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: 'flex', background: "var(--surface-2)", borderRadius: "8px", padding: "3px", border: "1px solid var(--border)" }}>
            <button className={`mode-toggle-btn ${!dark ? "on" : "off"}`} onClick={() => setDark(false)} style={{ border: 'none', background: !dark ? 'var(--surface)' : 'transparent', padding: '5px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer', color: !dark ? 'var(--text)' : 'var(--text-3)', flex: 1 }}>Light</button>
            <button className={`mode-toggle-btn ${dark ? "on" : "off"}`} onClick={() => setDark(true)} style={{ border: 'none', background: dark ? 'var(--surface)' : 'transparent', padding: '5px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer', color: dark ? 'var(--text)' : 'var(--text-3)', flex: 1 }}>Dark</button>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn onClick={async () => {
              try {
                await resumeService.update(id, resume);
                toast.success("Progress saved!");
                navigate('/');
              } catch {
                toast.error("Failed to save progress.");
              }
            }} size="sm" variant="primary" style={{ flex: 1 }}>Save & Exit</Btn>
            <Btn onClick={async () => {
              try {
                await resumeService.update(id, resume);
              } catch (err) {
                console.error("Save on exit error:", err);
              }
              navigate('/');
            }} size="sm" variant="secondary" style={{ flex: 1 }}>Exit</Btn>
          </div>
          {saved && <p style={{ fontSize: 11, color: "var(--success)", fontWeight: 600, textAlign: "center" }}>✓ Saved to Cloud</p>}
        </div>
      </aside>

      {/* Main */}
      <main className="builder-body">
        <div className="builder-content fadeUp">
          {sectionComponents[activeSection]}
        </div>
      </main>
    </div>
  );
}
