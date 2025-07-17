import BaseController from '@classes/BaseController';
import logger from "@libs/logger";
import { Request, Response } from 'express';
import {searchArticlesByQueryService} from "@components/search/services";
import {ES_SortTypeEnum, TagEnum} from "@entities/enums";
import {ISearchQueryData} from "@entities/interfaces";



class SearchArticlesController extends BaseController {
    get querySchema() {
        return {
            type: 'object',
            required: ['query'],
            additionalProperties: false,
            properties: {
                query: {
                    type: 'string',
                    minLength: 1
                },
                tags: {
                    type: "array",
                    items: {
                        type: "string",
                        enum: Object.values(TagEnum)
                    },
                    minItems: 1
                },
                page: { type: 'string', pattern: '^\\d+$' },
                limit: { type: 'string', pattern: '^\\d+$' },
                sort: {
                    type: 'string',
                    enum: Object.values(ES_SortTypeEnum)
                },
            }
        };
    }

    async controller(req: Request, res: Response): Promise<void> {
        logger.info("SearchArticlesController")
        const queryData = req.query as unknown as ISearchQueryData;

        const result = await searchArticlesByQueryService(queryData);

        res.status(200).json(result);
    }
}

export default new SearchArticlesController();