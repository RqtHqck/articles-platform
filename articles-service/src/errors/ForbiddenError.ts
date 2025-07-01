import BaseError from '@classes/BaseError';
import { TErrorData } from '@entities/types';

export default class ForbiddenError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('Forbidden error', errorsData);
    this.statusCode = 403;
  }
}
