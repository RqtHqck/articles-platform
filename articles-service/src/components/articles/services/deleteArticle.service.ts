import { Article, ArticleTag } from '@components/articles/models';
import { Op } from 'sequelize';
import NotFoundError from "@errors/NotFoundError";
import logger from "@libs/logger";

const DeleteArticleService = async (id: number): Promise<void> => {
    logger.info("DeleteArticleService");
    const article = await Article.findByPk(id);

    if (!article) {
        throw new NotFoundError({
            code: "not_found_error",
            text:`Статья с id=${id} не найдена`
        });
    }

    // Удалить связи с тегами
    await ArticleTag.destroy({ where: { articleId: id } });

    // Удалить статью
    await Article.destroy({ where: { id } });
};

export default DeleteArticleService;
