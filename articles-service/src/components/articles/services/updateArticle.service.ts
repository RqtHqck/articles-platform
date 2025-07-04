import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { TagModel } from "@components/tags/models";
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

    const article = await ArticleModel.findByPk(id);

    if (!article) {
        throw new NotFoundError({
            code: "not_found_error",
            text: "Статья не найдена",
        });
    }

    // Проверка на дубликат title у другой статьи
    const duplicate = await ArticleModel.findOne({
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
    const tagsFound = await TagModel.findAll({
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
    await ArticleTagModel.destroy({ where: { articleId: id } });

    const newTags = tags.map(tagId => ({
        articleId: id,
        tagId,
    }));

    await ArticleTagModel.bulkCreate(newTags);
};

export default UpdateArticleService;
