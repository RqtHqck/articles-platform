import BaseError from '@classes/BaseError';
import { TErrorData } from '@entities/types';

export default class ProxyError extends BaseError {
    constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
        super('Proxy error', errorsData);
        this.statusCode = 502;
    }
}