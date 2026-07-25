const request = require('supertest');
const app = require('../src/server');
const nock = require('nock');

describe('Audit API', () => {
  afterEach(() => {
    nock.cleanAll();
  });

  it('should return 400 if URL is missing', async () => {
    const res = await request(app).post('/api/v1/audit').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('URL is required');
  });

  it('should return 400 if URL is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/audit')
      .send({ url: 'not-a-valid-url' });
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should audit a valid URL and return metadata', async () => {
    const testUrl = 'https://example.com';
    
    // Mock the external request
    nock(testUrl)
      .get('/')
      .reply(200, '<html><head><title>Test Title</title><meta name="description" content="Test Description" /></head><body></body></html>');

    const res = await request(app)
      .post('/api/v1/audit')
      .send({ url: testUrl });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.statusCode).toBe(200);
    expect(res.body.data.seo.title).toBe('Test Title');
    expect(res.body.data.seo.description).toBe('Test Description');
  });
});
