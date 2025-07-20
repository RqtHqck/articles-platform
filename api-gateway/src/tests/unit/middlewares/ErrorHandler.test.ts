import { ErrorsHandlerMiddleware } from '@middlewares/ErrorHandler';
import { Request, Response, NextFunction } from 'express';
import BaseError from '@classes/BaseError';
import logger from '@libs/logger';
import { NotFoundError } from '@errors/index';

jest.mock('@libs/logger');

describe('ErrorsHandlerMiddleware', () => {
    const mockReq = {
        method: 'GET',
        originalUrl: '/test-endpoint',
    } as Request;

    const mockRes = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
    } as unknown as Response;

    const mockNext = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should handle BaseError and return custom response', () => {
        const error = new NotFoundError({
            code: 'not_found',
            text: 'Resource not found',
            data: {} // важно: это попадёт в response
        });

        ErrorsHandlerMiddleware(error, mockReq, mockRes, mockNext);

        expect(logger.error).toHaveBeenCalledWith(
            `API Error in GET /test-endpoint: not_found - Resource not found`
        );
        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.send).toHaveBeenCalledWith({
            code: 'not_found',
            text: 'Resource not found',
            data: {}
        });
    });


    it('should handle SyntaxError and return 400 response', () => {
        const error = new SyntaxError('Unexpected token o in JSON at position 1') as any;
        error.body = {}; // признак JSON parsing error от Express

        ErrorsHandlerMiddleware(error, mockReq, mockRes, mockNext);

        expect(logger.error).toHaveBeenCalledWith(
            expect.stringContaining('Syntax Error in GET /test-endpoint')
        );
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            error: {
                code: 'BAD_REQUEST',
                message: 'Syntax error occurred.',
            },
        });
    });

    it('should handle generic errors and return 500', () => {
        const error = new Error('Something went wrong');

        ErrorsHandlerMiddleware(error, mockReq, mockRes, mockNext);

        expect(logger.error).toHaveBeenCalledWith(
            `Uncaught error in GET /test-endpoint: Something went wrong`
        );
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.send).toHaveBeenCalledWith({
            code: 'internal_error',
            text: 'Internal error',
        });
    });
});
