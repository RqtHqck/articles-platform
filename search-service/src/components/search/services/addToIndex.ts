import {IArticle} from "@entities/interfaces";
import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";
import config from "config";

export default async function addToArticleIndex(articleDto: IArticle) {
    try {
        logger.info(`addToArticleIndex: article: ${JSON.stringify(articleDto)}`);

        const result = await esClient.index({
            index: config.get<string>('ELASTICSEARCH.ARTICLES_INDEX'),
            document: articleDto,
            refresh: 'wait_for', // for using in search as it will add
        });

        logger.info('Article added:', result);
    } catch (err) {
        logger.error(err);
        throw err;
    }

}