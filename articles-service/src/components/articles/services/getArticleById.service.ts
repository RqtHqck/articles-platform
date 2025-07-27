import { ArticleModel } from '@components/articles/models';
import NotFoundError from "@errors/NotFoundError";
import {IArticle} from "@entities/interfaces";
import logger from "@libs/logger";

const GetArticleByIdService = async (id: number): Promise<IArticle> => {
    logger.info("GetArticleByIdService")

    const article = await ArticleModel.findByPk(id as number);

    if (!article) {
        throw new NotFoundError({
         code: "not_found_error",
         text:`Статья с id=${id} не найдена`
        });
    }

    return article;
};

export default GetArticleByIdService;
