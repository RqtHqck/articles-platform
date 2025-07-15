import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";
import config from "config";

export default async function deleteFromArticleIndex({ id }: { id: number }): Promise<void> {
    try {
        logger.info(`deleteFromArticleIndex: articleId: ${JSON.stringify(id)}`);

        const result = await esClient.delete(
            {
                index: config.get<string>('ELASTICSEARCH.ARTICLES_INDEX'),
                id: String(id),
                refresh: true
            }
        );

        logger.info(`Article deleted from index ${config.get<string>('ELASTICSEARCH.ARTICLES_INDEX')}:`, result);
    } catch (err) {
        logger.error(err);
        throw err;
    }
}