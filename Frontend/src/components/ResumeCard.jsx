import React, { useState } from 'react';
import Swal from 'sweetalert2';
import Card from './Card';
import Btn from './Btn';

export default function ResumeCard({ resume, onEdit, onDelete }) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    Swal.fire({
      title: 'Delete Resume?',
      text: `Are you sure you want to delete "${resume.title || 'Untitled'}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: 'var(--danger, #d32f2f)',
      cancelButtonColor: 'var(--text-3, #777777)',
      confirmButtonText: 'Yes, Delete',
      cancelButtonText: 'Cancel',
      background: 'var(--surface, #ffffff)',
      color: 'var(--text, #000000)',
      iconColor: '#d32f2f',
    }).then(async (result) => {
      if (result.isConfirmed) {
        setDeleting(true);
        try {
          await onDelete(resume._id || resume.id);
          Swal.fire({
            title: 'Deleted!',
            text: 'Your resume has been deleted.',
            icon: 'success',
            confirmButtonColor: 'var(--accent-2, #C8A96E)',
            background: 'var(--surface, #ffffff)',
            color: 'var(--text, #000000)',
          });
        } catch (err) {
          console.error('Delete error:', err);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete the resume.',
            icon: 'error',
            confirmButtonColor: 'var(--accent-2, #C8A96E)',
            background: 'var(--surface, #ffffff)',
            color: 'var(--text, #000000)',
          });
        } finally {
          setDeleting(false);
        }
      }
    });
  };

  const formattedDate = resume.updatedAt 
    ? new Date(resume.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : 'Unknown Date';

  return (
    <Card className="lift" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }} onClick={() => onEdit(resume)}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <img src="/image.png" alt="AI Resume Maker Logo" style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'contain' }} />
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
