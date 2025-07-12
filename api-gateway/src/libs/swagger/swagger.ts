import swaggerJSDoc from 'swagger-jsdoc';
import * as fs from "node:fs";
import path from "path";
import { ErrorSchema, SuccessSchema} from "@libs/swagger/schemas";
import {
    UnauthorizedErrorResponse, BadRequestErrorResponse, ConflictErrorResponse, ForbiddenErrorResponse,
    NotFoundErrorResponse, ValidationErrorResponse, InternalServerErrorResponse, SuccessResponse,
} from '@libs/swagger/responses';

const swaggerOptions = {
    definition: {
        openapi:         '3.0.0',
        info: {
            title:       'APIGATEWAY RESTfull API',
            version:     '1.0.0',
            description: 'REST API with Swagger doc',
        },
        tags: [
            {
                name:        'api-gateway',
                description: 'Api-Gateway API',
            },
        ],
        servers: [
            {
                url:         "http://localhost:3000/api/",
                description: "API Gateway endpoint"
            }
        ],
        components: {
            schemas: {
                ErrorSchema,
                SuccessSchema
            },
            responses: {
                SuccessResponse:          SuccessResponse,
                UnauthorizedError:        UnauthorizedErrorResponse,
                BadRequestError:          BadRequestErrorResponse,
                ConflictError:            ConflictErrorResponse,
                ForbiddenError:           ForbiddenErrorResponse,
                NotFoundError:            NotFoundErrorResponse,
                ValidationError:          ValidationErrorResponse,
                InternalServerError:      InternalServerErrorResponse
            }
        }
    },
    apis: [
        path.resolve(__dirname, '../../routes/app.routes.js'),
    ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions);

fs.writeFileSync(
    path.resolve(__dirname, '../../swagger.json'),
    JSON.stringify(swaggerSpec)
);

export default swaggerSpec;