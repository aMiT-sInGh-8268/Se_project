import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TaskStats from './components/TaskStats';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import SystemStatus from './components/SystemStatus';
import { taskApi } from './services/api';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [health, setHealth] = useState(null);
  const [pingTime, setPingTime] = useState(null);

  // Initial load
  useEffect(() => {
    fetchHealth();
    fetchTasks();

    // Check health every 15 seconds
    const interval = setInterval(() => {
      fetchHealth();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const fetchHealth = async () => {
    const start = Date.now();
    try {
      const data = await taskApi.checkHealth();
      setHealth(data);
      setPingTime(Date.now() - start);
    } catch {
      setHealth({
        status: 'DISCONNECTED',
        service: 'TaskFlow Backend (Offline)',
        database: { status: 'Disconnected', connected: false },
        uptime: '0s',
      });
      setPingTime(null);
    }
  };

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await taskApi.getTasks();
      if (res && res.data) {
        setTasks(res.data);
      }
    } catch (error) {
      console.warn('Could not fetch tasks from server:', error.message);
      // Fallback local initial state if server is not yet running
      if (tasks.length === 0) {
        setTasks([
          {
            _id: 'demo-1',
            title: 'Welcome to TaskFlow DevOps Demonstration',
            description: 'Containerized with Docker, deployed to Kubernetes, CI/CD with GitHub Actions.',
            status: 'completed',
            priority: 'high',
            createdAt: new Date().toISOString(),
          },
          {
            _id: 'demo-2',
            title: 'Verify Kubernetes Pods & Services',
            description: 'Run `kubectl get pods -n taskflow` on AWS EC2 to verify all replicas.',
            status: 'in-progress',
            priority: 'medium',
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    setIsSubmitting(true);
    try {
      const res = await taskApi.createTask(taskData);
      if (res && res.data) {
        setTasks((prev) => [res.data, ...prev]);
      }
      return true;
    } catch {
      // Local fallback for offline mode
      const localTask = {
        _id: `local-${Date.now()}`,
        ...taskData,
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [localTask, ...prev]);
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const res = await taskApi.updateTask(id, updates);
      if (res && res.data) {
        setTasks((prev) =>
          prev.map((t) => ((t._id || t.id) === id ? res.data : t))
        );
      }
      return true;
    } catch {
      // Local fallback
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === id ? { ...t, ...updates } : t))
      );
      return true;
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskApi.deleteTask(id);
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      return true;
    } catch {
      // Local fallback
      setTasks((prev) => prev.filter((t) => (t._id || t.id) !== id));
      return true;
    }
  };

  return (
    <div className="app-container">
      <Navbar healthStatus={health} />

      <main className="main-content">
        <TaskStats tasks={tasks} />

        <div className="dashboard-grid">
          <div className="sidebar-col">
            <TaskForm
              onTaskCreated={handleCreateTask}
              isSubmitting={isSubmitting}
            />
          </div>

          <div className="main-col">
            <TaskList
              tasks={tasks}
              loading={loading}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
            />
          </div>
        </div>

        <SystemStatus
          health={health}
          onRefresh={fetchHealth}
          pingTime={pingTime}
        />
      </main>

      <footer className="app-footer">
        <p>
          TaskFlow – Cloud-Based Task Management System &bull; SEA College DevOps Project &bull;{' '}
          <a href="https://github.com/aMiT-sInGh-8268/Se_project" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
        </p>
      </footer>
    </div>
  );
}
