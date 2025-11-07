const request = require('supertest');
const app = require('../app');

describe('Backend Application', () => {
	test('GET /api/endpoint should return 200', async () => {
		const response = await request(app).get('/api/endpoint');
		expect(response.status).toBe(200);
	});

	test('POST /api/endpoint should create a resource', async () => {
		const response = await request(app).post('/api/endpoint').send({ name: 'Test' });
		expect(response.status).toBe(201);
		expect(response.body.name).toBe('Test');
	});
});