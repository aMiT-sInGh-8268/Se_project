import React, { useState } from 'react';

export default function TaskForm({ onTaskCreated, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a task title');
      return;
    }

    setError('');
    const success = await onTaskCreated({
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
    });

    if (success) {
      setTitle('');
      setDescription('');
      setPriority('medium');
      setStatus('pending');
    }
  };

  return (
    <div className="card task-form-card">
      <div className="card-header">
        <h2 className="card-title">
          <span className="card-icon">➕</span>
          Add New Task
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="task-form">
        {error && <div className="form-error-banner">{error}</div>}

        <div className="form-group">
          <label htmlFor="task-title">Task Title *</label>
          <input
            id="task-title"
            type="text"
            className="form-input"
            placeholder="e.g. Configure Kubernetes Ingress on AWS"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={isSubmitting}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="task-desc">Description (Optional)</label>
          <textarea
            id="task-desc"
            className="form-textarea"
            placeholder="Add details, steps, or notes about this task..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSubmitting}
            maxLength={500}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              className="form-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🔴 High</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="task-status">Initial Status</label>
            <select
              id="task-status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="pending">⏳ Pending</option>
              <option value="in-progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}
