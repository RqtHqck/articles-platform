import { ConflictError, BadRequestError } from '@errors/index';
import {ArticleModel, ArticleTagModel} from '@components/articles/models';

import {ICreateArticleDto, ITag} from "@entities/interfaces";
import {TArticleTagsCreation, TTagCreation} from "@entities/types";
import {TagModel} from "@components/tags/models";
import { Op } from 'sequelize';
import logger from "@libs/logger";

const CreateArticleService = async (
    updateData: ICreateArticleDto,
): Promise<void> => {
    logger.info("CreateArticleService");
    const { title, content, tags } = updateData;

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

    const [article, created] = await ArticleModel.findOrCreate({
        where: { title },
        defaults: {
            title,
            content,
        },
        raw: true,
    });

    if (!created) {
        throw new ConflictError({
            code: 'conflict_error',
            text: 'Статья с таким title уже существует',
        });
    }

    const articleTags = tags.map(tag => ({articleId: article.id, tagId: tag}))
    
    await ArticleTagModel.bulkCreate(articleTags as TArticleTagsCreation[], { ignoreDuplicates: true })


};

export default CreateArticleService;