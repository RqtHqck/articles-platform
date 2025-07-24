import request from 'supertest';
import app from '../../../app';

describe('API Gateway app routes tests', () => {
    it('GET /health должен вернуть { status: "OK" }', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "OK" });
    });
});
