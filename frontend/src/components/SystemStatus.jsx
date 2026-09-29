import React from 'react';

export default function SystemStatus({ health, onRefresh, pingTime }) {
  if (!health) {
    return (
      <div className="card system-status-card connecting">
        <p>🔄 Probing Backend Health (GET /api/health)...</p>
      </div>
    );
  }

  const isHealthy = health.status === 'OK';
  const dbConnected = health.database && health.database.connected;

  return (
    <div className="card system-status-card">
      <div className="system-status-header">
        <div className="status-title-group">
          <span className={`status-indicator-dot ${isHealthy ? 'live' : 'offline'}`}></span>
          <h3 className="system-status-title">System Architecture Health</h3>
        </div>
        <button
          type="button"
          className="btn btn-sm btn-outline"
          onClick={onRefresh}
          title="Ping backend health endpoint"
        >
          🔄 Refresh Status
        </button>
      </div>

      <div className="system-status-grid">
        <div className="status-pill">
          <span className="pill-label">API Service:</span>
          <span className={`pill-value ${isHealthy ? 'text-success' : 'text-danger'}`}>
            {health.service || 'Unknown'}
          </span>
        </div>

        <div className="status-pill">
          <span className="pill-label">MongoDB:</span>
          <span className={`pill-value ${dbConnected ? 'text-success' : 'text-warning'}`}>
            {health.database ? health.database.status : 'Connecting'}
          </span>
        </div>

        <div className="status-pill">
          <span className="pill-label">Uptime:</span>
          <span className="pill-value text-info">
            {health.uptime || 'N/A'}
          </span>
        </div>

        <div className="status-pill">
          <span className="pill-label">Latency:</span>
          <span className="pill-value text-accent">
            {pingTime ? `${pingTime}ms` : '< 10ms'}
          </span>
        </div>
      </div>
    </div>
  );
}
