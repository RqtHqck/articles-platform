import {Request} from "express";
import BaseController from '@classes/BaseController';
import {CreateArticleService} from '../services';
import {ICreateArticleDto} from "@entities/interfaces";

class CreateArticleController extends BaseController {
    get bodySchema() {
        return {
            type: 'object',
            required: ['title', 'content'],
            additionalProperties: false,
            properties: {
                title: { type: 'string' },
                content: { type: 'string' },
            }
        };
    }

    async controller(req: Request): Promise<string> {
        const updateData = req.body as ICreateArticleDto;

        await CreateArticleService(updateData);

        return 'OK';
    }
}

export default new CreateArticleController();