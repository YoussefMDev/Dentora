import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';

const app = createApp({ webOrigin: 'http://localhost:4200' });

describe('API behavior', () => {
  it('returns only the public health status', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns a generic not-found response for unknown routes', async () => {
    const response = await request(app).get('/api/private').expect(404);
    expect(response.body.error.code).toBe('NOT_FOUND');
    expect(JSON.stringify(response.body)).not.toContain('stack');
  });

  it('rejects malformed JSON without exposing parser internals', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{broken')
      .expect(400);

    expect(response.body).toEqual({
      error: { code: 'BAD_REQUEST', message: 'Request could not be processed.' },
    });
    expect(JSON.stringify(response.body)).not.toContain('SyntaxError');
  });

  it('rejects bodies larger than the configured limit', async () => {
    const response = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send(JSON.stringify({ value: 'x'.repeat(17 * 1024) }))
      .expect(413);

    expect(response.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });
});

describe('CORS behavior', () => {
  it('grants the configured origin and does not allow credentials yet', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:4200')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:4200');
    expect(response.headers['access-control-allow-credentials']).toBeUndefined();
  });

  it('does not grant an unapproved origin access to read the response', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'https://untrusted.example')
      .expect(200);

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('answers preflight only for the configured origin and read methods', async () => {
    const allowed = await request(app)
      .options('/api/health')
      .set('Origin', 'http://localhost:4200')
      .set('Access-Control-Request-Method', 'GET')
      .expect(204);
    expect(allowed.headers['access-control-allow-origin']).toBe('http://localhost:4200');
    expect(allowed.headers['access-control-allow-methods']).toContain('GET');

    const denied = await request(app)
      .options('/api/health')
      .set('Origin', 'https://untrusted.example')
      .set('Access-Control-Request-Method', 'GET')
      .expect(200);
    expect(denied.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('security headers', () => {
  it('sends protective headers on API responses', async () => {
    const response = await request(app).get('/api/health').expect(200);
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(response.headers['content-security-policy']).toContain("default-src 'self'");
    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
