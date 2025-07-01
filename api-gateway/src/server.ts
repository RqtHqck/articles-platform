import "module-alias/register";
import "@libs/dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors"
import cookieParser from "cookie-parser";
import compression from "compression";
import proxy from "express-http-proxy";
import logger from "@libs/logger";
import {rateLimitOptions} from "@libs/rateLimit";
import { ErrorsHandlerMiddleware } from '@middlewares/ErrorHandler';
import {appRouter} from "./router";


const app: Application = express();
app
    .use(morgan('combined', { stream: logger.morganStream }))
    .use(compression())
    .use(cookieParser())
    .use(helmet())
    .use(cors({
        origin: process.env.APP_ORIGIN_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }))
    // .use(rateLimitOptions);

console.log(process.env.ARTICLES_SERVICE_URL)
app.use('/api/articles',
    proxy(process.env.ARTICLES_SERVICE_URL!, {
        proxyReqPathResolver: (req) => {
            console.log("API-GATEWA -> " + req.url);
            return req.url;
        },
        proxyErrorHandler: (err, res, next) => {
            logger.info("Something went wrong when appeal to " + process.env.ARTICLES_SERVICE_URL!)
            next(err);
        }
    }));
app.use('/search', proxy(process.env.SEARCH_SERVICE_URL!));
app.use('/logs', proxy(process.env.LOGS_SERVICE_URL!));
app.use(appRouter);

app.use(ErrorsHandlerMiddleware);

app.listen(process.env.PORT, () => {
    logger.info(`API Gateway is running on port ${process.env.PORT}`);
    logger.info(`Articles microservice is running on port ${process.env.ARTICLES_SERVICE_URL}`);
    logger.info(`Search microservice is running on port ${process.env.SEARCH_SERVICE_URL}`);
    logger.info(`Logs microservice is running on port ${process.env.LOGS_SERVICE_URL}`);
});
