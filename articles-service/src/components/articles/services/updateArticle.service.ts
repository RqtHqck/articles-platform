import { Article, ArticleTag } from "@components/articles/models";
import { Tag } from "@components/tags/models";
import { Op } from "sequelize";
import NotFoundError from "@errors/NotFoundError";
import ConflictError from "@errors/ConflictError";
import BadRequestError from "@errors/BadRequestError";
import { ICreateArticleDto } from "@entities/interfaces";

const UpdateArticleService = async (
    id: number,
    updateData: ICreateArticleDto
): Promise<void> => {
    const { title, content, tags } = updateData;

    const article = await Article.findByPk(id);

    if (!article) {
        throw new NotFoundError({
            code: "not_found_error",
            text: "Статья не найдена",
        });
    }

    // Проверка на дубликат title у другой статьи
    const duplicate = await Article.findOne({
        where: {
            title,
            id: { [Op.ne]: id },
        },
    });

    if (duplicate) {
        throw new ConflictError({
            code: "conflict_error",
            text: "Статья с таким title уже существует",
        });
    }

    // Проверка тегов
    const tagsFound = await Tag.findAll({
        where: {
            id: {
                [Op.in]: tags,
            },
        },
    });

    if (tagsFound.length < tags.length) {
        throw new BadRequestError({
            code: "bad_request_error",
            text: "Некорректные tag id",
        });
    }

    // Обновление статьи
    await article.update({ title, content });

    // Обновление тегов: удалить старые и добавить новые
    await ArticleTag.destroy({ where: { articleId: id } });

    const newTags = tags.map(tagId => ({
        articleId: id,
        tagId,
    }));

    await ArticleTag.bulkCreate(newTags);
};

export default UpdateArticleService;
