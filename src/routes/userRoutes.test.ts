import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import { createUserRouter } from './userRoutes.js';
import { UserService } from '../services/UserService.js';
import request from 'supertest';

const mockUserService = {
  createUser: vi.fn(),
  deleteUser: vi.fn(),
};

const app = express();
app.use(express.json());
app.use('/users', createUserRouter(mockUserService as unknown as UserService));

const validUser = {
  firstName: 'Test',
  lastName: 'User',
  email: 'testuser@example.com',
  dateOfBirth: '2000-01-01',
  location: 'Test City',
  timezone: 'UTC',
};

describe('Create User', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a user with valid data', async () => {
    mockUserService.createUser.mockResolvedValue({
      id: 1,
      first_name: validUser.firstName,
      last_name: validUser.lastName,
      email: validUser.email,
      date_of_birth: validUser.dateOfBirth,
      location: validUser.location,
      timezone: validUser.timezone,
      created_at: new Date(),
      updated_at: new Date(),
    });
    const res = await request(app).post('/users').send(validUser).expect(201);
    expect(res.body).toMatchObject({
      firstName: validUser.firstName,
      lastName: validUser.lastName,
      email: validUser.email,
      dateOfBirth: validUser.dateOfBirth,
      location: validUser.location,
      timezone: validUser.timezone,
    });
    expect(mockUserService.createUser).toHaveBeenCalledWith(validUser);
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/users')
      .send({ ...validUser, email: 'not-an-email' })
      .expect(400);
    expect(res.body).toHaveProperty('error', 'Validation failed');
    expect(res.body).toHaveProperty('details');
    expect(Array.isArray(res.body.details)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const emailError = res.body.details.find((d: any) => d.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.errors).toContain('email must be an email');
    expect(mockUserService.createUser).not.toHaveBeenCalled();
  });

  it('should return 500 if userService.createUser throws', async () => {
    mockUserService.createUser.mockRejectedValue(new Error('DB error'));
    const res = await request(app).post('/users').send(validUser).expect(500);
    expect(res.body).toHaveProperty('error', 'Failed to create user');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/DB error/);
  });
});

describe('Delete User', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete a user successfully', async () => {
    mockUserService.deleteUser.mockResolvedValue({ id: 1 });
    const res = await request(app).delete('/users/1').expect(200);
    expect(res.body).toHaveProperty('message', 'User with id 1 deleted successfully');
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should return 404 if user not found', async () => {
    mockUserService.deleteUser.mockResolvedValue(null);
    const res = await request(app).delete('/users/123').expect(404);
    expect(res.body).toHaveProperty('error', 'User with id 123 not found');
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(123);
  });

  it('should return 400 if id is 0', async () => {
    const res = await request(app).delete('/users/0').expect(400);
    expect(res.body).toHaveProperty('error', 'Cannot delete user with id 0');
    expect(mockUserService.deleteUser).not.toHaveBeenCalled();
  });

  it('should return 500 if deleteUser throws', async () => {
    mockUserService.deleteUser.mockRejectedValue(new Error('DB error'));
    const res = await request(app).delete('/users/2').expect(500);
    expect(res.body).toHaveProperty('error', 'Failed to delete user');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/DB error/);
    expect(mockUserService.deleteUser).toHaveBeenCalledWith(2);
  });
});
