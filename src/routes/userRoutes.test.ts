import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import { createUserRouter } from './userRoutes.js';
import { UserService } from '../services/UserService.js';
import request from 'supertest';

const mockUserService = {
  createUser: vi.fn(),
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

describe('POST /users (unit, mocked db)', () => {
  beforeEach(() => {
    mockUserService.createUser.mockReset();
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
    const res = await request(app)
      .post('/users')
      .send(validUser)
      .expect(201);
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
    const emailError = res.body.details.find((d: any) => d.field === 'email');
    expect(emailError).toBeDefined();
    expect(emailError.errors).toContain('email must be an email');
    expect(mockUserService.createUser).not.toHaveBeenCalled();
  });
});

it('should return 500 if userService.createUser throws', async () => {
    mockUserService.createUser.mockRejectedValue(new Error('DB error'));
    const res = await request(app)
      .post('/users')
      .send(validUser)
      .expect(500);
    expect(res.body).toHaveProperty('error', 'Failed to create user');
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toMatch(/DB error/);
  });