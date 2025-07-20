import {addToArticleIndexService, updateArticleIndexService, deleteFromArticleIndexService} from "@components/search/services";
import kafka from "@libs/kafka/kafka";
import logger from "@libs/logger";
import {retry} from "@helpers/retry";
const ARTICLE_CREATED_TOPIC= process.env.KAFKA_ARTICLE_CREATED_TOPIC!
const ARTICLE_UPDATED_TOPIC = process.env.KAFKA_ARTICLE_DELETED_TOPIC!
const ARTICLE_DELETED_TOPIC = process.env.KAFKA_ARTICLE_UPDATED_TOPIC!

export default async function startKafkaConsumers(): Promise<any> {
    try {
        await kafka.subscribe({ topics: [ARTICLE_CREATED_TOPIC, ARTICLE_UPDATED_TOPIC, ARTICLE_DELETED_TOPIC], fromBeginning: true });

        await retry(async () => {
            await kafka.consume({
                [ARTICLE_CREATED_TOPIC]: addToArticleIndexService,
                [ARTICLE_UPDATED_TOPIC]: updateArticleIndexService,
                [ARTICLE_DELETED_TOPIC]: deleteFromArticleIndexService,
            });
        }, 5, 2500)
    } catch (err) {
        logger.error('Ошибка при запуске Kafka consumers:', err);
        process.exit(1);
    }
}