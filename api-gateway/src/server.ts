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
import {router} from "./routes";

const HOST_PORT = process.env.HOST_PORT!
const APP_ORIGIN_URL = process.env.APP_ORIGIN_URL!
const ARTICLES_SERVICE_URL = process.env.ARTICLES_SERVICE_URL!
const LOGS_SERVICE_URL = process.env.LOGS_SERVICE_URL!
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL!


const app: Application = express();
app
    .use(morgan('combined', { stream: logger.morganStream }))
    .use(compression())
    .use(cookieParser())
    .use(helmet())
    .use(cors({
        origin: APP_ORIGIN_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }))
// .use(rateLimitOptions);

app.use(router);

app.use('/api/articles',
    proxy(ARTICLES_SERVICE_URL!, {
        proxyReqPathResolver: (req) => {
            logger.info("API-GATEWAY -> ARTICLES-SERVICE");
            return req.url;
        },
        proxyErrorHandler: (err, res, next) => {
            logger.info("Something went wrong when appeal to " + ARTICLES_SERVICE_URL!)
            next(err);
        }
    }));

app.use('/api/logs', proxy(LOGS_SERVICE_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY -> LOGS-SERVICE");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + LOGS_SERVICE_URL!)
        next(err);
    }
}));

app.use('/api/search', proxy(SEARCH_SERVICE_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY -> SEARCH-SERVICE");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + SEARCH_SERVICE_URL!)
        next(err);
    }
}));

app.use('/api', proxy(APP_ORIGIN_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + APP_ORIGIN_URL!)
        next(err);
    }
}));

app.use(ErrorsHandlerMiddleware);

app.listen(HOST_PORT, () => {
    logger.info(`API Gateway is running on port ${HOST_PORT}`);
    logger.info(`Articles microservice is running on port ${ARTICLES_SERVICE_URL}`);
    logger.info(`Logs microservice is running on port ${LOGS_SERVICE_URL}`);
    logger.info(`Search microservice is running on port ${SEARCH_SERVICE_URL}`);
});