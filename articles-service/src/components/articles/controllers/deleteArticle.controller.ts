import {Request, Response} from "express";
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

    async controller(req: Request, res: Response): Promise<void> {
        logger.info("DeleteArticleController")
        const { id } = req.params;

        await DeleteArticleService(Number(id));

        res.status(204).json({status: 'OK'});
    }
}

export default new DeleteArticleController();
