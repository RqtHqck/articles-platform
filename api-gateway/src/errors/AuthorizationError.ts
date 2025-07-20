import BaseError from '@classes/BaseError';
import { TErrorData } from '@entities/types';

export default class AuthorizationError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('Authorization error', errorsData);
    this.statusCode = 401;
  }
}
