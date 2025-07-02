import { Article } from "@components/articles/models";
import { Tag } from "@components/tags/models";
import logger from "@libs/logger";

interface IGetAllArticlesParams {
    limit: number;
    page: number;
}

const GetAllArticlesService = async ({ limit, page }: IGetAllArticlesParams): Promise<any> => {
    logger.info("GetAllArticlesService");
    const offset = (page - 1) * limit;

    const rows = await Article.findAll({
        limit,
        offset,
        include: [
            {
                model: Tag,
            },
        ],
    });

    logger.info(rows);

    return {
        page,
        limit,
        offset,
        articles: rows
    };
};

export default GetAllArticlesService;
