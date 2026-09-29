import React from 'react';

export default function TaskStats({ tasks }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-value">{total}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      <div className="stat-card stat-pending">
        <div className="stat-value">{pending}</div>
        <div className="stat-label">Pending</div>
      </div>
      <div className="stat-card stat-progress">
        <div className="stat-value">{inProgress}</div>
        <div className="stat-label">In Progress</div>
      </div>
      <div className="stat-card stat-completed">
        <div className="stat-value">{completed}</div>
        <div className="stat-label">Completed ({percent}%)</div>
      </div>
    </div>
  );
}
