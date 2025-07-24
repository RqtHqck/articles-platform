import request from 'supertest';
import app from '../../../app';

describe('API Gateway swagger routes tests', () => {
    it('GET /docs должен вернуть Swagger UI (html)', async () => {
        const res = await request(app).get('/docs/');
        expect(res.status).toBe(200);
        expect(res.type).toMatch(/html/);
        expect(res.text).toContain('Swagger UI');
    });

    it('GET /json должен вернуть Swagger JSON', async () => {
        const res = await request(app).get('/json');
        expect(res.status).toBe(200);
        expect(res.type).toMatch(/json/);
        expect(res.body).toHaveProperty('openapi');
    });
});
