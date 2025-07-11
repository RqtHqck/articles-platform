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
import config from "config";
import { router } from "@routes/index"

import '@libs/kafka/kafka';
import "@libs/elasticsearch"
import consumeArticleCreatedEvent from "@libs/kafka/consumers/handleArticleCreated";

const app: Application = express();
app
    .use(morgan('combined', { stream: logger.morganStream }))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(compression())
    .use(cookieParser())
    .use(helmet())
    .use(cors({
        origin: config.get<string>("SERVER.APP_ORIGIN_URL"),
        methods: ['GET', 'POST'],
    }))

// Routes
app.use(router);
// Errors
app.use(ErrorsHandlerMiddleware);
// App
app.listen(config.get<string>("SERVER.PORT")!, async () => {
    logger.info(`Search Service running on port ${config.get<string>("SERVER.PORT")}`);
    await consumeArticleCreatedEvent();
});