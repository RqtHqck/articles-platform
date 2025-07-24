import "module-alias/register";
import "@libs/dotenv";
import express, { Application } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors"
import cookieParser from "cookie-parser";
import compression from "compression";
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
        origin: process.env.APP_ORIGIN_URL!,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }))
    .use(rateLimitOptions);

app.use(router);
app.use(ErrorsHandlerMiddleware);


export default app;
