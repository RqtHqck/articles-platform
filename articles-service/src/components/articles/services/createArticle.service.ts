import { ConflictError, BadRequestError } from '@errors/index';
import {ArticleModel, ArticleTagModel} from '@components/articles/models';

import {IArticleCreatedEvent, ICreateArticleDto} from "@entities/interfaces";
import {TArticleTagsCreation} from "@entities/types";
import {TagModel} from "@components/tags/models";
import { Op } from 'sequelize';
import logger from "@libs/logger";
import articleCreatedEvent from "@libs/kafka/producers/articleCreated";

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

    const articleTagsIds = tags.map(tag => ({articleId: article.id, tagId: tag}))
    
    await ArticleTagModel.bulkCreate(articleTagsIds as TArticleTagsCreation[], { ignoreDuplicates: true })

    const articleTagsNames = tagsFound.map(tag => tag.label)

    await articleCreatedEvent({id: article.id, title: article.title, content: article.content, tags: articleTagsNames} as IArticleCreatedEvent);
};

export default CreateArticleService;