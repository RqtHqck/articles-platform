import "module-alias/register";
import "@libs/dotenv";
import logger from "@libs/logger";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import {ErrorsHandlerMiddleware} from "@middlewares/ErrorHandler";
import {metricsMiddleware} from "@middlewares/metrics.middleware";
import { router } from "@routes/index"

import '@libs/sequelize';
import '@libs/kafka/kafka';

const app: Application = express();
app
    .use(morgan('combined', { stream: logger.morganStream }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(compression())
    .use(cookieParser())
    .use(helmet())
    .use(cors({
        origin: process.env.APP_ORIGIN_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }))

app.use(router);
app.use(ErrorsHandlerMiddleware);
app.use(metricsMiddleware);

export default app;