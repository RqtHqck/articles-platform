import config from "config";
import kafka from "@libs/kafka/kafka"
import logger from "@libs/logger";
import addToArticleIndex from "@components/search/services/addToIndex";


export default async function consumeArticleCreatedEvent(): Promise<void> {
    try {
        logger.info("consumeArticleCreatedEvent...")
        await kafka.consume(config.get<string>("KAFKA.ARTICLE_CREATED_TOPIC"), addToArticleIndex);
    } catch (err) {
        logger.info('Consumer failed', err);
    }
};
