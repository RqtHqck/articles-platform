import {Request} from "express";
import BaseController from '@classes/BaseController';
import {CreateArticleService} from '../services';
import {ICreateArticleDto} from "@entities/interfaces";
import logger from "@libs/logger";

class CreateArticleController extends BaseController {
    get bodySchema() {
        return {
            type: 'object',
            required: ['title', 'content', 'tags'],
            additionalProperties: false,
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
                tags: {
                    type: "array",
                    items: { "type": "number" },
                    minItems: 1
                },
            }
        };
    }

    async controller(req: Request): Promise<string> {
        logger.info("CreateArticleController")
        const updateData = req.body as ICreateArticleDto;

        await CreateArticleService(updateData);

        return 'OK';
    }
}

export default new CreateArticleController();