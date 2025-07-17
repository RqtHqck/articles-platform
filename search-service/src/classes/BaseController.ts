import Ajv, { ErrorObject } from 'ajv';
import addFormats from "ajv-formats";
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '@errors/index';

const ajv = new Ajv({ allErrors: true, removeAdditional: true });
addFormats(ajv, ['email']);

type ValidateErrorObject = {
    field?: string;
    message?: string
}

type ValidationErrorsList = {
    body?: Array<ValidateErrorObject>;
    query?: Array<ValidateErrorObject>;
    params?: Array<ValidateErrorObject>;
};


export default abstract class BaseController {
    constructor() {
        this.controller = this.controller.bind(this);
        this.run = this.run.bind(this);
        this.validate = this.validate.bind(this);
    }

    get bodySchema(): object | null {
        return null;
    }

    get querySchema(): object | null {
        return null;
    }

    get paramsSchema(): object | null {
        return null;
    }

    // Обязательно переопределять в наследниках
    abstract controller(req: Request, res: Response): Promise<any>;


    // Форматируем ошибки в удобный объект
    #buildRequestError(error: ErrorObject): ValidateErrorObject {
        const { message, instancePath } = error ;
        // instancePath — путь к полю, заменяем dataPath на него
        // Убираем первый слеш из пути, если есть
        const field = instancePath ? instancePath.slice(1) : undefined;
        return { field, message };
    }

    // Валидируем тело, параметры и query
    validate(req: Request): ValidationErrorsList {
        const errorsList: ValidationErrorsList = {};

        if (this.bodySchema) {
            const validate = ajv.compile(this.bodySchema);
            const isValid = validate(req.body);
            if (!isValid && validate.errors) {
                errorsList.body = validate.errors.map(this.#buildRequestError);
            }
        }

        if (this.querySchema) {
            const validate = ajv.compile(this.querySchema);
            const isValid = validate(req.query);
            if (!isValid && validate.errors) {
                errorsList.query = validate.errors.map(this.#buildRequestError);
            }
        }

        if (this.paramsSchema) {
            const validate = ajv.compile(this.paramsSchema);
            const isValid = validate(req.params);
            if (!isValid && validate.errors) {
                errorsList.params = validate.errors.map(this.#buildRequestError);
            }
        }

        return errorsList;
    }

    async run(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const errorsList = this.validate(req);

            if (Object.keys(errorsList).length > 0) {
                throw new ValidationError({
                    code: 'validation_error',
                    text: 'Ошибка валидации',
                    data: errorsList,
                });
            }

            await this.controller(req, res);

        } catch (error) {
            next(error);
        }
    }
}
