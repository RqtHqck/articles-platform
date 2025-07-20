import "module-alias/register";
import "@libs/dotenv";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import logger from "@libs/logger";
import {ErrorsHandlerMiddleware} from "@middlewares/ErrorHandler";
import { router } from "@routes/index"

import '@libs/kafka/kafka';
import "@libs/elasticsearch";
import startKafkaConsumers from "@libs/kafka/consumers";

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
        methods: ['GET', 'POST'],
    }))

// Routes
app.use(router);
// Errors
app.use(ErrorsHandlerMiddleware);
// App
app.listen(process.env.CONTAINER_PORT!, async () => {
    logger.info(`Search Service running on port ${process.env.CONTAINER_PORT}`);
    await startKafkaConsumers();
});