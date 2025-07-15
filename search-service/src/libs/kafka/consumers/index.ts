import {addToArticleIndex, updateIndex, deleteFromArticleIndex} from "@components/search/services";

import kafka from "@libs/kafka/kafka";
import config from "config";
import {retry} from "@helpers/retry";
import logger from "@libs/logger";
const articleCreatedTopic = config.get<string>("KAFKA.ARTICLE_CREATED_TOPIC");
const articleUpdatedTopic = config.get<string>("KAFKA.ARTICLE_UPDATED_TOPIC");
const articleDeletedTopic = config.get<string>("KAFKA.ARTICLE_DELETED_TOPIC");

export default async function startKafkaConsumers(): Promise<any> {
    try {
        await kafka.subscribe({ topics: [articleCreatedTopic, articleUpdatedTopic, articleDeletedTopic], fromBeginning: true });

        await retry(async () => {
            await kafka.consume({
                [articleCreatedTopic]: addToArticleIndex,
                [articleUpdatedTopic]: updateIndex,
                [articleDeletedTopic]: deleteFromArticleIndex,
            });
        }, 5, 2500)
    } catch (err) {
        logger.error('Ошибка при запуске Kafka consumers:', err);
        process.exit(1);
    }
}