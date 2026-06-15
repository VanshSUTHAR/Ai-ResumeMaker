import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import resumeService from '../services/resumeService';
import ResumeCard from '../components/ResumeCard';
import Btn from '../components/Btn';
import { toast } from '../components/Toast';

export default function DashboardPage({ dark, setDark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const data = await resumeService.getAll();
      setResumes(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch resumes from database.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNew = async () => {
    try {
      const emptyResume = {
        title: "Untitled Resume",
        template: "modern",
        personalInfo: {
          fullName: user?.name || "",
          email: user?.email || "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          website: "",
          summary: ""
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        languages: []
      };
      const created = await resumeService.create(emptyResume);
      toast.success("New resume template initialized!");
      navigate(`/builder/${created._id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to initialize new resume.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await resumeService.delete(id);
      setResumes((prev) => prev.filter((r) => r._id !== id && r.id !== id));
      toast.success("Resume deleted.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete resume.");
      throw err;
    }
  };



  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Navbar */}
      <header className="db-header">
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <img src="/image.png" alt="AI Resume Maker Logo" style={{ width: 24, height: 24, borderRadius: 6, objectFit: 'contain' }} />
          <span className="display" style={{ fontWeight: 700, fontSize: 18, color: "var(--text)" }}>AI Resume Maker</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: 'flex', background: "var(--surface-2)", borderRadius: "8px", padding: "3px", border: "1px solid var(--border)" }}>
            <button className={`mode-toggle-btn ${!dark ? "on" : "off"}`} onClick={() => setDark(false)} style={{ border: 'none', background: !dark ? 'var(--surface)' : 'transparent', padding: '5px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer', color: !dark ? 'var(--text)' : 'var(--text-3)' }}>Light</button>
            <button className={`mode-toggle-btn ${dark ? "on" : "off"}`} onClick={() => setDark(true)} style={{ border: 'none', background: dark ? 'var(--surface)' : 'transparent', padding: '5px 10px', fontSize: 11, borderRadius: 6, cursor: 'pointer', color: dark ? 'var(--text)' : 'var(--text-3)' }}>Dark</button>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="user-details" style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ fontSize: 11, color: "var(--text-3)" }}>{user?.email}</div>
            </div>
            <Btn onClick={logout} size="sm" variant="secondary">Sign out</Btn>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="db-hero fadeUp">
        <div className="hero-row">
          <div>
            <h1 className="display" style={{ fontSize: 36, fontWeight: 300, marginBottom: 8, color: "var(--text)" }}>
              Welcome back, <em style={{ color: "var(--accent-2)" }}>{user?.name}</em>
            </h1>
            <p style={{ color: "var(--text-2)", fontSize: 14.5 }}>Select a resume to edit, or import a file to restructure with AI.</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Btn onClick={handleCreateNew} variant="gold" size="md">
              ✦ Create From Scratch
            </Btn>
          </div>
        </div>

        {/* Resume grid list */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: 'column', alignItems: "center", justifyContent: "center", padding: "80px 0", color: 'var(--text-2)' }}>
            <div className="spin-anim" style={{ fontSize: 32, marginBottom: 16 }}>↻</div>
            <span>Fetching your saved resumes...</span>
          </div>
        ) : resumes.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "64px 32px",
            border: "1.5px dashed var(--border)", borderRadius: "var(--radius-lg)",
            background: "var(--surface)", marginTop: 20
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📂</div>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>No Resumes Yet</h3>
            <p style={{ color: "var(--text-3)", fontSize: 14, maxWidth: 400, margin: "0 auto 24px" }}>
              Start by building a new resume from scratch.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <Btn onClick={handleCreateNew} variant="gold">Create New</Btn>
            </div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 24 }}>
            {resumes.map((r) => (
              <div key={r._id || r.id}>
                <ResumeCard
                  resume={r}
                  onEdit={(res) => navigate(`/builder/${res._id || res.id}`)}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </div>


    </div>
  );
}
