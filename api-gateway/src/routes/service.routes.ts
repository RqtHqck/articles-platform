import {Response, Request, Router} from "express";
import proxy from "express-http-proxy";
import logger from "@libs/logger";
import ProxyError from "@errors/ProxyError";
const router = Router();

const APP_ORIGIN_URL = process.env.APP_ORIGIN_URL!
const ARTICLES_SERVICE_URL = process.env.ARTICLES_SERVICE_URL!
const LOGS_SERVICE_URL = process.env.LOGS_SERVICE_URL!
const SEARCH_SERVICE_URL = process.env.SEARCH_SERVICE_URL!

router.use('/api/articles',
    proxy(ARTICLES_SERVICE_URL!, {
        proxyReqPathResolver: (req) => {
            logger.info("API-GATEWAY -> ARTICLES-SERVICE");
            return req.url;
        },
        proxyErrorHandler: (err, res, next) => {
            logger.info("Something went wrong when appeal to " + ARTICLES_SERVICE_URL!)
            next(new ProxyError({
                code: 'proxy_error',
                text: 'Something went wrong when appeal to ' + ARTICLES_SERVICE_URL!,
            }));
        }
    }));

router.use('/api/logs', proxy(LOGS_SERVICE_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY -> LOGS-SERVICE");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + LOGS_SERVICE_URL! + ": " + err)
        next(new ProxyError({
            code: 'proxy_error',
            text: 'Something went wrong when appeal to ' + LOGS_SERVICE_URL!,
        }));
    }
}));

router.use('/api/search', proxy(SEARCH_SERVICE_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY -> SEARCH-SERVICE");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + SEARCH_SERVICE_URL!)
        next(new ProxyError({
            code: 'proxy_error',
            text: 'Something went wrong when appeal to ' + SEARCH_SERVICE_URL!,
        }));
    }
}));

router.use('/api', proxy(APP_ORIGIN_URL!, {
    proxyReqPathResolver: (req) => {
        logger.info("API-GATEWAY");
        return req.url;
    },
    proxyErrorHandler: (err, res, next) => {
        logger.info("Something went wrong when appeal to " + APP_ORIGIN_URL!)
        next(new ProxyError({
            code: 'proxy_error',
            text: 'Something went wrong when appeal to ' + APP_ORIGIN_URL!,
        }));    }
}));

export default router;