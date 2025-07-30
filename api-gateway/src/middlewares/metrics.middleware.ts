import {NextFunction, Response, Request} from "express";
import {
    httpRequestDurationMicroseconds,
    httpRequestsCounter,
    httpRequestSizes,
    httpResponseSizes
} from "@libs/prometheus";
import {normalizePath} from "@helpers/normalizePatyh";
import {ILabel} from "@entities/interfaces";

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    const duration = httpRequestDurationMicroseconds.startTimer();

    res.on("finish", () => {
        const durationInSeconds = duration();
        const path = normalizePath(req);
        const requestSize = req.body ? new Blob([req.body]).size : 0;
        const responseSize = Number(res.getHeader("content-length")) || 0;
        const normalizedStatusCode = ((res.statusCode || 200) / 100).toFixed() + "XX";

        const labels: ILabel = {
            method: req.method,
            route: path,
            statusCode: String(res.statusCode || 200),
            status: normalizedStatusCode,
        };

        httpRequestsCounter.inc(labels as {});
        httpRequestDurationMicroseconds.observe(labels as {}, durationInSeconds);
        httpRequestSizes.observe({method: req.method, route: path}, requestSize);
        httpResponseSizes.observe(labels as {}, responseSize);
    })

    next();
}