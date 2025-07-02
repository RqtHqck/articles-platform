import { ConflictError } from '@errors/index';
import {Article, ArticleTag} from '@components/articles/models';

import {ICreateArticleDto, ITag} from "@entities/interfaces";
import {TArticleTagsCreation, TTagCreation} from "@entities/types";
import {Tag} from "@components/tags/models";
import { Op } from 'sequelize';
import BadRequestError from "@errors/BadRequestError";
import logger from "@libs/logger";

const CreateArticleService = async (
    updateData: ICreateArticleDto,
): Promise<void> => {
    logger.info("CreateArticleService");
    const { title, content, tags } = updateData;

    const tagsFound = await Tag.findAll({
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

    const [article, created] = await Article.findOrCreate({
        where: { title },
        defaults: {
            title,
            content,
        },
        raw: true,
    });

    const articleTags = tags.map(tag => ({articleId: article.id, tagId: tag}))
    await ArticleTag.bulkCreate(articleTags as TArticleTagsCreation[], { ignoreDuplicates: true })

    if (!created) {
        throw new ConflictError({
            code: 'conflict_error',
            text: 'Статья с таким title уже существует',
        });
    }
};

export default CreateArticleService;