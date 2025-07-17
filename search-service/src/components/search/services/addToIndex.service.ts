import {IArticleCreatedEvent} from "@entities/interfaces";
import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";
import config from "config";

export default async function addToArticleIndexService(articleDto: IArticleCreatedEvent): Promise<void> {
    try {
        logger.info(`addToArticleIndex: article: ${JSON.stringify(articleDto)}`);

        const result = await esClient.index({
            index: config.get<string>('ELASTICSEARCH.ARTICLES_INDEX'),
            id: String(articleDto.id), // Use db id for docs elasticsearch
            document: articleDto,
            refresh: true, // refresh as completed
        });

        logger.info(`Article added to index ${config.get<string>('ELASTICSEARCH.ARTICLES_INDEX')}: `, JSON.stringify(result));
    } catch (err) {
        logger.error(err);
        throw err;
    }
}