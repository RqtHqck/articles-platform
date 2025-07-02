import { Request } from "express";
import BaseController from "@classes/BaseController";
import GetArticleByIdService from "../services/getArticleByIdService.service";
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

    async controller(req: Request): Promise<any> {
        logger.info("GetArticleByIdController")

        const { id } = req.params;

        return await GetArticleByIdService(Number(id));
    }
}

export default new GetArticleByIdController();
