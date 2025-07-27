import { ArticleModel, ArticleTagModel } from '@components/articles/models';
import NotFoundError from "@errors/NotFoundError";
import logger from "@libs/logger";
import articleDeletedHandler from "@libs/kafka/producers/articles/articleDeletedHandler";
import sequelize from "@libs/sequelize";
import {Transaction} from "sequelize";


const DeleteArticleService = async (id: number): Promise<void> => {
    logger.info("DeleteArticleService");
    const article = await ArticleModel.findByPk(id);

    if (!article) {
        throw new NotFoundError({
            code: "not_found_error",
            text:`Статья с id=${id} не найдена`
        });
    }

    await sequelize.transaction(async (transaction: Transaction): Promise<void> => {
        // Удалить связи с тегами
        await ArticleTagModel.destroy({ where: { articleId: id }, transaction });

        // Удалить статью
        await ArticleModel.destroy({ where: { id }, transaction });

        await articleDeletedHandler(id);
    })
};

export default DeleteArticleService;
