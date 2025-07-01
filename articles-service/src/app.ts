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
import { router } from "@routes/index"

import '@libs/sequelize';
import '@libs/kafka/kafka';
import CreateManyTagsService from "@components/tags/services/createManyTags.service";

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

// Routes
app.use(router);
// Errors
app.use(ErrorsHandlerMiddleware);

app.listen(process.env.PORT!, async () => {
    logger.info(`Article Service running on port ${process.env.PORT}`);
    await CreateManyTagsService();
});