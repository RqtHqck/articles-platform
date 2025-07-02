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

    logger.error(error);

    if (error instanceof BaseError && error.statusCode) {
        res.status(error.statusCode).send({
            code: error.code,
            text: error.text,
            data: error.data as TErrorData,
        });
        return;
    }

    res.status(500).send({
        code: 'internal_error',
        text: 'Internal error',
    });
}
