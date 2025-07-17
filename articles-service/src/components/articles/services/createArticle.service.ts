import { ConflictError, BadRequestError } from '@errors/index';
import {ArticleModel, ArticleTagModel} from '@components/articles/models';

import {IArticleCreatedEvent, ICreateArticleDto} from "@entities/interfaces";
import {TArticleTagsCreation} from "@entities/types";
import {TagModel} from "@components/tags/models";
import {Op, Transaction} from 'sequelize';
import logger from "@libs/logger";
import articleCreatedHandler from "@libs/kafka/producers/articles/articleCreatedHandler";
import sequelize from "@libs/sequelize";

const CreateArticleService = async (
    createData: ICreateArticleDto,
): Promise<void> => {
    logger.info("CreateArticleService");
    const { title, content, tags } = createData;

    const tagsFound = await TagModel.findAll({
        where: {
            id: {
                [Op.in]: tags,
            },
        },
    })

    if (tagsFound.length < tags.length) {
        throw new BadRequestError({
            code: "bad_request_error",
            text: "Некорректные tag id"
        })
    }

    await sequelize.transaction(async (transaction: Transaction): Promise<void> => {
        const [article, created] = await ArticleModel.findOrCreate({
            where: { title },
            defaults: {
                title,
                content,
            },
            raw: true,
            transaction
        });

        if (!created) {
            throw new ConflictError({
                code: 'conflict_error',
                text: 'Статья с таким title уже существует',
            });
        }

        const articleTagsIds = tags.map(tag => ({articleId: article.id, tagId: tag}))

        await ArticleTagModel.bulkCreate(articleTagsIds as TArticleTagsCreation[], { ignoreDuplicates: true, transaction});

        const articleTagsNames = tagsFound.map(tag => tag.label)

        await articleCreatedHandler({
            id: article.id,
            title,
            content,
            tags: articleTagsNames,
            publishedAt: article.publishedAt,
            updatedAt: article.updatedAt
        } as IArticleCreatedEvent);
    })
};

export default CreateArticleService;