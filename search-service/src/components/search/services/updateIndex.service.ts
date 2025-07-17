import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";
import config from "config";
import {IArticleUpdatedEvent} from "@entities/interfaces";

export default async function updateIndexService(articleDto: IArticleUpdatedEvent): Promise<void> {
    try {
        logger.info(`deleteFromArticleIndex: articleId: ${JSON.stringify(articleDto.id)}`);

        const result = await esClient.update(
            {
                index: config.get<string>('ELASTICSEARCH.ARTICLES_INDEX'),
                id: String(articleDto.id),
                doc: articleDto,
                refresh: true,
                doc_as_upsert: true
            }
        );

        logger.info(`Article updated in index ${config.get<string>('ELASTICSEARCH.ARTICLES_INDEX')}:`, result);
    } catch (err) {
        logger.error(err);
        throw err;
    }
}