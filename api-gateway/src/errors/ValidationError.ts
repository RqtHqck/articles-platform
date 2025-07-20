import BaseError from '@classes/BaseError';
import { TErrorData } from '@entities/types';

export default class ValidationError extends BaseError {
  constructor(errorsData: { code: string; text: string; data?: TErrorData }) {
    super('Validation error', errorsData);
    this.statusCode = 422; // логичнее 422, а не 404
  }
}
