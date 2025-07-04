import BaseError from '@classes/BaseError';
import { TErrorData } from '@entities/types';

export default class NotFoundError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('NotFound error', errorsData);
    this.statusCode = 404;
  }
}
