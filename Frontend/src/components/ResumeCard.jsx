import React, { useState } from 'react';
import Card from './Card';
import Btn from './Btn';

export default function ResumeCard({ resume, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${resume.title || 'Untitled'}"?`)) {
      setDeleting(true);
      try {
        await onDelete(resume._id || resume.id);
      } catch (err) {
        console.error('Delete error:', err);
      } finally {
        setDeleting(false);
      }
    }
  };

  const formattedDate = resume.updatedAt 
    ? new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown Date';

  return (
    <Card className="lift" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }} onClick={() => onEdit(resume)}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>📄</span>
          <span className="tag" style={{ background: "var(--accent-light)", color: "var(--accent)" }}>
            {resume.template || 'modern'}
          </span>
        </div>
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6, color: "var(--text)" }}>
          {resume.title || 'Untitled Resume'}
        </h3>
        <p style={{ color: "var(--text-3)", fontSize: 12, marginBottom: 16 }}>
          Edited {formattedDate}
        </p>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 'auto' }}>
        <Btn size="sm" variant="secondary" style={{ flex: 1 }} onClick={(e) => { e.stopPropagation(); onEdit(resume); }}>
          Edit
        </Btn>
        <Btn size="sm" variant="danger" onClick={handleDelete} loading={deleting} style={{ padding: '7px 10px' }}>
          Delete
        </Btn>
      </div>
    </Card>
  );
}
