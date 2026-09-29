/**
 * TaskFlow API Service
 * Centralized client for Backend REST API communication
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Common fetch helper with error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error.message);
    throw error;
  }
}

export const taskApi = {
  // Check backend health
  checkHealth: async () => {
    return request('/health');
  },

  // Get all tasks (optional status filter: 'pending', 'in-progress', 'completed')
  getTasks: async (status = '') => {
    const query = status ? `?status=${encodeURIComponent(status)}` : '';
    return request(`/tasks${query}`);
  },

  // Get single task by ID
  getTaskById: async (id) => {
    return request(`/tasks/${id}`);
  },

  // Create new task
  createTask: async (taskData) => {
    return request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update task by ID
  updateTask: async (id, taskData) => {
    return request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete task by ID
  deleteTask: async (id) => {
    return request(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
