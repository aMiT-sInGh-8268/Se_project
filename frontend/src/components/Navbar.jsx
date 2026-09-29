import React from 'react';

export default function Navbar({ healthStatus }) {
  const isHealthy = healthStatus && healthStatus.status === 'OK';

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div>
            <h1 className="brand-title">TaskFlow</h1>
            <p className="brand-subtitle">Cloud-Based Task Management System</p>
          </div>
        </div>

        <div className="navbar-badges">
          <div className="tech-badge docker-badge" title="Docker Containerized">
            <span className="badge-dot"></span>
            <span>Docker</span>
          </div>
          <div className="tech-badge k8s-badge" title="Kubernetes Orchestrated">
            <span className="badge-dot"></span>
            <span>Kubernetes</span>
          </div>
          <div className="tech-badge aws-badge" title="AWS Cloud Ready">
            <span className="badge-dot"></span>
            <span>AWS EC2</span>
          </div>
          <div className={`health-indicator ${isHealthy ? 'healthy' : 'unhealthy'}`}>
            <span className="pulse-dot"></span>
            <span>{isHealthy ? 'Backend Online' : 'Connecting...'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
