import {ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import {TErrorData} from "@entities/types";
import BaseError from '@classes/BaseError';
import logger from "@libs/logger";

export const ErrorsHandlerMiddleware: ErrorRequestHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    // API errors
    if (error instanceof BaseError && error.statusCode) {
        logger.error(`API Error in ${req.method} ${req.originalUrl}: ${error.code} - ${error.text}`);
        res.status(error.statusCode).send({
            code: error.code,
            text: error.text,
            data: error.data as TErrorData,
        });
        return;
    }

    // Syntax errors
    if (error instanceof SyntaxError && 'body' in error) {
        logger.error(`Syntax Error in ${req.method} ${req.originalUrl}: ${error.message}`);
        res.status(400).json({
            success: false,
            error: {
                code: "BAD_REQUEST",
                message: "Syntax error occurred.",
            },
        });
        return;
    }

    // Uncaught errors
    logger.error(`Uncaught error in ${req.method} ${req.originalUrl}: ${error.message}`)
    res.status(500).send({
        code: 'internal_error',
        text: 'Internal error',
    });
}
