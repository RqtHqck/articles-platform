import esClient from "@libs/elasticsearch/elasticsearch";
import logger from "@libs/logger";

export default async function deleteFromArticleIndexService({ id }: { id: number }): Promise<void> {
    try {
        logger.info(`deleteFromArticleIndex: articleId: ${JSON.stringify(id)}`);

        const result = await esClient.delete(
            {
                index: process.env.ELASTIC_ARTICLES_INDEX!,
                id: String(id),
                refresh: true
            }
        );

        logger.info(`Article deleted from index ${process.env.ELASTIC_ARTICLES_INDEX}: `, result);
    } catch (err) {
        logger.error(err);
        throw err;
    }
}