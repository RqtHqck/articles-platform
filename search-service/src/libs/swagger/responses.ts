const JSON_ERROR_REF = { schema: { $ref: '#/components/schemas/Error' } };
const JSON_SUCCESS_REF = { schema: { $ref: '#/components/schemas/Success' } };

export const SuccessResponse = {
    description: 'Сервис работает корректно',
    content: {
        'application/json': {
            ...JSON_SUCCESS_REF,
            example: {
                status: 'OK'
            }
        }
    }
};


/** 401 */
export const UnauthorizedErrorResponse = {
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
export const BadRequestErrorResponse = {
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
export const ConflictErrorResponse = {
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
export const ForbiddenErrorResponse = {
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
export const NotFoundErrorResponse = {
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

