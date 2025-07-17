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

app.use(router);

app.use('/api/articles',
    proxy(process.env.ARTICLES_SERVICE_URL!, {
        proxyReqPathResolver: (req) => {
            logger.info("API-GATEWAY -> ARTICLES-SERVICE");
            return req.url;
        },
        proxyErrorHandler: (err, res, next) => {
            logger.info("Something went wrong when appeal to " + process.env.ARTICLES_SERVICE_URL!)
            next(err);
        }
    }));

app.use('/api/logs', proxy(process.env.LOGS_SERVICE_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY -> LOGS-SERVICE");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + process.env.LOGS_SERVICE_URL!)
        next(err);
    }
}));

app.use('/api/search', proxy(process.env.SEARCH_SERVICE_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY -> SEARCH-SERVICE");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + process.env.SEARCH_SERVICE_URL!)
        next(err);
    }
}));

app.use('/api', proxy(process.env.APP_ORIGIN_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + process.env.PORT!)
        next(err);
    }
}));

app.use(ErrorsHandlerMiddleware);

app.listen(process.env.PORT, () => {
    logger.info(`API Gateway is running on port ${process.env.PORT}`);
    logger.info(`Articles microservice is running on port ${process.env.ARTICLES_SERVICE_URL}`);
    logger.info(`Logs microservice is running on port ${process.env.LOGS_SERVICE_URL}`);
    logger.info(`Search microservice is running on port ${process.env.SEARCH_SERVICE_URL}`);
});
