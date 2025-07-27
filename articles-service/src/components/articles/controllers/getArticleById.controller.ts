import {Request, Response} from "express";
import BaseController from "@classes/BaseController";
import GetArticleByIdService from "../services/getArticleById.service";
import logger from "@libs/logger";

class GetArticleByIdController extends BaseController {
    get paramsSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string', pattern: '^\\d+$' },
            },
        };
    }

    async controller(req: Request, res: Response): Promise<any> {
        logger.info("GetArticleByIdController")

        const { id } = req.params;

        const result = await GetArticleByIdService(Number(id));

        res.status(201).json(result);
    }
}

export default new GetArticleByIdController();
