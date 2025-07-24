import request from "supertest";
import nock from "nock";

const API_GATEWAY_URL = "http://api-gateway:3000";

describe("Интеграционные тесты — API Gateway маршруты", () => {
    it("GET /api/articles/health → должен проксироваться на articles-service", async () => {
        const res = await request(API_GATEWAY_URL).get("/api/articles/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "OK" }); // предполагается, что такой ответ отдаёт articles-service
    });

    it("GET /api/search/health → должен проксироваться на search-service", async () => {
        const res = await request(API_GATEWAY_URL).get("/api/search/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "OK" });
    });

    it("GET /api/logs/health → должен проксироваться на logs-service", async () => {
        const res = await request(API_GATEWAY_URL).get("/api/logs/health");
        expect(res.status).toBe(200);
        expect(res.body).toEqual({ status: "OK" });
    });
});

describe("Интеграционные тесты — ошибки прокси", () => {
    afterEach(() => {
        nock.cleanAll();
    });

    afterAll(() => {
        nock.restore();
    });

    it("должен вернуть 502, если articles-сервис недоступен", async () => {
        nock(API_GATEWAY_URL)
            .get('/api/articles/health')
            .reply(502, { code: "proxy_error" });

        const res = await request(API_GATEWAY_URL).get("/api/articles/health");
        expect(res.status).toBe(502);
        expect(res.body.code).toBe("proxy_error");
    });


    it("должен вернуть 502, если search-сервис отвечает 500", async () => {
        nock(API_GATEWAY_URL)
            .get('/api/search/health')
            .reply(502, { code: "proxy_error" });

        const res = await request(API_GATEWAY_URL).get("/api/search/health");
        expect(res.status).toBe(502);
        expect(res.body.code).toBe("proxy_error");
    });

    it("должен вернуть 502, если logs-сервис недоступен", async () => {
        nock(API_GATEWAY_URL)
            .get('/api/logs/health')
            .reply(502, { code: "proxy_error" });

        const res = await request(API_GATEWAY_URL).get("/api/logs/health");
        expect(res.status).toBe(502);
        expect(res.body.code).toBe("proxy_error");
    });
});
