import promClient from 'prom-client';

export const GlobalRegistry = new promClient.Registry();

GlobalRegistry.setDefaultLabels({
    app: 'api-gateway'
})

// Collect default metrics
promClient.collectDefaultMetrics({register: GlobalRegistry});

const commonLabels = ["method", "route", "status", "status_code"];

export const httpRequestDurationMicroseconds = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: commonLabels,
    buckets: [0.1, 0.5, 1, 2, 5, 10],
    registers: [GlobalRegistry]
})

export const httpRequestsCounter = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Count of HTTP requests',
    labelNames: commonLabels,
    registers: [GlobalRegistry]
})

export const httpResponseSizes = new promClient.Histogram({
    name: "http_response_length_bytes",
    help: "Size of HTTP response in bytes",
    labelNames: commonLabels,
    buckets: [100, 500, 1000, 5000, 10000, 50000, 100000],
    registers: [GlobalRegistry],
});

export const httpRequestSizes = new promClient.Histogram({
    name: "http_request_length_bytes",
    help: "Size of HTTP request in bytes",
    labelNames: commonLabels,
    buckets: [100, 500, 1000, 5000, 10000, 50000, 100000],
    registers: [GlobalRegistry],
});