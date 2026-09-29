const request = require('supertest');
const app = require('../src/app');
const Task = require('../src/models/Task');

// Mock Mongoose Task model
jest.mock('../src/models/Task');

describe('TaskFlow Backend API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  // ==========================================
  // Health Check Endpoint
  // ==========================================
  describe('GET /api/health', () => {
    it('should return 200 OK with expected JSON structure', async () => {
      const res = await request(app).get('/api/health');

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('service', 'TaskFlow Backend');
      expect(res.body).toHaveProperty('uptime');
      expect(res.body).toHaveProperty('database');
    });
  });

  // ==========================================
  // GET /api/tasks
  // ==========================================
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const mockTasks = [
        { _id: '507f1f77bcf86cd799439011', title: 'Task 1', status: 'pending', priority: 'medium' },
        { _id: '507f1f77bcf86cd799439012', title: 'Task 2', status: 'completed', priority: 'high' },
      ];

      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockTasks),
      });

      const res = await request(app).get('/api/tasks');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(2);
      expect(res.body.data).toEqual(mockTasks);
    });

    it('should filter tasks by status', async () => {
      const mockCompleted = [
        { _id: '507f1f77bcf86cd799439012', title: 'Task 2', status: 'completed' },
      ];

      Task.find.mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockCompleted),
      });

      const res = await request(app).get('/api/tasks?status=completed');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(Task.find).toHaveBeenCalledWith({ status: 'completed' });
    });
  });

  // ==========================================
  // GET /api/tasks/:id
  // ==========================================
  describe('GET /api/tasks/:id', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should return a task by valid ID', async () => {
      const mockTask = {
        _id: validId,
        title: 'Inspect Docker Logs',
        description: 'Run docker compose logs',
        status: 'pending',
      };

      Task.findById.mockResolvedValue(mockTask);

      const res = await request(app).get(`/api/tasks/${validId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Inspect Docker Logs');
    });

    it('should return 400 for invalid ID format', async () => {
      const res = await request(app).get('/api/tasks/invalid-id-format');

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Invalid task ID');
    });

    it('should return 404 if task not found', async () => {
      Task.findById.mockResolvedValue(null);

      const res = await request(app).get(`/api/tasks/${validId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================
  // POST /api/tasks
  // ==========================================
  describe('POST /api/tasks', () => {
    it('should create a task successfully', async () => {
      const newTaskData = {
        title: 'Learn Kubernetes Architecture',
        description: 'Understand Pods and Services',
        priority: 'high',
      };

      const createdTask = {
        _id: '507f1f77bcf86cd799439011',
        ...newTaskData,
        status: 'pending',
      };

      Task.create.mockResolvedValue(createdTask);

      const res = await request(app)
        .post('/api/tasks')
        .send(newTaskData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(newTaskData.title);
      expect(res.body.message).toBe('Task created successfully');
    });

    it('should return 400 if title is missing', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toContain('Task title is required');
    });
  });

  // ==========================================
  // PUT /api/tasks/:id
  // ==========================================
  describe('PUT /api/tasks/:id', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should update task successfully', async () => {
      const updatedTask = {
        _id: validId,
        title: 'Updated Title',
        status: 'completed',
      };

      Task.findByIdAndUpdate.mockResolvedValue(updatedTask);

      const res = await request(app)
        .put(`/api/tasks/${validId}`)
        .send({ title: 'Updated Title', status: 'completed' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Updated Title');
      expect(res.body.data.status).toBe('completed');
    });

    it('should return 404 if updating non-existent task', async () => {
      Task.findByIdAndUpdate.mockResolvedValue(null);

      const res = await request(app)
        .put(`/api/tasks/${validId}`)
        .send({ title: 'Updated' });

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  // ==========================================
  // DELETE /api/tasks/:id
  // ==========================================
  describe('DELETE /api/tasks/:id', () => {
    const validId = '507f1f77bcf86cd799439011';

    it('should delete task successfully', async () => {
      Task.findByIdAndDelete.mockResolvedValue({ _id: validId });

      const res = await request(app).delete(`/api/tasks/${validId}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Task deleted successfully');
    });

    it('should return 404 if deleting non-existent task', async () => {
      Task.findByIdAndDelete.mockResolvedValue(null);

      const res = await request(app).delete(`/api/tasks/${validId}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });
});
