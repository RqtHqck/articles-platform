import { ArticleModel, ArticleTagModel } from '@components/articles/models';
import NotFoundError from "@errors/NotFoundError";
import logger from "@libs/logger";

const DeleteArticleService = async (id: number): Promise<void> => {
    logger.info("DeleteArticleService");
    const article = await ArticleModel.findByPk(id);

    if (!article) {
        throw new NotFoundError({
            code: "not_found_error",
            text:`Статья с id=${id} не найдена`
        });
    }

    // Удалить связи с тегами
    await ArticleTagModel.destroy({ where: { articleId: id } });

    // Удалить статью
    await ArticleModel.destroy({ where: { id } });
};

export default DeleteArticleService;
