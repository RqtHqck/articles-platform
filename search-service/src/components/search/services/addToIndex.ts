import {IArticle} from "@entities/interfaces";
import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";
import config from "config";

export default async function addToArticleIndex(articleDto: IArticle) {
    logger.info(`addToArticleIndex: article: ${JSON.stringify(articleDto)}`);

    const result = await esClient.index({
        index: config.get<string>('ELASTICSEARCH.ARTICLES_INDEX'),
        document: articleDto,
    });

    logger.info('Article added:', result);
}