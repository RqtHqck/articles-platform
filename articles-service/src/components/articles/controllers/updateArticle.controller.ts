import {Request, Response} from "express";
import BaseController from "@classes/BaseController";
import { UpdateArticleService } from "../services";
import {IUpdateArticleDto} from "@entities/interfaces";

class UpdateArticleController extends BaseController {
    get paramsSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string', pattern: '^\\d+$' },
            },
        };
    }

    get bodySchema() {
        return {
            type: "object",
            required: ["title", "content", "tags"],
            additionalProperties: false,
            properties: {
                title: { type: "string" },
                content: { type: "string" },
                tags: {
                    type: "array",
                    items: { type: "number" },
                    minItems: 1
                },
            },
        };
    }

    async controller(req: Request, res: Response):Promise<void> {
        const { id } = req.params;

        const updateData = req.body as IUpdateArticleDto;

        await UpdateArticleService(Number(id), updateData);

        res.status(200).json({status: 'OK'});
    }
}

export default new UpdateArticleController();
