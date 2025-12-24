import request from 'supertest';
import { app } from './server';

describe('API Endpoints', () => {
  it('GET / should return service message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User Wishes Service API');
  });

  it('GET /health should return ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});
