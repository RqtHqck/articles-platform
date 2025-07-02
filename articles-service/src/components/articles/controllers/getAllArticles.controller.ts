import { Request } from "express";
import BaseController from "@classes/BaseController";
import { GetAllArticlesService } from "../services";
import logger from "@libs/logger";

class GetAllArticlesController extends BaseController {
    get querySchema() {
        return {
            type: "object",
            additionalProperties: false,
            properties: {
                page: { type: 'string', pattern: '^\\d+$' },
                limit: { type: 'string', pattern: '^\\d+$' },
            },
        };
    }

    async controller(req: Request) {
        logger.info("GetAllArticlesController")

        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const page = req.query.page ? Number(req.query.page) : 1;

        const result = await GetAllArticlesService({ limit, page });

        return result;
    }
}

export default new GetAllArticlesController();
