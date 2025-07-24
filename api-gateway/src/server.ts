import app from "./app";
import logger from "@libs/logger";
import {waitForMicroservices} from "@helpers/waitForMicroservices";

const HOST_PORT = process.env.HOST_PORT!
const APP_ORIGIN_URL = process.env.APP_ORIGIN_URL!
const ARTICLES_SERVICE_URL = process.env.ARTICLES_SERVICE_URL!
const LOGS_SERVICE_URL = process.env.LOGS_SERVICE_URL!
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL!

const services = [
    {
        name: 'Articles',
        url: `${APP_ORIGIN_URL}/api/articles/health`,
        port: ARTICLES_SERVICE_URL,
    },
    {
        name: 'Logs',
        url: `${APP_ORIGIN_URL}/api/logs/health`,
        port: LOGS_SERVICE_URL,
    },
    {
        name: 'Search',
        url: `${APP_ORIGIN_URL}/api/search/health`,
        port: SEARCH_SERVICE_URL,
    }
];



app.listen(HOST_PORT, async () => {
    logger.info(`API-Gateway is running on port ${HOST_PORT}`);

    await waitForMicroservices(services);
});