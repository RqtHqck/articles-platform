import swaggerJSDoc from 'swagger-jsdoc';
import * as fs from "node:fs";
import path from "path";
import {Article, ArticleCreateDto, ArticleUpdateDto, ErrorResponse} from "@libs/swagger/schemas";
import { UnauthorizedResponse, BadRequestResponse, ConflictResponse, ForbiddenResponse,
    NotFoundResponse, ValidationErrorResponse, InternalServerErrorResponse,
} from '@libs/swagger/responses';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ARTICLES RESTfull API',
            version: '1.0.0',
            description: 'REST API with Swagger doc',
        },
        tags: [
            {
                name: 'articles',
                description: 'Articles API',
            },
        ],
        servers: [
            {
                url: "http://localhost:3000/api/articles",
                description: "API Gateway endpoint"
            }
        ],
        components: {
            schemas: {
                Article,
                ArticleCreateDto,
                ArticleUpdateDto,
                ErrorResponse
            },
            responses: {
                Unauthorized:        UnauthorizedResponse,
                BadRequest:          BadRequestResponse,
                Conflict:            ConflictResponse,
                Forbidden:           ForbiddenResponse,
                NotFound:            NotFoundResponse,
                ValidationError:     ValidationErrorResponse,
                InternalServerError: InternalServerErrorResponse
            }
        }
    },
    apis: [
        path.resolve(__dirname, '../../components/articles/routes.js'),
    ],
}

const swaggerSpec = swaggerJSDoc(swaggerOptions);

fs.writeFileSync(
    path.resolve(__dirname, '../../swagger.json'),
    JSON.stringify(swaggerSpec)
);

export default swaggerSpec;