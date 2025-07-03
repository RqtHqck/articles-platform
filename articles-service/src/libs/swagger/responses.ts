/** Стандартная схема ошибки уже есть → используем $ref */
const JSON_ERROR_REF = { schema: { $ref: '#/components/schemas/ErrorResponse' } };

/** 401 */
export const UnauthorizedResponse = {
    description: 'Authorization error',
    content: {
        'application/json': {
            ...JSON_ERROR_REF,
            example: {
                code: 'authorization_error',
                text: 'Нет доступа',
                data: {}
            }
        }
    }
};

/** 400 */
export const BadRequestResponse = {
    description: 'Bad Request error',
    content: {
        'application/json': {
            ...JSON_ERROR_REF,
            example: {
                code: 'bad_request_error',
                text: 'Некорректные данные',
                data: {}
            }
        }
    }
};

/** 409 */
export const ConflictResponse = {
    description: 'Conflict error',
    content: {
        'application/json': {
            ...JSON_ERROR_REF,
            example: {
                code: 'conflict_error',
                text: 'Конфликт данных',
                data: {}
            }
        }
    }
};

/** 403 */
export const ForbiddenResponse = {
    description: 'Forbidden error',
    content: {
        'application/json': {
            ...JSON_ERROR_REF,
            example: {
                code: 'forbidden_error',
                text: 'Доступ запрещён',
                data: {}
            }
        }
    }
};

/** 404 */
export const NotFoundResponse = {
    description: 'Not Found error',
    content: {
        'application/json': {
            ...JSON_ERROR_REF,
            example: {
                code: 'not_found_error',
                text: 'Ресурс не найден',
                data: {}
            }
        }
    }
};

/** 422 */
export const ValidationErrorResponse = {
    description: 'Validation error (422 Unprocessable Entity)',
    content: {
        'application/json': {
            ...JSON_ERROR_REF,
            example: {
                code: 'validation_error',
                text: 'Ошибка валидации',
                data: {}
            }
        }
    }
};

/** 500 */
export const InternalServerErrorResponse = {
    description: 'Internal server error',
    content: {
        'application/json': {
            ...JSON_ERROR_REF,
            example: {
                code: 'internal_error',
                text: 'Internal error',
                data: {}
            }
        }
    }
};
