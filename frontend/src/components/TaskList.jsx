import React, { useState } from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, loading, onUpdate, onDelete }) {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = filter === 'all' || task.status === filter;
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="card task-list-card">
      <div className="card-header task-list-header">
        <h2 className="card-title">
          <span className="card-icon">📋</span>
          Your Tasks ({filteredTasks.length})
        </h2>

        <div className="filter-controls">
          <input
            type="text"
            className="search-input"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="filter-tabs">
            {['all', 'pending', 'in-progress', 'completed'].map((tab) => (
              <button
                key={tab}
                type="button"
                className={`filter-tab ${filter === tab ? 'active' : ''}`}
                onClick={() => setFilter(tab)}
              >
                {tab === 'all' ? 'All' : tab === 'in-progress' ? 'In Progress' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="task-list-body">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading tasks from cloud...</p>
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No tasks found</h3>
            <p>
              {search || filter !== 'all'
                ? 'Try adjusting your search or status filter.'
                : 'Create your first task using the form above to get started!'}
            </p>
          </div>
        ) : (
          <div className="tasks-container">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task._id || task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
