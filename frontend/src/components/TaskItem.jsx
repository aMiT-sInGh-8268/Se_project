import React, { useState } from 'react';

export default function TaskItem({ task, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || '');
  const [editStatus, setEditStatus] = useState(task.status);
  const [editPriority, setEditPriority] = useState(task.priority || 'medium');
  const [isSaving, setIsSaving] = useState(false);

  const isCompleted = task.status === 'completed';

  const handleToggleComplete = async () => {
    const nextStatus = isCompleted ? 'pending' : 'completed';
    await onUpdate(task._id || task.id, { status: nextStatus });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    setIsSaving(true);
    const success = await onUpdate(task._id || task.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      status: editStatus,
      priority: editPriority,
    });
    setIsSaving(false);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditTitle(task.title);
    setEditDesc(task.description || '');
    setEditStatus(task.status);
    setEditPriority(task.priority || 'medium');
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="task-item editing">
        <form onSubmit={handleSaveEdit} className="edit-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Task Title"
              required
            />
          </div>
          <div className="form-group">
            <textarea
              className="form-textarea"
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              placeholder="Task Description"
              rows={2}
            />
          </div>
          <div className="form-row">
            <select
              className="form-select"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              className="form-select"
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
          </div>
          <div className="task-actions-row">
            <button type="submit" className="btn btn-sm btn-success" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className={`task-item ${isCompleted ? 'completed-item' : ''}`}>
      <div className="task-header-row">
        <div className="task-checkbox-wrapper">
          <button
            type="button"
            className={`checkbox-custom ${isCompleted ? 'checked' : ''}`}
            onClick={handleToggleComplete}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
          >
            {isCompleted && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </button>
          <div className="task-title-group">
            <h3 className={`task-title ${isCompleted ? 'line-through' : ''}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="task-description">{task.description}</p>
            )}
          </div>
        </div>

        <div className="task-meta-tags">
          <span className={`priority-tag priority-${task.priority || 'medium'}`}>
            {task.priority || 'medium'}
          </span>
          <span className={`status-tag status-${task.status}`}>
            {task.status}
          </span>
        </div>
      </div>

      <div className="task-footer-row">
        <div className="task-timestamp">
          Created: {new Date(task.createdAt || Date.now()).toLocaleDateString()}
        </div>
        <div className="task-buttons">
          <button
            type="button"
            className="btn-icon btn-edit"
            onClick={() => setIsEditing(true)}
            title="Edit task"
          >
            ✏️ Edit
          </button>
          <button
            type="button"
            className="btn-icon btn-delete"
            onClick={() => {
              if (window.confirm(`Delete task "${task.title}"?`)) {
                onDelete(task._id || task.id);
              }
            }}
            title="Delete task"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
