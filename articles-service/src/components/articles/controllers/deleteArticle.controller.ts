import { Request } from "express";
import BaseController from "@classes/BaseController";
import { DeleteArticleService } from "../services";
import logger from "@libs/logger";

class DeleteArticleController extends BaseController {
    get paramsSchema() {
        return {
            type: 'object',
            properties: {
                id: { type: 'string', pattern: '^\\d+$' },
            },
        };
    }

    async controller(req: Request): Promise<string> {
        logger.info("DeleteArticleController")
        const { id } = req.params;

        await DeleteArticleService(Number(id));

        return 'DELETED';
    }
}

export default new DeleteArticleController();
