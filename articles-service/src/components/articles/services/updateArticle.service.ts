import { ArticleModel, ArticleTagModel } from "@components/articles/models";
import { TagModel } from "@components/tags/models";
import {Op, Transaction} from "sequelize";
import NotFoundError from "@errors/NotFoundError";
import ConflictError from "@errors/ConflictError";
import BadRequestError from "@errors/BadRequestError";
import {IArticleUpdatedEvent, ICreateArticleDto, ITag} from "@entities/interfaces";
import articleUpdatedHandler from "@libs/kafka/producers/articles/articleUpdatedHandler";
import sequelize from "@libs/sequelize";

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

    await sequelize.transaction(async (transaction: Transaction): Promise<void> => {
        // Обновление статьи
        const [affectedRows, updatedRows] = await ArticleModel.update(
            { title, content },
            {
                where: { id },
                returning: true,
                transaction,
            }
        );

        if (affectedRows === 0) {
            throw new Error("Something went wrong and data wasn't updated");
        }

        // Обновление тегов: удалить старые и добавить новые
        await ArticleTagModel.destroy({ where: { articleId: id }, transaction });

        const newTags = tags.map(tagId => ({
            articleId: id,
            tagId,
        }));

        await ArticleTagModel.bulkCreate(newTags, { transaction });

        await articleUpdatedHandler({
            id,
            title,
            content,
            tags: tagsFound.map(tag => ({id: tag.id, label: tag.label} as unknown as ITag)), // ITag
            publishedAt: updatedRows[0].publishedAt,
            updatedAt: updatedRows[0].updatedAt
        } as IArticleUpdatedEvent);
    })
};

export default UpdateArticleService;
